// Main application file - initialization and utilities

document.addEventListener('DOMContentLoaded', function() {
  console.log('AI Web Designer application initialized');
  
  // Add global event listeners
  
  // Close modals when clicking outside content
  window.addEventListener('click', function(event) {
      const modals = document.querySelectorAll('.modal');
      modals.forEach(modal => {
          if (event.target === modal) {
              modal.style.display = 'none';
          }
      });
  });
  
  // Add keyboard navigation support
  document.addEventListener('keydown', function(event) {
      // Escape key closes modals
      if (event.key === 'Escape') {
          const modals = document.querySelectorAll('.modal');
          modals.forEach(modal => {
              modal.style.display = 'none';
          });
      }
  });
  
  // Helper function to create loading indicators
  window.showLoading = function(container) {
      const loadingElement = document.createElement('div');
      loadingElement.className = 'loading-indicator';
      loadingElement.innerHTML = `
          <div class="spinner"></div>
          <p>Loading...</p>
      `;
      container.appendChild(loadingElement);
      return loadingElement;
  };
  
  window.hideLoading = function(loadingElement) {
      if (loadingElement && loadingElement.parentNode) {
          loadingElement.parentNode.removeChild(loadingElement);
      }
  };
  
  // Helper function to show notifications
  window.showNotification = function(message, type = 'info') {
      const notification = document.createElement('div');
      notification.className = `notification ${type}`;
      notification.innerHTML = `<p>${message}</p>`;
      document.body.appendChild(notification);
      
      // Auto-hide after 3 seconds
      setTimeout(() => {
          notification.classList.add('hide');
          setTimeout(() => {
              if (notification.parentNode) {
                  notification.parentNode.removeChild(notification);
              }
          }, 500); // Wait for hide animation
      }, 3000);
  };
  
  // Helper function to validate user selection before proceeding
  window.validateStepSelection = function(step, data) {
      switch(step) {
          case 1:
              return data.templateType !== undefined;
          case 2:
              return data.selectedPages && data.selectedPages.length > 0;
          case 3:
              return data.selectedTheme !== undefined;
          case 4:
              return true; // Features are optional
          default:
              return false;
      }
  };
});