
const products = [
    {
        id: 1,
        name: "Body Amarillo Suave",
        category: "baby",
        size: "0-6m",
        price: 45.00,
        oldPrice: 59.00,
        image: "assets/images/product1.png",
        description: "Un body de algodón pima 100% orgánico, diseñado para la máxima suavidad en la piel de tu bebé. Con broches libres de níquel y un color amarillo mantequilla ideal para cualquier ocasión.",
        images: ["assets/images/product1.png", "assets/images/product2.png", "assets/images/product3.png"]
    },
    {
        id: 2,
        name: "Vestido Floral Verano",
        category: "girl",
        size: "3-5y",
        price: 89.00,
        image: "assets/images/product2.png",
        description: "Vestido ligero y fresco con estampado floral exclusivo. Corte holgado para permitir el juego libre y confección en lino de alta calidad.",
        images: ["assets/images/product2.png", "assets/images/product1.png", "assets/images/product3.png"]
    },
    {
        id: 3,
        name: "Camiseta Zorro Menta",
        category: "boy",
        size: "1-2y",
        price: 55.00,
        oldPrice: 69.00,
        image: "assets/images/product3.png",
        description: "Camiseta divertida con ilustración de zorro. Color menta suave que combina con todo. Tejido transpirable perfecto para días activos.",
        images: ["assets/images/product3.png", "assets/images/product1.png", "assets/images/product2.png"]
    },
    {
        id: 4,
        name: "Body Osito Crema",
        category: "baby",
        size: "6-12m",
        price: 49.00,
        image: "assets/images/product1.png",
        description: "La prenda esencial para el armario de tu bebé. Tono crema neutro con un adorable estampado de osito. Fácil de poner y quitar.",
        images: ["assets/images/product1.png", "assets/images/product2.png"]
    },
    {
        id: 5,
        name: "Vestido Jardín Encantado",
        category: "girl",
        size: "1-2y",
        price: 79.00,
        oldPrice: 99.00,
        image: "assets/images/product2.png",
        description: "Inspirado en los jardines secretos, este vestido trae la magia a la vida cotidiana. Detalles bordados a mano y tela resistente.",
        images: ["assets/images/product2.png", "assets/images/product3.png"]
    },
    {
        id: 6,
        name: "Camiseta Aventura Bosque",
        category: "boy",
        size: "3-5y",
        price: 59.00,
        image: "assets/images/product3.png",
        description: "Para los pequeños exploradores. Camiseta resistente con gráficos de bosque. Mantiene su forma lavado tras lavado.",
        images: ["assets/images/product3.png", "assets/images/product1.png"]
    },
    {
        id: 7,
        name: "Set Básico Recién Nacido",
        category: "baby",
        size: "0-6m",
        price: 75.00,
        oldPrice: 95.00,
        image: "assets/images/product1.png",
        description: "El regalo perfecto. Incluye body, pantaloncito y gorrito. Todo en algodón hipoalergénico para los primeros días.",
        images: ["assets/images/product1.png", "assets/images/product2.png", "assets/images/product3.png"]
    },
    {
        id: 8,
        name: "Camisa Lino Natural",
        category: "boy",
        size: "1-2y",
        price: 65.00,
        image: "assets/images/product3.png",
        description: "Elegancia relajada. Camisa de lino en tono natural, fresca y cómoda para eventos especiales o un paseo de domingo.",
        images: ["assets/images/product3.png", "assets/images/product2.png"]
    },
];


let cart = [];
let currentCategory = 'all';
let currentSize = 'all';
let currentProduct = null;


const WHATSAPP_NUMBER = "51983475884";


const productGrid = document.getElementById('product-grid');
const categorySelect = document.getElementById('category-filter');
const sizeButtons = document.querySelectorAll('.filter-chip');
const cartBtn = document.getElementById('cart-btn');
const closeCartBtn = document.getElementById('close-cart');
const cartSidebar = document.getElementById('cart-sidebar');
const cartOverlay = document.getElementById('cart-overlay');
const cartItemsContainer = document.getElementById('cart-items');
const cartTotalElement = document.getElementById('cart-total-price');
const cartCountElement = document.getElementById('cart-count');
const checkoutBtn = document.getElementById('checkout-btn');
const continueShoppingBtn = document.getElementById('continue-shopping-btn');
const modalOverlay = document.getElementById('product-modal-overlay');
const closeModalBtn = document.getElementById('close-modal-btn');
const modalMainImage = document.getElementById('modal-main-image');
const modalThumbnails = document.getElementById('modal-thumbnails');
const modalCategory = document.getElementById('modal-category');
const modalTitle = document.getElementById('modal-title');
const modalPriceContainer = document.getElementById('modal-price-container');
const modalDescription = document.getElementById('modal-description');
const modalAddToCart = document.getElementById('modal-add-to-cart');


