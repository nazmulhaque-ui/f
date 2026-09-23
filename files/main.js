/* ============================================================
   LUXORA FURNITURE — main.js
   Shared data + interactions used across all pages.
   ============================================================ */

/* ---------------------------------------------------------
   1. PRODUCT DATA
   --------------------------------------------------------- */
const LUXORA_PRODUCTS = [
  { id: 'p01', name: 'Aveline Curved Sofa', category: 'Living Room', room:'living-room', material: 'Boucle Fabric', wood: 'Oak', color: 'Cream', price: 2450, oldPrice: 2890, rating: 4.8, reviews: 132, img: 'https://picsum.photos/seed/luxsofa1/700/700', tag: 'sale', badge:'-15%', desc: 'A gently curved silhouette upholstered in soft boucle, resting on solid oak legs — designed to anchor a room without overwhelming it.' },
  { id: 'p02', name: 'Marlow Dining Table', category: 'Dining', room:'dining', material: 'Solid Walnut', wood: 'Walnut', color: 'Walnut', price: 1890, rating: 4.9, reviews: 88, img: 'https://picsum.photos/seed/luxtable2/700/700', tag: 'new', badge:'New', desc: 'Hand-finished solid walnut top with a gently waterfall edge, seating up to eight in quiet confidence.' },
  { id: 'p03', name: 'Hendrik Wood Chair', category: 'Dining', room:'dining', material: 'Ash Wood', wood: 'Ash', color: 'Natural', price: 320, rating: 4.6, reviews: 214, img: 'https://picsum.photos/seed/luxchair3/700/700', desc: 'Steam-bent ash frame with a woven cane back — light enough to move, sturdy enough to last generations.' },
  { id: 'p04', name: 'Solene Coffee Table', category: 'Living Room', room:'living-room', material: 'Marble & Brass', wood: '—', color: 'White', price: 780, rating: 4.7, reviews: 96, img: 'https://picsum.photos/seed/luxcoffee4/700/700', desc: 'A honed marble top floats above a slender brass frame for a piece that feels sculptural at rest.' },
  { id: 'p05', name: 'Nordholm Bookshelf', category: 'Office', room:'office', material: 'Oak Veneer', wood: 'Oak', color: 'Oak', price: 640, oldPrice: 760, rating: 4.5, reviews: 61, img: 'https://picsum.photos/seed/luxshelf5/700/700', tag: 'sale', badge:'-16%', desc: 'Open oak shelving with asymmetric proportions, built to hold books, objects, and the odd plant.' },
  { id: 'p06', name: 'Camden TV Console', category: 'Living Room', room:'living-room', material: 'Walnut Veneer', wood: 'Walnut', color: 'Walnut', price: 980, rating: 4.6, reviews: 74, img: 'https://picsum.photos/seed/luxtv6/700/700', desc: 'Cable-managed media console with soft-close drawers and a floating profile that lightens any wall.' },
  { id: 'p07', name: 'Isla Platform Bed', category: 'Bedroom', room:'bedroom', material: 'Solid Oak', wood: 'Oak', color: 'Natural', price: 1650, rating: 4.9, reviews: 142, img: 'https://picsum.photos/seed/luxbed7/700/700', tag:'new', badge:'New', desc: 'Low-profile solid oak platform bed with an integrated headboard — no box spring required.' },
  { id: 'p08', name: 'Bramwell Wardrobe', category: 'Bedroom', room:'bedroom', material: 'Oak & Linen', wood: 'Oak', color: 'Oak', price: 2180, rating: 4.7, reviews: 53, img: 'https://picsum.photos/seed/luxward8/700/700', desc: 'Generous three-door wardrobe with linen-lined drawers and a soft push-to-open mechanism.' },
  { id: 'p09', name: 'Delano Lounge Chair', category: 'Living Room', room:'living-room', material: 'Leather', wood: 'Walnut', color: 'Cognac', price: 1120, rating: 4.8, reviews: 118, img: 'https://picsum.photos/seed/luxlounge9/700/700', desc: 'Full-grain leather seat on a sculpted walnut frame — built for the corner that deserves a good read.' },
  { id: 'p10', name: 'Torino Pendant Light', category: 'Lighting', room:'lighting', material: 'Brass & Glass', wood: '—', color: 'Brass', price: 340, rating: 4.6, reviews: 40, img: 'https://picsum.photos/seed/luxlamp10/700/700', desc: 'Hand-blown amber glass suspended in a brushed brass ring — warm light with a jewelry-like presence.' },
  { id: 'p11', name: 'Ferro Outdoor Set', category: 'Outdoor', room:'outdoor', material: 'Teak & Rope', wood: 'Teak', color: 'Natural', price: 1980, rating: 4.7, reviews: 29, img: 'https://picsum.photos/seed/luxoutdoor11/700/700', desc: 'Weather-rated teak seating with hand-woven rope detailing, built for long afternoons outside.' },
  { id: 'p12', name: 'Alden Storage Bench', category: 'Storage', room:'storage', material: 'Oak & Cane', wood: 'Oak', color: 'Natural', price: 460, rating: 4.5, reviews: 33, img: 'https://picsum.photos/seed/luxbench12/700/700', desc: 'A cane-fronted entryway bench that hides everyday clutter behind a considered facade.' },
];

