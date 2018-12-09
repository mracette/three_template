const d3Color = require('d3-color');
const d3Interpolate = require('d3-interpolate');
const d3Chromatic = require('d3-scale-chromatic');

//SUBJECTS
const Celestial = require('./subjects/celestial.js');
const Stars = require('./subjects/stars.js');
const PixelGrid = require('./subjects/pixel_grid.js');

//CONTROLS
const FirstPersonControls = require('./controls/first_person_controls.js');

//HELPERS
const VisibleAxes = require('./helpers/visible_axes.js');

class SceneManager {
    constructor(canvas){
        this.clock = new THREE.Clock(true);
        this.screenDimensions = {
            width: canvas.width,
            height: canvas.height
        }
        this.worldDimensions = {
            width: 1000,
            height: 1000,
            depth: 1000
        };
        this.scene = this.createScene();
        this.renderer = this.createRender(this.screenDimensions);
        this.camera = this.createCamera(this.screenDimensions);
        this.camera.position.z = this.worldDimensions.depth*-0.75;
        this.camera.position.y = 0;
        this.camera.position.x = 0;
        this.lights = this.createLights();
        this.subjects = this.createSubjects();
        this.controls = this.createControls();
        this.helpers = this.createHelpers();
    }

    createScene() {
        const scene = new THREE.Scene();
        scene.background = new THREE.Color('#1F262F');
        return scene;
    }

    createRender(screenDimensions) {
        const renderer = new THREE.WebGLRenderer({canvas: canvas, antialias: true, alpha: true}); 
        const DPR = (window.devicePixelRatio) ? window.devicePixelRatio : 1;
        renderer.setPixelRatio(DPR);
        renderer.setSize(screenDimensions.width, screenDimensions.height);
        renderer.gammaInput = true;
        renderer.gammaOutput = true; 
        renderer.shadowMap.enabled = true;
        renderer.shadowMapSoft = true;
        renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        return renderer;
    }

    createCamera(screenDimensions) {
        const aspectRatio = screenDimensions.width / screenDimensions.height;
        const fieldOfView = 60;
        const nearPlane = 1;
        const farPlane = 1000; 
        const camera = new THREE.PerspectiveCamera(fieldOfView, aspectRatio, nearPlane, farPlane);
        return camera;
    }

    createLights(){
        const lights = {
            ambient: new THREE.AmbientLight(0x222222),
            directional: new THREE.DirectionalLight( 0xffffff, 0.5 )
        };
        lights.directional.position.set(
            0,0,10
        );
        console.log(lights);
        this.scene.add(lights.ambient);
        this.scene.add(lights.directional);
        return lights;
    }

    createSubjects(){
        const subjects = {
        };
        console.log(subjects);
        return subjects;
    }

    createControls() {
        const controls = {
            camControls: new FirstPersonControls(this.camera)
        };
        console.log(controls);
        return controls;
    }

    createHelpers() {
        const helpers = {
            visibleAxes: new VisibleAxes(this.scene, {
                upperBound: 1000
            })
        }
        console.log(helpers);
        return helpers;
    }

    update() {
        this.controls.camControls.update(this.clock.getDelta());
        this.renderer.render(this.scene, this.camera);
    }

    onWindowResize(newWidth, newHeight){
        // reset screen dimensions
        this.screenDimensions.width = newWidth;
        this.screenDimensions.height = newHeight;
        this.camera.aspect = this.screenDimensions.width / this.screenDimensions.height;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(this.screenDimensions.width, this.screenDimensions.height);
    }
};

module.exports = SceneManager;