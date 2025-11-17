// =====================================
// Products Data
// =====================================

const products = [
    {
        id: 1,
        name: "الأرز الأبيض",
        description: "أرز أبيض عالي الجودة - 2 كيلو",
        price: 25.99
    },
    {
        id: 2,
        name: "الدقيق متعدد الاستعمال",
        description: "دقيق ممتاز للخبز - 1 كيلو",
        price: 8.50
    },
    {
        id: 3,
        name: "الزيت النباتي",
        description: "زيت نباتي صافي - 1.5 لتر",
        price: 18.75
    },
    {
        id: 4,
        name: "الحليب الطازج",
        description: "حليب بقري طازج - 1 لتر",
        price: 6.99
    },
    {
        id: 5,
        name: "البيض",
        description: "بيض طازج - 12 حبة",
        price: 7.50
    },
    {
        id: 6,
        name: "الزبدة",
        description: "زبدة طبيعية - 250 غرام",
        price: 12.99
    },
    {
        id: 7,
        name: "الجبن الأبيض",
        description: "جبن أبيض فريش - 500 غرام",
        price: 14.50
    },
    {
        id: 8,
        name: "الطماطم المعلبة",
        description: "طماطم معلبة جودة عالية - 400 غرام",
        price: 4.25
    },
    {
        id: 9,
        name: "الفاصولياء المعلبة",
        description: "فاصولياء جاهزة الطهي - 425 غرام",
        price: 3.99
    },
    {
        id: 10,
        name: "السكر الأبيض",
        description: "سكر نقي - 1 كيلو",
        price: 5.75
    },
    {
        id: 11,
        name: "الملح",
        description: "ملح ناعم مكرر - 500 غرام",
        price: 1.50
    },
    {
        id: 12,
        name: "القهوة سريعة الذوبان",
        description: "قهوة فورية - 100 غرام",
        price: 9.99
    },
    {
        id: 13,
        name: "الشاي الأسود",
        description: "شاي فاخر - 50 كيس",
        price: 6.50
    },
    {
        id: 14,
        name: "عصير برتقال",
        description: "عصير 100% طبيعي - 1 لتر",
        price: 7.25
    },
    {
        id: 15,
        name: "الخبز",
        description: "خبز طازج يومي - 400 غرام",
        price: 2.50
    },
    {
        id: 16,
        name: "المعكرونة",
        description: "معكرونة سباجيتي - 500 غرام",
        price: 3.75
    }
];

// =====================================
// Cart Management
// =====================================

class ShoppingCart {
    constructor() {
        this.cart = this.loadCart();
    }

    // حفظ العربة في localStorage
    saveCart() {
        localStorage.setItem('shoppingCart', JSON.stringify(this.cart));
        this.updateCartUI();
    }

    // تحميل العربة من localStorage
    loadCart() {
        const saved = localStorage.getItem('shoppingCart');
        return saved ? JSON.parse(saved) : [];
    }

    // إضافة منتج إلى العربة
    addProduct(productId, quantity = 1) {
        const product = products.find(p => p.id === productId);
        if (!product) return;

        const existingItem = this.cart.find(item => item.id === productId);

        if (existingItem) {
            existingItem.quantity += quantity;
        } else {
            this.cart.push({
                id: product.id,
                name: product.name,
                price: product.price,
                quantity: quantity
            });
        }

        this.saveCart();
        this.showNotification(`تم إضافة ${product.name} إلى العربة ✓`);
    }

    // إزالة منتج من العربة
    removeProduct(productId) {
        this.cart = this.cart.filter(item => item.id !== productId);
        this.saveCart();
    }

    // تحديث كمية المنتج
    updateQuantity(productId, quantity) {
        const item = this.cart.find(item => item.id === productId);
        if (item) {
            if (quantity <= 0) {
                this.removeProduct(productId);
            } else {
                item.quantity = quantity;
                this.saveCart();
            }
        }
    }

    // حذف كل المنتجات
    clearCart() {
        this.cart = [];
        this.saveCart();
    }

    // الحصول على عدد المنتجات
    getItemCount() {
        return this.cart.reduce((sum, item) => sum + item.quantity, 0);
    }

    // الحصول على الإجمالي
    getTotal() {
        return this.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    }

    // الحصول على عدد أنواع المنتجات
    getUniqueItemCount() {
        return this.cart.length;
    }

    // تحديث واجهة العربة
    updateCartUI() {
        const count = this.getItemCount();
        const badge = document.getElementById('cart-count');
        if (badge) {
            badge.textContent = count;
        }
    }

