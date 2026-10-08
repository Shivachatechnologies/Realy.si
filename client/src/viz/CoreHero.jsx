import { useEffect, useRef, useState } from "react";
import { prefersReducedMotion } from "../lib/motion.js";

const hasWebGL = () => {
  try {
    const c = document.createElement("canvas");
    return !!(window.WebGLRenderingContext && (c.getContext("webgl2") || c.getContext("webgl")));
  } catch { return false; }
};

/**
 * Full-bleed canvas behind the hero. The engine (and Three.js) is code-split and
 * only loaded after first paint; a static CSS poster shows until then, and
 * permanently when WebGL is unavailable.
 */
export default function CoreHero({ functions, stageRef, containerRef }) {
  const canvasRef = useRef(null);
  const labelRefs = useRef([]);
  const [state, setState] = useState("poster"); // poster | live | static

  useEffect(() => {
    if (!hasWebGL()) return;
    let engine, io, disposed = false, visible = true;
    const reduced = prefersReducedMotion();
    const lite = window.innerWidth < 768 || (navigator.hardwareConcurrency || 8) <= 4;

    const getLayout = () => {
      const c = canvasRef.current?.getBoundingClientRect();
      const s = stageRef.current?.getBoundingClientRect();
      if (!c || !s) return {};
      return { cx: s.left - c.left + s.width / 2, cy: s.top - c.top + s.height / 2, stageW: s.width, stageH: s.height };
    };

    const boot = () => import("./core/engine.js").then(({ createCore }) => {
      if (disposed || !canvasRef.current) return;
      engine = createCore(canvasRef.current, { labels: labelRefs.current, getLayout, lite });
      if (reduced) { engine.renderOnce(); setState("static"); return; }
      setState("live");
      io = new IntersectionObserver(([e]) => {
        visible = e.isIntersecting;
        visible && !document.hidden ? engine.start() : engine.stop();
      });
      io.observe(canvasRef.current);
    });

    const onVis = () => engine && (document.hidden || !visible ? engine.stop() : engine.start());
    const onMove = (e) => {
      if (!engine) return;
      engine.setPointer((e.clientX / window.innerWidth) * 2 - 1, (e.clientY / window.innerHeight) * 2 - 1);
    };
    document.addEventListener("visibilitychange", onVis);
    const host = containerRef.current;
    host?.addEventListener("pointermove", onMove);
    const idle = window.requestIdleCallback || ((fn) => setTimeout(fn, 200));
    idle(boot);

    // Fonts change the stage position once they load.
    document.fonts?.ready.then(() => engine?.relayout());

    return () => {
      disposed = true;
      document.removeEventListener("visibilitychange", onVis);
      host?.removeEventListener("pointermove", onMove);
      io?.disconnect();
      engine?.dispose();
    };
  }, [stageRef, containerRef]);

  return (
    <div className={`core core--${state}`} aria-hidden="true">
      <div className="core__poster" />
      <canvas ref={canvasRef} className="core__canvas" />
      <div className="core__labels">
        {functions.slice(0, 10).map((f, i) => (
          <span key={f} ref={(el) => (labelRefs.current[i] = el)} className="core__label mono">
            <i />{f}
          </span>
        ))}
      </div>
    </div>
  );
}
