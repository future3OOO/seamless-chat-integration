from flask import Flask, request, jsonify, send_from_directory, render_template
from flask_cors import CORS
import subprocess
import os
import logging

# Configure logging
logging.basicConfig(level=logging.DEBUG, format='%(asctime)s - %(levelname)s - %(message)s')

app = Flask(__name__, static_folder='build', static_url_path='')
CORS(app)  # Enable CORS for all routes

# Set the upload folder path
UPLOAD_FOLDER = 'uploads'
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def serve(path):
    logging.debug(f"Received request for path: {path}")
    if path == 'tapi.html' or path == '':
        logging.debug("Rendering tapi.html template")
        return render_template('tapi.html')
    elif path != "" and os.path.exists(app.static_folder + '/' + path):
        logging.debug(f"Serving file from static folder: {path}")
        return send_from_directory(app.static_folder, path)
    else:
        logging.debug("Path not found, returning 404")
        return "Not Found", 404

@app.route('/submit', methods=['POST'])
def submit():
    logging.debug("Received POST request to /submit")
    try:
        # Get form data
        full_name = request.form['full_name']
        address = request.form['address']
        email = request.form['email']
        issue = request.form['issue']
        
        # Handle file upload
        image_file = request.files.get('image')
        image_path = None
        if image_file:
            image_path = os.path.join(app.config['UPLOAD_FOLDER'], image_file.filename)
            image_file.save(image_path)
            image_path = os.path.abspath(image_path)  # Convert to absolute path
            logging.debug(f"Image file saved at: {image_path}")
        
        # Log the received data (for debugging)
        logging.debug(f"Received form data: {full_name}, {address}, {email}, {issue}")
        
        # Prepare the command to run the Selenium script
        command = ['python', 'selenium_script.py', full_name, address, email, issue]
        if image_path:
            command.append(image_path)
        
        logging.debug(f"Executing command: {' '.join(command)}")
        
        # Run the Selenium script
        result = subprocess.run(command, capture_output=True, text=True)
        
        # Check if the script ran successfully
        if result.returncode == 0:
            logging.debug("Selenium script executed successfully")
            return jsonify({"message": "Form submitted successfully!", "script_output": result.stdout}), 200
        else:
            logging.error(f"Selenium script failed with error: {result.stderr}")
            return jsonify({"error": "Selenium script failed", "script_error": result.stderr}), 500

    except Exception as e:
        logging.exception("An error occurred while processing the form submission")
        return jsonify({"error": str(e)}), 400

if __name__ == '__main__':
    # Create the upload folder if it doesn't exist
    if not os.path.exists(UPLOAD_FOLDER):
        os.makedirs(UPLOAD_FOLDER)
    
    logging.info("Starting Flask server on port 8000")
    app.run(debug=True, host='0.0.0.0', port=8000)
