/**
 * Ecommerce Website - Core Functions
 * templates/ecommerce/js/functions.js
 * 
 * This file contains common JavaScript functions used across the ecommerce website
 */

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
  // Initialize all components
  initializeNavigation();
  initializeSlider();
  initializeProductActions();
  initializeQuantitySelectors();
  initializeProductTabs();
  initializeProductGallery();
  initializeCountdown();
  initializeTooltips();
  initializeMobileMenu();
  initializeScrollTop();
  
  // Cart and checkout specific initialization
  if (document.querySelector('.cart-page')) {
    initializeCartPage();
  }
  
  if (document.querySelector('.checkout-page')) {
    initializeCheckoutPage();
  }
  
  if (document.querySelector('.product-detail')) {
    initializeProductDetail();
  }
});

/**
 * Navigation functions
 */
function initializeNavigation() {
  // Add active class to current page in navigation
  const currentLocation = window.location.pathname;
  const navLinks = document.querySelectorAll('nav a');
  
  navLinks.forEach(link => {
    if (link.getAttribute('href') === currentLocation) {
      link.classList.add('active');
    }
    
    // Mobile dropdown toggle
    if (link.nextElementSibling && link.nextElementSibling.classList.contains('dropdown-menu')) {
      link.addEventListener('click', function(e) {
        if (window.innerWidth < 992) {
          e.preventDefault();
          this.nextElementSibling.classList.toggle('show');
        }
      });
    }
  });
}

/**
 * Mobile menu toggle
 */
function initializeMobileMenu() {
  const menuToggle = document.querySelector('.mobile-menu-toggle');
  const mainNav = document.querySelector('.main-nav');
  
  if (menuToggle && mainNav) {
    menuToggle.addEventListener('click', function() {
      mainNav.classList.toggle('show');
      this.classList.toggle('active');
    });
    
    // Close menu when clicking outside
    document.addEventListener('click', function(e) {
      if (!mainNav.contains(e.target) && !menuToggle.contains(e.target)) {
        mainNav.classList.remove('show');
        menuToggle.classList.remove('active');
      }
    });
  }
}

/**
 * Hero slider functionality
 */
function initializeSlider() {
  const sliderContainer = document.querySelector('.slider-container');
  
  if (!sliderContainer) return;
  
  const slides = sliderContainer.querySelectorAll('.slide');
  const dotsContainer = document.querySelector('.slider-dots');
  const prevBtn = document.querySelector('.slider-prev');
  const nextBtn = document.querySelector('.slider-next');
  
  if (slides.length === 0) return;
  
  let currentSlide = 0;
  let slideInterval;
  const intervalTime = 5000;
  
  // Create dots if they don't exist
  if (dotsContainer && !dotsContainer.children.length) {
    slides.forEach((_, i) => {
      const dot = document.createElement('span');
      dot.classList.add('dot');
      if (i === 0) dot.classList.add('active');
      dot.dataset.slide = i;
      dotsContainer.appendChild(dot);
      
      dot.addEventListener('click', () => {
        goToSlide(i);
        resetInterval();
      });
    });
  }
  
  // Function to go to a specific slide
  function goToSlide(n) {
    slides[currentSlide].classList.remove('active');
    const dots = document.querySelectorAll('.dot');
    if (dots.length) {
      dots[currentSlide].classList.remove('active');
    }
    
    currentSlide = (n + slides.length) % slides.length;
    
    slides[currentSlide].classList.add('active');
    if (dots.length) {
      dots[currentSlide].classList.add('active');
    }
  }
  
  // Next slide function
  function nextSlide() {
    goToSlide(currentSlide + 1);
  }
  
  // Previous slide function
  function prevSlide() {
    goToSlide(currentSlide - 1);
  }
  
  // Reset interval function
  function resetInterval() {
    clearInterval(slideInterval);
    slideInterval = setInterval(nextSlide, intervalTime);
  }
  
  // Add event listeners to buttons
  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      prevSlide();
      resetInterval();
    });
  }
  
  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      nextSlide();
      resetInterval();
    });
  }
  
  // Set initial interval
  slideInterval = setInterval(nextSlide, intervalTime);
  
  // Stop interval on hover
  sliderContainer.addEventListener('mouseenter', () => {
    clearInterval(slideInterval);
  });
  
  sliderContainer.addEventListener('mouseleave', () => {
    slideInterval = setInterval(nextSlide, intervalTime);
  });
}

