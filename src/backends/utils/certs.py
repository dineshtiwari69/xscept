from cryptography import x509
from cryptography.hazmat.backends import default_backend
from cryptography.hazmat.primitives import hashes, serialization
import base64
from pathlib import Path
import os

def get_mitm_certificate_path() -> Path:
    """
    Returns the path to the mitmproxy CA certificate
    stored in the default appdata config directory.
    """
    appdata_local = Path(os.getenv('LOCALAPPDATA'))
    mitm_config_dir = appdata_local / "com.xscept.app" / "mitm"
    pem_path = mitm_config_dir / "mitmproxy-ca-cert.pem"

    # Optionally, check if file exists, raise error if not
    if not pem_path.is_file():
        raise FileNotFoundError(f"MITM proxy certificate not found at {pem_path}")

    return pem_path


def get_mitm_certificate():
    
    pem_path = get_mitm_certificate_path()
    with open(pem_path, 'r') as f:
        cert_pem = f.read() 
    return cert_pem
    


def generate_spki_fingerprint(pem_path: str) -> str:
    """
    Generate the base64-encoded SHA256 SPKI fingerprint from a PEM certificate.
    """
    with open(pem_path, 'r') as f:
        cert_pem = f.read()

    cert = x509.load_pem_x509_certificate(cert_pem.encode(), default_backend())

    spki_der = cert.public_key().public_bytes(
        encoding=serialization.Encoding.DER,
        format=serialization.PublicFormat.SubjectPublicKeyInfo
    )

    digest = hashes.Hash(hashes.SHA256(), backend=default_backend())
    digest.update(spki_der)
    spki_hash = digest.finalize()

    spki_b64 = base64.b64encode(spki_hash).decode('ascii')
    return spki_b64
