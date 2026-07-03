document.addEventListener('DOMContentLoaded', () => {
  // --- DOM Elements ---
  const qtyMinus = document.getElementById('qty-minus');
  const qtyPlus = document.getElementById('qty-plus');
  const qtyInput = document.getElementById('qty-input');
  const selectedVariantQty = document.getElementById('selected-variant-qty');
  
  const colorBtns = document.querySelectorAll('.color-options .color-option-btn');
  const selectedColorLabel = document.getElementById('selected-color-label');
  const productPriceLabel = document.getElementById('product-price');
  const selectedVariantId = document.getElementById('selected-variant-id');
  
  const mainGalleryView = document.getElementById('main-gallery-view');
  const mediaBadgeLabel = document.getElementById('media-badge-label');
  const mediaTitle = document.getElementById('media-title');
  const mediaDesc = document.getElementById('media-desc');
  const thumbnails = document.querySelectorAll('.thumbnail-placeholder');
  
  const faqItems = document.querySelectorAll('.faq-item');
  
  // --- State Variables ---
  let selectedColor = (window.AvemosProductData && window.AvemosProductData.selectedColor) || 'Navy';
  let unitPrice = (window.AvemosProductData && window.AvemosProductData.unitPrice) || 39.90;
  let quantity = 1;

  // --- Gallery Media Data ---
  const galleryData = {
    1: {
      badge: 'Image 1',
      title: 'Main Pillow Image',
      desc: '* Image 1: Avemos pillow unfolded, navy color, front view *',
      icon: 'fa-image'
    },
    2: {
      badge: 'Image 2',
      title: 'Pillow Folded',
      desc: '* Image 2: Demonstration of compactness. Pillow tightly rolled inside the travel bag *',
      icon: 'fa-box-archive'
    },
    3: {
      badge: 'Image 3',
      title: 'Ergonomic Neck Support',
      desc: '* Image 3: Pillow on a neck showing 360-degree lateral and chin support *',
      icon: 'fa-user'
    },
    4: {
      badge: 'Video Review',
      title: 'Demonstration of Softness (Video)',
      desc: '* Video 1: A traveler takes out the pillow, adjusts the strap, and falls asleep *',
      icon: 'fa-circle-play'
    }
  };

  // --- Functions ---
  
  const currencySymbol = (window.AvemosProductData && window.AvemosProductData.currencySymbol) || '$';
  const currencySymbolAtEnd = (window.AvemosProductData && window.AvemosProductData.currencySymbolAtEnd) || false;

  function formatMoney(amount) {
    const formatted = parseFloat(amount).toFixed(2);
    return currencySymbolAtEnd ? `${formatted} ${currencySymbol}` : `${currencySymbol}${formatted}`;
  }

  // Update overall product calculations
  function updateProductTotals() {
    const total = (unitPrice * quantity).toFixed(2);
    const formattedTotal = formatMoney(total);
    if (productPriceLabel) productPriceLabel.textContent = formattedTotal;
    if (qtyInput) qtyInput.value = quantity;
    if (selectedVariantQty) selectedVariantQty.value = quantity;
  }

  // --- Event Listeners ---

  // Quantity adjustments
  if (qtyMinus) {
    qtyMinus.addEventListener('click', (e) => {
      e.preventDefault();
      if (quantity > 1) {
        quantity--;
        updateProductTotals();
      }
    });
  }

  if (qtyPlus) {
    qtyPlus.addEventListener('click', (e) => {
      e.preventDefault();
      if (quantity < 10) {
        quantity++;
        updateProductTotals();
      }
    });
  }

  // Variant selector
  colorBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      // Remove active from all
      colorBtns.forEach(b => b.classList.remove('active'));
      
      // Make this active
      btn.classList.add('active');
      
      // Update data
      selectedColor = btn.dataset.color;
      unitPrice = parseFloat(btn.dataset.price);
      const variantId = btn.dataset.variantId;
      
      if (selectedColorLabel) {
        selectedColorLabel.textContent = selectedColor;
      }
      if (selectedVariantId && variantId) {
        selectedVariantId.value = variantId;
      }
      
      // If gray is selected, update thumbnail 1 label to indicate gray color
      if (selectedColor.toLowerCase().includes('gray')) {
        galleryData[1].desc = '* Image 1: Avemos pillow unfolded, gray color, front view *';
      } else {
        galleryData[1].desc = '* Image 1: Avemos pillow unfolded, navy color, front view *';
      }
      
      // Update gallery if active is slide 1
      const activeThumb = document.querySelector('.thumbnail-placeholder.active');
      if (activeThumb && activeThumb.dataset.index === '1') {
        if (mediaDesc) mediaDesc.textContent = galleryData[1].desc;
      }

      updateProductTotals();
    });
  });

  // DOM elements for real media swapping
  const mainGalleryImg = document.getElementById('main-gallery-img');
  const mainGalleryVideo = document.getElementById('main-gallery-video');

  // Gallery slider switching
  thumbnails.forEach(thumb => {
    thumb.addEventListener('click', () => {
      thumbnails.forEach(t => t.classList.remove('active'));
      thumb.classList.add('active');
      
      const type = thumb.dataset.type;
      const src = thumb.dataset.src;
      const idx = thumb.dataset.index;
      
      if (mediaBadgeLabel) {
        mediaBadgeLabel.textContent = type === 'video' ? 'Video Review' : `Image ${idx}`;
      }

      if (type === 'image') {
        if (mainGalleryImg) {
          mainGalleryImg.src = src;
          mainGalleryImg.style.display = 'block';
        }
        if (mainGalleryVideo) {
          mainGalleryVideo.style.display = 'none';
          mainGalleryVideo.pause();
        }
      } else if (type === 'video') {
        if (mainGalleryImg) {
          mainGalleryImg.style.display = 'none';
        }
        if (mainGalleryVideo) {
          mainGalleryVideo.src = src;
          mainGalleryVideo.style.display = 'block';
          mainGalleryVideo.play().catch(e => console.log("Video play error:", e));
        }
      }
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
        const body = i.querySelector('.faq-body');
        if (body) body.style.maxHeight = null;
      });
      
      // Toggle current
      if (!isActive) {
        item.classList.add('active');
        const body = item.querySelector('.faq-body');
        if (body) body.style.maxHeight = body.scrollHeight + 'px';
      }
    });
  });

  // Initial Calculation sync
  updateProductTotals();
});
