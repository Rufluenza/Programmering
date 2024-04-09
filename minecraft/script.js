// Set up the scene
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x2d2d2d);

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.speed = 0.1;
camera.rotationSpeed = 0.05;

camera.position.z = 0;
camera.position.x = 0;
camera.position.y = 0;

// make the clock
const clock = new THREE.Clock();


// Create the renderer
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);
class Player {
    constructor(scene, initialPosition) {
      this.scene = scene;
      this.position = initialPosition;
      this.orientation = new THREE.Vector3(0, 0, 0);
      this.movementSpeed = 0.01;
      this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
      this.camera.position.copy(this.position);
      this.camera.lookAt(new THREE.Vector3(0, 0, 0));
      this.scene.add(this.camera);
  
      this.setupMouseInput();
      this.setupMovementInput();
    }
  
    setupMouseInput() {
      document.addEventListener('mousemove', this.handleMouseMove.bind(this), false);
      document.addEventListener('mousemove', this.handleMouseMove.bind(this), false);
        document.body.requestPointerLock = document.body.requestPointerLock || document.body.mozRequestPointerLock;
        document.exitPointerLock = document.exitPointerLock || document.mozExitPointerLock;
        document.body.requestPointerLock();
    }
  
    handleMouseMove(event) {
      const movementX = event.movementX || event.mozMovementX || event.webkitMovementX || 0;
      const movementY = event.movementY || event.mozMovementY || event.webkitMovementY || 0;
  
      this.orientation.y -= movementX * 0.002;
      this.orientation.x -= movementY * 0.002;
      this.orientation.x = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, this.orientation.x));

      const euler = new THREE.Euler(this.orientation.x, this.orientation.y, 0, 'YXZ');
      this.camera.quaternion.setFromEuler(euler);
    }
  
    setupMovementInput() {
      document.addEventListener('keydown', this.handleKeyDown.bind(this), false);
      document.addEventListener('keyup', this.handleKeyUp.bind(this), false);
  
      this.moveForward = false;
      this.moveBackward = false;
      this.moveLeft = false;
      this.moveRight = false;
    }
  
    handleKeyDown(event) {
      switch (event.keyCode) {
        case 87: // W
          this.moveForward = true;
          break;
        case 83: // S
          this.moveBackward = true;
          break;
        case 65: // A
          this.moveLeft = true;
          break;
        case 68: // D
          this.moveRight = true;
          break;
      }
    }
  
    handleKeyUp(event) {
      switch (event.keyCode) {
        case 87: // W
          this.moveForward = false;
          break;
        case 83: // S
          this.moveBackward = false;
          break;
        case 65: // A
          this.moveLeft = false;
          break;
        case 68: // D
          this.moveRight = false;
          break;
      }
    }
  
    update(deltaTime) {
      const direction = new THREE.Vector3();
      const frontVector = new THREE.Vector3(0, 0, -1);
      const sideVector = new THREE.Vector3(1, 0, 0);
  
      frontVector.applyQuaternion(this.camera.quaternion);
      sideVector.applyQuaternion(this.camera.quaternion);
  
      direction.z = Number(this.moveForward) - Number(this.moveBackward);
      direction.x = Number(this.moveRight) - Number(this.moveLeft);
      direction.normalize();
    
      if (this.moveForward || this.moveBackward) {
        this.position.addScaledVector(frontVector, direction.z * this.movementSpeed * deltaTime);
      }
      if (this.moveLeft || this.moveRight) {
        this.position.addScaledVector(sideVector, direction.x * this.movementSpeed * deltaTime);
      }
      /*
      const velocity = new THREE.Vector3();
      if (this.moveForward || this.moveBackward) {
        velocity.z = direction.z * this.movementSpeed * deltaTime;
      }
      if (this.moveLeft || this.moveRight) {
        velocity.x = direction.x * this.movementSpeed * deltaTime;
      }
      this.position.add(velocity);
      */
  
      this.camera.position.copy(this.position);
    }
}
const player = new Player(scene, new THREE.Vector3(0, 0, 0));

// make a cube to use as a reference
const geometry = new THREE.BoxGeometry();
const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
const cube = new THREE.Mesh(geometry, material);
cube.position.z = -10;
cube.position.x = 0;
cube.position.y = 0;
scene.add(cube);


// Set up the game loop
let lastTime = 0;
function gameLoop(timestamp) {
  const deltaTime = timestamp - lastTime;
  lastTime = timestamp;

  // Update the player
  player.update(deltaTime);

  // Render the scene
  renderer.render(scene, player.camera);

  // Request the next frame
  requestAnimationFrame(gameLoop);
}

// Start the game loop
requestAnimationFrame(gameLoop);