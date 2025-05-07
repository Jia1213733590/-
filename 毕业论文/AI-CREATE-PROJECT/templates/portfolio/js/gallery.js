/**
 * Portfolio - Gallery Functions
 * templates/portfolio/js/gallery.js
 * 
 * This file contains JavaScript functions for portfolio gallery display and interaction
 */

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
  initializeGallery();
  initializeFilters();
  initializeAnimations();
  initializeLightbox();
  initializeMasonry();
  initializeInfiniteScroll();
  initializeWorkDetail();
});

/**
 * Initialize main gallery functionality
 */
function initializeGallery() {
  const gallery = document.querySelector('.portfolio-gallery');
  
  if (!gallery) return;
  
  // Get all gallery items
  const items = gallery.querySelectorAll('.gallery-item');
  
  // Set up hover effect
  items.forEach(item => {
    const overlay = item.querySelector('.item-overlay');
    const image = item.querySelector('img');
    
    if (!overlay || !image) return;
    
    // Add hover effect
    item.addEventListener('mouseenter', function() {
      overlay.style.opacity = '1';
      image.style.transform = 'scale(1.05)';
    });
    
    item.addEventListener('mouseleave', function() {
      overlay.style.opacity = '0';
      image.style.transform = 'scale(1)';
    });
    
    // Add click event to open lightbox or go to detail page
    item.addEventListener('click', function(e) {
      const link = item.querySelector('a');
      const lightboxTrigger = item.querySelector('.lightbox-trigger');
      
      // If clicked on lightbox trigger, prevent navigation
      if (lightboxTrigger && lightboxTrigger.contains(e.target)) {
        e.preventDefault();
        openLightbox(this);
      }
    });
  });
}

/**
 * Initialize portfolio filters
 */
function initializeFilters() {
  const filterContainer = document.querySelector('.portfolio-filters');
  
  if (!filterContainer) return;
  
  const filters = filterContainer.querySelectorAll('.filter');
  const galleryItems = document.querySelectorAll('.gallery-item');
  
  filters.forEach(filter => {
    filter.addEventListener('click', function(e) {
      e.preventDefault();
      
      // Remove active class from all filters
      filters.forEach(f => f.classList.remove('active'));
      
      // Add active class to clicked filter
      this.classList.add('active');
      
      // Get filter value
      const filterValue = this.getAttribute('data-filter');
      
      // Filter items
      if (filterValue === 'all') {
        // Show all items
        galleryItems.forEach(item => {
          item.style.display = 'block';
          setTimeout(() => {
            item.classList.add('visible');
          }, 50);
        });
      } else {
        // Filter items by category
        galleryItems.forEach(item => {
          const itemCategories = item.getAttribute('data-category').split(' ');
          
          if (itemCategories.includes(filterValue)) {
            item.style.display = 'block';
            setTimeout(() => {
              item.classList.add('visible');
            }, 50);
          } else {
            item.classList.remove('visible');
            setTimeout(() => {
              item.style.display = 'none';
            }, 300); // Match the transition duration
          }
        });
      }
      
      // Reinitialize masonry layout after filtering
      if (typeof initializeMasonry === 'function') {
        setTimeout(initializeMasonry, 500);
      }
    });
  });
}

/**
 * Initialize scroll and entrance animations
 */
function initializeAnimations() {
  // Add animation to gallery items on scroll
  const galleryItems = document.querySelectorAll('.gallery-item, .animated-element');
  
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
      threshold: 0.1
    });
    
    galleryItems.forEach(item => {
      observer.observe(item);
    });
  } else {
    // Fallback for browsers that don't support IntersectionObserver
    galleryItems.forEach(item => {
      item.classList.add('animated');
    });
  }
}

/**
 * Initialize lightbox functionality
 */
