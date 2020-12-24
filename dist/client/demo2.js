import * as THREE from '/build/three.module.js';
import StatsVR from '/statsvr';
import { VRButton } from '/jsm/webxr/VRButton';
import ButtonVR from './buttonvr.js';
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 1.6, 3);
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.xr.enabled = true;
document.body.appendChild(renderer.domElement);
document.body.appendChild(VRButton.createButton(renderer));
window.addEventListener('resize', onWindowResize, false);
function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}
const planeGeometry = new THREE.PlaneGeometry(25, 25, 10, 10);
const floor = new THREE.Mesh(planeGeometry, new THREE.MeshBasicMaterial({
    color: 0x008800,
    wireframe: true
}));
floor.rotateX(-Math.PI / 2);
scene.add(floor);
const buttonVR = new ButtonVR(scene, camera, 500);
buttonVR.addEventListener("pressedStart", (intersection) => {
    //console.log("pressedStart")
});
buttonVR.addEventListener("pressed", (intersection) => {
    //console.log("pressed")
    statsVR.setCustom1(intersection.object.name);
    screenText += intersection.object.name;
    regenerateGeometry();
});
buttonVR.addEventListener("pressedEnd", () => {
    //console.log("pressedEnd")
    statsVR.setCustom1("");
});
const keys = ["A", "B", "C", "D", "E", "F", "G", "H", "I"];
let font;
const loader = new THREE.FontLoader();
loader.load('fonts/gentilis_regular.typeface.json', function (f) {
    keys.forEach((k, i) => {
        font = f;
        const keyCube = new THREE.Mesh(new THREE.BoxBufferGeometry(.66, .66, .33), new THREE.MeshBasicMaterial({
            color: 0xff0066,
            transparent: true,
            opacity: 0.5
        }));
        keyCube.name = k;
        keyCube.position.set(0, .75, -4);
        let textGeometry = new THREE.TextBufferGeometry(k, {
            font: f,
            size: .5,
            height: .2,
            curveSegments: 2
        });
        const textMesh = new THREE.Mesh(textGeometry, new THREE.MeshBasicMaterial({ color: 0x00ffff }));
        textMesh.position.set(-.18, .55, -4);
        const keyCubePivot = new THREE.Object3D();
        keyCubePivot.add(keyCube);
        keyCubePivot.add(textMesh);
        keyCubePivot.rotateY(((-Math.PI / 16) * i) + (Math.PI / 4));
        scene.add(keyCubePivot);
        buttonVR.buttons.push(keyCube);
    });
});
let screenText = "";
const screenTextMesh = new THREE.Mesh(new THREE.BufferGeometry(), new THREE.MeshBasicMaterial({ color: 0x8888ff }));
screenTextMesh.position.set(0, 1.5, -5);
scene.add(screenTextMesh);
function regenerateGeometry() {
    let newGeometry = new THREE.TextBufferGeometry(screenText, {
        font: font,
        size: 2,
        height: .2,
        curveSegments: 2
    });
    newGeometry.center();
    screenTextMesh.geometry.dispose();
    screenTextMesh.geometry = newGeometry;
}
const statsVR = new StatsVR(scene, camera);
statsVR.setX(0);
statsVR.setY(0);
statsVR.setZ(-2);
function render() {
    statsVR.update();
    buttonVR.update(renderer);
    renderer.render(scene, camera);
}
renderer.setAnimationLoop(render);
