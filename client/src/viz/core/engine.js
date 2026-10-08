/**
 * Superintelligence Core — WebGL scene (Three.js).
 *
 * A computational core (particle shell + geometric nucleus + firing neural
 * links + orbital rings) streaming data to the company functions around it.
 * All particle motion runs in vertex shaders; the CPU only updates a handful
 * of uniforms and label positions per frame.
 */
import {
  AdditiveBlending, BufferAttribute, BufferGeometry, Color, EdgesGeometry, Group, IcosahedronGeometry,
  LineBasicMaterial, LineLoop, LineSegments, OctahedronGeometry, PerspectiveCamera, Points, Scene,
  ShaderMaterial, Vector3, WebGLRenderer,
} from "three";

const ICE = new Color("#cfe0ff");
const BLUE = new Color("#1764ff");
const CYAN = new Color("#6fd3ff");
const FOV = 36;
const DIST = 10;
const CORE_R = 1.6; // model-space radius of the shell

const rand = (a, b) => a + Math.random() * (b - a);

/* ---------------------------------------------------------------- shaders */
const POINT_FRAG = /* glsl */ `
  varying vec3 vColor; varying float vAlpha;
  void main() {
    float d = length(gl_PointCoord - 0.5);
    float a = smoothstep(0.5, 0.0, d);
    gl_FragColor = vec4(vColor, a * a * vAlpha);
  }`;

const CORE_VERT = /* glsl */ `
  uniform float uTime; uniform float uPixel; uniform vec3 uA; uniform vec3 uB; uniform vec3 uC;
  attribute float aPhase; attribute float aSize;
  varying vec3 vColor; varying float vAlpha;
  void main() {
    vec3 p = position;
    float r = length(p);
    float wave = sin(uTime * 0.7 + aPhase * 6.2831 + p.y * 2.6) * 0.035
               + sin(uTime * 1.1 + p.x * 3.4 + p.z * 1.7) * 0.025;
    p *= 1.0 + wave;
    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    gl_Position = projectionMatrix * mv;
    gl_PointSize = aSize * uPixel * (17.0 / -mv.z);
    float shell = smoothstep(0.55, 1.0, r / ${CORE_R.toFixed(2)});
    float pulse = 0.55 + 0.45 * sin(uTime * 1.6 + aPhase * 12.0);
    vColor = mix(mix(uB, uC, aPhase * 0.35), uA, shell * 0.65);
    vAlpha = (0.22 + 0.7 * shell) * pulse;
  }`;

const STREAM_VERT = /* glsl */ `
  uniform float uTime; uniform float uPixel; uniform float uCoreR; uniform vec3 uAnchors[10]; uniform vec3 uA; uniform vec3 uB;
  attribute float aIdx; attribute vec3 aDir; attribute float aOff; attribute float aSpeed; attribute float aBend;
  varying vec3 vColor; varying float vAlpha;
  void main() {
    vec3 S = aDir * uCoreR * 1.02;
    vec3 E = uAnchors[int(aIdx)];
    vec3 N = normalize(vec3(-E.y, E.x, 0.6) + 0.0001);
    vec3 C = (S + E) * 0.5 + N * aBend * uCoreR;
    float t = fract(aOff + uTime * aSpeed);
    vec3 p = mix(mix(S, C, t), mix(C, E, t), t);
    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    gl_Position = projectionMatrix * mv;
    gl_PointSize = (1.6 + 2.2 * (1.0 - t)) * uPixel * (20.0 / -mv.z);
    vColor = mix(uA, uB, t);
    vAlpha = smoothstep(0.0, 0.1, t) * (1.0 - smoothstep(0.85, 1.0, t)) * 0.9;
  }`;

const NODE_VERT = /* glsl */ `
  uniform float uTime; uniform float uPixel;
  attribute float aPhase;
  varying float vPulse;
  void main() {
    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    gl_Position = projectionMatrix * mv;
    vPulse = 0.5 + 0.5 * sin(uTime * 2.0 + aPhase * 6.2831);
    gl_PointSize = (22.0 + 6.0 * vPulse) * uPixel * (10.0 / -mv.z);
  }`;