function initializeLightbox() {
  // Create lightbox elements if they don't exist
  if (!document.querySelector('.portfolio-lightbox')) {
    const lightbox = document.createElement('div');
    lightbox.className = 'portfolio-lightbox';
    lightbox.innerHTML = `
      <div class="lightbox-container">
        <button class="lightbox-close">&times;</button>
        <div class="lightbox-content">
          <img src="" alt="Lightbox Image">
        </div>
        <div class="lightbox-caption"></div>
        <button class="lightbox-prev">&lsaquo;</button>
        <button class="lightbox-next">&rsaquo;</button>
      </div>
    `;
    document.body.appendChild(lightbox);
    
    // Close lightbox when clicking close button or outside the image
    const closeBtn = lightbox.querySelector('.lightbox-close');
    closeBtn.addEventListener('click', closeLightbox);
    
    lightbox.addEventListener('click', function(e) {
      if (e.target === this) {
        closeLightbox();
      }
    });
    
    // Add keyboard navigation
    document.addEventListener('keydown', function(e) {
      if (!lightbox.classList.contains('active')) return;
      
      if (e.key === 'Escape') {
        closeLightbox();
      } else if (e.key === 'ArrowLeft') {
        navigateLightbox('prev');
      } else if (e.key === 'ArrowRight') {
        navigateLightbox('next');
      }
    });
    
    // Add navigation buttons
    const prevBtn = lightbox.querySelector('.lightbox-prev');
    const nextBtn = lightbox.querySelector('.lightbox-next');
    
    prevBtn.addEventListener('click', function() {
      navigateLightbox('prev');
    });
    
    nextBtn.addEventListener('click', function() {
      navigateLightbox('next');
    });
  }
  
  // Add click events to lightbox triggers
  const lightboxTriggers = document.querySelectorAll('.lightbox-trigger');
  
  lightboxTriggers.forEach(trigger => {
    trigger.addEventListener('click', function(e) {
      e.preventDefault();
      const galleryItem = this.closest('.gallery-item');
      if (galleryItem) {
        openLightbox(galleryItem);
      }
    });
  });
}

/**
 * Open lightbox
 * @param {HTMLElement} item - Gallery item to display in lightbox
 */
function openLightbox(item) {
  const lightbox = document.querySelector('.portfolio-lightbox');
  if (!lightbox) return;
  
  const lightboxImg = lightbox.querySelector('img');
  const lightboxCaption = lightbox.querySelector('.lightbox-caption');
  
  // Get item details
  const imgSrc = item.getAttribute('data-full-img') || item.querySelector('img').src;
  const caption = item.getAttribute('data-caption') || '';
  
  // Set item index for navigation
  lightbox.setAttribute('data-current-index', Array.from(document.querySelectorAll('.gallery-item')).indexOf(item));
  
  // Set image source and caption
  lightboxImg.src = imgSrc;
  lightboxCaption.textContent = caption;
  
  // Show lightbox
  lightbox.classList.add('active');
  document.body.style.overflow = 'hidden'; // Prevent scrolling
}

/**
 * Close lightbox
 */
function closeLightbox() {
  const lightbox = document.querySelector('.portfolio-lightbox');
  if (!lightbox) return;
  
  lightbox.classList.remove('active');
  document.body.style.overflow = ''; // Restore scrolling
}

/**
 * Navigate between lightbox images
 * @param {string} direction - Direction to navigate ('prev' or 'next')
 */
function navigateLightbox(direction) {
  const lightbox = document.querySelector('.portfolio-lightbox');
  if (!lightbox) return;
  
  const galleryItems = document.querySelectorAll('.gallery-item');
  let currentIndex = parseInt(lightbox.getAttribute('data-current-index'));
  
  if (direction === 'prev') {
    currentIndex = (currentIndex - 1 + galleryItems.length) % galleryItems.length;
  } else {
    currentIndex = (currentIndex + 1) % galleryItems.length;
  }
  
  openLightbox(galleryItems[currentIndex]);
}

/**
 * Initialize masonry layout
 */
