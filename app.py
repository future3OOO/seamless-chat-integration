
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
    elif path.startswith('src/'):
        # Serve files from the src directory
        return send_from_directory(current_dir, path)
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
        image = request.files.get('image')
        
        # Log the received data (for debugging)
        logging.debug(f"Processed form data: {full_name}, {address}, {email}, {issue}")
        if image:
            logging.debug(f"Image received: {image.filename}")
        
        # Save the image if it exists
        image_path = None
        if image:
            image_path = os.path.join(app.config['UPLOAD_FOLDER'], image.filename)
            image.save(image_path)
        
        # Prepare the command to run the Selenium script
        command = ['python', 'selenium_script.py', full_name, address, email, issue]
        if image_path:
            command.append(image_path)
        
        logging.debug(f"Executing command: {' '.join(command)}")
        
        # Run the Selenium script asynchronously
        subprocess.Popen(command, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
        
        logging.debug("Selenium script started asynchronously")
        return jsonify({"message": "Form submitted successfully! Selenium script is now processing."}), 200

    except Exception as e:
        logging.exception("An error occurred while processing the form submission")
        return jsonify({"error": str(e)}), 400

@app.route('/submit', methods=['OPTIONS'])
def handle_options():
    response = app.make_default_options_response()
    response.headers['Access-Control-Allow-Methods'] = 'POST'
    response.headers['Access-Control-Allow-Headers'] = 'Content-Type'
    return response

if __name__ == '__main__':
    # Create necessary folders
    for folder in [UPLOAD_FOLDER, os.path.join(current_dir, 'templates'), os.path.join(current_dir, 'build')]:
        if not os.path.exists(folder):
            os.makedirs(folder)
            logging.info(f"Created folder: {folder}")
    
    # Move tapi.html to templates folder if needed
    tapi_html_src = os.path.join(current_dir, 'tapi.html')
    tapi_html_dest = os.path.join(current_dir, 'templates', 'tapi.html')
    if os.path.exists(tapi_html_src) and not os.path.exists(tapi_html_dest):
        os.rename(tapi_html_src, tapi_html_dest)
        logging.info("Moved tapi.html to templates folder")
    
    # Copy index.html to the build folder if needed
    index_html_src = os.path.join(current_dir, 'index.html')
    index_html_dest = os.path.join(current_dir, 'build', 'index.html')
    if os.path.exists(index_html_src) and not os.path.exists(index_html_dest):
        import shutil
        shutil.copy2(index_html_src, index_html_dest)
        logging.info("Copied index.html to the build folder")
    
    # Copy favicon.ico to the build folder if needed
    favicon_src = os.path.join(current_dir, 'public', 'favicon.ico')
    favicon_dest = os.path.join(current_dir, 'build', 'favicon.ico')
    if os.path.exists(favicon_src) and not os.path.exists(favicon_dest):
        import shutil
        shutil.copy2(favicon_src, favicon_dest)
        logging.info("Copied favicon.ico to the build folder")
    
    port = 5000
    host = '0.0.0.0'  # Changed from 'localhost' to '0.0.0.0' to allow external access
    logging.info(f"Starting Flask server on {host}:{port}")
    logging.info(f"Access the React app at: http://localhost:{port}")
    logging.info(f"Access the tapi.html page at: http://localhost:{port}/tapi.html")
    app.run(debug=True, host=host, port=port)
