const createThreeBackground = () => {
  const background = document.querySelector('.hero-background');
  const hero = document.getElementById('hero');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const lowEndDevice = Boolean(window.__lowEndDevice);
  if (!background || !window.THREE || reducedMotion || lowEndDevice) {
    return;
  }

  const canvas = document.createElement('canvas');
  canvas.className = 'hero-canvas';
  background.appendChild(canvas);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(38, background.clientWidth / background.clientHeight, 0.1, 1000);
  camera.position.set(0, 0, 10);

  const renderer = new THREE.WebGLRenderer({
    canvas,
    alpha: true,
    antialias: true,
    powerPreference: 'high-performance'
  });
  const isCompactViewport = window.innerWidth < 768;
  renderer.setPixelRatio(Math.min(isCompactViewport ? 1 : 1.25, window.devicePixelRatio));
  renderer.setSize(background.clientWidth, background.clientHeight);
  renderer.setClearColor(0x050816, 0);

  const pointCount = isCompactViewport ? 52 : 78;
  const positions = new Float32Array(pointCount * 3);
  const colors = new Float32Array(pointCount * 3);

  for (let i = 0; i < pointCount; i += 1) {
    positions[i * 3] = (Math.random() - 0.5) * 16;
    positions[i * 3 + 1] = (Math.random() - 0.5) * 10;
    positions[i * 3 + 2] = (Math.random() - 0.5) * 6;
    colors[i * 3] = 0.4;
    colors[i * 3 + 1] = 0.7;
    colors[i * 3 + 2] = 1;
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

  const material = new THREE.PointsMaterial({
    size: 0.16,
    vertexColors: true,
    transparent: true,
    opacity: 0.55,
    depthWrite: false
  });

  const points = new THREE.Points(geometry, material);
  scene.add(points);

  const ring = new THREE.LineLoop(
    new THREE.BufferGeometry().setFromPoints(
      Array.from({ length: 64 }, (_, i) => {
        const angle = (i / 64) * Math.PI * 2;
        return new THREE.Vector3(Math.cos(angle) * 7.2, Math.sin(angle) * 4.8, 0);
      })
    ),
    new THREE.LineBasicMaterial({ color: 0x5aa9ff, transparent: true, opacity: 0.08 })
  );
  ring.rotation.x = Math.PI * 0.07;
  ring.position.z = -2;
  scene.add(ring);

  const pointerTarget = { x: 0, y: 0 };
  const pointerCurrent = { x: 0, y: 0 };

  const handlePointerMove = (event) => {
    const w = window.innerWidth || 1;
    const h = window.innerHeight || 1;
    pointerTarget.x = ((event.clientX / w) - 0.5) * 2;
    pointerTarget.y = ((event.clientY / h) - 0.5) * 2;
  };

  const handlePointerLeave = () => {
    pointerTarget.x = 0;
    pointerTarget.y = 0;
  };

  window.addEventListener('pointermove', handlePointerMove, { passive: true });
  window.addEventListener('pointerleave', handlePointerLeave, { passive: true });

  function resize() {
    const rect = background.getBoundingClientRect();
    camera.aspect = rect.width / rect.height;
    camera.updateProjectionMatrix();
    const compact = window.innerWidth < 768;
    renderer.setPixelRatio(Math.min(compact ? 1 : 1.25, window.devicePixelRatio));
    renderer.setSize(rect.width, rect.height);
  }

  let heroVisible = true;
  let pageVisible = !document.hidden;

  if (hero && 'IntersectionObserver' in window) {
    const visibilityObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          heroVisible = entry.isIntersecting;
        });
      },
      { threshold: 0.08 }
    );
    visibilityObserver.observe(hero);
  }

  document.addEventListener('visibilitychange', () => {
    pageVisible = !document.hidden;
  });

  const fpsCap = isCompactViewport ? 30 : 45;
  const frameInterval = 1000 / fpsCap;
  let lastFrameTime = 0;

  function animate(now = 0) {
    if (!pageVisible || !heroVisible) {
      requestAnimationFrame(animate);
      return;
    }

    if (now - lastFrameTime < frameInterval) {
      requestAnimationFrame(animate);
      return;
    }

    lastFrameTime = now;

    pointerCurrent.x += (pointerTarget.x - pointerCurrent.x) * 0.05;
    pointerCurrent.y += (pointerTarget.y - pointerCurrent.y) * 0.05;
    camera.position.x = pointerCurrent.x * 0.2;
    camera.position.y = pointerCurrent.y * -0.14;
    camera.lookAt(0, 0, 0);

    const time = performance.now() * 0.00035;
    points.rotation.y = time * 0.3;
    points.rotation.x = Math.sin(time * 0.65) * 0.06;
    ring.rotation.z = time * 0.12;
    renderer.render(scene, camera);
    requestAnimationFrame(animate);
  }

  window.addEventListener('resize', resize);
  resize();
  animate();
};

createThreeBackground();