    // عرض إشعار
    showNotification(message) {
        // إنشاء عنصر إشعار
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background-color: var(--success-color);
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 5px;
            box-shadow: var(--shadow-lg);
            z-index: 2000;
            animation: slideInFromTop 0.3s ease-in;
            font-weight: bold;
        `;
        notification.textContent = message;
        document.body.appendChild(notification);

        // حذف الإشعار بعد 3 ثواني
        setTimeout(() => {
            notification.style.animation = 'slideOutToTop 0.3s ease-out';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }
}

// =====================================
// UI Functions
// =====================================

const cart = new ShoppingCart();

// عرض/إخفاء الصفحات
function showPage(pageId) {
    // إخفاء جميع الصفحات
    const pages = document.querySelectorAll('.page');
    pages.forEach(page => page.classList.remove('active'));

    // إظهار الصفحة المطلوبة
    const activePage = document.getElementById(pageId);
    if (activePage) {
        activePage.classList.add('active');
    }

    // تحديث الـ Navbar
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => link.classList.remove('active'));

    // تحديد الرابط النشط
    const activeLink = document.querySelector(`a[onclick="showPage('${pageId}')"]`);
    if (activeLink) {
        activeLink.classList.add('active');
    }

    // إذا كانت صفحة العربة، تحديث محتوى العربة
    if (pageId === 'cart') {
        updateCartDisplay();
    }
}

// عرض المنتجات
function displayProducts() {
    const productsGrid = document.getElementById('products-grid');
    if (!productsGrid) return;

    productsGrid.innerHTML = '';

    products.forEach(product => {
        const productCard = document.createElement('div');
        productCard.className = 'product-card';
        productCard.innerHTML = `
            <div class="product-header">
                🛒
            </div>
            <div class="product-body">
                <h3 class="product-name">${product.name}</h3>
                <p class="product-description">${product.description}</p>
                <p class="product-price">${product.price.toFixed(2)} ر.س</p>
                <button class="add-to-cart-btn" onclick="addToCart(${product.id})">
                    ➕ إضافة إلى العربة
                </button>
            </div>
        `;
        productsGrid.appendChild(productCard);
    });
}

// إضافة منتج إلى العربة
function addToCart(productId) {
    cart.addProduct(productId, 1);
}

// تحديث عرض العربة
function updateCartDisplay() {
    const emptyMessage = document.getElementById('empty-cart-message');
    const cartContent = document.getElementById('cart-content');
    const cartItems = document.getElementById('cart-items');

    if (cart.cart.length === 0) {
        emptyMessage.classList.remove('hidden');
        cartContent.classList.add('hidden');
    } else {
        emptyMessage.classList.add('hidden');
        cartContent.classList.remove('hidden');

        cartItems.innerHTML = '';

        cart.cart.forEach(item => {
            const row = document.createElement('tr');
            const itemTotal = (item.price * item.quantity).toFixed(2);

            row.innerHTML = `
                <td>${item.name}</td>
                <td>${item.price.toFixed(2)} ر.س</td>
                <td>
                    <div class="quantity-controls">
                        <button class="quantity-btn" onclick="updateItemQuantity(${item.id}, ${item.quantity - 1})">−</button>
                        <span class="quantity-input">${item.quantity}</span>
                        <button class="quantity-btn" onclick="updateItemQuantity(${item.id}, ${item.quantity + 1})">+</button>
                    </div>
                </td>
                <td>${itemTotal} ر.س</td>
                <td>
                    <button class="delete-btn" onclick="removeFromCart(${item.id})">🗑️ حذف</button>
                </td>
            `;
            cartItems.appendChild(row);
        });

        updateCartSummary();
    }
}

// تحديث الملخص
function updateCartSummary() {
    const totalItems = document.getElementById('total-items');
    const subtotal = document.getElementById('subtotal');
    const totalPrice = document.getElementById('total-price');

    const itemCount = cart.getItemCount();
    const total = cart.getTotal();

    if (totalItems) totalItems.textContent = itemCount;
    if (subtotal) subtotal.textContent = total.toFixed(2) + ' ر.س';
    if (totalPrice) totalPrice.textContent = total.toFixed(2) + ' ر.س';
}

// تحديث كمية المنتج
function updateItemQuantity(productId, newQuantity) {
    if (newQuantity <= 0) {
        removeFromCart(productId);
    } else {
        cart.updateQuantity(productId, newQuantity);
        updateCartDisplay();
    }
}

// إزالة منتج من العربة
function removeFromCart(productId) {
    cart.removeProduct(productId);
    updateCartDisplay();
    cart.showNotification('تم حذف المنتج من العربة ✓');
}

// حذف كل المنتجات
function clearCart() {
    if (confirm('هل أنت متأكد من حذف جميع المنتجات؟')) {
        cart.clearCart();
        updateCartDisplay();
        cart.showNotification('تم مسح العربة بالكامل ✓');
    }
}

// إتمام الشراء
function checkout() {
    if (cart.cart.length === 0) {
        alert('العربة فارغة! أضف بعض المنتجات أولاً.');
        return;
    }

    const total = cart.getTotal();
    const itemCount = cart.getItemCount();

    const message = `
شكراً لك على عملية الشراء! 🎉

📊 ملخص الطلب:
━━━━━━━━━━━━━━━━━
عدد المنتجات: ${itemCount}
الإجمالي النهائي: ${total.toFixed(2)} ر.س

تم استلام طلبك بنجاح!
سيتم التواصل معك قريباً للتسليم 🚚

شكراً لتسوقك معنا 💝
    `;

    alert(message);
    
    // إفراغ العربة بعد الشراء
    cart.clearCart();
    updateCartDisplay();
    showPage('home');
}

// =====================================
// Initialization
// =====================================

document.addEventListener('DOMContentLoaded', () => {
    // عرض المنتجات
    displayProducts();

    // تحديث عداد العربة
    cart.updateCartUI();

    // عرض الصفحة الرئيسية
    showPage('home');

    // استعادة حالة الملاحة من localStorage
    const savedPage = localStorage.getItem('currentPage');
    if (savedPage) {
        showPage(savedPage);
    }

    // حفظ الصفحة الحالية عند التنقل
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            const pageId = link.getAttribute('onclick').match(/'([^']+)'/)[1];
            localStorage.setItem('currentPage', pageId);
        });
    });
});

// تحديث العربة عند تغيير localStorage من نافذة أخرى
window.addEventListener('storage', (e) => {
    if (e.key === 'shoppingCart') {
        cart.cart = cart.loadCart();
        cart.updateCartUI();
        updateCartDisplay();
    }
});

// إضافة CSS أنيميشن slide-out
const style = document.createElement('style');
style.textContent = `
    @keyframes slideOutToTop {
        from {
            opacity: 1;
            transform: translateY(0);
        }
        to {
            opacity: 0;
            transform: translateY(-20px);
        }
    }
`;
document.head.appendChild(style);