document.addEventListener('DOMContentLoaded', () => {
    createSnowflakes();
    renderProducts(products);
    setupEventListeners();
});


function setupEventListeners() {
    
    categorySelect.addEventListener('change', (e) => {
        currentCategory = e.target.value;
        filterProducts();
    });

  
    sizeButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            
            sizeButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

           
            currentSize = btn.dataset.size;
            filterProducts();
        });
    });

    
    cartBtn.addEventListener('click', openCart);
    closeCartBtn.addEventListener('click', closeCart);
    cartOverlay.addEventListener('click', closeCart);

    
    checkoutBtn.addEventListener('click', checkout);
    continueShoppingBtn.addEventListener('click', closeCart);

    
    closeModalBtn.addEventListener('click', closeProductModal);
    modalOverlay.addEventListener('click', (e) => {
        if (e.target === modalOverlay) closeProductModal();
    });
    modalAddToCart.addEventListener('click', () => {
        if (currentProduct) {
            addToCart(currentProduct.id);
            closeProductModal();
            
        }
    });
}


function filterProducts() {
    const filtered = products.filter(product => {
        const matchCategory = currentCategory === 'all' || product.category === currentCategory;
        const matchSize = currentSize === 'all' || product.size === currentSize;
        return matchCategory && matchSize;
    });
    renderProducts(filtered);
}

function renderProducts(items) {
    productGrid.innerHTML = '';

    if (items.length === 0) {
        productGrid.innerHTML = '<p class="no-results">No encontramos productos con esos filtros.</p>';
        return;
    }

    items.forEach(product => {
        const hasDiscount = product.oldPrice && product.oldPrice > product.price;
        const discountBadge = hasDiscount ? `<div class="discount-badge">-${Math.round((1 - product.price / product.oldPrice) * 100)}%</div>` : '';
        const priceDisplay = hasDiscount
            ? `<div class="price-container">
                 <span class="old-price">S/. ${product.oldPrice.toFixed(2)}</span>
                 <span class="sale-price">S/. ${product.price.toFixed(2)}</span>
               </div>`
            : `<span class="product-price">S/. ${product.price.toFixed(2)}</span>`;

        const card = document.createElement('div');
        card.className = 'product-card';
        
        card.innerHTML = `
            ${discountBadge}
            <div class="product-image-container" onclick="openProductModal(${product.id})">
                <img src="${product.image}" alt="${product.name}" class="product-image">
            </div>
            <div class="product-info">
                <div class="product-category">${formatCategory(product.category)} • ${product.size}</div>
                <h3 class="product-title" onclick="openProductModal(${product.id})" style="cursor: pointer;">${product.name}</h3>
                <div class="product-actions">
                    ${priceDisplay}
                    <button class="add-to-cart-btn" onclick="addToCart(${product.id})">
                        <i class="fa-solid fa-cart-plus"></i> Agregar
                    </button>
                </div>
            </div>
        `;
        productGrid.appendChild(card);
    });
}

function formatCategory(cat) {
    const map = {
        'baby': 'Bebé',
        'boy': 'Niño',
        'girl': 'Niña'
    };
    return map[cat] || cat;
}


function openProductModal(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    currentProduct = product;

    
    modalMainImage.src = product.image;
    modalCategory.textContent = `${formatCategory(product.category)} • ${product.size}`;
    modalTitle.textContent = product.name;
    modalDescription.textContent = product.description || "Descripción del producto no disponible.";

    const hasDiscount = product.oldPrice && product.oldPrice > product.price;
    modalPriceContainer.innerHTML = hasDiscount
        ? `<span class="old-price">S/. ${product.oldPrice.toFixed(2)}</span>
           <span class="sale-price">S/. ${product.price.toFixed(2)}</span>`
        : `<span class="product-price" style="font-size: 1.5rem;">S/. ${product.price.toFixed(2)}</span>`;

    
    modalThumbnails.innerHTML = '';
    const images = product.images || [product.image];
    images.forEach((imgSrc, index) => {
        const thumb = document.createElement('img');
        thumb.src = imgSrc;
        thumb.className = `thumbnail ${index === 0 ? 'active' : ''}`;
        thumb.onclick = () => {
            modalMainImage.src = imgSrc;
            document.querySelectorAll('.thumbnail').forEach(t => t.classList.remove('active'));
            thumb.classList.add('active');
        };
        modalThumbnails.appendChild(thumb);
    });

   
    modalOverlay.classList.add('open');
    document.body.style.overflow = 'hidden'; 
}

