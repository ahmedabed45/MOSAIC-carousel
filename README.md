# MOSAIC Carousel

A product/image carousel component built around the MOSAIC brand mark — faceted, gem-cut slide transitions and a jewel-tone palette (onyx, teal, gold, plum) that echoes the crystal butterfly logo.

## Files

- `MosaicCarousel.jsx` — the React component (no external deps beyond React).
- `demo.html` — a standalone static preview (open directly in a browser).
- `assets/mosaic-logo.png` — brand mark.

## Usage

```jsx
import MosaicCarousel from "./MosaicCarousel";

<MosaicCarousel
  items={[
    { src: "/images/product-1.jpg", title: "Emerald Cut", caption: "Precision-faceted, deep clarity." },
    { src: "/images/product-2.jpg", title: "Amethyst Line", caption: "Violet undertone, warm gold trim." },
  ]}
  autoPlayMs={5000}
/>
```

## Design notes

- **Signature move:** each slide transition reveals the next image through an angled facet (`clip-path`) rather than a plain fade/slide, echoing the gem-cut logo.
- **Palette:** onyx `#15161A` background, gold `#B7924D` accents, teal `#1F6B63` and plum `#5B3A66` reserved for content/imagery, ivory `#EDE7DA` text.
- **Controls:** keyboard arrow support, faceted dot indicators (not plain circles), accessible `aria-roledescription="carousel"` region.
- `autoPlayMs={null}` disables autoplay.

## Roadmap ideas

- Swipe/drag support for touch.
- Optional thumbnail strip beneath the frame.
- Ken Burns pan on the active slide for a more premium feel.
