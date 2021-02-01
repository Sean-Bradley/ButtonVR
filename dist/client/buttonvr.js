//MIT License
//Copyright (c) 2020 Sean Bradley https://sbcode.net
//https://github.com/Sean-Bradley/ButtonVR/blob/master/LICENSE
import * as THREE from '/build/three.module.js';
//import * as THREE from 'three'  //if using a bundler
export default class ButtonVR {
    constructor(scene, camera, durationMS) {
        this._buttons = new Array();
        this._raycaster = new THREE.Raycaster();
        //private _cameraWorldQuaternion = new THREE.Quaternion()
        this._lookAtVector = new THREE.Vector3(0, 0, -1);
        this._eventListeners = new Array();
        this._timer = 0;
        this._delta = 0;
        this._clock = new THREE.Clock();
        this._buttonPressStarted = false;
        this._buttonPressed = false;
        this._duration = 1.0;
        this._camera = camera;
        if (this._camera.parent === null) {
            scene.add(camera);
        }
        if (durationMS) {
            this._duration = durationMS / 1000;
        }
        let points = [];
        points.push(new THREE.Vector3(-0.1, 0, 0));
        points.push(new THREE.Vector3(0.1, 0, 0));
        const lineGeometry1 = new THREE.BufferGeometry().setFromPoints(points);
        const lineMesh1 = new THREE.Line(lineGeometry1, new THREE.LineBasicMaterial({ color: 0x8888ff, depthTest: false, depthWrite: false }));
        lineMesh1.position.set(0, 0, -5);
        this._camera.add(lineMesh1);
        points = [];
        points.push(new THREE.Vector3(0, -0.1, 0));
        points.push(new THREE.Vector3(0, 0.1, 0));
        const lineGeometry2 = new THREE.BufferGeometry().setFromPoints(points);
        const lineMesh2 = new THREE.Line(lineGeometry2, new THREE.LineBasicMaterial({ color: 0x8888ff, depthTest: false, depthWrite: false }));
        lineMesh2.position.set(0, 0, -5);
        this._camera.add(lineMesh2);
        this._canvas = document.createElement('canvas');
        this._canvas.width = 100;
        this._canvas.height = 1;
        this._ctx = this._canvas.getContext('2d');
        this._texture = new THREE.Texture(this._canvas);
        const material = new THREE.MeshBasicMaterial({ map: this._texture, depthTest: false, depthWrite: false, transparent: true, opacity: 1.0 });
        const geometry = new THREE.PlaneGeometry(1, 0.1, 1, 1);
        this._progress = new THREE.Mesh(geometry, material);
        this._progress.position.x = 0;
        this._progress.position.y = 0;
        this._progress.position.z = -5;
        this._progress.renderOrder = 9999;
        this._camera.add(this._progress);
    }
    get buttons() {
        return this._buttons;
    }
    set buttons(value) {
        this._buttons = value;
    }
    update(renderer) {
        if (renderer.xr.isPresenting) {
            let xrCamera = renderer.xr.getCamera(this._camera);
            //xrCamera.getWorldQuaternion(this._cameraWorldQuaternion);
            this._raycaster.ray.direction.copy(this._lookAtVector).applyEuler(new THREE.Euler().setFromQuaternion(xrCamera.quaternion, "XYZ"));
            this._raycaster.ray.origin.copy(xrCamera.position);
            let intersects = this._raycaster.intersectObjects(this.buttons);
            this._delta = this._clock.getDelta();
            if (intersects.length > 0) {
                if (this._timer === 0) {
                    this._buttonPressStarted = true;
                    this.dispatchEvent("pressedStart", intersects[0]);
                }
                this._timer += this._delta;
                this._ctx.clearRect(0, 0, this._canvas.width, this._canvas.height);
                this._ctx.strokeStyle = 'rgba(255, 255, 255, 1)';
                const y = Math.floor(this._timer * 100 / this._duration);
                this._ctx.beginPath();
                this._ctx.moveTo(0, 0);
                this._ctx.lineTo(y, 0);
                this._ctx.stroke();
                if (!this._buttonPressed && this._timer > this._duration) { //1 = 1 second
                    this.dispatchEvent("pressed", intersects[0]);
                    this._buttonPressed = true;
                }
            }
            else {
                if (this._buttonPressStarted) {
                    this.dispatchEvent("pressedEnd");
                    this._buttonPressed = false;
                    this._buttonPressStarted = false;
                }
                this._timer = 0;
                this._ctx.clearRect(0, 0, this._canvas.width, this._canvas.height);
                //console.log( this._timer)
            }
            this._texture.needsUpdate = true;
        }
    }
    addEventListener(type, eventHandler) {
        const listener = { type: type, eventHandler: eventHandler };
        this._eventListeners.push(listener);
    }
    dispatchEvent(type, intersection) {
        for (let i = 0; i < this._eventListeners.length; i++) {
            if (type === this._eventListeners[i].type) {
                this._eventListeners[i].eventHandler(intersection);
            }
        }
    }
}
