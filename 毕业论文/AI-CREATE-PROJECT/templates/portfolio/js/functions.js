/**
 * Portfolio - Main Functions
 * templates/portfolio/js/functions.js
 * 
 * This file contains core JavaScript functions for the portfolio template
 */

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
  initializeHeader();
  initializeThemeToggle();
  initializeMobileMenu();
  initializeContactForm();
  initializeScrollAnimations();
  initializeTestimonialSlider();
  initializeFAQAccordion();
  handleExternalLinks();
  initializeLazyLoading();
});

/**
 * Initialize header functionality (sticky on scroll)
 */
function initializeHeader() {
  const header = document.querySelector('.site-header');
  
  if (!header) return;
  
  // Add scroll event listener
  window.addEventListener('scroll', function() {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });
  
  // Trigger once on page load
  if (window.scrollY > 50) {
    header.classList.add('scrolled');
  }
}

/**
 * Initialize theme selector
 */
function initializeThemeToggle() {
  const themeSelector = document.getElementById('theme-selector');
  
  if (!themeSelector) return;
  
  // Set the selector to match the current theme
  const currentTheme = document.documentElement.getAttribute('data-theme') || 'creative';
  themeSelector.value = currentTheme;
  
  // Listen for changes
  themeSelector.addEventListener('change', function() {
    const selectedTheme = this.value;
    
    // Update the HTML data attribute
    document.documentElement.setAttribute('data-theme', selectedTheme);
    
    // Save preference to localStorage
    localStorage.setItem('preferred-theme', selectedTheme);
    
    // Refresh hover effects if that function exists
    if (typeof initializeHoverEffects === 'function') {
      initializeHoverEffects();
    }
  });
  
  // Apply saved theme preference on page load
  const savedTheme = localStorage.getItem('preferred-theme');
  if (savedTheme) {
    document.documentElement.setAttribute('data-theme', savedTheme);
    themeSelector.value = savedTheme;
    
    // Refresh hover effects if that function exists
    if (typeof initializeHoverEffects === 'function') {
      initializeHoverEffects();
    }
  }
}

/**
 * Initialize mobile menu toggle
 */
function initializeMobileMenu() {
  const menuToggle = document.querySelector('.mobile-menu-toggle');
  const mainNav = document.querySelector('.main-nav');
  
  if (!menuToggle || !mainNav) return;
  
  menuToggle.addEventListener('click', function() {
    // Toggle menu visibility
    mainNav.classList.toggle('show');
    
    // Toggle button active state
    this.classList.toggle('active');
    
    // Toggle ARIA attributes for accessibility
    const expanded = this.getAttribute('aria-expanded') === 'true' || false;
    this.setAttribute('aria-expanded', !expanded);
  });
  
  // Add aria attributes
  menuToggle.setAttribute('aria-expanded', 'false');
  menuToggle.setAttribute('aria-controls', 'main-navigation');
  menuToggle.setAttribute('aria-label', 'Toggle Navigation Menu');
  mainNav.setAttribute('id', 'main-navigation');
  
  // Close menu when clicking outside
  document.addEventListener('click', function(e) {
    if (!menuToggle.contains(e.target) && !mainNav.contains(e.target) && mainNav.classList.contains('show')) {
      mainNav.classList.remove('show');
      menuToggle.classList.remove('active');
      menuToggle.setAttribute('aria-expanded', 'false');
    }
  });
  
  // Close menu when resizing to desktop
  window.addEventListener('resize', function() {
    if (window.innerWidth > 768 && mainNav.classList.contains('show')) {
      mainNav.classList.remove('show');
      menuToggle.classList.remove('active');
      menuToggle.setAttribute('aria-expanded', 'false');
    }
  });
}

/**
 * Initialize contact form
 */