/* ---------------------------------------------------------
   2. STATE (Cart / Wishlist) — persisted to localStorage
   --------------------------------------------------------- */
const Store = {
  key: { cart: 'luxora_cart', wish: 'luxora_wishlist', theme: 'luxora_theme' },

  read(key){
    try{ return JSON.parse(localStorage.getItem(key)) || []; }
    catch(e){ return []; }
  },
  write(key, val){
    try{ localStorage.setItem(key, JSON.stringify(val)); }catch(e){ /* storage unavailable */ }
  },

  getCart(){ return this.read(this.key.cart); },
  getWishlist(){ return this.read(this.key.wish); },

  addToCart(id, qty = 1){
    const cart = this.getCart();
    const line = cart.find(i => i.id === id);
    if(line){ line.qty += qty; } else { cart.push({ id, qty }); }
    this.write(this.key.cart, cart);
    updateCounters();
    return cart;
  },
  removeFromCart(id){
    const cart = this.getCart().filter(i => i.id !== id);
    this.write(this.key.cart, cart);
    updateCounters();
    return cart;
  },
  setQty(id, qty){
    const cart = this.getCart();
    const line = cart.find(i => i.id === id);
    if(line){ line.qty = Math.max(1, qty); }
    this.write(this.key.cart, cart);
    updateCounters();
    return cart;
  },
  cartCount(){ return this.getCart().reduce((n,i) => n + i.qty, 0); },
  cartTotal(){
    return this.getCart().reduce((sum,i) => {
      const p = LUXORA_PRODUCTS.find(x => x.id === i.id);
      return p ? sum + p.price * i.qty : sum;
    }, 0);
  },

  toggleWishlist(id){
    let wish = this.getWishlist();
    if(wish.includes(id)){ wish = wish.filter(w => w !== id); }
    else{ wish.push(id); }
    this.write(this.key.wish, wish);
    updateCounters();
    return wish;
  },
  isWished(id){ return this.getWishlist().includes(id); }
};

function updateCounters(){
  document.querySelectorAll('[data-cart-count]').forEach(el => el.textContent = Store.cartCount());
  document.querySelectorAll('[data-wish-count]').forEach(el => el.textContent = Store.getWishlist().length);
}

/* ---------------------------------------------------------
   3. TOASTS
   --------------------------------------------------------- */
function toast(message){
  let stack = document.querySelector('.toast-stack');
  if(!stack){
    stack = document.createElement('div');
    stack.className = 'toast-stack';
    document.body.appendChild(stack);
  }
  const el = document.createElement('div');
  el.className = 'toast';
  el.innerHTML = `<span class="toast-dot"></span><span>${message}</span>`;
  stack.appendChild(el);
  requestAnimationFrame(() => el.classList.add('show'));
  setTimeout(() => {
    el.classList.remove('show');
    setTimeout(() => el.remove(), 400);
  }, 2600);
}