const NODE_FRAG = /* glsl */ `
  uniform vec3 uA; uniform vec3 uB; varying float vPulse;
  void main() {
    float d = length(gl_PointCoord - 0.5) * 2.0;
    float core = smoothstep(0.22, 0.0, d);
    float ring = smoothstep(0.08, 0.0, abs(d - 0.62)) * (0.35 + 0.4 * vPulse);
    float glow = smoothstep(1.0, 0.0, d) * 0.18;
    vec3 c = mix(uB, uA, core);
    gl_FragColor = vec4(c, core + ring + glow);
  }`;

const LINK_VERT = /* glsl */ `
  uniform float uTime; attribute float aPhase; varying float vA;
  void main() {
    float f = pow(0.5 + 0.5 * sin(uTime * 1.2 + aPhase * 6.2831), 8.0);
    vA = 0.015 + 0.32 * f;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }`;
const LINK_FRAG = /* glsl */ `
  uniform vec3 uA; varying float vA;
  void main() { gl_FragColor = vec4(uA, vA); }`;

const DUST_VERT = /* glsl */ `
  uniform float uTime; uniform float uPixel; attribute float aPhase;
  varying vec3 vColor; varying float vAlpha;
  void main() {
    vec3 p = position;
    p.x += sin(uTime * 0.05 + aPhase * 6.28) * 0.4;
    p.y += cos(uTime * 0.04 + aPhase * 3.14) * 0.3;
    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    gl_Position = projectionMatrix * mv;
    gl_PointSize = 2.2 * uPixel * (14.0 / -mv.z);
    vColor = vec3(0.75, 0.83, 1.0);
    vAlpha = 0.16 + 0.14 * sin(uTime * 0.8 + aPhase * 20.0);
  }`;

const additive = { transparent: true, depthWrite: false, blending: AdditiveBlending };

/* ------------------------------------------------------------- geometry */
function fibonacciSphere(n) {
  const out = [];
  const g = Math.PI * (3 - Math.sqrt(5));
  for (let i = 0; i < n; i++) {
    const y = 1 - (i / (n - 1)) * 2;
    const r = Math.sqrt(1 - y * y);
    out.push(new Vector3(Math.cos(g * i) * r, y, Math.sin(g * i) * r));
  }
  return out;
}

function buildCore(count) {
  const pos = new Float32Array(count * 3);
  const phase = new Float32Array(count);
  const size = new Float32Array(count);
  const dirs = fibonacciSphere(count);
  for (let i = 0; i < count; i++) {
    const shell = Math.random() < 0.78;
    const r = shell ? CORE_R * rand(0.94, 1.04) : CORE_R * Math.pow(Math.random(), 0.6) * 0.92;
    const d = shell ? dirs[i] : new Vector3(rand(-1, 1), rand(-1, 1), rand(-1, 1)).normalize();
    pos.set([d.x * r, d.y * r, d.z * r], i * 3);
    phase[i] = Math.random();
    size[i] = shell ? rand(0.9, 2.1) : rand(0.6, 1.4);
  }
  const g = new BufferGeometry();
  g.setAttribute("position", new BufferAttribute(pos, 3));
  g.setAttribute("aPhase", new BufferAttribute(phase, 1));
  g.setAttribute("aSize", new BufferAttribute(size, 1));
  return g;
}

function buildLinks(samples) {
  const pts = fibonacciSphere(samples).map((d) => d.multiplyScalar(CORE_R * rand(0.95, 1.02)));
  const verts = [], phases = [];
  pts.forEach((p, i) => {
    const near = pts
      .map((q, j) => [j, p.distanceToSquared(q)])
      .filter(([j]) => j !== i)
      .sort((a, b) => a[1] - b[1])
      .slice(0, 2);
    const ph = Math.random();
    near.forEach(([j]) => { verts.push(p.x, p.y, p.z, pts[j].x, pts[j].y, pts[j].z); phases.push(ph, ph); });
  });
  const g = new BufferGeometry();
  g.setAttribute("position", new BufferAttribute(new Float32Array(verts), 3));
  g.setAttribute("aPhase", new BufferAttribute(new Float32Array(phases), 1));
  return g;
}

