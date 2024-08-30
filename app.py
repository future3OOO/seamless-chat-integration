from flask import Flask, request, jsonify, send_from_directory, render_template
from flask_cors import CORS
import subprocess
import os

app = Flask(__name__, static_folder='build', static_url_path='')
CORS(app)  # Enable CORS for all routes

# Set the upload folder path
UPLOAD_FOLDER = 'uploads'
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def serve(path):
    if path == 'tapi.html':
        return render_template('tapi.html')
    elif path != "" and os.path.exists(app.static_folder + '/' + path):
        return send_from_directory(app.static_folder, path)
    else:
        return send_from_directory(app.static_folder, 'index.html')

@app.route('/submit', methods=['POST'])
def submit():
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
            print(f"Image file saved at: {image_path}")
        
        # Log the received data (for debugging)
        print(f"Received form data: {full_name}, {address}, {email}, {issue}")
        
        # Prepare the command to run the Selenium script
        command = ['python', 'selenium_script.py', full_name, address, email, issue]
        if image_path:
            command.append(image_path)
        
        # Run the Selenium script
        result = subprocess.run(command, capture_output=True, text=True)
        
        # Check if the script ran successfully
        if result.returncode == 0:
            return jsonify({"message": "Form submitted successfully!", "script_output": result.stdout}), 200
        else:
            return jsonify({"error": "Selenium script failed", "script_error": result.stderr}), 500

    except Exception as e:
        return jsonify({"error": str(e)}), 400

if __name__ == '__main__':
    # Create the upload folder if it doesn't exist
    if not os.path.exists(UPLOAD_FOLDER):
        os.makedirs(UPLOAD_FOLDER)
    
    app.run(debug=True, host='0.0.0.0', port=5000)