function closeProductModal() {
    modalOverlay.classList.remove('open');
    document.body.style.overflow = ''; 
    currentProduct = null;
}


window.openProductModal = openProductModal; 

function createSnowflakes() {
    const snowContainer = document.createElement('div');
    snowContainer.id = 'snow-container';
    document.body.appendChild(snowContainer);

    const snowflakeCount = 30;

    for (let i = 0; i < snowflakeCount; i++) {
        const snowflake = document.createElement('div');
        snowflake.className = 'snowflake';
        snowflake.innerHTML = '❄';
        snowflake.style.left = Math.random() * 100 + 'vw';
        snowflake.style.animationDuration = (Math.random() * 5 + 3) + 's';
        snowflake.style.fontSize = (Math.random() * 15 + 10) + 'px';
        snowflake.style.opacity = Math.random() * 0.7;
        snowflake.style.animationDelay = Math.random() * 5 + 's';

        snowContainer.appendChild(snowflake);
    }
}


function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    const existingItem = cart.find(item => item.id === productId);

    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({ ...product, quantity: 1 });
    }

    updateCartUI();
    openCart();
}

function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    updateCartUI();
}

function changeQuantity(productId, change) {
    const item = cart.find(item => item.id === productId);
    if (item) {
        item.quantity += change;
        if (item.quantity <= 0) {
            removeFromCart(productId);
        } else {
            updateCartUI();
        }
    }
}

function updateCartUI() {
    renderCartItems();
    updateCartTotal();
    updateCartCount();
}

function renderCartItems() {
    cartItemsContainer.innerHTML = '';

    if (cart.length === 0) {
        cartItemsContainer.innerHTML = '<div class="empty-cart-msg">Tu carrito está vacío. ¡Llénalo de cosas lindas!</div>';
        return;
    }

    cart.forEach(item => {
        const cartItem = document.createElement('div');
        cartItem.className = 'cart-item';
        cartItem.innerHTML = `
            <img src="${item.image}" alt="${item.name}">
            <div class="cart-item-info">
                <div class="cart-item-title">${item.name}</div>
                <div class="cart-item-details">Talla: ${item.size}</div>
                <div class="cart-item-actions">
                    <span class="product-price">S/. ${(item.price * item.quantity).toFixed(2)}</span>
                    <div class="qty-control">
                        <button class="qty-btn" onclick="changeQuantity(${item.id}, -1)">-</button>
                        <span>${item.quantity}</span>
                        <button class="qty-btn" onclick="changeQuantity(${item.id}, 1)">+</button>
                    </div>
                </div>
            </div>
            <button class="remove-btn" onclick="removeFromCart(${item.id})"><i class="fa-solid fa-trash"></i></button>
        `;
        cartItemsContainer.appendChild(cartItem);
    });
}

function updateCartTotal() {
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    cartTotalElement.textContent = 'S/. ' + total.toFixed(2);
}

function updateCartCount() {
    const count = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCountElement.textContent = count;
}


function openCart() {
    cartSidebar.classList.add('open');
    cartOverlay.classList.add('open');
}

function closeCart() {
    cartSidebar.classList.remove('open');
    cartOverlay.classList.remove('open');
}

/* Checkout via WhatsApp */
function checkout() {
    if (cart.length === 0) {
        alert("Tu carrito está vacío. Agrega productos para realizar un pedido.");
        return;
    }

    let message = "Hola KakoiKids, quisiera realizar el siguiente pedido:\n\n";
    let total = 0;

    cart.forEach(item => {
        const subtotal = item.price * item.quantity;
        total += subtotal;
        message += `• *${item.quantity}x ${item.name}* (Talla: ${item.size}) - S/. ${subtotal.toFixed(2)}\n`;
    });

    message += `\n*Total: S/. ${total.toFixed(2)}*`;
    message += "\n\nQuedo a la espera de su confirmación. ¡Gracias!";

    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodedMessage}`;

    window.open(whatsappUrl, '_blank');
}


window.addToCart = addToCart;
window.removeFromCart = removeFromCart;
window.changeQuantity = changeQuantity;


