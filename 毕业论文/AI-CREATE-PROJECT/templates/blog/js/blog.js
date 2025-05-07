/**
 * Blog specific functions
 */

document.addEventListener('DOMContentLoaded', function() {
  console.log('Blog specific scripts initialized');
  
  // Initialize featured posts slider
  initFeaturedSlider();
  
  // Initialize image lightbox
  initImageLightbox();
  
  // Initialize reading progress indicator
  initReadingProgress();
  
  // Initialize category filter
  initCategoryFilter();
  
  // Initialize newsletter signup
  initNewsletterSignup();
  
  // Initialize social sharing
  initSocialSharing();
});

/**
* Initialize featured posts slider
*/
function initFeaturedSlider() {
  const slider = document.querySelector('.featured-slider');
  if (!slider) return;
  
  let currentSlide = 0;
  const slides = slider.querySelectorAll('.slide');
  const totalSlides = slides.length;
  const nextBtn = slider.querySelector('.slider-next');
  const prevBtn = slider.querySelector('.slider-prev');
  const dotsContainer = slider.querySelector('.slider-dots');
  
  // Create dots
  if (dotsContainer) {
      for (let i = 0; i < totalSlides; i++) {
          const dot = document.createElement('span');
          dot.classList.add('dot');
          if (i === 0) dot.classList.add('active');
          dot.dataset.index = i;
          dotsContainer.appendChild(dot);
          
          // Add click event
          dot.addEventListener('click', function() {
              goToSlide(parseInt(this.dataset.index));
          });
      }
  }
  
  // Add click events to buttons
  if (nextBtn) {
      nextBtn.addEventListener('click', function() {
          goToSlide((currentSlide + 1) % totalSlides);
      });
  }
  
  if (prevBtn) {
      prevBtn.addEventListener('click', function() {
          goToSlide((currentSlide - 1 + totalSlides) % totalSlides);
      });
  }
  
  // Set up auto sliding
  let slideInterval = setInterval(function() {
      goToSlide((currentSlide + 1) % totalSlides);
  }, 5000);
  
  // Pause on hover
  slider.addEventListener('mouseenter', function() {
      clearInterval(slideInterval);
  });
  
  slider.addEventListener('mouseleave', function() {
      clearInterval(slideInterval);
      slideInterval = setInterval(function() {
          goToSlide((currentSlide + 1) % totalSlides);
      }, 5000);
  });
  
  // Go to specific slide
  function goToSlide(index) {
      // Update slides
      slides.forEach((slide, i) => {
          slide.style.transform = `translateX(${100 * (i - index)}%)`;
      });
      
      // Update dots
      if (dotsContainer) {
          const dots = dotsContainer.querySelectorAll('.dot');
          dots.forEach((dot, i) => {
              dot.classList.toggle('active', i === index);
          });
      }
      
      // Update current slide
      currentSlide = index;
  }
  
  // Initialize slides position
  goToSlide(0);
}

/**
* Initialize image lightbox for blog post images
*/
function initImageLightbox() {
  const postContent = document.querySelector('.post-content');
  if (!postContent) return;
  
  const images = postContent.querySelectorAll('img');
  
  images.forEach(img => {
      // Make images clickable
      img.style.cursor = 'pointer';
      
      // Add click event
      img.addEventListener('click', function() {
          // Create lightbox
          const lightbox = document.createElement('div');
          lightbox.className = 'lightbox';
          lightbox.innerHTML = `
              <div class="lightbox-content">
                  <img src="${this.src}" alt="${this.alt}">
                  <span class="close">&times;</span>
              </div>
          `;
          
          // Add to body
          document.body.appendChild(lightbox);
          
          // Prevent scrolling
          document.body.style.overflow = 'hidden';
          
          // Close on click
          lightbox.addEventListener('click', function(e) {
              if (e.target === lightbox || e.target.className === 'close') {
                  document.body.removeChild(lightbox);
                  document.body.style.overflow = '';
              }
          });
      });
  });
}

