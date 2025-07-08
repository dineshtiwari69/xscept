from fastapi import APIRouter, BackgroundTasks
from interceptors.chromium import run_fresh_chromium_profile
from utils.certs import generate_spki_fingerprint, get_mitm_certificate_path
from threading import Thread
interceptor_routers = APIRouter(tags=["Interceptor Routers"])


@interceptor_routers.get("/fresh-chromium")
def launch_chromium():
    pem_path = get_mitm_certificate_path()
    spki_fingerprint = generate_spki_fingerprint(pem_path)
    
    proxy_host = "localhost"
    proxy_port = 8080

    # Run the browser launch in the background (non-blocking)
    #background_tasks.add_task(run_fresh_chromium_profile, proxy_host, proxy_port, spki_fingerprint)
    
    thread = Thread(target=run_fresh_chromium_profile,args=( proxy_host, proxy_port, spki_fingerprint))
    thread.daemon= True
    thread.start()
    
    return {"message": "Chromium launched in background"}
