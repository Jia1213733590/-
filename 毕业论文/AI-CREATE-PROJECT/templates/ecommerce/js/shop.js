/**
 * Ecommerce Website - Shop Functions
 * templates/ecommerce/js/shop.js
 * 
 * This file contains JavaScript functions specifically for the shop pages
 */

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
  initializeFilters();
  initializeSorting();
  initializeLayoutToggle();
  initializePriceRange();
  initializeQuickView();
  initializePagination();
  initializeColorFilters();
  initializeSizeFilters();
  initializeBrandFilters();
  initializeSearchFilters();
});

/**
 * Initialize product filters
 */
function initializeFilters() {
  const filterToggles = document.querySelectorAll('.filter-toggle');
  const filterClearAll = document.querySelector('.filter-clear-all');
  const mobileFilterToggle = document.querySelector('.mobile-filter-toggle');
  const filterSidebar = document.querySelector('.shop-sidebar');
  
  // Toggle filter sections
  if (filterToggles) {
    filterToggles.forEach(toggle => {
      toggle.addEventListener('click', function() {
        const filterContent = this.nextElementSibling;
        
        this.classList.toggle('active');
        
        if (filterContent.style.maxHeight) {
          filterContent.style.maxHeight = null;
        } else {
          filterContent.style.maxHeight = filterContent.scrollHeight + 'px';
        }
      });
    });
  }
  
  // Clear all filters
  if (filterClearAll) {
    filterClearAll.addEventListener('click', function(e) {
      e.preventDefault();
      
      // Uncheck all checkboxes
      document.querySelectorAll('.filter-item input[type="checkbox"]').forEach(checkbox => {
        checkbox.checked = false;
      });
      
      // Reset price range
      const priceRangeMin = document.querySelector('#price-min');
      const priceRangeMax = document.querySelector('#price-max');
      
      if (priceRangeMin && priceRangeMax) {
        priceRangeMin.value = priceRangeMin.min;
        priceRangeMax.value = priceRangeMax.max;
        
        // Update range slider if exists
        const priceRange = document.querySelector('#price-range');
        if (priceRange) {
          priceRange.noUiSlider.reset();
        }
      }
      
      // Reset filter badges
      document.querySelectorAll('.filter-badge').forEach(badge => {
        badge.remove();
      });
      
      // Refresh products
      refreshProducts();
    });
  }
  
  // Mobile filter toggle
  if (mobileFilterToggle && filterSidebar) {
    mobileFilterToggle.addEventListener('click', function() {
      filterSidebar.classList.toggle('active');
      document.body.classList.toggle('sidebar-open');
    });
    
    // Close sidebar when clicking outside
    document.addEventListener('click', function(e) {
      if (filterSidebar.classList.contains('active') && 
          !filterSidebar.contains(e.target) && 
          !mobileFilterToggle.contains(e.target)) {
        filterSidebar.classList.remove('active');
        document.body.classList.remove('sidebar-open');
      }
    });
  }
  
  // Apply filters
  const applyFilterBtn = document.querySelector('.apply-filter-btn');
  
  if (applyFilterBtn) {
    applyFilterBtn.addEventListener('click', function() {
      // Close mobile sidebar if open
      if (filterSidebar && filterSidebar.classList.contains('active')) {
        filterSidebar.classList.remove('active');
        document.body.classList.remove('sidebar-open');
      }
      
      // Refresh products
      refreshProducts();
    });
  }
  
  // Listen for checkbox changes
  document.querySelectorAll('.filter-item input[type="checkbox"]').forEach(checkbox => {
    checkbox.addEventListener('change', function() {
      updateFilterBadges();
    });
  });
}

/**
 * Update filter badges
 */
function updateFilterBadges() {
  const filterBadgesContainer = document.querySelector('.active-filters');
  
  if (!filterBadgesContainer) return;
  
  // Clear existing badges
  filterBadgesContainer.innerHTML = '';
  
  // Get all checked filters
  const checkedFilters = document.querySelectorAll('.filter-item input[type="checkbox"]:checked');
  
  if (checkedFilters.length === 0) {
    filterBadgesContainer.style.display = 'none';
    return;
  }
  
  filterBadgesContainer.style.display = 'flex';
  
  // Create badges for checked filters
  checkedFilters.forEach(filter => {
    const filterName = filter.nextElementSibling.textContent;
    const filterCategory = filter.closest('.filter-section').querySelector('.filter-toggle').textContent;
    
    const badge = document.createElement('div');
    badge.className = 'filter-badge';
    badge.innerHTML = `
      <span>${filterCategory}: ${filterName}</span>
      <button class="remove-filter" data-filter-id="${filter.id}">&times;</button>
    `;
    
    filterBadgesContainer.appendChild(badge);
    
    // Add remove event
    badge.querySelector('.remove-filter').addEventListener('click', function() {
      const filterId = this.dataset.filterId;
      document.getElementById(filterId).checked = false;
      badge.remove();
      
      // Check if no badges left
      if (filterBadgesContainer.querySelectorAll('.filter-badge').length === 0) {
        filterBadgesContainer.style.display = 'none';
      }
      
      // Refresh products
      refreshProducts();
    });
  });
}

/**
 * Initialize product sorting
 */