/* ---------------------------------------------------------
   4. STAR RATING → markup helper
   --------------------------------------------------------- */
function starString(rating){
  const full = Math.round(rating);
  return '★★★★★☆☆☆☆☆'.slice(5 - full, 10 - full);
}
function money(n){ return '$' + n.toLocaleString('en-US'); }

/* ---------------------------------------------------------
   5. PRODUCT CARD RENDERING
   --------------------------------------------------------- */
function productCardHTML(p){
  const wished = Store.isWished(p.id);
  return `
  <article class="prod-card reveal" data-id="${p.id}">
    <div class="prod-media">
      <a href="product.html?id=${p.id}" aria-label="${p.name}">
        <img src="${p.img}" alt="${p.name}" loading="lazy">
      </a>
      ${p.badge ? `<div class="prod-tags"><span class="tag ${p.tag === 'sale' ? 'tag-sale' : p.tag === 'new' ? 'tag-new' : ''}">${p.badge}</span></div>` : ''}
      <button class="prod-fav ${wished ? 'active':''}" data-wish="${p.id}" aria-label="Add to wishlist">
        <svg viewBox="0 0 24 24" fill="${wished ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="1.6"><path d="M12 21s-7.5-4.9-10-9.4C.4 7.9 2.5 4 6.4 4c2.1 0 3.7 1.1 5.6 3.3C13.9 5.1 15.5 4 17.6 4c3.9 0 6 3.9 4.4 7.6C19.5 16.1 12 21 12 21z"/></svg>
      </button>
      <div class="prod-quick"><button data-quickview="${p.id}">Quick View</button></div>
    </div>
    <div class="prod-body">
      <span class="prod-cat">${p.category}</span>
      <a href="product.html?id=${p.id}"><h3 class="prod-name">${p.name}</h3></a>
      <div class="prod-rating"><span class="stars">${starString(p.rating)}</span><span>${p.rating} (${p.reviews})</span></div>
      <div class="prod-price-row">
        <span class="prod-price">${money(p.price)}${p.oldPrice ? `<span class="old">${money(p.oldPrice)}</span>` : ''}</span>
        <button class="prod-add" data-add="${p.id}" aria-label="Add ${p.name} to cart">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M6 6h15l-1.5 9h-12z"/><path d="M6 6 4 2H1"/><circle cx="9" cy="20" r="1"/><circle cx="18" cy="20" r="1"/></svg>
        </button>
      </div>
    </div>
  </article>`;
}

function renderProductGrid(targetSelector, products){
  const el = document.querySelector(targetSelector);
  if(!el) return;
  el.innerHTML = products.map(productCardHTML).join('');
  observeReveals();
}

/* ---------------------------------------------------------
   6. QUICK VIEW MODAL
   --------------------------------------------------------- */