function initializeContactForm() {
  const contactForm = document.getElementById('contact-form');
  
  if (!contactForm) return;
  
  contactForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Validate form
    if (!validateForm(this)) return;
    
    // Get form data
    const formData = new FormData(this);
    const formDataObj = {};
    formData.forEach((value, key) => formDataObj[key] = value);
    
    // Show loading state
    const submitButton = this.querySelector('button[type="submit"]');
    const originalButtonText = submitButton.textContent;
    submitButton.textContent = 'Sending...';
    submitButton.disabled = true;
    
    // Simulate form submission (would be an AJAX call in a real application)
    setTimeout(() => {
      console.log('Form Data:', formDataObj);
      
      // Hide form
      contactForm.style.display = 'none';
      
      // Show success message
      const successMessage = document.createElement('div');
      successMessage.className = 'form-success-message';
      successMessage.innerHTML = `
        <div class="success-icon"><i class="fas fa-check-circle"></i></div>
        <h3>Message Sent Successfully!</h3>
        <p>Thank you for reaching out. I'll get back to you as soon as possible.</p>
      `;
      
      // Insert success message
      contactForm.parentNode.insertBefore(successMessage, contactForm.nextSibling);
      
      // Reset form
      contactForm.reset();
      
      // Reset button
      submitButton.textContent = originalButtonText;
      submitButton.disabled = false;
    }, 1500);
  });
  
  // Form validation
  function validateForm(form) {
    let isValid = true;
    const inputs = form.querySelectorAll('input, textarea');
    
    inputs.forEach(input => {
      // Reset previous error messages
      const errorMessage = input.nextElementSibling;
      if (errorMessage && errorMessage.classList.contains('error-message')) {
        errorMessage.remove();
      }
      
      if (input.hasAttribute('required') && !input.value.trim()) {
        createErrorMessage(input, 'This field is required');
        isValid = false;
      } else if (input.type === 'email' && input.value.trim() && !validateEmail(input.value)) {
        createErrorMessage(input, 'Please enter a valid email address');
        isValid = false;
      }
    });
    
    return isValid;
  }
  
  // Create error message
  function createErrorMessage(input, message) {
    const errorMessage = document.createElement('div');
    errorMessage.className = 'error-message';
    errorMessage.textContent = message;
    errorMessage.style.color = 'red';
    errorMessage.style.fontSize = '1.4rem';
    errorMessage.style.marginTop = '5px';
    
    input.parentNode.insertBefore(errorMessage, input.nextSibling);
    input.style.borderColor = 'red';
    
    // Remove error when input changes
    input.addEventListener('input', function() {
      const errorMessage = this.nextElementSibling;
      if (errorMessage && errorMessage.classList.contains('error-message')) {
        errorMessage.remove();
        this.style.borderColor = '';
      }
    }, { once: true });
  }
  
  // Email validation
  function validateEmail(email) {
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  }
}

/**
 * Initialize scroll animations
 */
function initializeScrollAnimations() {
  const animatedElements = document.querySelectorAll('.animate-on-scroll');
  
  if (!animatedElements.length) return;
  
  // Check if IntersectionObserver is supported
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animated');
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    });
    
    animatedElements.forEach(element => {
      observer.observe(element);
    });
  } else {
    // Fallback for browsers that don't support IntersectionObserver
    animatedElements.forEach(element => {
      element.classList.add('animated');
    });
  }
  
  // Animate header text with delay
  const heroTextElements = document.querySelectorAll('.animate-text');
  heroTextElements.forEach((element, index) => {
    element.style.animationDelay = `${index * 0.2}s`;
  });
}

/**
 * Initialize testimonial slider
 */