function initializeSorting() {
  const sortSelect = document.querySelector('.sort-select');
  
  if (!sortSelect) return;
  
  sortSelect.addEventListener('change', function() {
    refreshProducts();
  });
}

/**
 * Initialize layout toggle (grid vs list)
 */
function initializeLayoutToggle() {
  const layoutToggles = document.querySelectorAll('.layout-toggle');
  const productsContainer = document.querySelector('.products-grid');
  
  if (!layoutToggles.length || !productsContainer) return;
  
  layoutToggles.forEach(toggle => {
    toggle.addEventListener('click', function(e) {
      e.preventDefault();
      
      // Remove active class from all toggles
      layoutToggles.forEach(t => t.classList.remove('active'));
      
      // Add active class to clicked toggle
      this.classList.add('active');
      
      // Update layout class on products container
      if (this.classList.contains('grid-view')) {
        productsContainer.classList.remove('list-view');
        productsContainer.classList.add('grid-view');
      } else {
        productsContainer.classList.remove('grid-view');
        productsContainer.classList.add('list-view');
      }
      
      // Save preference to localStorage
      localStorage.setItem('shop-layout', this.classList.contains('grid-view') ? 'grid' : 'list');
    });
  });
  
  // Load saved layout preference
  const savedLayout = localStorage.getItem('shop-layout');
  
  if (savedLayout) {
    if (savedLayout === 'list') {
      const listToggle = document.querySelector('.layout-toggle.list-view');
      if (listToggle) {
        listToggle.click();
      }
    } else {
      const gridToggle = document.querySelector('.layout-toggle.grid-view');
      if (gridToggle) {
        gridToggle.click();
      }
    }
  }
}

/**
 * Initialize price range slider
 */
function initializePriceRange() {
  const priceRange = document.querySelector('#price-range');
  const priceMin = document.querySelector('#price-min');
  const priceMax = document.querySelector('#price-max');
  
  if (!priceRange || !priceMin || !priceMax) return;
  
  // Initialize range slider
  noUiSlider.create(priceRange, {
    start: [parseInt(priceMin.value), parseInt(priceMax.value)],
    connect: true,
    step: 10,
    range: {
      'min': parseInt(priceMin.min),
      'max': parseInt(priceMax.max)
    },
    format: {
      to: function(value) {
        return Math.round(value);
      },
      from: function(value) {
        return Math.round(value);
      }
    }
  });
  
  // Update input values on slider change
  priceRange.noUiSlider.on('update', function(values, handle) {
    if (handle === 0) {
      priceMin.value = values[0];
    } else {
      priceMax.value = values[1];
    }
  });
  
  // Update slider on input change
  priceMin.addEventListener('change', function() {
    priceRange.noUiSlider.set([this.value, null]);
  });
  
  priceMax.addEventListener('change', function() {
    priceRange.noUiSlider.set([null, this.value]);
  });
  
  // Apply price filter on slider change (with debounce)
  const debouncedRefresh = debounce(refreshProducts, 500);
  priceRange.noUiSlider.on('change', debouncedRefresh);
}

/**
 * Initialize quick view functionality
 */
function initializeQuickView() {
  const quickViewButtons = document.querySelectorAll('.quick-view-btn');
  const quickViewModal = document.querySelector('.quick-view-modal');
  
  if (!quickViewButtons.length || !quickViewModal) return;
  
  quickViewButtons.forEach(button => {
    button.addEventListener('click', function(e) {
      e.preventDefault();
      
      const productId = this.dataset.productId;
      
      // In a real application, you would fetch product data from an API
      // For now, we'll use a mock fetch function
      fetchProductData(productId)
        .then(product => {
          // Populate modal with product data
          populateQuickViewModal(product);
          
          // Show modal
          quickViewModal.style.display = 'flex';
          
          // Add close functionality
          const closeBtn = quickViewModal.querySelector('.close-modal');
          
          if (closeBtn) {
            closeBtn.addEventListener('click', function() {
              quickViewModal.style.display = 'none';
            });
          }
          
          // Close modal when clicking outside
          quickViewModal.addEventListener('click', function(e) {
            if (e.target === this) {
              this.style.display = 'none';
            }
          });
        })
        .catch(error => {
          console.error('Error fetching product data:', error);
        });
    });
  });
}

/**
 * Fetch product data (mock function)
 * @param {string} productId - Product ID
 * @returns {Promise} Promise with product data
 */
function fetchProductData(productId) {
  // In a real application, this would be an API call
  // For now, we'll return mock data
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      // Mock product data
      const product = {
        id: productId,
        name: 'Sample Product ' + productId,
        price: 99.99,
        oldPrice: 129.99,
        discount: 23,
        rating: 4.5,
        reviewCount: 12,
        description: 'This is a sample product description. This product is featured in our quick view modal.',
        images: [
          'product-image-1.jpg',
          'product-image-2.jpg',
          'product-image-3.jpg'
        ],
        colors: [
          { name: 'Red', code: '#ff0000' },
          { name: 'Blue', code: '#0000ff' },
          { name: 'Green', code: '#00ff00' }
        ],
        sizes: ['S', 'M', 'L', 'XL'],
        inStock: true
      };
      
      resolve(product);
    }, 300);
  });
}