/**
 * Product actions (quick view, add to cart, wishlist)
 */
function initializeProductActions() {
  // Quick view buttons
  const quickViewButtons = document.querySelectorAll('.quick-view-btn');
  
  quickViewButtons.forEach(button => {
    button.addEventListener('click', function(e) {
      e.preventDefault();
      const productId = this.dataset.productId;
      openQuickView(productId);
    });
  });
  
  // Add to cart buttons
  const addToCartButtons = document.querySelectorAll('.add-to-cart-btn, .product-card .cart-btn');
  
  addToCartButtons.forEach(button => {
    button.addEventListener('click', function(e) {
      e.preventDefault();
      const productId = this.dataset.productId;
      const quantity = 1;
      
      addToCart(productId, quantity);
    });
  });
  
  // Wishlist buttons
  const wishlistButtons = document.querySelectorAll('.wishlist-btn, .product-card .wishlist-btn');
  
  wishlistButtons.forEach(button => {
    button.addEventListener('click', function(e) {
      e.preventDefault();
      const productId = this.dataset.productId;
      
      toggleWishlist(productId);
      this.classList.toggle('active');
    });
  });
}

/**
 * Open quick view modal
 * @param {string} productId - Product ID to fetch details
 */
function openQuickView(productId) {
  // This is a simplified version. In a real implementation, you would:
  // 1. Fetch product data from an API or data source
  // 2. Populate the modal with the data
  // 3. Show the modal
  
  const modal = document.querySelector('.quick-view-modal');
  
  if (!modal) return;
  
  // For demonstration, we'll just show the modal with placeholder
  modal.style.display = 'flex';
  modal.querySelector('.modal-content').innerHTML = `
    <div class="modal-header">
      <h3>Product Quick View</h3>
      <button class="close-modal">&times;</button>
    </div>
    <div class="modal-body">
      <p>Loading product ID: ${productId}...</p>
    </div>
  `;
  
  // Close modal when clicking the close button
  modal.querySelector('.close-modal').addEventListener('click', () => {
    modal.style.display = 'none';
  });
  
  // Close modal when clicking outside the content
  modal.addEventListener('click', function(e) {
    if (e.target === this) {
      this.style.display = 'none';
    }
  });
}

/**
 * Add product to cart
 * @param {string} productId - Product ID to add to cart
 * @param {number} quantity - Quantity to add
 */
function addToCart(productId, quantity) {
  // This is a simplified version. In a real implementation, you would:
  // 1. Add the product to cart (localStorage or send to server)
  // 2. Update the cart count in the header
  // 3. Show a confirmation message
  
  // For demonstration, we'll use localStorage
  let cart = JSON.parse(localStorage.getItem('cart')) || [];
  
  // Check if product already exists in cart
  const existingProduct = cart.find(item => item.productId === productId);
  
  if (existingProduct) {
    existingProduct.quantity += quantity;
  } else {
    cart.push({ productId, quantity });
  }
  
  // Save cart to localStorage
  localStorage.setItem('cart', JSON.stringify(cart));
  
  // Update cart count in header
  updateCartCount();
  
  // Show confirmation message
  showNotification('Product added to cart successfully!', 'success');
}

/**
 * Toggle product in wishlist
 * @param {string} productId - Product ID to toggle in wishlist
 */
