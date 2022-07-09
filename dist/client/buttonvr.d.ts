/**
 * @license
 * ButtonVR library and demos
 * Copyright 2021 Sean Bradley https://sbcode.net
 * https://github.com/Sean-Bradley/ButtonVR/blob/master/LICENSE
 */
import * as THREE from 'three';
export default class ButtonVR {
    private _canvas;
    private _ctx;
    private _texture;
    private _buttons;
    private _raycaster;
    private _lookAtVector;
    private _camera;
    private _eventListeners;
    private _progress;
    private _timer;
    private _delta;
    private _clock;
    private _buttonPressStarted;
    private _buttonPressed;
    private _duration;
    constructor(scene: THREE.Scene, camera: THREE.Camera, durationMS?: number);
    get buttons(): THREE.Object3D<THREE.Event>[];
    set buttons(value: THREE.Object3D<THREE.Event>[]);
    update(renderer: THREE.WebGLRenderer): void;
    addEventListener(type: string, eventHandler: any): void;
    dispatchEvent(type: string, intersection?: THREE.Intersection): void;
}