function initializeMasonry() {
  const gallery = document.querySelector('.portfolio-gallery.masonry-layout');
  
  if (!gallery) return;
  
  // Check if imagesLoaded and Masonry libraries are available
  if (typeof imagesLoaded === 'function' && typeof Masonry === 'function') {
    imagesLoaded(gallery, function() {
      const masonry = new Masonry(gallery, {
        itemSelector: '.gallery-item',
        columnWidth: '.grid-sizer',
        percentPosition: true,
        gutter: 30
      });
    });
  } else {
    // Fallback to CSS grid if libraries are not available
    gallery.style.display = 'grid';
    gallery.style.gridTemplateColumns = 'repeat(auto-fill, minmax(300px, 1fr))';
    gallery.style.gridGap = '30px';
  }
}

/**
 * Initialize infinite scroll
 */
function initializeInfiniteScroll() {
  const loadMoreBtn = document.querySelector('.load-more-btn');
  
  if (!loadMoreBtn) return;
  
  loadMoreBtn.addEventListener('click', function() {
    // Show loading state
    this.classList.add('loading');
    this.textContent = 'Loading...';
    
    // Simulate loading more items (in a real app, you would fetch from server)
    setTimeout(() => {
      // Create new items (This is just a demo)
      const gallery = document.querySelector('.portfolio-gallery');
      const existingItems = gallery.querySelectorAll('.gallery-item');
      
      // Clone some existing items as an example
      for (let i = 0; i < Math.min(6, existingItems.length); i++) {
        const clone = existingItems[i].cloneNode(true);
        gallery.appendChild(clone);
      }
      
      // Initialize newly added items
      initializeGallery();
      
      // Reinitialize masonry layout
      if (typeof initializeMasonry === 'function') {
        initializeMasonry();
      }
      
      // Reset button state
      this.classList.remove('loading');
      this.textContent = 'Load More';
      
      // Hide button if we want to simulate the end of available items
      if (gallery.querySelectorAll('.gallery-item').length > 20) {
        this.style.display = 'none';
      }
    }, 1000);
  });
}

/**
 * Initialize work detail page
 */
function initializeWorkDetail() {
  const workDetail = document.querySelector('.work-detail');
  
  if (!workDetail) return;
  
  // Initialize image slider if exists
  const slider = workDetail.querySelector('.work-slider');
  
  if (slider) {
    const slides = slider.querySelectorAll('.slide');
    const prevBtn = slider.querySelector('.slider-prev');
    const nextBtn = slider.querySelector('.slider-next');
    const dots = slider.querySelector('.slider-dots');
    
    let currentSlide = 0;
    
    // Create dots if they don't exist
    if (dots && !dots.children.length) {
      slides.forEach((_, index) => {
        const dot = document.createElement('span');
        dot.className = 'dot';
        if (index === 0) dot.classList.add('active');
        dot.dataset.slide = index;
        dots.appendChild(dot);
        
        dot.addEventListener('click', () => {
          goToSlide(index);
        });
      });
    }
    
    // Function to show a specific slide
    function goToSlide(index) {
      slides[currentSlide].classList.remove('active');
      const dotElements = dots ? dots.querySelectorAll('.dot') : [];
      if (dotElements.length) {
        dotElements[currentSlide].classList.remove('active');
      }
      
      currentSlide = index;
      
      slides[currentSlide].classList.add('active');
      if (dotElements.length) {
        dotElements[currentSlide].classList.add('active');
      }
    }
    
    // Add navigation
    if (prevBtn) {
      prevBtn.addEventListener('click', () => {
        goToSlide((currentSlide - 1 + slides.length) % slides.length);
      });
    }
    
    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        goToSlide((currentSlide + 1) % slides.length);
      });
    }
    
    // Auto slide (optional)
    let slideInterval;
    
    function startSlideInterval() {
      slideInterval = setInterval(() => {
        goToSlide((currentSlide + 1) % slides.length);
      }, 5000);
    }
    
    function stopSlideInterval() {
      clearInterval(slideInterval);
    }
    
    startSlideInterval();
    
    // Stop interval on hover
    slider.addEventListener('mouseenter', stopSlideInterval);
    slider.addEventListener('mouseleave', startSlideInterval);
  }
  
  // Initialize related works
  const relatedWorks = workDetail.querySelector('.related-works');
  
  if (relatedWorks) {
    const items = relatedWorks.querySelectorAll('.gallery-item');
    
    items.forEach(item => {
      const overlay = item.querySelector('.item-overlay');
      const image = item.querySelector('img');
      
      if (!overlay || !image) return;
      
      // Add hover effect
      item.addEventListener('mouseenter', function() {
        overlay.style.opacity = '1';
        image.style.transform = 'scale(1.05)';
      });
      
      item.addEventListener('mouseleave', function() {
        overlay.style.opacity = '0';
        image.style.transform = 'scale(1)';
      });
    });
  }
}

