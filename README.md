# ButtonVR

A minimal button for use in VR.

Triggered just by looking at it. 

It uses 3D objects as buttons.

You can download the project and view the examples.

```bash
git clone https://github.com/Sean-Bradley/ButtonVR.git
cd ButtonVR
npm install
npm run dev
```

Visit http://127.0.0.1:3000/

This is a TypeScript project consisting of two sub projects with there own *tsconfigs*.

To edit this example, then modify the files in `./src/client/` or `./src/server/`

The projects will auto recompile if you started it by using *npm run dev*

##  How to import ButtonVR

You can import the generated `./dist/client/buttonvr.js` directly into your own project as a module.

```javascript
<script type="module" src="./buttonvr.js"></script>
```

or as relative ES6 import

```javascript
import GrabVR from './buttonvr.js'
```

or if using a bundler such as webpack or rollup

```javascript
import ButtonVR from 'buttonvr'
```

## Example 1

Basic ButtonVR demo.

[![ButtonVR Example 1](./dist/client/img/buttonvr-1.gif)](https://sbcode.net/threejs/buttonvr-1/)

