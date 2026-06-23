let cart = JSON.parse(localStorage.getItem('mosiqatiCart')) || [];

function updateCartUI() {
    localStorage.setItem('mosiqatiCart', JSON.stringify(cart));
    const list = document.getElementById('cart-items');
    const count = document.getElementById('cart-count');
    const total = document.getElementById('total-price');
    
    let totalSum = 0;
    let totalCount = 0;

    // حساب المجاميع أولاً بشكل مستقل
    cart.forEach((item) => {
        totalSum += item.price * item.quantity;
        totalCount += item.quantity;
    });

    // تحديث قائمة المنتجات داخل السلة إذا كانت موجودة في الصفحة الحالية
    if (list) {
        list.innerHTML = '';
        cart.forEach((item, index) => {
            list.innerHTML += `
                <div class="cart-item">
                    <img src="${item.img}" width="40">
                    <span class="cart-item-name">${item.name}</span>
                    <div class="quantity-controls">
                        <button onclick="changeQuantity(${index}, -1)">-</button>
                        <span>${item.quantity}</span>
                        <button onclick="changeQuantity(${index}, 1)">+</button>
                    </div>
                   <span>${item.price * item.quantity} د.أ</span>
<button onclick="removeItem(${index})" style="background:none;border:none;color:#e74c3c;cursor:pointer;font-size:18px;">
    <i class="fa-solid fa-trash"></i>
</button>
                </div>`;
        });
    }

    // تحديث عداد السلة (الرقم فوق الأيقونة) إذا كان موجوداً
    if (count) {
        count.innerText = totalCount;
    }

    // تحديث إجمالي السعر إذا كان موجوداً
    if (total) {
        total.innerText = totalSum + ' د.أ';
    }
   const checkoutBtn = document.getElementById('checkout-btn');

if (checkoutBtn) {

    const isEnglish = document.documentElement.lang === 'en';

    if (cart.length === 0) {
        checkoutBtn.innerText = isEnglish
            ? 'Go to Store'
            : 'الانتقال إلى المتجر';
    } else {
        checkoutBtn.innerText = isEnglish
            ? 'Checkout Order'
            : 'تأكيد الطلب';
    }
}
}

function addToCart(name, price, img) {
    const existingItem = cart.find(item => item.name === name);
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({ name, price, img, quantity: 1 });
    }
    updateCartUI();
    const emptyCartError = document.getElementById('error-empty-cart');
    if (emptyCartError) emptyCartError.style.display = 'none';
    const checkoutBtn = document.getElementById('checkout-btn');



}

function changeQuantity(index, delta) {
    cart[index].quantity += delta;
    if (cart[index].quantity <= 0) {
        cart.splice(index, 1);
    }
    updateCartUI();
}
function removeItem(index) {
    cart.splice(index, 1);
    updateCartUI();
}

function openCart() { 
    const cartModal = document.getElementById('cart-modal');
    if (cartModal) cartModal.style.display = 'flex'; 
    
    document.body.style.overflow = 'hidden';
    
    const cartContent = document.getElementById('cart-content-area');
    if (cartContent) cartContent.style.display = 'block';
    
    const modalTitle = document.getElementById('modal-title');
    if (modalTitle) modalTitle.style.display = 'block';
    
    const checkoutForm = document.getElementById('checkout-form');
    if (checkoutForm) checkoutForm.style.display = 'none';
    
    const successMsg = document.getElementById('success-msg');
    if (successMsg) successMsg.style.display = 'none';
    
    const emptyCartError = document.getElementById('error-empty-cart');
    if (emptyCartError) emptyCartError.style.display = 'none';
}

function closeCart() { 
    const cartModal = document.getElementById('cart-modal');
    if (cartModal) cartModal.style.display = 'none'; 
    document.body.style.overflow = 'auto';
}