function toggleWishlist(productId) {
  // This is a simplified version. In a real implementation, you would:
  // 1. Add/remove the product to/from wishlist (localStorage or send to server)
  // 2. Update the wishlist count in the header if needed
  // 3. Show a confirmation message
  
  // For demonstration, we'll use localStorage
  let wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
  
  // Check if product already exists in wishlist
  const existingIndex = wishlist.findIndex(item => item === productId);
  
  if (existingIndex >= 0) {
    // Remove from wishlist
    wishlist.splice(existingIndex, 1);
    showNotification('Product removed from wishlist!', 'info');
  } else {
    // Add to wishlist
    wishlist.push(productId);
    showNotification('Product added to wishlist!', 'success');
  }
  
  // Save wishlist to localStorage
  localStorage.setItem('wishlist', JSON.stringify(wishlist));
  
  // Update wishlist count in header if needed
  updateWishlistCount();
}

/**
 * Update cart count in header
 */
function updateCartCount() {
  const cart = JSON.parse(localStorage.getItem('cart')) || [];
  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);
  
  const cartCountElements = document.querySelectorAll('.cart-count');
  
  cartCountElements.forEach(element => {
    element.textContent = cartCount;
    
    if (cartCount > 0) {
      element.classList.add('has-items');
    } else {
      element.classList.remove('has-items');
    }
  });
}

/**
 * Update wishlist count in header
 */
function updateWishlistCount() {
  const wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
  const wishlistCount = wishlist.length;
  
  const wishlistCountElements = document.querySelectorAll('.wishlist-count');
  
  wishlistCountElements.forEach(element => {
    element.textContent = wishlistCount;
    
    if (wishlistCount > 0) {
      element.classList.add('has-items');
    } else {
      element.classList.remove('has-items');
    }
  });
}

/**
 * Show notification message
 * @param {string} message - Message to display
 * @param {string} type - Notification type (success, error, info, warning)
 */
function showNotification(message, type = 'info') {
  // Create notification element
  const notification = document.createElement('div');
  notification.className = `notification ${type}`;
  notification.innerHTML = `
    <div class="notification-content">
      <span class="notification-message">${message}</span>
      <button class="notification-close">&times;</button>
    </div>
  `;
  
  // Add to DOM
  document.body.appendChild(notification);
  
  // Show notification
  setTimeout(() => {
    notification.classList.add('show');
  }, 10);
  
  // Auto-hide after 3 seconds
  setTimeout(() => {
    notification.classList.remove('show');
    setTimeout(() => {
      notification.remove();
    }, 300);
  }, 3000);
  
  // Close button
  notification.querySelector('.notification-close').addEventListener('click', () => {
    notification.classList.remove('show');
    setTimeout(() => {
      notification.remove();
    }, 300);
  });
}

/**
 * Quantity selector functionality
 */
function initializeQuantitySelectors() {
  const quantitySelectors = document.querySelectorAll('.quantity-selector');
  
  quantitySelectors.forEach(selector => {
    const minusBtn = selector.querySelector('.quantity-minus');
    const plusBtn = selector.querySelector('.quantity-plus');
    const input = selector.querySelector('input');
    
    if (!minusBtn || !plusBtn || !input) return;
    
    minusBtn.addEventListener('click', () => {
      let value = parseInt(input.value);
      if (value > 1) {
        input.value = value - 1;
        // Trigger change event for any listeners
        input.dispatchEvent(new Event('change'));
      }
    });
    
    plusBtn.addEventListener('click', () => {
      let value = parseInt(input.value);
      // You might want to add a max quantity check here
      input.value = value + 1;
      // Trigger change event for any listeners
      input.dispatchEvent(new Event('change'));
    });
    
    // Validate input to allow only numbers
    input.addEventListener('input', () => {
      let value = parseInt(input.value);
      if (isNaN(value) || value < 1) {
        input.value = 1;
      }
    });
  });
}

/**
 * Product tabs functionality
 */
function initializeProductTabs() {
  const tabsContainer = document.querySelector('.product-tabs');
  
  if (!tabsContainer) return;
  
  const tabButtons = tabsContainer.querySelectorAll('.tab-btn');
  const tabContents = tabsContainer.querySelectorAll('.tab-content');
  
  tabButtons.forEach(button => {
    button.addEventListener('click', () => {
      // Remove active class from all buttons and contents
      tabButtons.forEach(btn => btn.classList.remove('active'));
      tabContents.forEach(content => content.classList.remove('active'));
      
      // Add active class to clicked button
      button.classList.add('active');
      
      // Get target tab and show it
      const target = button.dataset.tab;
      const tabContent = tabsContainer.querySelector(`.tab-content[data-tab="${target}"]`);
      
      if (tabContent) {
        tabContent.classList.add('active');
      }
    });
  });
}

