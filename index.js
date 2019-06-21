
// THREE imports
const THREE = window.THREE = require('three');
require('three/examples/js/controls/OrbitControls.js');
require('three/examples/js/exporters/GLTFExporter.js');
require('three/examples/js/loaders/GLTFLoader.js');
require('three/examples/js/utils/BufferGeometryUtils.js');	

// other imports
const SceneManager = require('./src/scene-manager.js');

// create scene manager to handle THREE.js operations
const manager = new SceneManager();

manager.init().then(() => {
    document.body.append(manager.renderer.domElement);
    bindEventListeners();
    animate();
})

function bindEventListeners() {
    window.addEventListener(
        'resize', 
        manager.onWindowResize(window.innerWidth, window.innerHeight), 
        false
    );
}

function animate() {
    requestAnimationFrame(animate);
    manager.render();
}