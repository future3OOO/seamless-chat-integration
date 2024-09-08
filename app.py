from flask import Flask, request, jsonify, send_from_directory, render_template
from flask_cors import CORS
import subprocess
import os
import logging
from PIL import Image  # Import Pillow for image manipulation
from urllib.parse import unquote
import sys
import io

# Ensure stdout and stderr are UTF-8 encoded to handle special characters
sys.stdout = io.TextIOWrapper(sys.stdout.detach(), encoding='utf-8')
sys.stderr = io.TextIOWrapper(sys.stderr.detach(), encoding='utf-8')

# Configure logging
logging.basicConfig(level=logging.DEBUG, format='%(asctime)s - %(levelname)s - %(message)s')

# Get the absolute path of the current directory
current_dir = os.path.dirname(os.path.abspath(__file__))

# Set up Flask app with explicit template and static folder paths
app = Flask(__name__,
            static_folder=os.path.join(current_dir, 'dist'),
            static_url_path='',
            template_folder=os.path.join(current_dir, 'templates'))
CORS(app)  # Enable CORS for all routes

# Set the upload folder path
UPLOAD_FOLDER = os.path.join(current_dir, 'uploads')
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

# Ensure the upload folder exists
if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)
    logging.info(f"Created upload folder: {UPLOAD_FOLDER}")

# Route to serve index.html at '/'
@app.route('/')
def serve_index():
    logging.debug("Serving index.html for root path")
    return send_from_directory(app.static_folder, 'index.html')

# Route to serve tapi.html at '/tapi.html'
@app.route('/tapi.html')
def serve_tapi():
    logging.debug("Rendering tapi.html template")
    return render_template('tapi.html')

# Route to serve static files
@app.route('/<path:path>')
def serve_static(path):
    logging.debug(f"Received request for path: {path}")
    if os.path.exists(os.path.join(app.static_folder, path)):
        logging.debug(f"Serving file from static folder: {path}")
        return send_from_directory(app.static_folder, path)
    else:
        logging.debug(f"Path not found: {path}")
        return "Not Found", 404

@app.route('/submit', methods=['POST'])
def submit():
    logging.debug("Received POST request to /submit")
    try:
        # Get form data and decode special characters
        full_name = unquote(request.form.get('full_name', ''))
        address = unquote(request.form.get('address', ''))
        email = unquote(request.form.get('email', ''))
        issue = unquote(request.form.get('issue', ''))
        images = request.files.getlist('images')  # Get multiple images

        # Log the received data (for debugging)
        logging.debug(f"Received form data: full_name={full_name}, address={address}, email={email}, issue={issue}")
        logging.debug(f"Number of images received: {len(images)}")

        # Save the images if they exist
        saved_image_paths = []
        for image in images:
            if image:
                image_path = os.path.join(app.config['UPLOAD_FOLDER'], image.filename)
                image.save(image_path)
                saved_image_paths.append(image_path)
                logging.debug(f"Image saved: {image_path}")

        # Combine images into a single file if more than one image is uploaded
        combined_image_path = None
        if len(saved_image_paths) > 1:
            combined_image_path = os.path.join(app.config['UPLOAD_FOLDER'], 'combined_image.jpg')
            combine_images(saved_image_paths, combined_image_path)
            logging.debug(f"Combined image saved: {combined_image_path}")
        elif len(saved_image_paths) == 1:
            combined_image_path = saved_image_paths[0]  # If only one image, no need to combine

        # Prepare the command to run the Selenium script
        command = ['python', 'selenium_script.py', full_name, address, email, issue]
        
        if combined_image_path:  # Only append the image path if an image was uploaded
            command.append(combined_image_path)
        
        logging.debug(f"Executing command: {' '.join(command)}")

        # Run the Selenium script asynchronously
        process = subprocess.Popen(command, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
        
        # Wait for the process to complete and handle the output
        stdout, stderr = process.communicate()
        if process.returncode != 0:
            logging.error(f"Selenium script failed: {stderr.decode('utf-8')}")
            return jsonify({"error": "Selenium script execution failed"}), 500

        logging.debug("Selenium script started successfully")
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

def combine_images(image_paths, output_path):
    """Combine two images into one."""
    images = [Image.open(img) for img in image_paths]

    # Get the total width and height for the new image
    total_width = max(img.width for img in images)
    total_height = sum(img.height for img in images)

    # Create a new blank image with the total size
    combined_image = Image.new('RGB', (total_width, total_height))

    # Paste each image into the new blank image
    y_offset = 0
    for img in images:
        combined_image.paste(img, (0, y_offset))
        y_offset += img.height

    # Save the combined image
    combined_image.save(output_path)

if __name__ == '__main__':
    # Ensure necessary folders exist
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
    
    port = 5000
    host = 'localhost'
    logging.info(f"Starting Flask server on {host}:{port}")
    logging.info(f"Access the React app at: http://{host}:{port}")
    logging.info(f"Access the tapi.html page at: http://{host}:{port}/tapi.html")
    app.run(debug=True, host=host, port=port)
