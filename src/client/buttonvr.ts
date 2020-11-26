import * as THREE from '/build/three.module.js'

export default class ButtonVR {

    private _canvas: HTMLCanvasElement
    private _ctx: CanvasRenderingContext2D
    private _texture: THREE.Texture
    private _buttons: THREE.Object3D[] = new Array();
    private _raycaster = new THREE.Raycaster()
    private _cameraWorldQuaternion = new THREE.Quaternion()
    private _lookAtVector = new THREE.Vector3(0, 0, -1)
    private _camera: THREE.Camera
    private _eventListeners: any[] = new Array()
    private _progress: THREE.Mesh
    private _timer = 0
    private _delta = 0
    private _clock = new THREE.Clock()
    private _buttonTriggered = false

    constructor(scene: THREE.Scene, camera: THREE.Camera) {
        this._camera = camera
        scene.add(camera)

        // const geometry = new THREE.Geometry()
        // geometry.vertices.push(new THREE.Vector3(0, 0, 0))
        // geometry.vertices.push(new THREE.Vector3(0, 0, -100))
        // const _line = new THREE.Line(geometry, new THREE.LineBasicMaterial({ color: 0x8888ff }))
        // this._camera.add(_line)

        this._canvas = document.createElement('canvas') as HTMLCanvasElement
        this._canvas.width = 100;
        this._canvas.height = 1;
        this._ctx = this._canvas.getContext('2d') as CanvasRenderingContext2D
        this._texture = new THREE.Texture(this._canvas)
        const material = new THREE.MeshBasicMaterial({ map: this._texture, depthWrite: false, transparent: true, opacity: 1.0 })
        const geometry = new THREE.PlaneGeometry(1, .1, 1, 1)
        this._progress = new THREE.Mesh(geometry, material)
        this._progress.position.x = 0
        this._progress.position.y = 0
        this._progress.position.z = -5
        //this._progress.renderOrder = 9999
        this._camera.add(this._progress)
    }

    public get buttons() {
        return this._buttons;
    }
    public set buttons(value) {
        this._buttons = value;
    }

    public update(renderer: THREE.WebGLRenderer) {
        if (renderer.xr.isPresenting) {
            let xrCamera = renderer.xr.getCamera(this._camera);
            xrCamera.getWorldQuaternion(this._cameraWorldQuaternion);

            this._raycaster.ray.direction.copy(this._lookAtVector).applyEuler(new THREE.Euler().setFromQuaternion(this._cameraWorldQuaternion, "XYZ"));
            this._raycaster.ray.origin.copy(xrCamera.position)

            let intersects = this._raycaster.intersectObjects(this.buttons);
            this._delta = this._clock.getDelta()
            if (intersects.length > 0) {
                if (this._timer === 0) {
                    this.dispatchEvent("pressedStart", intersects[0])
                }
                this._timer += this._delta;

                this._ctx.clearRect(0, 0, this._canvas.width, this._canvas.height)
                this._ctx.strokeStyle = 'rgba(255, 165, 0, 1)'
                const y = Math.floor(this._timer * 100)
                this._ctx.beginPath()
                this._ctx.moveTo(0, 0)
                this._ctx.lineTo(y, 0)
                this._ctx.stroke();
                
                if (!this._buttonTriggered && this._timer > 1.0) { //1 = 1 second
                    this.dispatchEvent("pressed", intersects[0])
                    this._buttonTriggered = true
                }

                
            } else {
                if (this._buttonTriggered) {
                    this.dispatchEvent("pressedEnd")
                    this._buttonTriggered = false
                }
                this._timer = 0
                this._ctx.clearRect(0, 0, this._canvas.width, this._canvas.height)
                //console.log( this._timer)
            }
            this._texture.needsUpdate = true;
        }
    }

    public addEventListener(type: string, eventHandler: any) {
        const listener = { type: type, eventHandler: eventHandler }
        this._eventListeners.push(listener);
    }

    public dispatchEvent(type: string, intersection?: THREE.Intersection) {
        for (let i = 0; i < this._eventListeners.length; i++) {
            if (type === this._eventListeners[i].type) {
                this._eventListeners[i].eventHandler(intersection)
            }
        }
    }
}