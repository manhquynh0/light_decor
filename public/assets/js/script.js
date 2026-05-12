

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

    // ========== FILTER ACCORDIONS ==========
    const filterAccordions = document.querySelectorAll('.filter-accordion');
    filterAccordions.forEach(accordion => {
        const header = accordion.querySelector('.filter-accordion-header');
        header?.addEventListener('click', () => {
            accordion.classList.toggle('active');
        });
    });

    // Space Tags Selection
    const spaceTags = document.querySelectorAll('.space-tag');
    spaceTags.forEach(tag => {
        tag.addEventListener('click', () => {
            tag.classList.toggle('active');
        });
    });



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
            if (btn.textContent.trim() === '-') qty = Math.max(1, qty - 1);
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

    // ========== PRICE RANGE SLIDER ==========
    const minSlider = document.getElementById('minSlider');
    const maxSlider = document.getElementById('maxSlider');
    const minDisplay = document.getElementById('minDisplay');
    const maxDisplay = document.getElementById('maxDisplay');
    const fill = document.getElementById('fill');

    if (minSlider && maxSlider && minDisplay && maxDisplay && fill) {
        function updateRange() {
            let minVal = parseInt(minSlider.value);
            let maxVal = parseInt(maxSlider.value);

            // Update displays
            minDisplay.textContent = minVal.toLocaleString('vi-VN') + 'đ';
            maxDisplay.textContent = maxVal.toLocaleString('vi-VN') + 'đ';

            // Update fill position
            const minPercent = (minVal / minSlider.max) * 100;
            const maxPercent = (maxVal / maxSlider.max) * 100;

            fill.style.left = minPercent + '%';
            fill.style.width = (maxPercent - minPercent) + '%';
        }

        minSlider.addEventListener('input', () => {
            if (parseInt(minSlider.value) > parseInt(maxSlider.value)) {
                minSlider.value = maxSlider.value;
            }
            updateRange();
        });

        maxSlider.addEventListener('input', () => {
            if (parseInt(maxSlider.value) < parseInt(minSlider.value)) {
                maxSlider.value = minSlider.value;
            }
            updateRange();
        });

        // Trigger on release
        const handleFilterChange = () => {
            const url = new URL(window.location.href);
            url.searchParams.set('priceMin', minSlider.value);
            url.searchParams.set('priceMax', maxSlider.value);
            // window.location.href = url.href; 
        };

        minSlider.addEventListener('change', handleFilterChange);
        maxSlider.addEventListener('change', handleFilterChange);

        // Initial call
        updateRange();
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

    if (modal) {
        modal.classList.add('open');
        if (url) {
            // Để chèn lưu URL khi sắp đổi URL
            previousUrl = window.location.pathname;
            history.pushState({ modal: id }, '', url);
        }
    } else if (url) {
        // Modal không có trong DOM -> chuyển trang để server render
        window.location.href = url;
    }
}

function closeModal(id) {
    const modal = document.getElementById(id);
    modal?.classList.remove('open');
    // Để quay lại URL trước đó
    if (previousUrl && previousUrl !== window.location.pathname) {
        // URL đã thay đổi qua pushState -> pushState lại
        history.pushState({}, '', previousUrl);
    } else {
        // Trang load trực tiếp (full navigation) -> chuyển về trang list
        const basePath = window.location.pathname.replace(/\/(edit|add|detail)(\/.*)?$/, '');
        window.location.href = basePath;
    }
}

