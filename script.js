
let cart = JSON.parse(localStorage.getItem('kakoikids_cart')) || [];
function saveCartToLocalStorage() {
    localStorage.setItem('kakoikids_cart', JSON.stringify(cart));
}

function addToCart(title, price, image) {
    const existingItem = cart.find(item => item.title === title);

    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({ title, price, image, quantity: 1 });
    }

    saveCartToLocalStorage();
    updateCartUI();
    showNotification(`¡<b>${title}</b> agregado al carrito!`);
}

function removeFromCart(title) {
    cart = cart.filter(item => item.title !== title);
    saveCartToLocalStorage();
    renderCartItems();
    updateCartBadge();
}

function updateQuantity(title, change) {
    const item = cart.find(item => item.title === title);
    if (item) {
        const newQuantity = item.quantity + change;
        if (newQuantity >= 1) {
            item.quantity = newQuantity;
            saveCartToLocalStorage();
            renderCartItems();
            updateCartBadge();
        }
    }
}

function updateCartUI() {
    updateCartBadge();
    renderCartItems();
}

function updateCartBadge() {
    const badge = document.getElementById('cart-badge');
    if (!badge) return;

    const count = cart.reduce((sum, item) => sum + item.quantity, 0);
    badge.innerText = count;

    if (count > 0) {
        badge.classList.remove('scale-0');
        badge.classList.add('scale-100');
    } else {
        badge.classList.remove('scale-100');
        badge.classList.add('scale-0');
    }

    badge.classList.add('scale-125');
    setTimeout(() => badge.classList.remove('scale-125'), 200);
}

function renderCartItems() {
    const container = document.getElementById('cart-items-container');
    const subtotalEl = document.getElementById('cart-subtotal');
    const totalEl = document.getElementById('cart-total');
    const waLink = document.getElementById('whatsapp-link');
    container.innerHTML = '';
    let total = 0;

    if (cart.length === 0) {
        container.innerHTML = `
                <div class="flex flex-col items-center justify-center h-full py-16 text-center">
                    <div class="bg-gray-100 dark:bg-gray-800 p-6 rounded-full mb-4">
                         <span class="material-icons text-4xl text-gray-400 dark:text-gray-500">shopping_basket</span>
                    </div>
                    <p class="text-xl font-bold text-gray-600 dark:text-gray-300 mb-2">Tu carrito está vacío</p>
                    <p class="text-sm text-gray-500 mb-6">Parece que aún no has encontrado el tesoro perfecto.</p>
                    <button onclick="showHome()" class="text-primary font-bold hover:underline">Ir a la tienda</button>
                </div>
            `;
        subtotalEl.innerText = 'S/. 0.00';
        totalEl.innerText = 'S/. 0.00';
        waLink.classList.add('opacity-50', 'pointer-events-none');
    } else {
        cart.forEach((item) => {
            const itemTotal = item.price * item.quantity;
            total += itemTotal;
            container.innerHTML += `
                    <div class="flex items-center gap-4 py-4 animate-fade-in">
                        <img src="${item.image}" 
                             alt="${item.title}"
                             onerror="this.onerror=null; this.src='data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22100%22 height=%22100%22 viewBox=%220 0 100 100%22%3E%3Crect fill=%22%23f3f4f6%22 width=%22100%22 height=%22100%22/%3E%3Ctext x=%2250%25%22 y=%2250%25%22 dominant-baseline=%22middle%22 text-anchor=%22middle%22 font-family=%22sans-serif%22 font-size=%2214%22 fill=%22%239ca3af%22%3E📦%3C/text%3E%3C/svg%3E';"
                             class="w-20 h-20 rounded-xl object-cover border border-gray-100 dark:border-gray-600">
                        <div class="flex-1 min-w-0">
                            <h4 class="font-bold text-gray-800 dark:text-white text-base md:text-lg truncate">${item.title}</h4>
                            <p class="text-sm text-gray-500 dark:text-gray-400">S/. ${item.price.toFixed(2)} c/u</p>
                            <p class="text-primary font-bold mt-1">S/. ${itemTotal.toFixed(2)}</p>
                        </div>
                        <div class="flex items-center gap-2">
                            <button onclick="updateQuantity('${item.title}', -1)" 
                                class="w-8 h-8 flex items-center justify-center bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-full transition-colors ${item.quantity <= 1 ? 'opacity-50 cursor-not-allowed' : ''}"
                                ${item.quantity <= 1 ? 'disabled' : ''}>
                                <span class="material-icons text-sm">remove</span>
                            </button>
                            <span class="w-8 text-center font-bold text-gray-800 dark:text-white">${item.quantity}</span>
                            <button onclick="updateQuantity('${item.title}', 1)" 
                                class="w-8 h-8 flex items-center justify-center bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-full transition-colors">
                                <span class="material-icons text-sm">add</span>
                            </button>
                        </div>
                        <button onclick="removeFromCart('${item.title}')" 
                            class="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-full transition-colors" 
                            title="Eliminar">
                            <span class="material-icons">delete_outline</span>
                        </button>
                    </div>
                `;
        });
        subtotalEl.innerText = 'S/. ' + total.toFixed(2);
        totalEl.innerText = 'S/. ' + total.toFixed(2);
        waLink.classList.remove('opacity-50', 'pointer-events-none');

        let message = "¡Hola KakoiKids! 👋✨\n\n";
        message += "Me gustaría realizar el siguiente pedido:\n";
        message += "━━━━━━━━━━━━━━━━━━━━\n\n";

        cart.forEach((item, index) => {
            message += `${index + 1}. *${item.title}*\n`;
            message += `   📦 Cantidad: ${item.quantity}\n`;
            message += `   💰 Precio unitario: S/. ${item.price.toFixed(2)}\n`;
            message += `   💵 Subtotal: S/. ${(item.price * item.quantity).toFixed(2)}\n\n`;
        });

        message += "━━━━━━━━━━━━━━━━━━━━\n";
        message += `🛒 *TOTAL: S/. ${total.toFixed(2)}*\n\n`;
        message += "📍 Por favor, indícame:\n";
        message += "• Dirección de entrega\n";
        message += "• Método de pago preferido\n";
        message += "• Alguna observación especial\n\n";
        message += "¡Gracias! 😊";

        waLink.href = `https://wa.me/51983475884?text=${encodeURIComponent(message)}`;
    }
}

