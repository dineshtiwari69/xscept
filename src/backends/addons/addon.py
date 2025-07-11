from mitmproxy import http
import logging
import asyncio
import json
from tinydb import TinyDB
import os
from pathlib import Path
from utils.paths import APP_DATA_PATH
logging.basicConfig(level=logging.INFO, format='[%(asctime)s] %(message)s')

class LoggerAddon:
    def __init__(self, ws_broadcast):
        self.ws_broadcast = ws_broadcast

        # Build path: %LOCALAPPDATA%\com.xscept.app\logs
        appdata_local = APP_DATA_PATH
        log_dir = appdata_local / "com.xscept.app" / "logs"
        log_dir.mkdir(parents=True, exist_ok=True)  # Create dirs if not exist

        self.db_path = log_dir / "flows.json"
        self.db = TinyDB(self.db_path)
        
        self.db.truncate()

    def _store(self, data: dict):
        self.db.insert(data)

    def _broadcast(self, data: dict):
        json_str = json.dumps(data)
        logging.info(json_str)
        if self.ws_broadcast:
            asyncio.run_coroutine_threadsafe(
                self.ws_broadcast(json_str),
                asyncio.get_event_loop()
            )

    def request(self, flow: http.HTTPFlow):
        request_data = {
            "type": "request",
            "flow_id": flow.id,
            "method": flow.request.method,
            "url": flow.request.url,
            "headers": dict(flow.request.headers),
            "body": flow.request.get_text()
        }
        self._store(request_data)
        self._broadcast(request_data)

    def response(self, flow: http.HTTPFlow):
        response_data = {
            "type": "response",
            "flow_id": flow.id,
            "status_code": flow.response.status_code,
            "url": flow.request.url,
            "headers": dict(flow.response.headers),
            "body": flow.response.get_text()
        }
        
        #donot broadcast body to keep the request logs lightweight , we will query the body when user clicks detailed view
        
        response_data_to_broadcast = {
            "type": "response",
            "flow_id": flow.id,
            "status_code": flow.response.status_code,
            "url": flow.request.url,
            "headers": dict(flow.response.headers),
            "body": None
        }
        self._store(response_data)
        self._broadcast(response_data_to_broadcast)
