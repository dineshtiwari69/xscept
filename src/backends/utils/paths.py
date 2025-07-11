from pathlib import Path
import os


APP_DATA_PATH = Path(os.getenv('LOCALAPPDATA'))

APP_DATA_PATH_XSCEPT = APP_DATA_PATH / "com.xscept.app"