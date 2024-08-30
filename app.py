from flask import Flask, request, jsonify, send_from_directory, render_template
from flask_cors import CORS
import subprocess
import os
import logging

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
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def serve(path):
    logging.debug(f"Received request for path: {path}")
    if path == 'tapi.html':
        logging.debug("Rendering tapi.html template")
        return render_template('tapi.html')
    elif os.path.exists(os.path.join(app.static_folder, path)):
        logging.debug(f"Serving file from static folder: {path}")
        return send_from_directory(app.static_folder, path)
    else:
        logging.debug(f"Serving index.html for path: {path}")
        return send_from_directory(app.static_folder, 'index.html')

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
    
    # Create the templates folder if it doesn't exist
    templates_folder = os.path.join(current_dir, 'templates')
    if not os.path.exists(templates_folder):
        os.makedirs(templates_folder)
    
    # Move tapi.html to templates folder if it's not already there
    tapi_html_src = os.path.join(current_dir, 'tapi.html')
    tapi_html_dest = os.path.join(templates_folder, 'tapi.html')
    if os.path.exists(tapi_html_src) and not os.path.exists(tapi_html_dest):
        os.rename(tapi_html_src, tapi_html_dest)
    
    port = 8000
    host = 'localhost'
    logging.info(f"Starting Flask server on {host}:{port}")
    logging.info(f"Access the React app at: http://{host}:{port}")
    logging.info(f"Access the tapi.html page at: http://{host}:{port}/tapi.html")
    app.run(debug=True, host=host, port=port)
