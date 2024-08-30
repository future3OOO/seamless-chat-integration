import subprocess
import os
import sys

def install_dependencies():
    print("Checking Python dependencies...")
    try:
        import flask
        import flask_cors
        import selenium
    except ImportError:
        print("Installing missing Python dependencies...")
        subprocess.check_call([sys.executable, "-m", "pip", "install", "flask", "flask-cors", "selenium"])
    
    print("Checking Node.js dependencies...")
    if not os.path.exists('node_modules'):
        print("Installing Node.js dependencies...")
        subprocess.check_call(["npm", "install"])
    else:
        print("Node.js dependencies already installed.")

def build_react_app():
    print("Building React app...")
    subprocess.check_call(["npm", "run", "build"])

def run_flask_server():
    print("Starting Flask server...")
    subprocess.check_call([sys.executable, "app.py"])

if __name__ == "__main__":
    install_dependencies()
    build_react_app()
    run_flask_server()