function showHome() {
    document.getElementById('landing-view').classList.remove('hidden');
    document.getElementById('cart-view').classList.add('hidden');
    window.scrollTo(0, 0);
}

function toggleCartView() {
    const landing = document.getElementById('landing-view');
    const cartView = document.getElementById('cart-view');
    if (cartView.classList.contains('hidden')) {
        landing.classList.add('hidden');
        cartView.classList.remove('hidden');
        renderCartItems();
        window.scrollTo(0, 0);
    } else {
        showHome();
    }
}

function showNotification(message) {
    const container = document.getElementById('toast-container');
    const toast = document.createElement('div');
    toast.className = 'bg-gray-800 dark:bg-white text-white dark:text-gray-900 px-6 py-4 rounded-xl shadow-2xl flex items-center gap-3 transform translate-y-10 opacity-0 transition-all duration-500 pointer-events-auto min-w-[300px] border border-gray-700 dark:border-gray-200';
    toast.innerHTML = `
            <span class="material-icons text-primary text-xl">check_circle</span>
            <span class="text-sm font-medium">${message}</span>
        `;
    container.appendChild(toast);
    requestAnimationFrame(() => {
        toast.classList.remove('translate-y-10', 'opacity-0');
    });
    setTimeout(() => {
        toast.classList.add('translate-y-10', 'opacity-0');
        setTimeout(() => toast.remove(), 500);
    }, 3000);
}

let currentProduct = null;

