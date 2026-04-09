/* =========================================
 * BRC JS - A lightweight, accessible right-click menu 
 *          that syncs with Bootstrap navbar
 *
 * @package    BRC JS
 * @version    v1.4.0
 * @copyright  2026 JosebaMirena.com
 * @license    MIT
 *             https://www.josebamirena.com/media/assets/brc/1.4.0/LICENSE
 * @author     Joseba Mirena
 * 
 * DOCUMENTATION:
 * https://www.josebamirena.com/media/assets/brc/1.4.0/README
 */
const BootstrapRightClickNav = (function() {
    'use strict';

    let _cfg = {
        enabled: true,
        debug: false,
        injectCSS: true,
        injectHTML: true,
        minWidth: '200px',
        zIndex: 10000,
        menuId: 'bootstrap-rightclick-nav',
        excludeElements: ['input', 'textarea', '[contenteditable="true"]'],
        navSelector: '.navbar-nav',
        borderColor: 'var(--color-tertiary, var(--bs-primary))',
        activeColor: 'var(--color-primary, var(--bs-primary))'
    };

    let _m = null;
    let _styleEl = null;
    let _isVisible = false;
    let _posTo = null;
    let _isRTL = false;

    function _log(msg, t = 'info') {
        if (!_cfg.debug) return;

        const i = `[BRC] ${msg}`;

        if (t === 'warn') {
            console.warn(i);
        } else if (t === 'error') {
            console.error(i);
        } else {
            console.log(i);
        }
    }

    function _gID(id) {
        return document.getElementById(id);
    }

    function _injCSS() {
        if (_gID(`${_cfg.menuId}-styles`)) return;

        const css = `
            #${_cfg.menuId} {
                position: fixed;
                z-index: ${_cfg.zIndex};
                background: var(--bs-body-bg, #ffffff);
                outline: none !important;
                border: 1px solid ${_cfg.borderColor} !important;
                border-radius: var(--border-lg, var(--bs-border-radius-lg, 0.5rem));
                box-shadow: var(--bs-box-shadow-lg, 0 1rem 3rem rgba(0,0,0,0.175));
                min-width: ${_cfg.minWidth};
                width: fit-content;
                max-width: calc(100vw - 40px);
                overflow-y: auto;
                display: none;
                backdrop-filter: blur(10px);
                scrollbar-width: none;
                -ms-overflow-style: none;
                font-family: inherit;
            }

            /* Hide scrollbar but keep functionality */
            #${_cfg.menuId}::-webkit-scrollbar {
                display: none;
            }

            .rc-nav-item {
                padding: 0.5rem 1rem;
                cursor: pointer;
                transition: all 0.15s ease;
                color: var(--bs-body-color);
                display: flex;
                align-items: center;
                gap: 0.75rem;
                white-space: nowrap;
                border-left: 3px solid transparent;
                font-family: inherit;
                font-size: 0.95rem;
                line-height: 1.5;
                user-select: none;
            }

            .rc-nav-item:hover {
                background: rgba(var(--bs-primary-rgb), 0.1);
                border-left-color: ${_cfg.borderColor};
            }

            /* Active state */
            .rc-nav-item.active,
            .rc-nav-item.child.active,
            .rc-nav-item.active:hover,
            .rc-nav-item.child.active:hover {
                background: ${_cfg.activeColor} !important;
                color: #ffffff !important;
                border-left-color: ${_cfg.activeColor} !important;
                border-right-color: ${_cfg.activeColor} !important;
            }

            /* RTL support */
            html[dir="rtl"] .rc-nav-item {
                border-left: none;
                border-right: 3px solid transparent;
            }

            html[dir="rtl"] .rc-nav-item:hover {
                border-right-color: ${_cfg.borderColor};
                border-left-color: transparent;
            }

            html[dir="rtl"] .rc-nav-item.active,
            html[dir="rtl"] .rc-nav-item.child.active,
            html[dir="rtl"] .rc-nav-item.active:hover,
            html[dir="rtl"] .rc-nav-item.child.active:hover {
                border-right-color: ${_cfg.activeColor} !important;
                border-left-color: transparent !important;
            }

            /* Subcategories */
            .rc-nav-item.child {
                padding: 0.4rem 2.2rem 0.4rem 2rem;
                font-size: 0.9rem;
            }

            html[dir="rtl"] .rc-nav-item.child {
                padding: 0.4rem 2rem 0.4rem 2.2rem;
            }

            .rc-nav-divider {
                height: 1px;
                background: var(--bs-border-color);
                margin: 0.5rem 0;
            }

            @keyframes rcNavFadeIn {
                from { opacity: 0; transform: scale(0.95); }
                to { opacity: 1; transform: scale(1); }
            }

            .rc-nav-show {
                animation: rcNavFadeIn 0.1s ease-out;
            }
        `;

        _styleEl = document.createElement('style');
        _styleEl.id = `${_cfg.menuId}-styles`;
        _styleEl.textContent = css;
        document.head.appendChild(_styleEl);
    }

    function _injHTML() {
        if (_gID(_cfg.menuId)) return;

        const menuHTML = `<div id="${_cfg.menuId}" role="menu" aria-label="Navigation menu" style="display: none;"></div>`;
        document.body.insertAdjacentHTML('beforeend', menuHTML);
        _m = _gID(_cfg.menuId);
    }

    function _buildM() {
        const nav = document.querySelector(_cfg.navSelector);
        if (!nav) {
            _log('Navigation not found', 'warn');
            return;
        }

        let html = '';
        const currentPath = window.location.pathname;

        nav.querySelectorAll(':scope > li').forEach((item, index) => {
            const link = item.querySelector(':scope > a');
            if (!link) return;

            const hasDropdown = item.classList.contains('dropdown');
            const href = link.getAttribute('href') || '#';
            
            // Check if this category is active
            let isActive = link.classList.contains('active') || 
                          item.classList.contains('active') ||
                          currentPath === href;
            
            // Main category
            html += `<div class="rc-nav-item ${isActive ? 'active' : ''}" data-href="${href}" role="menuitem">
                <span>${link.textContent.trim()}</span>
            </div>`;

            // Children
            if (hasDropdown) {
                item.querySelectorAll('.dropdown-menu .dropdown-item').forEach(child => {
                    const childLink = child.querySelector('a') || child;
                    const childHref = childLink.getAttribute('href') || '#';
                    
                    const childActive = child.classList.contains('active') || 
                                       childLink.classList.contains('active') || 
                                       currentPath === childHref;

                    // Child
                    html += `<div class="rc-nav-item child ${childActive ? 'active' : ''}" data-href="${childHref}" role="menuitem">
                        <span>${childLink.textContent.trim()}</span>
                    </div>`;
                });
            }

            if (index < nav.children.length - 1) {
                html += '<div class="rc-nav-divider" role="separator"></div>';
            }
        });

        _m.innerHTML = html;

        _m.querySelectorAll('.rc-nav-item').forEach(item => {
            item.addEventListener('click', (e) => {
                const href = item.dataset.href;
                
                if (href && href.startsWith('#') && href !== '#') {
                    e.preventDefault();
                    e.stopPropagation();
                    
                    const target = document.querySelector(href);
                    if (target) {
                        _hide();
                        const y = target.getBoundingClientRect().top + window.scrollY;
                        window.scrollTo({ top: y, behavior: 'smooth' });
                    }
                } else {
                    window.location.href = href;
                }
            });
        });
    }

    function _posM(x, y) {
        if (_posTo) clearTimeout(_posTo);
        
        _posTo = setTimeout(() => {
            const windowW = window.innerWidth;
            const windowH = window.innerHeight;
            const menuW = _m.offsetWidth;
            const menuH = _m.offsetHeight;

            const spcR = windowW - x;
            const spcL = x;
            const spcB = windowH - y;
            const spcT = y;

            let left, top;

            // RTL detection
            _isRTL = document.dir === 'rtl' || document.documentElement.dir === 'rtl';

            // Horizontal positioning with RTL support
            if (_isRTL) {
                // RTL logic - flip horizontal
                if (spcL >= menuW + 10 || spcL >= spcR) {
                    left = Math.max(x - menuW - 10, 10);
                } else {
                    left = Math.min(x + 10, windowW - menuW - 10);
                }
            } else {
                // LTR logic
                if (spcR >= menuW + 10 || spcR >= spcL) {
                    left = Math.min(x + 10, windowW - menuW - 10);
                } else {
                    left = Math.max(x - menuW - 10, 10);
                }
            }

            // Vertical positioning (same for both)
            if (spcB >= menuH + 10) {
                top = Math.min(y + 10, windowH - menuH - 10);
            } else if (spcT >= menuH + 10) {
                top = Math.max(y - menuH - 10, 10);
            } else {
                top = 10;
            }

            // Final bounds checking
            left = Math.max(5, Math.min(left, windowW - menuW - 5));
            top = Math.max(5, Math.min(top, windowH - menuH - 5));

            _m.style.left = left + 'px';
            _m.style.top = top + 'px';
            _m.style.maxHeight = (windowH - 40) + 'px';
        }, 10);
    }

    function _show(e) {
        if (!_cfg.enabled) return;

        // Excluded Elements
        const target = e.target;
        for (const selector of _cfg.excludeElements) {
            if (target.closest(selector)) {
                return;
            }
        }

        e.preventDefault();
        e.stopPropagation();

        _buildM();
        
        // Show menu to get accurate measurements
        _m.style.display = 'block';
        
        // Use setTimeout to ensure DOM is updated
        setTimeout(() => {
            _posM(e.clientX, e.clientY);
            _m.classList.add('rc-nav-show');
            
            // Announce for screen readers
            _m.setAttribute('aria-hidden', 'false');
        }, 0);
        
        _isVisible = true;
        _m.focus();
    }

    function _hide() {
        _m.style.display = 'none';
        _m.classList.remove('rc-nav-show');
        _m.setAttribute('aria-hidden', 'true');
        _isVisible = false;
    }

    function _hdlCO(e) {
        if (_isVisible && !_m.contains(e.target)) _hide();
    }

    function _hdlK(e) {
        if (e.key === 'Escape' && _isVisible) _hide();
        
        // Arrow key navigation within menu
        if (_isVisible && (e.key === 'ArrowDown' || e.key === 'ArrowUp')) {
            e.preventDefault();
            const items = Array.from(_m.querySelectorAll('.rc-nav-item'));
            const currentIndex = items.indexOf(document.activeElement);
            
            if (e.key === 'ArrowDown') {
                const nextIndex = (currentIndex + 1) % items.length;
                items[nextIndex].focus();
            } else if (e.key === 'ArrowUp') {
                const prevIndex = (currentIndex - 1 + items.length) % items.length;
                items[prevIndex].focus();
            }
        }
    }

    function _hdlRes() {
        if (_isVisible) _hide();
    }

    function _hdlWheel(e) {
        if (_isVisible && _m.contains(e.target)) {
            const menu = _m;
            const scrollTop = menu.scrollTop;
            const scrollHeight = menu.scrollHeight;
            const clientHeight = menu.clientHeight;
            
            if (scrollHeight <= clientHeight) {
                e.preventDefault();
                return;
            }
            
            const isAtTop = scrollTop === 0;
            const isAtBottom = Math.abs(scrollTop + clientHeight - scrollHeight) < 1;
            
            if ((e.deltaY < 0 && isAtTop) || (e.deltaY > 0 && isAtBottom)) {
                e.preventDefault();
            }
        }
    }

    function _clean() {
        if (_m) {
            _m.remove();
            _m = null;
        }
        if (_styleEl) {
            _styleEl.remove();
            _styleEl = null;
        }
        _isVisible = false;
        _log('Cleanup completed');
    }

    return {
        init: function(options = {}) {
            _cfg = { ..._cfg, ...options };

            _injCSS();
            _injHTML();

            if (_m) {
                _m.setAttribute('tabindex', '-1');
                _m.setAttribute('aria-hidden', 'true');
                
                document.addEventListener('contextmenu', (e) => _show(e));
                document.addEventListener('click', _hdlCO);
                document.addEventListener('keydown', _hdlK);
                window.addEventListener('resize', _hdlRes);
                window.addEventListener('beforeunload', _clean);
                
                _m.addEventListener('wheel', _hdlWheel, { passive: false });
                
                _log('Initialized successfully');
            } else {
                _log('Failed to initialize', 'error');
            }
            
            return this;
        },

        enable: function() { 
            _cfg.enabled = true; 
            _log('Enabled');
        },
        
        disable: function() { 
            _cfg.enabled = false; 
            _hide(); 
            _log('Disabled');
        },
        
        hide: function() { 
            _hide(); 
        },
        
        update: function() { 
            if (_isVisible) _buildM(); 
            _log('Menu updated');
        },
        
        destroy: function() {
            document.removeEventListener('contextmenu', _show);
            document.removeEventListener('click', _hdlCO);
            document.removeEventListener('keydown', _hdlK);
            window.removeEventListener('resize', _hdlRes);
            window.removeEventListener('beforeunload', _clean);
            
            if (_m) {
                _m.removeEventListener('wheel', _hdlWheel);
            }
            
            _clean();
            _log('Destroyed');
        },
        
        isVisible: function() {
            return _isVisible;
        },
        
        setConfig: function(options) {
            _cfg = { ..._cfg, ...options };
            _log('Configuration updated');
        }
    };
})();