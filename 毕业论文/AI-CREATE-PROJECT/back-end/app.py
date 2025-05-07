from flask import Flask, request, jsonify, send_file, render_template
import os
import json
import shutil
import zipfile
from template_manager import TemplateManager
from generator import WebsiteGenerator

# Initialize Flask app
app = Flask(__name__, static_folder='../frontend', static_url_path='/')
template_manager = TemplateManager()
generator = WebsiteGenerator()

@app.route('/')
def index():
    """Serve the main application page"""
    return app.send_static_file('index.html')

@app.route('/api/templates')
def get_templates():
    """Return all available templates"""
    return jsonify(template_manager.get_all_templates())

@app.route('/api/template/<template_type>')
def get_template(template_type):
    """Return a specific template configuration"""
    template = template_manager.get_template(template_type)
    if template:
        return jsonify(template)
    else:
        return jsonify({"error": "Template not found"}), 404

@app.route('/api/generate', methods=['POST'])
def generate_website():
    """Generate a website based on user selections"""
    data = request.json
    
    # Validate required fields
    if not data or 'templateType' not in data:
        return jsonify({"error": "Missing required fields"}), 400
    
    try:
        # Generate the website
        output_path = generator.generate(
            template_type=data['templateType'],
            pages=data.get('selectedPages', []),
            theme=data.get('selectedTheme', 'professional'),
            features=data.get('selectedFeatures', [])
        )
        
        # Create a unique ID for this generation
        import uuid
        generation_id = str(uuid.uuid4())
        
        # Create a zip file of the output
        zip_path = os.path.join('output', f"{generation_id}.zip")
        with zipfile.ZipFile(zip_path, 'w') as zipf:
            for root, dirs, files in os.walk(output_path):
                for file in files:
                    file_path = os.path.join(root, file)
                    arcname = os.path.relpath(file_path, output_path)
                    zipf.write(file_path, arcname)
        
        # Return the result with download and preview URLs
        return jsonify({
            "success": True,
            "downloadUrl": f"/api/download/{generation_id}",
            "previewUrl": f"/api/preview/{generation_id}"
        })
    
    except Exception as e:
        # Log the error for debugging
        print(f"Error generating website: {str(e)}")
        return jsonify({"error": str(e)}), 500

@app.route('/api/download/<generation_id>')
def download_website(generation_id):
    """Download the generated website as a zip file"""
    zip_path = os.path.join('output', f"{generation_id}.zip")
    
    if os.path.exists(zip_path):
        return send_file(zip_path, as_attachment=True, download_name="website.zip")
    else:
        return jsonify({"error": "File not found"}), 404

@app.route('/api/preview/<generation_id>')
def preview_website(generation_id):
    """Preview the generated website"""
    # For preview, we'll extract the zip to a temporary location
    preview_dir = os.path.join('output', 'preview', generation_id)
    zip_path = os.path.join('output', f"{generation_id}.zip")
    
    # Check if the zip file exists
    if not os.path.exists(zip_path):
        return jsonify({"error": "Preview not found"}), 404
    
    # Create preview directory if it doesn't exist
    if not os.path.exists(preview_dir):
        os.makedirs(preview_dir, exist_ok=True)
        
        # Extract the zip file
        with zipfile.ZipFile(zip_path, 'r') as zip_ref:
            zip_ref.extractall(preview_dir)
    
    # Serve the index.html file from the preview directory
    return send_file(os.path.join(preview_dir, 'index.html'))

@app.route('/api/preview/<generation_id>/<path:filename>')
def preview_resource(generation_id, filename):
    """Serve resources for the preview"""
    preview_dir = os.path.join('output', 'preview', generation_id)
    return send_file(os.path.join(preview_dir, filename))

# Create output directory if it doesn't exist
os.makedirs('output', exist_ok=True)
os.makedirs(os.path.join('output', 'preview'), exist_ok=True)

if __name__ == '__main__':
    app.run(debug=True, port=5000)