import * as THREE from 'three';

export function initThreeBackground() {
  const canvas = document.getElementById('three-canvas');
  if (!canvas) return;

  const scene    = new THREE.Scene();
  const camera   = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });

  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  camera.position.z = 5;

  /* ── Floating particles ── */
  const particleCount = 1800;
  const positions = new Float32Array(particleCount * 3);
  const colors    = new Float32Array(particleCount * 3);
  const colA = new THREE.Color('#1cb698');
  const colB = new THREE.Color('#3b82f6');

  for (let i = 0; i < particleCount; i++) {
    positions[i * 3]     = (Math.random() - 0.5) * 20;
    positions[i * 3 + 1] = (Math.random() - 0.5) * 20;
    positions[i * 3 + 2] = (Math.random() - 0.5) * 20;
    const t = Math.random();
    const c = colA.clone().lerp(colB, t);
    colors[i * 3] = c.r; colors[i * 3 + 1] = c.g; colors[i * 3 + 2] = c.b;
  }

  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geo.setAttribute('color',    new THREE.BufferAttribute(colors, 3));

  const mat = new THREE.PointsMaterial({
    size: 0.045, vertexColors: true, transparent: true, opacity: 0.7,
    sizeAttenuation: true,
  });

  const particles = new THREE.Points(geo, mat);
  scene.add(particles);

  /* ── Neural network lines ── */
  const lineMat = new THREE.LineBasicMaterial({ color: 0x1cb698, transparent: true, opacity: 0.06 });
  const nodeCount = 40;
  const nodes = Array.from({ length: nodeCount }, () => new THREE.Vector3(
    (Math.random() - 0.5) * 14,
    (Math.random() - 0.5) * 14,
    (Math.random() - 0.5) * 8,
  ));
  nodes.forEach((a, i) => {
    nodes.slice(i + 1).forEach(b => {
      if (a.distanceTo(b) < 4) {
        const lg = new THREE.BufferGeometry().setFromPoints([a, b]);
        scene.add(new THREE.Line(lg, lineMat));
      }
    });
  });

  /* ── Mouse parallax ── */
  let mouseX = 0, mouseY = 0;
  document.addEventListener('mousemove', e => {
    mouseX = (e.clientX / window.innerWidth  - 0.5) * 0.6;
    mouseY = (e.clientY / window.innerHeight - 0.5) * 0.6;
  });

  /* ── Resize ── */
  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });

  /* ── Animate ── */
  const startTime = performance.now();
  function animate() {
    requestAnimationFrame(animate);
    const t = (performance.now() - startTime) * 0.001;
    particles.rotation.y = t * 0.04 + mouseX * 0.3;
    particles.rotation.x = t * 0.02 - mouseY * 0.2;
    renderer.render(scene, camera);
  }
  animate();
}