function buildStreams(perAnchor, anchors) {
  // Particles travel in a few coherent lanes per function so the flow reads as
  // pathways, not noise.
  const LANES = 4;
  const lanes = Array.from({ length: anchors * LANES }, () => ({
    dir: new Vector3(rand(-1, 1), rand(-1, 1), rand(-1, 1)).normalize(),
    bend: rand(-0.8, 0.8),
    speed: rand(0.06, 0.11),
  }));
  const n = perAnchor * anchors;
  const idx = new Float32Array(n), dir = new Float32Array(n * 3), off = new Float32Array(n);
  const speed = new Float32Array(n), bend = new Float32Array(n);
  for (let i = 0; i < n; i++) {
    const a = i % anchors;
    const lane = lanes[a * LANES + Math.floor(Math.random() * LANES)];
    const d = lane.dir.clone().add(new Vector3(rand(-0.05, 0.05), rand(-0.05, 0.05), rand(-0.05, 0.05))).normalize();
    idx[i] = a;
    dir.set([d.x, d.y, d.z], i * 3);
    off[i] = Math.random();
    speed[i] = lane.speed * rand(0.92, 1.08);
    bend[i] = lane.bend + rand(-0.04, 0.04);
  }
  const g = new BufferGeometry();
  g.setAttribute("position", new BufferAttribute(new Float32Array(n * 3), 3)); // computed in shader
  g.setAttribute("aIdx", new BufferAttribute(idx, 1));
  g.setAttribute("aDir", new BufferAttribute(dir, 3));
  g.setAttribute("aOff", new BufferAttribute(off, 1));
  g.setAttribute("aSpeed", new BufferAttribute(speed, 1));
  g.setAttribute("aBend", new BufferAttribute(bend, 1));
  return g;
}

function ring(radius, segments, color, opacity) {
  const pts = new Float32Array(segments * 3);
  for (let i = 0; i < segments; i++) {
    const a = (i / segments) * Math.PI * 2;
    pts.set([Math.cos(a) * radius, Math.sin(a) * radius, 0], i * 3);
  }
  const g = new BufferGeometry();
  g.setAttribute("position", new BufferAttribute(pts, 3));
  const line = new LineLoop(g, new LineBasicMaterial({ color, transparent: true, opacity, depthWrite: false, blending: AdditiveBlending }));
  // satellites riding the ring
  const sat = new Float32Array(9), ph = new Float32Array(3);
  for (let i = 0; i < 3; i++) {
    const a = rand(0, Math.PI * 2);
    sat.set([Math.cos(a) * radius, Math.sin(a) * radius, 0], i * 3);
    ph[i] = Math.random();
  }
  const sg = new BufferGeometry();
  sg.setAttribute("position", new BufferAttribute(sat, 3));
  sg.setAttribute("aPhase", new BufferAttribute(ph, 1));
  return { line, satGeom: sg };
}

