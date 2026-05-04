

document.addEventListener('DOMContentLoaded', function () {

    // ========== HAMBURGER MENU ==========
    const hamburger = document.getElementById('hamburger');
    const siteNav = document.getElementById('site-nav');
    const mobileOverlay = document.getElementById('mobileOverlay');

    function openMobileNav() {
        hamburger?.classList.add('active');
        siteNav?.classList.add('open');
        mobileOverlay?.classList.add('open');
        document.body.style.overflow = 'hidden';
    }
    function closeMobileNav() {
        hamburger?.classList.remove('active');
        siteNav?.classList.remove('open');
        mobileOverlay?.classList.remove('open');
        document.body.style.overflow = '';
    }

    hamburger?.addEventListener('click', () => {
        if (siteNav?.classList.contains('open')) closeMobileNav();
        else openMobileNav();
    });
    mobileOverlay?.addEventListener('click', closeMobileNav);

    // Close nav on nav link click (mobile)
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            if (window.innerWidth < 900) closeMobileNav();
        });
    });


    // ========== SEARCH TOGGLE ==========
    const searchToggle = document.getElementById('searchToggle');
    const searchOverlay = document.getElementById('searchOverlay');
    const closeSearch = document.getElementById('closeSearch');
    const searchInput = document.getElementById('searchInput');

    searchToggle?.addEventListener('click', () => {
        searchOverlay?.classList.toggle('open');
        if (searchOverlay?.classList.contains('open')) {
            setTimeout(() => searchInput?.focus(), 100);
        }
    });
    closeSearch?.addEventListener('click', () => {
        searchOverlay?.classList.remove('open');
    });
    document.addEventListener('keydown', e => {
        if (e.key === 'Escape') {
            searchOverlay?.classList.remove('open');
            closeMobileNav();
        }
    });


    // ========== HERO CAROUSEL ==========
    const heroCarousel = document.getElementById('heroCarousel');
    if (heroCarousel) {
        const slides = heroCarousel.querySelectorAll('.hero-slide');
        const dots = document.getElementById('heroDots')?.querySelectorAll('.hero-dot');
        const prevBtn = document.getElementById('heroPrev');
        const nextBtn = document.getElementById('heroNext');
        let current = 0;
        let timer = null;

        function goToHero(idx) {
            if (idx < 0) idx = slides.length - 1;
            if (idx >= slides.length) idx = 0;
            slides[current].classList.remove('active');
            if (dots) dots[current]?.classList.remove('active');
            current = idx;
            slides[current].classList.add('active');
            if (dots) dots[current]?.classList.add('active');
        }

        function startHeroAuto() {
            timer = setInterval(() => goToHero(current + 1), 5000);
        }
        function stopHeroAuto() { clearInterval(timer); }

        prevBtn?.addEventListener('click', () => { stopHeroAuto(); goToHero(current - 1); startHeroAuto(); });
        nextBtn?.addEventListener('click', () => { stopHeroAuto(); goToHero(current + 1); startHeroAuto(); });
        dots?.forEach(dot => {
            dot.addEventListener('click', () => {
                stopHeroAuto();
                goToHero(parseInt(dot.dataset.idx));
                startHeroAuto();
            });
        });

        // Touch / swipe
        let touchStartX = 0;
        heroCarousel.addEventListener('touchstart', e => { touchStartX = e.touches[0].clientX; }, { passive: true });
        heroCarousel.addEventListener('touchend', e => {
            const diff = touchStartX - e.changedTouches[0].clientX;
            if (Math.abs(diff) > 40) {
                stopHeroAuto();
                goToHero(current + (diff > 0 ? 1 : -1));
                startHeroAuto();
            }
        });

        heroCarousel.addEventListener('mouseenter', stopHeroAuto);
        heroCarousel.addEventListener('mouseleave', startHeroAuto);
        startHeroAuto();
    }


    // ========== CATEGORY SLIDER ==========
    const catTrack = document.getElementById('catTrack');
    const catPrev = document.getElementById('catPrev');
    const catNext = document.getElementById('catNext');

    if (catTrack && catPrev && catNext) {
        const cards = catTrack.querySelectorAll('.cat-card');
        let catCurrent = 0;

        function getVisible() {
            if (window.innerWidth <= 640) return 2;
            if (window.innerWidth <= 900) return 3;
            if (window.innerWidth <= 1100) return 4;
            return 5;
        }

        function getCardWidth() {
            if (!cards.length) return 0;
            const card = cards[0];
            const style = window.getComputedStyle(card);
            const gap = 20;
            return card.offsetWidth + gap;
        }

        function slideCat(direction) {
            const visible = getVisible();
            const maxIdx = Math.max(0, cards.length - visible);
            catCurrent = Math.min(maxIdx, Math.max(0, catCurrent + direction));
            catTrack.style.transform = `translateX(-${catCurrent * getCardWidth()}px)`;
        }

        catPrev.addEventListener('click', () => slideCat(-1));
        catNext.addEventListener('click', () => slideCat(1));

        // Touch swipe
        let catTouchX = 0;
        catTrack.addEventListener('touchstart', e => { catTouchX = e.touches[0].clientX; }, { passive: true });
        catTrack.addEventListener('touchend', e => {
            const diff = catTouchX - e.changedTouches[0].clientX;
            if (Math.abs(diff) > 40) slideCat(diff > 0 ? 1 : -1);
        });
    }


    // ========== COLLECTION TABS ==========
    const collTabs = document.querySelectorAll('.coll-tab');
    const collPanels = document.querySelectorAll('.coll-panel');

    collTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const target = tab.dataset.panel;
            collTabs.forEach(t => t.classList.remove('active'));
            collPanels.forEach(p => p.classList.remove('active'));
            tab.classList.add('active');
            document.getElementById(target)?.classList.add('active');
        });
    });


    // ========== PROJECT CAROUSEL ==========
    const projCarousel = document.getElementById('projCarousel');
    if (projCarousel) {
        const slides = projCarousel.querySelectorAll('.proj-slide');
        const dots = document.getElementById('projDots')?.querySelectorAll('.proj-dot');
        const prevBtn = document.getElementById('projPrev');
        const nextBtn = document.getElementById('projNext');
        let current = 0;
        let timer = null;

        function goToProj(idx) {
            if (idx < 0) idx = slides.length - 1;
            if (idx >= slides.length) idx = 0;
            slides[current].classList.remove('active');
            dots?.[current]?.classList.remove('active');
            current = idx;
            slides[current].classList.add('active');
            dots?.[current]?.classList.add('active');
        }

        function startProjAuto() { timer = setInterval(() => goToProj(current + 1), 4500); }
        function stopProjAuto() { clearInterval(timer); }

        prevBtn?.addEventListener('click', () => { stopProjAuto(); goToProj(current - 1); startProjAuto(); });
        nextBtn?.addEventListener('click', () => { stopProjAuto(); goToProj(current + 1); startProjAuto(); });
        dots?.forEach(dot => {
            dot.addEventListener('click', () => {
                stopProjAuto();
                goToProj(parseInt(dot.dataset.idx));
                startProjAuto();
            });
        });

        let projTouchX = 0;
        projCarousel.addEventListener('touchstart', e => { projTouchX = e.touches[0].clientX; }, { passive: true });
        projCarousel.addEventListener('touchend', e => {
            const diff = projTouchX - e.changedTouches[0].clientX;
            if (Math.abs(diff) > 50) { stopProjAuto(); goToProj(current + (diff > 0 ? 1 : -1)); startProjAuto(); }
        });

        projCarousel.addEventListener('mouseenter', stopProjAuto);
        projCarousel.addEventListener('mouseleave', startProjAuto);
        startProjAuto();
    }


    // ========== SPACES CAROUSEL ==========
    const spacesTrack = document.getElementById('spacesTrack');
    if (spacesTrack) {
        const items = spacesTrack.querySelectorAll('.space-item');
        const thumbs = document.getElementById('spacesThumbs')?.querySelectorAll('.space-thumb');
        const spaceLabel = document.getElementById('spaceLabel');
        const spaceDesc = document.getElementById('spaceDesc');
        const spacePrev = document.getElementById('spacePrev');
        const spaceNext = document.getElementById('spaceNext');
        let sCurrent = 0;
        let sTimer = null;

        function goToSpace(idx) {
            if (idx < 0) idx = items.length - 1;
            if (idx >= items.length) idx = 0;
            items[sCurrent].classList.remove('active');
            thumbs?.[sCurrent]?.classList.remove('active');
            sCurrent = idx;
            items[sCurrent].classList.add('active');
            thumbs?.[sCurrent]?.classList.add('active');
            spacesTrack.style.transform = `translateX(-${sCurrent * 100}%)`;
            if (spaceLabel) spaceLabel.textContent = items[sCurrent].dataset.label || '';
            if (spaceDesc) spaceDesc.textContent = items[sCurrent].dataset.desc || '';
        }

        function startSpaceAuto() { sTimer = setInterval(() => goToSpace(sCurrent + 1), 5000); }
        function stopSpaceAuto() { clearInterval(sTimer); }

        spacePrev?.addEventListener('click', () => { stopSpaceAuto(); goToSpace(sCurrent - 1); startSpaceAuto(); });
        spaceNext?.addEventListener('click', () => { stopSpaceAuto(); goToSpace(sCurrent + 1); startSpaceAuto(); });
        thumbs?.forEach(thumb => {
            thumb.addEventListener('click', () => {
                stopSpaceAuto();
                goToSpace(parseInt(thumb.dataset.idx));
                startSpaceAuto();
            });
        });

        let sTouchX = 0;
        spacesTrack.addEventListener('touchstart', e => { sTouchX = e.touches[0].clientX; }, { passive: true });
        spacesTrack.addEventListener('touchend', e => {
            const diff = sTouchX - e.changedTouches[0].clientX;
            if (Math.abs(diff) > 40) { stopSpaceAuto(); goToSpace(sCurrent + (diff > 0 ? 1 : -1)); startSpaceAuto(); }
        });

        spacesTrack.addEventListener('mouseenter', stopSpaceAuto);
        spacesTrack.addEventListener('mouseleave', startSpaceAuto);
        startSpaceAuto();
    }


    // ========== BACK TO TOP ==========
    const backToTop = document.getElementById('backToTop');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 400) {
            backToTop?.classList.add('visible');
        } else {
            backToTop?.classList.remove('visible');
        }
    }, { passive: true });
    backToTop?.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });


    // ========== STICKY HEADER SHADOW ==========
    const header = document.getElementById('site-header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 60) {
            header?.classList.add('scrolled');
        } else {
            header?.classList.remove('scrolled');
        }
    }, { passive: true });


    // ========== CART QUANTITY (cart.html) ==========
    document.querySelectorAll('.cart-qty button').forEach(btn => {
        btn.addEventListener('click', () => {
            const row = btn.closest('.cart-row');
            if (!row) return;
            const qtyEl = row.querySelector('.qty-val');
            const unitPrice = parseInt(row.dataset.price || 0, 10);
            const totalEl = row.querySelector('.line-total');
            if (!qtyEl) return;
            let qty = parseInt(qtyEl.textContent, 10);
            if (btn.textContent.trim() === '−') qty = Math.max(1, qty - 1);
            else qty += 1;
            qtyEl.textContent = qty;
            if (totalEl && unitPrice) {
                totalEl.textContent = (unitPrice * qty).toLocaleString('vi-VN') + ' ₫';
            }
            updateCartTotal();
        });
    });

    function updateCartTotal() {
        const rows = document.querySelectorAll('.cart-row:not(.cart-row-header)');
        const subtotalEl = document.querySelector('.subtotal-val');
        const totalEl = document.querySelector('.total-val');
        if (!subtotalEl || !totalEl) return;
        let sub = 0;
        rows.forEach(row => {
            const price = parseInt(row.dataset.price || 0, 10);
            const qty = parseInt(row.querySelector('.qty-val')?.textContent || 1, 10);
            sub += price * qty;
        });
        const ship = 150000;
        subtotalEl.textContent = sub.toLocaleString('vi-VN') + ' ₫';
        totalEl.textContent = (sub + ship).toLocaleString('vi-VN') + ' ₫';
    }


    // ========== PASSWORD TOGGLE (auth pages) ==========
    document.querySelectorAll('[data-show-pass]').forEach(btn => {
        btn.addEventListener('click', () => {
            const tgt = document.getElementById(btn.dataset.showPass);
            if (!tgt) return;
            tgt.type = tgt.type === 'password' ? 'text' : 'password';
            btn.textContent = tgt.type === 'text' ? 'Ẩn' : 'Hiện';
        });
    });


    // ========== FILTER CHIPS (products.html) ==========
    const filterChips = document.querySelectorAll('.filter-chip');
    filterChips.forEach(chip => {
        chip.addEventListener('click', () => {
            const group = chip.closest('.filter-group');
            if (!group) return;
            group.querySelectorAll('.filter-chip').forEach(c => c.classList.remove('active'));
            chip.classList.add('active');
        });
    });


    // ========== FILTER PANEL TOGGLE (mobile) ==========
    const filterToggleBtn = document.getElementById('filterToggle');
    const filterPanel = document.querySelector('.filter-panel');
    filterToggleBtn?.addEventListener('click', () => {
        filterPanel?.classList.toggle('open');
    });


    // ========== ANIMATE ON SCROLL ==========
    const observerOptions = {
        threshold: 0.12,
        rootMargin: '0px 0px -32px 0px'
    };
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Add animation class to sections
    document.querySelectorAll(
        '.prod-card, .cat-card, .testi-card, .news-card, .showcase-prod-card, .value-card'
    ).forEach((el, i) => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(24px)';
        el.style.transition = `opacity 0.5s ease ${i * 0.05}s, transform 0.5s ease ${i * 0.05}s`;
        observer.observe(el);
    });

    // When visible
    const styleTag = document.createElement('style');
    styleTag.textContent = `
    .prod-card.visible, .cat-card.visible, .testi-card.visible,
    .news-card.visible, .showcase-prod-card.visible, .value-card.visible {
      opacity: 1 !important;
      transform: none !important;
    }
  `;
    document.head.appendChild(styleTag);


    // ========== HEADER SCROLLED STYLE ==========
    const headerEl = document.querySelector('.site-header');
    if (headerEl) {
        const styleHeader = document.createElement('style');
        styleHeader.textContent = `
      .site-header.scrolled {
        box-shadow: 0 2px 24px rgba(0,0,0,0.10);
      }
    `;
        document.head.appendChild(styleHeader);
    }

}); // end DOMContentLoaded
function switchPanel(panelId) {
    document.querySelectorAll('.settings-nav-item').forEach(item => {
        item.classList.toggle('active', item.dataset.panel === panelId);
    });
    document.querySelectorAll('.settings-panel').forEach(panel => {
        panel.classList.toggle('active', panel.id === 'panel-' + panelId);
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

document.querySelectorAll('.settings-nav-item[data-panel]').forEach(item => {
    item.addEventListener('click', () => switchPanel(item.dataset.panel));
});

// ========== ADMIN TABS ==========
document.querySelectorAll('.admin-tab[data-sub]').forEach(tab => {
    tab.addEventListener('click', () => {
        document.querySelectorAll('.admin-tab').forEach(t => t.classList.remove('active'));
        document.querySelectorAll('.admin-sub-panel').forEach(p => p.classList.remove('active'));
        tab.classList.add('active');
        document.getElementById('sub-' + tab.dataset.sub)?.classList.add('active');
    });
});


// ========== MODALS ==========
let previousUrl = window.location.pathname;
function openModal(id, url = null) {
    const modal = document.getElementById(id);

    // 👉 lưu URL hiện tại trước khi đổi
    previousUrl = window.location.pathname;

    modal?.classList.add('open');

    if (url) { // nếu có url
        history.pushState({ modal: id }, '', url); // đổi đường dẫn trên thanh địa chỉ trình duyệt nhưng không reload lại trang
        //  url là đường dẫn của modal
    }
}

function closeModal(id) {
    const modal = document.getElementById(id);
    modal?.classList.remove('open');

    // 👉 quay lại URL trước đó
    history.pushState({}, '', previousUrl);

}

// click ra ngoài để đóng
document.querySelectorAll('.modal-backdrop').forEach(backdrop => {
    backdrop.addEventListener('click', e => {
        if (e.target === backdrop) {
            backdrop.classList.remove('open');
            history.pushState({}, '', previousUrl);
        }
    });
});
// ========== FORMS ==========
document.getElementById('profileForm')?.addEventListener('submit', e => {
    e.preventDefault();
    const name = document.getElementById('firstName').value + ' ' + document.getElementById('lastName').value;
    document.getElementById('sidebar-name').textContent = name;
    showSaveIndicator('profileSaveOk');
});

document.getElementById('passwordForm')?.addEventListener('submit', e => {
    e.preventDefault();
    const newPass = document.getElementById('newPass').value;
    const confirm = document.getElementById('confirmPass').value;
    if (newPass !== confirm) {
        document.getElementById('confirmPass').style.borderColor = '#e84040';
        return;
    }
    document.getElementById('confirmPass').style.borderColor = '';
    showSaveIndicator('passSaveOk');
    document.getElementById('passwordForm').reset();
    document.getElementById('passStrength').style.display = 'none';
});

function showSaveIndicator(id) {
    const el = document.getElementById(id);
    if (!el) return;
    el.classList.add('show');
    setTimeout(() => el.classList.remove('show'), 3000);
}

// ========== PASSWORD STRENGTH ==========
document.getElementById('newPass')?.addEventListener('input', function () {
    const val = this.value;
    const strengthEl = document.getElementById('passStrength');
    const fill = document.getElementById('strengthFill');
    const text = document.getElementById('strengthText');
    if (!val) { strengthEl.style.display = 'none'; return; }
    strengthEl.style.display = 'block';
    let score = 0;
    if (val.length >= 8) score++;
    if (/[A-Z]/.test(val)) score++;
    if (/[0-9]/.test(val)) score++;
    if (/[^A-Za-z0-9]/.test(val)) score++;
    const levels = [
        { w: '25%', bg: '#e84040', label: 'Rất yếu' },
        { w: '50%', bg: '#f39c12', label: 'Yếu' },
        { w: '75%', bg: '#3498db', label: 'Trung bình' },
        { w: '100%', bg: '#27ae60', label: 'Mạnh' },
    ];
    const lv = levels[Math.max(0, score - 1)];
    fill.style.width = lv.w;
    fill.style.background = lv.bg;
    text.textContent = lv.label;
    text.style.color = lv.bg;
});

// ========== LOGOUT ==========
function confirmLogout() {
    const btn = document.getElementById('logoutConfirmBtn');
    btn.textContent = 'Đang đăng xuất...';
    btn.disabled = true;
    setTimeout(() => { window.location.href = '/account/logout'; }, 1500);
}

// ========== ORDER STATUS VISUAL ==========
function updateOrderStatus(select) {
    // Visual feedback when status changes
    const row = select.closest('tr');
    row.style.transition = 'background 0.3s';
    row.style.background = 'rgba(234,191,132,0.08)';
    setTimeout(() => row.style.background = '', 800);
}

// ========== MINI CHART ==========
const months = ['T11', 'T12', 'T1', 'T2', 'T3', 'T4'];
const revenueData = [68, 82, 55, 90, 75, 100];
const ordersData = [45, 60, 40, 70, 65, 85];

const chartEl = document.getElementById('miniChart');
const labelsEl = document.getElementById('chartLabels');

if (chartEl) {
    months.forEach((m, i) => {
        const group = document.createElement('div');
        group.className = 'chart-bar-group';

        const revBar = document.createElement('div');
        revBar.className = 'chart-bar revenue';
        revBar.style.height = revenueData[i] + '%';
        revBar.title = m + ': ' + revenueData[i] + '%';

        const ordBar = document.createElement('div');
        ordBar.className = 'chart-bar orders';
        ordBar.style.height = ordersData[i] + '%';
        ordBar.title = m + ': ' + ordersData[i] + '%';

        group.appendChild(revBar);
        group.appendChild(ordBar);
        chartEl.appendChild(group);

        const label = document.createElement('div');
        label.className = 'chart-label';
        label.textContent = m;
        labelsEl.appendChild(label);
    });
}

// ========== PAGE NUM BTNS ==========
document.querySelectorAll('.pagination-btns').forEach(wrap => {
    wrap.querySelectorAll('.page-num').forEach(btn => {
        btn.addEventListener('click', () => {
            wrap.querySelectorAll('.page-num').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
        });
    });
});

// ========== AVATAR UPLOAD ==========
document.getElementById('avatarUpload')?.addEventListener('change', function (e) {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function (event) {
            const img = document.getElementById('userAvatarImg');
            const initials = document.getElementById('avatarInitials');
            img.src = event.target.result;
            img.style.display = 'block';
            initials.style.display = 'none';
            // Lưu vào localStorage để giữ khi reload
            localStorage.setItem('userAvatar', event.target.result);
        };
        reader.readAsDataURL(file);
    }
});

// Load saved avatar
const savedAvatar = localStorage.getItem('userAvatar');
if (savedAvatar) {
    const img = document.getElementById('userAvatarImg');
    const initials = document.getElementById('avatarInitials');
    img.src = savedAvatar;
    img.style.display = 'block';
    initials.style.display = 'none';
}



// ========== EDIT PRODUCT MODAL ==========

function openEditProductModal() {
    openModal('editProductModal');
}
// ========== EDIT ROLE MODAL ==========
function openEditRoleModal(name, desc, permissions) {
    document.getElementById('editRoleName').value = name;
    document.getElementById('editRoleDesc').value = desc;

    // Reset all checkboxes
    document.getElementById('permManageUsers').checked = false;
    document.getElementById('permManageProducts').checked = false;
    document.getElementById('permViewOrders').checked = false;
    document.getElementById('permUpdateOrders').checked = false;
    document.getElementById('permManageRoles').checked = false;
    document.getElementById('permManageSettings').checked = false;
    document.getElementById('permViewReports').checked = false;

    // Check permissions based on array
    permissions.forEach(p => {
        if (p === 'manage_users') document.getElementById('permManageUsers').checked = true;
        if (p === 'manage_products') document.getElementById('permManageProducts').checked = true;
        if (p === 'view_orders') document.getElementById('permViewOrders').checked = true;
        if (p === 'update_orders') document.getElementById('permUpdateOrders').checked = true;
        if (p === 'manage_roles') document.getElementById('permManageRoles').checked = true;
        if (p === 'manage_settings') document.getElementById('permManageSettings').checked = true;
        if (p === 'view_reports') document.getElementById('permViewReports').checked = true;
    });

    openModal('editRoleModal');
}

// ========== EDIT USER MODAL ==========
function openEditUserModal() {
    openModal('editUserModal');
}

// ========== EDIT ROLE MODAL ==========
function openEditRoleModal() {
    openModal('editRoleModal');
}

document.getElementById('editRoleForm')?.addEventListener('submit', function (e) {
    e.preventDefault();
    showSaveIndicator('profileSaveOk');
    closeModal('editRoleModal');
});

// ========== EDIT CATEGORY MODAL ==========
function openEditCategoryModal() {
    openModal('editCategoryModal');
}

document.getElementById('editCategoryForm')?.addEventListener('submit', function (e) {
    e.preventDefault();
    showSaveIndicator('profileSaveOk');
    closeModal('editCategoryModal');
});
document.querySelectorAll('.pd-thumb').forEach(thumb => {
    thumb.addEventListener('click', () => {
        document.querySelectorAll('.pd-thumb').forEach(t => t.classList.remove('active'));
        thumb.classList.add('active');
        document.getElementById('pdMainImgEl').src = thumb.dataset.src;
    });
});

// Quantity
function changeQty(delta) {
    const el = document.getElementById('pdQty');
    let v = Math.max(1, parseInt(el.textContent) + delta);
    el.textContent = v;
}

// Color select
function selectColor(btn) {
    document.querySelectorAll('.pd-color-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    document.getElementById('colorLabel').textContent = btn.dataset.label;
}

// Size select
function selectSize(btn) {
    document.querySelectorAll('.pd-size-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    document.getElementById('sizeLabel').textContent = btn.dataset.label;
}


// OTP input tự động nhảy ô
document.querySelectorAll('.otp-digit').forEach((input, index, inputs) => {
    input.addEventListener('input', function () {
        this.value = this.value.replace(/[^0-9]/g, '');
        if (this.value && index < inputs.length - 1) {
            inputs[index + 1].focus();
        }
    });
    input.addEventListener('keydown', function (e) {
        if (e.key === 'Backspace' && !this.value && index > 0) {
            inputs[index - 1].focus();
        }
    });
    input.addEventListener('paste', function (e) {
        e.preventDefault();
        const paste = (e.clipboardData || window.clipboardData).getData('text');
        const digits = paste.replace(/[^0-9]/g, '').split('').slice(0, 6);
        digits.forEach((digit, i) => {
            if (inputs[i]) inputs[i].value = digit;
        });
        if (digits.length > 0) inputs[Math.min(digits.length, 5)].focus();
    });
});


// Password strength (frontend only - hiển thị)
document.getElementById('password')?.addEventListener('input', function () {
    const pwd = this.value;
    const requirements = {
        reqLength: pwd.length >= 8,
        reqUpper: /[A-Z]/.test(pwd),
        reqLower: /[a-z]/.test(pwd),
        reqNumber: /[0-9]/.test(pwd),
        reqSpecial: /[!@#$%^&*]/.test(pwd)
    };
    Object.keys(requirements).forEach(id => {
        const el = document.getElementById(id);
        el.classList.toggle('valid', requirements[id]);
        el.classList.toggle('invalid', !requirements[id]);
    });
    const validCount = Object.values(requirements).filter(v => v).length;
    const bar = document.getElementById('strengthBar');
    bar.className = 'password-strength-bar ' + (validCount <= 2 ? 'weak' : validCount <= 4 ? 'medium' : 'strong');
});
// Alert time
const alertTime = document.querySelector("[alert-time]");
if (alertTime) {
    let time = alertTime.getAttribute("alert-time");
    time = time ? parseInt(time) : 4000;
    setTimeout(() => {
        alertTime.remove(); // Xóa phần tử khỏi giao diện
    }, time);
}

// Filepond Image
const listFilepondImage = document.querySelectorAll("[filepond-image]");
let filePond = {};
if (listFilepondImage.length > 0) {
    listFilepondImage.forEach(filepondImage => {
        FilePond.registerPlugin(FilePondPluginImagePreview);
        FilePond.registerPlugin(FilePondPluginFileValidateType);

        let files = null;
        const elementImageDefault = filepondImage.closest("[image-default]");
        if (elementImageDefault) {
            const imageDefault = elementImageDefault.getAttribute("image-default");
            if (imageDefault) {
                files = [{
                    source: imageDefault, // Đường dẫn ảnh
                },]
            }
        }

        filePond[filepondImage.name] = FilePond.create(filepondImage, {
            labelIdle: '+',
            files: files
        });
    });
}
// End Filepond Image

// Filepond Image Multi
const listFilepondImageMulti = document.querySelectorAll("[filepond-image-multi]");
let filePondMulti = {};
if (listFilepondImageMulti.length > 0) {
    listFilepondImageMulti.forEach(filepondImage => {
        FilePond.registerPlugin(FilePondPluginImagePreview);
        FilePond.registerPlugin(FilePondPluginFileValidateType);

        let files = null;
        const elementListImageDefault = filepondImage.closest("[list-image-default]");
        if (elementListImageDefault) {
            let listImageDefault = elementListImageDefault.getAttribute("list-image-default");
            if (listImageDefault) {
                listImageDefault = JSON.parse(listImageDefault);
                files = [];
                listImageDefault.forEach(image => {
                    files.push({
                        source: image, // Đường dẫn ảnh
                    });
                })
            }
        }

        filePondMulti[filepondImage.name] = FilePond.create(filepondImage, {
            labelIdle: '+',
            files: files,
        });
    });
}
// Login Form
const loginForm = document.querySelector("#loginForm")
if (loginForm) {
    const validation = new JustValidate("#loginForm");
    validation
        .addField('#email', [{
            rule: 'required',
            errorMessage: 'Vui lòng nhập email của bạn!',
        },
        {
            rule: 'email',
            errorMessage: 'Email không đúng định dạng!',
        },
        ])
        .addField('#password', [{
            rule: 'required',
            errorMessage: 'Vui lòng nhập mật khẩu!',
        },
        {
            validator: (value) => value.length >= 8,
            errorMessage: 'Mật khẩu phải chứa ít nhất 8 ký tự!',
        },
        {
            validator: (value) => /[A-Z]/.test(value),
            errorMessage: 'Mật khẩu phải chứa ít nhất một chữ cái in hoa!',
        },
        {
            validator: (value) => /[a-z]/.test(value),
            errorMessage: 'Mật khẩu phải chứa ít nhất một chữ cái thường!',
        },
        {
            validator: (value) => /\d/.test(value),
            errorMessage: 'Mật khẩu phải chứa ít nhất một chữ số!',
        },
        {
            validator: (value) => /[@$!%*?&]/.test(value),
            errorMessage: 'Mật khẩu phải chứa ít nhất một ký tự đặc biệt!',
        },
        ])
        .onSuccess((event) => {
            const email = event.target.email.value;
            const password = event.target.password.value;
            const rememberPassword = event.target.rememberPassword.checked;
            const dataFinal = {
                email: email,
                password: password,
                rememberPassword
            }
            console.log(dataFinal);
            fetch("/account/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(dataFinal),
            })
                .then(response => response.json())
                .then(data => {
                    if (data.code === "success") {
                        window.location.href = "/home"
                    }
                    if (data.code === "error") {
                        window.location.reload()
                    }
                })
                .catch(error => {
                    console.error("Error:", error);
                });
        })

}
// Register Form
const registerForm = document.querySelector("#registerForm")
if (registerForm) {
    const validation = new JustValidate("#registerForm");
    validation
        .addField('#firstname', [{
            rule: 'required',
            errorMessage: 'Vui lòng nhập tên của bạn!',
        },
        {
            validator: (value) => value.length >= 2,
            errorMessage: 'Tên phải chứa ít nhất 2 ký tự!',
        },
        ])
        .addField('#lastname', [{
            rule: 'required',
            errorMessage: 'Vui lòng nhập họ của bạn!',
        },
        {
            validator: (value) => value.length >= 2,
            errorMessage: 'Họ phải chứa ít nhất 2 ký tự!',
        },
        ])
        .addField('#email', [{
            rule: 'required',
            errorMessage: 'Vui lòng nhập email của bạn!',
        },
        {
            rule: 'email',
            errorMessage: 'Email không đúng định dạng!',
        },
        ])
        .addField('#phone', [{
            rule: 'required',
            errorMessage: 'Vui lòng nhập số điện thoại của bạn!',
        },
        {
            validator: (value) => value.length >= 10,
            errorMessage: 'Số điện thoại phải chứa ít nhất 10 ký tự!',
        },
        {
            validator: (value) => value.length <= 11,
            errorMessage: 'Số điện thoại phải chứa tối đa 11 ký tự!',
        },
        {
            validator: (value) => /^0[0-9]{9}$/.test(value),
            errorMessage: 'Số điện thoại không đúng định dạng!',
        },
        ])
        .addField('#password', [{
            rule: 'required',
            errorMessage: 'Vui lòng nhập mật khẩu của bạn!',
        },
        {
            validator: (value) => value.length >= 8,
            errorMessage: 'Mật khẩu phải chứa ít nhất 8 ký tự!',
        },
        {
            validator: (value) => /[A-Z]/.test(value),
            errorMessage: 'Mật khẩu phải chứa ít nhất một chữ cái in hoa!',
        },
        {
            validator: (value) => /[a-z]/.test(value),
            errorMessage: 'Mật khẩu phải chứa ít nhất một chữ cái thường!',
        },
        {
            validator: (value) => /\d/.test(value),
            errorMessage: 'Mật khẩu phải chứa ít nhất một chữ số!',
        },
        {
            validator: (value) => /[@$!%*?&]/.test(value),
            errorMessage: 'Mật khẩu phải chứa ít nhất một ký tự đặc biệt!',
        },
        ])
        .addField('#confirmPassword', [{
            rule: 'required',
            errorMessage: 'Vui lòng nhập lại mật khẩu của bạn!',
        },
        {
            validator: (value) => value === document.querySelector("#password").value,
            errorMessage: 'Mật khẩu không khớp!',
        },
        ])
        .addField('input[type="checkbox"]', [{
            rule: 'required',
            errorMessage: 'Bạn phải đồng ý với điều khoản và điều kiện!',
        }])
        .onSuccess((event) => {
            const firstName = event.target.firstname.value;
            const lastName = event.target.lastname.value;
            const email = event.target.email.value;
            const phone = event.target.phone.value;
            const password = event.target.password.value;
            const confirmPassword = event.target.confirmPassword.value;
            const dataFinal = {
                firstName: firstName,
                lastName: lastName,
                email: email,
                phone: phone,
                password: password,
                confirmPassword: confirmPassword
            }
            console.log(dataFinal);
            fetch("/account/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(dataFinal),
            })
                .then(response => response.json())
                .then(data => {
                    if (data.code == "success") {
                        window.location.href = "/account/login"
                    }
                    if (data.code == "error") {

                        window.location.reload();
                    }
                })
                .catch(error => {
                    console.error("Error:", error);
                });
        })

}
// forgot password form
const forgotPasswordForm = document.querySelector("#forgotPasswordForm")
if (forgotPasswordForm) {
    const validation = new JustValidate("#forgotPasswordForm");
    validation
        .addField('#email', [{
            rule: 'required',
            errorMessage: 'Vui lòng nhập email của bạn!',
        },
        {
            rule: 'email',
            errorMessage: 'Email không đúng định dạng!',
        },
        ])
        .onSuccess((event) => {
            const email = event.target.email.value;
            const dataFinal = {
                email: email,
            }
            console.log(dataFinal);
            fetch("/account/forgot-password", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(dataFinal),
            })
                .then(response => response.json())
                .then(data => {
                    if (data.code == "success") {
                        window.location.href = `/account/otp-password?email=${email}`
                    }
                    if (data.code == "error") {

                        window.location.reload();
                    }
                })
                .catch(error => {
                    console.error("Error:", error);
                });
        })

}
const otpPasswordForm = document.querySelector("#otpPasswordForm");

if (otpPasswordForm) {
    const validation = new JustValidate("#otpPasswordForm");

    const countdownBlock = document.querySelector("#otp-countdown");
    const countdownEl = document.querySelector("#countdown-time");

    const otpInputs = document.querySelectorAll(".otp-digit");
    const otpHidden = document.querySelector("#otp");

    /* ================== COUNTDOWN ================== */
    if (countdownBlock && countdownEl) {
        let timeLeft = 300;

        const interval = setInterval(() => {
            timeLeft--;

            const minutes = Math.floor(timeLeft / 60);
            const seconds = String(timeLeft % 60).padStart(2, "0");
            countdownEl.textContent = `${minutes}:${seconds}`;

            if (timeLeft <= 10) {
                countdownBlock.classList.add("warning");
            }

            if (timeLeft <= 0) {
                clearInterval(interval);
                countdownEl.textContent = "Hết hạn";
                countdownBlock.classList.remove("warning");
                otpPasswordForm.querySelector(".btn-gold").disabled = true;
            }
        }, 1000);
    }

    /* ================== HANDLE OTP ================== */

    function updateOTP() {
        let otp = "";
        otpInputs.forEach(i => otp += i.value);
        otpHidden.value = otp;

        validation.revalidateField('#otp');
    }

    otpInputs.forEach((input, index) => {
        // chỉ cho nhập số + 1 ký tự
        input.addEventListener("input", () => {
            input.value = input.value.replace(/\D/g, "").slice(-1);

            if (input.value && index < otpInputs.length - 1) {
                otpInputs[index + 1].focus();
            }

            updateOTP();
        });

        // backspace quay lại ô trước
        input.addEventListener("keydown", (e) => {
            if (e.key === "Backspace" && !input.value && index > 0) {
                otpInputs[index - 1].focus();
            }
        });
    });

    // paste OTP
    otpInputs[0].addEventListener("paste", (e) => {
        e.preventDefault();

        const paste = e.clipboardData
            .getData("text")
            .replace(/\D/g, "")
            .slice(0, 6);

        otpInputs.forEach((input, i) => {
            input.value = paste[i] || "";
        });

        updateOTP();
    });

    // focus ô đầu
    otpInputs[0].focus();

    /* ================== VALIDATION ================== */

    validation
        .addField('#otp', [
            {
                rule: 'required',
                errorMessage: 'Vui lòng nhập mã OTP!'
            },
            {
                validator: (value) => /^\d{6}$/.test(value),
                errorMessage: 'OTP phải đủ 6 chữ số!'
            }
        ])
        .onSuccess((event) => {
            event.preventDefault();

            const otp = otpHidden.value;
            const urlParams = new URLSearchParams(window.location.search);
            const email = urlParams.get("email");

            fetch("/account/otp-password", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ otp, email }),
            })
                .then(res => res.json())
                .then(data => {
                    if (data.code === "success") {
                        window.location.href = `/account/resetpass?email=${email}`;
                    }
                    if (data.code === "error") {
                        window.location.reload();
                    }
                })
                .catch(err => console.error(err));
        });
}
//Reset password
const resetPasswordForm = document.querySelector("#resetPasswordForm");
if (resetPasswordForm) {
    const validation = new JustValidate("#resetPasswordForm");
    validation
        .addField('#newPassword', [
            {
                rule: 'required',
                errorMessage: 'Vui lòng nhập mật khẩu mới!',
            },
            {
                rule: 'password',
                errorMessage: 'Mật khẩu không đúng định dạng!',
            },
        ])
        .addField('#confirmPassword', [
            {
                rule: 'required',
                errorMessage: 'Vui lòng nhập lại mật khẩu mới!',
            },
            {
                validator: (value) => value === document.querySelector("#newPassword").value,
                errorMessage: 'Mật khẩu không khớp!',
            },
        ])
        .onSuccess((event) => {
            event.preventDefault();

            const newPassword = event.target.newPassword.value;
            const confirmPassword = event.target.confirmPassword.value;
            const urlParams = new URLSearchParams(window.location.search);
            const email = urlParams.get("email");

            fetch(`/account/resetpass/${email}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ newPassword, email }),
            })
                .then(res => res.json())
                .then(data => {
                    if (data.code === "success") {
                        window.location.href = "/account/login";
                    }
                    if (data.code === "error") {
                        window.location.reload();
                    }
                })
                .catch(err => console.error(err));
        });
}
// ===== Google Login =====
const googleLogin = document.querySelector(".google-login-wrapper");

if (googleLogin) {
    window.handleCredentialResponse = (response) => {
        const dataFinal = {
            token: response.credential
        }

        fetch(`/account/login-google`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            credentials: "include",
            body: JSON.stringify(dataFinal)
        })
            .then(res => res.json())
            .then(data => {
                if (data.code == "error") {
                    window.location.reload();
                }

                if (data.code == "success") {
                    window.location.href = `/home`;
                }
            })
            .catch(err => {
                console.error("Lỗi Google Login:", err);
            });
    };

}
// Add Categories 
const categoryCreate = document.querySelector("#category-create-form")
if (categoryCreate) {
    const validation = new JustValidate("#category-create-form")
    validation
        .addField('#name', [{
            rule: "required",
            errorMessage: 'Vui lòng nhập tên danh mục'
        }])
        .onSuccess((event) => {
            event.preventDefault();
            const name = event.target.name.value
            const status = event.target.status.value
            const description = event.target.description.value
            const avatars = filePond.avatar.getFiles()
            let avatar = null
            if (avatars.length > 0) {
                avatar = avatars[0].file
            }
            const formData = new FormData()
            formData.append("name", name),
                formData.append("status", status)
            formData.append("description", description)
            formData.append("avatar", avatar)

            fetch('/admin/categories/add', {
                method: "POST",
                body: formData
            })
                .then(res => res.json())
                .then(data => {
                    if (data.code == "error") {
                        window.location.reload();
                    }

                    if (data.code == "success") {
                        window.location.href = `/admin/categories`;
                    }

                })
        })
}