function showCheckout() {
    if (cart.length === 0) {

        const isEnglish = document.documentElement.lang === 'en';

        window.location.href = isEnglish
            ? 'storepage.en.html'
            : 'storepage.html';

        return;
    }
    
    const emptyCartError = document.getElementById('error-empty-cart');
    if (emptyCartError) emptyCartError.style.display = 'none';
    
    const cartContent = document.getElementById('cart-content-area');
    if (cartContent) cartContent.style.display = 'none';
    
    const modalTitle = document.getElementById('modal-title');
    if (modalTitle) modalTitle.style.display = 'none';
    
    const checkoutForm = document.getElementById('checkout-form');
    if (checkoutForm) checkoutForm.style.display = 'block';
}

function backToCart() {
    const checkoutForm = document.getElementById('checkout-form');
    if (checkoutForm) checkoutForm.style.display = 'none';
    
    const modalTitle = document.getElementById('modal-title');
    if (modalTitle) modalTitle.style.display = 'block';
    
    const cartContent = document.getElementById('cart-content-area');
    if (cartContent) cartContent.style.display = 'block';
}

function clearAllErrors() {
    const errorMessages = document.querySelectorAll('.error-message');
    errorMessages.forEach(msg => msg.style.display = 'none');
}

function confirmOrder(event) {
    event.preventDefault(); 
    clearAllErrors();

    const nameEl = document.getElementById('cust-name');
    const phoneEl = document.getElementById('cust-phone');
    const addressEl = document.getElementById('cust-address');

    if (!nameEl || !phoneEl || !addressEl) return;

    let name = nameEl.value.trim();
    let phone = phoneEl.value.trim();
    let address = addressEl.value.trim();
    let isValid = true;

    if (name === "") {
        const errName = document.getElementById('error-name');
        if (errName) errName.style.display = 'flex';
        isValid = false;
    }

    if (phone === "") {
        const errPhone = document.getElementById('error-phone');
        if (errPhone) {
            errPhone.innerHTML = '<span class="error-icon-box">!</span><span>يرجى تعبئة جميع الخانات المطلوبة لإتمام الطلب!</span>';
            errPhone.style.display = 'flex';
        }
        isValid = false;
    }

    if (address === "") {
        const errAddress = document.getElementById('error-address');
        if (errAddress) errAddress.style.display = 'flex';
        isValid = false;
    }

    if (!isValid) return;

    let purePhoneNumbers = phone.replace('+', '');
    
    if (purePhoneNumbers.length !== 12 || isNaN(purePhoneNumbers)) {
        const errPhone = document.getElementById('error-phone');
        if (errPhone) {
            errPhone.innerHTML = '<span class="error-icon-box">!</span><span>يُرجى التأكد من كتابة الرقم كاملاً مع رمز الدولة الصحيح (يتكون من 12 رقماً، مثال: 962797370514)</span>';
            errPhone.style.display = 'flex';
        }
        return;
    }

    let orderDetails = cart.map(item => `${item.name} (x${item.quantity})`).join(", ");
    
    const totalEl = document.getElementById('total-price');
    let total = totalEl ? totalEl.innerText : 'غير محدد';
    
    let url = `https://wa.me/962797370514?text=طلب جديد من موسيقاتي:%0Aالاسم: ${name}%0Aالهاتف: ${phone}%0Aالعنوان: ${address}%0Aالمنتجات: ${orderDetails}%0Aالمجموع: ${total}%0Aطريقة الدفع: الدفع عند الاستلام فقط`;
    
    window.open(url, '_blank');

    const checkoutForm = document.getElementById('checkout-form');
    if (checkoutForm) checkoutForm.style.display = 'none';
    
    const successMsg = document.getElementById('success-msg');
    if (successMsg) successMsg.style.display = 'block';
}

function closeAll() {
    localStorage.removeItem('mosiqatiCart');
    cart = [];
    location.reload();
}

// تشغيل التحديث فور تحميل الصفحة لضمان قراءة السلة المخزنة
window.addEventListener('DOMContentLoaded', updateCartUI);

