import { useState, useEffect, useRef, useCallback } from "react";

/**
 * MosaicCarousel
 * A product/image carousel styled after the MOSAIC brand mark:
 * faceted, gem-cut transitions and a jewel-tone palette.
 *
 * Props:
 *  - items: [{ src, title, caption }]
 *  - autoPlayMs: number | null  (null disables autoplay)
 */

const DEFAULT_ITEMS = [
  {
    src: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9a/Gray_placeholder.png/640px-Gray_placeholder.png",
    title: "Emerald Cut",
    caption: "Precision-faceted, deep clarity.",
  },
  {
    src: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9a/Gray_placeholder.png/640px-Gray_placeholder.png",
    title: "Amethyst Line",
    caption: "Violet undertone, warm gold trim.",
  },
  {
    src: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9a/Gray_placeholder.png/640px-Gray_placeholder.png",
    title: "Verdigris Series",
    caption: "Teal and bronze, brushed finish.",
  },
];

const FACET_CLIPS = [
  "polygon(0 0, 100% 0, 100% 100%, 0 100%)",
  "polygon(0 0, 100% 0, 78% 100%, 0 100%)",
  "polygon(0 0, 100% 0, 100% 68%, 22% 100%, 0 78%)",
  "polygon(12% 0, 100% 0, 100% 100%, 0 100%, 0 30%)",
];

export default function MosaicCarousel({ items = DEFAULT_ITEMS, autoPlayMs = 5000 }) {
  const [index, setIndex] = useState(0);
  const [prevIndex, setPrevIndex] = useState(null);
  const [direction, setDirection] = useState(1);
  const timerRef = useRef(null);
  const count = items.length;

  const goTo = useCallback(
    (next) => {
      setPrevIndex(index);
      setDirection(next > index || (index === count - 1 && next === 0) ? 1 : -1);
      setIndex(((next % count) + count) % count);
    },
    [index, count]
  );

  const next = useCallback(() => goTo(index + 1), [goTo, index]);
  const prev = useCallback(() => goTo(index - 1), [goTo, index]);

  useEffect(() => {
    if (!autoPlayMs) return;
    timerRef.current = setInterval(() => {
      setIndex((i) => {
        setPrevIndex(i);
        setDirection(1);
        return (i + 1) % count;
      });
    }, autoPlayMs);
    return () => clearInterval(timerRef.current);
  }, [autoPlayMs, count]);

  useEffect(() => {
    const t = setTimeout(() => setPrevIndex(null), 700);
    return () => clearTimeout(t);
  }, [index]);

  const onKeyDown = (e) => {
    if (e.key === "ArrowRight") next();
    if (e.key === "ArrowLeft") prev();
  };

  const current = items[index];
  const facetClip = FACET_CLIPS[index % FACET_CLIPS.length];

  return (
    <div
      role="region"
      aria-roledescription="carousel"
      aria-label="Mosaic image carousel"
      tabIndex={0}
      onKeyDown={onKeyDown}
      style={{
        "--ink": "#EDE7DA",
        "--onyx": "#15161A",
        "--onyx-2": "#1D1F24",
        "--teal": "#1F6B63",
        "--gold": "#B7924D",
        "--plum": "#5B3A66",
        "--dim": "#8A8D97",
        fontFamily:
          "Georgia, 'Iowan Old Style', 'Palatino Linotype', serif",
        background: "var(--onyx)",
        color: "var(--ink)",
        borderRadius: 4,
        padding: "clamp(20px, 4vw, 40px)",
        maxWidth: 860,
        margin: "0 auto",
        position: "relative",
        outline: "none",
      }}
    >
      <style>{`
        .mc-frame { position: relative; aspect-ratio: 16/9; overflow: hidden; background: var(--onyx-2); border: 1px solid rgba(183,146,77,0.35); }
        .mc-layer { position: absolute; inset: 0; }
        .mc-layer img { width: 100%; height: 100%; object-fit: cover; display: block; filter: saturate(0.92) contrast(1.02); }
        .mc-facet-in { animation: mcFacetIn 620ms cubic-bezier(.22,.9,.28,1) forwards; }
        .mc-facet-out { animation: mcFacetOut 620ms cubic-bezier(.5,0,.75,.2) forwards; }
        @keyframes mcFacetIn {
          from { clip-path: inset(0 0 0 100%); transform: scale(1.02); }
          to   { clip-path: inset(0 0 0 0%); transform: scale(1); }
        }
        @keyframes mcFacetOut {
          from { opacity: 1; }
          to   { opacity: 0; }
        }
        .mc-caption-title { font-size: clamp(20px, 2.6vw, 28px); letter-spacing: 0.02em; margin: 0 0 4px; }
        .mc-caption-sub { font-family: -apple-system, 'Helvetica Neue', Arial, sans-serif; font-size: 13px; letter-spacing: 0.06em; text-transform: uppercase; color: var(--dim); margin: 0; }
        .mc-btn { background: transparent; border: 1px solid rgba(237,231,218,0.25); color: var(--ink); width: 40px; height: 40px; border-radius: 2px; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: border-color 160ms, transform 160ms; }
        .mc-btn:hover { border-color: var(--gold); transform: translateY(-1px); }
        .mc-btn:focus-visible { outline: 2px solid var(--gold); outline-offset: 2px; }
        .mc-dot { width: 26px; height: 3px; background: rgba(237,231,218,0.22); border: none; cursor: pointer; padding: 0; transition: background 160ms, transform 160ms; clip-path: polygon(6% 0, 100% 0, 94% 100%, 0 100%); }
        .mc-dot[aria-current="true"] { background: var(--gold); }
        .mc-dot:hover { background: rgba(183,146,77,0.6); }
        @media (prefers-reduced-motion: reduce) {
          .mc-facet-in, .mc-facet-out { animation: none !important; }
        }
      `}</style>

      <div className="mc-frame">
        {prevIndex !== null && (
          <div className="mc-layer mc-facet-out" style={{ zIndex: 1 }}>
            <img src={items[prevIndex].src} alt="" />
          </div>
        )}
        <div key={index} className="mc-layer mc-facet-in" style={{ zIndex: 2, clipPath: facetClip }}>
          <img src={current.src} alt={current.title} />
        </div>

        {/* gold facet seam accent */}
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            inset: 0,
            zIndex: 3,
            pointerEvents: "none",
            clipPath: facetClip,
            boxShadow: "inset 0 0 0 1px rgba(183,146,77,0.55)",
          }}
        />

        <button aria-label="Previous slide" onClick={prev} className="mc-btn" style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", zIndex: 4 }}>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M10 2L4 8l6 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </button>
        <button aria-label="Next slide" onClick={next} className="mc-btn" style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", zIndex: 4 }}>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M6 2l6 6-6 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </button>
      </div>

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginTop: 18, gap: 16, flexWrap: "wrap" }}>
        <div>
          <p className="mc-caption-sub">{String(index + 1).padStart(2, "0")} / {String(count).padStart(2, "0")}</p>
          <h3 className="mc-caption-title">{current.title}</h3>
          <p className="mc-caption-sub" style={{ textTransform: "none", letterSpacing: "0.01em", color: "var(--dim)" }}>{current.caption}</p>
        </div>
        <div style={{ display: "flex", gap: 8 }} role="tablist" aria-label="Slide selector">
          {items.map((_, i) => (
            <button
              key={i}
              className="mc-dot"
              role="tab"
              aria-current={i === index}
              aria-label={`Go to slide ${i + 1}`}
              onClick={() => goTo(i)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
