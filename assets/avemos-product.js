function initProduct() {
  // Quantity adjustments
  const qtyMinusBtn = document.getElementById('qty-minus-btn');
  const qtyPlusBtn = document.getElementById('qty-plus-btn');
  const qtyInputVal = document.getElementById('qty-input-val');
  
  if (qtyMinusBtn && qtyPlusBtn && qtyInputVal) {
    qtyMinusBtn.addEventListener('click', (e) => {
      e.preventDefault();
      let currentQty = parseInt(qtyInputVal.value) || 1;
      if (currentQty > 1) {
        qtyInputVal.value = currentQty - 1;
      }
    });
    
    qtyPlusBtn.addEventListener('click', (e) => {
      e.preventDefault();
      let currentQty = parseInt(qtyInputVal.value) || 1;
      qtyInputVal.value = currentQty + 1;
    });
  }

  // Bundle Radio click selection handler
  const bundleCards = document.querySelectorAll('.bundle-card-new');
  const variantIdInput = document.getElementById('main-product-variant-id');
  const customDropdowns = document.querySelectorAll('.custom-dropdown');

  bundleCards.forEach(card => {
    card.addEventListener('click', (e) => {
      if (e.target.closest('.custom-dropdown')) {
        return;
      }

      const radio = card.querySelector('input[type="radio"]');
      if (radio) {
        radio.checked = true;
      }

      bundleCards.forEach(c => {
        c.classList.remove('active');
      });

      card.classList.add('active');

      updatePriceAndVariant();
    });
  });

  // Custom dropdown logic
  customDropdowns.forEach(dropdown => {
    const trigger = dropdown.querySelector('.custom-dropdown-trigger');
    const options = dropdown.querySelectorAll('.custom-dropdown-option');

    if (trigger) {
      trigger.addEventListener('click', (e) => {
        e.stopPropagation();
        customDropdowns.forEach(d => {
          if (d !== dropdown) d.classList.remove('open');
        });
        dropdown.classList.toggle('open');
      });
    }

    options.forEach(option => {
      option.addEventListener('click', (e) => {
        e.stopPropagation();
        const value = option.getAttribute('data-value');
        const color = option.getAttribute('data-color');
        const label = option.querySelector('.option-label').textContent;

        dropdown.setAttribute('data-value', value);

        const triggerDot = trigger.querySelector('.select-color-dot');
        const triggerText = trigger.querySelector('.custom-dropdown-text');
        if (triggerDot) triggerDot.style.backgroundColor = color;
        if (triggerText) triggerText.textContent = label;

        options.forEach(o => o.classList.remove('selected'));
        option.classList.add('selected');

        dropdown.classList.remove('open');

        updatePriceAndVariant();

        const lowerLabel = label.toLowerCase();
        if (lowerLabel.includes('pink')) {
          goToSlide(1);
        } else if (lowerLabel.includes('gray') || lowerLabel.includes('grey')) {
          goToSlide(0);
        }
      });
    });
  });

  document.addEventListener('click', (e) => {
    if (!e.target.closest('.custom-dropdown')) {
      customDropdowns.forEach(d => d.classList.remove('open'));
    }
  });

  function getDropdownValue(id) {
    const el = document.getElementById(id);
    return el ? el.getAttribute('data-value') : null;
  }

  function updatePriceAndVariant() {
    const checkedRadio = document.querySelector('input[name="bundle_option"]:checked');
    if (!checkedRadio) return;
    const activeOption = checkedRadio.value;

    if (activeOption === 'buy_1') {
      const val = getDropdownValue('bundle-1-pillow-1-select');
      if (val && variantIdInput) {
        variantIdInput.value = val;
      }
    } else if (activeOption === 'buy_2') {
      const val = getDropdownValue('bundle-2-pillow-1-select');
      if (val && variantIdInput) {
        variantIdInput.value = val;
      }
    }
  }

  const addToCartForm = document.getElementById('bundle-add-to-cart-form');
  if (addToCartForm) {
    addToCartForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const checkedRadio = document.querySelector('input[name="bundle_option"]:checked');
      if (!checkedRadio) return;
      const activeOption = checkedRadio.value;
      const qtyMultiplier = parseInt(qtyInputVal ? qtyInputVal.value : 1) || 1;
      
      let items = [];
      
      if (activeOption === 'buy_1') {
        const varId1 = getDropdownValue('bundle-1-pillow-1-select');
        const varId2 = getDropdownValue('bundle-1-pillow-2-select');
        
        const paidCounts = {};
        const freeCounts = {};
        if (varId1) paidCounts[varId1] = (paidCounts[varId1] || 0) + 1;
        if (varId2) freeCounts[varId2] = (freeCounts[varId2] || 0) + 1;

        for (let id in paidCounts) {
          items.push({
            id: parseInt(id),
            quantity: paidCounts[id] * qtyMultiplier,
            properties: { '_bogo_type': 'paid' }
          });
        }
        for (let id in freeCounts) {
          items.push({
            id: parseInt(id),
            quantity: freeCounts[id] * qtyMultiplier,
            properties: { '_bogo_type': 'free' }
          });
        }
      } else if (activeOption === 'buy_2') {
        const varId1 = getDropdownValue('bundle-2-pillow-1-select');
        const varId2 = getDropdownValue('bundle-2-pillow-2-select');
        const varId3 = getDropdownValue('bundle-2-pillow-3-select');
        const varId4 = getDropdownValue('bundle-2-pillow-4-select');
        
        const paidCounts = {};
        const freeCounts = {};
        [varId1, varId3].forEach(id => { if (id) paidCounts[id] = (paidCounts[id] || 0) + 1; });
        [varId2, varId4].forEach(id => { if (id) freeCounts[id] = (freeCounts[id] || 0) + 1; });

        for (let id in paidCounts) {
          items.push({
            id: parseInt(id),
            quantity: paidCounts[id] * qtyMultiplier,
            properties: { '_bogo_type': 'paid' }
          });
        }
        for (let id in freeCounts) {
          items.push({
            id: parseInt(id),
            quantity: freeCounts[id] * qtyMultiplier,
            properties: { '_bogo_type': 'free' }
          });
        }
      }

      const buyBtn = addToCartForm.querySelector('.premium-buy-btn');
      const originalText = buyBtn ? buyBtn.innerHTML : '';
      if (buyBtn) {
        buyBtn.disabled = true;
        buyBtn.innerHTML = '<span class="material-symbols-outlined">sync</span> Loading...';
      }

      fetch('/cart/add.js', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items: items })
      }).then(res => res.json())
        .then(data => {
          if (buyBtn) {
            buyBtn.disabled = false;
            buyBtn.innerHTML = originalText;
          }
          if (window.openCartDrawer) {
            window.openCartDrawer();
          } else {
            window.location.href = '/cart';
          }
        }).catch(err => {
          console.error('Error adding items to cart:', err);
          if (buyBtn) {
            buyBtn.disabled = false;
            buyBtn.innerHTML = originalText;
          }
        });
    });
  }

  // Gallery switcher
  const slides = document.querySelectorAll('.gallery-slide-img');
  const thumbnails = document.querySelectorAll('.thumb-card');
  const dots = document.querySelectorAll('.indicator-dot');
  const prevArrow = document.querySelector('.prev-arrow');
  const nextArrow = document.querySelector('.next-arrow');
  
  let currentSlide = 0;
  const totalSlides = slides.length;
  
  function goToSlide(index) {
    if (typeof disableHintForever === 'function') {
      disableHintForever();
    }
    if (totalSlides === 0) return;

    if (index < 0) {
      currentSlide = totalSlides - 1;
    } else if (index >= totalSlides) {
      currentSlide = 0;
    } else {
      currentSlide = index;
    }
    
    slides.forEach((slide, i) => {
      if (i === currentSlide) {
        slide.classList.add('active');
      } else {
        slide.classList.remove('active');
      }
    });
    
    thumbnails.forEach((t, i) => {
      if (i === currentSlide) {
        t.classList.add('active');
        t.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'nearest' });
      } else {
        t.classList.remove('active');
      }
    });

    dots.forEach((dot, i) => {
      if (i === currentSlide) {
        dot.classList.add('active');
      } else {
        dot.classList.remove('active');
      }
    });
  }
  
  if (prevArrow && nextArrow) {
    prevArrow.addEventListener('click', (e) => {
      e.preventDefault();
      goToSlide(currentSlide - 1);
    });
    
    nextArrow.addEventListener('click', (e) => {
      e.preventDefault();
      goToSlide(currentSlide + 1);
    });
  }
  
  thumbnails.forEach((thumb) => {
    thumb.addEventListener('click', () => {
      const index = parseInt(thumb.getAttribute('data-index')) || 0;
      goToSlide(index);
    });
  });

  dots.forEach((dot) => {
    dot.addEventListener('click', () => {
      const index = parseInt(dot.getAttribute('data-index')) || 0;
      goToSlide(index);
    });
  });

  const viewport = document.querySelector('.main-image-viewport');
  if (viewport) {
    let startX = 0;
    let startY = 0;
    let endX = 0;
    let endY = 0;
    let isDragging = false;

    viewport.addEventListener('dragstart', (e) => e.preventDefault());

    viewport.addEventListener('touchstart', (e) => {
      if (e.touches && e.touches.length === 1) {
        startX = e.touches[0].clientX;
        startY = e.touches[0].clientY;
        isDragging = true;
      }
    }, { passive: true });

    viewport.addEventListener('touchend', (e) => {
      if (!isDragging) return;
      isDragging = false;
      if (e.changedTouches && e.changedTouches.length > 0) {
        endX = e.changedTouches[0].clientX;
        endY = e.changedTouches[0].clientY;
        handleSwipe();
      }
    }, { passive: true });

    viewport.addEventListener('mousedown', (e) => {
      if (e.target.closest('.gallery-arrow-btn')) return;
      if (e.button !== 0) return;
      startX = e.clientX;
      startY = e.clientY;
      endX = e.clientX;
      endY = e.clientY;
      isDragging = true;
      viewport.classList.add('is-dragging');
    });

    window.addEventListener('mousemove', (e) => {
      if (!isDragging) return;
      endX = e.clientX;
      endY = e.clientY;
    });

    window.addEventListener('mouseup', (e) => {
      if (!isDragging) return;
      isDragging = false;
      viewport.classList.remove('is-dragging');
      endX = e.clientX;
      endY = e.clientY;
      handleSwipe();
    });

    function handleSwipe() {
      const diffX = endX - startX;
      const diffY = endY - startY;

      if (Math.abs(diffX) > Math.abs(diffY)) {
        if (Math.abs(diffX) > 35) {
          if (diffX > 0) {
            goToSlide(currentSlide - 1);
          } else {
            goToSlide(currentSlide + 1);
          }
        }
      }
    }
  }

  const swipeHint = document.getElementById('gallery-swipe-hint');
  let hintTimer = null;
  let hintShown = false;
  let userInteracted = false;

  function disableHintForever() {
    userInteracted = true;
    if (hintTimer) {
      clearTimeout(hintTimer);
      hintTimer = null;
    }
    if (swipeHint) {
      swipeHint.classList.remove('visible');
    }
  }

  if (swipeHint && viewport) {
    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting && !userInteracted && !hintShown) {
            hintTimer = setTimeout(() => {
              if (!userInteracted && !hintShown) {
                swipeHint.classList.add('visible');
                hintShown = true;
                setTimeout(() => {
                  swipeHint.classList.remove('visible');
                }, 4000);
              }
            }, 4000);
          } else {
            if (hintTimer) {
              clearTimeout(hintTimer);
              hintTimer = null;
            }
          }
        });
      }, { threshold: 0.5 });
      observer.observe(viewport);
    }
  }

  document.querySelectorAll('.product-info-description li').forEach(function(li) {
    let materialSpan = li.querySelector('.material-symbols-outlined');
    if (materialSpan) {
      materialSpan.classList.add('bullet-icon');
      let nextSibling = materialSpan.nextSibling;
      let textContainer = document.createElement('span');
      textContainer.className = 'bullet-text';
      while (nextSibling) {
        let currentSibling = nextSibling;
        nextSibling = nextSibling.nextSibling;
        textContainer.appendChild(currentSibling);
      }
      textContainer.textContent = textContainer.textContent.trim();
      li.appendChild(textContainer);
      return;
    }
    
    let text = li.textContent.trim();
    let match = text.match(/^([^\w\s\d,.:;'"?!()-]+)\s*(.*)/u);
    if (match) {
      let icon = match[1].trim();
      let remainingText = match[2].trim();
      li.innerHTML = '<span class="bullet-icon">' + icon + '</span><span class="bullet-text">' + remainingText + '</span>';
    }
  });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initProduct);
} else {
  initProduct();
}
