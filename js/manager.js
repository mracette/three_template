//SUBJECTS

//CONTROLS
const FirstPersonControls = require('./controls/first_person_controls.js');

//HELPERS
const VisibleAxes = require('./helpers/visible_axes.js');
require('three/examples/js/loaders/GLTFLoader');
require('three/examples/js/exporters/GLTFExporter');

//EFFECTS

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
        this.camera.position.z = this.worldDimensions.depth * 0.1;
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
        };
        console.log(lights);
        this.scene.add(lights.ambient);
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
                upperBound: this.worldDimensions.width/2
            }),
            exporter: new THREE.GLTFExporter(),
            loader: new THREE.GLTFLoader()
        }
        console.log(helpers);
        return helpers;
    }

    loadModels() {
        return new Promise((resolve, reject) => {
            Promise.all([
                // this.importModel()
            ]).then(result => {
                let models = {

                }
                console.log(models);
                this.models = models
                resolve();
            }).catch(error => {
                console.log(error)
                reject(error);
            })
        });
    }

    importModel(path, obj){
        return new Promise((resolve, reject) => {
            this.helpers.loader.load(
                path,
                function(obj){
                    resolve(obj.scene.children);
                },
                function ( xhr ) {
                    console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );
                },
                function ( error ) {
                    console.log( 'Error loading model: ' + error );
                    reject(error)
                }
            );
        });
    }

    downloadGLTF(exportObj, exportName){
        var dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(exportObj));
        var downloadAnchorNode = document.createElement('a');
        downloadAnchorNode.setAttribute("href",     dataStr);
        downloadAnchorNode.setAttribute("download", exportName + ".gltf");
        document.body.appendChild(downloadAnchorNode); // required for firefox
        downloadAnchorNode.click();
        downloadAnchorNode.remove();
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