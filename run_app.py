import subprocess
import os
import sys
import shutil

def check_npm():
    print("Checking if npm is installed...")
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
        print("Warning: npm is not installed or not in the system PATH.")
        print("The React app will not be built, but you can still run the Flask server.")
        print("To fully set up the project, please install Node.js and npm:")
        print("1. Download Node.js from: https://nodejs.org/")
        print("2. Install Node.js and ensure npm is included.")
        print("3. Add Node.js and npm to your system PATH.")
        print("4. Restart your terminal and run this script again.")
        return False
    
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
    except subprocess.CalledProcessError:
        print("Error: Failed to build React app. Please check your package.json for the correct build script.")
        return False
    return True

def run_flask_server():
    print("Starting Flask server...")
    subprocess.check_call([sys.executable, "app.py"])

if __name__ == "__main__":
    npm_available = install_dependencies()
    if npm_available:
        react_built = build_react_app()
    else:
        react_built = False
    
    if not react_built:
        print("\nWarning: The React app was not built.")
        print("You can still run the Flask server, but the React frontend may not be available.")
        print("To access the Tapi Bot Test page, go to: http://localhost:8000/tapi.html")
        user_input = input("Do you want to continue and run the Flask server? (y/n): ")
        if user_input.lower() != 'y':
            print("Exiting the script. Please install Node.js and npm, then run this script again.")
            sys.exit(0)
    
    run_flask_server()
