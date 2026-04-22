/* ============================================
   OH!DECOR – MAIN JAVASCRIPT
   ============================================ */

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
function openModal(id) {
    document.getElementById(id)?.classList.add('open');
}
function closeModal(id) {
    document.getElementById(id)?.classList.remove('open');
}
document.querySelectorAll('.modal-backdrop').forEach(backdrop => {
    backdrop.addEventListener('click', e => {
        if (e.target === backdrop) backdrop.classList.remove('open');
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
    setTimeout(() => { window.location.href = 'login.html'; }, 1500);
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

// ========== PRODUCT IMAGE PREVIEW ==========
let productImages = [];
function previewProductImages(event) {
    const files = event.target.files;
    const preview = document.getElementById('productImagePreview');

    // Clear existing preview except the add button
    preview.innerHTML = '';

    Array.from(files).forEach((file, index) => {
        const reader = new FileReader();
        reader.onload = function (e) {
            const div = document.createElement('div');
            div.style.cssText = 'position:relative;width:80px;height:80px;border-radius:var(--radius-md);overflow:hidden;flex-shrink:0;';
            div.innerHTML = `
            <img src="${e.target.result}" style="width:100%;height:100%;object-fit:cover;" />
            <button type="button" onclick="this.parentElement.remove();productImages.splice(${productImages.length},1);" style="position:absolute;top:2px;right:2px;width:20px;height:20px;background:rgba(0,0,0,0.6);border:none;border-radius:50%;color:white;font-size:12px;cursor:pointer;display:flex;align-items:center;justify-content:center;">×</button>
            ${index === 0 ? '<span style="position:absolute;bottom:0;left:0;right:0;background:var(--accent);color:var(--primary-dark);font-size:0.65rem;font-weight:700;padding:2px;text-align:center;">Chính</span>' : ''}
          `;
            preview.appendChild(div);
            productImages.push(e.target.result);
        };
        reader.readAsDataURL(file);
    });
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

// Tabs
function switchTab(id, btn) {
    document.querySelectorAll('.tab-pane').forEach(p => p.classList.remove('active'));
    document.querySelectorAll('.tab-nav-btn').forEach(b => b.classList.remove('active'));
    document.getElementById('tab-' + id).classList.add('active');
    btn.classList.add('active');
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
            fetch("account/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(dataFinal),
            })
                .then(response => response.json())
                .then(data => {
                    if (data.code = "success") {
                        window.location.href = "/home"
                    }
                    if (data.code = "error") {
                        alert(data.message)
                    }
                })
                .catch(error => {
                    console.error("Error:", error);
                });
        })

}