function openProductModal(productData) {
    currentProduct = productData;
    const modal = document.getElementById('product-modal');

    document.getElementById('modal-category').innerText = productData.category;
    document.getElementById('modal-title').innerText = productData.title;
    document.getElementById('modal-description').innerText = productData.description;
    const mainImage = productData.images && productData.images.length > 0 ? productData.images[0] : productData.image;
    document.getElementById('modal-main-image').src = mainImage;
    document.getElementById('modal-main-image').alt = productData.title;

    const oldPriceEl = document.getElementById('modal-old-price');
    if (productData.oldPrice) {
        oldPriceEl.innerText = `S/. ${productData.oldPrice.toFixed(2)}`;
        oldPriceEl.classList.remove('hidden');
    } else {
        oldPriceEl.classList.add('hidden');
    }
    document.getElementById('modal-price').innerText = `S/. ${productData.price.toFixed(2)}`;

    const thumbnailsContainer = document.getElementById('modal-thumbnails');
    thumbnailsContainer.innerHTML = '';

    if (productData.images && productData.images.length > 0) {
        productData.images.forEach((img, index) => {
            const thumb = document.createElement('div');
            thumb.className = `w-20 h-20 rounded-lg overflow-hidden cursor-pointer border-2 transition-all ${index === 0 ? 'border-primary' : 'border-gray-200 dark:border-gray-600 hover:border-primary'}`;
            thumb.innerHTML = `<img src="${img}" alt="Vista ${index + 1}" class="w-full h-full object-contain bg-white dark:bg-gray-100">`;
            thumb.onclick = () => {
                document.getElementById('modal-main-image').src = img;
                thumbnailsContainer.querySelectorAll('div').forEach(t => {
                    t.className = t.className.replace('border-primary', 'border-gray-200 dark:border-gray-600');
                });
                thumb.className = thumb.className.replace('border-gray-200 dark:border-gray-600', 'border-primary');
            };
            thumbnailsContainer.appendChild(thumb);
        });
    }

    modal.classList.remove('hidden');
    modal.classList.add('flex');
    document.body.style.overflow = 'hidden';
}

function closeProductModal() {
    const modal = document.getElementById('product-modal');
    modal.classList.add('hidden');
    modal.classList.remove('flex');
    document.body.style.overflow = '';
    currentProduct = null;
}

function addToCartFromModal() {
    if (currentProduct) {

        const productImage = currentProduct.images && currentProduct.images.length > 0
            ? currentProduct.images[0]
            : currentProduct.image;

        addToCart(currentProduct.title, currentProduct.price, productImage);
        closeProductModal();
    }
}

document.getElementById('product-modal')?.addEventListener('click', (e) => {
    if (e.target.id === 'product-modal') {
        closeProductModal();
    }
});

document.addEventListener('DOMContentLoaded', () => {
    const sizeFilters = document.querySelectorAll('.size-filter');
    const productCards = document.querySelectorAll('[data-product-size]');

    sizeFilters.forEach(filter => {
        filter.addEventListener('click', () => {
            const selectedSize = filter.getAttribute('data-size');

            sizeFilters.forEach(btn => {
                btn.classList.remove('bg-primary', 'text-white');
                btn.classList.add('bg-gray-100', 'dark:bg-gray-800', 'text-gray-600', 'dark:text-gray-300');
            });
            filter.classList.remove('bg-gray-100', 'dark:bg-gray-800', 'text-gray-600', 'dark:text-gray-300');
            filter.classList.add('bg-primary', 'text-white');

            productCards.forEach(card => {
                const productSize = card.getAttribute('data-product-size');

                if (selectedSize === 'all') {
                    card.style.display = '';
                    card.classList.remove('hidden');
                } else if (productSize && productSize.includes(selectedSize)) {
                    card.style.display = '';
                    card.classList.remove('hidden');
                } else {
                    card.style.display = 'none';
                    card.classList.add('hidden');
                }
            });

            const visibleProducts = Array.from(productCards).filter(card => !card.classList.contains('hidden'));
            visibleProducts.forEach((card, index) => {
                card.style.animation = 'none';
                setTimeout(() => {
                    card.style.animation = `fadeIn 0.5s ease-in-out ${index * 0.1}s forwards`;
                }, 10);
            });
        });
    });
});

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        closeProductModal();
        closeCatalogModal();
    }
});

