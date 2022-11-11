import * as THREE from 'three'
import StatsVR from 'statsvr'
import { VRButton } from 'three/examples/jsm/webxr/VRButton'
import ButtonVR from './buttonvr'

const scene: THREE.Scene = new THREE.Scene()

const camera: THREE.PerspectiveCamera = new THREE.PerspectiveCamera(
    50,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
)
camera.position.set(0, 1.6, 3)

const renderer = new THREE.WebGLRenderer({ antialias: true })
renderer.setPixelRatio(window.devicePixelRatio)
renderer.setSize(window.innerWidth, window.innerHeight)
renderer.xr.enabled = true

document.body.appendChild(renderer.domElement)

document.body.appendChild(VRButton.createButton(renderer))

window.addEventListener('resize', onWindowResize, false)

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight
    camera.updateProjectionMatrix()
    renderer.setSize(window.innerWidth, window.innerHeight)
}

const planeGeometry: THREE.PlaneGeometry = new THREE.PlaneGeometry(25, 25, 10, 10)
const floor: THREE.Mesh = new THREE.Mesh(
    planeGeometry,
    new THREE.MeshBasicMaterial({
        color: 0x008800,
        wireframe: true,
    })
)
floor.rotateX(-Math.PI / 2)
scene.add(floor)

const buttonVR = new ButtonVR(scene, camera)
buttonVR.addEventListener('pressedStart', (intersection: THREE.Intersection) => {
    console.log('pressedStart')
})
buttonVR.addEventListener('pressed', (intersection: THREE.Intersection) => {
    console.log('pressed')
    statsVR.setCustom1(intersection.object.name)
})
buttonVR.addEventListener('pressedEnd', () => {
    console.log('pressedEnd')
    statsVR.setCustom1('')
})

const box = new THREE.Mesh(
    new THREE.BoxGeometry(1, 1, 1),
    new THREE.MeshBasicMaterial({
        color: 0xff0066,
        wireframe: true,
    })
)
box.name = 'box'
box.position.set(-2, 0.5, -4)
scene.add(box)
buttonVR.buttons.push(box)

const sphere = new THREE.Mesh(
    new THREE.SphereGeometry(0.5, 8, 8),
    new THREE.MeshBasicMaterial({
        color: 0x00ff66,
        wireframe: true,
    })
)
sphere.name = 'sphere'
sphere.position.set(0, 0.5, -4)
scene.add(sphere)
buttonVR.buttons.push(sphere)

const pyramid = new THREE.Mesh(
    new THREE.ConeGeometry(0.66, 1, 4),
    new THREE.MeshBasicMaterial({
        color: 0xffff00,
        wireframe: true,
    })
)
pyramid.name = 'pyramid'
pyramid.position.set(2, 0.5, -4)
scene.add(pyramid)
buttonVR.buttons.push(pyramid)

const statsVR = new StatsVR(scene, camera)
statsVR.setX(0)
statsVR.setY(0)
statsVR.setZ(-2)

function render() {
    statsVR.update()

    buttonVR.update(renderer)

    renderer.render(scene, camera)
}

renderer.setAnimationLoop(render)
