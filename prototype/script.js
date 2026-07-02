document.addEventListener('DOMContentLoaded', () => {
  // --- DOM Elements ---
  const qtyMinus = document.getElementById('qty-minus');
  const qtyPlus = document.getElementById('qty-plus');
  const qtyInput = document.getElementById('qty-input');
  
  const colorBtns = document.querySelectorAll('.color-options .color-option-btn');
  const selectedColorLabel = document.getElementById('selected-color-label');
  const productPriceLabel = document.getElementById('product-price');
  
  const mainGalleryView = document.getElementById('main-gallery-view');
  const mediaBadgeLabel = document.getElementById('media-badge-label');
  const mediaTitle = document.getElementById('media-title');
  const mediaDesc = document.getElementById('media-desc');
  const thumbnails = document.querySelectorAll('.thumbnail-placeholder');
  
  const faqItems = document.querySelectorAll('.faq-item');
  
  const openCartBtn = document.getElementById('open-cart-btn');
  const closeCartBtn = document.getElementById('close-cart-btn');
  const cartDrawer = document.getElementById('cart-drawer');
  const cartOverlay = document.getElementById('cart-overlay');
  const buyNowBtn = document.getElementById('buy-now-btn');
  
  const cartSelectedColor = document.getElementById('cart-selected-color');
  const cartSelectedQty = document.getElementById('cart-selected-qty');
  const cartItemTotal = document.getElementById('cart-item-total');
  const summarySubtotal = document.getElementById('summary-subtotal');
  const summaryTotal = document.getElementById('summary-total');
  const payBtnPrice = document.getElementById('pay-btn-price');
  const cartCount = document.getElementById('cart-count');
  
  // Checkout Form Card Formatting
  const cardNumberInput = document.getElementById('card-number');
  const cardExpiryInput = document.getElementById('card-expiry');
  const cardCvcInput = document.getElementById('card-cvc');
  const paySubmitBtn = document.getElementById('pay-submit-btn');
  
  // Success Modal
  const successModal = document.getElementById('success-modal');
  const closeModalBtn = document.getElementById('close-modal-btn');
  
  // --- State Variables ---
  let selectedColor = 'Navy';
  let unitPrice = 39.90;
  let quantity = 1;
  let cartActive = false;

  // --- Gallery Media Data ---
  const galleryData = {
    1: {
      badge: 'Зображення 1',
      title: 'Головне зображення подушки',
      desc: '* Картинка 1: Подушка Avemos у розгорнутому вигляді, темно-синій колір, вид спереду *',
      icon: 'fa-image'
    },
    2: {
      badge: 'Зображення 2',
      title: 'Подушка в складеному стані',
      desc: '* Картинка 2: Демонстрація компактності. Подушка щільно згорнута в дорожній чохол *',
      icon: 'fa-box-archive'
    },
    3: {
      badge: 'Зображення 3',
      title: 'Ергономічний дизайн на шиї',
      desc: '* Картинка 3: Подушка на шиї манекена, що показує 360-градусну бічну та підборідну підтримку *',
      icon: 'fa-user'
    },
    4: {
      badge: 'Відео-огляд',
      title: 'Демонстрація м\'якості (GIF / Відео)',
      desc: '* Відео 1: Дівчина в літаку дістає подушку, легко застібає липучку та засинає *',
      icon: 'fa-circle-play'
    }
  };

  // --- Functions ---
  
  // Update overall product calculations
  function updateProductTotals() {
    const total = (unitPrice * quantity).toFixed(2);
    productPriceLabel.textContent = `$${total}`;
    
    // Sync into Cart Drawer
    cartSelectedColor.textContent = selectedColor;
    cartSelectedQty.textContent = quantity;
    cartItemTotal.textContent = `$${total}`;
    summarySubtotal.textContent = `$${total}`;
    summaryTotal.textContent = `$${total}`;
    payBtnPrice.textContent = `$${total}`;
    cartCount.textContent = quantity;
  }

  // Toggle Cart Drawer
  function toggleCart(show) {
    if (show) {
      cartDrawer.classList.add('open');
      cartOverlay.classList.add('open');
      document.body.style.overflow = 'hidden'; // prevent scrolling
    } else {
      cartDrawer.classList.remove('open');
      cartOverlay.classList.remove('open');
      document.body.style.overflow = '';
    }
  }

  // --- Event Listeners ---

  // Quantity adjustments
  qtyMinus.addEventListener('click', () => {
    if (quantity > 1) {
      quantity--;
      qtyInput.value = quantity;
      updateProductTotals();
    }
  });

  qtyPlus.addEventListener('click', () => {
    if (quantity < 10) {
      quantity++;
      qtyInput.value = quantity;
      updateProductTotals();
    }
  });

  // Variant selector
  colorBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      // Remove active from all
      colorBtns.forEach(b => b.classList.remove('active'));
      
      // Make this active
      btn.classList.add('active');
      
      // Update data
      selectedColor = btn.dataset.color;
      unitPrice = parseFloat(btn.dataset.price);
      selectedColorLabel.textContent = selectedColor === 'Navy' ? 'Темно-синій (Navy)' : 'Космічний сірий (Premium)';
      
      // If gray is selected, update thumbnail 1 label to indicate gray color
      if (selectedColor === 'Space Gray') {
        galleryData[1].desc = '* Картинка 1: Подушка Avemos у розгорнутому вигляді, сірий колір, вид спереду *';
      } else {
        galleryData[1].desc = '* Картинка 1: Подушка Avemos у розгорнутому вигляді, темно-синій колір, вид спереду *';
      }
      
      // Update gallery if active is slide 1
      const activeThumb = document.querySelector('.thumbnail-placeholder.active');
      if (activeThumb && activeThumb.dataset.index === '1') {
        mediaDesc.textContent = galleryData[1].desc;
      }

      updateProductTotals();
    });
  });

  // Gallery slider switching
  thumbnails.forEach(thumb => {
    thumb.addEventListener('click', () => {
      thumbnails.forEach(t => t.classList.remove('active'));
      thumb.classList.add('active');
      
      const idx = thumb.dataset.index;
      const data = galleryData[idx];
      
      mediaBadgeLabel.textContent = data.badge;
      mediaTitle.textContent = data.title;
      mediaDesc.textContent = data.desc;
      
      // Update Icon
      const icon = mainGalleryView.querySelector('i');
      icon.className = `fa-solid ${data.icon}`;
    });
  });

  // FAQ Accordion
  faqItems.forEach(item => {
    const header = item.querySelector('.faq-header');
    header.addEventListener('click', () => {
      const isActive = item.classList.contains('active');
      
      // Close all first
      faqItems.forEach(i => {
        i.classList.remove('active');
        i.querySelector('.faq-body').style.maxHeight = null;
      });
      
      // Toggle current
      if (!isActive) {
        item.classList.add('active');
        const body = item.querySelector('.faq-body');
        body.style.maxHeight = body.scrollHeight + 'px';
      }
    });
  });

  // Open/Close Cart
  openCartBtn.addEventListener('click', () => toggleCart(true));
  buyNowBtn.addEventListener('click', () => toggleCart(true));
  closeCartBtn.addEventListener('click', () => toggleCart(false));
  cartOverlay.addEventListener('click', () => toggleCart(false));

  // --- Form Input Masking (Stripe Simulation) ---
  
  // Format Card Number (XXXX XXXX XXXX XXXX)
  cardNumberInput.addEventListener('input', (e) => {
    let value = e.target.value.replace(/\D/g, '');
    let formatted = '';
    for (let i = 0; i < value.length && i < 16; i++) {
      if (i > 0 && i % 4 === 0) {
        formatted += ' ';
      }
      formatted += value[i];
    }
    e.target.value = formatted;
  });

  // Format Expiry (MM/YY)
  cardExpiryInput.addEventListener('input', (e) => {
    let value = e.target.value.replace(/\D/g, '');
    let formatted = '';
    if (value.length > 0) {
      formatted = value.substring(0, 2);
      if (value.length > 2) {
        formatted += '/' + value.substring(2, 4);
      }
    }
    e.target.value = formatted;
  });

  // Format CVC (Max 3 numbers)
  cardCvcInput.addEventListener('input', (e) => {
    e.target.value = e.target.value.replace(/\D/g, '').substring(0, 3);
  });

  // --- Payment Submission ---
  paySubmitBtn.addEventListener('click', (e) => {
    e.preventDefault();
    
    const email = document.getElementById('shipping-email').value;
    const name = document.getElementById('shipping-name').value;
    const cardNum = cardNumberInput.value;
    const cardExp = cardExpiryInput.value;
    const cardCvc = cardCvcInput.value;

    // Simple validation check
    if (!email || !name || cardNum.length < 19 || cardExp.length < 5 || cardCvc.length < 3) {
      alert('Будь ласка, заповніть всі платіжні поля коректно.');
      return;
    }

    // Processing animation
    paySubmitBtn.disabled = true;
    const originalText = paySubmitBtn.innerHTML;
    paySubmitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Обробка платежу...';

    setTimeout(() => {
      // Show Success Modal
      successModal.classList.add('open');
      
      // Reset button
      paySubmitBtn.disabled = false;
      paySubmitBtn.innerHTML = originalText;
    }, 2000); // 2 second delay to simulate Stripe processing
  });

  // Close Success Modal
  closeModalBtn.addEventListener('click', () => {
    successModal.classList.remove('open');
    toggleCart(false);
    
    // Clear cart reset values
    quantity = 1;
    qtyInput.value = 1;
    updateProductTotals();
    
    // Clear forms
    document.getElementById('shipping-email').value = '';
    document.getElementById('shipping-name').value = '';
    cardNumberInput.value = '';
    cardExpiryInput.value = '';
    cardCvcInput.value = '';
  });

  // Initial Calculation sync
  updateProductTotals();
});

