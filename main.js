import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.outputColorSpace = THREE.SRGBColorSpace;

renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0xffffff);
renderer.setPixelRatio(window.devicePixelRatio);

renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

document.body.appendChild(renderer.domElement);

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(15, window.innerWidth / window.innerHeight, 1, 1000);
camera.position.set(7, 3, 7);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.enablePan = false;
controls.minDistance = 5;
controls.maxDistance = 200;
controls.minPolarAngle = 0.5;
controls.maxPolarAngle = 1.5;
controls.autoRotate = false;
controls.target = new THREE.Vector3(0, 1.5, 0);
controls.update();

const groundGeometry = new THREE.PlaneGeometry(20, 20, 32, 32);
groundGeometry.rotateX(-Math.PI / 2);
const groundMaterial = new THREE.MeshStandardMaterial({
  color: 0x555555,
  side: THREE.DoubleSide
});
const groundMesh = new THREE.Mesh(groundGeometry, groundMaterial);
groundMesh.castShadow = false;
groundMesh.receiveShadow = false;
scene.add(groundMesh);

// Create a DirectionalLight to illuminate the entire car
const directionalLight = new THREE.DirectionalLight(0xffffff, 20); // Color and intensity
directionalLight.position.set(-10, 10, 5); // Position above and to the side of the car
directionalLight.castShadow = true; // Enable shadows

// Adjust shadow settings for better quality
directionalLight.shadow.mapSize.width = 2048; // Shadow map resolution
directionalLight.shadow.mapSize.height = 2048;
directionalLight.shadow.camera.near = 0.5;
directionalLight.shadow.camera.far = 50;

// Add the light to the scene
scene.add(directionalLight);

// Optional: Add a helper to visualize the direction of the light
const lightHelper = new THREE.DirectionalLightHelper(directionalLight, 5);
scene.add(lightHelper);



// Create a DirectionalLight to illuminate the entire car
const directionalLight2 = new THREE.DirectionalLight(0xffffff, 20); // Color and intensity
directionalLight2.position.set(10, 10, 5); // Position above and to the side of the car
directionalLight2.castShadow = true; // Enable shadows

// Adjust shadow settings for better quality
directionalLight2.shadow.mapSize.width = 2048; // Shadow map resolution
directionalLight2.shadow.mapSize.height = 2048;
directionalLight2.shadow.camera.near = 0.5;
directionalLight2.shadow.camera.far = 50;

// Add the light to the scene
scene.add(directionalLight2);

// Optional: Add a helper to visualize the direction of the light
const lightHelper2 = new THREE.DirectionalLightHelper(directionalLight, 5);
scene.add(lightHelper2);


const loader = new GLTFLoader().setPath('public/car/');
loader.load('fe.gltf', (gltf) => {
  console.log('loading model');
  const mesh = gltf.scene;

  mesh.traverse((child) => {
    if (child.isMesh) {
      child.castShadow = true;
      child.receiveShadow = true;
    }
  });

  mesh.position.set(0, 1.05, -1);
  scene.add(mesh);

  document.getElementById('progress-container').style.display = 'none';
}, (xhr) => {
  console.log(`loading ${xhr.loaded / xhr.total * 100}%`);
}, (error) => {
  console.error(error);
});

window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

function animate() {
  requestAnimationFrame(animate);
  controls.update();
  renderer.render(scene, camera);
}

animate();
