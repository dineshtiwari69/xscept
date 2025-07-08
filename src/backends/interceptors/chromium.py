
"""
Author: Dinesh Tiwari (@dineshtiwari69)
Purpose:  
    This script demonstrates how to launch a Selenium Chrome WebDriver 
    configured to use a local HTTP proxy (e.g., mitmproxy) and automatically
    trust the proxy's CA certificate via its SPKI fingerprint, 
    preventing SSL certificate errors during HTTPS interception.

Requirements:
    - selenium
    - cryptography

Usage:
    1. Provide the path to your mitmproxy CA certificate in PEM format.
    2. Specify the proxy host and port.
    3. Run the script. Chrome will trust the proxy cert for HTTPS traffic.
"""


import time
from selenium import webdriver
from selenium.webdriver.chrome.options import Options



# Prevent garbage collection
active_drivers = []

def run_fresh_chromium_profile(proxy_host: str, proxy_port: int, spki_fingerprint: str):
    """
    Launch Chrome WebDriver with specified HTTP proxy and trust the given SPKI fingerprint.
    Keeps the browser open indefinitely.
    """
    chrome_options = Options()
    chrome_options.add_argument(f'--proxy-server={proxy_host}:{proxy_port}')
    chrome_options.add_argument(f'--ignore-certificate-errors-spki-list={spki_fingerprint}')
    chrome_options.add_argument('--no-sandbox')
    chrome_options.add_argument('--disable-dev-shm-usage')

    driver = webdriver.Chrome(options=chrome_options)
    active_drivers.append(driver)  # Prevent the driver from being garbage collected

   

    # Keep the browser session alive
    try:
        while True:
            time.sleep(60)
    except KeyboardInterrupt:
        driver.quit()