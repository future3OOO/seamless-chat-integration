import subprocess
import os
import sys
import shutil

def check_npm():
    print("Checking if npm is installed...")
    try:
        result = subprocess.run(["npm", "--version"], capture_output=True, text=True)
        print(f"npm version: {result.stdout.strip()}")
        return True
    except (subprocess.CalledProcessError, FileNotFoundError):
        print("npm is not installed or not in the system PATH.")
        return False

def install_dependencies():
    print("Checking Python dependencies...")
    try:
        import flask
        import flask_cors
        import selenium
        print("Flask, Flask-CORS, and Selenium are already installed.")
    except ImportError:
        print("Installing missing Python dependencies...")
        subprocess.check_call([sys.executable, "-m", "pip", "install", "flask", "flask-cors", "selenium"])
    
    if not check_npm():
        print("Error: npm is required to build the React app.")
        print("Please install Node.js and npm, then add them to your system PATH.")
        print("You can download Node.js from: https://nodejs.org/")
        sys.exit(1)
    
    print("Checking Node.js dependencies...")
    if not os.path.exists('node_modules'):
        print("Installing Node.js dependencies...")
        subprocess.check_call(["npm", "install"])
    else:
        print("Node.js dependencies already installed.")
    return True

def build_react_app():
    print("Building React app...")
    try:
        subprocess.check_call(["npm", "run", "build"])
        print("React app built successfully.")
        return True
    except subprocess.CalledProcessError:
        print("Error: Failed to build React app. Please check your package.json for the correct build script.")
        return False

def run_flask_server():
    print("Starting Flask server...")
    subprocess.check_call([sys.executable, "app.py"])

if __name__ == "__main__":
    install_dependencies()
    if not build_react_app():
        print("Error: Failed to build the React app. Exiting.")
        sys.exit(1)
    run_flask_server()