function initializeTestimonialSlider() {
  const testimonialSlider = document.querySelector('.testimonial-slider');
  
  if (!testimonialSlider) return;
  
  const slides = testimonialSlider.querySelectorAll('.testimonial-slide');
  if (slides.length <= 1) return; // No need for slider with only one slide
  
  const prevBtn = testimonialSlider.querySelector('.testimonial-prev');
  const nextBtn = testimonialSlider.querySelector('.testimonial-next');
  
  let currentSlide = 0;
  let slideInterval;
  
  // Function to show a specific slide
  function goToSlide(index) {
    slides.forEach(slide => slide.classList.remove('active'));
    slides[index].classList.add('active');
    currentSlide = index;
  }
  
  // Initialize first slide
  goToSlide(0);
  
  // Add navigation
  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      goToSlide((currentSlide - 1 + slides.length) % slides.length);
      resetInterval();
    });
  }
  
  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      goToSlide((currentSlide + 1) % slides.length);
      resetInterval();
    });
  }
  
  // Auto rotate slides
  function startSlideInterval() {
    slideInterval = setInterval(() => {
      goToSlide((currentSlide + 1) % slides.length);
    }, 5000);
  }
  
  function resetInterval() {
    clearInterval(slideInterval);
    startSlideInterval();
  }
  
  startSlideInterval();
  
  // Pause on hover
  testimonialSlider.addEventListener('mouseenter', () => {
    clearInterval(slideInterval);
  });
  
  testimonialSlider.addEventListener('mouseleave', () => {
    startSlideInterval();
  });
  
  // Keyboard navigation
  document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') {
      goToSlide((currentSlide - 1 + slides.length) % slides.length);
      resetInterval();
    } else if (e.key === 'ArrowRight') {
      goToSlide((currentSlide + 1) % slides.length);
      resetInterval();
    }
  });
  
  // Touch swipe events
  let touchStartX = 0;
  let touchEndX = 0;
  
  testimonialSlider.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
  }, { passive: true });
  
  testimonialSlider.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
  }, { passive: true });
  
  function handleSwipe() {
    const swipeThreshold = 50; // Minimum distance required for swipe
    
    if (touchEndX < touchStartX - swipeThreshold) {
      // Swipe left, show next slide
      goToSlide((currentSlide + 1) % slides.length);
      resetInterval();
    }
    
    if (touchEndX > touchStartX + swipeThreshold) {
      // Swipe right, show previous slide
      goToSlide((currentSlide - 1 + slides.length) % slides.length);
      resetInterval();
    }
  }
}

/**
 * Initialize FAQ accordion
 */
function initializeFAQAccordion() {
  const faqItems = document.querySelectorAll('.faq-item');
  
  if (!faqItems.length) return;
  
  faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    const answer = item.querySelector('.faq-answer');
    const toggleIcon = item.querySelector('.faq-toggle');
    
    if (!question || !answer) return;
    
    // Add ARIA attributes
    const id = `faq-answer-${Math.floor(Math.random() * 1000)}`;
    answer.setAttribute('id', id);
    question.setAttribute('aria-expanded', 'false');
    question.setAttribute('aria-controls', id);
    
    question.addEventListener('click', () => {
      // Toggle active class
      const isActive = item.classList.toggle('active');
      
      // Update ARIA attributes
      question.setAttribute('aria-expanded', isActive);
      
      // Animate answer height
      if (isActive) {
        answer.style.maxHeight = answer.scrollHeight + 'px';
        // Update icon if available
        if (toggleIcon) {
          toggleIcon.innerHTML = '<i class="fas fa-minus"></i>';
        }
      } else {
        answer.style.maxHeight = '0';
        // Update icon if available
        if (toggleIcon) {
          toggleIcon.innerHTML = '<i class="fas fa-plus"></i>';
        }
      }
      
      // Close other FAQ items
      faqItems.forEach(otherItem => {
        if (otherItem !== item && otherItem.classList.contains('active')) {
          otherItem.classList.remove('active');
          const otherQuestion = otherItem.querySelector('.faq-question');
          const otherAnswer = otherItem.querySelector('.faq-answer');
          const otherToggleIcon = otherItem.querySelector('.faq-toggle');
          
          if (otherQuestion) otherQuestion.setAttribute('aria-expanded', 'false');
          if (otherAnswer) otherAnswer.style.maxHeight = '0';
          if (otherToggleIcon) otherToggleIcon.innerHTML = '<i class="fas fa-plus"></i>';
        }
      });
    });
  });
}

