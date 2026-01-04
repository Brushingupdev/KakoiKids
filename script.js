
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
    updateProductButtons();
    showNotification(`¡<b>${title}</b> agregado al carrito!`);
}

function removeFromCart(title) {
    cart = cart.filter(item => item.title !== title);
    saveCartToLocalStorage();
    renderCartItems();
    updateCartBadge();
    updateProductButtons();
}

// Función toggle para agregar o quitar del carrito
function toggleCart(title, price, image) {
    const existingItem = cart.find(item => item.title === title);

    if (existingItem) {
        // Si ya está en el carrito, lo quitamos
        cart = cart.filter(item => item.title !== title);
        saveCartToLocalStorage();
        updateCartUI();
        updateProductButtons();
        showNotification(`<b>${title}</b> eliminado del carrito`);
    } else {
        // Si no está, lo agregamos
        cart.push({ title, price, image, quantity: 1 });
        saveCartToLocalStorage();
        updateCartUI();
        updateProductButtons();
        showNotification(`¡<b>${title}</b> agregado al carrito!`);
    }
}

// Función para verificar si un producto está en el carrito
function isInCart(title) {
    return cart.some(item => item.title === title);
}

// Función para actualizar el estado visual de todos los botones de productos
function updateProductButtons() {
    const productCards = document.querySelectorAll('[data-product-size]');

    productCards.forEach(card => {
        const button = card.querySelector('button[data-product-title]');
        if (button) {
            const title = button.getAttribute('data-product-title');
            updateButtonState(button, isInCart(title));
        }
    });
}

// Función para actualizar el estado visual de un botón específico
function updateButtonState(button, isSelected) {
    if (isSelected) {
        button.classList.remove('bg-gray-50', 'dark:bg-gray-700', 'hover:bg-primary', 'text-gray-700', 'dark:text-gray-200', 'border-gray-200', 'dark:border-gray-600');
        button.classList.add('bg-primary', 'text-white', 'border-primary');
        button.innerHTML = `
            <span class="material-icons text-sm">check_circle</span>
            Agregado
        `;
    } else {
        button.classList.remove('bg-primary', 'text-white', 'border-primary');
        button.classList.add('bg-gray-50', 'dark:bg-gray-700', 'hover:bg-primary', 'hover:text-white', 'text-gray-700', 'dark:text-gray-200', 'border-gray-200', 'dark:border-gray-600');
        button.innerHTML = `
            <span class="material-icons text-sm">shopping_cart</span>
            Agregar
        `;
    }
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


function expandImage() {
    const mainImage = document.getElementById('modal-main-image');
    const lightbox = document.getElementById('image-lightbox');
    const lightboxImage = document.getElementById('lightbox-image');

    if (mainImage && lightbox && lightboxImage) {
        lightboxImage.src = mainImage.src;
        lightboxImage.alt = mainImage.alt;
        lightbox.classList.remove('hidden');
        lightbox.classList.add('flex');
    }
}


function closeLightbox() {
    const lightbox = document.getElementById('image-lightbox');
    if (lightbox) {
        lightbox.classList.add('hidden');
        lightbox.classList.remove('flex');
    }
}

document.getElementById('product-modal')?.addEventListener('click', (e) => {
    if (e.target.id === 'product-modal') {
        closeProductModal();
    }
});

let currentSizeFilter = 'all';
let currentCategoryMainFilter = 'all';

function applyProductFilters() {
    const productCards = document.querySelectorAll('#shop [data-product-size]');

    productCards.forEach(card => {
        const productSize = card.getAttribute('data-product-size') || '';
        const productCategory = card.getAttribute('data-product-category') || '';

        const matchesSize = currentSizeFilter === 'all' || productSize.includes(currentSizeFilter);

        const matchesCategory = currentCategoryMainFilter === 'all' ||
            productCategory.toLowerCase().includes(currentCategoryMainFilter.toLowerCase());
        if (matchesSize && matchesCategory) {
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
            card.style.animation = `fadeIn 0.4s ease-out ${index * 0.05}s forwards`;
        }, 10);
    });

    showNoProductsMessage(visibleProducts.length === 0);
}

