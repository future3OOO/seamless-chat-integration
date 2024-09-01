import os
from flask import Flask, request, jsonify, send_from_directory, render_template
from flask_cors import CORS
from werkzeug.utils import secure_filename
import logging
import uuid
from datetime import datetime

# Configure logging
logging.basicConfig(level=logging.DEBUG, format='%(asctime)s - %(levelname)s - %(message)s')

app = Flask(__name__, static_folder='build', static_url_path='')
CORS(app)

UPLOAD_FOLDER = 'uploads'
if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)
    logging.info(f"Created uploads folder: {UPLOAD_FOLDER}")

app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024  # 16 MB limit

@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def serve(path):
    if path == "tapi.html":
        return render_template('tapi.html')
    if path != "" and os.path.exists(app.static_folder + '/' + path):
        return send_from_directory(app.static_folder, path)
    else:
        return send_from_directory(app.static_folder, 'index.html')

@app.route('/submit', methods=['POST'])
def submit():
    try:
        full_name = request.form.get('full_name')
        address = request.form.get('address')
        email = request.form.get('email')
        issue = request.form.get('issue')
        
        logging.info(f"Received form data: full_name={full_name}, address={address}, email={email}, issue={issue}")
        
        # Handle multiple image files
        uploaded_files = request.files.getlist("images[]")
        file_paths = []
        
        for file in uploaded_files:
            if file:
                # Generate a unique filename
                original_filename = secure_filename(file.filename)
                unique_filename = f"{uuid.uuid4().hex}_{datetime.now().strftime('%Y%m%d%H%M%S')}_{original_filename}"
                file_path = os.path.join(app.config['UPLOAD_FOLDER'], unique_filename)
                
                try:
                    file.save(file_path)
                    if os.path.exists(file_path):
                        file_paths.append(file_path)
                        logging.info(f"File saved successfully: {file_path}")
                    else:
                        logging.error(f"File not found after save attempt: {file_path}")
                except Exception as e:
                    logging.error(f"Error saving file {unique_filename}: {str(e)}")
        
        if not file_paths:
            logging.warning("No files were successfully uploaded and saved.")
        
        # Log the form data and file paths
        logging.info(f"Processed form data: {full_name}, {address}, {email}, {issue}")
        logging.info(f"Saved files: {file_paths}")
        
        return jsonify({
            "message": "Form submitted successfully!",
            "files": file_paths,
            "form_data": {
                "full_name": full_name,
                "address": address,
                "email": email,
                "issue": issue
            }
        }), 200
    except Exception as e:
        logging.exception("An error occurred while processing the form submission")
        return jsonify({"error": str(e)}), 400

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)