function buildQuickViewModal(){
  if(document.querySelector('.modal-overlay')) return;
  const overlay = document.createElement('div');
  overlay.className = 'modal-overlay';
  overlay.innerHTML = `
    <div class="modal-box">
      <button class="modal-close" aria-label="Close">&times;</button>
      <div class="modal-img"><img src="" alt=""></div>
      <div class="modal-info">
        <span class="prod-cat"></span>
        <h3></h3>
        <div class="prod-rating"><span class="stars"></span><span class="rv"></span></div>
        <div class="prod-price"></div>
        <p class="desc"></p>
        <div class="qty-row">
          <div class="qty-control">
            <button data-qv-dec>&minus;</button><span data-qv-qty>1</span><button data-qv-inc>+</button>
          </div>
        </div>
        <div class="modal-actions">
          <button class="btn btn-primary btn-block" data-qv-add>Add to Cart</button>
          <button class="btn-icon" data-qv-wish aria-label="Wishlist"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M12 21s-7.5-4.9-10-9.4C.4 7.9 2.5 4 6.4 4c2.1 0 3.7 1.1 5.6 3.3C13.9 5.1 15.5 4 17.6 4c3.9 0 6 3.9 4.4 7.6C19.5 16.1 12 21 12 21z"/></svg></button>
        </div>
      </div>
    </div>`;
  document.body.appendChild(overlay);

  let currentId = null, qty = 1;

  function openModal(id){
    const p = LUXORA_PRODUCTS.find(x => x.id === id);
    if(!p) return;
    currentId = id; qty = 1;
    overlay.querySelector('.modal-img img').src = p.img;
    overlay.querySelector('.modal-img img').alt = p.name;
    overlay.querySelector('.prod-cat').textContent = p.category;
    overlay.querySelector('h3').textContent = p.name;
    overlay.querySelector('.stars').textContent = starString(p.rating);
    overlay.querySelector('.rv').textContent = `${p.rating} (${p.reviews} reviews)`;
    overlay.querySelector('.prod-price').innerHTML = money(p.price) + (p.oldPrice ? `<span class="old">${money(p.oldPrice)}</span>` : '');
    overlay.querySelector('.desc').textContent = p.desc;
    overlay.querySelector('[data-qv-qty]').textContent = qty;
    overlay.classList.add('active');
    document.body.style.overflow = 'hidden';
  }
  function closeModal(){
    overlay.classList.remove('active');
    document.body.style.overflow = '';
  }

  overlay.querySelector('.modal-close').addEventListener('click', closeModal);
  overlay.addEventListener('click', e => { if(e.target === overlay) closeModal(); });
  overlay.querySelector('[data-qv-inc]').addEventListener('click', () => {
    qty++; overlay.querySelector('[data-qv-qty]').textContent = qty;
  });
  overlay.querySelector('[data-qv-dec]').addEventListener('click', () => {
    qty = Math.max(1, qty - 1); overlay.querySelector('[data-qv-qty]').textContent = qty;
  });
  overlay.querySelector('[data-qv-add]').addEventListener('click', () => {
    if(!currentId) return;
    Store.addToCart(currentId, qty);
    toast('Added to cart');
    closeModal();
  });
  overlay.querySelector('[data-qv-wish]').addEventListener('click', () => {
    if(!currentId) return;
    Store.toggleWishlist(currentId);
    toast(Store.isWished(currentId) ? 'Added to wishlist' : 'Removed from wishlist');
    refreshWishIcons();
  });

  document.addEventListener('click', e => {
    const trigger = e.target.closest('[data-quickview]');
    if(trigger){ openModal(trigger.dataset.quickview); }
  });
  document.addEventListener('keydown', e => { if(e.key === 'Escape') closeModal(); });
}

function refreshWishIcons(){
  document.querySelectorAll('[data-wish]').forEach(btn => {
    const id = btn.dataset.wish;
    const wished = Store.isWished(id);
    btn.classList.toggle('active', wished);
    const svg = btn.querySelector('svg');
    if(svg) svg.setAttribute('fill', wished ? 'currentColor' : 'none');
  });
}

/* ---------------------------------------------------------
   7. DELEGATED EVENTS: add to cart / wishlist anywhere
   --------------------------------------------------------- */
function bindGlobalProductEvents(){
  document.addEventListener('click', e => {
    const addBtn = e.target.closest('[data-add]');
    if(addBtn){
      Store.addToCart(addBtn.dataset.add, 1);
      toast('Added to cart');
    }
    const wishBtn = e.target.closest('[data-wish]');
    if(wishBtn){
      Store.toggleWishlist(wishBtn.dataset.wish);
      toast(Store.isWished(wishBtn.dataset.wish) ? 'Added to wishlist' : 'Removed from wishlist');
      refreshWishIcons();
    }
  });
}

/* ---------------------------------------------------------
   8. HEADER: sticky hide, mobile nav, search, dark mode
   --------------------------------------------------------- */
