/* ═══════════════════════════════════════════════
   API CONFIG
═══════════════════════════════════════════════ */
const API = 'http://localhost:5000/api';

/* ═══════════════════════════════════════════════
   DATA STORE — loaded from MongoDB via API
═══════════════════════════════════════════════ */
let PRODUCTS = [];

async function loadProducts() {
    try {
        const res = await fetch(`${API}/products`);
        PRODUCTS = await res.json();
        // Re-render current page after products load
        if (currentPage === 'home') {
            loadFeaturedProducts();
        } else if (currentPage === 'shop') {
            renderShopProducts();
        }
    } catch (err) {
        console.error('Failed to load products from server:', err);
    }
}


const CATEGORIES = [{
    name: "Women's Section",
    img: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=500&q=75',
    badge: 'Popular',
}, {
    name: "Men's Section",
    img: 'https://images.unsplash.com/photo-1617127365659-c47fa864d8bc?w=500&q=75',
    badge: '',
}, {
    name: "Kids Section",
    img: 'kidss.png',
    badge: 'New',
}, {
    name: "Sports Section",
    img: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=500&q=75',
    badge: '',
}, {
    name: "Ethnic Wear",
    img: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=500&q=75',
    badge: 'Festive',
}, {
    name: "Fabrics",
    img: 'fabrics.webp',
    badge: 'Premium',
}, {
    name: "Accessories",
    img: 'Accessories.jpg',
    badge: 'New',
}, {
    name: "Traditional Jewellery",
    img: 'https://images.unsplash.com/photo-1602173574767-37ac01994b2a?w=500&q=75',
    badge: '',
}, {
    name: "Handbags",
    img: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=500&q=75',
    badge: 'Trending',
}, ];

const ACC_POSTERS = [{
    name: 'Handcrafted Handbags',
    desc: 'Artisan leather & fabric bags',
    img: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=400&q=75',
    color: '#7B1D1D',
    cat: 'Handbags'
}, {
    name: 'Traditional Jewellery',
    desc: 'Gold & silver ethnic sets',
    img: 'https://images.unsplash.com/photo-1602173574767-37ac01994b2a?w=400&q=75',
    color: '#4A1A6B',
    cat: 'Traditional Jewellery'
}, {
    name: 'Fashion Scarves',
    desc: 'Silk & cotton dupatta collection',
    img: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=400&q=75',
    color: '#5A1313',
    cat: 'Accessories'
}, {
    name: 'Ethnic Footwear',
    desc: 'Kolhapuri & mojari styles',
    img: 'https://images.unsplash.com/photo-1603808033192-082d6919d3e1?w=400&q=75',
    color: '#3D0C0C',
    cat: 'Footwear'
}, ];

let cart = JSON.parse(localStorage.getItem('mt_cart') || '[]');
let wishlist = JSON.parse(localStorage.getItem('mt_wish') || '[]');
let discount = 0;
let couponApplied = false;
let currentSlide = 0;
let slideInterval;
let currentPage = 'home';

/* ═══════════════════════════════════════════════
   PAGE NAVIGATION
═══════════════════════════════════════════════ */
let pageHistory = ['home'];
const SEP = ':::';

function goBack() {
    if (pageHistory.length > 1) {
        pageHistory.pop();
        const prev = pageHistory[pageHistory.length - 1];
        const parts = prev.split(SEP);
        showPageNoHistory(parts[0], parts[1] || null);
    } else {
        showPageNoHistory('home');
    }
}

function showPageNoHistory(page, cat) {
    document.querySelectorAll('.page-section').forEach(s => s.classList.remove('active-page'));
    const el = document.getElementById('page-' + page);
    if (el) {
        el.classList.add('active-page');
        currentPage = page;
    }
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
    document.querySelectorAll('.nav-link').forEach(n => n.classList.remove('active'));
    if (page === 'shop') {
        loadShopProducts(cat);
        document.getElementById('shopTitle').textContent = cat || 'All Products';
        document.getElementById('shopCrumb').textContent = cat || 'Shop';
    }
    if (page === 'checkout') loadCheckoutSummary();
    if (page === 'wishlist') loadWishlist();
    if (page === 'home') {
        loadCategories();
        loadFeaturedProducts();
        loadAccPosters();
        startSlider();
        initReveal();
    }
}

function showPage(page, cat) {
    const key = cat ? (page + SEP + cat) : page;
    if (pageHistory[pageHistory.length - 1] !== key) pageHistory.push(key);
    if (pageHistory.length > 20) pageHistory.shift();

    document.querySelectorAll('.page-section').forEach(s => s.classList.remove('active-page'));
    const el = document.getElementById('page-' + page);
    if (el) {
        el.classList.add('active-page');
        currentPage = page;
    }
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
    document.querySelectorAll('.nav-link').forEach(n => n.classList.remove('active'));

    if (page === 'shop') {
        loadShopProducts(cat);
        document.getElementById('shopTitle').textContent = cat || 'All Products';
        document.getElementById('shopCrumb').textContent = cat || 'Shop';
    }
    if (page === 'checkout') loadCheckoutSummary();
    if (page === 'wishlist') loadWishlist();
    if (page === 'home') {
        loadCategories();
        loadFeaturedProducts();
        loadAccPosters();
        startSlider();
        initReveal();
    }
}

/* ═══════════════════════════════════════════════
   HERO SLIDER
═══════════════════════════════════════════════ */
function goSlide(idx) {
    document.querySelectorAll('.hero-slide').forEach((s, i) => {
        s.style.opacity = i === idx ? '1' : '0';
        s.style.zIndex = i === idx ? '1' : '0';
    });
    document.querySelectorAll('.hdot').forEach((d, i) => d.classList.toggle('active', i === idx));
    currentSlide = idx;
}

function startSlider() {
    clearInterval(slideInterval);
    slideInterval = setInterval(() => goSlide((currentSlide + 1) % 3), 4500);
}