/**
* Initialize reading progress indicator for blog posts
*/
function initReadingProgress() {
  const post = document.querySelector('.blog-post');
  if (!post) return;
  
  // Create progress bar if it doesn't exist
  let progressBar = document.querySelector('.reading-progress');
  if (!progressBar) {
      progressBar = document.createElement('div');
      progressBar.className = 'reading-progress';
      document.body.appendChild(progressBar);
  }
  
  // Update progress on scroll
  window.addEventListener('scroll', function() {
      // Calculate how far down the page the user has scrolled
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      const scrollHeight = document.documentElement.scrollHeight;
      const clientHeight = document.documentElement.clientHeight;
      
      // Calculate percentage
      const scrolled = (scrollTop / (scrollHeight - clientHeight)) * 100;
      
      // Update progress bar
      progressBar.style.width = scrolled + '%';
  });
}

/**
* Initialize category filter for blog list
*/
function initCategoryFilter() {
  const categoryLinks = document.querySelectorAll('.category-list a');
  const postCards = document.querySelectorAll('.post-card');
  
  if (categoryLinks.length === 0 || postCards.length === 0) return;
  
  categoryLinks.forEach(link => {
      link.addEventListener('click', function(e) {
          e.preventDefault();
          
          // Get selected category
          const category = this.textContent.split('(')[0].trim().toLowerCase();
          
          // Toggle active class
          categoryLinks.forEach(link => link.classList.remove('active'));
          this.classList.add('active');
          
          // Filter posts
          if (category === 'all') {
              // Show all posts
              postCards.forEach(card => card.style.display = '');
          } else {
              // Show only matching posts
              postCards.forEach(card => {
                  const postCategory = card.querySelector('.post-meta').textContent.toLowerCase();
                  if (postCategory.includes(category)) {
                      card.style.display = '';
                  } else {
                      card.style.display = 'none';
                  }
              });
          }
      });
  });
}

/**
* Initialize newsletter signup
*/
function initNewsletterSignup() {
  const form = document.querySelector('.newsletter-form');
  if (!form) return;
  
  form.addEventListener('submit', function(e) {
      e.preventDefault();
      
      const emailInput = this.querySelector('input[type="email"]');
      const email = emailInput.value.trim();
      
      // Simple validation
      if (!email || !/\S+@\S+\.\S+/.test(email)) {
          alert('Please enter a valid email address');
          return;
      }
      
      // Call the newsletter subscription function
      if (subscribeToNewsletter(email)) {
          // Show success message
          const successMsg = document.createElement('p');
          successMsg.className = 'success-message';
          successMsg.textContent = 'Thank you for subscribing!';
          
          // Replace form with success message
          this.parentNode.replaceChild(successMsg, this);
      }
  });
}

/**
* Initialize social sharing buttons
*/
function initSocialSharing() {
  const shareButtons = document.querySelectorAll('.social-share a');
  if (shareButtons.length === 0) return;
  
  shareButtons.forEach(button => {
      button.addEventListener('click', function(e) {
          e.preventDefault();
          
          // Get current page URL and title
          const url = window.location.href;
          const title = document.title;
          
          // Get platform from data attribute
          const platform = this.dataset.platform;
          
          // Share post
          sharePost(platform, url, title);
      });
  });
}

/**
* Calculate estimated reading time for a blog post
* @param {string} content - Post content
* @return {number} Estimated reading time in minutes
*/
function calculateReadingTime(content) {
  // Average reading speed (words per minute)
  const wordsPerMinute = 200;
  
  // Count words
  const wordCount = content.trim().split(/\s+/).length;
  
  // Calculate reading time
  const readingTime = Math.ceil(wordCount / wordsPerMinute);
  
  return readingTime;
}

/**
* Check if element is in viewport
* @param {Element} el - Element to check
* @return {boolean} Whether element is in viewport
*/
function isInViewport(el) {
  const rect = el.getBoundingClientRect();
  
  return (
      rect.top >= 0 &&
      rect.left >= 0 &&
      rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
      rect.right <= (window.innerWidth || document.documentElement.clientWidth)
  );
}