import "./style.css";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass.js";
import { GlitchPass } from "three/examples/jsm/postprocessing/GlitchPass.js";
import * as dat from "dat.gui";

/**
 * Slider
 */
const timesEl = document.querySelectorAll(".time__wrapper");
let index = 0;

const btnLeft = document.getElementById("left");
const btnRight = document.getElementById("right");

btnLeft.addEventListener("click", () => {
  if (index === 0) {
    return;
  }
  index--;
  console.log(timesEl[index]);
  timesEl[index].scrollIntoView({ behavior: "smooth", block: "center" });
});

btnRight.addEventListener("click", () => {
  if (index === timesEl.length - 1) {
    return;
  }
  index++;
  console.log(timesEl[index]);
  timesEl[index].scrollIntoView({ behavior: "smooth", block: "center" });
});

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
  colorPointLight2: "#99a0ff",
};

/**
 * Lights
 */

// Ambient Light
const ambientLight = new THREE.AmbientLight(0x404040);
scene.add(ambientLight);

// Directional Light
// const directionalLight = new THREE.DirectionalLight(0x293df2, 0.4);
// directionalLight.position.set(-5, 6, -20);

// scene.add(directionalLight);

// const directionalLightHelper = new THREE.DirectionalLightHelper(directionalLight, 0.1);
// scene.add(directionalLightHelper);

// Point Light
const colorPointLight = new THREE.Color(parameters.colorPointLight);
const pointLight = new THREE.PointLight(colorPointLight, 0.8, 15);
pointLight.position.set(2, 0, 1);

// const pointLightHelper = new THREE.PointLightHelper(pointLight, 0.1);
// scene.add(pointLightHelper);

scene.add(pointLight);

const colorPointLight2 = new THREE.Color(parameters.colorPointLight2);
const pointLight2 = new THREE.PointLight(colorPointLight2, 1, 30);
pointLight2.position.set(2, 15, -20);

const pointLightHelper2 = new THREE.PointLightHelper(pointLight2, 0.1);
// scene.add(pointLight2, pointLightHelper2);

/**
 * Object
 */

// Triangle
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

// Floor
const floor = new THREE.Mesh(
  new THREE.PlaneGeometry(100, 300, 32),
  new THREE.MeshStandardMaterial({ side: THREE.DoubleSide })
);
floor.position.z = -150;
floor.position.y = -20.33;
floor.position.x = -4;
floor.rotation.x = 4.608;
floor.material.roughness = 0.72;
floor.material.metalness = 1;
scene.add(floor);

console.log(floor);

const floorFolder = gui.addFolder("floor");
floorFolder.add(floor.rotation, "x").min(0).max(10).step(0.001).name("rotationX");
floorFolder.add(floor.rotation, "y").min(0).max(10).step(0.001).name("rotationY");
floorFolder.add(floor.rotation, "z").min(0).max(10).step(0.001).name("rotationZ");
floorFolder.add(floor.position, "x").min(-100).max(200).step(0.01).name("positionX");
floorFolder.add(floor.position, "y").min(-100).max(200).step(0.01).name("positionY");
floorFolder.add(floor.position, "z").min(-300).max(200).step(0.01).name("positionZ");
floorFolder.add(floor.material, "metalness").min(0).max(1).step(0.0001).name("metalness");
floorFolder.add(floor.material, "roughness").min(0).max(1).step(0.0001).name("roughness");

// Sides
const side1 = new THREE.Mesh(new THREE.BoxGeometry(150, 0.5, 0.5), new THREE.MeshStandardMaterial());
side1.rotation.x = 0.8;
side1.rotation.z = 0.7;
side1.position.x = -37.9;
side1.position.y = 0;
side1.position.z = -43.54;
side1.material.metalness = 1;
side1.material.roughness = 0.56;
// scene.add(side1);

