from flask import Flask, request, jsonify, send_from_directory, render_template
from flask_cors import CORS
import os
import logging
from werkzeug.utils import secure_filename
import subprocess

# Configure logging
logging.basicConfig(level=logging.DEBUG, format='%(asctime)s - %(levelname)s - %(message)s')

# Get the absolute path of the current directory
current_dir = os.path.dirname(os.path.abspath(__file__))

# Set up Flask app with explicit template and static folder paths
app = Flask(__name__, 
            static_folder=os.path.join(current_dir, 'build'),
            static_url_path='',
            template_folder=os.path.join(current_dir, 'templates'))
CORS(app)  # Enable CORS for all routes

# Set the upload folder path
UPLOAD_FOLDER = os.path.join(current_dir, 'uploads')

# Ensure the uploads folder exists
if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)
    logging.info(f"Created uploads folder: {UPLOAD_FOLDER}")
else:
    logging.info(f"Uploads folder already exists: {UPLOAD_FOLDER}")

app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

@app.route('/favicon.ico')
def favicon():
    return send_from_directory(os.path.join(app.root_path, 'build'),
                               'favicon.ico', mimetype='image/vnd.microsoft.icon')

@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def serve(path):
    logging.debug(f"Received request for path: {path}")
    if path == 'tapi.html':
        logging.debug("Rendering tapi.html template")
        return render_template('tapi.html')
    elif path == '':
        logging.debug("Serving index.html for root path")
        return send_from_directory(app.static_folder, 'index.html')
    elif os.path.exists(os.path.join(app.static_folder, path)):
        logging.debug(f"Serving file from static folder: {path}")
        return send_from_directory(app.static_folder, path)
    else:
        logging.debug(f"Path not found: {path}")
        return "Not Found", 404

@app.route('/submit', methods=['POST'])
def submit():
    logging.debug("Received POST request to /submit")
    try:
        # Get form data
        full_name = request.form.get('full_name')
        address = request.form.get('address')
        email = request.form.get('email')
        issue = request.form.get('issue')
        
        # Handle multiple image files
        image_files = request.files.getlist('images[]')
        
        logging.debug(f"Processed form data: {full_name}, {address}, {email}, {issue}")
        logging.debug(f"Number of images received: {len(image_files)}")
        
        # Save images
        image_paths = []
        for index, image_file in enumerate(image_files):
            if image_file:
                filename = secure_filename(f"image_{index}_{image_file.filename}")
                filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
                image_file.save(filepath)
                image_paths.append(filepath)
                logging.info(f"Saved image: {filepath}")
        
        # Prepare the command to run the Selenium script
        command = ['python', 'selenium_script.py', full_name, address, email, issue]
        if image_paths:
            command.extend(image_paths)
        
        logging.debug(f"Executing command: {' '.join(command)}")
        
        # Run the Selenium script asynchronously
        subprocess.Popen(command, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
        
        logging.debug("Selenium script started asynchronously")
        return jsonify({"message": "Form submitted successfully! Selenium script is now processing."}), 200

    except Exception as e:
        logging.exception("An error occurred while processing the form submission")
        return jsonify({"error": str(e)}), 400

if __name__ == '__main__':
    port = 5000
    host = '0.0.0.0'  # Changed from 'localhost' to '0.0.0.0' to allow external access
    logging.info(f"Starting Flask server on {host}:{port}")
    logging.info(f"Access the React app at: http://{host}:{port}")
    logging.info(f"Access the tapi.html page at: http://{host}:{port}/tapi.html")
    app.run(debug=True, host=host, port=port)