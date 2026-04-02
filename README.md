
# BRC JS

*Bootstrap Right-Click Navigation Menu*


* **Package:** BRC JS
* **Version:** v1.2.0
* **Copyright:** 2026 [`JosebaMirena.com`](https://www.josebamirena.com)
* **License:** [`MIT License`](./LICENSE)
* **Author:** Joseba Mirena ([@joseba-mirena](https://github.com/joseba-mirena))

![Version](https://img.shields.io/badge/version-1.2.0-blue)
![License](https://img.shields.io/badge/license-MIT-green)
![Size](https://img.shields.io/badge/size-8.4%20kB-lightgrey)

A lightweight, zero-dependency JavaScript module that adds a customizable right-click navigation menu to your Bootstrap website. The menu automatically syncs with your existing navbar structure, supports RTL languages, and respects your theme's CSS variables.


## Features

- 🎯 **No Code Duplication** - Automatically builds menu from your existing Bootstrap navbar
- 🎨 **Theme Aware** - Uses Bootstrap CSS variables, supports custom color schemes
- 🌍 **RTL Support** - Full right-to-left language support
- ♿ **Accessible** - ARIA labels, keyboard navigation, screen reader friendly
- 🎭 **Smart Positioning** - Automatically positions menu where most space is available
- 🎨 **Customizable** - Easy to style with CSS variables or configuration options
- ⚡ **Lightweight** - No external dependencies, just vanilla JavaScript


## Installation

### 1. Include the Script

```html
    <script src="https://opensource.josebamirena.com/brc/1.2.0/dist/brc.min.js" 
        integrity="sha384-r4ggKTIXd3DPzFbIYSuzBdCgP7MWtEL0UdsDfoFXh3TKfssRNVxgCpb6F6pxy9yH" 
        crossorigin="anonymous">
    </script>
```


### 2. Basic initialization

```html
    <script>
        BootstrapRightClickNav.init();
    </script>
```


### 3. Initialization with custom options

```html
    <script>
        // With custom options
        BootstrapRightClickNav.init({
            minWidth: '250px',
            borderColor: 'var(--color-primary, #ff2c6e)',
            activeColor: 'var(--color-secondary, #2ecc71)',
            debug: true
        });
    </script>
```


### 4. Configuration Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `enabled` | boolean | `true` | Enable/disable the right-click menu functionality |
| `injectCSS` | boolean | `true` | Automatically inject required CSS styles |
| `injectHTML` | boolean | `true` | Automatically inject menu HTML structure |
| `minWidth` | string | `'200px'` | Minimum width of the menu (can be any CSS width value) |
| `zIndex` | number | `10000` | Z-index for menu stacking context |
| `menuId` | string | `'bootstrap-rightclick-nav'` | ID attribute for the menu element |
| `excludeElements` | array | `['input', 'textarea', '[contenteditable="true"]']` | Elements where right-click is disabled (supports CSS selectors) |
| `debug` | boolean | `false` | Enable console logging for debugging |
| `navSelector` | string | `'.navbar-nav'` | CSS selector to find your navigation element |
| `borderColor` | string | `'var(--color-tertiary, var(--bs-primary))'` | Menu border color (CSS color value) |
| `activeColor` | string | `'var(--color-primary, var(--bs-primary))'` | Background color for active menu items |


### 5. API Methods

```html
    <script>
        // Initialize the menu
        BootstrapRightClickNav.init(options);

        // Enable the menu
        BootstrapRightClickNav.enable();

        // Disable the menu
        BootstrapRightClickNav.disable();

        // Hide the menu if visible
        BootstrapRightClickNav.hide();

        // Update menu content (useful after dynamic nav changes)
        BootstrapRightClickNav.update();

        // Check if menu is visible
        const isVisible = BootstrapRightClickNav.isVisible();

        // Update configuration
        BootstrapRightClickNav.setConfig({ minWidth: '300px' });

        // Completely destroy the menu (removes events and elements)
        BootstrapRightClickNav.destroy();
    </script>
```


### 6. CSS Customization

```html
    /* Override default colors */
    :root {
        --color-primary: #ff2c6e;    /* Active item background */
        --color-tertiary: #3498db;    /* Menu border */
    }
```

```html
    /* Or customize via configuration */
    BootstrapRightClickNav.init({
        borderColor: '#00d4ff',
        activeColor: '#ff2c6e'
    });
```


### 7. Disable on Specific Elements

```html
    <!-- Add this class to elements where you want to disable right-click -->
    <div class="no-context-menu">
        <!-- Right-click disabled here -->
    </div>
```

```html
    // Or configure excluded elements
    BootstrapRightClickNav.init({
        excludeElements: ['input', 'textarea', '.no-menu', '#special-element']
    });
```


## 📝 Changelog - BRC JS

### v1.2.0 - Performance & Smooth Scroll Release

#### 🔧 Added
- Handles any anchor link (`#top`, `#section`, etc.)
- Color-coded debug console logs (`[BRC] info/warn/error`)

#### 🚀 Improved
- Optimized variables for better code weight
- Smooth scroll for any anchor link (`#top`, `#section`)
- Menu now closes before smooth scroll executes
- Simplified injection logic

#### 🗑️ Removed
- Touch device detection (not needed - `contextmenu` doesn't fire on touch)

---

### v1.0.0 - Initial Release
- Right-click menu syncing with Bootstrap navbar
- RTL language support
- ARIA accessibility attributes
- Public API: `init()`, `enable()`, `disable()`, `hide()`, `update()`, `destroy()`, `isVisible()`, `setConfig()`


## 🎯 Live Demo

Try BRC JS live on my website:  
👉 [BRC JS Demo](https://www.josebamirena.com/freebies-tools-resources/bootstrap-right-click-menu-javascript)

Right-click anywhere on this website (except on the cookie modal) to see the menu in action.
