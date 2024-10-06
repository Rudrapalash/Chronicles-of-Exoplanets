let scene, camera, renderer, planet, stars, currentSlide = 0;

const slides = [
  {
    title: "Exploring Exoplanets: Worlds Beyond Our Solar System",
    content: "Exoplanets are planets that orbit stars outside our solar system.",
    action: () => createStarSystem()
  },
  {
    title: "The Pioneer: 51 Pegasi b",
    content: "Discovered in 1995, 51 Pegasi b was the first exoplanet found orbiting a Sun-like star.",
    action: () => createSinglePlanet('public/51.jpg', 4.0) // Ensure this path is correct
  },
  {
    title: "How Do We Find Them?",
    content: "The radial velocity method and transit method are two major techniques to detect exoplanets.",
    action: () => createDetectionMethods()
  },
  {
    title: "Kepler's Quest",
    content: "The Kepler Space Telescope has discovered thousands of exoplanets.",
    action: () => createKeplerScene() // Enhanced telescope
  },
];

function init() {
  // Set up scene, camera, renderer
  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.z = 20; // Adjusted camera position if needed

  renderer = new THREE.WebGLRenderer({ canvas: document.querySelector('#webgl') });
  renderer.setSize(window.innerWidth, window.innerHeight);

  // Add stars background
  createStars();

  // Show first slide
  showSlide(0);

  // Handle navigation
  document.getElementById('next-slide').addEventListener('click', nextSlide);
  
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

function createStarSystem() {
  if (planet) scene.remove(planet);
  planet = createPlanet(4, 'public/texture1.jpg'); // Ensure this path is correct
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
  
  const kepler = new THREE.Group(); // Group to hold the entire telescope structure
  
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

  // Lighting
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
  if (index < 0 || index >= slides.length) return; // Prevents out-of-bounds access
  currentSlide = index;
  document.getElementById('title').textContent = slides[index].title;
  document.getElementById('content').textContent = slides[index].content;

  // Remove any existing planets when showing the slide for "A Planetary Treasure Trove"
  if (index === 4) { // Assuming index 4 is for "A Planetary Treasure Trove"
    if (planet) {
      scene.remove(planet);
      planet = null; // Reset the planet variable
    }
  }

  slides[index].action();  // Run the specific action for each slide
}

function nextSlide() {
  if (currentSlide < slides.length - 1) {
    showSlide(currentSlide + 1);
  } else {
    // Redirect to a specific webpage when on the last slide
    window.location.href = './game.html'; // Replace with your actual URL
  }
}

function prevSlide() {
  if (currentSlide > 0) {
    showSlide(currentSlide - 1);
  }
}

function animate() {
  requestAnimationFrame(animate);
  stars.rotation.y += 0.001;  // Slight rotation for background stars

  if (planet) {
    planet.rotation.y += 0.01;  // Rotate planet
  }

  renderer.render(scene, camera);
}

function createMultiplePlanets() {
  if (planet) scene.remove(planet);
  
  const trappistSystem = new THREE.Group(); // Group to hold the star and planets

  const starGeometry = new THREE.SphereGeometry(2, 32, 32);
  const starMaterial = new THREE.MeshBasicMaterial({ color: 0xffcc00 });
  const star = new THREE.Mesh(starGeometry, starMaterial);
  trappistSystem.add(star);

  const planetsData = [
    { distance: 3.0, size: 0.8, color: 0xff4444 }, // 1st planet
    { distance: 4.0, size: 0.7, color: 0x44ff44 }, // 2nd planet
    { distance: 5.0, size: 0.9, color: 0x4444ff }, // 3rd planet
    { distance: 6.0, size: 0.85, color: 0xff44ff }, // 4th planet
  ];

  planetsData.forEach((planetData, index) => {
    const planetGeometry = new THREE.SphereGeometry(planetData.size, 32, 32);
    const planetMaterial = new THREE.MeshBasicMaterial({ color: planetData.color });
    const planetMesh = new THREE.Mesh(planetGeometry, planetMaterial);
    
    const orbitRadius = planetData.distance;
    planetMesh.position.x = orbitRadius; // Set initial position

    // Create an orbiting effect
    const orbitAngle = index * (Math.PI / 2); // Example spacing for orbits
    planetMesh.rotation.y = orbitAngle;

    trappistSystem.add(planetMesh);
  });

  scene.add(trappistSystem);
}

window.onload = init;