/**
 * Product gallery functionality (thumbnail switching)
 */
function initializeProductGallery() {
  const productImages = document.querySelector('.product-images');
  
  if (!productImages) return;
  
  const mainImage = productImages.querySelector('.main-image img');
  const thumbnails = productImages.querySelectorAll('.thumbnail');
  
  thumbnails.forEach(thumbnail => {
    thumbnail.addEventListener('click', function() {
      // Update active thumbnail
      thumbnails.forEach(thumb => thumb.classList.remove('active'));
      this.classList.add('active');
      
      // Update main image
      if (mainImage) {
        mainImage.src = this.querySelector('img').src;
      }
    });
  });
}

/**
 * Initialize cart page functionality
 */
function initializeCartPage() {
  // Cart quantity update
  const quantitySelectors = document.querySelectorAll('.cart-quantity .quantity-selector');
  
  quantitySelectors.forEach(selector => {
    const input = selector.querySelector('input');
    const productId = selector.dataset.productId;
    
    if (!input || !productId) return;
    
    input.addEventListener('change', () => {
      updateCartItemQuantity(productId, parseInt(input.value));
    });
  });
  
  // Remove item buttons
  const removeButtons = document.querySelectorAll('.cart-remove');
  
  removeButtons.forEach(button => {
    button.addEventListener('click', function() {
      const productId = this.dataset.productId;
      removeCartItem(productId);
      
      // Remove the row from the table
      const row = this.closest('tr');
      if (row) {
        row.remove();
      }
      
      // Update cart totals
      updateCartTotals();
    });
  });
  
  // Update cart on page load
  updateCartTotals();
}

/**
 * Update cart item quantity
 * @param {string} productId - Product ID to update
 * @param {number} quantity - New quantity
 */
function updateCartItemQuantity(productId, quantity) {
  // Get cart from localStorage
  let cart = JSON.parse(localStorage.getItem('cart')) || [];
  
  // Find the product in cart
  const product = cart.find(item => item.productId === productId);
  
  if (product) {
    product.quantity = quantity;
    
    // Save updated cart
    localStorage.setItem('cart', JSON.stringify(cart));
    
    // Update cart count in header
    updateCartCount();
    
    // Update cart totals
    updateCartTotals();
  }
}

/**
 * Remove item from cart
 * @param {string} productId - Product ID to remove
 */
function removeCartItem(productId) {
  // Get cart from localStorage
  let cart = JSON.parse(localStorage.getItem('cart')) || [];
  
  // Filter out the product
  cart = cart.filter(item => item.productId !== productId);
  
  // Save updated cart
  localStorage.setItem('cart', JSON.stringify(cart));
  
  // Update cart count in header
  updateCartCount();
  
  // Show notification
  showNotification('Product removed from cart!', 'info');
}

/**
 * Update cart totals
 */