// click ra ngoài để đóng
document.querySelectorAll('.modal-backdrop').forEach(backdrop => {
    backdrop.addEventListener('click', e => {
        if (e.target === backdrop) {
            backdrop.classList.remove('open');
            if (previousUrl && previousUrl !== window.location.pathname) {
                history.pushState({}, '', previousUrl);
            } else {
                const basePath = window.location.pathname.replace(/\/(edit|add|detail)(\/.*)?$/, '');
                window.location.href = basePath;
            }
        }
    });
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


// const savedAvatar = localStorage.getItem('userAvatar');
// if (savedAvatar) {
//     const img = document.getElementById('userAvatarImg');
//     const initials = document.getElementById('avatarInitials');
//     img.src = savedAvatar;
//     img.style.display = 'block';
//     initials.style.display = 'none';
// }

// ========== EDIT PRODUCT MODAL ==========
function openEditProductModal() {
    openModal('editProductModal');
}
// ========== EDIT ROLE MODAL ==========
function openEditRoleModal() {
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
const showPageAlert = (message, type = "success") => {

    // Xóa alert cũ nếu có
    const oldAlert = document.querySelector("[alert-time]");

    if (oldAlert) {
        oldAlert.remove();
    }

    // Tạo alert mới
    const alert = document.createElement("div");

    alert.setAttribute("alert-time", "4000");

    alert.className = `alert alert-${type}`;

    alert.innerHTML = message;

    document.body.appendChild(alert);

    // Auto remove
    setTimeout(() => {
        alert.remove();
    }, 4000);
}
document.querySelectorAll("[alert-time]").forEach(alert => {

    const time = parseInt(alert.getAttribute("alert-time")) || 3000;

    setTimeout(() => {

        alert.style.opacity = "0";

        setTimeout(() => {
            alert.remove();
        }, 300);

    }, time);

});
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
                    source: imageDefault,
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
                        source: image,
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
        }
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
            errorMessage: 'Mật khẩu phải chứa ít nhất một ký tự in hoa!',
        },
        {
            validator: (value) => /[a-z]/.test(value),
            errorMessage: 'Mật khẩu phải chứa ít nhất một ký tự thường!',
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
        .addField('#terms', [{
            rule: 'required',
            errorMessage: 'BẠn phải đồng ý với điều khoản và điều kiện!',
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

                        alert(data.message)
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
        .addField('#newPassword', [{
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
const resetPassword = document.querySelector("#resetPassword");
if (resetPassword) {
    const validation = new JustValidate("#resetPassword");
    validation
        .addField('#currentPass', [
            {
                rule: 'required',
                errorMessage: 'Vui lòng nhập mật khẩu hiện tại!',
            },
            {
                rule: 'password',
                errorMessage: 'Mật khẩu không đúng định dạng!',
            },
        ])
        .addField('#newPass', [{
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
        .addField('#confirmPass', [
            {
                rule: 'required',
                errorMessage: 'Vui lòng nhập lại mật khẩu mới!',
            },
            {
                validator: (value) => value === document.querySelector("#confirmPass").value,
                errorMessage: 'Mật khẩu không khớp!',
            },
        ])
        .onSuccess((event) => {
            event.preventDefault();

            const currentPass = event.target.currentPass.value;
            const newPass = event.target.newPass.value;
            const confirmPass = event.target.confirmPass.value;


            fetch(`/account/setting/reset-password`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ currentPass, newPass }),
            })
                .then(res => res.json())
                .then(data => {
                    if (data.code === "success") {
                        window.location.reload();
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
            const parent = event.target.parent.value
            const name = event.target.name.value
            const status = event.target.status.value
            const description = event.target.description.value
            const dataFinal = {
                name: name,
                status: status,
                description: description,
                parent: parent
            }



            fetch('/admin/categories/add', {
                method: "POST",
                body: JSON.stringify(dataFinal),
                headers: {
                    "Content-Type": "application/json",
                },
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
// ADD Product
const productCreate = document.querySelector("#product-create-form")
if (productCreate) {
    const validation = new JustValidate("#product-create-form")
    validation
        .addField('#name', [{
            rule: "required",
            errorMessage: 'Vui lòng nhập tên sản phẩm'
        }])
        .addField('#priceOLD', [{
            rule: "number",
            errorMessage: 'Giá cũ phải là số'
        }])
        .addField('#priceNEW', [{
            rule: "required",
            errorMessage: 'Vui lòng nhập giá mới'
        }, {
            rule: "number",
            errorMessage: 'Giá mới phải là số'
        }])
        .addField('#stock', [{
            rule: "required",
            errorMessage: 'Vui lòng nhập số lượng'
        }, {
            rule: "number",
            errorMessage: 'Số lượng phải là số'
        }])
        .addField('#description', [{
            rule: "required",
            errorMessage: 'Vui lòng nhập mô tả'
        }])
        .addField('#material', [{
            rule: "required",
            errorMessage: 'Vui lòng nhập chất liệu'
        }])
        .addField('#made', [{
            rule: "required",
            errorMessage: 'Vui lòng nhập xuất xứ'
        }])
        .addField('#size', [{
            rule: "required",
            errorMessage: 'Vui lòng nhập kích thước'
        }])
        .addField('#colorIndex', [{
            rule: "required",
            errorMessage: 'Vui lòng nhập chỉ số màu'
        }])
        .addField('#power', [{
            rule: "required",
            errorMessage: 'Vui lòng nhập công suất'
        }])
        .onSuccess((event) => {
            event.preventDefault();
            const name = event.target.name.value
            const description = event.target.description.value
            const status = event.target.status.value
            const priceNEW = event.target.priceNEW.value
            const priceOLD = event.target.priceOLD.value
            const stock = event.target.stock.value
            const material = event.target.material.value
            const made = event.target.made.value
            const size = event.target.size.value
            const colorIndex = event.target.colorIndex.value
            const power = event.target.power.value
            const categoryCheckboxes = event.target.querySelectorAll('input[name="category"]:checked');
            const categories = Array.from(categoryCheckboxes).map(cb => cb.value);

            const avatarInput = event.target.querySelector('#avatar')
            const avatarPond = filePond.avatar
            const avatars = avatarPond ? avatarPond.getFiles() : []

            const formData = new FormData()
            const imageFiles = (filePondMulti.images?.getFiles?.() || []).filter(item => item.file);
            if (imageFiles.length > 0) {
                imageFiles.forEach(item => {
                    formData.append("images", item.file);
                })
            }
            formData.append("priceOLD", priceOLD)
            formData.append("priceNEW", priceNEW)
            formData.append("stock", stock)
            formData.append("material", material)
            formData.append("made", made)
            formData.append("size", size)
            formData.append("colorIndex", colorIndex)
            formData.append("power", power)
            categories.forEach(id => {
                formData.append("category", id);
            });

            formData.append("name", name)
            formData.append("status", status)
            formData.append("description", description)
            let avatar = avatarInput?.files?.[0] || null
            if (avatars.length > 0 && avatars[0].file) {
                avatar = avatars[0].file
            }

            if (avatar) {
                formData.append("avatar", avatar)
            }


            fetch('/admin/products/add', {
                method: "POST",
                body: formData
            })
                .then(res => res.json())
                .then(data => {
                    if (data.code == "error") {
                        window.location.reload();
                    }

                    if (data.code == "success") {
                        showPageAlert("Thêm thành công", "success")
                    }

                })
        })
}
// ADD USERS
const userCreate = document.querySelector("#user-create-form")
if (userCreate) {
    const validation = new JustValidate("#user-create-form")
    validation
        .addField('#firstname', [{
            rule: "required",
            errorMessage: 'Vui lòng nhập tên'
        }])
        .addField('#lastname', [{
            rule: "required",
            errorMessage: 'Vui lòng nhập họ'
        }])
        .addField('#phone', [{
            rule: "required",
            errorMessage: 'Vui lòng nhập số điện thoại'
        }, {
            rule: "minLength",
            value: 10,
            errorMessage: 'Số điện thoại phải có ít nhất 10 số'
        }, {
            rule: "maxLength",
            value: 11,
            errorMessage: 'Số điện thoại phải có nhiều nhất 11 số'
        }])
        .addField('#email', [{
            rule: "required",
            errorMessage: 'Vui lòng nhập email'
        }, {
            rule: "email",
            errorMessage: 'Email không đúng định dạng'
        }])
        .addField('#password', [{
            rule: "required",
            errorMessage: 'Vui lòng nhập mật khẩu'
        }])
        .onSuccess((event) => {
            event.preventDefault();
            const firstname = event.target.firstname.value
            const lastname = event.target.lastname.value
            const email = event.target.email.value
            const password = event.target.password.value
            const role = event.target.role.value

            const formData = new FormData()
            formData.append("firstname", firstname)
            formData.append("lastname", lastname)
            formData.append("email", email)
            formData.append("password", password)
            formData.append("role", role)

            const avatarInput = event.target.querySelector('#avatar')
            const avatarPond = filePond.avatar
            const avatars = avatarPond ? avatarPond.getFiles() : []
            let avatar = avatarInput?.files?.[0] || null
            if (avatars.length > 0 && avatars[0].file) {
                avatar = avatars[0].file
            }

            if (avatar) {
                formData.append("avatar", avatar)
            }

            fetch('/admin/users/add', {
                method: "POST",
                body: formData
            })
                .then(res => res.json())
                .then(data => {
                    if (data.code == "error") {
                        window.location.reload();
                    }

                    if (data.code == "success") {
                        window.location.href = `/admin/users`;
                    }

                })
        })
}
// ADD ROLES
const roleCreate = document.querySelector("#role-create-form")
if (roleCreate) {
    const validation = new JustValidate("#role-create-form")
    validation
        .addField('#name', [{
            rule: "required",
            errorMessage: 'Vui lòng nhập tên vai trò'
        }])
        .addField('#description', [{
            rule: "required",
            errorMessage: 'Vui lòng nhập mô tả'
        }])
        .onSuccess((event) => {
            event.preventDefault();
            const name = event.target.name.value
            const description = event.target.description.value
            const permissions = []
            const listPermission = roleCreate.querySelectorAll("input[name='permissions']:checked")
            listPermission.forEach((item) => {
                permissions.push(item.value)
            })

            const dataFinal = {
                name: name,
                description: description,
                permissions: permissions
            };
            console.log(dataFinal)
            fetch('/admin/roles/add', {
                method: "POST",
                body: JSON.stringify(dataFinal),
                headers: {
                    "Content-Type": "application/json",
                },
            })
                .then(res => res.json())
                .then(data => {
                    if (data.code == "error") {
                        window.location.reload();
                    }

                    if (data.code == "success") {
                        window.location.href = `/admin/roles`;
                    }

                })
        })
}
// Edit Category
const categoryEdit = document.querySelector("#category-edit-form")
if (categoryEdit) {
    const validation = new JustValidate("#category-edit-form")
    validation
        .addField('#name', [{
            rule: "required",
            errorMessage: 'Vui lòng nhập tên danh mục'
        }])
        .onSuccess((event) => {
            event.preventDefault();
            const parent = event.target.parent.value
            const id = event.target._id.value
            const name = event.target.name.value
            const description = event.target.description.value
            const status = event.target.status.value

            const dataFinal = {
                name: name,
                description: description,
                status: status,
                parent: parent
            }


            fetch(`/admin/categories/edit/${id}`, {
                method: "PATCH",
                body: JSON.stringify(dataFinal),
                headers: {
                    "Content-Type": "application/json",
                },
            })
                .then(res => res.json())
                .then(data => {
                    if (data.code == "error") {

                        window.location.reload();
                    }

                    if (data.code == "success") {
                        closeModal('editCategoryModal');
                        window.location.reload();
                    }

                })
        })
}

function closeConfirmModal() {
    deleteId = null;
    document.getElementById("confirmModal").classList.remove("open");
}
let deleteUrl = null;

// mở confirm
document.addEventListener("click", function (e) {
    const btn = e.target.closest("[button-delete]"); // tìm nút gần nhất có button-delete
    if (!btn) return;

    deleteUrl = btn.getAttribute("data-url");

    document.getElementById("confirmModal").classList.add("open");
});
// DELETE 
document.getElementById("confirmYes")?.addEventListener("click", () => {
    if (!deleteUrl) return;

    fetch(deleteUrl, {
        method: "PATCH" // hoặc DELETE tùy backend bạn
    })
        .then(res => res.json())
        .then(data => {
            if (data.code === "success") {
                closeConfirmModal();
                window.location.reload();
            } else {
                alert("Xóa thất bại");
            }
        });
});


// Edit USER
const userEdit = document.querySelector("#user-edit-form")
if (userEdit) {
    const validation = new JustValidate("#user-edit-form")
    validation
        .addField('#firstname', [{
            rule: "required",
            errorMessage: 'Vui lòng nhập họ'
        }])
        .addField('#lastname', [{
            rule: "required",
            errorMessage: 'Vui lòng nhập tên'
        }])
        .addField('#email', [{
            rule: "required",
            errorMessage: 'Vui lòng nhập email'
        }])
        .addField('#phone', [{
            rule: "required",
            errorMessage: 'Vui lòng nhập số điện thoại'
        }])
        .onSuccess((event) => {
            event.preventDefault();
            const id = event.target._id.value
            const firstname = event.target.firstname.value
            const lastname = event.target.lastname.value
            const email = event.target.email.value
            const password = event.target.password.value
            const role = event.target.role.value
            const phone = event.target.phone.value

            const formData = new FormData()
            formData.append("firstname", firstname)
            formData.append("lastname", lastname)
            formData.append("email", email)
            formData.append("phone", phone)
            formData.append("password", password)
            formData.append("role", role)

            const avatarInput = event.target.querySelector('#avatar');
            const avatarPond = filePond.avatar;
            const avatars = avatarPond ? avatarPond.getFiles() : [];

            let avatar = null;

            // lấy ảnh từ filepond
            if (avatars.length > 0 && avatars[0].file) {
                avatar = avatars[0].file;

                // check nếu là ảnh cũ thì bỏ
                const wrapper = avatarInput.closest("[image-default]");
                const imageDefault = wrapper?.getAttribute("image-default");

                if (imageDefault && imageDefault.includes(avatar.name)) {
                    avatar = null;
                }
            }

            if (avatar) {
                formData.append("avatar", avatar);
            }

            fetch(`/admin/users/edit/${id}`, {
                method: "PATCH",
                body: formData
            })
                .then(res => res.json())
                .then(data => {
                    if (data.code == "error") {
                        window.location.reload();
                    }

                    if (data.code == "success") {
                        window.location.href = `/admin/users`;
                    }

                })
        })
}
// Edit Product
const productEdit = document.querySelector("#product-edit-form")
if (productEdit) {
    productEdit.addEventListener("submit", (event) => {
        event.preventDefault();
        try {
            const id = event.target._id?.value;
            if (!id) {
                console.error("Không tìm thấy ID sản phẩm");
                return;
            }

            const power = event.target.power?.value || "";
            const made = event.target.made?.value || "";
            const material = event.target.material?.value || "";
            const size = event.target.size?.value || "";
            const colorIndex = event.target.colorIndex?.value || "";
            const name = event.target.name?.value || "";
            const description = event.target.description?.value || "";
            const status = event.target.status?.value || "stock";
            const priceNEW = event.target.priceNEW?.value || "0";
            const priceOLD = event.target.priceOLD?.value || "0";
            const stock = event.target.stock?.value || "0";

            const categoryCheckboxes = event.target.querySelectorAll('input[name="category"]:checked');
            const categories = Array.from(categoryCheckboxes).map(cb => cb.value);

            const formData = new FormData();
            formData.append('name', name);
            formData.append('description', description);
            formData.append('status', status);
            formData.append('power', power);
            formData.append('made', made);
            formData.append('material', material);
            formData.append('size', size);
            formData.append('colorIndex', colorIndex);
            formData.append('priceNEW', priceNEW);
            formData.append('priceOLD', priceOLD);
            formData.append('stock', stock);

            categories.forEach(catId => {
                formData.append('category', catId);
            });

            // Xử lý Avatar
            const avatarPond = filePond.avatar;
            if (avatarPond) {
                const avatars = avatarPond.getFiles();
                if (avatars.length > 0) {
                    const avatarFile = avatars[0].file;
                    const wrapper = event.target.querySelector("[image-default]");
                    const imageDefault = wrapper?.getAttribute("image-default");

                    if (avatarFile instanceof File) {
                        if (!imageDefault || !imageDefault.includes(avatarFile.name)) {
                            formData.append("avatar", avatarFile);
                        }
                    }
                }
            }

            // Xử lý Multi Images
            const imagesPond = filePondMulti.images;
            if (imagesPond) {
                const files = imagesPond.getFiles();
                files.forEach(item => {
                    if (item.file instanceof File) {
                        formData.append("images", item.file);
                    }
                });
            }

            fetch(`/admin/products/edit/${id}`, {
                method: "PATCH",
                body: formData,
            })
                .then(res => res.json())
                .then(data => {
                    if (data.code == "success") {
                        closeModal('editProductModal');
                        window.location.reload();
                    } else {
                        alert("Cập nhật thất bại: " + (data.message || "Lỗi không xác định"));
                    }
                })
                .catch(err => {
                    console.error("Lỗi Fetch:", err);
                    alert("Có lỗi xảy ra khi kết nối với máy chủ.");
                });
        } catch (err) {
            console.error("Lỗi thực thi script:", err);
        }
    })
}
//Edit Role 
const roleEdit = document.querySelector("#role-edit-form")
if (roleEdit) {
    const validation = new JustValidate("#role-edit-form")
    validation
        .addField('#name', [{
            rule: "required",
            errorMessage: 'Vui lòng nhập tên vai trò'
        }])
        .addField('#description', [{
            rule: "required",
            errorMessage: 'Vui lòng nhập mô tả vai trò'
        }])
        .onSuccess((event) => {
            event.preventDefault();
            const id = event.target._id.value
            const name = event.target.name.value
            const description = event.target.description.value
            const permissions = []
            const listPermission = roleEdit.querySelectorAll("input[name='permissions']:checked")
            listPermission.forEach((item) => {
                permissions.push(item.value)
            })

            const dataFinal = {
                name: name,
                description: description,
                permissions: permissions
            };
            console.log(dataFinal)
            fetch(`/admin/roles/edit/${id}`, {
                method: "PATCH",
                body: JSON.stringify(dataFinal),
                headers: {
                    "Content-Type": "application/json",
                },
            })
                .then(res => res.json())
                .then(data => {
                    if (data.code == "error") {
                        window.location.reload();
                    }

                    if (data.code == "success") {
                        window.location.href = `/admin/roles`;
                    }

                })
        })
}
//  Filter Status
const filterStatus = document.querySelector("[filter-status]");
if (filterStatus) {
    const url = new URL(window.location.href);

    // Lắng nghe thay đổi lựa chọn
    filterStatus.addEventListener("change", () => {
        const value = filterStatus.value;
        if (value) {
            url.searchParams.set("status", value);
        } else {
            url.searchParams.delete("status");
        }

        window.location.href = url.href;
    })

    // Hiển thị lựa chọn mặc định
    const valueCurrent = url.searchParams.get("status");
    if (valueCurrent) {
        filterStatus.value = valueCurrent;
    }
}
// Search
const search = document.querySelector("[search]");
if (search) {
    const url = new URL(window.location.href);

    // Lắng nghe phím đang gõ
    search.addEventListener("keyup", (event) => {
        if (event.code == "Enter") {
            const value = search.value;
            if (value) {
                url.searchParams.set("keyword", value.trim());
            } else {
                url.searchParams.delete("keyword");
            }

            window.location.href = url.href;
        }
    })
    const valueCurrent = url.searchParams.get("keyword");
    if (valueCurrent) {
        search.value = valueCurrent;
    }
}

// Filter Role
const filterRole = document.querySelector("[filter-role]");
if (filterRole) {
    const url = new URL(window.location.href);

    // Lắng nghe thay đổi lựa chọn
    filterRole.addEventListener("change", () => {
        const value = filterRole.value;
        if (value) {
            url.searchParams.set("role", value);
        } else {
            url.searchParams.delete("role");
        }

        window.location.href = url.href;
    })

    // Hiển thị lựa chọn mặc định
    const valueCurrent = url.searchParams.get("role");
    if (valueCurrent) {
        filterRole.value = valueCurrent;
    }
}

// Tab Switching (Product Detail)
function switchTab(tabId, btn) {
    // Remove active class from all buttons and panes
    document.querySelectorAll('.tab-nav-btn').forEach(b => b.classList.remove('active'));
    document.querySelectorAll('.tab-pane').forEach(p => p.classList.remove('active'));

    // Add active class to current button and pane
    btn.classList.add('active');
    document.getElementById('tab-' + tabId).classList.add('active');
}
// Pagination
const pagination = document.querySelector("[pagination]");
const prevButton = document.querySelector(".prev-button");
const nextButton = document.querySelector(".next-button");
if (pagination) {
    const url = new URL(window.location.href);
    const valueCurrent = url.searchParams.get("page") || "1";
    const currentPage = parseInt(valueCurrent) || 1;
    const totalPages = parseInt(pagination.dataset.totalPages) || 1;

    // Lắng nghe thay đổi lựa chọn (cho các nút số trang)
    const pageButtons = pagination.querySelectorAll("[button-pagination]");
    pageButtons.forEach(button => {
        button.addEventListener("click", () => {
            const url = new URL(window.location.href);
            const page = button.getAttribute("button-pagination");
            if (page) {
                url.searchParams.set("page", page);
                window.location.href = url.href;
            }
        });
    });


    // Hiển thị lựa chọn mặc định
    pagination.value = currentPage;

    if (prevButton) {
        prevButton.disabled = currentPage <= 1;
        prevButton.addEventListener("click", () => {
            const url = new URL(window.location.href);
            if (currentPage > 1) {
                url.searchParams.set("page", currentPage - 1);
                window.location.href = url.href;
            }
        })

    }

    if (nextButton) {
        nextButton.disabled = currentPage >= totalPages;
        nextButton.addEventListener("click", () => {
            const url = new URL(window.location.href);
            if (currentPage < totalPages) {
                url.searchParams.set("page", currentPage + 1);
                window.location.href = url.href;
            }
        })

    }
}
const filterPrice = document.querySelector("[filter-price]")
if (filterPrice) {
    const url = new URL(window.location.href)
    filterPrice.addEventListener("change", () => {
        const value = filterPrice.value
        if (value) {
            url.searchParams.set("sort", value);


        } else {
            url.searchParams.delete("sort");

        }
        window.location.href = url.href;
    })

    // set lại value khi reload
    const currentSortValue = url.searchParams.get("sort");
    if (currentSortValue) {
        filterPrice.value = currentSortValue;
    }
}



// Filter Price
const minSlider = document.querySelector("#minSlider");
const maxSlider = document.querySelector("#maxSlider");

const minDisplay = document.querySelector("#minDisplay");
const maxDisplay = document.querySelector("#maxDisplay");

const fill = document.querySelector("#fill");

const productList = document.querySelector(".products-list-grid");

if (
    minSlider &&
    maxSlider &&
    minDisplay &&
    maxDisplay &&
    fill &&
    productList
) {

    const maxValue = Number(minSlider.max);

    // format tiền
    const formatPrice = (value) => {
        return Number(value).toLocaleString("vi-VN") + "đ";
    };

    // update text + fill
    const updateDisplay = () => {

        let min = Number(minSlider.value);
        let max = Number(maxSlider.value);

        // fix min > max
        if (min > max) {
            [min, max] = [max, min];
        }

        // text
        minDisplay.textContent = formatPrice(min);
        maxDisplay.textContent = formatPrice(max);

        // fill %
        const left = (min / maxValue) * 100;
        const right = (max / maxValue) * 100;

        fill.style.left = `${left}%`;
        fill.style.width = `${right - left}%`;
    };

    // render products
    const renderProducts = (data) => {
        const { products, pagination } = data;

        // Cập nhật số lượng tổng
        const totalProductsEl = document.querySelector("#totalProducts");
        if (totalProductsEl) {
            totalProductsEl.textContent = pagination.totalRecord;
        }

        // Cập nhật danh sách sản phẩm
        productList.innerHTML = products.map(item => `
            <article class="prod-card">
                <a class="prod-img-wrap" href="/products/${item.slug}">
                    <img src="${item.avatar}" alt="${item.name}">
                    <span class="prod-badge">
                        - ${(() => {
                const oldPrice = Number(String(item.priceOLD).replace(/\./g, ""));
                const newPrice = Number(String(item.priceNEW).replace(/\./g, ""));
                return oldPrice > 0 ? Math.floor(((oldPrice - newPrice) / oldPrice) * 100) : 0;
            })()}%
                    </span>

                    <div class="prod-overlay">
                        <button class="quick-add">Thêm giỏ hàng</button>
                    </div>
                </a>
                <div class="prod-body">
                    <h3 class="prod-name">
                        <a href="/products/${item.slug}">${item.name}</a>
                    </h3>
                    <div class="prod-price">
                        <span class="price-old">${Number(String(item.priceOLD).replace(/\./g, "")).toLocaleString("vi-VN")} ₫</span>
                        <span class="price-new">${Number(String(item.priceNEW).replace(/\./g, "")).toLocaleString("vi-VN")} ₫</span>
                    </div>

                    <div class="prod-stars">★★★★★</div>
                </div>
            </article>
        `).join("");

        // Cập nhật phân trang
        const paginationContainer = document.querySelector("#paginationContainer");
        if (paginationContainer && pagination.totalPage > 1) {
            let paginationHtml = `
                <div class="pagination" data-total-pages="${pagination.totalPage}">
                    <button class="page-btn prev-button" ${pagination.currentPage <= 1 ? "disabled" : ""}>‹</button>
            `;

            for (let i = 1; i <= pagination.totalPage; i++) {
                paginationHtml += `
                    <button class="page-btn ${pagination.currentPage === i ? "active" : ""}" button-pagination="${i}">${i}</button>
                `;
            }

            paginationHtml += `
                    <button class="page-btn next-button" ${pagination.currentPage >= pagination.totalPage ? "disabled" : ""}>›</button>
                </div>
                <div class="inner-wrap" style="display:flex;justify-content:center;margin-top:1rem;">
                    Hiển thị ${pagination.skip + 1} - ${pagination.skip + products.length} của ${pagination.totalRecord}
                </div>
            `;
            paginationContainer.innerHTML = paginationHtml;

            // Gắn lại sự kiện cho các nút phân trang mới
            initPagination(paginationContainer);
        } else if (paginationContainer) {
            paginationContainer.innerHTML = "";
        }
    };

    // Hàm khởi tạo sự kiện phân trang
    const initPagination = (container) => {
        const url = new URL(window.location.href);
        const prevBtn = container.querySelector(".prev-button");
        const nextBtn = container.querySelector(".next-button");
        const pageBtns = container.querySelectorAll("[button-pagination]");
        const totalPages = parseInt(container.querySelector(".pagination")?.dataset.totalPages || 1);
        const currentPage = parseInt(url.searchParams.get("page") || 1);

        pageBtns.forEach(btn => {
            btn.addEventListener("click", () => {
                url.searchParams.set("page", btn.getAttribute("button-pagination"));
                window.location.href = url.href;
            });
        });

        if (prevBtn) {
            prevBtn.addEventListener("click", () => {
                if (currentPage > 1) {
                    url.searchParams.set("page", currentPage - 1);
                    window.location.href = url.href;
                }
            });
        }

        if (nextBtn) {
            nextBtn.addEventListener("click", () => {
                if (currentPage < totalPages) {
                    url.searchParams.set("page", currentPage + 1);
                    window.location.href = url.href;
                }
            });
        }
    };

    // fetch products
    const filterProducts = async () => {

        let min = Number(minSlider.value);
        let max = Number(maxSlider.value);

        if (min > max) {
            [min, max] = [max, min];
        }

        // update URL không reload
        const url = new URL(window.location.href);

        url.searchParams.set("priceMin", min);
        url.searchParams.set("priceMax", max);
        url.searchParams.set("page", 1);


        history.replaceState({}, "", url);

        try {

            const response = await fetch(
                url.pathname + url.search,
                {
                    headers: {
                        "Accept": "application/json",
                    },
                }
            );





            const products = await response.json();

            renderProducts(products);

        } catch (error) {

            console.error("Lỗi filter:", error);

        }
    };

    // events
    [minSlider, maxSlider].forEach(slider => {
        slider.addEventListener("input", updateDisplay);
        slider.addEventListener("change", filterProducts);
    });

    // init
    const urlInit = new URL(window.location.href);
    const valueCurrentMin = urlInit.searchParams.get("priceMin");
    const valueCurrentMax = urlInit.searchParams.get("priceMax");
    if (valueCurrentMin !== null) minSlider.value = valueCurrentMin;
    if (valueCurrentMax !== null) maxSlider.value = valueCurrentMax;

    updateDisplay();

    // Khởi tạo phân trang cho lần đầu tải trang
    const initialPaginationContainer = document.querySelector("#paginationContainer");
    if (initialPaginationContainer) {
        initPagination(initialPaginationContainer);
    }
}



// Filter Status (Radio Buttons Legacy)
const listStatus = document.querySelectorAll("input[type='radio'][name='status']");
if (listStatus.length > 0) {
    const url = new URL(window.location.href);
    listStatus.forEach(radio => {
        radio.addEventListener("change", () => {
            const value = radio.value;
            if (value) {
                url.searchParams.set("status", value);
            } else {
                url.searchParams.delete("status");
            }
            window.location.href = url.href;
        });
    });

    // set lại value khi reload
    const statusCurrent = url.searchParams.get("status") || "";
    const activeRadio = document.querySelector(`[name='status'][value='${statusCurrent}']`);
    if (activeRadio) {
        activeRadio.checked = true;
    }
}
const filterReset = document.querySelector("[filter-reset]");
if (filterReset) {
    const url = new URL(window.location.href);

    filterReset.addEventListener("click", () => {
        url.search = "";
        window.location.href = url.href;
    })
}
// Cart


// Produc Detail
const quantity = document.querySelector("#pdQty")
if (quantity) {
    quantity.addEventListener("change", () => {
        drawProductDetail()
    })
}
const drawProductDetail = () => {
    // lấy số lượng và giá tiền
    const quantity = parseInt(document.querySelector("#pdQty").innerHTML)
    const price = parseInt(document.querySelector("#pdPrice").innerHTML)
    const totalPrice = parseInt(quantity || 0) * parseInt(price || 0)
    document.querySelector("#pdTotalPrice").innerHTML = totalPrice.toLocaleString('vi-VN')
}
// ADD TO CART
const btnsAddToCart = document.querySelectorAll(".btn-add-cart")
if (btnsAddToCart.length > 0) {
    btnsAddToCart.forEach(btn => {
        btn.addEventListener("click", (e) => {
            e.preventDefault();
            const productId = btn.getAttribute("product-id")
            const qtyEl = document.querySelector("#pdQty");
            const quantity = qtyEl ? parseInt(qtyEl.innerHTML) : 1;

            const priceTextEl = document.querySelector(".pd-price-new");
            const priceText = priceTextEl ? priceTextEl.innerHTML : "0";
            const price = parseInt(
                priceText.replace(/\./g, "").replace("₫", "").trim()
            );

            if (quantity > 0) {
                const cartItem = {
                    productId,
                    quantity,
                    price,
                    totalPrice: quantity * price,
                    checked: true
                }
                let currentCart = JSON.parse(localStorage.getItem("cart") || "[]");

                const existingItem = currentCart.find(item => item.productId === productId);
                if (existingItem) {
                    existingItem.quantity += quantity;
                    existingItem.totalPrice = existingItem.quantity * existingItem.price;
                } else {
                    currentCart.push(cartItem);
                }

                localStorage.setItem("cart", JSON.stringify(currentCart));
                showPageAlert("Thêm vào giỏ hàng thành công!", "success");

                // Cập nhật số lượng mini cart
                const miniCart = document.querySelector(".cart-count");
                if (miniCart) {
                    miniCart.innerHTML = currentCart.length;
                }

                // Nếu là nút "Mua ngay" (có href="/cart"), chuyển hướng ngay
                if (btn.getAttribute("href") === "/cart") {
                    window.location.href = "/cart";
                }
            }
        })
    })
}
// Initial Cart
const cart = localStorage.getItem("cart")
if (!cart) {
    cart = localStorage.setItem("cart", JSON.stringify([]))
}

// Mini Cart
const miniCart = document.querySelector(".cart-count")
if (miniCart) {
    const cart = localStorage.getItem("cart")
    if (cart) {
        const currentCart = JSON.parse(cart)
        miniCart.innerHTML = currentCart.length
    }
}
// PAGE Cart
const drawCart = () => {
    const cart = JSON.parse(localStorage.getItem("cart") || "[]");
    fetch(`/cart/detail`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(cart),
    })
        .then(response => response.json())
        .then(data => {
            if (data.code == "success") {
                // Đảm bảo tất cả item đều có thuộc tính checked (mặc định true)
                const cartStorage = JSON.parse(localStorage.getItem("cart") || "[]");
                let changed = false;
                data.cart.forEach(item => {
                    const storageItem = cartStorage.find(s => s.productId === item.productId);
                    if (storageItem) {
                        if (storageItem.checked === undefined) {
                            storageItem.checked = true;
                            changed = true;
                        }
                        item.checked = storageItem.checked;
                    } else {
                        item.checked = true;
                    }
                });
                if (changed) {
                    localStorage.setItem("cart", JSON.stringify(cartStorage));
                }

                const htmlCart = data.cart.map(item =>
                    `<div class="cart-row" data-price="${item.price}">
                        <input type="checkbox" ${item.checked ? "checked" : ""} class="cart-item-check" value="${item.productId}" style="cursor:pointer; width:18px; height:18px;" >
                        <div style="display:flex;align-items:center;gap:16px;">
                            <img
                                class="cart-prod-img"
                                src="${item.avatar}"
                                alt="Sofa"
                            >

                            <div>
                                <strong style="display:block;font-size:0.92rem;margin-bottom:4px;">
                                    ${item.name}
                                </strong>

                            </div>
                        </div>

                        <div class="cart-qty" style="justify-content:center;">
                            <button class="qty-btn-minus">-</button>
                            <span class="qty-val">${item.quantity}</span>
                            <button class="qty-btn-plus">+</button>
                        </div>

                        <div style="text-align:center;font-size:0.92rem;font-weight:700;color:var(--accent);">
                            ${Number(item.price).toLocaleString('vi-VN')} ₫
                        </div>

                        <div
                            class="line-total"
                            style="text-align:right;font-size:0.92rem;font-weight:800;color:var(--white);"
                        >
                            ${Number(item.totalPrice).toLocaleString('vi-VN')} ₫
                        </div>

                        <button
                            style="color:var(--text-light);font-size:1.1rem;padding:4px 8px; cursor: pointer;"
                            button-delete-cart
                            productId="${item.productId}"
                        >
                            ×
                        </button>

                    </div>`
                )
                const cartList = document.querySelector("[cart-items]")
                if (cartList) {
                    cartList.innerHTML = htmlCart.join("")
                    // Delete Cart
                    const btnDeleteCart = document.querySelectorAll("[button-delete-cart]")
                    btnDeleteCart.forEach(button => {
                        button.addEventListener("click", () => {
                            console.log("da click")
                            const cart = JSON.parse(localStorage.getItem("cart") || "[]");
                            const productId = button.getAttribute("productId")
                            const indexItem = cart.findIndex(product => product.productId === productId)

                            cart.splice(indexItem, 1)
                            localStorage.setItem("cart", JSON.stringify(cart))
                            drawCart()
                            showPageAlert("Xóa sản phẩm khỏi giỏ hàng thành công!", "success");

                            // Cập nhật số lượng mini cart
                            const miniCart = document.querySelector(".cart-count");
                            if (miniCart) {
                                miniCart.innerHTML = cart.length;
                            }
                        })
                    })

                    const calculateTotal = () => {
                        const rows = document.querySelectorAll('.cart-row[data-price]');
                        let sub = 0;
                        rows.forEach(row => {
                            const checkbox = row.querySelector('.cart-item-check');
                            if (checkbox && checkbox.checked) {
                                const price = parseInt(row.dataset.price || 0, 10);
                                const qty = parseInt(row.querySelector('.qty-val').textContent || 1, 10);
                                sub += price * qty;
                            }
                        });
                        const ship = 150000;
                        const subtotalEl = document.querySelector('.subtotal-val');
                        const totalEl = document.querySelector('.total-val');
                        if (subtotalEl) subtotalEl.textContent = sub.toLocaleString('vi-VN') + ' ₫';
                        if (totalEl) totalEl.textContent = (sub > 0 ? sub + ship : 0).toLocaleString('vi-VN') + ' ₫';
                    };

                    cartList.querySelectorAll('.cart-item-check').forEach(checkbox => {
                        checkbox.addEventListener('change', () => {
                            const productId = checkbox.value;
                            const cart = JSON.parse(localStorage.getItem("cart") || "[]");
                            const item = cart.find(p => p.productId === productId);
                            if (item) {
                                item.checked = checkbox.checked;
                                localStorage.setItem("cart", JSON.stringify(cart));
                            }
                            calculateTotal();
                        });
                        checkbox.addEventListener('change', () => {
                            const checkAll = document.querySelector('.cart-check-all');
                            if (checkAll) {
                                const allChecked = Array.from(cartList.querySelectorAll('.cart-item-check')).every(c => c.checked);
                                checkAll.checked = allChecked;
                            }
                        });
                    });

                    const checkAll = document.querySelector('.cart-check-all');
                    if (checkAll) {
                        checkAll.checked = true;
                        checkAll.addEventListener('change', (e) => {
                            const isChecked = e.target.checked;
                            const cart = JSON.parse(localStorage.getItem("cart") || "[]");

                            cartList.querySelectorAll('.cart-item-check').forEach(cb => {
                                cb.checked = isChecked;
                                const item = cart.find(p => p.productId === cb.value);
                                if (item) item.checked = isChecked;
                            });

                            localStorage.setItem("cart", JSON.stringify(cart));
                            calculateTotal();
                        });
                    }
                    const btnCheckout = document.querySelector("#btn-checkout");
                    if (btnCheckout) {
                        btnCheckout.addEventListener("click", () => {
                            const checkedProductIds = [  // lấy danh sách id các sản phẩm được check
                                ...document.querySelectorAll(".cart-item-check:checked")
                            ].map(item => item.value); // chuyển thành array

                            if (checkedProductIds.length === 0) {
                                showPageAlert("Vui lòng chọn ít nhất một sản phẩm để thanh toán", "error");
                                return;
                            }

                            const cart = JSON.parse(localStorage.getItem("cart") || "[]");
                            const paymentData = cart.filter(item => checkedProductIds.includes(item.productId)); // tìm những id sản phẩm được check trong giỏ hàng

                            localStorage.setItem("payment", JSON.stringify(paymentData));
                            window.location.href = "/cart/payment";
                        });
                    }

                    cartList.querySelectorAll('.cart-qty button').forEach(btn => {
                        btn.addEventListener('click', () => {
                            const row = btn.closest('.cart-row');
                            const qtyEl = row.querySelector('.qty-val');
                            const unitPrice = parseInt(row.dataset.price || 0, 10);
                            const totalEl = row.querySelector('.line-total');
                            let qty = parseInt(qtyEl.textContent, 10);
                            if (btn.textContent.trim() === '-') qty = Math.max(1, qty - 1);
                            else qty += 1;
                            qtyEl.textContent = qty;

                            const newTotalPrice = unitPrice * qty;
                            if (totalEl && unitPrice) {
                                totalEl.textContent = newTotalPrice.toLocaleString('vi-VN') + ' ₫';
                            }
                            calculateTotal();

                            // Update localStorage
                            const checkbox = row.querySelector('.cart-item-check');
                            if (checkbox) {
                                const productId = checkbox.value;
                                const currentCart = JSON.parse(localStorage.getItem("cart") || "[]");
                                const itemIndex = currentCart.findIndex(item => item.productId === productId);
                                if (itemIndex > -1) {
                                    currentCart[itemIndex].quantity = qty;
                                    currentCart[itemIndex].totalPrice = newTotalPrice;
                                    localStorage.setItem("cart", JSON.stringify(currentCart));
                                }
                            }
                        });
                    });
                    calculateTotal();
                }
            }
        })
}

const cartList = document.querySelector("[cart-items]");
if (cartList) {
    drawCart();
}

// Payment Render
const drawPayment = () => {
    const paymentList = document.querySelector(".order-summary");
    if (paymentList) {
        const paymentData = JSON.parse(localStorage.getItem("payment") || "[]");
        if (paymentData.length === 0) {
            paymentList.innerHTML = "<p>Không có sản phẩm nào để thanh toán.</p>";
            return;
        }

        fetch("/cart/payment", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(paymentData)
        })
            .then(res => res.json())
            .then(data => {
                if (data.code === "success") {
                    const htmlPayment = data.ProductPayment.map(item =>
                        `
                        <div style="display:flex;gap:12px;align-items:center;">
                            <img
                                src="${item.avatar}"
                                alt="${item.name}"
                                style="width:56px;height:56px;border-radius:10px;object-fit:cover;flex-shrink:0;"
                            >
                            <div style="flex:1;">
                                <p style="font-size:0.85rem;font-weight:700;margin-bottom:2px;color:var(--white);" class="nameProduct">
                                    ${item.name}
                                </p>
                                <p style="font-size:0.78rem;color:var(--text-light);">
                                    Số lượng: ${item.quantity}
                                </p>
                            </div>
                            <span style="font-size:0.88rem;font-weight:800;color:var(--accent);white-space:nowrap;">
                                ${Number(item.totalPrice).toLocaleString('vi-VN')} ₫
                            </span>
                        </div>
                        `
                    );
                    paymentList.innerHTML = htmlPayment.join("");

                    // Tính lại tổng tiền
                    let subTotal = 0;
                    data.ProductPayment.forEach(item => {
                        subTotal += item.totalPrice;
                    });
                    const ship = 0;

                    // Update UI (Assuming you have class payment-subtotal and payment-total in payment.pug)
                    const subtotalEl = document.querySelector('.payment-subtotal');
                    const totalEl = document.querySelector('.payment-total');
                    if (subtotalEl) subtotalEl.textContent = subTotal.toLocaleString('vi-VN') + ' ₫';
                    if (totalEl) totalEl.textContent = (subTotal > 0 ? subTotal + ship : 0).toLocaleString('vi-VN') + ' ₫';
                }
            });
    }
};
drawPayment();


// Biểu đồ doanh thu
const revenueChart = document.querySelector("#revenue-chart");
if (revenueChart) {
    let chart = null;
    const drawChart = (date) => {
        // Lấy tháng và năm hiện tại
        const currentMonth = date.getMonth() + 1; // getMonth() trả về giá trị từ 0 đến 11, nên cần +1
        const currentYear = date.getFullYear();

        // Tạo một đối tượng Date mới cho tháng trước
        // Nếu hiện tại là tháng 1 thì new Date(currentYear, 0 - 1, 1) sẽ tự động chuyển thành tháng 12 của năm trước.
        const previousMonthDate = new Date(currentYear, date.getMonth() - 1, 1);

        // Lấy tháng và năm từ đối tượng previousMonthDate
        const previousMonth = previousMonthDate.getMonth() + 1;
        const previousYear = previousMonthDate.getFullYear();

        // Lấy ra tổng số ngày
        const daysInMonthCurrent = new Date(currentYear, currentMonth, 0).getDate();
        const daysInMonthPrevious = new Date(previousYear, previousMonth, 0).getDate();
        const days = daysInMonthCurrent > daysInMonthPrevious ? daysInMonthCurrent : daysInMonthPrevious;
        const arrayDay = [];
        for (let i = 1; i <= days; i++) {
            arrayDay.push(i);
        }

        const dataFinal = {
            currentMonth: currentMonth,
            currentYear: currentYear,
            previousMonth: previousMonth,
            previousYear: previousYear,
            arrayDay: arrayDay
        };

        fetch(`/admin/dashboard/revenue-chart`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(dataFinal),
        })
            .then(res => res.json())
            .then(data => {
                if (data.code == "error") {
                    alert(data.message);
                }

                if (data.code == "success") {
                    if (chart) {
                        chart.destroy();
                    }
                    chart = new Chart(revenueChart, {
                        type: 'line',
                        data: {
                            labels: arrayDay,
                            datasets: [
                                {
                                    label: `Tháng ${currentMonth}/${currentYear}`, // Nhãn của dataset
                                    data: data.dataMonthCurrent, // Dữ liệu
                                    borderColor: '#4379EE', // Màu viền
                                    borderWidth: 1.5, // Độ dày của đường
                                },
                                {
                                    label: `Tháng ${previousMonth}/${previousYear}`, // Nhãn của dataset
                                    data: data.dataMonthPrevious, // Dữ liệu
                                    borderColor: '#EF3826', // Màu viền
                                    borderWidth: 1.5, // Độ dày của đường
                                }
                            ]
                        },
                        options: {
                            plugins: {
                                legend: {
                                    position: 'bottom'
                                }
                            },
                            scales: {
                                x: {
                                    title: {
                                        display: true,
                                        text: 'Ngày'
                                    }
                                },
                                y: {
                                    title: {
                                        display: true,
                                        text: 'Doanh thu (VND)'
                                    }
                                }
                            },
                            maintainAspectRatio: false, // Không giữ tỉ lệ khung hình mặc định
                        }
                    });
                }
            })
    }

    // Lấy ngày hiện tại
    const now = new Date();
    drawChart(now);

    const inputMonth = document.querySelector(".chart-head input[type='month']");
    inputMonth.addEventListener("change", () => {
        const value = inputMonth.value;
        drawChart(new Date(value));
    })
}
// Hết Biểu đồ doanh thu
// Information Form
const profileForm = document.querySelector("#profileForm")
if (profileForm) {
    const validation = new JustValidate("#profileForm");
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
        ]).onSuccess((event) => {
            const firstname = event.target.firstname.value;
            const lastname = event.target.lastname.value;
            const email = event.target.email.value;
            const phone = event.target.phone.value;
            const dataFinal = {
                firstname: firstname,
                lastname: lastname,
                email: email,
                phone: phone,


            }
            console.log(dataFinal);
            fetch("/account/setting/information", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(dataFinal),
            })
                .then(response => response.json())
                .then(data => {
                    if (data.code == "success") {
                        window.location.reload()
                    }
                    if (data.code == "error") {

                        window.location.reload()
                    }
                })
                .catch(error => {
                    console.error("Error:", error);
                });
        })
}
// Order Form
const orderForm = document.querySelector("#order-form");
if (orderForm) {
    const validation = new JustValidate("#order-form");
    validation
        .addField('#firstName', [
            {
                rule: 'required',
                errorMessage: 'Vui lòng nhập họ tên!'
            },
            {
                rule: 'minLength',
                value: 4,
                errorMessage: 'Họ tên phải có ít nhất 4 ký tự!',
            },
            {
                rule: 'maxLength',
                value: 50,
                errorMessage: 'Họ tên không được vượt quá 50 ký tự!',
            },
        ])
        .addField('#lastName', [
            {
                rule: 'required',
            },
            {
                rule: 'maxLength',
                value: 50,
                errorMessage: 'Họ tên không được vượt quá 50 ký tự!',
            },
        ])
        .addField('#email', [
            {
                rule: 'required',
                errorMessage: 'Vui lòng nhập email!'
            },
            {
                rule: 'email',
                errorMessage: 'Email không đúng định dạng!',
            },
        ])
        .addField('#phone', [
            {
                rule: 'required',
                errorMessage: 'Vui lòng nhập số điện thoại!'
            },
            {
                rule: 'customRegexp',
                value: /(84|0[3|5|7|8|9])+([0-9]{8})\b/g,
                errorMessage: 'Số điện thoại không đúng định dạng!'
            },
        ])
        .addField('#address', [
            {
                rule: 'required',
                errorMessage: 'Vui lòng nhập địa chỉ!'
            },
            {
                rule: 'minLength',
                value: 5,
                errorMessage: 'Địa chỉ phải có ít nhất 5 ký tự!',
            },
            {
                rule: 'maxLength',
                value: 100,
                errorMessage: 'Địa chỉ không được vượt quá 100 ký tự!',
            },
        ])


        .onSuccess((event) => {
            event.preventDefault();
            const submitBtn = document.querySelector("#submit-order");

            // chặn spam
            submitBtn.disabled = true;
            submitBtn.innerHTML = "Đang xử lý...";
            const firstName = event.target.firstName.value;
            const lastName = event.target.lastName.value;
            const email = event.target.email.value;
            const phone = event.target.phone.value;
            const address = event.target.address.value;
            const note = event.target.note.value;
            const method = document.querySelector('input[name="method"]:checked').value;

            let paymentCart = JSON.parse(localStorage.getItem("payment"));

            if (paymentCart && paymentCart.length > 0) {
                const dataFinal = {
                    firstName: firstName,
                    lastName: lastName,
                    email: email,
                    phone: phone,
                    address: address,
                    note: note,
                    items: paymentCart,
                    method: method,
                };

                if (method !== "bank") {
                    fetch("/cart/order", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify(dataFinal),
                    })
                        .then(res => res.json())
                        .then(data => {
                            if (data.code == "error") {
                                submitBtn.disabled = false;
                                submitBtn.innerHTML = "Đặt hàng ngay";
                                window.location.reload();

                            }
                            if (data.code == "success") {
                                submitBtn.disabled = true;
                                submitBtn.innerHTML = "Đặt hàng thành công";

                                showPageAlert("Đặt hàng thành công!", "success");

                                // Cập nhật lại giỏ hàng chính
                                let cart = JSON.parse(localStorage.getItem("cart") || "[]");
                                cart = cart.filter(item => item.checked == false);
                                localStorage.setItem("cart", JSON.stringify(cart));

                                // Xóa dữ liệu thanh toán tạm thời
                                localStorage.removeItem("payment");

                                // Cập nhật số lượng mini cart
                                const miniCart = document.querySelector(".cart-count");
                                if (miniCart) {
                                    miniCart.innerHTML = cart.length;
                                }

                            }
                        })
                }
                else if (method == "bank") {
                    const myBank = {
                        BANK_ID: "MB",
                        ACCOUNT_NO: "0522115385"
                    }
                    // Bật tắt thông tin chuyển khoản ngân hàng
                    const paymentRadios = document.querySelectorAll('input[name="method"]');
                    const bankInfo = document.getElementById('bank-transfer-info');
                    let isSuccess = false
                    const transferCode = Date.now();
                    const totalEl = document.querySelector(".payment-total");
                    const pricePayment = totalEl ? totalEl.textContent.replace(/[^\d]/g, "") : "0";

                    if (paymentRadios.length > 0 && bankInfo) {
                        const updateBankInfo = () => {
                            if (!totalEl) return;

                            const qrUrl = `https://img.vietqr.io/image/${myBank.BANK_ID}-${myBank.ACCOUNT_NO}-compact.png?amount=${pricePayment}&addInfo=${transferCode}`;

                            const bankHtml = `
            <div style="display:flex; justify-content:space-between; align-items:center; gap:20px; flex-wrap:wrap;">
                <div style="flex:1; min-width:200px;">
                    <p style="margin-bottom:8px; color:var(--text-light); font-size:0.85rem;">
                        Tên chủ tài khoản:
                        <strong style="color:var(--white);">VU MANH QUYNH</strong>
                    </p>
                    <p style="margin-bottom:8px; color:var(--text-light); font-size:0.85rem;">
                        Số tài khoản:
                        <strong style="color:var(--white); font-size:1.1rem;">0522115385</strong>
                    </p>
                    <p style="margin-bottom:8px; color:var(--text-light); font-size:0.85rem;">
                        Ngân hàng:
                        <strong style="color:var(--white);">MB Bank</strong>
                    </p>
                    <p style="margin-bottom:0; color:var(--text-light); font-size:0.85rem;">
                        Số tiền thanh toán:
                        <strong style="color:var(--accent); font-size:1rem;">${Number(pricePayment).toLocaleString("vi-VN")} ₫</strong>
                    </p>
                    <p style="margin-bottom:0; color:var(--text-light); font-size:0.85rem;">
                        Nội dung chuyển khoản: 
                        <strong class ="content" style="color:var(--accent); font-size:1rem;">  ${transferCode}</strong>
                    </p>
                </div>
                <div style="text-align:center;">
                    <img src="${qrUrl}" alt="QR Code" style="width:100%; height:auto; border-radius:8px; border:2px solid var(--border); background:#fff; padding:4px;">
                    <p style="font-size:0.75rem; color:var(--text-light); margin-top:6px; margin-bottom:0;">
                        Quét mã thanh toán
                    </p>
                </div>
            </div>
        
        `;

                            bankInfo.innerHTML = bankHtml;
                        };



                        // Trạng thái ban đầu
                        const initialChecked = document.querySelector('input[name="method"]:checked');
                        if (initialChecked && initialChecked.value === 'bank') {
                            updateBankInfo();
                            bankInfo.style.display = "block";
                        }
                        const interval = setInterval(async () => {

                            const isPaid = await CheckPaid(
                                pricePayment,
                                transferCode
                            );

                            if (isPaid && !isSuccess) {
                                isSuccess = true;
                                clearInterval(interval);

                                // CHỈ KHI THANH TOÁN THÀNH CÔNG
                                // mới tạo order

                                fetch("/cart/order", {
                                    method: "POST",
                                    headers: {
                                        "Content-Type": "application/json",
                                    },
                                    body: JSON.stringify({
                                        ...dataFinal,
                                        transferCode,
                                        status: "paid"
                                    }),
                                })
                                    .then(res => res.json())
                                    .then(data => {

                                        if (data.code == "success") {
                                            submitBtn.disabled = true;
                                            submitBtn.innerHTML = "Thanh toán thành công";
                                            showPageAlert(
                                                "Thanh toán thành công! Xem trạng thái đơn hàng ở lịch sử đơn hàng",
                                                "success"
                                            );

                                            let cart = JSON.parse(localStorage.getItem("cart") || "[]");
                                            cart = cart.filter(item => item.checked == false);
                                            localStorage.setItem("cart", JSON.stringify(cart));

                                            // Xóa dữ liệu thanh toán tạm thời
                                            localStorage.removeItem("payment");

                                            // Cập nhật số lượng mini cart
                                            const miniCart = document.querySelector(".cart-count");
                                            if (miniCart) {
                                                miniCart.innerHTML = cart.length;
                                            }


                                        }

                                    });

                            }

                        }, 1000);

                    }
                }
            }
        });
}



// Filter Category
const filterCategory = document.querySelectorAll(".space-tag");

if (filterCategory.length > 0) {

    // Lấy category hiện tại trên URL
    const currentCategories =
        new URLSearchParams(window.location.search)
            .get("category");

    let selectedCategories = [];

    if (currentCategories) {
        selectedCategories = currentCategories.split(",");
    }

    // Active khi reload
    filterCategory.forEach(tag => {

        const category = tag.dataset.category;

        if (selectedCategories.includes(category)) {
            tag.classList.add("active");
        }

        tag.addEventListener("click", () => {

            tag.classList.toggle("active");

            const activeTags =
                document.querySelectorAll(".space-tag.active");

            const categories = [...activeTags].map(item => {
                return item.dataset.category;
            });

            const url = new URL(window.location.href);

            if (categories.length > 0) {

                url.searchParams.set(
                    "category",
                    categories.join(",")
                );

            } else {

                url.searchParams.delete("category");

            }

            window.location.href = url.href;

        });

    });

}
//  Contact
const contact = document.querySelector("#contact-form");
if (contact) {
    const validation = new JustValidate("#contact-form");
    validation
        .addField('#name', [
            {
                rule: 'required',
                errorMessage: 'Vui lòng nhập họ và tên!'
            },
            {
                rule: 'minLength',
                value: 2,
                errorMessage: 'Họ tên phải có ít nhất 5 ký tự!',
            },
            {
                rule: 'maxLength',
                value: 50,
                errorMessage: 'Họ tên không được vượt quá 50 ký tự!',
            },
        ])
        .addField('#email', [
            {
                rule: 'required',
                errorMessage: 'Vui lòng nhập email!'
            },
            {
                rule: 'email',
                errorMessage: 'Email không đúng định dạng!',
            },
        ])
        .addField('#phone', [
            {
                rule: 'required',
                errorMessage: 'Vui lòng nhập số điện thoại!'
            },
            {
                rule: 'customRegexp',
                value: /(84|0[3|5|7|8|9])+([0-9]{8})\b/g,
                errorMessage: 'Số điện thoại không đúng định dạng!'
            },
        ])



        .onSuccess((event) => {
            event.preventDefault();
            const submitBtn = document.querySelector(".submit-contact");

            // chặn spam

            submitBtn.innerHTML = "Đang xử lý...";
            const name = event.target.name.value;
            const email = event.target.email.value;
            const phone = event.target.phone.value;

            const note = event.target.note.value;
            const option = event.target.option.value;



            const dataFinal = {
                name: name,
                email: email,
                phone: phone,
                note: note,
                option: option,

            };
            fetch("/contact/create", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(dataFinal),
            })
                .then(res => res.json())
                .then(data => {
                    if (data.code == "error") {
                        submitBtn.disabled = false;
                        submitBtn.innerHTML = "Đã Gửi";


                    }
                    if (data.code == "success") {
                        submitBtn.disabled = true;
                        submitBtn.innerHTML = "Gửi thành công";
                        showPageAlert("Gửi thành công! Chúng tôi sẽ liên hệ lại sớm nhất có thể.", "success");


                    }
                })
        })
}


async function CheckPaid(pricePayment, transferCode) {
    try {
        const response = await fetch("https://script.google.com/macros/s/AKfycbxsVeo16PF7qaRl_cHF5s3VhU6EuyjFX5mbBo8_f9aywxOZeQSWh7vInld1SQ0nEgFl/exec");
        const json = await response.json();

        // Google Apps Script trả về { data: [...] } hoặc trực tiếp [...]
        const data = json.data || json;

        if (!Array.isArray(data) || data.length === 0) {
            return false;
        }

        const lastPaid = data[data.length - 1];
        if (!lastPaid) return false;

        const lastPrice = lastPaid["Giá trị"];
        const lastContent = lastPaid["Mô tả"];

        if (
            lastPrice >= pricePayment &&
            String(lastContent).includes(transferCode)
        ) {
            return true;
        }

        return false;

    } catch (error) {
        console.log("Lỗi kiểm tra thanh toán:", error);
        return false;
    }
}
const paymentRadios = document.querySelectorAll(
    'input[name="method"]'
);

paymentRadios.forEach(radio => {

    radio.addEventListener("change", () => {

        paymentRadios.forEach(item => {

            const label = item.closest("label");

            if (!label) return;

            // active
            if (item.checked) {
                label.style.borderColor =
                    "var(--accent)";
                label.style.background =
                    "rgba(212,175,55,0.05)";
                label.style.borderRadius =
                    "var(--radius-md)";

                label.style.transform =
                    "translateY(-2px)";

                label.style.boxShadow =
                    "0 4px 12px rgba(212,175,55,0.15)";

            }

            // normal
            else {

                label.style.borderColor =
                    "var(--border)";

                label.style.background =
                    "transparent";

                label.style.transform =
                    "translateY(0px)";

                label.style.boxShadow =
                    "none";

            }

        });

    });

});
// ========== AI CHAT LOGIC ==========
const initAiChat = () => {
    const aiChatToggle = document.getElementById('aiChatToggle');
    const aiChatWindow = document.getElementById('aiChatWindow');
    const closeChat = document.getElementById('closeChat');
    const aiChatInput = document.getElementById('aiChatInput');
    const aiChatSend = document.getElementById('aiChatSend');
    const aiChatMessages = document.getElementById('aiChatMessages');

    let isHistoryLoaded = false;

    if (aiChatToggle && aiChatWindow) {

        const appendMessage = (role, text) => {
            const cssClass = (role === 'model' || role === 'ai') ? 'ai' : 'user';
            const msgDiv = document.createElement('div');
            msgDiv.className = 'chat-msg ' + cssClass;
            msgDiv.innerHTML = text
                .replace(/\*\*(.*?)\*\*/g, '<strong></strong>')
                .replace(/\*(.*?)\*/g, '<em></em>')
                .replace(/\n/g, '<br>');
            aiChatMessages.appendChild(msgDiv);
            return msgDiv;
        };

        const loadHistory = async () => {
            if (isHistoryLoaded) return;
            const isAdmin = window.location.pathname.startsWith('/admin');
            const endpoint = isAdmin ? "/admin/chat/history" : "/chat/history";

            try {
                const response = await fetch(endpoint);
                const data = await response.json();
                if (data.code === "success" && data.history && data.history.length > 0) {
                    aiChatMessages.innerHTML = '';
                    data.history.forEach(chat => {
                        appendMessage(chat.role, chat.content);
                    });
                    aiChatMessages.scrollTop = aiChatMessages.scrollHeight;
                }
                isHistoryLoaded = true;
            } catch (error) {
                console.error("Lỗi tải lịch sử chat:", error);
            }
        };

        aiChatToggle.addEventListener('click', () => {
            aiChatWindow.classList.toggle('active');
            if (aiChatWindow.classList.contains('active')) {
                loadHistory();
            }
        });

        if (closeChat) {
            closeChat.addEventListener('click', () => {
                aiChatWindow.classList.remove('active');
            });
        }

        const sendMessage = async () => {
            const text = aiChatInput.value.trim();
            if (!text) return;

            const userMessageEl = appendMessage('user', text);
            aiChatInput.value = '';
            aiChatMessages.scrollTop = aiChatMessages.scrollHeight;

            const loadingMsg = document.createElement('div');
            loadingMsg.className = 'chat-msg ai loading';
            loadingMsg.textContent = "Đệ anh Quỳnh đang suy nghĩ...";
            aiChatMessages.appendChild(loadingMsg);
            aiChatMessages.scrollTop = aiChatMessages.scrollHeight;

            const isAdmin = window.location.pathname.startsWith('/admin');
            const endpoint = isAdmin ? "/admin/chat" : "/chat";

            try {
                const response = await fetch(endpoint, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ message: text })
                });
                const data = await response.json();

                if (aiChatMessages.contains(loadingMsg)) {
                    aiChatMessages.removeChild(loadingMsg);
                }

                if (data.code === "success") {
                    appendMessage('ai', data.message);
                } else {
                    userMessageEl.classList.add('error');
                    userMessageEl.title = 'Tin nhan gui that bai';
                    const errorMsg = document.createElement('div');
                    errorMsg.className = 'chat-msg ai error';
                    errorMsg.textContent = data.message || "Lỗi hệ thống.";
                    aiChatMessages.appendChild(errorMsg);
                }
            } catch (error) {
                if (aiChatMessages.contains(loadingMsg)) {
                    aiChatMessages.removeChild(loadingMsg);
                }
                userMessageEl.classList.add('error');
                userMessageEl.title = 'Tin nhan gui that bai';
                const errorMsg = document.createElement('div');
                errorMsg.className = 'chat-msg ai error';
                errorMsg.textContent = "Lỗi kết nối.";
                aiChatMessages.appendChild(errorMsg);
            }
            aiChatMessages.scrollTop = aiChatMessages.scrollHeight;
        };

        if (aiChatSend) aiChatSend.addEventListener('click', sendMessage);
        if (aiChatInput) {
            aiChatInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') sendMessage();
            });
        }
    }
};

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAiChat);
} else {
    initAiChat();
}
