import os
from dotenv import load_dotenv

APP_ROOT = os.path.join(os.path.dirname(__file__))   # refers to application_top
dotenv_path = os.path.join(APP_ROOT, '.env')
load_dotenv(dotenv_path)

#test = os.environ.get('PATH')
url = os.environ['URL']

print(url)