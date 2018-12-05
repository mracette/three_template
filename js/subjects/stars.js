const d3Color = require('d3-color');
const d3Interpolate = require('d3-interpolate');
const d3Chromatic = require('d3-scale-chromatic');

class Stars {
    constructor(scene, params) {
        // SCENE
        this.scene = scene;
        // PARAMS
        this.color = params.color;
        this.usePalette = params.usePalette;
        this.colorPalette = params.colorPalette;
        this.minOrbitRadius = params.minOrbitRadius;
        this.maxOrbitRadius = params.maxOrbitRadius;
        this.center = params.center;
        this.orbitSpeed = params.orbitSpeed
        // OTHER
        this.group = new THREE.Object3D;
        this.createSpheres(params.number);     
        this.group.position.copy(this.center);
        this.scene.add(this.group);
    }

    guassianRand(){
        var rand = 0;
        for (var i = 0; i < 6; i += 1) {
            rand += Math.random();
        }
        return rand / 6;
    }

    normalize(x,y,z,r){
        const nX = r*x/Math.sqrt(x*x+y*y+z*z)
        const nY = r*y/Math.sqrt(x*x+y*y+z*z)
        const nZ = r*z/Math.sqrt(x*x+y*y+z*z)
        return {
            x: nX,
            y: nY,
            z: nZ
        };
    }

    createSpheres(n){
        const starRadius = 100;
        let sphereGeo = new THREE.SphereGeometry(starRadius, 32, 32);
        for(let i = 0; i < n; i++){
            let color;
            if(this.usePalette){
                color = new THREE.Color(this.colorPalette(Math.random()));
            } else {
                color = new THREE.Color(this.color);
            }
            let sphereMat = new THREE.MeshBasicMaterial({color: color});
            let randomCoords = this.normalize(
                -1+2*this.guassianRand(), // (-1, 1) bound
                -1+2*this.guassianRand(), // (-1, 1) bound
                -1+2*this.guassianRand(), // (-1, 1) bound
                this.minOrbitRadius + Math.random() * (this.maxOrbitRadius-this.minOrbitRadius)
            );
            let randomVector = new THREE.Vector3(
                randomCoords.x,// + this.center.x, 
                randomCoords.y,// + this.center.y, 
                randomCoords.z// + this.center.z
            );
            let sphere = new THREE.Mesh(sphereGeo, sphereMat);
            sphere.position.copy(randomVector);
            this.group.add(sphere);
        }
    }

    update() {
        // this.group.rotateX(this.orbitSpeed);
        // this.group.rotateY(this.orbitSpeed);
        // this.group.rotateZ(this.orbitSpeed);
        //this.group.rotateOnAxis(new THREE.Vector3(0,1,0),this.orbitSpeed);
        //this.group.rotation.x += this.orbitSpeed;
        //this.group.rotation.z += this.orbitSpeed;
        //this.group.rotation.y += this.orbitSpeed;
        this.group.rotateOnAxis(
            new THREE.Vector3(1,1,1).normalize(), this.orbitSpeed
        );
    }
}
module.exports = Stars;