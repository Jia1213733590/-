/**
 * General functions for blog template
 */

// Document ready function
document.addEventListener('DOMContentLoaded', function() {
  console.log('Blog template initialized');
  
  // Initialize mobile menu
  initMobileMenu();
  
  // Initialize search toggle
  initSearchToggle();
  
  // Initialize comment form
  initCommentForm();
  
  // Initialize FAQ toggles
  initFaqToggles();
});

/**
* Initialize mobile menu functionality
*/
function initMobileMenu() {
  const menuToggle = document.querySelector('.menu-toggle');
  const navMenu = document.querySelector('nav ul');
  
  if (menuToggle && navMenu) {
      menuToggle.addEventListener('click', function() {
          navMenu.classList.toggle('active');
          menuToggle.classList.toggle('active');
      });
  }
}

/**
* Initialize search toggle functionality
*/
function initSearchToggle() {
  const searchToggle = document.querySelector('.search-toggle');
  const searchForm = document.querySelector('.search-form');
  
  if (searchToggle && searchForm) {
      searchToggle.addEventListener('click', function() {
          searchForm.classList.toggle('active');
          searchToggle.classList.toggle('active');
          
          if (searchForm.classList.contains('active')) {
              searchForm.querySelector('input').focus();
          }
      });
  }
}

/**
* Initialize comment form submission
*/
function initCommentForm() {
  const commentForm = document.querySelector('.comment-form form');
  
  if (commentForm) {
      commentForm.addEventListener('submit', function(e) {
          e.preventDefault();
          
          // Get form data
          const name = commentForm.querySelector('#name').value;
          const email = commentForm.querySelector('#email').value;
          const comment = commentForm.querySelector('#comment').value;
          
          // Simple validation
          if (!name || !email || !comment) {
              alert('Please fill in all fields');
              return;
          }
          
          // Show success message (in a real implementation, this would submit to a backend)
          alert('Thank you for your comment! In a real implementation, this would be saved to a database.');
          
          // Reset form
          commentForm.reset();
      });
  }
}

/**
* Initialize FAQ toggles
*/
function initFaqToggles() {
  const faqItems = document.querySelectorAll('.faq-item h3');
  
  if (faqItems.length > 0) {
      faqItems.forEach(item => {
          item.addEventListener('click', function() {
              // Toggle active class
              this.classList.toggle('active');
              
              // Toggle visibility of answer
              const answer = this.nextElementSibling;
              if (answer) {
                  if (answer.style.maxHeight) {
                      answer.style.maxHeight = null;
                  } else {
                      answer.style.maxHeight = answer.scrollHeight + 'px';
                  }
              }
          });
      });
  }
}

/**
* Format date to readable string
* @param {Date} date - Date object to format
* @return {string} Formatted date string
*/
function formatDate(date) {
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return date.toLocaleDateString('en-US', options);
}

/**
* Truncate text to a specified length
* @param {string} text - Text to truncate
* @param {number} length - Maximum length
* @return {string} Truncated text
*/
function truncateText(text, length = 100) {
  if (text.length <= length) return text;
  return text.substring(0, length) + '...';
}

/**
* Get related posts by category
* @param {string} category - Category to match
* @param {number} count - Number of posts to return
* @return {Array} Array of related posts
*/
function getRelatedPosts(category, count = 3) {
  // In a real implementation, this would fetch from a database or API
  // This is a mock implementation
  console.log(`Getting ${count} related posts for category: ${category}`);
  return [];
}

/**
* Handle newsletter subscription
* @param {string} email - Subscriber email
* @return {boolean} Success status
*/
function subscribeToNewsletter(email) {
  // In a real implementation, this would submit to a backend
  console.log(`Subscribing email: ${email} to newsletter`);
  return true;
}

/**
* Share post to social media
* @param {string} platform - Social media platform
* @param {string} url - URL to share
* @param {string} title - Post title
*/
function sharePost(platform, url, title) {
  // Get the current page URL if not provided
  if (!url) url = window.location.href;
  
  // Get the page title if not provided
  if (!title) title = document.title;
  
  // Share URLs for different platforms
  const shareUrls = {
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
      twitter: `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`,
      linkedin: `https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(url)}&title=${encodeURIComponent(title)}`,
      pinterest: `https://pinterest.com/pin/create/button/?url=${encodeURIComponent(url)}&description=${encodeURIComponent(title)}`
  };
  
  // Open share window if platform is supported
  if (shareUrls[platform]) {
      window.open(shareUrls[platform], 'share-window', 'width=650,height=500');
  }
}