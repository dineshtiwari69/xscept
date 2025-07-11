from fastapi import APIRouter, BackgroundTasks
from interceptors.chromium import run_fresh_chromium_profile
from utils.certs import generate_spki_fingerprint, get_mitm_certificate_path
from threading import Thread
import browsers
from utils.certs import generate_spki_fingerprint,get_mitm_certificate_path
from utils.paths import APP_DATA_PATH_XSCEPT
import os,shutil
from fastapi import Request,Query
import time
interceptor_routers = APIRouter(tags=["Interceptor Routers"])



@interceptor_routers.get("/browsers")
def get_browsers(request:Request):
    seen_paths = set()
    unique_browsers = []
    
    for browser in browsers.browsers():
        if browser["path"] not in seen_paths:
            seen_paths.add(browser["path"])
            unique_browsers.append(browser)
    
    return unique_browsers


@interceptor_routers.get("/launch-fresh-chromium")
def launch_chromium_instance(request:Request,browser: str = Query(..., regex="^(chrome|msedge|brave)$")):
    running_browsers = request.app.state.runtime_state["browsers_running"]
   
    for browser_ in running_browsers:
        if browser_["name"] == browser:
            return {"status":200,"message":"Already Running"}
        
        
    proxy_host = "localhost"
    proxy_port = 8080

    cert_path = get_mitm_certificate_path()
    spki_fingerprint = generate_spki_fingerprint(cert_path)
    

    
    brower_type = browser
    
    browser_profile_path = APP_DATA_PATH_XSCEPT /  "profiles" / f"{brower_type}"
    
    if not os.path.exists(browser_profile_path):
        os.makedirs(browser_profile_path)
        
    
    
    default_args = ["--disable-restore-session-state",
                    "--disable-features=ChromeWhatsNewUI,SidePanelPinning",
                    "--disable-background-networking",
                    "--component-updater=url-source=http://disabled-chromium-update.localhost:0",
                    "--check-for-update-interval=31536000",
                    "--no-default-browser-check",
                    "--disable-popup-blocking",
                    "--disable-translate",
                    "--start-maximized",
                    "--disable-default-apps",
                    "--disable-sync",
                    "--enable-fixed-layout",
                    "--no-first-run",
                    "--noerrdialogs",
                    "--flag-switches-begin",
                    "--flag-switches-end",
  ]
    process = browsers.launch(brower_type,args=[f"--proxy-server=http://{proxy_host}:{proxy_port}",
        f'--ignore-certificate-errors-spki-list={spki_fingerprint}',      
     
        f'--user-data-dir={browser_profile_path}',
       ] + default_args
    )
    
    # Background thread to monitor and cleanup
    def monitor_and_cleanup(proc, profile_path):
        while proc.poll() is None:
            time.sleep(2)  # Check every 2 seconds
        print(f"Chrome exited (PID {proc.pid}). Cleaning up profile at {profile_path}...")
        try:
            shutil.rmtree(profile_path)
            print(f"Profile directory {profile_path} deleted.")
        except Exception as e:
            print(f"Failed to delete profile directory: {e}")
            
        request.app.state.runtime_state["browsers_running"] = [
            b for b in request.app.state.runtime_state["browsers_running"] if b["name"] != browser
        ]
        
        print("New State",request.app.state.runtime_state["browsers_running"])
            
        
        

    Thread(target=monitor_and_cleanup, args=(process, browser_profile_path), daemon=True).start()
    request.app.state.runtime_state["browsers_running"].append({
        "name":browser,
        "pid":process.pid,
    })
    request.app.state.runtime_state["child_processes"].append(process.pid)

    return {"status":200,"message":"ok"}
