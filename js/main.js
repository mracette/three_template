const THREE = window.THREE = require('three');
const SceneManager = require('./manager.js');

const canvas = document.getElementById("canvas");
const manager = new SceneManager(canvas);

bindEventListeners();
render();

console.log('opening main');

function bindEventListeners() {
    window.addEventListener(
        'resize', 
        manager.onWindowResize(window.innerWidth, window.innerHeight), 
        false
    );
}

function render() {
    requestAnimationFrame(render);
    manager.update();
}