const catalogProducts = [
    {
        title: 'Pantalón Denim Suave',
        category: 'NIÑO • 3-5Y',
        description: 'Pantalón de mezclilla suave y flexible, perfecto para el uso diario. Cintura elástica ajustable para mayor comodidad.',
        price: 79.00,
        image: 'https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?w=400&h=400&fit=crop'
    },
    {
        title: 'Falda Tul Rosa',
        category: 'NIÑA • 2-4Y',
        description: 'Hermosa falda de tul en tono rosa pastel. Ideal para ocasiones especiales o para sentirse como una princesa todos los días.',
        price: 69.00,
        oldPrice: 89.00,
        image: 'https://images.unsplash.com/photo-1518831959646-742c3a14ebf7?w=400&h=400&fit=crop'
    },
    {
        title: 'Conjunto Deportivo',
        category: 'NIÑO • 4-6Y',
        description: 'Set deportivo de dos piezas: sudadera y pantalón. Tejido transpirable perfecto para jugar y hacer ejercicio.',
        price: 95.00,
        image: 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=400&h=400&fit=crop'
    },
    {
        title: 'Pijama Estrellitas',
        category: 'BEBÉ • 6-12M',
        description: 'Pijama de algodón orgánico con estampado de estrellitas. Suave y cómodo para un sueño reparador.',
        price: 55.00,
        image: 'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=400&h=400&fit=crop'
    },
    {
        title: 'Chaqueta Acolchada',
        category: 'NIÑA • 3-5Y',
        description: 'Chaqueta ligera acolchada, perfecta para días frescos. Resistente al agua y con capucha desmontable.',
        price: 120.00,
        oldPrice: 150.00,
        image: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=400&h=400&fit=crop'
    },
    {
        title: 'Shorts Playeros',
        category: 'NIÑO • 2-4Y',
        description: 'Shorts cómodos de secado rápido, ideales para la playa o piscina. Colores vibrantes y diseño divertido.',
        price: 45.00,
        image: 'https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?w=400&h=400&fit=crop'
    },
    {
        title: 'Vestido Lunares',
        category: 'NIÑA • 1-3Y',
        description: 'Vestido clásico con estampado de lunares. Tela suave y transpirable con lazo decorativo en la cintura.',
        price: 75.00,
        image: 'https://images.unsplash.com/photo-1596783074918-c84cb06531ca?w=400&h=400&fit=crop'
    },
    {
        title: 'Suéter Rayas',
        category: 'NIÑO • 3-5Y',
        description: 'Suéter de punto con rayas horizontales. Perfecto para días frescos, suave y abrigador.',
        price: 85.00,
        oldPrice: 100.00,
        image: 'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=400&h=400&fit=crop'
    },
    {
        title: 'Leggings Flores',
        category: 'NIÑA • 2-4Y',
        description: 'Leggings elásticos con estampado floral. Cómodos y versátiles para combinar con cualquier prenda.',
        price: 39.00,
        image: 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=400&h=400&fit=crop'
    },
    {
        title: 'Camisa Cuadros',
        category: 'NIÑO • 4-6Y',
        description: 'Camisa de algodón a cuadros, perfecta para ocasiones formales o casuales. Botones de madera naturales.',
        price: 65.00,
        image: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=400&h=400&fit=crop'
    },
    {
        title: 'Enterizo Conejito',
        category: 'BEBÉ • 0-6M',
        description: 'Adorable enterizo con diseño de conejito. Cierre frontal completo para facilitar el cambio de pañal.',
        price: 59.00,
        image: 'https://images.unsplash.com/photo-1522771930-78848d9293e8?w=400&h=400&fit=crop'
    },
    {
        title: 'Gorro Pompón',
        category: 'NIÑO/NIÑA • 1-5Y',
        description: 'Gorro tejido con pompón decorativo. Suave y abrigador, disponible en varios colores.',
        price: 29.00,
        oldPrice: 35.00,
        image: 'https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?w=400&h=400&fit=crop'
    }
];

