import { useEffect, useRef } from "react";
import { useVisible } from "../hooks/useInView.js";
import { prefersReducedMotion } from "../lib/motion.js";

/**
 * Rotating point-sphere with hub nodes and great-circle arcs (Canvas 2D).
 * Lightweight: ~1,600 points, paused offscreen, single static frame for
 * reduced motion.
 */
export default function GlobalNetwork({ hubs }) {
  const canvasRef = useRef(null);
  const labelRefs = useRef([]);
  const [wrapRef, visible] = useVisible();
  const clock = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const N = window.innerWidth < 700 ? 900 : 1600;
    const g = Math.PI * (3 - Math.sqrt(5));
    const pts = Array.from({ length: N }, (_, i) => {
      const y = 1 - (i / (N - 1)) * 2, r = Math.sqrt(1 - y * y);
      return [Math.cos(g * i) * r, y, Math.sin(g * i) * r];
    });
    const toVec = (lat, lon) => {
      const la = (lat * Math.PI) / 180, lo = (lon * Math.PI) / 180;
      return [Math.cos(la) * Math.sin(lo), Math.sin(la), Math.cos(la) * Math.cos(lo)];
    };
    const H = hubs.map((h) => toVec(h.lat, h.lon));
    const pairs = [];
    H.forEach((_, i) => H.forEach((__, j) => { if (j > i) pairs.push([i, j]); }));

    let W = 0, Hh = 0, R = 0, raf = 0, t = clock.current, last = performance.now();
    const resize = () => {
      const r = canvas.getBoundingClientRect();
      W = r.width; Hh = r.height; R = Math.min(W, Hh) * (W < 520 ? 0.38 : 0.42);
      canvas.width = W * dpr; canvas.height = Hh * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    const rot = (p, a) => {
      const tilt = 0.38;
      let [x, y, z] = p;
      const cx = Math.cos(a), sx = Math.sin(a);
      [x, z] = [x * cx + z * sx, -x * sx + z * cx];
      const ct = Math.cos(tilt), st = Math.sin(tilt);
      [y, z] = [y * ct - z * st, y * st + z * ct];
      return [x, y, z];
    };
    const slerp = (a, b, s) => {
      const d = Math.acos(Math.min(1, a[0] * b[0] + a[1] * b[1] + a[2] * b[2]));
      const sd = Math.sin(d) || 1;
      const k1 = Math.sin((1 - s) * d) / sd, k2 = Math.sin(s * d) / sd;
      const lift = 1 + Math.sin(Math.PI * s) * 0.18;
      return [(a[0] * k1 + b[0] * k2) * lift, (a[1] * k1 + b[1] * k2) * lift, (a[2] * k1 + b[2] * k2) * lift];
    };

    const draw = () => {
      ctx.clearRect(0, 0, W, Hh);
      const cx = W / 2, cy = Hh / 2, a = -0.9 + Math.sin(t * 0.12) * 0.85; // sway across the hubs
      // atmosphere
      const grd = ctx.createRadialGradient(cx, cy, R * 0.7, cx, cy, R * 1.25);
      grd.addColorStop(0, "rgba(23,100,255,0.10)"); grd.addColorStop(1, "rgba(23,100,255,0)");
      ctx.fillStyle = grd; ctx.beginPath(); ctx.arc(cx, cy, R * 1.25, 0, Math.PI * 2); ctx.fill();
      // points
      for (const p of pts) {
        const [x, y, z] = rot(p, a);
        if (z < -0.15) continue;
        const al = 0.1 + Math.max(0, z) * 0.6;
        ctx.fillStyle = `rgba(190,210,255,${al.toFixed(3)})`;
        ctx.fillRect(cx + x * R, cy - y * R, 1.6, 1.6);
      }
      // arcs
      pairs.forEach(([i, j], k) => {
        ctx.beginPath();
        let started = false;
        for (let s = 0; s <= 1.0001; s += 0.04) {
          const [x, y, z] = rot(slerp(H[i], H[j], s), a);
          if (z < -0.05) { started = false; continue; }
          const X = cx + x * R, Y = cy - y * R;
          started ? ctx.lineTo(X, Y) : ctx.moveTo(X, Y);
          started = true;
        }
        ctx.strokeStyle = "rgba(61,130,255,0.55)"; ctx.lineWidth = 1.2; ctx.stroke();
        // packet
        const s = (t * 0.18 + k * 0.137) % 1;
        const [x, y, z] = rot(slerp(H[i], H[j], s), a);
        if (z > 0) { ctx.fillStyle = "rgba(111,211,255,0.9)"; ctx.beginPath(); ctx.arc(cx + x * R, cy - y * R, 1.8, 0, Math.PI * 2); ctx.fill(); }
      });
      // hubs + labels
      H.forEach((h, i) => {
        const [x, y, z] = rot(h, a);
        const el = labelRefs.current[i];
        const X = cx + x * R, Y = cy - y * R;
        if (el) {
          // labels on the right half sit to the left of their node so they never leave the frame
          el.style.transform = `translate3d(${X.toFixed(1)}px, ${Y.toFixed(1)}px, 0)${X > W * 0.55 ? " translateX(calc(-100% - 1.2rem))" : ""}`;
          el.style.opacity = z > 0.05 ? "1" : "0";
        }
        if (z <= 0) return;
        ctx.fillStyle = "#cfe0ff"; ctx.beginPath(); ctx.arc(X, Y, 3, 0, Math.PI * 2); ctx.fill();
        ctx.strokeStyle = "rgba(23,100,255,0.7)"; ctx.beginPath(); ctx.arc(X, Y, 7 + Math.sin(t * 2 + i) * 2, 0, Math.PI * 2); ctx.stroke();
      });
    };

    const loop = (now) => {
      t += Math.min(0.05, (now - last) / 1000); last = now; clock.current = t;
      draw();
      raf = requestAnimationFrame(loop);
    };
    const ro = new ResizeObserver(() => { resize(); draw(); });
    ro.observe(canvas);
    resize();
    if (visible && !prefersReducedMotion()) { last = performance.now(); raf = requestAnimationFrame(loop); } else draw();
    return () => { cancelAnimationFrame(raf); ro.disconnect(); };
  }, [hubs, visible]);

  return (
    <div ref={wrapRef} className="globe">
      <canvas ref={canvasRef} className="globe__canvas" aria-hidden="true" />
      {hubs.map((h, i) => (
        <span key={h.id} ref={(el) => (labelRefs.current[i] = el)} className="globe__label mono">{h.name}</span>
      ))}
    </div>
  );
}
