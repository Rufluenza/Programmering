// Set up the scene
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x2d2d2d);

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.speed = 0.1;
camera.rotationSpeed = 0.05;

camera.position.z = 50;
camera.position.x = 0;
camera.position.y = 0;

// make the clock
const clock = new THREE.Clock();

// Get the canvas
const canvas = document.querySelector('canvas');
// Create the renderer
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);


class Vector {
    constructor(x, y, z) {
        this.x = x;
        this.y = y;
        this.z = z;
    }
    add(vec) {
        this.x += vec.x;
        this.y += vec.y;
        this.z += vec.z;
    }

}
// Create a list of spheres
const spheres = [];
function createSphere(x, y, z, mass) {
    const geometry = new THREE.SphereGeometry(mass, 32, 32);
    const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
    const sphere = new THREE.Mesh(geometry, material);
    sphere.position.x = x;
    sphere.position.y = y;
    sphere.position.z = z;
    scene.add(sphere);
    sphere.vec = new Vector(x, y, z);
    sphere.mass = mass;
    spheres.push(sphere);
}
createSphere(0, 0, 0, 1);
createSphere(20, 20, 20, 2);

function calculateGravity(vec1, vec2, mass1, mass2) {
    // Universal Gravitational Constant
    const G = 6.674 * Math.pow(10, -11);
    // get distance in x, y, z
    const dx = vec2.x - vec1.x;
    const dy = vec2.y - vec1.y;
    const dz = vec2.z - vec1.z;
    // get length of distance
    const lenDist = Math.sqrt((dx*dx)+(dy*dy)+(dz*dz))
    

    const force = G * ((mass1*mass2) / (lenDist*lenDist))

    const newForce = {
        x: (force / dx) / lenDist,
        y: (force / dy) / lenDist,
        z: (force / dz) / lenDist
    }

    return newForce
}


function calcGravityAllCubes() {
    // loop through the spheres and calculate the gravity between them
    let newForce = calculateGravity(spheres[0].vec, spheres[1].vec, spheres[0].mass, spheres[1].mass)
    console.log(newForce)
    spheres[0].vec = newForce
    /*
    for (let i = 0; i < spheres.length; i++) {
        for (let n = 0; n < spheres.length; n++) {
            if (i != n) {
                let newForce = calculateGravity(spheres[i].vec, spheres[(n+1)%spheres.length].vec, spheres[i].mass, spheres[(n+1)&spheres.length])
                spheres[i].vec.add(newForce)
            }
        }
    }
    */
}

function updateCubes() {
    calcGravityAllCubes()
    for (const sphere of spheres) {
        sphere.position.x = sphere.vec.x;
        sphere.position.y = sphere.vec.y;
        sphere.position.z = sphere.vec.z;
    }
    console.log(spheres[1].vec)
    
}

// animate function
function animate() {
    requestAnimationFrame(animate);

    // get the time
    const elapsedTime = clock.getElapsedTime();
    
    updateCubes()


    // render the scene
    renderer.render(scene, camera);
}

animate();