/**
 * Handle external links
 */
function handleExternalLinks() {
  const externalLinks = document.querySelectorAll('a[target="_blank"]');
  
  externalLinks.forEach(link => {
    // Add rel attributes for security if not already present
    if (!link.getAttribute('rel')) {
      link.setAttribute('rel', 'noopener noreferrer');
    }
    
    // Add an indicator for screen readers if not already present
    if (!link.querySelector('.sr-only')) {
      const srOnly = document.createElement('span');
      srOnly.className = 'sr-only';
      srOnly.textContent = '(opens in a new tab)';
      link.appendChild(srOnly);
      
      // Style for screen readers only
      srOnly.style.position = 'absolute';
      srOnly.style.width = '1px';
      srOnly.style.height = '1px';
      srOnly.style.padding = '0';
      srOnly.style.margin = '-1px';
      srOnly.style.overflow = 'hidden';
      srOnly.style.clip = 'rect(0, 0, 0, 0)';
      srOnly.style.whiteSpace = 'nowrap';
      srOnly.style.border = '0';
    }
  });
}

/**
 * Initialize lazy loading for images
 */
function initializeLazyLoading() {
  // Check if IntersectionObserver is supported
  if ('IntersectionObserver' in window) {
    // Get all images with data-src attribute
    const lazyImages = document.querySelectorAll('img[data-src]');
    
    if (!lazyImages.length) return;
    
    const imageObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.src = img.dataset.src;
          
          // Remove data-src attribute once loaded
          img.addEventListener('load', () => {
            img.removeAttribute('data-src');
            img.classList.add('loaded');
          });
          
          imageObserver.unobserve(img);
        }
      });
    });
    
    lazyImages.forEach(img => {
      imageObserver.observe(img);
    });
  } else {
    // Fallback for browsers that don't support IntersectionObserver
    // Simply load all images
    const lazyImages = document.querySelectorAll('img[data-src]');
    
    lazyImages.forEach(img => {
      img.src = img.dataset.src;
      img.removeAttribute('data-src');
      img.classList.add('loaded');
    });
  }
}

/**
 * Animate numbers on scroll
 */
function animateNumbersOnScroll() {
  const numberElements = document.querySelectorAll('.animate-number');
  
  if (!numberElements.length) return;
  
  // Check if IntersectionObserver is supported
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateNumber(entry.target);
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.5
    });
    
    numberElements.forEach(element => {
      observer.observe(element);
    });
  } else {
    // Fallback
    numberElements.forEach(element => {
      animateNumber(element);
    });
  }
  
  function animateNumber(element) {
    const targetNumber = parseInt(element.getAttribute('data-number'));
    const duration = 2000; // 2 seconds
    const startTime = performance.now();
    let currentNumber = 0;
    
    function updateNumber(timestamp) {
      const elapsed = timestamp - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Easing function for smoother animation
      const easeOutQuad = progress * (2 - progress);
      
      currentNumber = Math.floor(easeOutQuad * targetNumber);
      element.textContent = currentNumber.toLocaleString();
      
      if (progress < 1) {
        requestAnimationFrame(updateNumber);
      } else {
        element.textContent = targetNumber.toLocaleString();
      }
    }
    
    requestAnimationFrame(updateNumber);
  }
}

// Call number animations when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
  animateNumbersOnScroll();
});

/**
 * Smooth scroll to anchor links
 */
function initializeSmoothScroll() {
  document.querySelectorAll('a[href^="#"]:not([href="#"])').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      
      const targetId = this.getAttribute('href');
      const targetElement = document.querySelector(targetId);
      
      if (targetElement) {
        // Get header height for offset
        const header = document.querySelector('.site-header');
        const headerHeight = header ? header.offsetHeight : 0;
        
        // Calculate position
        const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - headerHeight - 20;
        
        // Smooth scroll
        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
        
        // Update URL hash without scrolling
        history.pushState(null, null, targetId);
        
        // Set focus to the element for accessibility
        targetElement.setAttribute('tabindex', '-1');
        targetElement.focus({ preventScroll: true });
      }
    });
  });
}

