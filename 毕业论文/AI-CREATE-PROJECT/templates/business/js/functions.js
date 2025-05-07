/**
 * General functions for business template
 */

// Document ready function
document.addEventListener('DOMContentLoaded', function() {
  console.log('Business template initialized');
  
  // Initialize mobile menu
  initMobileMenu();
  
  // Initialize testimonial slider
  initTestimonialSlider();
  
  // Initialize FAQ toggles
  initFaqToggles();
  
  // Initialize scroll animations
  initScrollAnimations();
  
  // Initialize contact form
  initContactForm();
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
* Initialize testimonial slider
*/
function initTestimonialSlider() {
  const slider = document.querySelector('.testimonials-slider');
  if (!slider) return;
  
  const slides = slider.querySelectorAll('.testimonial-slide');
  const prevBtn = document.querySelector('.testimonial-controls .prev-btn');
  const nextBtn = document.querySelector('.testimonial-controls .next-btn');
  
  let currentSlide = 0;
  const totalSlides = slides.length;
  
  // Hide all slides except first one
  slides.forEach((slide, index) => {
      if (index !== 0) {
          slide.style.display = 'none';
      }
  });
  
  // Function to show slide
  function showSlide(index) {
      // Hide all slides
      slides.forEach(slide => {
          slide.style.display = 'none';
      });
      
      // Show selected slide
      slides[index].style.display = 'block';
      
      // Animate slide
      slides[index].style.opacity = 0;
      setTimeout(() => {
          slides[index].style.opacity = 1;
      }, 50);
      
      // Update current slide
      currentSlide = index;
  }
  
  // Add event listeners to controls
  if (prevBtn) {
      prevBtn.addEventListener('click', function() {
          let newIndex = currentSlide - 1;
          if (newIndex < 0) newIndex = totalSlides - 1;
          showSlide(newIndex);
      });
  }
  
  if (nextBtn) {
      nextBtn.addEventListener('click', function() {
          let newIndex = currentSlide + 1;
          if (newIndex >= totalSlides) newIndex = 0;
          showSlide(newIndex);
      });
  }
  
  // Auto slide (optional)
  let slideInterval = setInterval(function() {
      let newIndex = currentSlide + 1;
      if (newIndex >= totalSlides) newIndex = 0;
      showSlide(newIndex);
  }, 7000);
  
  // Pause on hover
  slider.addEventListener('mouseenter', function() {
      clearInterval(slideInterval);
  });
  
  slider.addEventListener('mouseleave', function() {
      slideInterval = setInterval(function() {
          let newIndex = currentSlide + 1;
          if (newIndex >= totalSlides) newIndex = 0;
          showSlide(newIndex);
      }, 7000);
  });
}

/**
* Initialize FAQ toggles
*/
function initFaqToggles() {
  const faqQuestions = document.querySelectorAll('.faq-question');
  
  faqQuestions.forEach(question => {
      question.addEventListener('click', function() {
          // Toggle active class
          this.classList.toggle('active');
          
          // Get the answer element
          const answer = this.nextElementSibling;
          
          // Toggle answer visibility
          if (answer.style.maxHeight) {
              answer.style.maxHeight = null;
          } else {
              answer.style.maxHeight = answer.scrollHeight + 'px';
          }
      });
  });
}

/**
* Initialize scroll animations
*/
function initScrollAnimations() {
  const animatedElements = document.querySelectorAll('.animate-on-scroll');
  
  // Function to check if element is in viewport
  function isElementInViewport(el) {
      const rect = el.getBoundingClientRect();
      return (
          rect.top <= (window.innerHeight || document.documentElement.clientHeight) * 0.8 &&
          rect.bottom >= 0
      );
  }
  
  // Function to handle scroll events
  function handleScroll() {
      animatedElements.forEach(element => {
          if (isElementInViewport(element)) {
              element.classList.add('animated');
          }
      });
  }
  
  // Add scroll event listener
  window.addEventListener('scroll', handleScroll);
  
  // Trigger once on load
  handleScroll();
}

/**
* Initialize contact form
*/
function initContactForm() {
  const contactForm = document.querySelector('.contact-form');
  
  if (contactForm) {
      contactForm.addEventListener('submit', function(e) {
          e.preventDefault();
          
          // Get form data
          const formData = new FormData(this);
          const formValues = Object.fromEntries(formData.entries());
          
          // Simple validation
          let isValid = true;
          let errorMessage = '';
          
          // Required fields
          if (!formValues.name || !formValues.email || !formValues.message) {
              isValid = false;
              errorMessage = 'Please fill in all required fields.';
          }
          
          // Email validation
          if (formValues.email && !/\S+@\S+\.\S+/.test(formValues.email)) {
              isValid = false;
              errorMessage = 'Please enter a valid email address.';
          }
          
          // Show error or submit
          if (!isValid) {
              showFormMessage(contactForm, errorMessage, 'error');
          } else {
              // In a real implementation, this would send data to a server
              // For demo purposes, just show a success message
              showFormMessage(contactForm, 'Thank you for your message! We will get back to you soon.', 'success');
              contactForm.reset();
          }
      });
  }
}

/**
* Show form message
* @param {Element} form - The form element
* @param {string} message - Message to display
* @param {string} type - Message type ('success' or 'error')
*/
function showFormMessage(form, message, type = 'success') {
  // Remove any existing message
  const existingMessage = form.querySelector('.form-message');
  if (existingMessage) {
      existingMessage.remove();
  }
  
  // Create message element
  const messageElement = document.createElement('div');
  messageElement.className = `form-message ${type}`;
  messageElement.textContent = message;
  
  // Add to form
  form.appendChild(messageElement);
  
  // Auto-remove after 5 seconds for success messages
  if (type === 'success') {
      setTimeout(() => {
          messageElement.remove();
      }, 5000);
  }
}

/**
* Counter animation
* @param {Element} element - The counter element
* @param {number} target - Target number
* @param {number} duration - Animation duration in milliseconds
*/
function animateCounter(element, target, duration = 2000) {
  let start = 0;
  const increment = target / (duration / 16);
  
  function updateCounter() {
      start += increment;
      if (start < target) {
          element.textContent = Math.floor(start);
          requestAnimationFrame(updateCounter);
      } else {
          element.textContent = target;
      }
  }
  
  updateCounter();
}

/**
* Initialize counter animations
*/
function initCounters() {
  const counters = document.querySelectorAll('.counter');
  
  function handleCounters() {
      counters.forEach(counter => {
          const rect = counter.getBoundingClientRect();
          if (rect.top <= window.innerHeight && !counter.classList.contains('counted')) {
              counter.classList.add('counted');
              const target = parseInt(counter.dataset.count);
              animateCounter(counter, target);
          }
      });
  }
  
  window.addEventListener('scroll', handleCounters);
  handleCounters();
}

/**
* Smooth scroll to section
* @param {string} targetId - Target element ID
*/
function smoothScrollTo(targetId) {
  const targetElement = document.getElementById(targetId);
  
  if (targetElement) {
      window.scrollTo({
          top: targetElement.offsetTop - 100,
          behavior: 'smooth'
      });
  }
}