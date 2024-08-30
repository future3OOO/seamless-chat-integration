import subprocess
import os
import sys
import shutil

# Define the full paths to npm and node executables
NPM_PATH = r"C:\Program Files\nodejs\npm.cmd"
NODE_PATH = r"C:\Program Files\nodejs\node.exe"

def check_npm():
    print("Checking if npm is installed...")
    try:
        result = subprocess.run([NPM_PATH, "--version"], capture_output=True, text=True)
        npm_version = result.stdout.strip()
        print(f"npm version: {npm_version}")
        return True
    except (subprocess.CalledProcessError, FileNotFoundError) as e:
        print(f"Error checking npm: {e}")
        print(f"npm is not found at {NPM_PATH}")
        return False

def check_node():
    print("Checking if Node.js is installed...")
    try:
        result = subprocess.run([NODE_PATH, "--version"], capture_output=True, text=True)
        node_version = result.stdout.strip()
        print(f"Node.js version: {node_version}")
        return True
    except (subprocess.CalledProcessError, FileNotFoundError) as e:
        print(f"Error checking Node.js: {e}")
        print(f"Node.js is not found at {NODE_PATH}")
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
    
    if not check_npm() or not check_node():
        print("Error: Both npm and Node.js are required to build the React app.")
        print("Please ensure both are installed and the paths in this script are correct.")
        print("Current paths:")
        print(f"npm: {NPM_PATH}")
        print(f"node: {NODE_PATH}")
        sys.exit(1)
    
    print("Checking Node.js dependencies...")
    if not os.path.exists('node_modules'):
        print("Installing Node.js dependencies...")
        try:
            subprocess.check_call([NPM_PATH, "install"])
        except subprocess.CalledProcessError as e:
            print(f"Error installing Node.js dependencies: {e}")
            sys.exit(1)
    else:
        print("Node.js dependencies already installed.")
    return True

def build_react_app():
    print("Building React app...")
    try:
        subprocess.check_call([NPM_PATH, "run", "build"])
        print("React app built successfully.")
        return True
    except subprocess.CalledProcessError as e:
        print(f"Error: Failed to build React app. Error: {e}")
        print("Please check your package.json for the correct build script.")
        return False

def run_flask_server():
    print("Starting Flask server...")
    try:
        subprocess.check_call([sys.executable, "app.py"])
    except subprocess.CalledProcessError as e:
        print(f"Error starting Flask server: {e}")
        sys.exit(1)

if __name__ == "__main__":
    install_dependencies()
    if not build_react_app():
        print("Error: Failed to build the React app. Exiting.")
        sys.exit(1)
    run_flask_server()
