import * as THREE from '/build/three.module.js';
export default class ButtonVR {
    private _canvas;
    private _ctx;
    private _texture;
    private _buttons;
    private _raycaster;
    private _cameraWorldQuaternion;
    private _lookAtVector;
    private _camera;
    private _eventListeners;
    private _progress;
    private _timer;
    private _delta;
    private _clock;
    private _buttonPressStarted;
    private _buttonPressed;
    constructor(scene: THREE.Scene, camera: THREE.Camera);
    get buttons(): THREE.Object3D[];
    set buttons(value: THREE.Object3D[]);
    update(renderer: THREE.WebGLRenderer): void;
    addEventListener(type: string, eventHandler: any): void;
    dispatchEvent(type: string, intersection?: THREE.Intersection): void;
}