import threading
import asyncio
import sys
import signal
import os
from pathlib import Path

from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
import uvicorn

from mitmproxy import options
from mitmproxy.tools.dump import DumpMaster

from addons.addon import LoggerAddon  # Your custom addon
from routes.interceptors import interceptor_routers  # Your routes


app = FastAPI()
app.include_router(interceptor_routers)

# Allow CORS from everywhere
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Connected websocket clients set
connected_clients: set[WebSocket] = set()


@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    connected_clients.add(websocket)
    print(f"[WS] Client connected. Total clients: {len(connected_clients)}")
    try:
        while True:
            # Keep the connection open, ignoring incoming messages
            await websocket.receive_text()
    except WebSocketDisconnect:
        connected_clients.remove(websocket)
        print(f"[WS] Client disconnected. Total clients: {len(connected_clients)}")


async def broadcast_to_clients(message: str):
    """Broadcast message to all connected websocket clients."""
    dead_clients = set()
    for client in connected_clients:
        try:
            await client.send_text(message)
        except Exception:
            dead_clients.add(client)
    for client in dead_clients:
        connected_clients.remove(client)


def run_ws_server():
    """Run the FastAPI (uvicorn) server."""
    uvicorn.run(app, host="0.0.0.0", port=8000, log_level="info")


def kill_process():
    """Forcefully shutdown the current process."""
    os.kill(os.getpid(), signal.SIGINT)


def stdin_loop():
    """Listen for commands from stdin."""
    print("[sidecar] Waiting for commands...", flush=True)
    while True:
        user_input = sys.stdin.readline().strip()
        if user_input == "sidecar shutdown":
            print("[sidecar] Received 'sidecar shutdown' command.", flush=True)
            kill_process()
        else:
            print(f"[sidecar] Invalid command [{user_input}]. Try again.", flush=True)


async def run_mitmproxy():
    """Configure and run mitmproxy with DumpMaster."""
    appdata_local = Path(os.getenv('LOCALAPPDATA'))
    mitm_config_dir = appdata_local / "com.xscept.app" / "mitm"
    mitm_config_dir.mkdir(parents=True, exist_ok=True)

    opts = options.Options(
        listen_host="127.0.0.1",
        listen_port=8080,
        confdir=str(mitm_config_dir)
    )

    m = DumpMaster(opts)
    m.addons.add(LoggerAddon(ws_broadcast=broadcast_to_clients))

    try:
        await m.run()
    except KeyboardInterrupt:
        print("Shutting down mitmproxy...")
        await m.shutdown()


def start_input_thread():
    """Start thread to handle stdin commands."""
    try:
        input_thread = threading.Thread(target=stdin_loop, daemon=True)
        input_thread.start()
    except Exception:
        print("[sidecar] Failed to start input handler.", flush=True)


if __name__ == "__main__":
    start_input_thread()

    # Start FastAPI server in background thread
    ws_thread = threading.Thread(target=run_ws_server, daemon=True)
    ws_thread.start()

    # Run mitmproxy in asyncio event loop (main thread)
    asyncio.run(run_mitmproxy())