function initHeader(){
  const header = document.querySelector('.site-header');
  let lastY = window.scrollY;
  window.addEventListener('scroll', () => {
    const y = window.scrollY;
    if(header){
      if(y > lastY && y > 160){ header.classList.add('header-hide'); }
      else{ header.classList.remove('header-hide'); }
    }
    lastY = y;
    toggleBackToTop();
  }, { passive: true });

  const burger = document.querySelector('.burger');
  const nav = document.querySelector('.main-nav');
  if(burger && nav){
    burger.addEventListener('click', () => nav.classList.toggle('open'));
  }
  // mobile submenu toggle
  document.querySelectorAll('.main-nav > ul > li').forEach(li => {
    const link = li.querySelector('a');
    if(li.querySelector('.mega-menu') && link){
      link.addEventListener('click', e => {
        if(window.innerWidth <= 900){
          e.preventDefault();
          li.classList.toggle('open');
        }
      });
    }
  });

  // Search popup
  const searchTriggers = document.querySelectorAll('[data-search-open]');
  const searchOverlay = document.querySelector('.search-overlay');
  searchTriggers.forEach(t => t.addEventListener('click', () => {
    searchOverlay?.classList.add('active');
    searchOverlay?.querySelector('input')?.focus();
  }));
  document.querySelector('[data-search-close]')?.addEventListener('click', () => searchOverlay?.classList.remove('active'));
  searchOverlay?.addEventListener('click', e => { if(e.target === searchOverlay) searchOverlay.classList.remove('active'); });

  // Dark mode
  const themeToggle = document.querySelector('[data-theme-toggle]');
  const saved = localStorage.getItem(Store.key.theme);
  if(saved === 'dark'){ document.documentElement.setAttribute('data-theme', 'dark'); }
  themeToggle?.addEventListener('click', () => {
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    document.documentElement.setAttribute('data-theme', isDark ? 'light' : 'dark');
    localStorage.setItem(Store.key.theme, isDark ? 'light' : 'dark');
  });
}

function toggleBackToTop(){
  const btn = document.querySelector('.back-to-top');
  if(!btn) return;
  if(window.scrollY > 500) btn.classList.add('show'); else btn.classList.remove('show');
}

/* ---------------------------------------------------------
   9. SCROLL REVEAL
   --------------------------------------------------------- */
let revealObserver;
function observeReveals(){
  if(!('IntersectionObserver' in window)){
    document.querySelectorAll('.reveal').forEach(el => el.classList.add('in-view'));
    return;
  }
  if(!revealObserver){
    revealObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if(entry.isIntersecting){
          entry.target.classList.add('in-view');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.14 });
  }
  document.querySelectorAll('.reveal:not(.in-view)').forEach(el => revealObserver.observe(el));
}

/* ---------------------------------------------------------
   10. TESTIMONIAL SLIDER
   --------------------------------------------------------- */
function initTestimonials(){
  const slides = document.querySelectorAll('.testi-slide');
  const dots = document.querySelectorAll('.testi-dots button');
  if(!slides.length) return;
  let i = 0, timer;
  function show(n){
    slides.forEach((s, idx) => s.classList.toggle('active', idx === n));
    dots.forEach((d, idx) => d.classList.toggle('active', idx === n));
    i = n;
  }
  function next(){ show((i + 1) % slides.length); }
  dots.forEach((d, idx) => d.addEventListener('click', () => { show(idx); resetTimer(); }));
  function resetTimer(){ clearInterval(timer); timer = setInterval(next, 5200); }
  show(0); resetTimer();
}

/* ---------------------------------------------------------
   11. PAGE LOADER
   --------------------------------------------------------- */
function initLoader(){
  const loader = document.querySelector('.page-loader');
  if(!loader) return;
  window.addEventListener('load', () => {
    setTimeout(() => loader.classList.add('loaded'), 250);
  });
}

/* ---------------------------------------------------------
   12. INIT
   --------------------------------------------------------- */
document.addEventListener('DOMContentLoaded', () => {
  initLoader();
  initHeader();
  bindGlobalProductEvents();
  buildQuickViewModal();
  updateCounters();
  observeReveals();
  initTestimonials();

  document.querySelector('.back-to-top')?.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  // Newsletter forms (all pages)
  document.querySelectorAll('.newsletter-form, .footer-newsletter form').forEach(form => {
    form.addEventListener('submit', e => {
      e.preventDefault();
      toast('Thanks for subscribing!');
      form.reset();
    });
  });
});