function updateCartTotals() {
  // This is a simplified version. In a real implementation,
  // you would fetch product prices from a database.
  // Here we'll use placeholder values
  
  const subtotalElement = document.querySelector('.cart-subtotal .amount');
  const shippingElement = document.querySelector('.cart-shipping .amount');
  const discountElement = document.querySelector('.cart-discount .amount');
  const totalElement = document.querySelector('.cart-total .amount');
  
  if (!subtotalElement || !totalElement) return;
  
  // Get cart from localStorage
  const cart = JSON.parse(localStorage.getItem('cart')) || [];
  
  // For demonstration, we'll use a fixed price for all products
  const subtotal = cart.reduce((total, item) => total + (item.quantity * 99), 0);
  const shipping = subtotal > 0 ? 10 : 0;
  const discount = 0;
  const total = subtotal + shipping - discount;
  
  // Update elements
  subtotalElement.textContent = `$${subtotal.toFixed(2)}`;
  if (shippingElement) {
    shippingElement.textContent = shipping > 0 ? `$${shipping.toFixed(2)}` : 'Free';
  }
  if (discountElement) {
    discountElement.textContent = `-$${discount.toFixed(2)}`;
  }
  totalElement.textContent = `$${total.toFixed(2)}`;
  
  // If cart is empty, show empty message
  const cartTable = document.querySelector('.cart-table');
  const emptyCartMessage = document.querySelector('.empty-cart-message');
  
  if (cartTable && emptyCartMessage) {
    if (cart.length === 0) {
      cartTable.style.display = 'none';
      emptyCartMessage.style.display = 'block';
    } else {
      cartTable.style.display = 'table';
      emptyCartMessage.style.display = 'none';
    }
  }
}

/**
 * Initialize checkout page functionality
 */
function initializeCheckoutPage() {
  // Payment method selection
  const paymentMethods = document.querySelectorAll('.payment-method');
  
  paymentMethods.forEach(method => {
    const radio = method.querySelector('input[type="radio"]');
    
    if (!radio) return;
    
    radio.addEventListener('change', function() {
      // Hide all payment details
      document.querySelectorAll('.payment-details').forEach(details => {
        details.style.display = 'none';
      });
      
      // Remove active class from all methods
      paymentMethods.forEach(m => m.classList.remove('active'));
      
      // Show selected payment details
      if (this.checked) {
        const methodContainer = this.closest('.payment-method');
        methodContainer.classList.add('active');
        
        const details = methodContainer.querySelector('.payment-details');
        if (details) {
          details.style.display = 'block';
        }
      }
    });
  });
  
  // Form validation
  const checkoutForm = document.querySelector('.checkout-form form');
  
  if (checkoutForm) {
    checkoutForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      // Simple validation
      let valid = true;
      const requiredFields = this.querySelectorAll('[required]');
      
      requiredFields.forEach(field => {
        if (!field.value.trim()) {
          valid = false;
          field.classList.add('error');
        } else {
          field.classList.remove('error');
        }
      });
      
      if (valid) {
        // For demonstration, we'll just show a success message
        showNotification('Order placed successfully!', 'success');
        
        // Clear cart
        localStorage.removeItem('cart');
        updateCartCount();
        
        // Redirect to success page (in a real implementation)
        // window.location.href = '/checkout-success';
      } else {
        showNotification('Please fill in all required fields!', 'error');
      }
    });
  }
}

/**
 * Initialize product detail page
 */
function initializeProductDetail() {
  // Variant selection (colors, sizes)
  const variantOptions = document.querySelectorAll('.variant-option');
  
  variantOptions.forEach(option => {
    option.addEventListener('click', function() {
      // Get the variant group
      const group = this.closest('.variant-group');
      
      // Remove active class from all options in the group
      group.querySelectorAll('.variant-option').forEach(opt => {
        opt.classList.remove('active');
      });
      
      // Add active class to selected option
      this.classList.add('active');
      
      // Update hidden input value if exists
      const input = group.querySelector('input[type="hidden"]');
      if (input) {
        input.value = this.dataset.value;
      }
    });
  });
  
  // Add to cart from product detail page
  const addToCartForm = document.querySelector('.product-detail form.product-form');
  
  if (addToCartForm) {
    addToCartForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      const productId = this.dataset.productId;
      const quantityInput = this.querySelector('.quantity-selector input');
      const quantity = quantityInput ? parseInt(quantityInput.value) : 1;
      
      // Validate variants if required
      const requiredVariants = this.querySelectorAll('.variant-group[data-required="true"] input[type="hidden"]');
      let allVariantsSelected = true;
      
      requiredVariants.forEach(variant => {
        if (!variant.value) {
          allVariantsSelected = false;
          
          // Show error
          const variantGroup = variant.closest('.variant-group');
          variantGroup.classList.add('error');
          
          setTimeout(() => {
            variantGroup.classList.remove('error');
          }, 2000);
        }
      });
      
      if (allVariantsSelected) {
        addToCart(productId, quantity);
      } else {
        showNotification('Please select all required options!', 'error');
      }
    });
  }
}

