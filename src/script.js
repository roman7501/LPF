import "./style.css";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass.js";
import { GlitchPass } from "three/examples/jsm/postprocessing/GlitchPass.js";
import * as dat from "dat.gui";
import { TextureLoader } from "three";

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
 * Textures
 */
const textureLoader = new TextureLoader();
const triangleColorTexture = textureLoader.load("/textures/3/basecolor.jpg");
const triangleAmbientOcclusionTexture = textureLoader.load("/textures/3/ambientOcclusion.jpg");
const triangleHeightTexture = textureLoader.load("/textures/3/height.png");
const triangleNormalTexture = textureLoader.load("/textures/3/normal.jpg");
const triangleRoughnessTexture = textureLoader.load("/textures/3/roughness.jpg");
// const triangleAlphaTexture = textureLoader.load("/textures/3/opacity.jpg");
// const triangleMetalnessTexture = textureLoader.load("/textures/2/metallic.jpg");

/**
 * Parameters
 */
const parameters = {
  radiusTriangle: 1,
  heightTriangle: 1.788,
  radialSegmentsTriangle: 3,
  colorPointLight: "#ffffff",
  colorPointLight2: "#99a0ff",
};

const colors = ["#fc65dc", "#7281b3", "#d1a94b", "red", "blue", "green", "red", "blue", "green"];

/**
 * Lights
 */

// Ambient Light
const ambientLight = new THREE.AmbientLight(0x404040);
// scene.add(ambientLight);

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

  material = new THREE.MeshStandardMaterial({
    // map: triangleColorTexture,
    transparent: true,
    // alphaMap: triangleAlphaTexture,
    // aoMap: triangleAmbientOcclusionTexture,
    // displacementMap: triangleHeightTexture,
    // normalMap: triangleNormalTexture,
    // roughnessMap: triangleRoughnessTexture,
    // metalnessMap: triangleMetalnessTexture,
  });

  gui.add(material, "roughness").min(0).max(1).step(0.001);
  gui.add(material, "metalness").min(0).max(1).step(0.001);

  triangle = new THREE.Mesh(geometry, material);
  triangle.rotation.y = 1;
  triangle.position.x = -0.5;
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

// Update color triangle
timesEl.forEach((time) => {
  time.addEventListener("mouseenter", () => {
    const indexColor = [...timesEl].indexOf(time);
    material.color = new THREE.Color(colors[indexColor]);
  });
  // time.addEventListener("mouseleave", () => {
  //   const indexColor = [...timesEl].indexOf(time);
  //   material.color = new THREE.Color("#fff");
  // });
});

floor.position.z = -150;
floor.position.y = -20.33;
floor.position.x = -4;
floor.rotation.x = 4.608;
floor.material.roughness = 0.72;
floor.material.metalness = 1;
// scene.add(floor);

// const floorFolder = gui.addFolder("floor");
// floorFolder.add(floor.rotation, "x").min(0).max(10).step(0.001).name("rotationX");
// floorFolder.add(floor.rotation, "y").min(0).max(10).step(0.001).name("rotationY");
// floorFolder.add(floor.rotation, "z").min(0).max(10).step(0.001).name("rotationZ");
// floorFolder.add(floor.position, "x").min(-100).max(200).step(0.01).name("positionX");
// floorFolder.add(floor.position, "y").min(-100).max(200).step(0.01).name("positionY");
// floorFolder.add(floor.position, "z").min(-300).max(200).step(0.01).name("positionZ");
// floorFolder.add(floor.material, "metalness").min(0).max(1).step(0.0001).name("metalness");
// floorFolder.add(floor.material, "roughness").min(0).max(1).step(0.0001).name("roughness");

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

// const side1Folder = gui.addFolder("side");
// side1Folder.add(side1.rotation, "x").min(-10).max(10).step(0.001).name("rotationX");
// side1Folder.add(side1.rotation, "y").min(-10).max(10).step(0.001).name("rotationY");
// side1Folder.add(side1.rotation, "z").min(-10).max(10).step(0.001).name("rotationZ");
// side1Folder.add(side1.position, "x").min(-100).max(200).step(0.01).name("positionX");
// side1Folder.add(side1.position, "y").min(-100).max(200).step(0.01).name("positionY");
// side1Folder.add(side1.position, "z").min(-300).max(200).step(0.01).name("positionZ");
// side1Folder.add(side1.material, "metalness").min(0).max(1).step(0.0001).name("metalness");
// side1Folder.add(side1.material, "roughness").min(0).max(1).step(0.0001).name("roughness");