const side1Folder = gui.addFolder("side");
side1Folder.add(side1.rotation, "x").min(-10).max(10).step(0.001).name("rotationX");
side1Folder.add(side1.rotation, "y").min(-10).max(10).step(0.001).name("rotationY");
side1Folder.add(side1.rotation, "z").min(-10).max(10).step(0.001).name("rotationZ");
side1Folder.add(side1.position, "x").min(-100).max(200).step(0.01).name("positionX");
side1Folder.add(side1.position, "y").min(-100).max(200).step(0.01).name("positionY");
side1Folder.add(side1.position, "z").min(-300).max(200).step(0.01).name("positionZ");
side1Folder.add(side1.material, "metalness").min(0).max(1).step(0.0001).name("metalness");
side1Folder.add(side1.material, "roughness").min(0).max(1).step(0.0001).name("roughness");

const side2 = new THREE.Mesh(new THREE.BoxGeometry(150, 0.5, 0.5), new THREE.MeshStandardMaterial());
side2.rotation.x = 0.8;
side2.rotation.y = 0;
side2.rotation.z = -0.913;
side2.position.x = 49.97;
side2.position.y = 0;
side2.position.z = -89.1;
side2.material.metalness = 1;
side2.material.roughness = 0.56;
// scene.add(side2);

const side2Folder = gui.addFolder("side2");
gui.add(side2.rotation, "x").min(-10).max(10).step(0.001).name("rotationX");
gui.add(side2.rotation, "y").min(-10).max(10).step(0.001).name("rotationY");
gui.add(side2.rotation, "z").min(-10).max(10).step(0.001).name("rotationZ");
gui.add(side2.position, "x").min(-100).max(200).step(0.01).name("positionX");
gui.add(side2.position, "y").min(-100).max(200).step(0.01).name("positionY");
gui.add(side2.position, "z").min(-300).max(200).step(0.01).name("positionZ");
gui.add(side2.material, "metalness").min(0).max(1).step(0.0001).name("metalness");
gui.add(side2.material, "roughness").min(0).max(1).step(0.0001).name("roughness");

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
// Initial Camera
// camera.position.z = 0.2;
// camera.position.x = 0.75;
// camera.position.y = 0;

// Camera Position 2
camera.position.z = 10;
camera.position.x = 0;
camera.position.y = -0.5;

// Test Camera
// camera.position.z = 2.2;
// camera.position.x = 0;
// camera.position.y = 0;

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
 * Post Processing
 */
// Render Target
// Composer
const effectComposer = new EffectComposer(renderer);
effectComposer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
effectComposer.setSize(sizes.width, sizes.height);

// Render pass
const renderPass = new RenderPass(scene, camera);
effectComposer.addPass(renderPass);

// Unreal bloom pass
const unrealBloomPass = new UnrealBloomPass();
effectComposer.addPass(unrealBloomPass);

// Glitch Pass
const glitchPass = new GlitchPass();
glitchPass.enabled = false;
glitchPass.goWild = true;
effectComposer.addPass(glitchPass);

/**
 * Animate
 */
const clock = new THREE.Clock();

const tick = () => {
  const elapsedTime = clock.getElapsedTime();

  // Animate light
  pointLight.position.set(Math.sin(elapsedTime * 0.15) * 2, 2, Math.abs(Math.cos(elapsedTime * 0.15)) * 2);
  pointLight2.position.set(2, Math.sin(elapsedTime * 0.05) * 5 + 15, Math.cos(elapsedTime * 0.2) * 20 - 40);
  // ambientLight.intensity = Math.sin(elapsedTime * 0.2);

  // Animate camera
  camera.position.z -= index / 600;
  if (camera.position.z < 1 && camera.position.z > -1.5) {
    glitchPass.enabled = true;
  } else {
    glitchPass.enabled = false;
  }

  // Animate triangle
  triangle.rotation.y = elapsedTime * 0.02;
  triangle.rotation.x = elapsedTime * 0.04;

  // Update controls
  controls.update();

  // Render
  effectComposer.render();

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
