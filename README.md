# realy.si

Marketing site for **Realy — the AI company operating system**.

Static HTML/CSS/JS, no build step. Open `index.html` or serve the folder:

```sh
python3 -m http.server 8000
```

## Structure

| File | Purpose |
| --- | --- |
| `index.html` | Page markup and static copy |
| `assets/css/styles.css` | Design tokens (brand book v2) and all styles |
| `assets/js/data.js` | **All demo/placeholder data**: hero, dashboard, jurisdictions, products, marketplace, org chart, pricing, links |
| `assets/js/main.js` | Rendering + micro-interactions (count-ups, reveals, dashboard tabs, org simulation) |
| `assets/img/` | Realy mark + favicon (drawn from the brand book construction) |

## Connecting real data

Dashboard, hero and marketplace values in `data.js` are **demo UI values only**.
Replace any block with real data of the same shape, then call `Realy.render()`:

```js
REALY_DATA.dashboard = await fetch("/api/dashboard").then((r) => r.json());
Realy.render();
```

## Brand

- Realy Blue `#1764FF`, Midnight `#0B1220`, Slate `#5A6478`, Cloud `#F4F6FA`, Mist `#E8F0FF`
- Sora (display) · Inter (body/UI) · JetBrains Mono (technical labels)
- Motion respects `prefers-reduced-motion`.