/* ----------------------------------------------------------------- scene */
export function createCore(canvas, { labels = [], getLayout, lite = false }) {
  const renderer = new WebGLRenderer({ canvas, antialias: false, alpha: true, powerPreference: "high-performance" });
  renderer.setClearColor(0x000000, 0);
  const dpr = Math.min(window.devicePixelRatio || 1, lite ? 1.25 : 1.75);
  renderer.setPixelRatio(dpr);

  const scene = new Scene();
  const camera = new PerspectiveCamera(FOV, 1, 0.1, 100);
  camera.position.set(0, 0, DIST);

  const uniforms = {
    // uPixel = devicePixelRatio × resolution scale (set in layout)
    uTime: { value: 0 }, uPixel: { value: dpr }, uA: { value: ICE }, uB: { value: BLUE }, uC: { value: CYAN },
  };

  const world = new Group(); // receives pointer tilt
  scene.add(world);

  /* core */
  const coreGroup = new Group();
  world.add(coreGroup);
  const corePts = new Points(buildCore(lite ? 6000 : 18000), new ShaderMaterial({ uniforms, vertexShader: CORE_VERT, fragmentShader: POINT_FRAG, ...additive }));
  corePts.frustumCulled = false;
  coreGroup.add(corePts);

  const links = new LineSegments(buildLinks(lite ? 110 : 220), new ShaderMaterial({ uniforms, vertexShader: LINK_VERT, fragmentShader: LINK_FRAG, ...additive }));
  coreGroup.add(links);

  const nucleusA = new LineSegments(new EdgesGeometry(new IcosahedronGeometry(0.55, 1)), new LineBasicMaterial({ color: ICE, transparent: true, opacity: 0.22, ...additive }));
  const nucleusB = new LineSegments(new EdgesGeometry(new OctahedronGeometry(1.0)), new LineBasicMaterial({ color: BLUE, transparent: true, opacity: 0.3, ...additive }));
  coreGroup.add(nucleusA, nucleusB);

  /* orbital rings */
  const rings = [
    { r: 2.25, tilt: [1.2, 0.2, 0], speed: 0.06, op: 0.22 },
    { r: 2.75, tilt: [1.45, -0.35, 0.4], speed: -0.04, op: 0.16 },
    { r: 3.3, tilt: [1.05, 0.5, -0.3], speed: 0.025, op: 0.1 },
  ].map((cfg) => {
    const { line, satGeom } = ring(cfg.r, 160, BLUE, cfg.op);
    const holder = new Group();
    holder.rotation.set(...cfg.tilt);
    const spinner = new Group();
    spinner.add(line);
    const sats = new Points(satGeom, new ShaderMaterial({ uniforms, vertexShader: NODE_VERT, fragmentShader: NODE_FRAG, ...additive }));
    sats.scale.setScalar(1);
    spinner.add(sats);
    holder.add(spinner);
    coreGroup.add(holder);
    return { spinner, speed: cfg.speed };
  });

  /* anchors + streams (world space, not rotating with the core) */
  const A = labels.length || 10;
  const anchorVecs = Array.from({ length: 10 }, () => new Vector3());
  const streamUniforms = { ...uniforms, uAnchors: { value: anchorVecs }, uCoreR: { value: CORE_R } };
  const streams = new Points(buildStreams(lite ? 160 : 360, A), new ShaderMaterial({ uniforms: streamUniforms, vertexShader: STREAM_VERT, fragmentShader: POINT_FRAG, ...additive }));
  streams.frustumCulled = false;
  world.add(streams);

  const nodeGeom = new BufferGeometry();
  nodeGeom.setAttribute("position", new BufferAttribute(new Float32Array(A * 3), 3));
  nodeGeom.setAttribute("aPhase", new BufferAttribute(Float32Array.from({ length: A }, (_, i) => i / A), 1));
  const nodes = new Points(nodeGeom, new ShaderMaterial({ uniforms, vertexShader: NODE_VERT, fragmentShader: NODE_FRAG, ...additive }));
  nodes.frustumCulled = false;
  world.add(nodes);

  /* ambient dust */
  const dustN = lite ? 400 : 900;
  const dustPos = new Float32Array(dustN * 3), dustPh = new Float32Array(dustN);
  for (let i = 0; i < dustN; i++) { dustPos.set([rand(-14, 14), rand(-8, 8), rand(-8, 2)], i * 3); dustPh[i] = Math.random(); }
  const dustGeom = new BufferGeometry();
  dustGeom.setAttribute("position", new BufferAttribute(dustPos, 3));
  dustGeom.setAttribute("aPhase", new BufferAttribute(dustPh, 1));
  const dust = new Points(dustGeom, new ShaderMaterial({ uniforms, vertexShader: DUST_VERT, fragmentShader: POINT_FRAG, ...additive }));
  dust.frustumCulled = false;
  scene.add(dust);

  /* layout */
  let W = 1, H = 1, worldPerPx = 0.01, coreScale = 1;
  const tmp = new Vector3();

  function layout() {
    const rect = canvas.getBoundingClientRect();
    W = Math.max(1, rect.width); H = Math.max(1, rect.height);
    renderer.setSize(W, H, false);
    camera.aspect = W / H;
    const { cx = W / 2, cy = H / 2, stageW = W, stageH = H } = getLayout ? getLayout() : {};
    // Shift the projection so the scene origin lands on the stage center.
    camera.setViewOffset(W, H, W / 2 - cx, H / 2 - cy, W, H);
    camera.updateProjectionMatrix();

    // Keep particles the same apparent size from laptop to 4K.
    uniforms.uPixel.value = dpr * Math.min(2.4, Math.max(0.85, H / 900));
    worldPerPx = (2 * Math.tan((FOV * Math.PI) / 360) * DIST) / H;
    const narrow = stageW < 700;
    const coreRpx = Math.min(stageW * (narrow ? 0.2 : 0.13), stageH * 0.26);
    coreScale = (coreRpx * worldPerPx) / CORE_R;
    coreGroup.scale.setScalar(coreScale);
    streamUniforms.uCoreR.value = CORE_R * coreScale;

    const rx = stageW * (narrow ? 0.4 : 0.42) * worldPerPx;
    const ry = stageH * (narrow ? 0.4 : 0.36) * worldPerPx;
    const pos = nodeGeom.attributes.position;
    for (let i = 0; i < A; i++) {
      const a = -Math.PI / 2 + Math.PI / A + (i / A) * Math.PI * 2;
      anchorVecs[i].set(Math.cos(a) * rx, Math.sin(a) * ry, Math.sin(a + 0.6) * 0.8);
      pos.setXYZ(i, anchorVecs[i].x, anchorVecs[i].y, anchorVecs[i].z);
    }
    pos.needsUpdate = true;
  }

  function placeLabels() {
    for (let i = 0; i < labels.length; i++) {
      const el = labels[i];
      if (!el) continue;
      tmp.copy(anchorVecs[i]).applyMatrix4(world.matrixWorld).project(camera);
      const x = (tmp.x * 0.5 + 0.5) * W;
      const y = (-tmp.y * 0.5 + 0.5) * H;
      el.style.transform = `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, 0) translate(-50%, -50%)`;
    }
  }

  /* loop */
  let raf = 0, running = false, last = performance.now(), t = 6;
  const pointer = { x: 0, y: 0, tx: 0, ty: 0 };

  function frame(now) {
    const dt = Math.min(0.05, (now - last) / 1000);
    last = now;
    t += dt;
    uniforms.uTime.value = t;
    coreGroup.rotation.y += dt * 0.08;
    coreGroup.rotation.x = Math.sin(t * 0.1) * 0.12;
    nucleusA.rotation.set(t * 0.21, t * 0.17, 0);
    nucleusB.rotation.set(-t * 0.11, -t * 0.13, t * 0.05);
    rings.forEach((r) => (r.spinner.rotation.z += dt * r.speed * 4));
    pointer.x += (pointer.tx - pointer.x) * 0.04;
    pointer.y += (pointer.ty - pointer.y) * 0.04;
    world.rotation.set(pointer.y * 0.12, pointer.x * 0.2, 0);
    world.updateMatrixWorld();
    renderer.render(scene, camera);
    placeLabels();
    if (running) raf = requestAnimationFrame(frame);
  }

  const ro = new ResizeObserver(() => { layout(); if (!running) renderOnce(); });
  ro.observe(canvas);
  layout();

  function renderOnce() { world.updateMatrixWorld(); renderer.render(scene, camera); placeLabels(); }

  return {
    start() { if (running) return; running = true; last = performance.now(); raf = requestAnimationFrame(frame); },
    stop() { running = false; cancelAnimationFrame(raf); },
    renderOnce,
    relayout() { layout(); if (!running) renderOnce(); },
    setPointer(x, y) { pointer.tx = x; pointer.ty = y; },
    dispose() {
      running = false; cancelAnimationFrame(raf); ro.disconnect();
      scene.traverse((o) => { o.geometry?.dispose(); o.material?.dispose(); });
      renderer.dispose();
    },
  };
}
