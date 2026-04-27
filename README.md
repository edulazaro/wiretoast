# wiretoast

Framework-agnostic toast notification system for Laravel, Livewire and Alpine. Pure CSS themes (no Tailwind, no Bootstrap), drop-in API, zero JS dependencies.

**[Live preview →](https://edulazaro.github.io/wiretoast/)** Try the 9 themes, 5 types, 7 positions and dark mode in the interactive demo.

## Requirements

- PHP `>=8.2`
- Laravel `>=11.0` (any future version included)
- Livewire `>=3.0` *(optional, only needed for the `$this->notify()` helper)*

## Features

- 5 semantic types: `success`, `error`, `warning`, `info`, `neutral`
- 7 stacked positions: `top-left`, `top-center`, `top-right`, `bottom-left`, `bottom-center`, `bottom-right`, `center`
- 9 visual themes bundled: `flat`, `soft`, `glass`, `gradient`, `neon`, `minimal`, `claude`, `chatgpt`, `synthwave`
- Custom themes via CSS variables (no Blade override needed)
- Dark mode automatic (`prefers-color-scheme`) and opt-in (`.dark` / `[data-wt-theme-mode="dark"]`)
- Optional auto-dismiss progress bar with pause-on-hover
- Optional title + message
- Group mode: collapse multiple messages of the same type into one

## Install

```bash
composer require edulazaro/wiretoast
```

Then load the assets. Pick the path that matches your project.

### Without a bundler: vendor:publish

For projects that don't use Vite or another bundler, copy the assets to `public/vendor/wiretoast/` and tell the component to inject the `<link>` and `<script>` tags by passing `:assets="true"`.

```bash
php artisan vendor:publish --tag=wiretoast-assets
```

```blade
<x-wiretoast :assets="true" />
```

### Recommended: bundle with Vite

Import wiretoast from your existing `app.css` and `app.js`. Vite minifies, hashes, and concatenates everything into your main bundle, so there's no extra HTTP request and you reuse your cache-busting setup.

```js
// resources/js/app.js
import '../../vendor/edulazaro/wiretoast/resources/js/wiretoast.js';
```

```css
/* resources/css/app.css */
@import '../../vendor/edulazaro/wiretoast/resources/css/wiretoast.css';
```

Add the component to your layout:

```blade
<x-wiretoast />
```

By default the component does not inject any `<link>` or `<script>` tags, so it won't conflict with your Vite bundle.

Optionally, add a Vite alias for cleaner imports:

```js
// vite.config.js
import path from 'path';

export default defineConfig({
    resolve: {
        alias: {
            '@wiretoast': path.resolve(__dirname, 'vendor/edulazaro/wiretoast/resources'),
        },
    },
});
```

```js
// resources/js/app.js
import '@wiretoast/js/wiretoast.js';
import '@wiretoast/css/wiretoast.css';
```

### Optional props (both paths)

```blade
<x-wiretoast theme="soft" mode="dark" default-position="bottom-right" />
```

## Usage

The API is the same in all three environments and always called `notify`.

### Livewire (PHP)

```php
// Plain message
$this->notify('Saved successfully');

// With type
$this->notify('Could not connect', 'error');

// Title + message
$this->notify(['title' => 'Saved', 'message' => 'All changes applied'], 'success');

// Options (third arg as array)
$this->notify('Heads up', 'warning', [
    'position' => 'bottom-center',
    'timeout'  => 3000,
    'progress' => true,
]);

// Legacy: third arg as boolean = group
$this->notify('Item added', 'success', true);
```

### Alpine.js

```html
<button @click="$dispatch('notify', { message: 'Saved', type: 'success' })">
    Save
</button>

<button @click="$dispatch('notify', {
    title: 'Saved',
    message: 'All changes applied',
    type: 'success',
    position: 'bottom-right',
    progress: true
})">Save with progress</button>
```

### JavaScript

```js
window.notify('Saved successfully', 'success');
window.notify({ title: 'Saved', message: 'All changes applied' }, 'success');
window.notify('Heads up', 'warning', { position: 'bottom-center', timeout: 3000, progress: true });
```

## Themes

Set the theme on the component (or any ancestor element):

```blade
<x-wiretoast theme="glass" />
```

Or dynamically:

```js
document.body.dataset.wtTheme = 'neon';
```

### Custom theme

Themes are pure CSS variable sets. Create your own without touching the package:

```css
:root {
    --wt-radius: 6px;
    --wt-bg: #fafafa;
    --wt-text: #222;
    --wt-shadow: 0 2px 8px rgba(0,0,0,.06);

    --wt-success: #10b981;
    --wt-error:   #ef4444;
    --wt-warning: #f59e0b;
    --wt-info:    #3b82f6;
    --wt-neutral: #6b7280;
}
```

Or scope it under an attribute so users can switch:

```css
[data-wt-theme="brand"] .wt-toast {
    background: linear-gradient(to right, #ff6b6b, #feca57);
    color: white;
    border: none;
    border-radius: 999px;
}
```

```blade
<x-wiretoast theme="brand" />
```

## Dark mode

Out of the box, dark mode is applied automatically based on the user's OS via `prefers-color-scheme: dark`. To override:

```blade
<x-wiretoast mode="dark" />   {{-- force dark --}}
<x-wiretoast mode="light" />  {{-- force light --}}
```

The package also responds to a `.dark` class on any ancestor (compatible with Tailwind dark mode setups) and to the `[data-wt-theme-mode]` attribute.

## Reference

### `notify(input, type, options)` (JS) / `$this->notify(...)` (Livewire)

| Argument | Type | Description |
|----------|------|-------------|
| `input` | `string \| { title, message }` | Message text or object with title and message |
| `type` | `'success' \| 'error' \| 'warning' \| 'info' \| 'neutral'` | Semantic type, default `'info'` (JS) / `'success'` (Livewire) |
| `options` | `boolean \| object` | Options object, or `true` for legacy group mode |

### Options object

| Key | Type | Default | Description |
|-----|------|---------|-------------|
| `position` | `string` | `'top-right'` | One of the 7 positions |
| `timeout` | `number` | `5000` | Auto-dismiss in ms (`0` = persist) |
| `progress` | `boolean` | `false` | Show countdown bar (pauses on hover) |
| `group` | `boolean` | `false` | Append to existing same-type toast |

### CSS variables

Structural: `--wt-radius`, `--wt-padding`, `--wt-gap`, `--wt-width`, `--wt-font`, `--wt-font-size`, `--wt-line-height`

Color: `--wt-bg`, `--wt-text`, `--wt-text-muted`, `--wt-border`, `--wt-shadow`

Semantic: `--wt-success`, `--wt-error`, `--wt-warning`, `--wt-info`, `--wt-neutral` (each also has a `*-tint` for soft theme)

Motion: `--wt-duration`, `--wt-easing`

Per-toast: `--wt-progress-duration` (set automatically when `progress: true`)

## Credits

Developed by [Edu Lázaro](https://edulazaro.com).

## License

MIT