// Initialize smooth scrolling
initializeSmoothScroll();

/**
 * Back to top button
 */
function initializeBackToTop() {
  // Create button if it doesn't exist
  let backToTopBtn = document.querySelector('.back-to-top');
  
  if (!backToTopBtn) {
    backToTopBtn = document.createElement('button');
    backToTopBtn.className = 'back-to-top';
    backToTopBtn.innerHTML = '<i class="fas fa-arrow-up"></i>';
    backToTopBtn.setAttribute('aria-label', 'Back to top');
    backToTopBtn.style.position = 'fixed';
    backToTopBtn.style.bottom = '20px';
    backToTopBtn.style.right = '20px';
    backToTopBtn.style.width = '40px';
    backToTopBtn.style.height = '40px';
    backToTopBtn.style.borderRadius = '50%';
    backToTopBtn.style.backgroundColor = 'var(--primary-color)';
    backToTopBtn.style.color = 'white';
    backToTopBtn.style.border = 'none';
    backToTopBtn.style.display = 'flex';
    backToTopBtn.style.alignItems = 'center';
    backToTopBtn.style.justifyContent = 'center';
    backToTopBtn.style.cursor = 'pointer';
    backToTopBtn.style.opacity = '0';
    backToTopBtn.style.transition = 'opacity 0.3s ease';
    backToTopBtn.style.zIndex = '999';
    backToTopBtn.style.boxShadow = '0 2px 5px rgba(0, 0, 0, 0.2)';
    document.body.appendChild(backToTopBtn);
  }
  
  // Show/hide button based on scroll position
  window.addEventListener('scroll', function() {
    if (window.scrollY > 300) {
      backToTopBtn.style.opacity = '1';
    } else {
      backToTopBtn.style.opacity = '0';
    }
  });
  
  // Scroll to top when clicked
  backToTopBtn.addEventListener('click', function() {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
}

// Initialize back to top button
initializeBackToTop();

/**
 * Page transition effects
 */
function initializePageTransitions() {
  // Add transition overlay if it doesn't exist
  let transitionOverlay = document.querySelector('.page-transition-overlay');
  
  if (!transitionOverlay) {
    transitionOverlay = document.createElement('div');
    transitionOverlay.className = 'page-transition-overlay';
    transitionOverlay.style.position = 'fixed';
    transitionOverlay.style.top = '0';
    transitionOverlay.style.left = '0';
    transitionOverlay.style.width = '100%';
    transitionOverlay.style.height = '100%';
    transitionOverlay.style.backgroundColor = 'var(--primary-color)';
    transitionOverlay.style.zIndex = '9999';
    transitionOverlay.style.transform = 'translateY(100%)';
    transitionOverlay.style.transition = 'transform 0.5s ease';
    document.body.appendChild(transitionOverlay);
  }
  
  // Add animation when page loads
  window.addEventListener('load', function() {
    transitionOverlay.style.transform = 'translateY(100%)';
  });
  
  // Add animation when leaving page
  document.querySelectorAll('a:not([href^="#"]):not([target="_blank"])').forEach(link => {
    link.addEventListener('click', function(e) {
      // Skip if user is holding ctrl or cmd key
      if (e.ctrlKey || e.metaKey) return;
      
      const href = this.getAttribute('href');
      
      // Skip for external links, anchors, or javascript links
      if (!href || href.startsWith('#') || href.startsWith('javascript:') || href.startsWith('mailto:') || href.startsWith('tel:')) {
        return;
      }
      
      e.preventDefault();
      
      // Show transition overlay
      transitionOverlay.style.transform = 'translateY(0)';
      
      // Navigate to the new page after animation
      setTimeout(() => {
        window.location.href = href;
      }, 500);
    });
  });
}

// Initialize page transitions
// Comment out if you don't want page transitions
// initializePageTransitions();