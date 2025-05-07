import os
import json

class TemplateManager:
    """
    Manages website templates and their configurations
    """
    def __init__(self):
        self.templates_dir = os.path.join('..', 'templates')
        self.templates = {}
        self.load_templates()
    
    def load_templates(self):
        """
        Load all template configurations from the templates directory
        """
        try:
            # Get all subdirectories in the templates directory
            template_types = [d for d in os.listdir(self.templates_dir) 
                             if os.path.isdir(os.path.join(self.templates_dir, d))]
            
            for template_type in template_types:
                template_path = os.path.join(self.templates_dir, template_type, 'template.json')
                
                if os.path.exists(template_path):
                    with open(template_path, 'r') as file:
                        self.templates[template_type] = json.load(file)
                else:
                    print(f"Warning: template.json not found for {template_type}")
            
            print(f"Loaded {len(self.templates)} templates")
        except Exception as e:
            print(f"Error loading templates: {str(e)}")
    
    def get_all_templates(self):
        """
        Return all available templates
        """
        return self.templates
    
    def get_template(self, template_type):
        """
        Return a specific template by type
        """
        return self.templates.get(template_type)
    
    def get_page_template(self, template_type, page_id):
        """
        Get the HTML template for a specific page in a template
        """
        template = self.get_template(template_type)
        if not template:
            return None
        
        page_path = os.path.join(self.templates_dir, template_type, 'pages', f"{page_id}.html")
        
        if os.path.exists(page_path):
            with open(page_path, 'r') as file:
                return file.read()
        
        return None
    
    def get_css_theme(self, template_type, theme_name):
        """
        Get the CSS content for a specific theme in a template
        """
        theme_path = os.path.join(self.templates_dir, template_type, 'css', 'themes', f"{theme_name}.css")
        
        if os.path.exists(theme_path):
            with open(theme_path, 'r') as file:
                return file.read()
        
        return None
    
    def get_base_css(self, template_type):
        """
        Get the base CSS content for a template
        """
        css_path = os.path.join(self.templates_dir, template_type, 'css', 'base.css')
        
        if os.path.exists(css_path):
            with open(css_path, 'r') as file:
                return file.read()
        
        return None
    
    def get_js_files(self, template_type):
        """
        Get the JavaScript files for a template
        """
        js_dir = os.path.join(self.templates_dir, template_type, 'js')
        js_files = {}
        
        if os.path.exists(js_dir):
            for file_name in os.listdir(js_dir):
                if file_name.endswith('.js'):
                    file_path = os.path.join(js_dir, file_name)
                    with open(file_path, 'r') as file:
                        js_files[file_name] = file.read()
        
        return js_files