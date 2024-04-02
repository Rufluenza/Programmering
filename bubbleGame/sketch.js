gameMap = {
    w: 850,
    h: 600,
    foodSpawnRate: 50,
    foodSize: 10,
    foodPoints: 5,
    startFoodCount: 10
  }
  
  let food = [];
  
  function createFood() {
    const newFood = {
      x: random(width),
      y: random(height),
      radius: gameMap.foodSize // Use the size from gameMap
    };
    food.push(newFood);
  }
  
  let players = []; // Array to store multiple players
  let splitCooldown = 0; // Cooldown timer
  
  class Player {
    constructor(name, x, y, radius, col) {
      this.name = name;
      this.x = x;
      this.y = y;
      this.radius = radius;
      this.col = col;
      this.velocity = createVector(0, 0); // Vector for movement
      this.speed = 5;
      this.maxSpeed = 15;
      this.friction = 0.5;
      this.points = 0;
    }
  
    update() {
      // ---------------- MOVEMENT ----------------
      // Handle movement based on user input (e.g., mouse or keyboard)  + this.radius + this.velocity.y + this.speed
      if (keyIsDown(UP_ARROW) && this.y - this.speed - this.radius > 0) {
        this.velocity.y -= this.speed;
      }
      if (keyIsDown(DOWN_ARROW) && this.y + this.speed + this.radius < gameMap.h) {
        this.velocity.y += this.speed;
      }
      if (keyIsDown(LEFT_ARROW) && this.x - this.speed - this.radius > 0) {
        this.velocity.x -= this.speed;
      }
      if (keyIsDown(RIGHT_ARROW) && this.x + this.speed + this.radius < gameMap.w) {
        this.velocity.x += this.speed;
      }
  
  
      // Limit speed and apply easing for smoother movement
      if (this.velocity > this.maxSpeed) {
        this.velocity = this.maxSpeed
      }
      if (this.velocity < -this.maxSpeed) {
        this.velocity = -this.maxSpeed
      }
      // Add ease in and out effect
      this.velocity.x *= this.friction
      this.velocity.y *= this.friction
      // Update position based on velocity
      this.x += this.velocity.x;
      this.y += this.velocity.y;
      
      // ------------------ food --------------
      for (let i = food.length - 1; i >= 0; i--) {
        const foodItem = food[i];
        if (dist(this.x, this.y, foodItem.x, foodItem.y) < this.radius + foodItem.radius) {
          this.points += gameMap.foodPoints; // Use points from gameMap
          this.radius = this.points + 10;
          food.splice(i, 1); // Remove consumed food
        }
      }
      
      // ----------------- SPLIT MECHANIC --------------
      // Split logic
      if (keyIsDown(ENTER) && this.points >= 20 && splitCooldown <= 0) {
        this.points /= 2;
        this.radius = this.points + 10;
  
        const newPlayer = new Player(
          this.name,
          this.x + this.radius, // Offset for second player
          this.y,
          this.radius,
          this.col
        );
        players.push(newPlayer);
  
        splitCooldown = 50; // Set cooldown to 0.5 seconds
      }
      // Collision detection and response
      for (let j = 0; j < players.length; j++) {
        const otherPlayer = players[j];
        if (this !== otherPlayer) {
          const combinedRadius = this.radius + otherPlayer.radius;
          const distance = dist(this.x, this.y, otherPlayer.x, otherPlayer.y);
  
          if (distance < combinedRadius) {
            // Calculate minimum acceptable distance based on radii
            const minDistance = this.radius + otherPlayer.radius - 1; // Adjust -1 for slight gap
  
            // Normalize direction vector towards other player
            const direction = createVector(
              otherPlayer.x - this.x,
              otherPlayer.y - this.y
            ).normalize();
  
            // Move players apart along the normalized direction
            const overlap = distance - minDistance;
            this.x += overlap * direction.x;
            this.y += overlap * direction.y;
            otherPlayer.x -= overlap * direction.x;
            otherPlayer.y -= overlap * direction.y;
          }
        }
      }
  
      // Merging logic
      for (let i = 0; i < players.length; i++) {
        const otherPlayer = players[i];
        if (
          this !== otherPlayer &&
          dist(this.x, this.y, otherPlayer.x, otherPlayer.y) < this.radius * 2 &&
          splitCooldown <= 0
        ) {
          this.points += otherPlayer.points;
          this.radius = this.points + 10;
          players.splice(i, 1); // Remove merged player
          splitCooldown = 100; // Set cooldown to prevent immediate re-splitting
        }
      }
    }
    
    
  
    draw() {
      // Draw the player cell
      fill(this.col);
      ellipse(this.x, this.y, this.radius * 2);
    }
  }
  
  class Bot {
    constructor(x, y, radius, maxSpeed, sightRange, minHideDistance) {
      this.x = x;
      this.y = y;
      this.radius = radius;
      this.velocity = createVector(0, 0);
      this.target = null;
      this.targetType = "none";
      this.maxSpeed = maxSpeed;
      this.sightRange = sightRange;
      this.minHideDistance = minHideDistance;
    }
  
    update() {
      // Find closest targets
      const closestBot = this.findClosestTarget(players, "bot");
      const closestFood = this.findClosestTarget(food, "food");
  
      // Choose target based on priorities
      if (closestBot && closestBot.radius < this.radius) {
        this.target = closestBot;
        this.targetType = "bot";
      } else if (closestFood) {
        this.target = closestFood;
        this.targetType = "food";
      } else {
        // Check for "hide" behavior
        const nearbyThreat = this.findNearbyThreat();
        if (nearbyThreat) {
          this.target = null;
          this.targetType = "none";
          this.velocity = createVector(
            this.x - nearbyThreat.x,
            this.y - nearbyThreat.y
          ).normalize(); // Move away from threat
        } else {
          // No target, move randomly or towards map center
          this.velocity = createVector(random(-1, 1), random(-1, 1));
        }
      }
  
      // Move towards target or away from threat
      if (this.target) {
        this.velocity = this.target.position.sub(this.position).normalize();
      }
      this.velocity.limit(this.maxSpeed);
      this.position.add(this.velocity);
    }
  
    draw() {
      // Draw the bot cell (customize appearance as needed)
      fill(255, 100, 100); // Example color
      ellipse(this.x, this.y, this.radius * 2);
    }
  
    findClosestTarget(targets, targetType) {
      let closestTarget = null;
      let closestDistance = Infinity;
      for (const target of targets) {
        const distance = dist(this.x, this.y, target.x, target.y);
        if (
          distance < closestDistance &&
          distance < this.sightRange &&
          target !== this // Avoid targeting itself
        ) {
          closestTarget = target;
          closestDistance = distance;
        }
      }
      return closestTarget;
    }
  
    findNearbyThreat() {
      for (const player of players) {
        if (
          player !== this &&
          player.radius >= this.radius &&
          dist(this.x, this.y, player.x, player.y) < this.minHideDistance
        ) {
          return player;
        }
      }
      return null;
    }
  }
  
  function setup() {
    createCanvas(gameMap.w, gameMap.h);
    player = new Player("Ruben", 50, 50, 10, color(255, 0, 0))
    for (var i = 0; i < gameMap.startFoodCount; i++) {
      createFood();
    }
    bots = [];
    for (let i = 0; i < 5; i++) {
      bots.push(new Bot(random(width), random(height), 10, 3, 150, 100));
    }
  }
  
  function draw() {
    background(220);
    // Update and draw all players
    for (let i = players.length - 1; i >= 0; i--) {
      const player = players[i];
      player.update();
      player.draw();
    }
  
    // Decrement cooldown timer
    splitCooldown = max(0, splitCooldown - 1);
    
    // Draw food
    for (const foodItem of food) {
      fill(color(100, 255, 100));
      ellipse(foodItem.x, foodItem.y, foodItem.radius * 2);
    }
  
    // Create new food occasionally
    if (frameCount % gameMap.foodSpawnRate === 0) { // Use spawn rate from gameMap
      createFood();
    }
    player.update()
    player.draw()
    // Update and draw bots
    for (const bot of bots) {
      bot.update();
      bot.draw();
    }
  }