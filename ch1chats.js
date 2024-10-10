let scene, camera, renderer, planet, stars, currentSlide = 0;
let mouseX = 0, mouseY = 0;  // Track the mouse positions

const slides = [
  {
    title: "Exploring Exoplanets: Worlds Beyond Our Solar System",
    content: "Exoplanets are planets that orbit stars outside our solar system.",
    action: () => createStarSystem()
  },
  {
    title: "The Pioneer: 51 Pegasi b",
    content: "Discovered in 1995, 51 Pegasi b was the first exoplanet found orbiting a Sun-like star.",
    action: () => createSinglePlanet('public/51.jpg', 4.0)
  },
  {
    title: "How Do We Find Them?",
    content: "The radial velocity method and transit method are two major techniques to detect exoplanets.",
    action: () => createDetectionMethods()
  },
  {
    title: "Kepler's Quest",
    content: "The Kepler Space Telescope has discovered thousands of exoplanets.",
    action: () => createKeplerScene()
  },
];

function init() {
  // Set up scene, camera, renderer
  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.z = 20; 

  renderer = new THREE.WebGLRenderer({ canvas: document.querySelector('#webgl') });
  renderer.setSize(window.innerWidth, window.innerHeight);

  // Add stars background
  createStars();

  // Show first slide
  showSlide(0);

  // Handle navigation
  document.getElementById('next-slide').addEventListener('click', nextSlide);

  // Add event listener for mouse movement
  document.addEventListener('mousemove', onMouseMove);

  // Add event listener for clicks to change star colors
  document.addEventListener('click', onMouseClick);

  animate();
}

function createStars() {
  const starGeometry = new THREE.BufferGeometry();
  const starMaterial = new THREE.PointsMaterial({ color: 0xffffff });

  const starVertices = [];
  for (let i = 0; i < 10000; i++) {
    const x = (Math.random() - 0.5) * 2000;
    const y = (Math.random() - 0.5) * 2000;
    const z = -Math.random() * 1000;
    starVertices.push(x, y, z);
  }
  starGeometry.setAttribute('position', new THREE.Float32BufferAttribute(starVertices, 3));

  stars = new THREE.Points(starGeometry, starMaterial);
  scene.add(stars);
}

// Update stars rotation based on mouse movement
function onMouseMove(event) {
  mouseX = (event.clientX / window.innerWidth) * 2 - 1;
  mouseY = -(event.clientY / window.innerHeight) * 2 + 1;
}

function onMouseClick() {
  const newColor = Math.random() * 0xffffff;
  
}

function animate() {
  requestAnimationFrame(animate);

  // Rotate stars based on mouse position
  stars.rotation.x += (mouseY * 0.05 - stars.rotation.x) * 0.1;
  stars.rotation.y += (mouseX * 0.05 - stars.rotation.y) * 0.1;

  if (planet) {
    planet.rotation.y += 0.01;  // Rotate planet
  }

  renderer.render(scene, camera);
}

function createStarSystem() {
  if (planet) scene.remove(planet);
  planet = createPlanet(4, 'public/texture1.jpg'); 
}

function createSinglePlanet(textureURL, size) {
  if (planet) scene.remove(planet);
  planet = createPlanet(size, textureURL);
}

function createPlanet(size, textureURL) {
  const texture = new THREE.TextureLoader().load(textureURL);
  const geometry = new THREE.SphereGeometry(size, 32, 32);
  const material = new THREE.MeshBasicMaterial({ map: texture });
  const sphere = new THREE.Mesh(geometry, material);
  scene.add(sphere);
  return sphere;
}

function createKeplerScene() {
  if (planet) scene.remove(planet);
  
  const kepler = new THREE.Group();
  
  const bodyGeometry = new THREE.CylinderGeometry(1, 1, 5, 64);
  const bodyMaterial = new THREE.MeshStandardMaterial({ color: 0x808080, metalness: 0.8, roughness: 0.2 });
  const telescopeBody = new THREE.Mesh(bodyGeometry, bodyMaterial);
  telescopeBody.rotation.x = Math.PI / 2;
  kepler.add(telescopeBody);
  
  const lensGeometry = new THREE.SphereGeometry(0.7, 64, 64);
  const lensMaterial = new THREE.MeshStandardMaterial({ color: 0x00aaff, metalness: 0.6, roughness: 0.1, transparent: true, opacity: 0.8 });
  const lens = new THREE.Mesh(lensGeometry, lensMaterial);
  lens.position.set(0, 2.5, 0);
  kepler.add(lens);

  const panelGeometry = new THREE.PlaneGeometry(4, 2);
  const panelMaterial = new THREE.MeshStandardMaterial({ color: 0x0000ff, metalness: 0.4, roughness: 0.3, side: THREE.DoubleSide });

  const leftPanel = new THREE.Mesh(panelGeometry, panelMaterial);
  const rightPanel = new THREE.Mesh(panelGeometry, panelMaterial);
  leftPanel.position.set(-1.5, 0, 0);
  rightPanel.position.set(1.5, 0, 0);
  leftPanel.rotation.z = Math.PI / 2;
  rightPanel.rotation.z = Math.PI / 2;

  kepler.add(leftPanel);
  kepler.add(rightPanel);

  const antennaGeometry = new THREE.CylinderGeometry(0.05, 0.05, 2, 32);
  const antennaMaterial = new THREE.MeshBasicMaterial({ color: 0xaaaaaa });
  const antenna = new THREE.Mesh(antennaGeometry, antennaMaterial);
  antenna.position.set(0, -2.5, 0);
  kepler.add(antenna);

  const dishGeometry = new THREE.SphereGeometry(0.5, 32, 32, 0, Math.PI);
  const dishMaterial = new THREE.MeshStandardMaterial({ color: 0x555555, metalness: 0.7, roughness: 0.3 });
  const dish = new THREE.Mesh(dishGeometry, dishMaterial);
  dish.position.set(0, -2.7, 0);
  dish.rotation.x = -Math.PI / 2;
  kepler.add(dish);

  const light = new THREE.PointLight(0xffffff, 1, 100);
  light.position.set(5, 5, 5);
  scene.add(light);
  const ambientLight = new THREE.AmbientLight(0x404040);
  scene.add(ambientLight);

  scene.add(kepler);
  
  camera.position.set(0, 10, 10);
  camera.lookAt(kepler.position);
}

function showSlide(index) {
  if (index < 0 || index >= slides.length) return;
  currentSlide = index;
  document.getElementById('title').textContent = slides[index].title;
  document.getElementById('content').textContent = slides[index].content;

  slides[index].action();
}

function nextSlide() {
  if (currentSlide < slides.length - 1) {
    showSlide(currentSlide + 1);
  } else {
    window.location.href = './game.html';
  }
}

function prevSlide() {
  if (currentSlide > 0) {
    showSlide(currentSlide - 1);
  }
}

window.onload = init;
    