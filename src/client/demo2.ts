import * as THREE from 'three'
import StatsVR from 'statsvr'
import { VRButton } from 'three/examples/jsm/webxr/VRButton'
import { Font, FontLoader } from 'three/examples/jsm/loaders/FontLoader'
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry'
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

const buttonVR = new ButtonVR(scene, camera, 500)
buttonVR.addEventListener('pressedStart', (intersection: THREE.Intersection) => {
    //console.log("pressedStart")
})
buttonVR.addEventListener('pressed', (intersection: THREE.Intersection) => {
    //console.log("pressed")
    statsVR.setCustom1(intersection.object.name)
    screenText += intersection.object.name
    regenerateGeometry()
})
buttonVR.addEventListener('pressedEnd', () => {
    //console.log("pressedEnd")
    statsVR.setCustom1('')
})

const keys = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I']
let font: Font

const loader = new FontLoader()
loader.load('fonts/gentilis_regular.typeface.json', function (f) {
    keys.forEach((k, i) => {
        font = f
        const keyCube = new THREE.Mesh(
            new THREE.BoxBufferGeometry(0.66, 0.66, 0.33),
            new THREE.MeshBasicMaterial({
                color: 0xff0066,
                transparent: true,
                opacity: 0.5,
            })
        )
        keyCube.name = k
        keyCube.position.set(0, 0.75, -4)

        let textGeometry = new TextGeometry(k, {
            font: f,
            size: 0.5,
            height: 0.2,
            curveSegments: 2,
        })
        const textMesh = new THREE.Mesh(
            textGeometry,
            new THREE.MeshBasicMaterial({ color: 0x00ffff })
        )
        textMesh.position.set(-0.18, 0.55, -4)

        const keyCubePivot = new THREE.Object3D()
        keyCubePivot.add(keyCube)
        keyCubePivot.add(textMesh)
        keyCubePivot.rotateY((-Math.PI / 16) * i + Math.PI / 4)

        scene.add(keyCubePivot)

        buttonVR.buttons.push(keyCube)
    })
})

let screenText = ''
const screenTextMesh = new THREE.Mesh(
    new THREE.BufferGeometry(),
    new THREE.MeshBasicMaterial({ color: 0x8888ff })
)
screenTextMesh.position.set(0, 1.5, -5)
scene.add(screenTextMesh)

function regenerateGeometry() {
    let newGeometry = new TextGeometry(screenText, {
        font: font,
        size: 2,
        height: 0.2,
        curveSegments: 2,
    })
    newGeometry.center()
    screenTextMesh.geometry.dispose()
    screenTextMesh.geometry = newGeometry
}

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
