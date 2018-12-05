const d3Color = require('d3-color');
const d3Interpolate = require('d3-interpolate');
const d3Chromatic = require('d3-scale-chromatic');
const Celestial = require('./subjects/celestial.js');
const Stars = require('./subjects/stars.js');
const FirstPersonControls = require('./controls/first_person_controls.js');

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
        this.camera.position.z = this.worldDimensions.depth*-0.5;
        this.camera.position.y = 0;
        this.camera.position.x = 0;
        this.subjects = this.createSubjects(this.scene);
        this.controls = this.createControls();
        // this.camera.lookAt(new THREE.Vector3(
        //     1,//this.worldDimensions.width/2,
        //     1,//this.worldDimensions.width/2,
        //     1//this.worldDimensions.width/2
        //     )
        //);
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

    createSubjects(scene){
        const sun = new Celestial(scene, {
            'position': new THREE.Vector3(0, 0, this.worldDimensions.height*3.),
            'color': '#ffffff', 
            'intensity': 50, 
            'flagShowHelper': true
        });

        // SPHERE 1
        // const layer1 = new Stars(scene, {
        //     'number': 100,
        //     'usePalette': true,
        //     'colorPalette': d3Chromatic.interpolateCubehelixDefault,
        //     'minOrbitRadius': 250,
        //     'maxOrbitRadius': 250,
        //     'center': new THREE.Vector3(0,0,0),
        //     'orbitSpeed': 0.0015
        // });
        // const layer2 = new Stars(scene, {
        //     'number': 100,
        //     'usePalette': true,
        //     'colorPalette': d3Chromatic.interpolateCubehelixDefault,
        //     'minOrbitRadius': 250,
        //     'maxOrbitRadius': 250,
        //     'center': new THREE.Vector3(0,0,0),
        //     'orbitSpeed': 0.002
        // });
        // const layer3 = new Stars(scene, {
        //     'number': 100,
        //     'usePalette': true,
        //     'colorPalette': d3Chromatic.interpolateCubehelixDefault,
        //     'minOrbitRadius': 250,
        //     'maxOrbitRadius': 250,
        //     'center': new THREE.Vector3(0,0,0),
        //     'orbitSpeed': 0.0025
        // });
        // const layer4 = new Stars(scene, {
        //     'number': 100,
        //     'usePalette': true,
        //     'colorPalette': d3Chromatic.interpolateCubehelixDefault,
        //     'minOrbitRadius': 250,
        //     'maxOrbitRadius': 250,
        //     'center': new THREE.Vector3(0,0,0),
        //     'orbitSpeed': 0.003
        // });

        // SPHERE 2
        const sphereOffset = 250;
        const layer5 = new Stars(scene, {
            'number': 1000,
            'usePalette': true,
            'colorPalette': d3Chromatic.interpolateWarm,
            'minOrbitRadius': 250,
            'maxOrbitRadius': 250,
            'center': new THREE.Vector3(sphereOffset,0,0),
            'orbitSpeed': -0.0015
        });
        const layer6 = new Stars(scene, {
            'number': 100,
            'usePalette': true,
            'colorPalette': d3Chromatic.interpolateWarm,
            'minOrbitRadius': 250,
            'maxOrbitRadius': 250,
            'center': new THREE.Vector3(sphereOffset,0,0),
            'orbitSpeed': -0.002
        });
        const layer7 = new Stars(scene, {
            'number': 1000,
            'usePalette': true,
            'colorPalette': d3Chromatic.interpolateWarm,
            'minOrbitRadius': 250,
            'maxOrbitRadius': 250,
            'center': new THREE.Vector3(sphereOffset,0,0),
            'orbitSpeed': -0.0025
        });
        const layer8 = new Stars(scene, {
            'number': 1000,
            'usePalette': true,
            'colorPalette': d3Chromatic.interpolateWarm,
            'minOrbitRadius': 250,
            'maxOrbitRadius': 250,
            'center': new THREE.Vector3(sphereOffset,0,0),
            'orbitSpeed': -0.003
        });

        const subjects = [
            // layer1,
            // layer2,
            // layer3,
            // layer4,
            layer5,
            layer6,
            layer7,
            layer8,
        ];

        console.log(subjects);
        return subjects;
    }

    createControls(scene) {
        const controls = {
            camControls: new FirstPersonControls(this.camera)
        };
        console.log(controls);
        return controls;
    }

    update() {
        this.controls.camControls.update(this.clock.getDelta());

        // SPHERE 1
        this.subjects[0].update();
        this.subjects[1].update();
        this.subjects[2].update();
        this.subjects[3].update();

        // SPHERE 2
        // this.subjects[4].update();
        // this.subjects[5].update();
        // this.subjects[6].update();
        // this.subjects[7].update();

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