/**
 * Initialize countdown timer
 */
function initializeCountdown() {
  const countdownElements = document.querySelectorAll('.countdown');
  
  countdownElements.forEach(element => {
    const endTime = new Date(element.dataset.endTime).getTime();
    
    // Update every second
    const countdownInterval = setInterval(() => {
      const now = new Date().getTime();
      const distance = endTime - now;
      
      // If countdown is finished
      if (distance < 0) {
        clearInterval(countdownInterval);
        element.innerHTML = '<span class="expired">Expired</span>';
        return;
      }
      
      // Calculate days, hours, minutes, seconds
      const days = Math.floor(distance / (1000 * 60 * 60 * 24));
      const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);
      
      // Output the result
      element.innerHTML = `
        <div class="countdown-item"><span class="countdown-value">${days}</span><span class="countdown-label">Days</span></div>
        <div class="countdown-item"><span class="countdown-value">${hours}</span><span class="countdown-label">Hours</span></div>
        <div class="countdown-item"><span class="countdown-value">${minutes}</span><span class="countdown-label">Mins</span></div>
        <div class="countdown-item"><span class="countdown-value">${seconds}</span><span class="countdown-label">Secs</span></div>
      `;
    }, 1000);
  });
}

/**
 * Initialize tooltips
 */
function initializeTooltips() {
  const tooltips = document.querySelectorAll('[data-tooltip]');
  
  tooltips.forEach(element => {
    const tooltipText = element.dataset.tooltip;
    
    // Create tooltip element
    const tooltip = document.createElement('div');
    tooltip.className = 'tooltip';
    tooltip.textContent = tooltipText;
    
    // Add tooltip to element
    element.appendChild(tooltip);
    
    // Show tooltip on hover
    element.addEventListener('mouseenter', () => {
      tooltip.style.visibility = 'visible';
      tooltip.style.opacity = '1';
    });
    
    element.addEventListener('mouseleave', () => {
      tooltip.style.visibility = 'hidden';
      tooltip.style.opacity = '0';
    });
  });
}

/**
 * Initialize scroll to top button
 */
function initializeScrollTop() {
  const scrollBtn = document.querySelector('.scroll-top');
  
  if (!scrollBtn) return;
  
  // Show button when scrolling down
  window.addEventListener('scroll', () => {
    if (window.pageYOffset > 300) {
      scrollBtn.classList.add('active');
    } else {
      scrollBtn.classList.remove('active');
    }
  });
  
  // Scroll to top on click
  scrollBtn.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
}

/**
 * Format currency
 * @param {number} amount - Amount to format
 * @param {string} currencyCode - Currency code (USD, EUR, etc.)
 * @returns {string} Formatted currency
 */
function formatCurrency(amount, currencyCode = 'USD') {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currencyCode
  }).format(amount);
}

/**
 * Format date
 * @param {string|Date} date - Date to format
 * @param {string} format - Format string
 * @returns {string} Formatted date
 */
function formatDate(date, format = 'medium') {
  const dateObj = new Date(date);
  
  switch (format) {
    case 'short':
      return dateObj.toLocaleDateString();
    case 'medium':
      return dateObj.toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    case 'long':
      return dateObj.toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    default:
      return dateObj.toLocaleDateString();
  }
}

/**
 * Get URL parameter
 * @param {string} name - Parameter name
 * @returns {string|null} Parameter value
 */
function getUrlParameter(name) {
  name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
  const regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
  const results = regex.exec(location.search);
  return results === null ? null : decodeURIComponent(results[1].replace(/\+/g, ' '));
}

/**
 * Debounce function to limit function calls
 * @param {Function} func - Function to debounce
 * @param {number} wait - Wait time in milliseconds
 * @returns {Function} Debounced function
 */
function debounce(func, wait = 300) {
  let timeout;
  
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}