// نظام البحث الذكي والفوري والمطابق لجميع الصفحات
document.addEventListener("DOMContentLoaded", function () {
    const searchInput = document.getElementById("search-input");
    
    if (searchInput) {
        searchInput.addEventListener("input", function () {
            const filterValue = searchInput.value.trim().toLowerCase();
            const productCards = document.querySelectorAll(".product-card");

            productCards.forEach(card => {
                const productTitleElement = card.querySelector(".product-title");
                
                if (productTitleElement) {
                    const productTitle = productTitleElement.textContent.toLowerCase();

                    if (filterValue === "" || productTitle.includes(filterValue)) {
                        card.style.display = ""; 
                    } else {
                        card.style.display = "none"; 
                    }
                }
            });
        });
    }
});

/* ==========================================================================
   12. كود الإضافة الجديد كلياً: نظام التحكم في إمكانية الوصول وحفظ التفضيلات
   (تمت الإضافة هنا في النهاية لحماية الكود الأصلي والمحافظة عليه 100%)
   ========================================================================== */

// دالة لتطبيق التفضيلات المخزنة فوراً عند تحميل أي صفحة في الموقع
function applyAccessibilitySettings() {
    // 1. تطبيق حجم الخط المخزن
    const savedFontSize = localStorage.getItem('mosiqatiFontSize') || 'font-normal';
    document.body.classList.remove('font-normal', 'font-medium', 'font-large', 'font-xlarge');
    document.body.classList.add(savedFontSize);
    
    // تحديث حالة الأزرار النشطة داخل صفحة إمكانية الوصول إن وجدت
    const fontButtons = document.querySelectorAll('.font-btn');
    fontButtons.forEach(btn => {
        if (btn.getAttribute('data-size') === savedFontSize) {
            btn.classList.add('active-setting');
        } else {
            btn.classList.remove('active-setting');
        }
    });

    // 2. تطبيق المظهر المخزن (داكن / فاتح)
    const savedMode = localStorage.getItem('mosiqatiTheme') || 'light-mode';
    if (savedMode === 'dark-mode') {
        document.body.classList.add('dark-mode');
    } else {
        document.body.classList.remove('dark-mode');
    }
    
    // تحديث حالة أزرار المظهر النشطة داخل صفحة إمكانية الوصول إن وجدت
    const themeButtons = document.querySelectorAll('.theme-btn');
    themeButtons.forEach(btn => {
        if (btn.getAttribute('data-theme') === savedMode) {
            btn.classList.add('active-setting');
        } else {
            btn.classList.remove('active-setting');
        }
    });

    // 3. تطبيق اللغة المخزنة
    const savedLang = localStorage.getItem('mosiqatiLang') || 'ar';
    
    // تحديث حالة أزرار اللغة النشطة داخل صفحة إمكانية الوصول إن وجدت
    const langButtons = document.querySelectorAll('.lang-btn');
    langButtons.forEach(btn => {
        if (btn.getAttribute('data-lang') === savedLang) {
            btn.classList.add('active-setting');
        } else {
            btn.classList.remove('active-setting');
        }
    });
}

// إعداد مستمعي الأحداث للتحكم بالخيارات وتخزينها ديناميكياً
document.addEventListener("DOMContentLoaded", function () {
    // تشغيل التطبيق التلقائي عند تحميل DOM
    applyAccessibilitySettings();

    // إعداد أزرار تغيير حجم الخط
    const fontButtons = document.querySelectorAll('.font-btn');
    fontButtons.forEach(button => {
        button.addEventListener('click', function () {
            const size = this.getAttribute('data-size');
            localStorage.setItem('mosiqatiFontSize', size);
            applyAccessibilitySettings();
        });
    });

    // إعداد أزرار تغيير المظهر (الوضع الداكن والفاتح)
    const themeButtons = document.querySelectorAll('.theme-btn');
    themeButtons.forEach(button => {
        button.addEventListener('click', function () {
            const theme = this.getAttribute('data-theme');
            localStorage.setItem('mosiqatiTheme', theme);
            applyAccessibilitySettings();
        });
    });

    // إعداد أزرار تغيير اللغة
    const langButtons = document.querySelectorAll('.lang-btn');
    langButtons.forEach(button => {
        button.addEventListener('click', function () {
            const lang = this.getAttribute('data-lang');
            localStorage.setItem('mosiqatiLang', lang);
            applyAccessibilitySettings();
        });
    });
})