/**
 * Populate quick view modal with product data
 * @param {Object} product - Product data
 */
function populateQuickViewModal(product) {
  const modal = document.querySelector('.quick-view-modal');
  
  if (!modal) return;
  
  const modalContent = modal.querySelector('.modal-content');
  
  // Create modal HTML
  modalContent.innerHTML = `
    <div class="modal-header">
      <h3>${product.name}</h3>
      <button class="close-modal">&times;</button>
    </div>
    <div class="modal-body">
      <div class="product-quick-view">
        <div class="product-images">
          <div class="main-image">
            <img src="images/products/${product.images[0]}" alt="${product.name}">
          </div>
          <div class="thumbnail-images">
            ${product.images.map(image => `
              <div class="thumbnail ${image === product.images[0] ? 'active' : ''}">
                <img src="images/products/${image}" alt="${product.name}">
              </div>
            `).join('')}
          </div>
        </div>
        <div class="product-info">
          <div class="product-price">
            <span class="current-price">$${product.price.toFixed(2)}</span>
            ${product.oldPrice ? `<span class="old-price">$${product.oldPrice.toFixed(2)}</span>` : ''}
            ${product.discount ? `<span class="discount">-${product.discount}%</span>` : ''}
          </div>
          <div class="product-rating">
            <div class="stars">
              ${Array(5).fill().map((_, i) => `
                <i class="fa fa-star${i < Math.floor(product.rating) ? '' : i < product.rating ? '-half-o' : '-o'}"></i>
              `).join('')}
            </div>
            <span class="rating-count">(${product.reviewCount} reviews)</span>
          </div>
          <div class="product-short-description">
            <p>${product.description}</p>
          </div>
          ${product.colors.length ? `
            <div class="variant-group" data-required="true">
              <label>Color:</label>
              <div class="variant-options">
                ${product.colors.map((color, i) => `
                  <div class="color-option${i === 0 ? ' active' : ''}" style="background-color: ${color.code};" data-value="${color.name}"></div>
                `).join('')}
              </div>
              <input type="hidden" name="color" value="${product.colors[0].name}">
            </div>
          ` : ''}
          ${product.sizes.length ? `
            <div class="variant-group" data-required="true">
              <label>Size:</label>
              <div class="variant-options">
                ${product.sizes.map((size, i) => `
                  <div class="size-option${i === 0 ? ' active' : ''}" data-value="${size}">${size}</div>
                `).join('')}
              </div>
              <input type="hidden" name="size" value="${product.sizes[0]}">
            </div>
          ` : ''}
          <div class="product-quantity">
            <label>Quantity:</label>
            <div class="quantity-selector">
              <button type="button" class="quantity-minus">-</button>
              <input type="number" name="quantity" value="1" min="1" max="99">
              <button type="button" class="quantity-plus">+</button>
            </div>
          </div>
          <div class="product-actions">
            <button type="button" class="add-to-cart-btn" data-product-id="${product.id}">
              <i class="fa fa-shopping-cart"></i> Add to Cart
            </button>
            <button type="button" class="wishlist-btn" data-product-id="${product.id}">
              <i class="fa fa-heart-o"></i>
            </button>
          </div>
          <div class="product-meta">
            <div class="meta-item">
              <span>SKU:</span> ${product.id}
            </div>
            <div class="meta-item">
              <span>Availability:</span> ${product.inStock ? 'In Stock' : 'Out of Stock'}
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
  
  // Initialize functionality inside modal
  const modal_variantOptions = modalContent.querySelectorAll('.variant-option');
  modal_variantOptions.forEach(option => {
    option.addEventListener('click', function() {
      const group = this.closest('.variant-group');
      group.querySelectorAll('.variant-option').forEach(opt => {
        opt.classList.remove('active');
      });
      this.classList.add('active');
      
      const input = group.querySelector('input[type="hidden"]');
      if (input) {
        input.value = this.dataset.value;
      }
    });
  });
  
  const modal_quantitySelector = modalContent.querySelector('.quantity-selector');
  if (modal_quantitySelector) {
    const minusBtn = modal_quantitySelector.querySelector('.quantity-minus');
    const plusBtn = modal_quantitySelector.querySelector('.quantity-plus');
    const input = modal_quantitySelector.querySelector('input');
    
    if (minusBtn && plusBtn && input) {
      minusBtn.addEventListener('click', () => {
        let value = parseInt(input.value);
        if (value > 1) {
          input.value = value - 1;
        }
      });
      
      plusBtn.addEventListener('click', () => {
        let value = parseInt(input.value);
        input.value = value + 1;
      });
    }
  }
  
  const modal_thumbnails = modalContent.querySelectorAll('.thumbnail');
  const modal_mainImage = modalContent.querySelector('.main-image img');
  
  if (modal_thumbnails.length && modal_mainImage) {
    modal_thumbnails.forEach(thumbnail => {
      thumbnail.addEventListener('click', function() {
        modal_thumbnails.forEach(thumb => thumb.classList.remove('active'));
        this.classList.add('active');
        
        const imgSrc = this.querySelector('img').src;
        modal_mainImage.src = imgSrc;
      });
    });
  }
  
  const modal_addToCartBtn = modalContent.querySelector('.add-to-cart-btn');
  if (modal_addToCartBtn) {
    modal_addToCartBtn.addEventListener('click', function() {
      const productId = this.dataset.productId;
      const quantity = parseInt(modalContent.querySelector('input[name="quantity"]').value);
      
      // Call the addToCart function from functions.js
      if (typeof addToCart === 'function') {
        addToCart(productId, quantity);
      }
      
      // Close modal after adding to cart
      modal.style.display = 'none';
    });
  }
  
  const modal_wishlistBtn = modalContent.querySelector('.wishlist-btn');
  if (modal_wishlistBtn) {
    modal_wishlistBtn.addEventListener('click', function() {
      const productId = this.dataset.productId;
      
      // Call the toggleWishlist function from functions.js
      if (typeof toggleWishlist === 'function') {
        toggleWishlist(productId);
      }
      
      this.classList.toggle('active');
    });
  }
}

/**
 * Initialize pagination
 */
function initializePagination() {
  const paginationLinks = document.querySelectorAll('.pagination a');
  
  if (!paginationLinks.length) return;
  
  paginationLinks.forEach(link => {
    link.addEventListener('click', function(e) {
      e.preventDefault();
      
      // Remove active class from all links
      paginationLinks.forEach(l => l.classList.remove('active'));
      
      // Add active class to clicked link
      this.classList.add('active');
      
      // Get page number
      const page = this.dataset.page || 1;
      
      // Update URL parameter
      const url = new URL(window.location);
      url.searchParams.set('page', page);
      window.history.pushState({}, '', url);
      
      // Refresh products
      refreshProducts();
      
      // Scroll to top of products
      const productsSection = document.querySelector('.shop-products');
      if (productsSection) {
        window.scrollTo({
          top: productsSection.offsetTop - 100,
          behavior: 'smooth'
        });
      }
    });
  });
}

/**
 * Initialize color filters
 */
function initializeColorFilters() {
  const colorOptions = document.querySelectorAll('.color-filter');
  
  if (!colorOptions.length) return;
  
  colorOptions.forEach(option => {
    option.addEventListener('click', function() {
      this.classList.toggle('active');
      
      // Update checkbox state
      const checkbox = this.querySelector('input[type="checkbox"]');
      if (checkbox) {
        checkbox.checked = this.classList.contains('active');
        
        // Trigger change event for filter badges
        checkbox.dispatchEvent(new Event('change'));
      }
    });
  });
}

/**
 * Initialize size filters
 */
function initializeSizeFilters() {
  const sizeOptions = document.querySelectorAll('.size-filter');
  
  if (!sizeOptions.length) return;
  
  sizeOptions.forEach(option => {
    option.addEventListener('click', function() {
      // If it's a radio button behavior (single selection)
      if (this.closest('.filter-sizes').classList.contains('single-select')) {
        // Remove active class from all options
        sizeOptions.forEach(opt => {
          opt.classList.remove('active');
          const radio = opt.querySelector('input[type="radio"]');
          if (radio) {
            radio.checked = false;
          }
        });
      }
      
      this.classList.toggle('active');
      
      // Update input state
      const input = this.querySelector('input');
      if (input) {
        input.checked = this.classList.contains('active');
        
        // Trigger change event for filter badges
        input.dispatchEvent(new Event('change'));
      }
    });
  });
}

/**
 * Initialize brand filters
 */
function initializeBrandFilters() {
  const brandItems = document.querySelectorAll('.brand-filter');
  
  if (!brandItems.length) return;
  
  // Brand search
  const brandSearch = document.querySelector('.brand-search input');
  
  if (brandSearch) {
    brandSearch.addEventListener('input', function() {
      const searchText = this.value.toLowerCase();
      
      brandItems.forEach(item => {
        const brandName = item.querySelector('label').textContent.toLowerCase();
        
        if (brandName.includes(searchText)) {
          item.style.display = '';
        } else {
          item.style.display = 'none';
        }
      });
    });
  }
}

/**
 * Initialize search filters (for attribute filters)
 */
function initializeSearchFilters() {
  const filterSearchInputs = document.querySelectorAll('.filter-search input');
  
  if (!filterSearchInputs.length) return;
  
  filterSearchInputs.forEach(input => {
    input.addEventListener('input', function() {
      const searchText = this.value.toLowerCase();
      const filterItems = this.closest('.filter-section').querySelectorAll('.filter-item');
      
      filterItems.forEach(item => {
        const itemText = item.querySelector('label').textContent.toLowerCase();
        
        if (itemText.includes(searchText)) {
          item.style.display = '';
        } else {
          item.style.display = 'none';
        }
      });
    });
  });
}

/**
 * Refresh products based on filters, sorting, and pagination
 */
function refreshProducts() {
  // In a real application, this would make an AJAX request to the server
  // to get filtered products. For demonstration, we'll simulate the refresh
  // with a loading state.
  
  const productsContainer = document.querySelector('.products-grid');
  
  if (!productsContainer) return;
  
  // Show loading state
  productsContainer.classList.add('loading');
  
  // Get all active filters
  const activeFilters = {
    categories: [],
    brands: [],
    colors: [],
    sizes: [],
    price: {
      min: document.querySelector('#price-min')?.value,
      max: document.querySelector('#price-max')?.value
    },
    attributes: {} // For custom attributes
  };
  
  // Collect category filters
  document.querySelectorAll('.filter-categories input:checked').forEach(input => {
    activeFilters.categories.push(input.value);
  });
  
  // Collect brand filters
  document.querySelectorAll('.filter-brands input:checked').forEach(input => {
    activeFilters.brands.push(input.value);
  });
  
  // Collect color filters
  document.querySelectorAll('.filter-colors input:checked').forEach(input => {
    activeFilters.colors.push(input.value);
  });
  
  // Collect size filters
  document.querySelectorAll('.filter-sizes input:checked').forEach(input => {
    activeFilters.sizes.push(input.value);
  });
  
  // Collect attribute filters
  document.querySelectorAll('.filter-attributes').forEach(section => {
    const attributeName = section.dataset.attribute;
    
    if (attributeName) {
      activeFilters.attributes[attributeName] = [];
      
      section.querySelectorAll('input:checked').forEach(input => {
        activeFilters.attributes[attributeName].push(input.value);
      });
    }
  });
  
  // Get sorting
  const sortSelect = document.querySelector('.sort-select');
  const sorting = sortSelect ? sortSelect.value : 'default';
  
  // Get pagination
  const activePage = document.querySelector('.pagination a.active');
  const page = activePage ? activePage.dataset.page : 1;
  
  // Log the filters (for demonstration)
  console.log('Active Filters:', activeFilters);
  console.log('Sorting:', sorting);
  console.log('Page:', page);
  
  // In a real application, you would make an AJAX request here
  // For demonstration, we'll simulate a delay and then remove the loading state
  setTimeout(() => {
    productsContainer.classList.remove('loading');
    
    // You would typically update the products here based on the response
    // For demonstration, we'll just show a notification
    showNotification('Products refreshed successfully!', 'success');
  }, 800);
}

/**
 * Show "loading more" functionality
 */
function initializeLoadMore() {
  const loadMoreBtn = document.querySelector('.load-more-btn');
  
  if (!loadMoreBtn) return;
  
  loadMoreBtn.addEventListener('click', function() {
    // Show loading state
    this.classList.add('loading');
    this.textContent = 'Loading...';
    
    // In a real application, you would make an AJAX request here
    // For demonstration, we'll simulate a delay
    setTimeout(() => {
      // Remove loading state
      this.classList.remove('loading');
      this.textContent = 'Load More';
      
      // You would typically append more products here
      // For demonstration, we'll just show a notification
      showNotification('More products loaded!', 'success');
    }, 800);
  });
}

// Initialize load more functionality if exists
initializeLoadMore();

/**
 * Initialize wishlist toggle functionality
 */
function initializeWishlistToggle() {
  const wishlistButtons = document.querySelectorAll('.product-card .wishlist-btn');
  
  if (!wishlistButtons.length) return;
  
  // Get wishlist from localStorage
  const wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
  
  // Set initial state
  wishlistButtons.forEach(button => {
    const productId = button.dataset.productId;
    
    if (wishlist.includes(productId)) {
      button.classList.add('active');
    }
  });
  
  // Add click event
  wishlistButtons.forEach(button => {
    button.addEventListener('click', function(e) {
      e.preventDefault();
      e.stopPropagation();
      
      const productId = this.dataset.productId;
      
      // Call toggleWishlist function from functions.js
      if (typeof toggleWishlist === 'function') {
        toggleWishlist(productId);
        this.classList.toggle('active');
      }
    });
  });
}

// Initialize wishlist toggle
initializeWishlistToggle();

/**
 * Initialize compare functionality
 */
function initializeCompare() {
  const compareButtons = document.querySelectorAll('.product-card .compare-btn');
  const compareCounter = document.querySelector('.compare-count');
  const compareDropdown = document.querySelector('.compare-dropdown');
  const compareList = document.querySelector('.compare-dropdown-list');
  const compareBtn = document.querySelector('.compare-dropdown-btn');
  const compareClearBtn = document.querySelector('.compare-dropdown-clear');
  
  if (!compareButtons.length) return;
  
  // Get compare list from localStorage
  let compareItems = JSON.parse(localStorage.getItem('compare')) || [];
  
  // Update compare counter
  function updateCompareCounter() {
    if (compareCounter) {
      compareCounter.textContent = compareItems.length;
      
      if (compareItems.length > 0) {
        compareCounter.classList.add('has-items');
      } else {
        compareCounter.classList.remove('has-items');
      }
    }
  }
  
  // Update compare dropdown
  function updateCompareDropdown() {
    if (!compareList) return;
    
    // Clear list
    compareList.innerHTML = '';
    
    if (compareItems.length === 0) {
      compareList.innerHTML = '<div class="empty-compare">No products to compare</div>';
      
      if (compareBtn) {
        compareBtn.disabled = true;
      }
      
      if (compareClearBtn) {
        compareClearBtn.style.display = 'none';
      }
      
      return;
    }
    
    // Enable compare button
    if (compareBtn) {
      compareBtn.disabled = false;
    }
    
    // Show clear button
    if (compareClearBtn) {
      compareClearBtn.style.display = 'block';
    }
    
    // Add items to list
    compareItems.forEach(item => {
      const listItem = document.createElement('div');
      listItem.className = 'compare-item';
      listItem.innerHTML = `
        <div class="compare-item-image">
          <img src="images/products/product-${item}.jpg" alt="Product ${item}">
        </div>
        <div class="compare-item-name">Product ${item}</div>
        <button type="button" class="compare-item-remove" data-product-id="${item}">&times;</button>
      `;
      
      compareList.appendChild(listItem);
      
      // Add remove event
      listItem.querySelector('.compare-item-remove').addEventListener('click', function() {
        const productId = this.dataset.productId;
        removeFromCompare(productId);
      });
    });
  }
  
  // Set initial toggle states
  compareButtons.forEach(button => {
    const productId = button.dataset.productId;
    
    if (compareItems.includes(productId)) {
      button.classList.add('active');
    }
  });
  
  // Add click event to toggle buttons
  compareButtons.forEach(button => {
    button.addEventListener('click', function(e) {
      e.preventDefault();
      e.stopPropagation();
      
      const productId = this.dataset.productId;
      
      toggleCompare(productId);
      this.classList.toggle('active');
    });
  });
  
  // Toggle compare item
  function toggleCompare(productId) {
    const index = compareItems.indexOf(productId);
    
    if (index === -1) {
      // Check if max items reached (usually 4)
      if (compareItems.length >= 4) {
        showNotification('You can compare maximum 4 products at once. Please remove one first.', 'warning');
        return;
      }
      
      // Add to compare
      compareItems.push(productId);
      showNotification('Product added to compare list!', 'success');
    } else {
      // Remove from compare
      compareItems.splice(index, 1);
      showNotification('Product removed from compare list!', 'info');
    }
    
    // Save to localStorage
    localStorage.setItem('compare', JSON.stringify(compareItems));
    
    // Update UI
    updateCompareCounter();
    updateCompareDropdown();
  }
  
  // Remove from compare
  function removeFromCompare(productId) {
    const index = compareItems.indexOf(productId);
    
    if (index !== -1) {
      // Remove from compare
      compareItems.splice(index, 1);
      
      // Save to localStorage
      localStorage.setItem('compare', JSON.stringify(compareItems));
      
      // Update UI
      updateCompareCounter();
      updateCompareDropdown();
      
      // Update button state
      const button = document.querySelector(`.compare-btn[data-product-id="${productId}"]`);
      if (button) {
        button.classList.remove('active');
      }
      
      showNotification('Product removed from compare list!', 'info');
    }
  }
  
  // Clear compare list
  if (compareClearBtn) {
    compareClearBtn.addEventListener('click', function() {
      // Clear compare list
      compareItems = [];
      
      // Save to localStorage
      localStorage.setItem('compare', JSON.stringify(compareItems));
      
      // Update UI
      updateCompareCounter();
      updateCompareDropdown();
      
      // Update button states
      compareButtons.forEach(button => {
        button.classList.remove('active');
      });
      
      showNotification('Compare list cleared!', 'info');
    });
  }
  
  // Go to compare page
  if (compareBtn) {
    compareBtn.addEventListener('click', function() {
      if (compareItems.length < 2) {
        showNotification('Please add at least 2 products to compare!', 'warning');
        return;
      }
      
      // Redirect to compare page with selected products
      window.location.href = 'compare.html?products=' + compareItems.join(',');
    });
  }
  
  // Toggle compare dropdown
  const compareToggle = document.querySelector('.compare-toggle');
  
  if (compareToggle && compareDropdown) {
    compareToggle.addEventListener('click', function(e) {
      e.preventDefault();
      e.stopPropagation();
      
      compareDropdown.classList.toggle('show');
    });
    
    // Close dropdown when clicking outside
    document.addEventListener('click', function(e) {
      if (!compareToggle.contains(e.target) && !compareDropdown.contains(e.target)) {
        compareDropdown.classList.remove('show');
      }
    });
  }
  
  // Initialize
  updateCompareCounter();
  updateCompareDropdown();
}

// Initialize compare functionality
initializeCompare();

/**
 * Initialize shop page
 */
function initializeShopPage() {
  // Get URL parameters
  const urlParams = new URLSearchParams(window.location.search);
  
  // Check for category parameter
  const category = urlParams.get('category');
  if (category) {
    // Find and check the category filter
    const categoryCheckbox = document.querySelector(`.filter-categories input[value="${category}"]`);
    if (categoryCheckbox) {
      categoryCheckbox.checked = true;
      
      // Update filter badges
      updateFilterBadges();
    }
  }
  
  // Check for brand parameter
  const brand = urlParams.get('brand');
  if (brand) {
    // Find and check the brand filter
    const brandCheckbox = document.querySelector(`.filter-brands input[value="${brand}"]`);
    if (brandCheckbox) {
      brandCheckbox.checked = true;
      
      // Update filter badges
      updateFilterBadges();
    }
  }
  
  // Check for page parameter
  const page = urlParams.get('page');
  if (page) {
    // Find and activate the page link
    const pageLink = document.querySelector(`.pagination a[data-page="${page}"]`);
    if (pageLink) {
      document.querySelectorAll('.pagination a').forEach(link => {
        link.classList.remove('active');
      });
      
      pageLink.classList.add('active');
    }
  }
  
  // Check for sort parameter
  const sort = urlParams.get('sort');
  if (sort) {
    // Find and select the sort option
    const sortOption = document.querySelector(`.sort-select option[value="${sort}"]`);
    if (sortOption) {
      sortOption.selected = true;
    }
  }
}

// Initialize shop page
initializeShopPage();

/**
 * Initialize product category carousels
 */
function initializeCategoryCarousels() {
  const categoryCarousels = document.querySelectorAll('.product-category-carousel');
  
  if (!categoryCarousels.length) return;
  
  categoryCarousels.forEach(carousel => {
    const container = carousel.querySelector('.carousel-container');
    const prevBtn = carousel.querySelector('.carousel-prev');
    const nextBtn = carousel.querySelector('.carousel-next');
    
    if (!container || !prevBtn || !nextBtn) return;
    
    // Set initial position
    let position = 0;
    
    // Get item width (including margin)
    const items = container.querySelectorAll('.product-card');
    if (!items.length) return;
    
    const itemStyle = window.getComputedStyle(items[0]);
    let itemWidth = items[0].offsetWidth + 
                     parseInt(itemStyle.marginLeft) + 
                     parseInt(itemStyle.marginRight);
    
    // Calculate maximum position
    let maxPosition = Math.max(0, (items.length * itemWidth) - container.offsetWidth);
    
    // Move carousel
    function moveCarousel(direction) {
      if (direction === 'prev') {
        position -= itemWidth * 2;
      } else {
        position += itemWidth * 2;
      }
      
      // Clamp position
      position = Math.max(0, Math.min(position, maxPosition));
      
      // Update position
      container.style.transform = `translateX(-${position}px)`;
      
      // Update button states
      updateButtons();
    }
    
    // Update button states
    function updateButtons() {
      prevBtn.disabled = position === 0;
      nextBtn.disabled = position >= maxPosition;
    }
    
    // Add click events
    prevBtn.addEventListener('click', () => moveCarousel('prev'));
    nextBtn.addEventListener('click', () => moveCarousel('next'));
    
    // Initialize button states
    updateButtons();
    
    // Handle window resize
    window.addEventListener('resize', function() {
      // Reset position
      position = 0;
      container.style.transform = 'translateX(0)';
      
      // Recalculate item width
      const newItemStyle = window.getComputedStyle(items[0]);
      const newItemWidth = items[0].offsetWidth + 
                          parseInt(newItemStyle.marginLeft) + 
                          parseInt(newItemStyle.marginRight);
      
      // Update values
      itemWidth = newItemWidth;
      maxPosition = Math.max(0, (items.length * itemWidth) - container.offsetWidth);
      
      // Update button states
      updateButtons();
    });
  });
}

// Initialize category carousels
initializeCategoryCarousels();

/**
 * Initialize shop filter sidebar toggle for mobile
 */
function initializeMobileFilterSidebar() {
  const filterToggle = document.querySelector('.mobile-filter-toggle');
  const filterSidebar = document.querySelector('.shop-sidebar');
  const filterClose = document.querySelector('.filter-close');
  
  if (!filterToggle || !filterSidebar) return;
  
  // Toggle sidebar
  filterToggle.addEventListener('click', function() {
    filterSidebar.classList.toggle('active');
    document.body.classList.toggle('sidebar-open');
  });
  
  // Close sidebar
  if (filterClose) {
    filterClose.addEventListener('click', function() {
      filterSidebar.classList.remove('active');
      document.body.classList.remove('sidebar-open');
    });
  }
  
  // Close sidebar when clicking outside
  document.addEventListener('click', function(e) {
    if (filterSidebar.classList.contains('active') && 
        !filterSidebar.contains(e.target) && 
        !filterToggle.contains(e.target)) {
      filterSidebar.classList.remove('active');
      document.body.classList.remove('sidebar-open');
    }
  });
}

// Initialize mobile filter sidebar
initializeMobileFilterSidebar();

/**
 * Initialize product image zoom
 */
function initializeProductZoom() {
  const productMainImage = document.querySelector('.product-detail .main-image img');
  
  if (!productMainImage) return;
  
  // Add zoom container
  const zoomContainer = document.createElement('div');
  zoomContainer.className = 'zoom-container';
  productMainImage.parentNode.appendChild(zoomContainer);
  
  // Create zoom image
  const zoomImage = document.createElement('img');
  zoomImage.src = productMainImage.src;
  zoomImage.className = 'zoom-image';
  zoomContainer.appendChild(zoomImage);
  
  // Mouse move event
  productMainImage.addEventListener('mousemove', function(e) {
    // Show zoom container
    zoomContainer.style.display = 'block';
    
    // Get image bounds
    const bounds = this.getBoundingClientRect();
    
    // Calculate mouse position relative to image
    const x = e.clientX - bounds.left;
    const y = e.clientY - bounds.top;
    
    // Calculate percentage position
    const xPercent = x / bounds.width * 100;
    const yPercent = y / bounds.height * 100;
    
    // Set zoom image position
    zoomImage.style.transform = `translate(-${xPercent}%, -${yPercent}%)`;
  });
  
  // Mouse out event
  productMainImage.addEventListener('mouseleave', function() {
    // Hide zoom container
    zoomContainer.style.display = 'none';
  });
  
  // Update zoom image when main image changes
  const thumbnails = document.querySelectorAll('.product-detail .thumbnail');
  
  thumbnails.forEach(thumbnail => {
    thumbnail.addEventListener('click', function() {
      setTimeout(() => {
        zoomImage.src = productMainImage.src;
      }, 100);
    });
  });
}

// Initialize product zoom
initializeProductZoom();

/**
 * Initialize quantity discount
 */
function initializeQuantityDiscount() {
  const quantitySelector = document.querySelector('.product-detail .quantity-selector');
  const discountInfo = document.querySelector('.quantity-discount-info');
  
  if (!quantitySelector || !discountInfo) return;
  
  const quantityInput = quantitySelector.querySelector('input');
  
  if (!quantityInput) return;
  
  // Sample discount tiers
  const discountTiers = [
    { min: 1, max: 4, discount: 0 },
    { min: 5, max: 9, discount: 5 },
    { min: 10, max: 24, discount: 10 },
    { min: 25, max: 49, discount: 15 },
    { min: 50, max: Infinity, discount: 20 }
  ];
  
  // Update discount info
  function updateDiscountInfo() {
    const quantity = parseInt(quantityInput.value);
    
    // Find applicable tier
    const tier = discountTiers.find(t => quantity >= t.min && quantity <= t.max);
    
    if (tier && tier.discount > 0) {
      discountInfo.innerHTML = `<strong>${tier.discount}% discount</strong> applied for quantities ${tier.min}+`;
      discountInfo.style.display = 'block';
    } else {
      discountInfo.style.display = 'none';
    }
    
    // Update price if needed
    const priceElement = document.querySelector('.product-price .current-price');
    const originalPrice = parseFloat(priceElement.dataset.originalPrice || priceElement.textContent.replace(/[^\d.]/g, ''));
    
    if (priceElement && tier) {
      const discountedPrice = originalPrice * (1 - tier.discount / 100);
      priceElement.textContent = `$${discountedPrice.toFixed(2)}`;
      
      // Store original price if not already stored
      if (!priceElement.dataset.originalPrice) {
        priceElement.dataset.originalPrice = originalPrice;
      }
    }
  }
  
  // Listen for quantity changes
  quantityInput.addEventListener('change', updateDiscountInfo);
  
  // Initial update
  updateDiscountInfo();
}

// Initialize quantity discount
initializeQuantityDiscount();

/**
 * Initialize related products carousel
 */
function initializeRelatedProducts() {
  const relatedCarousel = document.querySelector('.related-products-carousel');
  
  if (!relatedCarousel) return;
  
  const container = relatedCarousel.querySelector('.carousel-container');
  const prevBtn = relatedCarousel.querySelector('.carousel-prev');
  const nextBtn = relatedCarousel.querySelector('.carousel-next');
  
  if (!container || !prevBtn || !nextBtn) return;
  
  // Set initial position
  let position = 0;
  
  // Get item width (including margin)
  const items = container.querySelectorAll('.product-card');
  if (!items.length) return;
  
  const itemStyle = window.getComputedStyle(items[0]);
  let itemWidth = items[0].offsetWidth + 
                 parseInt(itemStyle.marginLeft) + 
                 parseInt(itemStyle.marginRight);
  
  // Calculate visible items
  const containerWidth = container.offsetWidth;
  const visibleItems = Math.floor(containerWidth / itemWidth);
  
  // Calculate maximum position
  let maxPosition = Math.max(0, (items.length - visibleItems) * itemWidth);
  
  // Move carousel
  function moveCarousel(direction) {
    if (direction === 'prev') {
      position -= itemWidth * visibleItems;
    } else {
      position += itemWidth * visibleItems;
    }
    
    // Clamp position
    position = Math.max(0, Math.min(position, maxPosition));
    
    // Update position
    container.style.transform = `translateX(-${position}px)`;
    
    // Update button states
    updateButtons();
  }
  
  // Update button states
  function updateButtons() {
    prevBtn.disabled = position === 0;
    nextBtn.disabled = position >= maxPosition;
  }
  
  // Add click events
  prevBtn.addEventListener('click', () => moveCarousel('prev'));
  nextBtn.addEventListener('click', () => moveCarousel('next'));
  
  // Initialize button states
  updateButtons();
  
  // Handle window resize
  window.addEventListener('resize', function() {
    // Reset position
    position = 0;
    container.style.transform = 'translateX(0)';
    
    // Recalculate item width
    const newItemStyle = window.getComputedStyle(items[0]);
    const newItemWidth = items[0].offsetWidth + 
                        parseInt(newItemStyle.marginLeft) + 
                        parseInt(newItemStyle.marginRight);
    
    // Update values
    itemWidth = newItemWidth;
    
    // Recalculate visible items
    const newContainerWidth = container.offsetWidth;
    const newVisibleItems = Math.floor(newContainerWidth / itemWidth);
    
    // Update maximum position
    maxPosition = Math.max(0, (items.length - newVisibleItems) * itemWidth);
    
    // Update button states
    updateButtons();
  });
}

// Initialize related products
initializeRelatedProducts();