/**
 * Initialize isotope filtering (if the library is available)
 */
function initializeIsotope() {
  const gallery = document.querySelector('.portfolio-gallery');
  
  if (!gallery) return;
  
  // Check if Isotope is available
  if (typeof Isotope === 'function') {
    // Initialize isotope
    const iso = new Isotope(gallery, {
      itemSelector: '.gallery-item',
      layoutMode: 'fitRows',
      percentPosition: true
    });
    
    // Filter items on button click
    const filterButtons = document.querySelectorAll('.portfolio-filters .filter');
    
    filterButtons.forEach(button => {
      button.addEventListener('click', function(e) {
        e.preventDefault();
        
        const filterValue = this.getAttribute('data-filter');
        
        // Remove active class from all buttons
        filterButtons.forEach(btn => btn.classList.remove('active'));
        
        // Add active class to clicked button
        this.classList.add('active');
        
        // Filter items
        iso.arrange({
          filter: filterValue === 'all' ? '*' : `.${filterValue}`
        });
      });
    });
  }
}

/**
 * Initialize hover effects for different styles
 */
function initializeHoverEffects() {
  // Get theme style
  const htmlElement = document.documentElement;
  const theme = htmlElement.getAttribute('data-theme') || 'creative';
  
  const galleryItems = document.querySelectorAll('.gallery-item');
  
  galleryItems.forEach(item => {
    const overlay = item.querySelector('.item-overlay');
    const image = item.querySelector('img');
    const caption = item.querySelector('.item-caption');
    
    if (!overlay || !image) return;
    
    // Remove any existing classes
    item.classList.remove('hover-effect-zoom', 'hover-effect-slide', 'hover-effect-fade', 'hover-effect-flip');
    
    // Add theme-specific hover effect
    switch(theme) {
      case 'creative':
        item.classList.add('hover-effect-zoom');
        break;
      case 'minimal':
        item.classList.add('hover-effect-fade');
        break;
      case 'modern':
        item.classList.add('hover-effect-slide');
        break;
      case 'artistic':
        item.classList.add('hover-effect-flip');
        break;
      case 'professional':
        item.classList.add('hover-effect-zoom');
        break;
      default:
        item.classList.add('hover-effect-fade');
    }
  });
}

// Call hover effects initialization
initializeHoverEffects();

/**
 * Initialize filtering by URL params if present
 */
function initializeUrlFiltering() {
  // Check if there are URL parameters for filtering
  const urlParams = new URLSearchParams(window.location.search);
  const categoryParam = urlParams.get('category');
  
  if (categoryParam) {
    // Find the corresponding filter button and click it
    const filterButton = document.querySelector(`.portfolio-filters .filter[data-filter="${categoryParam}"]`);
    
    if (filterButton) {
      filterButton.click();
    }
  }
}

// Initialize URL filtering
initializeUrlFiltering();