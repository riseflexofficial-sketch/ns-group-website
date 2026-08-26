// three-scene.js
// 3D hero scene: a flowing maroon-to-gold silk ribbon with drifting gold particles.
// Respects prefers-reduced-motion by rendering a single static frame instead of animating.

import * as THREE from "three";

const container = document.getElementById("heroCanvas");

if (container) {
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const scene = new THREE.Scene();

  const camera = new THREE.PerspectiveCamera(45, container.clientWidth / container.clientHeight, 0.1, 100);
  camera.position.set(0, 0, 9);

  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(container.clientWidth, container.clientHeight);
  container.appendChild(renderer.domElement);

  // Lighting — warm gold key light + soft maroon fill
  scene.add(new THREE.AmbientLight(0xf5e6c8, 0.9));
  const goldLight = new THREE.PointLight(0xffd88a, 1.4, 30);
  goldLight.position.set(4, 4, 6);
  scene.add(goldLight);
  const maroonLight = new THREE.PointLight(0x7a1f2b, 0.8, 30);
  maroonLight.position.set(-5, -2, 4);
  scene.add(maroonLight);

  // Silk ribbon plane, vertex-colored maroon → gold, undulated per-frame like flowing fabric
  const width = 8;
  const height = 4.5;
  const geometry = new THREE.PlaneGeometry(width, height, 40, 20);

  const colorMaroon = new THREE.Color(0x7a1f2b);
  const colorGold = new THREE.Color(0xc6952f);
  const colors = [];
  const posAttr = geometry.attributes.position;
  for (let i = 0; i < posAttr.count; i++) {
    const t = (posAttr.getX(i) + width / 2) / width;
    const c = colorMaroon.clone().lerp(colorGold, t);
    colors.push(c.r, c.g, c.b);
  }
  geometry.setAttribute("color", new THREE.Float32BufferAttribute(colors, 3));

  const material = new THREE.MeshStandardMaterial({
    vertexColors: true,
    metalness: 0.6,
    roughness: 0.35,
    side: THREE.DoubleSide,
  });

  const ribbon = new THREE.Mesh(geometry, material);
  ribbon.rotation.x = -0.3;
  scene.add(ribbon);

  const basePositions = Float32Array.from(posAttr.array);

  // Drifting gold particles
  const particleCount = 200;
  const particleGeo = new THREE.BufferGeometry();
  const particlePos = new Float32Array(particleCount * 3);
  for (let i = 0; i < particleCount; i++) {
    particlePos[i * 3] = (Math.random() - 0.5) * 14;
    particlePos[i * 3 + 1] = (Math.random() - 0.5) * 8;
    particlePos[i * 3 + 2] = (Math.random() - 0.5) * 6;
  }
  particleGeo.setAttribute("position", new THREE.BufferAttribute(particlePos, 3));
  const particles = new THREE.Points(
    particleGeo,
    new THREE.PointsMaterial({ color: 0xe4c77a, size: 0.045, transparent: true, opacity: 0.85, sizeAttenuation: true })
  );
  scene.add(particles);

  let mouseX = 0;
  let mouseY = 0;
  window.addEventListener("mousemove", (e) => {
    mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
    mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
  });

  const clock = new THREE.Clock();

  function animate() {
    const t = prefersReducedMotion ? 0 : clock.getElapsedTime();

    const pos = geometry.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      const x = basePositions[i * 3];
      const y = basePositions[i * 3 + 1];
      const wave = Math.sin(x * 0.9 + t * 0.9) * 0.35 + Math.sin(y * 1.3 + t * 0.6) * 0.2;
      pos.setZ(i, wave);
    }
    pos.needsUpdate = true;
    geometry.computeVertexNormals();

    ribbon.rotation.z = Math.sin(t * 0.15) * 0.05;
    ribbon.rotation.y = mouseX * 0.15;

    particles.rotation.y = t * 0.02;
    particles.position.y = Math.sin(t * 0.3) * 0.15;

    camera.position.x += (mouseX * 1.2 - camera.position.x) * 0.03;
    camera.position.y += (-mouseY * 0.8 - camera.position.y) * 0.03;
    camera.lookAt(0, 0, 0);

    renderer.render(scene, camera);
    if (!prefersReducedMotion) requestAnimationFrame(animate);
  }
  animate();

  window.addEventListener("resize", () => {
    camera.aspect = container.clientWidth / container.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(container.clientWidth, container.clientHeight);
  });
}
