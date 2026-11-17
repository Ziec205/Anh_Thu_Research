// Light three.js effects. Everything degrades silently if WebGL / the CDN is unavailable.
//  1. Ambient sakura petals drifting over the whole app (+ burst() for celebrations)
//  2. Hero ensō ring with water ripples on the home page

let threeP = null;
const loadThree = () => (threeP ||= import('three').catch(() => null));

const reduceMotion = () => matchMedia('(prefers-reduced-motion: reduce)').matches;
const small = () => innerWidth < 700;
function webgl() {
  try { const c = document.createElement('canvas'); return !!(c.getContext('webgl2') || c.getContext('webgl')); } catch { return false; }
}

// ---------------------------------------------------------------------------
// 1. Petals
// ---------------------------------------------------------------------------
let petals = null;

export async function initPetals(canvas) {
  if (!canvas || !webgl()) return;
  const THREE = await loadThree();
  if (!THREE) return;

  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true, powerPreference: 'low-power' });
  renderer.setPixelRatio(Math.min(devicePixelRatio || 1, 1.5));
  const scene = new THREE.Scene();
  const cam = new THREE.OrthographicCamera(-1, 1, 1, -1, -1000, 1000);
  cam.position.z = 10;

  // Petal outline (teardrop with a tiny notch at the tip)
  const shape = new THREE.Shape();
  shape.moveTo(0, 0);
  shape.bezierCurveTo(9, 5, 11, 17, 2.2, 24);
  shape.lineTo(0, 21);
  shape.lineTo(-2.2, 24);
  shape.bezierCurveTo(-11, 17, -9, 5, 0, 0);
  const geo = new THREE.ShapeGeometry(shape, 8);
  geo.translate(0, -12, 0);
  const mat = new THREE.MeshBasicMaterial({ transparent: true, opacity: 0.78, side: THREE.DoubleSide, depthWrite: false });

  const MAX = small() ? 46 : 90;
  let base = reduceMotion() ? 0 : small() ? 12 : 24;
  const mesh = new THREE.InstancedMesh(geo, mat, MAX);
  mesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
  const palette = ['#ffd9df', '#feaebe', '#ffc2cd', '#fff0f3', '#f7a7b6'].map((c) => new THREE.Color(c));
  for (let i = 0; i < MAX; i++) mesh.setColorAt(i, palette[i % palette.length]);
  scene.add(mesh);

  let W = 1, H = 1;
  const P = Array.from({ length: MAX }, () => ({}));
  const spawn = (p, anywhere, fromTop = true) => {
    p.x = (Math.random() - 0.5) * W; p.y = anywhere ? (Math.random() - 0.5) * H : H / 2 + 30 + Math.random() * 60;
    if (!fromTop) { p.x = (Math.random() - 0.5) * W * 0.4; p.y = H * 0.15; }
    p.s = 0.55 + Math.random() * 0.8;        // size
    p.vy = 22 + Math.random() * 30;          // fall speed px/s
    p.sw = 14 + Math.random() * 26;          // sway amplitude
    p.ph = Math.random() * 6.28; p.rx = (Math.random() - 0.5) * 2.4; p.ry = (Math.random() - 0.5) * 2.4; p.rz = (Math.random() - 0.5) * 1.6;
    p.ax = Math.random() * 6.28; p.ay = Math.random() * 6.28; p.az = Math.random() * 6.28;
  };
  const resize = () => {
    W = innerWidth; H = innerHeight;
    renderer.setSize(W, H, false);
    cam.left = -W / 2; cam.right = W / 2; cam.top = H / 2; cam.bottom = -H / 2; cam.updateProjectionMatrix();
    P.forEach((p) => spawn(p, true));
  };
  resize();
  addEventListener('resize', resize);

  let wind = 0, windTarget = 0, boost = 0, running = true, last = performance.now(), t = 0;
  addEventListener('pointermove', (e) => { windTarget = (e.clientX / W - 0.5) * 36; }, { passive: true });
  document.addEventListener('visibilitychange', () => { running = !document.hidden; if (running) { last = performance.now(); loop(); } });

  const dummy = new THREE.Object3D();
  function loop() {
    if (!running) return;
    const now = performance.now(), dt = Math.min(0.05, (now - last) / 1000); last = now; t += dt;
    wind += (windTarget - wind) * Math.min(1, dt * 2);
    if (boost > 0) { boost = Math.max(0, boost - dt); if (boost === 0) canvas.style.zIndex = ''; }
    const active = base + (boost > 0 ? MAX - base : 0);
    for (let i = 0; i < MAX; i++) {
      const p = P[i];
      if (i >= active) { // fade out extras: park them off-screen once they leave
        if (p.y < -H / 2 - 40) { dummy.scale.set(0, 0, 0); dummy.updateMatrix(); mesh.setMatrixAt(i, dummy.matrix); continue; }
      }
      const fast = boost > 0 ? 2.2 : 1;
      p.y -= p.vy * dt * fast;
      p.x += (Math.sin(t * 0.9 + p.ph) * p.sw + wind) * dt;
      p.ax += p.rx * dt; p.ay += p.ry * dt; p.az += p.rz * dt;
      if (p.y < -H / 2 - 40) { if (i < active) spawn(p, false); else continue; }
      if (p.x > W / 2 + 40) p.x = -W / 2 - 30; else if (p.x < -W / 2 - 40) p.x = W / 2 + 30;
      dummy.position.set(p.x, p.y, 0);
      dummy.rotation.set(p.ax, p.ay, p.az);
      dummy.scale.setScalar(p.s * (small() ? 0.85 : 1));
      dummy.updateMatrix();
      mesh.setMatrixAt(i, dummy.matrix);
    }
    mesh.instanceMatrix.needsUpdate = true;
    renderer.render(scene, cam);
    requestAnimationFrame(loop);
  }
  // park all extras initially
  for (let i = base; i < MAX; i++) P[i].y = -H;
  loop();

  petals = {
    burst(sec = 3.5) {
      if (reduceMotion()) return;
      boost = sec; canvas.style.zIndex = '110'; // float above modals while celebrating
      for (let i = 0; i < MAX; i++) if (i >= base) spawn(P[i], false, false), (P[i].y = H / 2 + Math.random() * H * 0.3);
    },
  };
}

