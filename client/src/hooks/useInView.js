import { useEffect, useRef, useState } from "react";
import { prefersReducedMotion } from "../lib/motion.js";

/*
 * Fallback for IntersectionObserver: if the main thread is busy during a fast
 * scroll, an element can jump from below the viewport to above it without ever
 * "intersecting". One shared, rAF-throttled scroll check reveals anything that
 * has been reached.
 */
const pending = new Map();
let scheduled = false;
function sweep() {
  scheduled = false;
  const vh = window.innerHeight;
  pending.forEach((reveal, el) => {
    if (el.getBoundingClientRect().top < vh * 0.94) { reveal(); pending.delete(el); }
  });
}
function onScroll() { if (!scheduled && pending.size) { scheduled = true; requestAnimationFrame(sweep); } }
if (typeof window !== "undefined") window.addEventListener("scroll", onScroll, { passive: true });

/** Returns [ref, inView]. Fires once, then stops observing. */
export function useInView({ threshold = 0.12, rootMargin = "0px 0px -6% 0px" } = {}) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (prefersReducedMotion() || !("IntersectionObserver" in window)) { setInView(true); return; }
    // Also counts elements already scrolled past (fast scrolls, anchor jumps).
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting || e.boundingClientRect.top < 0) { setInView(true); io.disconnect(); pending.delete(el); }
    }, { threshold: [0, threshold], rootMargin });
    io.observe(el);
    pending.set(el, () => { setInView(true); io.disconnect(); });
    return () => { io.disconnect(); pending.delete(el); };
  }, [threshold, rootMargin]);

  return [ref, inView];
}

/** Returns [ref, visible] and keeps tracking — used to pause animation loops offscreen. */
export function useVisible(rootMargin = "120px") {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el || !("IntersectionObserver" in window)) { setVisible(true); return; }
    const io = new IntersectionObserver(([e]) => setVisible(e.isIntersecting), { rootMargin });
    io.observe(el);
    return () => io.disconnect();
  }, [rootMargin]);
  return [ref, visible];
}