let currentCategoryFilter = 'all';
let currentPriceFilter = 'all';

function renderCatalogProducts(products) {
    const container = document.getElementById('catalog-products');
    const noResults = document.getElementById('no-results');

    container.innerHTML = '';

    if (products.length === 0) {
        container.classList.add('hidden');
        noResults.classList.remove('hidden');
        return;
    }

    container.classList.remove('hidden');
    noResults.classList.add('hidden');

    products.forEach(product => {
        const productCard = `
                    <div class="bg-card-light dark:bg-card-dark rounded-xl overflow-hidden shadow-soft hover:shadow-xl transition-all duration-300 border border-gray-100 dark:border-gray-800 flex flex-col">
                        <div class="relative aspect-square overflow-hidden bg-gray-100 dark:bg-gray-800">
                            ${product.oldPrice ? `<span class="absolute top-2 left-2 bg-accent-red text-white text-xs font-bold px-2 py-1 rounded z-10">-${Math.round((1 - product.price / product.oldPrice) * 100)}%</span>` : ''}
                            <img src="${product.image}" alt="${product.title}" class="w-full h-full object-cover hover:scale-105 transition-transform duration-500">
                        </div>
                        <div class="p-4 flex flex-col flex-grow">
                            <p class="text-xs font-bold text-gray-400 dark:text-gray-500 mb-1 uppercase tracking-wide">${product.category}</p>
                            <h3 class="text-base font-bold text-gray-800 dark:text-white mb-2">${product.title}</h3>
                            <p class="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">${product.description}</p>
                            <div class="mt-auto flex items-center justify-between">
                                <div>
                                    ${product.oldPrice ? `<span class="text-xs text-gray-400 line-through mr-1">S/. ${product.oldPrice.toFixed(2)}</span>` : ''}
                                    <span class="text-lg font-bold ${product.oldPrice ? 'text-accent-red' : 'text-primary'}">S/. ${product.price.toFixed(2)}</span>
                                </div>
                                <button onclick="addToCart('${product.title}', ${product.price}, '${product.image}')" 
                                    class="bg-primary hover:bg-primary_dark text-white px-3 py-2 rounded-lg text-sm font-semibold flex items-center gap-1 transition-colors active:scale-95">
                                    <span class="material-icons text-sm">add_shopping_cart</span>
                                </button>
                            </div>
                        </div>
                    </div>
                `;
        container.innerHTML += productCard;
    });
}

function getFilteredProducts() {
    let filtered = catalogProducts;

    if (currentCategoryFilter !== 'all') {
        filtered = filtered.filter(product =>
            product.category.toLowerCase().includes(currentCategoryFilter.toLowerCase())
        );
    }

    if (currentPriceFilter !== 'all') {
        if (currentPriceFilter === '0-50') {
            filtered = filtered.filter(product => product.price <= 50);
        } else if (currentPriceFilter === '50-80') {
            filtered = filtered.filter(product => product.price > 50 && product.price <= 80);
        } else if (currentPriceFilter === '80-100') {
            filtered = filtered.filter(product => product.price > 80 && product.price <= 100);
        } else if (currentPriceFilter === '100+') {
            filtered = filtered.filter(product => product.price > 100);
        }
    }

    return filtered;
}

function filterCatalog(category) {
    currentCategoryFilter = category;

    ['all', 'niño', 'niña', 'bebé'].forEach(cat => {
        const btn = document.getElementById(`filter-${cat}`);
        if (cat === category) {
            btn.className = 'px-4 py-2 rounded-full bg-primary text-white text-sm font-medium shadow-sm transition-colors';
        } else {
            btn.className = 'px-4 py-2 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300 text-sm font-medium transition-colors';
        }
    });

    renderCatalogProducts(getFilteredProducts());
}

function filterByPrice(priceRange) {
    currentPriceFilter = priceRange;
    renderCatalogProducts(getFilteredProducts());
}

