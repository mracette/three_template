class SceneManager {
    constructor(){
        this.clock = new THREE.Clock(true);
        this.screenDimensions = {
            width: window.innerWidth,
            height: window.innerHeight
        }
        this.worldDimensions = {
            width: 1000,
            height: 1000,
            depth: 1000
        };
    }

    init() {
        return new Promise((resolve, reject) => {
            try {
                // lights, camera, action
                this.scene = this.initScene();
                this.renderer = this.initRender();
                this.camera = this.initCamera();
                this.lights = this.initLights();
                this.controls = this.initControls();
                this.helpers = this.initHelpers();
                resolve();
            } catch(e) {
                console.error(e);
                reject(e)
            }
        })
    }

    render() {
        let d = this.clock.getDelta();
        let e = this.clock.getElapsedTime();
        this.renderer.render(this.scene, this.camera);
    }

    initScene() {
        const scene = new THREE.Scene();
        scene.background = new THREE.Color('#1F262F');
        return scene;
    }

    initRender() {
        const renderer = new THREE.WebGLRenderer( { antialias: true } );
        const DPR = (window.devicePixelRatio) ? window.devicePixelRatio : 1;

        renderer.setSize(this.screenDimensions.width, this.screenDimensions.height);
        renderer.setClearColor( 0xffffff, 1 );
        renderer.setPixelRatio( DPR );

        return renderer;
    }

    initCamera(type, frustrum) {

        const fieldOfView = 60;
        const nearPlane = 1;
        const farPlane = 1000; 
        const aspect = this.screenDimensions.width / this.screenDimensions.height;
        let camera;
        
        switch(type || 'perspective') {
            case 'perspective':
                camera = new THREE.PerspectiveCamera(fieldOfView, 1, nearPlane, farPlane);
                break;
            case 'orthographic':
                let f = frustrum || 50;
                camera = new THREE.OrthographicCamera(-f, f, f / aspect, -f / aspect, nearPlane, farPlane);
                break;
        }
        
        camera.position.set(0, 0, 50);
        return camera;
    }

    initLights(){
        const lights = {
            ambient: new THREE.AmbientLight(0xffffff, 0.3),
        };
        this.scene.add(lights.ambient);
        return lights;
    }

    initSubjects(){
        const subjects = {
        };
        return subjects;
    }

    initControls() {
        const controls = {
        };

        return controls;
    }

    initHelpers() {
        const helpers = {
            exporter: new THREE.GLTFExporter(),
            loader: new THREE.GLTFLoader()
        }
        return helpers;
    }

    importModel(path, obj){
        return new Promise((resolve, reject) => {
            this.helpers.loader.load(
                path,
                function(obj){
                    resolve(obj.scene.children);
                },
                function ( xhr ) {
                    //console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );
                },
                function ( error ) {
                    console.log( 'Error loading model: ' + error );
                    reject(error)
                }
            );
        });
    }

    exportModel(subject, fileName){
        let exporter = new THREE.GLTFExporter();
        exporter.parse(subject, (obj) => {
            downloadGLTF(obj, fileName);
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

    onWindowResize(newWidth, newHeight){
        this.screenDimensions.width = newWidth;
        this.screenDimensions.height = newHeight;
        this.camera.aspect = this.screenDimensions.width / this.screenDimensions.height;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(this.screenDimensions.width, this.screenDimensions.height);
    }
};

module.exports = SceneManager;