function showNoProductsMessage(show) {
    const grid = document.querySelector('#shop .grid');
    if (!grid) return;

    let noProductsMsg = document.getElementById('no-products-msg');

    if (show) {
        if (!noProductsMsg) {
            noProductsMsg = document.createElement('div');
            noProductsMsg.id = 'no-products-msg';
            noProductsMsg.className = 'col-span-full text-center py-12';
            noProductsMsg.innerHTML = `
                <span class="material-icons text-6xl text-gray-300 dark:text-gray-600 mb-4">search_off</span>
                <p class="text-xl font-bold text-gray-600 dark:text-gray-300 mb-2">No se encontraron productos</p>
                <p class="text-sm text-gray-500">Prueba con otros filtros</p>
            `;
            grid.appendChild(noProductsMsg);
        }
        noProductsMsg.style.display = 'block';
    } else if (noProductsMsg) {
        noProductsMsg.style.display = 'none';
    }
}

function filterByCategory(category) {
    currentCategoryMainFilter = category;
    applyProductFilters();
}

document.addEventListener('DOMContentLoaded', () => {
    const sizeFilters = document.querySelectorAll('.size-filter');

    sizeFilters.forEach(filter => {
        filter.addEventListener('click', () => {
            const selectedSize = filter.getAttribute('data-size');
            currentSizeFilter = selectedSize;

            sizeFilters.forEach(btn => {
                btn.classList.remove('bg-primary', 'text-white');
                btn.classList.add('bg-gray-100', 'dark:bg-gray-800', 'text-gray-600', 'dark:text-gray-300');
            });
            filter.classList.remove('bg-gray-100', 'dark:bg-gray-800', 'text-gray-600', 'dark:text-gray-300');
            filter.classList.add('bg-primary', 'text-white');

            applyProductFilters();
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
        title: 'Polo MNARA',
        category: 'NIÑO • 4Y',
        description: 'Polo blanco con mangas de diseño geométrico naranja. 100% algodón orgánico.',
        price: 29.90,
        image: 'Polo-MNARA-4Y.jpeg'
    },
    {
        title: 'Polo MRAYSM',
        category: 'NIÑO • 6Y',
        description: 'Polo color vanilla con diseño moderno y cómodo. Suave y transpirable.',
        price: 29.90,
        image: 'Polo-MRAYSM-6Y.jpeg'
    },
    {
        title: 'Polo MRAYS',
        category: 'NIÑO • 4Y',
        description: 'Polo bicolor blanco con mangas vanilla. Fresco y cómodo.',
        price: 29.90,
        image: 'Polo-MRAYS-4Y.jpeg'
    },
    {
        title: 'Polo MPLOM 4Y',
        category: 'NIÑO • 4Y',
        description: 'Diseño elegante color vanilla. 100% algodón orgánico.',
        price: 29.90,
        image: 'Polo-MPLOM-4Y.jpeg'
    },
    {
        title: 'Polo MPLOM 6Y',
        category: 'NIÑO • 6Y',
        description: 'Polo elegante en talla 6Y. Suave y transpirable.',
        price: 29.90,
        image: 'Polo-MPLOM-6Y.jpeg'
    },
    {
        title: 'Polo MFLOR 4Y',
        category: 'NIÑO • 4Y',
        description: 'Diseño floral moderno. 100% algodón orgánico.',
        price: 29.90,
        image: 'Polo-MFLOR-4Y.jpeg'
    },
    {
        title: 'Polo MFLOR 6Y',
        category: 'NIÑO • 6Y',
        description: 'Estilo floral único en talla grande. Suave y cómodo.',
        price: 29.90,
        image: 'Polo-MFLOR-6Y.jpeg'
    },
    {
        title: 'Polo RDM 2Y',
        category: 'NIÑO • 2Y',
        description: 'Diseño clásico para los más pequeños. Muy suave.',
        price: 29.90,
        image: 'Polo-RDM-2Y.jpeg'
    },
    {
        title: 'Polo RDM 6Y',
        category: 'NIÑO • 6Y',
        description: 'Clásico y elegante. Perfecto para el día a día.',
        price: 29.90,
        image: 'Polo-RDM-6Y.jpeg'
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
        const inCart = isInCart(product.title);
        const buttonClass = inCart
            ? 'bg-primary text-white border-primary'
            : 'bg-gray-50 dark:bg-gray-700 hover:bg-primary hover:text-white text-gray-700 dark:text-gray-200 border-gray-200 dark:border-gray-600';
        const buttonIcon = inCart ? 'check_circle' : 'add_shopping_cart';
        const buttonText = inCart ? 'Agregado' : '';

        const productCard = `
                    <div class="catalog-product-card bg-card-light dark:bg-card-dark rounded-xl overflow-hidden shadow-soft hover:shadow-xl transition-all duration-300 border border-gray-100 dark:border-gray-800">
                        <div class="catalog-product-image relative aspect-square overflow-hidden bg-gray-100 dark:bg-gray-800 cursor-pointer" onclick="expandCatalogImage('${product.image}', '${product.title}')">
                            ${product.oldPrice ? `<span class="absolute top-2 left-2 bg-accent-red text-white text-xs font-bold px-2 py-1 rounded z-10">-${Math.round((1 - product.price / product.oldPrice) * 100)}%</span>` : ''}
                            <img src="${product.image}" alt="${product.title}" class="w-full h-full object-cover hover:scale-105 transition-transform duration-500">
                            <div class="catalog-zoom-icon"></div>
                        </div>
                        <div class="catalog-product-info p-4 flex flex-col flex-grow">
                            <p class="text-xs font-bold text-gray-400 dark:text-gray-500 mb-1 uppercase tracking-wide">${product.category}</p>
                            <h3 class="text-base font-bold text-gray-800 dark:text-white mb-2">${product.title}</h3>
                            <p class="catalog-description text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">${product.description}</p>
                            <div class="mt-auto flex items-center justify-between">
                                <div>
                                    ${product.oldPrice ? `<span class="text-xs text-gray-400 line-through mr-1">S/. ${product.oldPrice.toFixed(2)}</span>` : ''}
                                    <span class="text-lg font-bold ${product.oldPrice ? 'text-accent-red' : 'text-primary'}">S/. ${product.price.toFixed(2)}</span>
                                </div>
                                <button onclick="toggleCatalogCart('${product.title}', ${product.price}, '${product.image}')" 
                                    data-catalog-product="${product.title}"
                                    class="${buttonClass} px-3 py-2 rounded-lg text-sm font-semibold flex items-center gap-1 transition-colors active:scale-95 border">
                                    <span class="material-icons text-sm">${buttonIcon}</span>
                                    ${buttonText}
                                </button>
                            </div>
                        </div>
                    </div>
                `;
        container.innerHTML += productCard;
    });
}

// Función toggle específica para el catálogo modal
function toggleCatalogCart(title, price, image) {
    toggleCart(title, price, image);
    // Re-renderizar los productos del catálogo para actualizar el estado visual
    renderCatalogProducts(getFilteredProducts());
}

function expandCatalogImage(imageSrc, imageAlt) {
    const lightbox = document.getElementById('image-lightbox');
    const lightboxImage = document.getElementById('lightbox-image');

    if (lightbox && lightboxImage) {
        lightboxImage.src = imageSrc;
        lightboxImage.alt = imageAlt;
        lightbox.classList.remove('hidden');
        lightbox.classList.add('flex');
    }
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
    updateProductButtons();
});

