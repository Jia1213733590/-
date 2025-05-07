// Design engine - handles template recommendations and design generation
class DesignEngine {
  constructor() {
      // Store template data
      this.templates = {};
      // Load all template data
      this.loadTemplates();
  }
  
  // Load template data
  async loadTemplates() {
      try {
          // Load templates for each type
          const types = ['business', 'ecommerce', 'portfolio', 'blog'];
          for (const type of types) {
              const response = await fetch(`../templates/${type}/template.json`);
              this.templates[type] = await response.json();
          }
          console.log('Templates loaded:', this.templates);
      } catch (error) {
          console.error('Error loading templates:', error);
      }
  }
  
  // Get recommended pages based on website type
  getRecommendedPages(templateType) {
      if (!this.templates[templateType]) {
          return [];
      }
      
      const template = this.templates[templateType];
      const recommendedPages = [];
      
      // Loop through template pages
      for (const [pageId, pageData] of Object.entries(template.pages)) {
          recommendedPages.push({
              id: pageId,
              name: pageData.name,
              default: pageData.default
          });
      }
      
      return recommendedPages;
  }
  
  // Get available color themes for website type
  getAvailableThemes(templateType) {
      if (!this.templates[templateType]) {
          return [];
      }
      
      return this.templates[templateType].themes || [];
  }
  
  // Get recommended features for website type
  getRecommendedFeatures(templateType) {
      if (!this.templates[templateType]) {
          return [];
      }
      
      return this.templates[templateType].features || [];
  }
  
  // Generate final design
  async generateDesign(userData) {
      console.log('Generating design with user data:', userData);
      
      try {
          // Send data to backend
          const response = await fetch('/api/generate', {
              method: 'POST',
              headers: {
                  'Content-Type': 'application/json'
              },
              body: JSON.stringify(userData)
          });
          
          if (!response.ok) {
              throw new Error('Failed to generate design');
          }
          
          return await response.json();
      } catch (error) {
          console.error('Error generating design:', error);
          return { error: error.message };
      }
  }
}

// Create design engine instance
const designEngine = new DesignEngine();