export const burst = (sec) => petals?.burst(sec);

// ---------------------------------------------------------------------------
// 2. Hero ensō + ripples
// ---------------------------------------------------------------------------
export async function initHero(canvas) {
  if (!canvas || !webgl()) return () => {};
  const THREE = await loadThree();
  if (!THREE || !canvas.isConnected) return () => {};

  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true, powerPreference: 'low-power' });
  renderer.setPixelRatio(Math.min(devicePixelRatio || 1, 2));
  const scene = new THREE.Scene();
  const cam = new THREE.PerspectiveCamera(38, 1, 0.1, 50);
  cam.position.set(0, 0.2, 6.2);

  scene.add(new THREE.AmbientLight(0xffffff, 0.9));
  const key = new THREE.DirectionalLight(0xffffff, 1.6); key.position.set(3, 4, 5); scene.add(key);
  const rim = new THREE.PointLight(0xfeaebe, 14, 12); rim.position.set(-3, -1, 3); scene.add(rim);

  const group = new THREE.Group(); scene.add(group);

  // Ensō: an open brush-stroke ring
  const arc = Math.PI * 1.82;
  const ring = new THREE.Mesh(
    new THREE.TorusGeometry(1.35, 0.17, 28, 160, arc),
    new THREE.MeshStandardMaterial({ color: 0x1e7e48, roughness: 0.38, metalness: 0.12 }),
  );
  ring.rotation.z = Math.PI * 0.62; group.add(ring);

  // Gold bead at the stroke end (kintsugi nod)
  const bead = new THREE.Mesh(new THREE.SphereGeometry(0.24, 32, 24), new THREE.MeshStandardMaterial({ color: 0xc9992f, roughness: 0.25, metalness: 0.85 }));
  const a0 = Math.PI * 0.62 + arc;
  bead.position.set(Math.cos(a0) * 1.35, Math.sin(a0) * 1.35, 0); group.add(bead);

  // Matcha-powder particles orbiting loosely
  const N = 120, pos = new Float32Array(N * 3), seed = [];
  for (let i = 0; i < N; i++) { const a = Math.random() * 6.28, r = 1.7 + Math.random() * 1.2; seed.push([a, r, (Math.random() - .5) * 1.6, 0.1 + Math.random() * 0.25]); }
  const pg = new THREE.BufferGeometry(); pg.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  const pts = new THREE.Points(pg, new THREE.PointsMaterial({ color: 0x7fd99a, size: 0.05, transparent: true, opacity: 0.85, depthWrite: false }));
  group.add(pts);

  // Water ripples under the ring
  const ripples = [0, 1, 2].map((i) => {
    const m = new THREE.Mesh(new THREE.RingGeometry(0.98, 1, 96), new THREE.MeshBasicMaterial({ color: 0x1e7e48, transparent: true, opacity: 0, side: THREE.DoubleSide, depthWrite: false }));
    m.rotation.x = -Math.PI / 2.4; m.position.y = -1.7; scene.add(m); m.userData.o = i / 3; return m;
  });

  let w = 0, h = 0;
  const fit = () => {
    const r = canvas.getBoundingClientRect(); w = Math.max(1, r.width); h = Math.max(1, r.height);
    renderer.setSize(w, h, false); cam.aspect = w / h;
    cam.position.z = w / h < 1 ? 7.2 : 6.2; cam.updateProjectionMatrix();
  };
  fit();
  const ro = new ResizeObserver(fit); ro.observe(canvas);

  let px = 0, py = 0, tx = 0, ty = 0, visible = true, raf = 0, last = performance.now(), t = 0;
  const onMove = (e) => { const r = canvas.getBoundingClientRect(); tx = ((e.clientX - r.left) / r.width - 0.5) * 2; ty = ((e.clientY - r.top) / r.height - 0.5) * 2; };
  addEventListener('pointermove', onMove, { passive: true });
  const io = new IntersectionObserver(([en]) => { visible = en.isIntersecting; if (visible && !raf) loop(); });
  io.observe(canvas);
  const still = reduceMotion();

  function loop() {
    raf = 0;
    if (!visible || !canvas.isConnected) return;
    const now = performance.now(), dt = Math.min(0.05, (now - last) / 1000); last = now;
    if (!still) t += dt;
    px += (tx - px) * 0.06; py += (ty - py) * 0.06;
    group.rotation.y = Math.sin(t * 0.4) * 0.5 + px * 0.5;
    group.rotation.x = -0.25 + py * 0.25 + Math.sin(t * 0.3) * 0.05;
    ring.rotation.z += still ? 0 : dt * 0.35;
    const a = ring.rotation.z + arc; bead.position.set(Math.cos(a) * 1.35, Math.sin(a) * 1.35, 0);
    const arr = pg.attributes.position.array;
    for (let i = 0; i < N; i++) {
      const s = seed[i], ang = s[0] + t * s[3];
      arr[i * 3] = Math.cos(ang) * s[1]; arr[i * 3 + 1] = s[2] + Math.sin(t * 0.8 + i) * 0.08; arr[i * 3 + 2] = Math.sin(ang) * s[1] * 0.6;
    }
    pg.attributes.position.needsUpdate = true;
    ripples.forEach((m) => { const k = ((t * 0.28 + m.userData.o) % 1); m.scale.setScalar(0.6 + k * 2.4); m.material.opacity = (1 - k) * 0.35; });
    renderer.render(scene, cam);
    if (!still) raf = requestAnimationFrame(loop);
  }
  loop();

  return function dispose() {
    visible = false; cancelAnimationFrame(raf);
    ro.disconnect(); io.disconnect(); removeEventListener('pointermove', onMove);
    scene.traverse((o) => { o.geometry?.dispose?.(); o.material?.dispose?.(); });
    renderer.dispose();
  };
}
