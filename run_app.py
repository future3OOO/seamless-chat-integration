import subprocess
import os
import sys
import shutil

def check_npm():
    try:
        subprocess.run(["npm", "--version"], check=True, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
        return True
    except (subprocess.CalledProcessError, FileNotFoundError):
        return False

def install_dependencies():
    print("Checking Python dependencies...")
    try:
        import flask
        import flask_cors
        import selenium
    except ImportError:
        print("Installing missing Python dependencies...")
        subprocess.check_call([sys.executable, "-m", "pip", "install", "flask", "flask-cors", "selenium"])
    
    if not check_npm():
        print("Error: npm is not installed or not in the system PATH.")
        print("Please install Node.js and npm, then add them to your system PATH.")
        print("You can download Node.js from: https://nodejs.org/")
        sys.exit(1)
    
    print("Checking Node.js dependencies...")
    if not os.path.exists('node_modules'):
        print("Installing Node.js dependencies...")
        subprocess.check_call(["npm", "install"])
    else:
        print("Node.js dependencies already installed.")

def build_react_app():
    print("Building React app...")
    try:
        subprocess.check_call(["npm", "run", "build"])
    except subprocess.CalledProcessError:
        print("Error: Failed to build React app. Please check your package.json for the correct build script.")
        sys.exit(1)

def run_flask_server():
    print("Starting Flask server...")
    subprocess.check_call([sys.executable, "app.py"])

if __name__ == "__main__":
    install_dependencies()
    build_react_app()
    run_flask_server()