// const side2 = new THREE.Mesh(new THREE.BoxGeometry(150, 0.5, 0.5), new THREE.MeshStandardMaterial());
// side2.rotation.x = 0.8;
// side2.rotation.y = 0;
// side2.rotation.z = -0.913;
// side2.position.x = 49.97;
// side2.position.y = 0;
// side2.position.z = -89.1;
// side2.material.metalness = 1;
// side2.material.roughness = 0.56;
// // scene.add(side2);

// const side2Folder = gui.addFolder("side2");
// gui.add(side2.rotation, "x").min(-10).max(10).step(0.001).name("rotationX");
// gui.add(side2.rotation, "y").min(-10).max(10).step(0.001).name("rotationY");
// gui.add(side2.rotation, "z").min(-10).max(10).step(0.001).name("rotationZ");
// gui.add(side2.position, "x").min(-100).max(200).step(0.01).name("positionX");
// gui.add(side2.position, "y").min(-100).max(200).step(0.01).name("positionY");
// gui.add(side2.position, "z").min(-300).max(200).step(0.01).name("positionZ");
// gui.add(side2.material, "metalness").min(0).max(1).step(0.0001).name("metalness");
// gui.add(side2.material, "roughness").min(0).max(1).step(0.0001).name("roughness");

// Particles
const particlesGeometry = new THREE.BufferGeometry();
const count = 300;

const positions = new Float32Array(count * 3);
const colorsParticles = new Float32Array(count * 3);

const colorPickerParticle = new THREE.Color(colors[0]);

for (let i = 0; i < count; i++) {
  const i3 = i * 3;
  positions[i3] = (Math.random() - 0.5) * 10;
  positions[i3 + 1] = (Math.random() - 0.5) * 10;
  positions[i3 + 2] = (Math.random() - 0.5) * 10;

  // Color
  colorsParticles[i3 + 0] = colorPickerParticle.r;
  colorsParticles[i3 + 1] = colorPickerParticle.g;
  colorsParticles[i3 + 2] = colorPickerParticle.b;
}

particlesGeometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
particlesGeometry.setAttribute("color", new THREE.BufferAttribute(colorsParticles, 3));

const particlesMaterial = new THREE.PointsMaterial();
particlesMaterial.size = 0.01;
particlesMaterial.sizeAttenuation = true;
particlesMaterial.vertexColors = true;

const particles = new THREE.Points(particlesGeometry, particlesMaterial);
// scene.add(particles);

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
camera.position.z = 1;
camera.position.x = 0;
camera.position.y = -0.5;

// Test Camera
// camera.position.z = 2.2;
// camera.position.x = 0;
// camera.position.y = 0;

scene.add(camera);

// Move camera with mouse
// window.addEventListener("mousemove", (e) => {
//   const mouseX = e.pageX;
//   const mouseY = e.pageY;

//   const travellingX = (mouseX / sizes.width - 0.5) * 0.1;
//   const travellingY = (mouseY / sizes.height - 0.5) * 0.1;
//   console.log(travellingX);
//   camera.position.x = travellingX;
//   camera.position.y = travellingY;
// });

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
renderer.setClearColor("#030303");

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
unrealBloomPass.threshold = 0;
unrealBloomPass.strength = 0.4;
unrealBloomPass.radius = 1;
effectComposer.addPass(unrealBloomPass);

gui.add(unrealBloomPass, "threshold").min(0).max(1).step(0.1);
gui.add(unrealBloomPass, "strength").min(0).max(3).step(0.1);
gui.add(unrealBloomPass, "radius").min(0).max(1).step(0.1);

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
  pointLight.position.set(Math.sin(elapsedTime * 0.05) * 2, 2, Math.abs(Math.cos(elapsedTime * 0.15)) * 2);
  pointLight2.position.set(2, Math.sin(elapsedTime * 0.05) * 5 + 15, Math.cos(elapsedTime * 0.2) * 20 - 40);
  // ambientLight.intensity = Math.sin(elapsedTime * 0.2);

  // Animate camera
  // camera.position.z -= index / 600;
  // if (camera.position.z < 1 && camera.position.z > -1.5) {
  //   glitchPass.enabled = true;
  // } else {
  //   glitchPass.enabled = false;
  // }

  // Animate triangle
  triangle.rotation.y = elapsedTime * 0.002;
  triangle.rotation.x = elapsedTime * 0.004;

  // Update controls
  controls.update();

  // Render
  effectComposer.render();

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
