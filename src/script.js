import "./style.css";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import * as dat from "dat.gui";

/**
 * Debug
 */
const gui = new dat.GUI({ width: 400 });
gui.hide();

const debugObject = {};

/**
 * Base
 */
// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();

/**
 * Parameters
 */
const parameters = {
  radiusTriangle: 1,
  heightTriangle: 1.788,
  radialSegmentsTriangle: 3,
  colorPointLight: "#4842f5",
};

/**
 * Lights
 */

// Ambient Light
const ambientLight = new THREE.AmbientLight(0x404040);

scene.add(ambientLight);

console.log(ambientLight);

// Directional Light
// const directionalLight = new THREE.DirectionalLight(0x293df2, 0.5);
// directionalLight.position.set(-5, 6, 0);
// directionalLight.target.position.set(0, 0, 0);
// scene.add(directionalLight);

// const directionalLightHelper = new THREE.DirectionalLightHelper(directionalLight, 0.1);
// scene.add(directionalLightHelper);

// Point Light
const colorPointLight = new THREE.Color(parameters.colorPointLight);
const pointLight = new THREE.PointLight(colorPointLight, 0.5, 100);
pointLight.position.set(2, 0, 1);

const pointLightHelper = new THREE.PointLightHelper(pointLight, 0.1);

scene.add(pointLight, pointLightHelper);

/**
 * Object
 */

let geometry = null;
let material = null;
let triangle = null;

const createTriangle = () => {
  // Reset
  if (triangle !== null) {
    geometry.dispose();
    material.dispose();
    scene.remove(triangle);
  }

  geometry = new THREE.ConeGeometry(
    parameters.radiusTriangle,
    parameters.heightTriangle,
    parameters.radialSegmentsTriangle
  );

  material = new THREE.MeshStandardMaterial();
  material.roughness = 0.7;
  material.metalness = 0.96;

  gui.add(material, "roughness").min(0).max(1).step(0.001);
  gui.add(material, "metalness").min(0).max(1).step(0.001);

  triangle = new THREE.Mesh(geometry, material);
  triangle.rotation.y = 1;
  scene.add(triangle);
};

createTriangle();

gui.add(parameters, "radiusTriangle").min(1).max(10).step(0.001).onFinishChange(createTriangle);
gui.add(parameters, "heightTriangle").min(1).max(10).step(0.001).onFinishChange(createTriangle);
gui.add(parameters, "radialSegmentsTriangle").min(1).max(10).step(1).onFinishChange(createTriangle);
gui.add(material, "wireframe");

// gui.add(mesh, "radius").min(1).max(10).step(0.01);

/**
 * Sizes
 */
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

window.addEventListener("resize", () => {
  // Update sizes
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  // Update camera
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  // Update renderer
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100);
camera.position.z = 0.2;
camera.position.x = 0.75;
camera.position.y = 0;
scene.add(camera);

// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

/**
 * Animate
 */
const clock = new THREE.Clock();

const tick = () => {
  const elapsedTime = clock.getElapsedTime();

  // Animate light
  pointLight.position.set(Math.sin(elapsedTime * 0.15) * 2, 2, Math.cos(elapsedTime * 0.15) * 2);
  ambientLight.intensity = Math.sin(elapsedTime * 0.2);

  // Animate triangle
  triangle.rotation.y = elapsedTime * 0.02;
  triangle.rotation.x = elapsedTime * 0.04;

  // Update controls
  controls.update();

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
