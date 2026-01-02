import './style.css'
import * as THREE from 'three';
import './utils.js';

// Config
const CONFIG = {
  bgColor: 0x0e0e0e,
  fogColor: 0x0e0e0e,
  accentColor: 0x00f3ff,
  secondaryColor: 0x555555,
  particleCount: 500,
  cubeCount: 40
};

// ... (Scene Setup remains same)

// Scroll Interaction for Camera
let scrollY = 0;
window.addEventListener('scroll', () => {
  scrollY = window.scrollY;
});

// ...

function animate() {
  requestAnimationFrame(animate);
  const elapsedTime = clock.getElapsedTime();

  // Rotate Cubes
  cubes.forEach(obj => {
    obj.mesh.rotateOnAxis(obj.axis, obj.speed);
    // Float effect
    obj.mesh.position.y = obj.initialY + Math.sin(elapsedTime * 0.5 + obj.mesh.position.x) * 0.5;
  });

  // Rotate Particles
  particlesMesh.rotation.y = elapsedTime * 0.05;
  particlesMesh.rotation.x = mouseY * 0.2;

  // Camera Sway + Scroll Effect
  targetX = mouseX * 8;
  targetY = mouseY * 8;

  // Camera moves down as we scroll, giving a "descent" into the grid
  const scrollOffset = scrollY * 0.01;

  camera.position.x += (targetX - camera.position.x) * 0.03;
  camera.position.y += (-targetY + 2 - scrollOffset - camera.position.y) * 0.03;

  // Rotate camera slightly on scroll
  camera.rotation.z = scrollOffset * 0.05;

  // Subtle camera breathing
  camera.position.z = 8 + Math.sin(elapsedTime * 0.2) * 0.5;

  // Don't lookAt(0,0,0) strictly if we want the scroll-down effect to feel like panning
  camera.lookAt(0, -scrollOffset, 0);

  renderer.render(scene, camera);
}

// Scene Setup
const canvas = document.querySelector('#bg-canvas');
const scene = new THREE.Scene();
scene.background = new THREE.Color(CONFIG.bgColor);
scene.fog = new THREE.FogExp2(CONFIG.fogColor, 0.035);

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 8;
camera.position.y = 2;

const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setClearColor(CONFIG.bgColor, 1);

// Lighting
const ambientLight = new THREE.AmbientLight(0xffffff, 0.3);
scene.add(ambientLight);

const pointLight = new THREE.PointLight(CONFIG.accentColor, 1.5, 60);
pointLight.position.set(0, 5, 5);
scene.add(pointLight);

const blueLight = new THREE.PointLight(0x0000ff, 1, 60);
blueLight.position.set(-10, -5, -5);
scene.add(blueLight);

// Objects: Floating Cubes (The "Building Blocks")
const geometry = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshStandardMaterial({
  color: 0x1a1a1a,
  roughness: 0.15,
  metalness: 0.9,
});
const edgeMaterial = new THREE.LineBasicMaterial({ color: CONFIG.accentColor, transparent: true, opacity: 0.4 });

const cubes = [];

for (let i = 0; i < CONFIG.cubeCount; i++) {
  // Create a container for the mesh and lines
  const group = new THREE.Group();

  const cube = new THREE.Mesh(geometry, material);
  group.add(cube);

  const edges = new THREE.EdgesGeometry(geometry);
  const line = new THREE.LineSegments(edges, edgeMaterial);
  group.add(line);

  // Random Position in a cloud
  group.position.x = (Math.random() - 0.5) * 30;
  group.position.y = (Math.random() - 0.5) * 20;
  group.position.z = (Math.random() - 0.5) * 15;

  // Random Rotation
  group.rotation.x = Math.random() * Math.PI;
  group.rotation.y = Math.random() * Math.PI;

  // Scale variation
  const scale = Math.random() * 1.2 + 0.3;
  group.scale.set(scale, scale, scale);

  scene.add(group);

  cubes.push({
    mesh: group,
    speed: Math.random() * 0.01 + 0.002,
    axis: new THREE.Vector3(Math.random(), Math.random(), Math.random()).normalize(),
    initialY: group.position.y
  });
}

// Particle System (Snow/Dust)
const particlesGeometry = new THREE.BufferGeometry();
const particlesCount = CONFIG.particleCount;
const posArray = new Float32Array(particlesCount * 3);

for (let i = 0; i < particlesCount * 3; i++) {
  posArray[i] = (Math.random() - 0.5) * 50;
}

particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
const particlesMaterial = new THREE.PointsMaterial({
  size: 0.03,
  color: CONFIG.accentColor,
  transparent: true,
  opacity: 0.6,
  blending: THREE.AdditiveBlending
});

const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
scene.add(particlesMesh);

// Mouse Interaction
let mouseX = 0;
let mouseY = 0;
let targetX = 0;
let targetY = 0;

const windowHalfX = window.innerWidth / 2;
const windowHalfY = window.innerHeight / 2;

document.addEventListener('mousemove', (e) => {
  mouseX = (e.clientX - windowHalfX) * 0.001;
  mouseY = (e.clientY - windowHalfY) * 0.001;
});

// Animation Loop
const clock = new THREE.Clock();

function animate() {
  requestAnimationFrame(animate);
  const elapsedTime = clock.getElapsedTime();

  // Rotate Cubes
  cubes.forEach(obj => {
    obj.mesh.rotateOnAxis(obj.axis, obj.speed);
    // Float effect
    obj.mesh.position.y = obj.initialY + Math.sin(elapsedTime * 0.5 + obj.mesh.position.x) * 0.5;
  });

  // Rotate Particles
  particlesMesh.rotation.y = elapsedTime * 0.05;
  particlesMesh.rotation.x = mouseY * 0.2;

  // Camera Sway logic
  targetX = mouseX * 8;
  targetY = mouseY * 8;

  camera.position.x += (targetX - camera.position.x) * 0.03;
  camera.position.y += (-targetY + 2 - camera.position.y) * 0.03;

  // Subtle camera breathing
  camera.position.z = 8 + Math.sin(elapsedTime * 0.2) * 0.5;

  camera.lookAt(0, 0, 0);

  renderer.render(scene, camera);
}

animate();

// Resize Handler
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

// Intersection Observer for Scroll Reveals
const observerOptions = {
  root: null,
  rootMargin: '0px',
  threshold: 0.1
};

const observer = new IntersectionObserver((entries, observer) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('active');
    }
  });
}, observerOptions);

document.querySelectorAll('.reveal').forEach(el => {
  observer.observe(el);
});
