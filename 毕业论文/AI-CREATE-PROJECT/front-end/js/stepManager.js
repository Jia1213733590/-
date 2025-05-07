// Step manager to handle the design flow
class StepManager {
  constructor() {
      this.currentStep = 1;
      this.totalSteps = 4;
      this.stepData = {}; // Store user selections
      
      // DOM elements
      this.stepContainer = document.getElementById('step-container');
      this.stepIndicators = document.querySelectorAll('.step-indicator .step');
      this.prevBtn = document.getElementById('prev-btn');
      this.nextBtn = document.getElementById('next-btn');
      
      // Bind events
      this.prevBtn.addEventListener('click', () => this.previousStep());
      this.nextBtn.addEventListener('click', () => this.nextStep());
      
      // Initialize first step
      this.loadStep(1);
  }
  
  // Load specific step
  async loadStep(stepNumber) {
      // Load step HTML
      const response = await fetch(`steps/step${stepNumber}.html`);
      const html = await response.text();
      this.stepContainer.innerHTML = html;
      
      // Update step indicator
      this.updateStepIndicator();
      
      // Update button states
      this.updateButtons();
      
      // Bind events for newly loaded step
      this.bindStepEvents(stepNumber);
  }
  
  // Bind events specific to each step
  bindStepEvents(stepNumber) {
      switch(stepNumber) {
          case 1: // Website type selection
              const typeOptions = document.querySelectorAll('.template-option');
              typeOptions.forEach(option => {
                  option.addEventListener('click', (e) => {
                      // Remove selection from others
                      typeOptions.forEach(opt => opt.classList.remove('selected'));
                      // Add selection to clicked option
                      option.classList.add('selected');
                      // Save selection
                      this.stepData.templateType = option.dataset.type;
                  });
              });
              break;
          case 2:
              // Page selection events
              this.bindPageSelectionEvents();
              break;
          case 3:
              // Color theme selection events
              this.bindColorSelectionEvents();
              break;
          case 4:
              // Feature selection events
              this.bindFeatureSelectionEvents();
              break;
      }
  }
  
  // Bind page selection events
  bindPageSelectionEvents() {
      // Will be implemented based on page selection UI
      const checkboxes = document.querySelectorAll('.page-option input[type="checkbox"]');
      checkboxes.forEach(checkbox => {
          checkbox.addEventListener('change', () => {
              // Update selected pages
              this.updateSelectedPages();
          });
      });
  }
  
  // Update selected pages data
  updateSelectedPages() {
      const selectedPages = [];
      const checkboxes = document.querySelectorAll('.page-option input[type="checkbox"]:checked');
      checkboxes.forEach(checkbox => {
          selectedPages.push(checkbox.value);
      });
      this.stepData.selectedPages = selectedPages;
  }
  
  // Bind color selection events
  bindColorSelectionEvents() {
      const colorOptions = document.querySelectorAll('.color-option');
      colorOptions.forEach(option => {
          option.addEventListener('click', () => {
              // Remove selection from others
              colorOptions.forEach(opt => opt.classList.remove('selected'));
              // Add selection to clicked option
              option.classList.add('selected');
              // Save selection
              this.stepData.selectedTheme = option.dataset.theme;
          });
      });
  }
  
  // Bind feature selection events
  bindFeatureSelectionEvents() {
      const featureCheckboxes = document.querySelectorAll('.feature-option input[type="checkbox"]');
      featureCheckboxes.forEach(checkbox => {
          checkbox.addEventListener('change', () => {
              // Update selected features
              this.updateSelectedFeatures();
          });
      });
  }
  
  // Update selected features data
  updateSelectedFeatures() {
      const selectedFeatures = [];
      const checkboxes = document.querySelectorAll('.feature-option input[type="checkbox"]:checked');
      checkboxes.forEach(checkbox => {
          selectedFeatures.push(checkbox.value);
      });
      this.stepData.selectedFeatures = selectedFeatures;
  }
  
  // Update step indicator
  updateStepIndicator() {
      this.stepIndicators.forEach(indicator => {
          const step = parseInt(indicator.dataset.step);
          indicator.classList.remove('active', 'completed');
          
          if (step < this.currentStep) {
              indicator.classList.add('completed');
          } else if (step === this.currentStep) {
              indicator.classList.add('active');
          }
      });
  }
  
  // Update navigation buttons
  updateButtons() {
      // Disable previous button on first step
      this.prevBtn.disabled = (this.currentStep === 1);
      
      // Change next button text on last step
      if (this.currentStep === this.totalSteps) {
          this.nextBtn.textContent = 'Finish';
      } else {
          this.nextBtn.textContent = 'Next';
      }
  }
  
  // Go to previous step
  previousStep() {
      if (this.currentStep > 1) {
          this.currentStep--;
          this.loadStep(this.currentStep);
      }
  }
  
  // Go to next step
  nextStep() {
      if (this.currentStep < this.totalSteps) {
          // Save current step data
          this.saveStepData();
          
          // Go to next step
          this.currentStep++;
          this.loadStep(this.currentStep);
      } else {
          // Last step, complete design
          this.completeDesign();
      }
  }
  
  // Save current step data
  saveStepData() {
      // Different data for each step
      switch(this.currentStep) {
          case 1:
              // Template type already saved in bindStepEvents
              break;
          case 2:
              this.updateSelectedPages();
              break;
          case 3:
              // Theme already saved in bindColorSelectionEvents
              break;
          case 4:
              this.updateSelectedFeatures();
              break;
      }
  }
  
  // Complete the design process
  completeDesign() {
      console.log('Design completed with data:', this.stepData);
      
      // Call design engine to generate final design
      designEngine.generateDesign(this.stepData)
          .then(result => {
              // Show preview and provide download options
              exporter.showPreview(result);
          });
  }
}

// Create step manager instance
const stepManager = new StepManager();