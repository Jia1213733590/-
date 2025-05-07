import os
import shutil
import time
from template_manager import TemplateManager

class WebsiteGenerator:
    """
    Generates website files based on user selections
    """
    def __init__(self):
        self.output_dir = os.path.join('output', 'sites')
        self.template_manager = TemplateManager()
        
        # Create output directory if it doesn't exist
        os.makedirs(self.output_dir, exist_ok=True)
    
    def generate(self, template_type, pages=None, theme='professional', features=None):
        """
        Generate website files based on user selections
        
        Args:
            template_type: Type of website template (business, ecommerce, portfolio, blog)
            pages: List of page IDs to include
            theme: Color theme to apply
            features: List of features to include
            
        Returns:
            Path to the generated website directory
        """
        # Default values
        if pages is None:
            pages = []
        if features is None:
            features = []
        
        # Get template configuration
        template = self.template_manager.get_template(template_type)
        if not template:
            raise ValueError(f"Template '{template_type}' not found")
        
        # If no pages are selected, include default pages
        if not pages:
            for page_id, page_info in template.get('pages', {}).items():
                if page_info.get('default', False):
                    pages.append(page_id)
        
        # Create a timestamp-based directory for this generation
        timestamp = int(time.time())
        site_dir = os.path.join(self.output_dir, f"{template_type}_{timestamp}")
        os.makedirs(site_dir, exist_ok=True)
        
        # Create CSS directory
        css_dir = os.path.join(site_dir, 'css')
        os.makedirs(css_dir, exist_ok=True)
        
        # Create JS directory
        js_dir = os.path.join(site_dir, 'js')
        os.makedirs(js_dir, exist_ok=True)
        
        # Generate CSS files
        self._generate_css(template_type, theme, css_dir)
        
        # Generate JS files
        self._generate_js(template_type, features, js_dir)
        
        # Generate HTML pages
        self._generate_html_pages(template_type, pages, features, theme, site_dir)
        
        return site_dir
    
    def _generate_css(self, template_type, theme, css_dir):
        """Generate CSS files for the website"""
        # Get base CSS
        base_css = self.template_manager.get_base_css(template_type)
        if base_css:
            with open(os.path.join(css_dir, 'base.css'), 'w') as file:
                file.write(base_css)
        
        # Get theme CSS
        theme_css = self.template_manager.get_css_theme(template_type, theme)
        if theme_css:
            with open(os.path.join(css_dir, 'theme.css'), 'w') as file:
                file.write(theme_css)
        
        # Create main CSS file that imports base and theme
        with open(os.path.join(css_dir, 'main.css'), 'w') as file:
            file.write("""
/* Main CSS file */
@import url('base.css');
@import url('theme.css');

/* Add any additional styles here */
            """)
    
    def _generate_js(self, template_type, features, js_dir):
        """Generate JavaScript files for the website"""
        # Get JS files from template
        js_files = self.template_manager.get_js_files(template_type)
        
        for file_name, content in js_files.items():
            with open(os.path.join(js_dir, file_name), 'w') as file:
                file.write(content)
        
        # Create a main.js file that includes feature-specific code
        main_js_content = """
// Main JavaScript file

document.addEventListener('DOMContentLoaded', function() {
    console.log('Website initialized');
    
    // Initialize components
"""
        
        # Add feature-specific initialization
        if 'contact_form' in features:
            main_js_content += """
    // Initialize contact form
    const contactForm = document.querySelector('.contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            alert('Thank you for your message! This is a demo form.');
        });
    }
"""
        
        if 'gallery' in features:
            main_js_content += """
    // Initialize image gallery
    const gallery = document.querySelector('.gallery');
    if (gallery) {
        const images = gallery.querySelectorAll('img');
        images.forEach(img => {
            img.addEventListener('click', function() {
                // Simple lightbox effect
                const lightbox = document.createElement('div');
                lightbox.className = 'lightbox';
                lightbox.innerHTML = `<div class="lightbox-content"><img src="${img.src}"><span>&times;</span></div>`;
                document.body.appendChild(lightbox);
                
                lightbox.querySelector('span').addEventListener('click', function() {
                    document.body.removeChild(lightbox);
                });
            });
        });
    }
"""
        
        main_js_content += """
});
"""
        
        with open(os.path.join(js_dir, 'main.js'), 'w') as file:
            file.write(main_js_content)
    
    def _generate_html_pages(self, template_type, pages, features, theme, site_dir):
        """Generate HTML pages for the website"""
        # Get template configuration
        template = self.template_manager.get_template(template_type)
        
        # For each selected page
        for page_id in pages:
            page_content = self.template_manager.get_page_template(template_type, page_id)
            
            if page_content:
                # Replace placeholders with actual content
                page_content = self._process_page_content(page_content, template_type, pages, features, theme)
                
                # Write the page file
                file_name = 'index.html' if page_id == 'home' else f"{page_id}.html"
                with open(os.path.join(site_dir, file_name), 'w') as file:
                    file.write(page_content)
    
    def _process_page_content(self, content, template_type, pages, features, theme):
        """
        Process page content to replace placeholders and add features
        """
        # Get template configuration
        template = self.template_manager.get_template(template_type)
        
        # Replace navigation placeholder with actual navigation
        nav_html = self._generate_navigation(template_type, pages)
        content = content.replace('<!-- NAVIGATION -->', nav_html)
        
        # Replace feature placeholders
        for feature in features:
            feature_placeholder = f"<!-- FEATURE: {feature} -->"
            feature_html = self._generate_feature_html(feature)
            content = content.replace(feature_placeholder, feature_html)
        
        # Replace title placeholder
        site_name = template.get('name', 'My Website')
        content = content.replace('<!-- SITE_TITLE -->', site_name)
        
        # Replace CSS and JS links
        content = content.replace('<!-- CSS_LINKS -->', '<link rel="stylesheet" href="css/main.css">')
        content = content.replace('<!-- JS_LINKS -->', '<script src="js/main.js"></script>')
        
        return content
    
    def _generate_navigation(self, template_type, pages):
        """Generate navigation HTML based on selected pages"""
        template = self.template_manager.get_template(template_type)
        
        nav_html = '<nav>\n    <ul>\n'
        
        for page_id in pages:
            page_info = template.get('pages', {}).get(page_id, {})
            page_name = page_info.get('name', page_id.title())
            
            # Determine the href
            href = 'index.html' if page_id == 'home' else f"{page_id}.html"
            
            nav_html += f'        <li><a href="{href}">{page_name}</a></li>\n'
        
        nav_html += '    </ul>\n</nav>'
        return nav_html
    
    def _generate_feature_html(self, feature):
        """Generate HTML for a specific feature"""
        if feature == 'contact_form':
            return """
<div class="contact-form-container">
    <h2>Contact Us</h2>
    <form class="contact-form">
        <div class="form-group">
            <label for="name">Name</label>
            <input type="text" id="name" name="name" required>
        </div>
        <div class="form-group">
            <label for="email">Email</label>
            <input type="email" id="email" name="email" required>
        </div>
        <div class="form-group">
            <label for="message">Message</label>
            <textarea id="message" name="message" rows="5" required></textarea>
        </div>
        <button type="submit">Send Message</button>
    </form>
</div>
"""
        
        elif feature == 'gallery':
            return """
<div class="gallery">
    <div class="gallery-item">
        <img src="https://via.placeholder.com/300x200?text=Image+1" alt="Gallery Image 1">
    </div>
    <div class="gallery-item">
        <img src="https://via.placeholder.com/300x200?text=Image+2" alt="Gallery Image 2">
    </div>
    <div class="gallery-item">
        <img src="https://via.placeholder.com/300x200?text=Image+3" alt="Gallery Image 3">
    </div>
    <div class="gallery-item">
        <img src="https://via.placeholder.com/300x200?text=Image+4" alt="Gallery Image 4">
    </div>
</div>
"""
        
        elif feature == 'map':
            return """
<div class="map-container">
    <h2>Our Location</h2>
    <div class="map-placeholder">
        <p>Map goes here. In a real implementation, this would be an interactive map.</p>
        <p>123 Main Street, Anytown, USA</p>
    </div>
</div>
"""
        
        elif feature == 'social_media':
            return """
<div class="social-links">
    <h2>Follow Us</h2>
    <div class="social-icons">
        <a href="#" class="social-icon">Facebook</a>
        <a href="#" class="social-icon">Twitter</a>
        <a href="#" class="social-icon">Instagram</a>
        <a href="#" class="social-icon">LinkedIn</a>
    </div>
</div>
"""
        
        # Return empty string for unsupported features
        return ''