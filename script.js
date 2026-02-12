// ===== DoseRx — Cart & UI Logic =====

let cart = [];

function addToCart(name, price) {
    const existing = cart.find(item => item.name === name);
    if (existing) {
        existing.qty++;
    } else {
        cart.push({ name, price, qty: 1 });
    }
    updateCart();
    // Button feedback
    event.target.textContent = '✓ Added';
    event.target.classList.add('added');
    setTimeout(() => {
        event.target.textContent = 'Add to Cart';
        event.target.classList.remove('added');
    }, 1500);
    // Auto-open cart
    if (!document.getElementById('cartDrawer').classList.contains('open')) {
        toggleCart();
    }
}

function removeFromCart(index) {
    cart.splice(index, 1);
    updateCart();
}

function updateQty(index, delta) {
    cart[index].qty += delta;
    if (cart[index].qty <= 0) cart.splice(index, 1);
    updateCart();
}

function updateCart() {
    const countEl = document.getElementById('cartCount');
    const itemsEl = document.getElementById('cartItems');
    const footerEl = document.getElementById('cartFooter');
    const totalEl = document.getElementById('cartTotal');
    
    const totalItems = cart.reduce((sum, item) => sum + item.qty, 0);
    const totalPrice = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
    
    countEl.textContent = totalItems;
    countEl.classList.toggle('visible', totalItems > 0);
    
    if (cart.length === 0) {
        itemsEl.innerHTML = '<p class="cart-empty">Your cart is empty</p>';
        footerEl.style.display = 'none';
    } else {
        itemsEl.innerHTML = cart.map((item, i) => `
            <div class="cart-item">
                <div class="cart-item-info">
                    <h4>${item.name}</h4>
                    <p>$${item.price} each</p>
                </div>
                <div class="cart-item-actions">
                    <div class="cart-item-qty">
                        <button onclick="updateQty(${i}, -1)">−</button>
                        <span>${item.qty}</span>
                        <button onclick="updateQty(${i}, 1)">+</button>
                    </div>
                    <span class="cart-item-price">$${item.price * item.qty}</span>
                    <button class="cart-item-remove" onclick="removeFromCart(${i})">×</button>
                </div>
            </div>
        `).join('');
        footerEl.style.display = 'block';
        totalEl.textContent = '$' + totalPrice;
    }
}

function toggleCart() {
    document.getElementById('cartDrawer').classList.toggle('open');
    document.getElementById('cartOverlay').classList.toggle('open');
    document.body.style.overflow = document.getElementById('cartDrawer').classList.contains('open') ? 'hidden' : '';
}

function checkout() {
    alert('Checkout integration coming soon! Your cart has ' + cart.reduce((s, i) => s + i.qty, 0) + ' items totaling $' + cart.reduce((s, i) => s + i.price * i.qty, 0));
}

// FAQ Toggle
function toggleFaq(btn) {
    const item = btn.parentElement;
    const wasOpen = item.classList.contains('open');
    document.querySelectorAll('.faq-item').forEach(el => el.classList.remove('open'));
    if (!wasOpen) item.classList.add('open');
}

// Mobile Menu
function toggleMobileMenu() {
    document.getElementById('mobileMenu').classList.toggle('open');
}

// Navbar scroll effect
window.addEventListener('scroll', () => {
    document.getElementById('navbar').classList.toggle('scrolled', window.scrollY > 10);
});

// Scroll animations
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
        }
    });
}, { threshold: 0.1 });

document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.product-card').forEach(card => observer.observe(card));
    
    // Animate stats
    const statObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateStats();
                statObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });
    
    const proofSection = document.querySelector('.social-proof');
    if (proofSection) statObserver.observe(proofSection);
});

function animateStats() {
    document.querySelectorAll('.stat-number').forEach(el => {
        const target = parseInt(el.dataset.target);
        const duration = 2000;
        const start = performance.now();
        
        function update(now) {
            const elapsed = now - start;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            el.textContent = Math.floor(target * eased).toLocaleString();
            if (progress < 1) requestAnimationFrame(update);
        }
        requestAnimationFrame(update);
    });
}
