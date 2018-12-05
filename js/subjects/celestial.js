class Celestial {
    constructor(scene, params) {
        this.scene = scene;
        this.position = params.position;
        this.color = params.color;
        this.intensity = params.intensity || 30;
        this.helper = params.helper || false;
        this.group = new THREE.Group;
        this.light = this.createDirectionalLight();
        this.sphere = this.createSphere();
        if(this.helper){this.createCameraHelper();}
        this.scene.add(this.group);
    }
    createDirectionalLight() {
        let dirLight = new THREE.DirectionalLight(this.color, this.intensity);
        dirLight.castShadow = true;
        dirLight.shadow.mapSize.width = dirLight.shadow.mapSize.height = 128;
        dirLight.shadow.camera.lookAt(0,0,0);
        dirLight.shadow.camera.near = 0.1;
        dirLight.shadow.camera.far = 1000;
        dirLight.shadow.camera.left = -1000;
        dirLight.shadow.camera.bottom = -1000;
        dirLight.shadow.camera.right = 1000;
        dirLight.shadow.camera.top = 1000;
        dirLight.shadow.camera.position.copy(this.position);
        dirLight.position.copy(this.position);
        this.group.add(dirLight);
        return dirLight;
    }
    createCameraHelper() {
        let helper = new THREE.CameraHelper(this.light.shadow.camera);
        this.group.add(helper);
    }
    createSphere() {
        let sphereGeo = new THREE.SphereGeometry(50, 32, 32);
        let sphereMat = new THREE.MeshLambertMaterial({color: 0xFFFCDB});
        let sphere = new THREE.Mesh(sphereGeo, sphereMat);
        sphere.position.copy(this.position);
        this.group.add(sphere)
    }
    orbit(rX, rY, rZ) {
        if(rX !== undefined) {this.group.rotation.x = rX};
        if(rY !== undefined) {this.group.rotation.y = rY};
        if(rZ !== undefined) {this.group.rotation.z = rZ};
    }
    update(delta) {
        
    }
}
module.exports = Celestial;