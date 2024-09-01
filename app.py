import os
import uuid
import logging
from datetime import datetime
from flask import Flask, request, jsonify, send_from_directory, render_template
from flask_cors import CORS
from werkzeug.utils import secure_filename
import stat

# Configure logging
logging.basicConfig(
    filename='app.log',
    level=logging.DEBUG,
    format='%(asctime)s - %(levelname)s - %(message)s'
)

app = Flask(__name__, static_folder='build', static_url_path='')
CORS(app)

UPLOAD_FOLDER = 'uploads'
if not os.path.exists(UPLOAD_FOLDER):
    try:
        os.makedirs(UPLOAD_FOLDER)
        logging.info(f"Created uploads folder: {UPLOAD_FOLDER}")
    except Exception as e:
        logging.error(f"Failed to create uploads folder: {e}")

# Set permissions for the uploads folder
try:
    os.chmod(UPLOAD_FOLDER, stat.S_IRWXU | stat.S_IRWXG | stat.S_IROTH | stat.S_IXOTH)
    logging.info(f"Set permissions for uploads folder: {UPLOAD_FOLDER}")
except Exception as e:
    logging.error(f"Failed to set permissions for uploads folder: {e}")

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
        logging.debug(f"Received POST request to /submit")
        logging.debug(f"Request form data: {request.form}")
        logging.debug(f"Request files: {request.files}")

        full_name = request.form.get('full_name')
        address = request.form.get('address')
        email = request.form.get('email')
        issue = request.form.get('issue')
        
        logging.debug(f"Processed form data: {full_name}, {address}, {email}, {issue}")
        
        # Handle multiple image files
        uploaded_files = request.files.getlist("images[]")
        logging.debug(f"Number of files received: {len(uploaded_files)}")
        
        file_paths = []
        
        for file in uploaded_files:
            if file and file.filename:
                logging.debug(f"Processing file: {file.filename}")
                # Generate a unique filename
                original_filename = secure_filename(file.filename)
                unique_filename = f"{uuid.uuid4().hex}_{datetime.now().strftime('%Y%m%d%H%M%S')}_{original_filename}"
                file_path = os.path.join(app.config['UPLOAD_FOLDER'], unique_filename)
                
                try:
                    file.save(file_path)
                    if os.path.exists(file_path):
                        file_size = os.path.getsize(file_path)
                        file_paths.append(file_path)
                        logging.info(f"File saved successfully: {file_path}, Size: {file_size} bytes")
                    else:
                        logging.error(f"File not found after save attempt: {file_path}")
                except Exception as e:
                    logging.error(f"Error saving file {unique_filename}: {str(e)}")
        
        if not file_paths:
            logging.warning("No files were successfully uploaded and saved.")
        
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

@app.route('/test-upload', methods=['GET', 'POST'])
def test_upload():
    if request.method == 'POST':
        if 'file' not in request.files:
            return 'No file part', 400
        file = request.files['file']
        if file.filename == '':
            return 'No selected file', 400
        if file:
            filename = secure_filename(file.filename)
            file_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
            try:
                file.save(file_path)
                return f'File uploaded successfully to {file_path}', 200
            except Exception as e:
                return f'Error saving file: {str(e)}', 500
    return '''
    <!doctype html>
    <title>Upload new File</title>
    <h1>Upload new File</h1>
    <form method=post enctype=multipart/form-data>
      <input type=file name=file>
      <input type=submit value=Upload>
    </form>
    '''

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)