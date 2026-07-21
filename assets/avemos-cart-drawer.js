function initCartDrawer() {
  const drawer = document.getElementById('cart-drawer');
  if (!drawer) return;

  const overlay = document.getElementById('cart-drawer-overlay');
  const closeBtn = document.getElementById('cart-drawer-close-btn');
  const continueBtn = document.getElementById('cart-drawer-continue-btn');
  const itemsList = document.getElementById('cart-drawer-items-list');
  const emptyState = document.getElementById('cart-drawer-empty');
  const cartFooter = document.getElementById('cart-drawer-footer');
  
  const subtotalCurrent = document.getElementById('drawer-subtotal-current');
  const subtotalOriginal = document.getElementById('drawer-subtotal-original');
  const subtotalSave = document.getElementById('drawer-subtotal-save');
  
  const progressBar = document.getElementById('shipping-progress-bar');
  const progressText = document.getElementById('shipping-progress-text');
  const truckIcon = document.getElementById('shipping-truck-icon');
  
  const protectionToggle = document.getElementById('shipping-protection-toggle');
  const checkoutBtn = document.getElementById('drawer-checkout-btn');

  let currentCart = null;
  let debounceTimer = null;
  let pendingUpdates = {};

  // Load configs from dataset attributes (from shopify schema)
  const shippingThreshold = parseFloat(drawer.dataset.shippingThreshold || 50) * 100; // in cents
  const protectionPrice = parseFloat(drawer.dataset.protectionPrice || 5.00) * 100; // in cents
  const savePercentVal = parseInt(drawer.dataset.savePercent || 57);
  const bogoEnabled = drawer.dataset.enableBogo === 'true';
  
  const pillowQty1Price = parseFloat(drawer.dataset.pillowQty1Price || 39.00) * 100;
  const pillowQty1Original = parseFloat(drawer.dataset.pillowQty1Original || 78.00) * 100;
  const pillowQty2Price = parseFloat(drawer.dataset.pillowQty2Price || 19.50) * 100;
  const pillowQty2Info = drawer.dataset.pillowQty2Info || '($19.50 each)';
  const pillowQty3Price = parseFloat(drawer.dataset.pillowQty3Price || 26.00) * 100;
  const pillowQty3Info = drawer.dataset.pillowQty3Info || '($26.00 each)';
  const pillowQty4Price = parseFloat(drawer.dataset.pillowQty4Price || 17.00) * 100;
  const pillowQty4Info = drawer.dataset.pillowQty4Info || '($17.00 each)';

  // Toggle open class
  function openCartDrawer() {
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
    if (scrollbarWidth > 0) {
      document.body.style.paddingRight = `${scrollbarWidth}px`;
    }
    drawer.classList.add('active');
    document.body.classList.add('cart-drawer-open');
    drawer.setAttribute('aria-hidden', 'false');
    fetchAndRenderCart();
  }

  function closeCartDrawer() {
    drawer.classList.remove('active');
    document.body.classList.remove('cart-drawer-open');
    document.body.style.paddingRight = '';
    drawer.setAttribute('aria-hidden', 'true');
  }

  if (closeBtn) closeBtn.addEventListener('click', closeCartDrawer);
  if (overlay) overlay.addEventListener('click', closeCartDrawer);
  if (continueBtn) continueBtn.addEventListener('click', closeCartDrawer);

  // Hook into any click to cart links/icons
  function hookCartButtons() {
    const cartButtons = document.querySelectorAll('a[href="/cart"], a[href*="cart_url"], .cart-icon-btn');
    cartButtons.forEach(btn => {
      // Clone to remove previous event listeners if any
      const newBtn = btn.cloneNode(true);
      if (btn.parentNode) {
        btn.parentNode.replaceChild(newBtn, btn);
      }
      newBtn.addEventListener('click', (e) => {
        e.preventDefault();
        openCartDrawer();
      });
    });
  }

  let protectionVariantId = null;

  async function fetchProtectionVariantId() {
    try {
      const res = await fetch('/products/shipping-protection.js');
      if (res.ok) {
        const prod = await res.json();
        if (prod && prod.variants && prod.variants.length > 0) {
          protectionVariantId = prod.variants[0].id;
        }
      }
    } catch (e) {
      console.warn('Shipping Protection product not found or not published.');
    }
  }
  fetchProtectionVariantId();

  async function addProtectionToCart() {
    if (!protectionVariantId) return;
    try {
      drawer.querySelector('.cart-drawer-panel').classList.add('loading-active');
      await fetch('/cart/add.js', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items: [{ id: protectionVariantId, quantity: 1 }] })
      });
      await fetchAndRenderCart();
    } catch (e) {
      console.error('Failed to add shipping protection:', e);
    } finally {
      drawer.querySelector('.cart-drawer-panel').classList.remove('loading-active');
    }
  }

  async function removeProtectionFromCart() {
    if (!currentCart) return;
    const protectionItem = currentCart.items.find(i => i.handle === 'shipping-protection' || i.product_title.toLowerCase().includes('shipping protection'));
    if (protectionItem) {
      try {
        drawer.querySelector('.cart-drawer-panel').classList.add('loading-active');
        await fetch('/cart/change.js', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: protectionItem.key, quantity: 0 })
        });
        await fetchAndRenderCart();
      } catch (e) {
        console.error('Failed to remove shipping protection:', e);
      } finally {
        drawer.querySelector('.cart-drawer-panel').classList.remove('loading-active');
      }
    }
  }

  async function fetchAndRenderCart() {
    try {
      drawer.querySelector('.cart-drawer-panel').classList.add('loading-active');
      const response = await fetch('/cart.js');
      const cart = await response.json();
      currentCart = cart;
      renderCart(cart);
    } catch (err) {
      console.error('Error fetching cart:', err);
    } finally {
      drawer.querySelector('.cart-drawer-panel').classList.remove('loading-active');
    }
  }

  function getPillowUnitPriceCents(qty) {
    if (qty <= 1) return pillowQty1Price;
    if (qty === 2) return pillowQty2Price;
    if (qty === 3) return pillowQty3Price;
    return pillowQty4Price;
  }

  function getPillowOriginalUnitPriceCents(qty) {
    return pillowQty1Original;
  }

  function renderCart(cart) {
    const bodyEl = drawer.querySelector('.cart-drawer-body');
    const scrollTop = bodyEl ? bodyEl.scrollTop : 0;

    const countBadges = document.querySelectorAll('.cart-count-badge, .cart-count, sup.cart-count');
    countBadges.forEach(badge => {
      badge.textContent = cart.item_count;
      badge.style.display = cart.item_count > 0 ? '' : 'none';
    });

    if (cart.item_count === 0) {
      if (emptyState) emptyState.style.display = 'flex';
      if (itemsList) itemsList.style.display = 'none';
      if (cartFooter) cartFooter.style.display = 'none';
      if (protectionToggle) protectionToggle.checked = false;
      return;
    }

    if (emptyState) emptyState.style.display = 'none';
    if (itemsList) {
      itemsList.style.display = 'block';
      itemsList.innerHTML = '';
    }
    if (cartFooter) cartFooter.style.display = 'block';

    const hasProtectionInCart = cart.items.some(i => i.handle === 'shipping-protection' || i.product_title.toLowerCase().includes('shipping protection'));
    const isOptedOut = localStorage.getItem('shipping_protection_opt_out') === 'true';

    if (protectionToggle) {
      if (hasProtectionInCart) {
        protectionToggle.checked = true;
      } else if (!isOptedOut && protectionVariantId && cart.items.length > 0) {
        protectionToggle.checked = true;
        addProtectionToCart();
        return;
      } else {
        protectionToggle.checked = false;
      }
    }

    let basePricesSubtotal = 0;
    let originalPricesSubtotal = 0;
    let totalPillowsQty = 0;

    cart.items.forEach(item => {
      if (item.product_title && item.product_title.toLowerCase().includes('pillow')) {
        totalPillowsQty += item.quantity;
      }
    });

    const displayCards = [];
    const groupedItems = cart.items;

    if (bogoEnabled) {
      let totalPillowsQty = 0;
      groupedItems.forEach(item => {
        const isProtection = item.handle === 'shipping-protection' || (item.product_title && item.product_title.toLowerCase().includes('shipping protection'));
        if (isProtection) return;

        const isPillow = item.product_title && item.product_title.toLowerCase().includes('pillow');
        if (isPillow) {
          totalPillowsQty += item.quantity;
        }
      });

      let paidTargetRemaining = Math.ceil(totalPillowsQty / 2);
      let freeTargetRemaining = Math.floor(totalPillowsQty / 2);

      const groupBogo = {};
      groupedItems.forEach(item => {
        const isProtection = item.handle === 'shipping-protection' || (item.product_title && item.product_title.toLowerCase().includes('shipping protection'));
        if (isProtection) return;

        const isPillow = item.product_title && item.product_title.toLowerCase().includes('pillow');
        if (isPillow) {
          let paidQty = 0;
          let freeQty = 0;

          for (let q = 0; q < item.quantity; q++) {
            if (paidTargetRemaining > 0) {
              paidQty++;
              paidTargetRemaining--;
            } else if (freeTargetRemaining > 0) {
              freeQty++;
              freeTargetRemaining--;
            } else {
              paidQty++;
            }
          }

          const unitPriceVal = pillowQty1Price;
          const unitOrigVal = pillowQty1Original;

          groupBogo[item.key] = {
            paidQty,
            freeQty,
            unitCurrentPrice: unitPriceVal,
            unitOriginalPrice: unitOrigVal
          };
        }
      });

      groupedItems.forEach(item => {
        const isProtection = item.handle === 'shipping-protection' || item.product_title.toLowerCase().includes('shipping protection');
        if (isProtection) {
          displayCards.push({
            ...item,
            isFreeCard: false,
            cardQty: item.quantity,
            totalItemQty: item.quantity,
            cardPrice: (item.final_price || item.price) * item.quantity,
            cardOriginalPrice: (item.original_price || item.price) * item.quantity,
            unitCurrentPrice: item.final_price || item.price,
            unitOriginalPrice: item.original_price || item.price
          });
          return;
        }

        const bogoInfo = groupBogo[item.key];
        if (bogoInfo) {
          if (bogoInfo.paidQty > 0) {
            displayCards.push({
              ...item,
              isFreeCard: false,
              cardQty: bogoInfo.paidQty,
              totalItemQty: item.quantity,
              cardPrice: bogoInfo.paidQty * bogoInfo.unitCurrentPrice,
              cardOriginalPrice: bogoInfo.paidQty * bogoInfo.unitOriginalPrice,
              unitCurrentPrice: bogoInfo.unitCurrentPrice,
              unitOriginalPrice: bogoInfo.unitOriginalPrice
            });
          }
          if (bogoInfo.freeQty > 0) {
            displayCards.push({
              ...item,
              isFreeCard: true,
              cardQty: bogoInfo.freeQty,
              totalItemQty: item.quantity,
              cardPrice: 0,
              cardOriginalPrice: bogoInfo.freeQty * bogoInfo.unitOriginalPrice,
              unitCurrentPrice: bogoInfo.unitCurrentPrice,
              unitOriginalPrice: bogoInfo.unitOriginalPrice
            });
          }
        } else {
          displayCards.push({
            ...item,
            isFreeCard: false,
            cardQty: item.quantity,
            totalItemQty: item.quantity,
            cardPrice: item.price * item.quantity,
            cardOriginalPrice: (item.compare_at_price || item.price) * item.quantity,
            unitCurrentPrice: item.price,
            unitOriginalPrice: item.compare_at_price || item.price
          });
        }
      });
    } else {
      groupedItems.forEach(item => {
        const isProtection = item.handle === 'shipping-protection' || item.product_title.toLowerCase().includes('shipping protection');
        const isPillow = item.product_title.toLowerCase().includes('pillow');
        const currentPricePerUnit = isPillow ? getPillowUnitPriceCents(totalPillowsQty) : (item.final_price || item.price);
        const originalPricePerUnit = isPillow ? getPillowOriginalUnitPriceCents(totalPillowsQty) : (item.compare_at_price || item.original_price || item.price);

        displayCards.push({
          ...item,
          isFreeCard: false,
          cardQty: item.quantity,
          totalItemQty: item.quantity,
          cardPrice: isProtection ? (item.final_price || item.price) * item.quantity : currentPricePerUnit * item.quantity,
          cardOriginalPrice: isProtection ? (item.original_price || item.price) * item.quantity : originalPricePerUnit * item.quantity,
          unitCurrentPrice: currentPricePerUnit,
          unitOriginalPrice: originalPricePerUnit
        });
      });
    }

    displayCards.forEach((card) => {
      const isProtection = card.handle === 'shipping-protection' || card.product_title.toLowerCase().includes('shipping protection');
      if (isProtection) return;

      const itemTitle = card.product_title;
      const itemElement = document.createElement('div');
      itemElement.className = 'cart-drawer-item';
      if (card.isFreeCard) {
        itemElement.classList.add('bogo-free-item-card');
        itemElement.style.border = '1.5px dashed #2e6f40';
        itemElement.style.backgroundColor = '#f4fbf6';
      }
      itemElement.dataset.key = card.key;
      itemElement.dataset.keys = JSON.stringify(card.keys || [card.key]);
      itemElement.dataset.isFreeCard = card.isFreeCard ? 'true' : 'false';

      basePricesSubtotal += card.cardPrice;
      originalPricesSubtotal += card.cardOriginalPrice;

      const currentLineFormatted = card.isFreeCard ? 'FREE' : formatMoney(card.cardPrice);
      const originalLineFormatted = formatMoney(card.cardOriginalPrice);

      let priceLabelHTML = '';
      if (card.isFreeCard) {
        priceLabelHTML = `<span class="subtotal-badge" style="background:#2e6f40; color:#fff; font-size:10px; padding:2px 6px; border-radius:4px; font-weight:700;">FREE BOGO GIFT</span>`;
      } else {
        priceLabelHTML = `<span class="price-current">${currentLineFormatted}</span>`;
      }

      let originalPriceHTML = '';
      if (card.cardOriginalPrice > card.cardPrice) {
        originalPriceHTML = `<span class="price-original" style="text-decoration: line-through; color: #75777d; font-size: 0.9rem;">${originalLineFormatted}</span>`;
      }

      let priceEachHTML = '';
      if (!card.isFreeCard && card.cardQty > 1) {
        priceEachHTML = `<span class="price-each" style="font-size: 11px; color: #75777d; margin-top: 1px; white-space: nowrap;">${formatMoney(card.unitCurrentPrice)} each</span>`;
      } else if (card.isFreeCard) {
        priceEachHTML = `<span class="price-each" style="font-size: 11px; color: #2e6f40; margin-top: 1px; white-space: nowrap; font-weight:600;">$0.00 each</span>`;
      }

      itemElement.innerHTML = `
        <div class="item-img-col">
          <img src="${card.image ? card.image : '//cdn.shopify.com/s/images/admin/no-image-large.gif'}" alt="${itemTitle}">
        </div>
        <div class="item-info-col">
          <a href="${card.url}" class="item-title">${itemTitle}</a>
          ${card.variant_title && !card.variant_title.includes('Default') ? `<div style="font-size: 12px; color: #75777d; margin-top: 1px;">${card.variant_title}</div>` : ''}
          <div class="item-qty-selector">
            <button type="button" class="item-qty-btn" data-action="minus" data-key="${card.key}" data-is-free="${card.isFreeCard}">-</button>
            <input type="number" class="item-qty-input" value="${card.cardQty}" readonly>
            <button type="button" class="item-qty-btn" data-action="plus" data-key="${card.key}" data-is-free="${card.isFreeCard}">+</button>
          </div>
        </div>
        <div class="item-price-col">
          <button type="button" class="item-delete-btn" data-action="delete" data-key="${card.key}">
            <i class="fa-regular fa-trash-can"></i>
          </button>
          <div class="item-prices-box">
            ${priceLabelHTML}
            ${priceEachHTML}
            ${originalPriceHTML}
          </div>
        </div>
      `;

      itemsList.appendChild(itemElement);
    });

    let protectionCost = 0;
    if (hasProtectionInCart) {
      protectionCost = protectionPrice; 
    }

    const finalSubtotal = basePricesSubtotal + protectionCost;
    const finalOriginal = originalPricesSubtotal + protectionCost;
    const savePercent = finalOriginal > 0 ? Math.round((1 - (finalSubtotal / finalOriginal)) * 100) : savePercentVal;

    if (subtotalCurrent) subtotalCurrent.textContent = formatMoney(finalSubtotal);
    if (subtotalOriginal) subtotalOriginal.textContent = formatMoney(finalOriginal);
    if (subtotalSave) subtotalSave.textContent = `Save ${savePercent}%`;

    const baseSubtotalNoProtection = basePricesSubtotal;
    if (progressBar && truckIcon && progressText) {
      if (baseSubtotalNoProtection >= shippingThreshold) {
        progressBar.style.width = '100%';
        truckIcon.style.left = '100%';
        progressText.innerHTML = 'Congrats! You\'ve unlocked <strong>FREE SHIPPING!</strong>';
      } else {
        const percentage = (baseSubtotalNoProtection / shippingThreshold) * 100;
        progressBar.style.width = `${percentage}%`;
        truckIcon.style.left = `${percentage}%`;
        const difference = formatMoney(shippingThreshold - baseSubtotalNoProtection);
        progressText.innerHTML = `You are only <strong>${difference}</strong> away from <strong>FREE SHIPPING!</strong>`;
      }
    }

    if (bodyEl && scrollTop > 0) {
      bodyEl.scrollTop = scrollTop;
    }
  }

  function queueQtyUpdate(key, newQty, keysArray = []) {
    if (keysArray.length > 1) {
      keysArray.forEach(k => {
        if (k === key) {
          pendingUpdates[k] = newQty;
        } else {
          pendingUpdates[k] = 0;
        }
      });
    } else {
      pendingUpdates[key] = newQty;
    }
    
    if (debounceTimer) {
      clearTimeout(debounceTimer);
    }
    
    debounceTimer = setTimeout(async () => {
      drawer.querySelector('.cart-drawer-panel').classList.add('loading-active');
      const updatesToSend = { ...pendingUpdates };
      pendingUpdates = {};
      
      try {
        const response = await fetch('/cart/update.js', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify({ updates: updatesToSend })
        });
        const cart = await response.json();
        if (Object.keys(pendingUpdates).length === 0) {
          currentCart = cart;
          renderCart(cart);
        }
      } catch (err) {
        console.error('Error changing qty:', err);
        await fetchAndRenderCart();
      } finally {
        if (Object.keys(pendingUpdates).length === 0) {
          drawer.querySelector('.cart-drawer-panel').classList.remove('loading-active');
        }
      }
    }, 350);
  }

  if (itemsList) {
    itemsList.addEventListener('click', (e) => {
      const btn = e.target.closest('.item-qty-btn, .item-delete-btn');
      if (!btn) return;

      const key = btn.dataset.key;
      const action = btn.dataset.action;
      const card = btn.closest('.cart-drawer-item');
      if (!card) return;

      const keysArray = JSON.parse(card.dataset.keys || '[]');
      const input = card.querySelector('.item-qty-input');
      const currentCardQty = input ? parseInt(input.value) : 1;
      let newCardQty = currentCardQty;

      if (action === 'plus') {
        newCardQty = currentCardQty + 1;
      } else if (action === 'minus') {
        newCardQty = Math.max(0, currentCardQty - 1);
      } else if (action === 'delete') {
        newCardQty = 0;
      }

      const newTotalQty = bogoEnabled && newCardQty > 0 ? (newCardQty * 2) : newCardQty;

      if (input) {
        input.value = newCardQty;
      }

      if (currentCart && currentCart.items) {
        const itemIndex = currentCart.items.findIndex(item => item.key === key);
        if (itemIndex > -1) {
          if (newTotalQty === 0) {
            currentCart.items = currentCart.items.filter(item => !keysArray.includes(item.key));
          } else {
            currentCart.items[itemIndex].quantity = newTotalQty;
            currentCart.items = currentCart.items.filter(item => item.key === key || !keysArray.includes(item.key));
          }
          renderCart(currentCart);
        }
      }

      queueQtyUpdate(key, newTotalQty, keysArray);
    });
  }

  if (protectionToggle) {
    protectionToggle.addEventListener('change', () => {
      if (protectionToggle.checked) {
        localStorage.setItem('shipping_protection_opt_out', 'false');
        addProtectionToCart();
      } else {
        localStorage.setItem('shipping_protection_opt_out', 'true');
        removeProtectionFromCart();
      }
    });
  }

  if (checkoutBtn) {
    checkoutBtn.addEventListener('click', async (e) => {
      e.preventDefault();
      try {
        const res = await fetch('/cart.js');
        const cart = await res.json();
        let discountCode = '';
        if (bogoEnabled) {
          discountCode = 'BOGO';
        } else {
          let pillowQty = 0;
          cart.items.forEach(item => {
            if (item.product_title && item.product_title.toLowerCase().includes('pillow')) {
              pillowQty += item.quantity;
            }
          });
          
          if (pillowQty === 2) discountCode = 'PILLOWS2';
          else if (pillowQty === 3) discountCode = 'PILLOWS3';
          else if (pillowQty === 4) discountCode = 'PILLOWS4';
          else if (pillowQty === 5) discountCode = 'PILLOWS5';
          else if (pillowQty >= 6) discountCode = 'PILLOWS6';
        }

        if (discountCode) {
          window.location.href = `/discount/${discountCode}?redirect=/checkout`;
        } else {
          window.location.href = '/checkout';
        }
      } catch (err) {
        window.location.href = '/checkout';
      }
    });
  }

  function formatMoney(cents) {
    return '$' + (cents / 100).toFixed(2);
  }

  hookCartButtons();
  window.openCartDrawer = openCartDrawer;
  window.fetchAndRenderCart = fetchAndRenderCart;

  if (window.location.search.includes('open-cart=1')) {
    openCartDrawer();
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initCartDrawer);
} else {
  initCartDrawer();
}
