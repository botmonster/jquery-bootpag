# bootpag

[![CI](https://github.com/botmonster/jquery-bootpag/actions/workflows/ci.yml/badge.svg)](https://github.com/botmonster/jquery-bootpag/actions/workflows/ci.yml)
[![npm](https://img.shields.io/npm/v/bootpag)](https://www.npmjs.com/package/bootpag)
[![npm downloads](https://img.shields.io/npm/dm/bootpag)](https://www.npmjs.com/package/bootpag)
[![License](https://img.shields.io/npm/l/bootpag)](https://github.com/botmonster/jquery-bootpag/blob/main/LICENSE)

Dynamic pagination jQuery plugin. Works with [Bootstrap 3.4](https://getbootstrap.com/docs/3.4/) or standalone.

## Installation

**npm:**
```bash
npm install bootpag
```

**CDN (jsDelivr):**
```html
<script src="https://cdn.jsdelivr.net/npm/bootpag/lib/jquery.bootpag.min.js"></script>
```

**CDN (unpkg):**
```html
<script src="https://unpkg.com/bootpag/lib/jquery.bootpag.min.js"></script>
```

**Manual:** Download `jquery.bootpag.min.js` from the [latest GitHub Release](https://github.com/botmonster/jquery-bootpag/releases/latest).

> **Note:** Requires jQuery >= 1.6 as a peer dependency. Make sure jQuery is loaded before bootpag.
>
## Usage

Check [live demo](https://botmonster.com/jquery-bootpag/) online or run `npm run build` and open `examples/index.html` in a browser.

```html
<p id="content">Dynamic page content</p>
<p id="pagination-here"></p>
```

```javascript
$('#pagination-here').bootpag({
    total: 7,
    page: 1,
    maxVisible: 5,
    leaps: true
}).on("page", function(event, num){
    $("#content").html("Page " + num); // or some ajax content loading...
});
```

## Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `total` | number | `0` | Total number of pages |
| `page` | number | `1` | Current active page |
| `maxVisible` | number | `total` | Maximum visible page buttons |
| `leaps` | boolean | `true` | Next/prev jump through `maxVisible` ranges |
| `href` | string | `'javascript:void(0);'` | Href template for page links |
| `hrefVariable` | string | `'{{number}}'` | Placeholder replaced with page number in `href` |
| `next` | string\|null | `'&raquo;'` | Next button text/HTML (`null` to hide) |
| `prev` | string\|null | `'&laquo;'` | Prev button text/HTML (`null` to hide) |
| `firstLastUse` | boolean | `false` | Show first/last page buttons |
| `first` | string | `'&larr;'` | First button text/HTML |
| `last` | string | `'&rarr;'` | Last button text/HTML |
| `wrapClass` | string | `'pagination'` | CSS class for the `<ul>` wrapper |
| `activeClass` | string | `'active'` | CSS class for the active page |
| `disabledClass` | string | `'disabled'` | CSS class for disabled buttons |
| `nextClass` | string | `'next'` | CSS class for next button |
| `prevClass` | string | `'prev'` | CSS class for prev button |
| `firstClass` | string | `'first'` | CSS class for first button |
| `lastClass` | string | `'last'` | CSS class for last button |

## Events

### `page`

Triggered when a page is clicked. Receives the page number as the second argument.

```javascript
$('#pagination').on("page", function(event, num) {
    console.log("Page " + num + " clicked");
});
```

## Examples

See the [examples/](examples/) directory for interactive demos covering simple, advanced, pro, and full configuration usage. Run `npm run build` first, then open `examples/index.html` in a browser.

## Development

```bash
npm install        # Install dependencies
npm run lint       # Run ESLint
npm test           # Run lint + tests with coverage
npm run build      # Build dist/jquery.bootpag.min.js
```

## License

MIT. Copyright (c) 2013-2026 [botmonster.com](https://botmonster.com)