/* ═══════════════════════════════════════════════
   RENDER HELPERS
═══════════════════════════════════════════════ */
function stars(r) {
    const full = Math.floor(r),
        half = r % 1 >= .5 ? 1 : 0,
        empty = 5 - full - half;
    return '★'.repeat(full) + (half ? '⯨' : '') + ('☆').repeat(empty);
}

function fmt(n) {
    return '₹' + n.toLocaleString('en-IN');
}

function prodCard(p, showQuick = true) {
    const inWish = wishlist.includes(p.id);
    return `<div class="prod-card">
    <div class="prod-img-wrap">
      <img src="${p.img}" alt="${p.name}" loading="lazy" onerror="this.onerror=null;this.src='https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=500&q=75'">
      ${p.badge ? `<div class="prod-discount">${p.badge}</div>` : ''}
      ${p.isNew ? `<div class="prod-new" style="${p.badge ? 'top:2.8rem' : ''}">NEW</div>` : ''}
      <div class="prod-wishlist${inWish ? ' active' : ''}" onclick="toggleWish(${p.id},this)" title="Wishlist">♡</div>
      ${showQuick ? `<div class="prod-quick" onclick="openQuick(${p.id})">Quick View →</div>` : ''}
    </div>
    <div class="prod-info">
      <div class="prod-cat">${p.cat}</div>
      <div class="prod-name">${p.name}</div>
      <div class="prod-stars"><span class="stars-display">${stars(p.rating)}</span><span class="stars-count">(${p.reviews})</span></div>
      <div class="prod-price" style="margin-bottom:.8rem"><span class="price-now">${fmt(p.price)}</span><span class="price-old">${fmt(p.oldPrice)}</span><span class="price-off">${p.off}% off</span></div>
      <button class="prod-atc" onclick="addToCart(${p.id},this)">🛒 Add to Cart</button>
    </div>
  </div>`;
        }

        function loadCategories() {
            const g = document.getElementById('catGrid');
            if (!g) return;
            g.innerHTML = '';
            CATEGORIES.forEach(c => {
                const div = document.createElement('div');
                div.className = 'cat-card';
                div.addEventListener('click', function() {
                    showPage('shop', c.name);
                });
                div.innerHTML = `
      <img src="${c.img}" alt="${c.name}" loading="lazy"
           onerror="this.src='https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=500&q=75'">
      ${c.badge ? `<div class="cat-badge">${c.badge}</div>` : ''}
      <div class="cat-ov">
        <div class="cat-title">${c.name}</div>
        <button class="cat-btn">Explore →</button>
      </div>`;
                g.appendChild(div);
            });
        }
        function loadFeaturedProducts() {
            const g = document.getElementById('featuredProds');
            if (!g) return;
            g.innerHTML = PRODUCTS.slice(0, 8).map(p => prodCard(p)).join('');
        }
        function loadAccPosters() {
            const g = document.getElementById('accPosters');
            if (!g) return;
            g.innerHTML = ACC_POSTERS.map(a => `
    <div class="gal-item" style="border-radius:16px;overflow:hidden;position:relative;aspect-ratio:1;cursor:pointer;box-shadow:var(--card-s)" onclick="showPage('shop','Accessories')">
      <img src="${a.img}" alt="${a.name}" loading="lazy" style="width:100%;height:100%;object-fit:cover;transition:transform .5s">
      <div style="position:absolute;inset:0;background:linear-gradient(to top,${a.color}ee 0%,${a.color}88 50%,transparent 100%);display:flex;flex-direction:column;justify-content:flex-end;padding:1.5rem">
        <div style="font-family:var(--fs);font-size:1.15rem;font-weight:700;color:#fff;margin-bottom:.3rem">${a.name}</div>
        <div style="font-size:.75rem;color:rgba(255,255,255,.7)">${a.desc}</div>
        <div style="display:inline-block;margin-top:.7rem;font-size:.65rem;font-weight:700;letter-spacing:.1em;text-transform:uppercase;color:var(--gl)">Shop Now →</div>
      </div>
    </div>`).join('');
        }

        /* ═══════════════════════════════════════════════
           SHOP / FILTER / SORT
        ═══════════════════════════════════════════════ */
        let shopFilter = '';
        function loadShopProducts(cat) {
            shopFilter = cat || '';
            renderShopProducts();
        }
        function renderShopProducts() {
            const g = document.getElementById('shopProds');
            if (!g) return;
            let prods = shopFilter ? PRODUCTS.filter(p => p.cat === shopFilter) : PRODUCTS;
            document.getElementById('shopProdCount').textContent = `Showing ${prods.length} products`;
            g.innerHTML = prods.map(p => prodCard(p)).join('');
            renderPagination(prods.length);
        }
        function filterProducts() { renderShopProducts(); }
        function sortProducts(val) {
            let prods = shopFilter ? PRODUCTS.filter(p => p.cat === shopFilter) : [...PRODUCTS];
            if (val === 'price-asc') prods.sort((a, b) => a.price - b.price);
            else if (val === 'price-desc') prods.sort((a, b) => b.price - a.price);
            else if (val === 'rating') prods.sort((a, b) => b.rating - a.rating);
            else if (val === 'new') prods.sort((a, b) => b.isNew - a.isNew);
            const g = document.getElementById('shopProds');
            if (g) g.innerHTML = prods.map(p => prodCard(p)).join('');
        }
        function updatePrice(val) {
            document.getElementById('priceVal').textContent = '₹' + parseInt(val).toLocaleString('en-IN');
        }
        function toggleSize(el) {
            el.classList.toggle('size-active');
            el.style.background = el.classList.contains('size-active') ? 'var(--m)' : '';
            el.style.color = el.classList.contains('size-active') ? '#fff' : '';
            el.style.borderColor = el.classList.contains('size-active') ? 'var(--m)' : '';
        }
        function clearFilters() {
            document.querySelectorAll('.filter-check input').forEach(c => c.checked = false);
            document.querySelectorAll('.swatch').forEach(s => s.classList.remove('active'));
            shopFilter = '';
            renderShopProducts();
        }
        function renderPagination(total) {
            const p = document.getElementById('pagination');
            if (!p) return;
            const pages = Math.ceil(total / 12) || 1;
            p.innerHTML = Array.from({ length: Math.min(pages, 5) }, (_, i) => `<div class="pag-btn${i === 0 ? ' active' : ''}" onclick="this.parentElement.querySelectorAll('.pag-btn').forEach(b=>b.classList.remove('active'));this.classList.add('active')">${i + 1}</div>`).join('')
                + (pages > 5 ? `<div class="pag-btn">...</div><div class="pag-btn" onclick="...">${pages}</div>` : '');
        }

        /* ═══════════════════════════════════════════════
           CART
        ═══════════════════════════════════════════════ */
        function addToCart(id, btn) {
            const p = PRODUCTS.find(x => x.id === id);
            if (!p) return;
            const ex = cart.find(x => x.id === id);
            if (ex) ex.qty++; else cart.push({ ...p, qty: 1 });
            saveCart();
            updateCartUI();
            showNotif('🛒', `"${p.name}" added to cart!`);
            if (btn) { btn.textContent = '✓ Added'; btn.classList.add('added'); setTimeout(() => { btn.textContent = '🛒 Add to Cart'; btn.classList.remove('added'); }, 2000); }
        }
        function removeFromCart(id) {
            cart = cart.filter(x => x.id !== id);
            saveCart(); updateCartUI(); renderCartItems();
        }
        function changeQty(id, delta) {
            const item = cart.find(x => x.id === id);
            if (!item) return;
            item.qty += delta;
            if (item.qty <= 0) removeFromCart(id);
            else { saveCart(); updateCartUI(); renderCartItems(); }
        }
        function saveCart() { localStorage.setItem('mt_cart', JSON.stringify(cart)); }
        function updateCartUI() {
            const count = cart.reduce((s, x) => s + x.qty, 0);
            document.getElementById('cartBadge').textContent = count;
        }
        function openCart() {
            document.getElementById('cartOverlay').classList.add('open');
            document.getElementById('cartDrawer').classList.add('open');
            renderCartItems();
        }
        function closeCart() {
            document.getElementById('cartOverlay').classList.remove('open');
            document.getElementById('cartDrawer').classList.remove('open');
        }
        function renderCartItems() {
            const sub = cart.reduce((s, x) => s + x.price * x.qty, 0);
            const ship = sub >= 999 ? 0 : 50;
            const gst = Math.round(sub * .05);
            const disc = couponApplied ? Math.round(sub * .2) : 0;
            const total = sub + ship + gst - disc;

            document.getElementById('cartEmpty').style.display = cart.length ? 'none' : 'block';
            document.getElementById('cartCoupon').style.display = cart.length ? 'block' : 'none';
            document.getElementById('cartFoot').style.display = cart.length ? 'block' : 'none';
            document.getElementById('cartItems').innerHTML = cart.map(item => `
    <div class="cart-item">
      <img class="cart-item-img" src="${item.img}" alt="${item.name}">
      <div class="cart-item-info">
        <div class="cart-item-name">${item.name}</div>
        <div class="cart-item-variant">${item.cat}</div>
        <div class="cart-item-price">${fmt(item.price)}</div>
        <div class="qty-ctrl">
          <button class="qty-btn" onclick="changeQty(${item.id},-1)">−</button>
          <span class="qty-num">${item.qty}</span>
          <button class="qty-btn" onclick="changeQty(${item.id},1)">+</button>
        </div>
        <button class="cart-item-remove" onclick="removeFromCart(${item.id})">🗑 Remove</button>
      </div>
    </div>`).join('');

            document.getElementById('csub').textContent = fmt(sub);
            document.getElementById('cdisc').textContent = '-' + fmt(disc);
            document.getElementById('cship').textContent = ship === 0 ? 'FREE' : fmt(ship);
            document.getElementById('cgst').textContent = fmt(gst);
            document.getElementById('ctotal').textContent = fmt(total);
            discount = disc;
        }
        function applyCoupon() {
            const code = document.getElementById('couponInput').value.trim().toUpperCase();
            const msg = document.getElementById('couponMsg');
            if (code === 'FESTIVE20') {
                couponApplied = true; msg.textContent = '✅ 20% discount applied!'; msg.style.color = '#2d8a4e';
                renderCartItems(); showNotif('🎫', 'Coupon FESTIVE20 applied! 20% off');
            } else if (code === 'SAREE20') {
                couponApplied = true; msg.textContent = '✅ Saree discount applied!'; msg.style.color = '#2d8a4e';
                renderCartItems();
            } else {
                msg.textContent = '❌ Invalid coupon code. Try FESTIVE20'; msg.style.color = '#e53e3e';
            }
        }

        /* ═══════════════════════════════════════════════
           WISHLIST
        ═══════════════════════════════════════════════ */
        function toggleWish(id, el) {
            const idx = wishlist.indexOf(id);
            if (idx > -1) { wishlist.splice(idx, 1); if (el) { el.classList.remove('active'); el.textContent = '♡' } showNotif('💔', 'Removed from wishlist'); }
            else { wishlist.push(id); if (el) { el.classList.add('active'); el.textContent = '♥' } showNotif('♥', 'Added to wishlist!'); }
            localStorage.setItem('mt_wish', JSON.stringify(wishlist));
            const badge = document.getElementById('wishBadge');
            badge.textContent = wishlist.length;
            badge.style.display = wishlist.length ? 'flex' : 'none';
        }
        function loadWishlist() {
            const g = document.getElementById('wishlistGrid');
            const empty = document.getElementById('wishlistEmpty');
            if (!g) return;
            const items = PRODUCTS.filter(p => wishlist.includes(p.id));
            if (!items.length) { g.innerHTML = ''; empty.style.display = 'block'; return; }
            empty.style.display = 'none';
            g.innerHTML = items.map(p => prodCard(p)).join('');
        }

        /* ═══════════════════════════════════════════════
           QUICK VIEW
        ═══════════════════════════════════════════════ */
        function openQuick(id) {
            const p = PRODUCTS.find(x => x.id === id);
            if (!p) return;
            document.getElementById('quickContent').innerHTML = `
    <div class="pm-imgs">
      <img class="pm-main-img" src="${p.img}" alt="${p.name}" id="pmMain">
      <div class="pm-thumbs">
        ${[p.img, p.img, p.img].map((im, i) => `<img class="pm-thumb${i === 0 ? ' active' : ''}" src="${im}" alt="thumb" onclick="document.getElementById('pmMain').src=this.src;this.closest('.pm-thumbs').querySelectorAll('.pm-thumb').forEach(t=>t.classList.remove('active'));this.classList.add('active')">`).join('')}
      </div>
    </div>
    <div class="pm-info">
      <div class="pm-cat">${p.cat}</div>
      <div class="pm-name">${p.name}</div>
      <div class="pm-price-wrap"><span class="pm-price-now">${fmt(p.price)}</span><span class="pm-price-old">${fmt(p.oldPrice)}</span><span class="pm-price-off">${p.off}% off</span></div>
      <div class="prod-stars" style="margin-bottom:1rem"><span class="stars-display">${stars(p.rating)}</span><span class="stars-count">(${p.reviews} reviews)</span></div>
      <p class="pm-desc">Premium quality ${p.name.toLowerCase()} crafted by skilled artisans. Perfect for occasions, gifts, and everyday elegance. Guaranteed authenticity and pure materials.</p>
      <span class="pm-label">Select Size</span>
      <div class="pm-sizes">
        <button class="size-btn active" onclick="this.closest('.pm-sizes').querySelectorAll('.size-btn').forEach(b=>b.classList.remove('active'));this.classList.add('active')">S</button>
        <button class="size-btn" onclick="this.closest('.pm-sizes').querySelectorAll('.size-btn').forEach(b=>b.classList.remove('active'));this.classList.add('active')">M</button>
        <button class="size-btn" onclick="this.closest('.pm-sizes').querySelectorAll('.size-btn').forEach(b=>b.classList.remove('active'));this.classList.add('active')">L</button>
        <button class="size-btn" onclick="this.closest('.pm-sizes').querySelectorAll('.size-btn').forEach(b=>b.classList.remove('active'));this.classList.add('active')">XL</button>
        <button class="size-btn" onclick="this.closest('.pm-sizes').querySelectorAll('.size-btn').forEach(b=>b.classList.remove('active'));this.classList.add('active')">XXL</button>
      </div>
      <span class="pm-label">Select Color</span>
      <div class="pm-colors">
        <div style="width:28px;height:28px;border-radius:50%;background:#8B0000;cursor:pointer;border:2px solid var(--g)" title="Maroon"></div>
        <div style="width:28px;height:28px;border-radius:50%;background:#C8922A;cursor:pointer;border:2px solid transparent" title="Gold" onclick="this.style.border='2px solid var(--g)'"></div>
        <div style="width:28px;height:28px;border-radius:50%;background:#2D6A4F;cursor:pointer;border:2px solid transparent" title="Green" onclick="this.style.border='2px solid var(--g)'"></div>
      </div>
      <div class="pm-qty">
        <span class="pm-label" style="margin-bottom:0">Quantity:</span>
        <div class="qty-ctrl">
          <button class="qty-btn" onclick="let n=this.nextSibling;n.textContent=Math.max(1,parseInt(n.textContent)-1)">−</button>
          <span class="qty-num">1</span>
          <button class="qty-btn" onclick="let n=this.previousSibling;n.textContent=parseInt(n.textContent)+1">+</button>
        </div>
      </div>
      <div class="pm-actions">
        <button class="pm-atc" onclick="addToCart(${p.id});closeQuick()">🛒 Add to Cart</button>
        <button class="pm-wish${wishlist.includes(p.id) ? ' active' : ''}" onclick="toggleWish(${p.id},this)" style="${wishlist.includes(p.id) ? 'background:var(--m);color:#fff' : ''}">${wishlist.includes(p.id) ? '♥' : '♡'}</button>
      </div>

      <!-- ═══ PINCODE DELIVERY CHECKER ═══ -->
      <div class="pincode-widget">
        <div class="pincode-label">
          <span>📍</span> Check Delivery to Your Pincode
        </div>
        <div class="pincode-form">
          <input
            class="pincode-input"
            id="pincodeInput_${p.id}"
            type="text"
            maxlength="6"
            placeholder="Enter 6-digit pincode"
            oninput="this.value=this.value.replace(/[^0-9]/g,'')"
            onkeydown="if(event.key==='Enter') checkPincode('${p.id}')"
          >
          <button class="pincode-btn" id="pincodeBtn_${p.id}" onclick="checkPincode('${p.id}')">
            <span>Check</span>
          </button>
        </div>
        <div class="pincode-result" id="pincodeResult_${p.id}"></div>
      </div>

    </div>`;
            document.getElementById('quickModal').classList.add('open');
        }
        function closeQuick(e) {
            if (!e || e.target === document.getElementById('quickModal')) document.getElementById('quickModal').classList.remove('open');
        }

        /* ═══════════════════════════════════════════════
           CHECKOUT
        ═══════════════════════════════════════════════ */
        function loadCheckoutSummary() {
            const sub = cart.reduce((s, x) => s + x.price * x.qty, 0);
            const ship = sub >= 999 ? 0 : 50;
            const gst = Math.round(sub * .05);
            const disc = couponApplied ? Math.round(sub * .2) : 0;
            const total = sub + ship + gst - disc;
            document.getElementById('coSubtotal').textContent = fmt(sub);
            document.getElementById('coDiscount').textContent = '-' + fmt(disc);
            document.getElementById('coShipping').textContent = ship === 0 ? 'FREE ✓' : fmt(ship);
            document.getElementById('coGST').textContent = fmt(gst);
            document.getElementById('coTotal').textContent = fmt(total);
            document.getElementById('couponDisplay').textContent = couponApplied ? 'FESTIVE20 – 20% off applied ✓' : 'No coupon applied';
            document.getElementById('checkoutItems').innerHTML = cart.slice(0, 3).map(item => `
    <div style="display:flex;gap:.8rem;align-items:center;margin-bottom:.8rem">
      <img src="${item.img}" style="width:50px;height:62px;object-fit:cover;border-radius:6px">
      <div style="flex:1"><div style="font-size:.82rem;font-weight:500;color:var(--td)">${item.name}</div><div style="font-size:.75rem;color:var(--ts)">Qty: ${item.qty}</div></div>
      <div style="font-size:.88rem;font-weight:700;color:var(--m)">${fmt(item.price * item.qty)}</div>
    </div>`).join('') + (cart.length > 3 ? `<div style="font-size:.78rem;color:var(--ts);text-align:center">+${cart.length - 3} more items</div>` : '');
        }
        function selectPay(el) {
            document.querySelectorAll('.pay-method').forEach(p => p.classList.remove('active'));
            el.classList.add('active');
            // Show QR box only for UPI payment
            const upiBox = document.getElementById('upiPayBox');
            if (upiBox) {
                upiBox.style.display = el.dataset.type === 'upi' ? 'block' : 'none';
            }
        }
        async function placeOrder() {
            // Get selected payment method
            const payEl = document.querySelector('.pay-method.active');
            const paymentMethod = payEl ? payEl.querySelector('.pay-method-name').textContent.trim() : 'Cash on Delivery';
            const payType = payEl ? payEl.dataset.type : 'cod';

            // If UPI selected, validate UTR
            if (payType === 'upi') {
                const utr = document.getElementById('utrInput')?.value.trim();
                if (!utr) {
                    showNotif('⚠️', 'Please enter the UTR / Transaction ID after paying via UPI');
                    return;
                }
            }

            // Get logged in user if any
            const user = JSON.parse(localStorage.getItem('mt_user') || 'null');

            // Calculate total
            const subtotal = cart.reduce((s, x) => s + x.price * x.qty, 0);
            const total = subtotal - discount;

            // Collect address from checkout form
            const firstName = document.getElementById('checkoutFirstName')?.value.trim() || '';
            const lastName  = document.getElementById('checkoutLastName')?.value.trim() || '';
            const phone     = document.getElementById('checkoutPhone')?.value.trim() || '';
            const address   = document.getElementById('checkoutAddress')?.value.trim() || '';
            const city      = document.getElementById('checkoutCity')?.value.trim() || '';
            const pin       = document.getElementById('checkoutPin')?.value.trim() || '';
            const fullAddress = `${firstName} ${lastName}, ${address}, ${city} - ${pin}, Phone: ${phone}`;

            // Get UTR if UPI payment
            const utr = document.getElementById('utrInput')?.value.trim() || '';

            try {
                const res = await fetch(`${API}/orders`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        userId: user ? user.id : 'guest',
                        items: cart,
                        total: total,
                        paymentMethod: paymentMethod + (utr ? ' | UTR: ' + utr : ''),
                        address: fullAddress
                    })
                });
                const data = await res.json();
                const num = data.orderNumber || ('MT' + Math.floor(10000 + Math.random() * 89999));
                document.getElementById('orderNum').textContent = num;
            } catch (err) {
                const num = 'MT' + Math.floor(10000 + Math.random() * 89999);
                document.getElementById('orderNum').textContent = num;
            }

            cart = []; saveCart(); updateCartUI(); couponApplied = false; discount = 0;
            showPage('success');
            showNotif('🎉', 'Order placed successfully! Thank you!');
        }


        /* ═══════════════════════════════════════════════
           SEARCH
        ═══════════════════════════════════════════════ */
        function openSearch() { document.getElementById('searchOverlay').classList.add('open'); setTimeout(() => document.getElementById('searchBig').focus(), 100); }
        function closeSearch(e) { if (!e || e.target === document.getElementById('searchOverlay')) { document.getElementById('searchOverlay').classList.remove('open'); document.getElementById('searchResults').innerHTML = ''; } }
        function handleSearch(q) {
            if (!q.trim()) { document.getElementById('searchResults').innerHTML = ''; return; }
            const results = PRODUCTS.filter(p => p.name.toLowerCase().includes(q.toLowerCase()) || p.cat.toLowerCase().includes(q.toLowerCase())).slice(0, 5);
            document.getElementById('searchResults').innerHTML = results.length
                ? results.map(p => `<div class="search-result-item" onclick="closeSearch();openQuick(${p.id})"><img class="search-result-img" src="${p.img}" alt="${p.name}"><div><div class="search-result-name">${p.name}</div><div class="search-result-price">${fmt(p.price)}</div></div></div>`).join('')
                : '<div style="padding:1rem;text-align:center;color:var(--ts);font-size:.85rem">No products found for "' + q + '"</div>';
        }

        /* ═══════════════════════════════════════════════
           AUTH
        ═══════════════════════════════════════════════ */
        function openAuth() { document.getElementById('authOverlay').classList.add('open'); }
        function closeAuth(e) { if (!e || e.target === document.getElementById('authOverlay')) document.getElementById('authOverlay').classList.remove('open'); }
        function switchAuthTab(tab, el) {
            document.querySelectorAll('.auth-tab').forEach(t => t.classList.remove('active'));
            el.classList.add('active');
            document.getElementById('loginForm').style.display = tab === 'login' ? 'block' : 'none';
            document.getElementById('registerForm').style.display = tab === 'register' ? 'block' : 'none';
        }
        async function handleLogin() {
            const email = document.getElementById('loginEmail').value.trim();
            const password = document.getElementById('loginPassword').value.trim();
            if (!email || !password) { showNotif('⚠️', 'Please enter email and password'); return; }
            try {
                const res = await fetch(`${API}/auth/login`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email, password })
                });
                const data = await res.json();
                if (data.token) {
                    localStorage.setItem('mt_token', data.token);
                    localStorage.setItem('mt_user', JSON.stringify(data.user));
                    closeAuth();
                    showNotif('✅', `Welcome back, ${data.user.name}!`);
                } else {
                    showNotif('❌', data.error || 'Login failed');
                }
            } catch (err) {
                showNotif('❌', 'Server error. Make sure backend is running.');
            }
        }

        async function handleRegister() {
            const firstName = document.getElementById('regFirstName').value.trim();
            const lastName = document.getElementById('regLastName').value.trim();
            const email = document.getElementById('regEmail').value.trim();
            const phone = document.getElementById('regPhone').value.trim();
            const password = document.getElementById('regPassword').value.trim();
            if (!firstName || !email || !password) { showNotif('⚠️', 'Please fill all required fields'); return; }
            try {
                const res = await fetch(`${API}/auth/register`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ name: firstName + ' ' + lastName, email, phone, password })
                });
                const data = await res.json();
                if (data.token) {
                    localStorage.setItem('mt_token', data.token);
                    localStorage.setItem('mt_user', JSON.stringify(data.user));
                    closeAuth();
                    showNotif('🎉', `Welcome, ${data.user.name}! Account created!`);
                } else {
                    showNotif('❌', data.error || 'Registration failed');
                }
            } catch (err) {
                showNotif('❌', 'Server error. Make sure backend is running.');
            }
        }


        /* ═══════════════════════════════════════════════
           MOBILE DRAWER
        ═══════════════════════════════════════════════ */
        function openDrawer() { document.getElementById('mobileDrawer').classList.add('open'); document.getElementById('mobileOverlay').classList.add('open'); }
        function closeDrawer() { document.getElementById('mobileDrawer').classList.remove('open'); document.getElementById('mobileOverlay').classList.remove('open'); }

        /* ═══════════════════════════════════════════════
           THEME TOGGLE
        ═══════════════════════════════════════════════ */
        function toggleTheme() {
            const h = document.documentElement;
            const isDark = h.getAttribute('data-theme') === 'dark';
            h.setAttribute('data-theme', isDark ? 'light' : 'dark');
            localStorage.setItem('mt_theme', isDark ? 'light' : 'dark');
        }

        /* ═══════════════════════════════════════════════
           NOTIFICATION
        ═══════════════════════════════════════════════ */
        function showNotif(icon, msg) {
            const n = document.getElementById('notif');
            document.getElementById('notifIcon').textContent = icon;
            document.getElementById('notifMsg').textContent = msg;
            n.classList.add('show');
            setTimeout(() => n.classList.remove('show'), 3000);
        }

        /* ═══════════════════════════════════════════════
           SCROLL REVEAL
        ═══════════════════════════════════════════════ */
        function initReveal() {
            const obs = new IntersectionObserver(entries => {
                entries.forEach((e, i) => { if (e.isIntersecting) { setTimeout(() => e.target.classList.add('vis'), i * 80); obs.unobserve(e.target); } });
            }, { threshold: .1 });
            document.querySelectorAll('.reveal').forEach(el => { el.classList.remove('vis'); obs.observe(el); });
        }

        /* ═══════════════════════════════════════════════
           TRACK ORDER
        ═══════════════════════════════════════════════ */
        function trackOrder() {
            const steps = [
                { label: 'Order Placed', desc: 'Your order was confirmed on 12 May 2025', done: true },
                { label: 'Processing', desc: 'Our team is preparing your order', done: true },
                { label: 'Shipped', desc: 'Your order left our warehouse on 13 May', done: true },
                { label: 'Out for Delivery', desc: 'Expected delivery: 15 May 2025', done: false },
                { label: 'Delivered', desc: '', done: false },
            ];
            document.getElementById('trackResult').style.display = 'block';
            document.getElementById('trackSteps').innerHTML = steps.map(s => `
    <div style="display:flex;gap:1rem;padding:.8rem 0;align-items:flex-start">
      <div style="width:24px;height:24px;border-radius:50%;background:${s.done ? 'var(--gold-g)' : 'var(--cdd)'};display:flex;align-items:center;justify-content:center;font-size:.7rem;flex-shrink:0;position:relative;z-index:1;color:${s.done ? 'var(--mdd)' : 'var(--ts)'};">${s.done ? '✓' : '○'}</div>
      <div><div style="font-size:.88rem;font-weight:600;color:${s.done ? 'var(--td)' : 'var(--ts)'}">${s.label}</div>${s.desc ? `<div style="font-size:.75rem;color:var(--ts);margin-top:.2rem">${s.desc}</div>` : ''}</div>
    </div>`).join('');
        }

        /* ═══════════════════════════════════════════════
           INIT
        ═══════════════════════════════════════════════ */
        (function init() {
            // Restore theme
            const savedTheme = localStorage.getItem('mt_theme');
            if (savedTheme) document.documentElement.setAttribute('data-theme', savedTheme);
            // Restore cart
            updateCartUI();
            // Update wishlist badge
            const wb = document.getElementById('wishBadge');
            if (wishlist.length) { wb.textContent = wishlist.length; wb.style.display = 'flex'; }
            // Init home page
            showPage('home');
            // Start slider
            startSlider();
            // Reveal on scroll for dynamic pages
            const obs = new IntersectionObserver(entries => {
                entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('vis'); });
            }, { threshold: .08 });
            document.querySelectorAll('.reveal').forEach(el => obs.observe(el));
        })();

        // Keyboard close
        document.addEventListener('keydown', e => {
            if (e.key === 'Escape') { closeCart(); closeAuth(); closeSearch(); document.getElementById('quickModal').classList.remove('open'); closeDrawer(); }
        });

        /* ═══════════════════════════════════════════════
           PINCODE DELIVERY CHECKER ENGINE
        ═══════════════════════════════════════════════ */

        // Pincode data: covers Tamil Nadu, Kerala, Karnataka, Andhra, major metros
        // Each entry: [prefix, zone, city, expressAvailable, estimatedDays, freeShipping threshold met]
        const PINCODE_DATA = [
            // Tamil Nadu — home zone
            { prefix: '625', zone: 'TN', city: 'Madurai', express: true, days: 0, sameDay: true },
            { prefix: '624', zone: 'TN', city: 'Dindigul', express: true, days: 1 },
            { prefix: '626', zone: 'TN', city: 'Virudhunagar', express: true, days: 1 },
            { prefix: '627', zone: 'TN', city: 'Tirunelveli', express: true, days: 1 },
            { prefix: '628', zone: 'TN', city: 'Tuticorin', express: true, days: 2 },
            { prefix: '629', zone: 'TN', city: 'Kanyakumari', express: false, days: 2 },
            { prefix: '620', zone: 'TN', city: 'Trichy', express: true, days: 1 },
            { prefix: '621', zone: 'TN', city: 'Thanjavur', express: true, days: 1 },
            { prefix: '622', zone: 'TN', city: 'Pudukkottai', express: false, days: 2 },
            { prefix: '623', zone: 'TN', city: 'Ramanathapuram', express: false, days: 2 },
            { prefix: '600', zone: 'TN', city: 'Chennai', express: true, days: 1 },
            { prefix: '601', zone: 'TN', city: 'Chennai (South)', express: true, days: 1 },
            { prefix: '602', zone: 'TN', city: 'Chennai (North)', express: true, days: 1 },
            { prefix: '603', zone: 'TN', city: 'Kanchipuram', express: true, days: 1 },
            { prefix: '604', zone: 'TN', city: 'Villupuram', express: false, days: 2 },
            { prefix: '605', zone: 'TN', city: 'Pondicherry', express: true, days: 1 },
            { prefix: '606', zone: 'TN', city: 'Vellore', express: false, days: 2 },
            { prefix: '607', zone: 'TN', city: 'Cuddalore', express: false, days: 2 },
            { prefix: '608', zone: 'TN', city: 'Chidambaram', express: false, days: 2 },
            { prefix: '609', zone: 'TN', city: 'Nagapattinam', express: false, days: 2 },
            { prefix: '611', zone: 'TN', city: 'Thanjavur East', express: false, days: 2 },
            { prefix: '612', zone: 'TN', city: 'Kumbakonam', express: false, days: 2 },
            { prefix: '613', zone: 'TN', city: 'Kumbakonam', express: false, days: 2 },
            { prefix: '614', zone: 'TN', city: 'Mayiladuthurai', express: false, days: 2 },
            { prefix: '638', zone: 'TN', city: 'Erode', express: true, days: 1 },
            { prefix: '639', zone: 'TN', city: 'Karur', express: false, days: 2 },
            { prefix: '641', zone: 'TN', city: 'Coimbatore', express: true, days: 1 },
            { prefix: '642', zone: 'TN', city: 'Coimbatore', express: true, days: 1 },
            { prefix: '643', zone: 'TN', city: 'Ooty', express: false, days: 2 },
            { prefix: '636', zone: 'TN', city: 'Salem', express: true, days: 1 },
            { prefix: '637', zone: 'TN', city: 'Namakkal', express: false, days: 2 },
            { prefix: '630', zone: 'TN', city: 'Sivagangai', express: false, days: 2 },
            { prefix: '631', zone: 'TN', city: 'Kanchipuram', express: false, days: 2 },
            { prefix: '632', zone: 'TN', city: 'Vellore', express: false, days: 2 },
            { prefix: '635', zone: 'TN', city: 'Dharmapuri', express: false, days: 3 },
            // Kerala
            { prefix: '695', zone: 'KL', city: 'Trivandrum', express: true, days: 2 },
            { prefix: '682', zone: 'KL', city: 'Kochi', express: true, days: 2 },
            { prefix: '680', zone: 'KL', city: 'Thrissur', express: false, days: 3 },
            { prefix: '673', zone: 'KL', city: 'Kozhikode', express: false, days: 3 },
            { prefix: '670', zone: 'KL', city: 'Kannur', express: false, days: 3 },
            { prefix: '676', zone: 'KL', city: 'Malappuram', express: false, days: 3 },
            // Karnataka
            { prefix: '560', zone: 'KA', city: 'Bengaluru', express: true, days: 2 },
            { prefix: '570', zone: 'KA', city: 'Mysuru', express: true, days: 2 },
            { prefix: '575', zone: 'KA', city: 'Mangaluru', express: false, days: 3 },
            { prefix: '580', zone: 'KA', city: 'Hubli', express: false, days: 3 },
            // Andhra / Telangana
            { prefix: '500', zone: 'TS', city: 'Hyderabad', express: true, days: 2 },
            { prefix: '520', zone: 'AP', city: 'Vijayawada', express: false, days: 3 },
            { prefix: '530', zone: 'AP', city: 'Visakhapatnam', express: false, days: 3 },
            // Major metros
            { prefix: '400', zone: 'MH', city: 'Mumbai', express: true, days: 3 },
            { prefix: '411', zone: 'MH', city: 'Pune', express: true, days: 3 },
            { prefix: '110', zone: 'DL', city: 'New Delhi', express: true, days: 3 },
            { prefix: '700', zone: 'WB', city: 'Kolkata', express: false, days: 4 },
            { prefix: '380', zone: 'GJ', city: 'Ahmedabad', express: false, days: 4 },
            { prefix: '302', zone: 'RJ', city: 'Jaipur', express: false, days: 4 },
            { prefix: '226', zone: 'UP', city: 'Lucknow', express: false, days: 5 },
            { prefix: '440', zone: 'MH', city: 'Nagpur', express: false, days: 4 },
            { prefix: '160', zone: 'PB', city: 'Chandigarh', express: false, days: 5 },
        ];

        const ZONE_NAMES = { TN: 'Tamil Nadu', KL: 'Kerala', KA: 'Karnataka', AP: 'Andhra Pradesh', TS: 'Telangana', MH: 'Maharashtra', DL: 'Delhi NCR', WB: 'West Bengal', GJ: 'Gujarat', RJ: 'Rajasthan', UP: 'Uttar Pradesh', PB: 'Punjab' };

        function resolvePincode(pin) {
            if (!pin || pin.length !== 6) return null;
            const prefix3 = pin.substring(0, 3);
            const prefix2 = pin.substring(0, 2);
            // Try 3-digit prefix first
            let match = PINCODE_DATA.find(d => d.prefix === prefix3);
            // Fallback: 2-digit
            if (!match) match = PINCODE_DATA.find(d => d.prefix === prefix2);
            return match || null;
        }

        function deliveryHTML(result, pin) {
            const today = new Date();
            const addDays = (d, n) => { const r = new Date(d); r.setDate(r.getDate() + n); return r; };
            const fmtDate = d => d.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' });
            const shipping = result.sameDay ? 'FREE (same-day)' : (result.days <= 2 ? 'FREE ✓' : '₹50');
            const deliveryDate = result.sameDay ? 'Today before 8 PM' : fmtDate(addDays(today, result.days));
            const expressDate = result.express && !result.sameDay ? fmtDate(addDays(today, Math.max(1, result.days - 1))) : null;

            return `
    <div class="pr-head">
      <span style="font-size:1.2rem">✅</span>
      <span>Delivery available to <strong>${pin}</strong> – ${result.city}, ${ZONE_NAMES[result.zone] || result.zone}</span>
    </div>
    <div class="pr-rows">
      <div class="pr-row">
        <span class="pr-row-label">📅 Standard Delivery</span>
        <span class="pr-row-val fast">${deliveryDate}</span>
      </div>
      ${result.express && !result.sameDay ? `
      <div class="pr-row">
        <span class="pr-row-label">⚡ Express Delivery</span>
        <span class="pr-row-val fast">${expressDate} <span style="font-size:.65rem;color:var(--g)">(+₹49)</span></span>
      </div>` : ''}
      ${result.sameDay ? `
      <div class="pr-row">
        <span class="pr-row-label">🚀 Same-Day Delivery</span>
        <span class="pr-row-val free">Today before 8 PM (order before 12 PM)</span>
      </div>` : ''}
      <div class="pr-divider"></div>
      <div class="pr-row">
        <span class="pr-row-label">🚚 Shipping Cost</span>
        <span class="pr-row-val ${shipping.startsWith('FREE') ? 'free' : ''}">${shipping}</span>
      </div>
      <div class="pr-row">
        <span class="pr-row-label">📦 COD Available</span>
        <span class="pr-row-val">${result.zone === 'TN' || result.zone === 'KL' || result.zone === 'KA' ? 'Yes ✓' : 'Yes (+ ₹30)'}</span>
      </div>
      <div class="pr-row">
        <span class="pr-row-label">🔄 Easy Returns</span>
        <span class="pr-row-val">7-day free return ✓</span>
      </div>
    </div>`;
        }

        /* Called from Quick View modal */
        function checkPincode(productId) {
            const input = document.getElementById(`pincodeInput_${productId}`);
            const btn = document.getElementById(`pincodeBtn_${productId}`);
            const result = document.getElementById(`pincodeResult_${productId}`);
            if (!input || !btn || !result) return;

            const pin = input.value.trim();
            if (pin.length !== 6) {
                result.className = 'pincode-result error';
                result.innerHTML = `<div class="pr-head"><span style="font-size:1.1rem">❌</span><span>Please enter a valid 6-digit pincode.</span></div>`;
                return;
            }

            // Show loading state
            btn.classList.add('loading');
            btn.innerHTML = `<span class="spin">⟳</span> Checking…`;
            result.className = 'pincode-result';

            setTimeout(() => {
                btn.classList.remove('loading');
                btn.innerHTML = '<span>Check</span>';

                const match = resolvePincode(pin);
                if (match) {
                    result.className = 'pincode-result success';
                    result.innerHTML = deliveryHTML(match, pin);
                } else {
                    result.className = 'pincode-result error';
                    result.innerHTML = `
        <div class="pr-head"><span style="font-size:1.1rem">❌</span><span>Sorry, we don't deliver to <strong>${pin}</strong> yet.</span></div>
        <div style="margin-top:.4rem;font-size:.76rem;color:var(--ts)">
          We currently ship across Tamil Nadu, Kerala, Karnataka, major metros, and selected cities. 
          Try a nearby major city pincode or contact us on 
          <a href="https://wa.me/919876543210" style="color:var(--g);font-weight:600">WhatsApp</a> for special arrangements.
        </div>`;
                }
            }, 900); // simulated async delay
        }

        /* Called from standalone section */
        function checkPincodeSection() {
            const input = document.getElementById('sectionPincodeInput');
            const btn = document.getElementById('sectionPincodeBtn');
            const result = document.getElementById('sectionPincodeResult');
            if (!input || !result) return;

            const pin = input.value.trim();
            if (pin.length !== 6) {
                result.className = 'pincode-result error';
                result.innerHTML = `<div class="pr-head"><span>❌</span><span>Enter a valid 6-digit pincode.</span></div>`;
                return;
            }

            btn.textContent = '⟳ Checking…';
            btn.style.opacity = '.7';
            btn.style.pointerEvents = 'none';

            setTimeout(() => {
                btn.textContent = '🔍 Check Now';
                btn.style.opacity = '';
                btn.style.pointerEvents = '';

                const match = resolvePincode(pin);
                if (match) {
                    result.className = 'pincode-result success';
                    result.innerHTML = deliveryHTML(match, pin);
                } else {
                    result.className = 'pincode-result error';
                    result.innerHTML = `
        <div class="pr-head"><span>❌</span><span>We don't deliver to <strong>${pin}</strong> yet.</span></div>
        <div style="margin-top:.4rem;font-size:.78rem;color:var(--ts)">
          Contact us on <a href="https://wa.me/919876543210" style="color:var(--g);font-weight:600">WhatsApp +91 98765 43210</a> 
          for special delivery arrangements to your area.
        </div>`;
                }
            }, 900);
        }

        /* Chip shortcut: fill and auto-check */
        function fillAndCheck(pin) {
            const input = document.getElementById('sectionPincodeInput');
            if (input) { input.value = pin; checkPincodeSection(); }
        }
        // Responsive contact grid
        function fixContactGrid() {
            const g = document.getElementById('contactGrid');
            if (g) g.style.gridTemplateColumns = window.innerWidth < 768 ? '1fr' : '1fr 1fr';
        }
        window.addEventListener('resize', fixContactGrid);
        fixContactGrid();
/* Auto-load products from MongoDB on page start */
loadProducts();