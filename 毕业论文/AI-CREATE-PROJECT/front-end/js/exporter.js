// Exporter - handles preview and export of generated website
class Exporter {
  constructor() {
      // Create modal containers if they don't exist
      this.createModalContainers();
  }
  
  // Create modal containers
  createModalContainers() {
      // Check if preview modal exists
      if (!document.getElementById('preview-modal')) {
          const previewModal = document.createElement('div');
          previewModal.id = 'preview-modal';
          previewModal.className = 'modal';
          previewModal.innerHTML = `
              <div class="modal-content">
                  <span class="close-button">&times;</span>
                  <h2>Website Preview</h2>
                  <div class="preview-container">
                      <iframe id="preview-frame"></iframe>
                  </div>
                  <div class="preview-controls">
                      <button id="download-btn">Download Website</button>
                  </div>
              </div>
          `;
          document.body.appendChild(previewModal);
          
          // Add event listener to close button
          const closeButton = previewModal.querySelector('.close-button');
          closeButton.addEventListener('click', () => {
              previewModal.style.display = 'none';
          });
          
          // Add event listener to download button
          const downloadBtn = document.getElementById('download-btn');
          downloadBtn.addEventListener('click', () => this.downloadWebsite());
      }
  }
  
  // Show preview of generated website
  showPreview(result) {
      // Store result for later use
      this.generatedResult = result;
      
      // Get modal and iframe
      const modal = document.getElementById('preview-modal');
      const iframe = document.getElementById('preview-frame');
      
      // Check if there was an error
      if (result.error) {
          // Display error message
          modal.querySelector('.preview-container').innerHTML = `
              <div class="error-message">
                  <p>Error generating website: ${result.error}</p>
              </div>
          `;
      } else {
          // Load preview in iframe
          if (result.previewUrl) {
              iframe.src = result.previewUrl;
          } else {
              // If no preview URL, show message
              modal.querySelector('.preview-container').innerHTML = `
                  <div class="message">
                      <p>Your website design is ready for download!</p>
                  </div>
              `;
          }
      }
      
      // Show modal
      modal.style.display = 'block';
  }
  
  // Download the generated website
  downloadWebsite() {
      // Check if we have a result
      if (!this.generatedResult) {
          console.error('No website generated yet');
          return;
      }
      
      if (this.generatedResult.downloadUrl) {
          // Create a temporary anchor to trigger download
          const downloadLink = document.createElement('a');
          downloadLink.href = this.generatedResult.downloadUrl;
          downloadLink.download = 'mywebsite.zip';
          downloadLink.style.display = 'none';
          document.body.appendChild(downloadLink);
          downloadLink.click();
          document.body.removeChild(downloadLink);
      } else {
          console.error('No download URL available');
      }
  }
  
  // Display usage instructions
  showInstructions() {
      const modal = document.getElementById('preview-modal');
      modal.querySelector('.preview-container').innerHTML = `
          <div class="instructions">
              <h3>How to use your website files:</h3>
              <ol>
                  <li>Extract the downloaded ZIP file to a folder</li>
                  <li>Open the index.html file in any web browser</li>
                  <li>You can now browse your website locally</li>
                  <li>To share with others, copy all files to a USB drive or upload to a web hosting service</li>
              </ol>
          </div>
      `;
      modal.style.display = 'block';
  }
}

// Create exporter instance
const exporter = new Exporter();