function openCatalogModal() {
    const modal = document.getElementById('catalog-modal');

    currentCategoryFilter = 'all';
    currentPriceFilter = 'all';
    document.getElementById('price-filter').value = 'all';
    filterCatalog('all');
    renderCatalogProducts(catalogProducts);

    modal.classList.remove('hidden');
    modal.classList.add('flex');
    document.body.style.overflow = 'hidden';
}

function closeCatalogModal() {
    const modal = document.getElementById('catalog-modal');
    modal.classList.add('hidden');
    modal.classList.remove('flex');
    document.body.style.overflow = '';
}

document.getElementById('catalog-modal')?.addEventListener('click', (e) => {
    if (e.target.id === 'catalog-modal') {
        closeCatalogModal();
    }
});

function toggleFAQ(id) {
    const answer = document.getElementById(`faq-answer-${id}`);
    const icon = document.getElementById(`faq-icon-${id}`);

    if (answer.classList.contains('hidden')) {
        answer.classList.remove('hidden');
        icon.style.transform = 'rotate(180deg)';
    } else {
        answer.classList.add('hidden');
        icon.style.transform = 'rotate(0deg)';
    }
}

function openTermsModal() {
    const modal = document.getElementById('terms-modal');
    modal.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
}

function closeTermsModal() {
    const modal = document.getElementById('terms-modal');
    modal.classList.add('hidden');
    document.body.style.overflow = '';
}

document.getElementById('terms-modal')?.addEventListener('click', (e) => {
    if (e.target.id === 'terms-modal') {
        closeTermsModal();
    }
});

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        closeTermsModal();
    }
});

let wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];

function updateWishlistBadge() {
    const badge = document.getElementById('wishlist-badge');
    if (!badge) return;

    if (wishlist.length > 0) {
        badge.textContent = wishlist.length;
        badge.classList.add('scale-100');
        badge.classList.remove('scale-0');
    } else {
        badge.classList.add('scale-0');
        badge.classList.remove('scale-100');
    }
}

function toggleWishlist() {
    if (wishlist.length === 0) {
        showToast('Tu lista de deseos está vacía', 'info');
    } else {
        showToast(`Tienes ${wishlist.length} producto(s) en tu lista de deseos`, 'success');
    }
}

function addToWishlist(productName, price, image) {
    const existingProduct = wishlist.find(item => item.name === productName);

    if (existingProduct) {
        showToast('Este producto ya está en tu lista de deseos', 'info');
        return;
    }

    wishlist.push({
        name: productName,
        price: price,
        image: image
    });

    localStorage.setItem('wishlist', JSON.stringify(wishlist));
    updateWishlistBadge();
    showToast('Producto agregado a tu lista de deseos ❤️', 'success');
}

function removeFromWishlist(productName) {
    wishlist = wishlist.filter(item => item.name !== productName);
    localStorage.setItem('wishlist', JSON.stringify(wishlist));
    updateWishlistBadge();
    showToast('Producto eliminado de tu lista de deseos', 'info');
}

function showToast(message, type = 'success') {
    const container = document.getElementById('toast-container');
    const toast = document.createElement('div');
    toast.className = `pointer-events-auto bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 mb-3 transform transition-all duration-300 translate-x-full border-l-4 ${type === 'success' ? 'border-primary' : type === 'error' ? 'border-accent-red' : 'border-secondary'
        }`;
    toast.innerHTML = `
                <div class="flex items-center gap-3">
                    <span class="material-icons text-${type === 'success' ? 'primary' : type === 'error' ? 'accent-red' : 'secondary'}">${type === 'success' ? 'check_circle' : type === 'error' ? 'error' : 'info'
        }</span>
                    <p class="text-sm font-medium text-gray-800 dark:text-white">${message}</p>
                </div>
            `;
    container.appendChild(toast);

    setTimeout(() => toast.classList.remove('translate-x-full'), 100);
    setTimeout(() => {
        toast.classList.add('translate-x-full');
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

document.addEventListener('DOMContentLoaded', () => {
    updateWishlistBadge();
    updateCartUI();
});
