var playingOnWindows = 0
var shootKey = playingOnWindows === 0 ? 49 : 32

var player
var bullets = []
var enemyBullets = []
var bulletHeight = 15 // cant use bullet height if there are not bullets

var enemies = []
var enemyAnimationFrame = 0
var enemyStartCount = 3
var enemyMaxCount = 10
var enemyVec
var enemyLastXVec
var enemyTargetYPos
var wave = 0
var changeWave = 0
var ps = 4 // pixelSize
var tick = 0
var lastTick = -1
var tickSpeed = 400
var normalTickSpeed = 400
var fastTick = 0
var lastFastTick = -1
var fastTickSpeed = 200



class Bullet {
  constructor(startX, startY, target, bulletType=0) {
    this.x = startX
    this.y = startY
    this.dir = target === "enemy" ? -1 : 1
    this.w = 5
    this.h = bulletHeight
    this.speed = 3
    this.target = target
    
    this.bulletType = bulletType
    this.animDir = 1
    this.animFrame = 0
    this.animMaxFrame = 4
  }
  show() {
    if (this.bulletType === 0) {
      fill(0, 0, 255)
      rect(this.x, this.y, this.w, this.h)
    }
    
    /*
    if (this.bulletType === 1) {
      fill(255, 255, 255)
      rect(this.x, this.y, this.w, this.h)
      fill(255, 255, 255)
      if (this.animFrame >= this.animMaxFrame) {
        this.animDir = -1
      }
      if (this.animFrame <= 0) {
        this.animDir = 1
      }
      this.animFrame += this.animDir
      rect(this.x-2.5, this.y+(this.animFrame*2), this.w+5, 5)
    }
    */
  }
  move() {
    this.y += this.dir * this.speed
  }
  update() {
    this.move()
    this.show()
  }
}
class Enemy {
  constructor(startX = 30+(width/enemyStartCount)*enemies.length, startY = 0, type = 0, startHp = 1) {
    if (type == 0) {
      this.w = 12*ps
    }
    else if (type == 1) {
      this.w = 11*ps
    }
    else if (type == 2) {
      this.w = 8*ps
    }
    
    
    this.h = 8*ps
    this.x = startX
    this.y = startY
    this.speed = 0.25
    this.dir = createVector(1, 0)
    this.hp = startHp
    this.type = type
    this.lastShotTime = random(4000) // randomize so enemies dont shoot at the same time
    this.shootCooldown = 4000
    
  }
  show() {
    var x = this.x
    var y = this.y
    fill(255, 255, 255)
    if (this.type == 0) {
      var cx = this.w/2
      var cy = this.h/2
      // HEAD
      rect(x+cx-(2*ps), y, 4*ps, ps)
      rect(x+ps, y+ps, this.w-2*ps, ps)
      rect(x, y+2*ps, this.w, ps)
      // eye line
      rect(x, y+3*ps, 3*ps, ps)
      rect(x+5*ps, y+3*ps, 2*ps, ps)
      rect(x+9*ps, y+3*ps, 3*ps, ps)
      // after eye
      rect(x, y+4*ps, this.w, ps)
      // legs
      
      // leg center
      rect(x+5*ps, y+6*ps, 2*ps, ps)
      if (enemyAnimationFrame == 0) {
        // top legs
        rect(x+2*ps, y+5*ps, 3*ps, ps)
        rect(x+7*ps, y+5*ps, 3*ps, ps)
        rect(x+ps, y+6*ps, 2*ps, ps)
        rect(x+9*ps, y+6*ps, 2*ps, ps)
        // bottom legs
        rect(x+2*ps, y+7*ps, 2*ps, ps)
        rect(x+8*ps, y+7*ps, 2*ps, ps)
      } else {
        rect(x+3*ps, y+5*ps, 2*ps, ps)
        rect(x+7*ps, y+5*ps, 2*ps, ps)
        rect(x+2*ps, y+6*ps, 2*ps, ps)
        rect(x+8*ps, y+6*ps, 2*ps, ps)
        
        rect(x, y+7*ps, 2*ps, ps)
        rect(x+10*ps, y+7*ps, 2*ps, ps)
      }
    } else if (this.type == 1) {
      //ears
      rect(x+2*ps, y, ps, ps)
      rect(x+8*ps, y, ps, ps)
      rect(x+3*ps, y+ps, ps, ps)
      rect(x+7*ps, y+ps, ps, ps)
      // head
      rect(x+2*ps, y+2*ps, 7*ps, ps)
      // eye layer
      rect(x+ps, y+3*ps, 2*ps, ps)
      rect(x+4*ps, y+3*ps, 3*ps, ps)
      rect(x+8*ps, y+3*ps, 2*ps, ps)
      rect(x, y+4*ps, 11*ps, ps)
      if (enemyAnimationFrame == 0) {
        rect(x, y+5*ps, ps, 2*ps)
        rect(x+10*ps, y+5*ps, ps, 2*ps)
        rect(x+2*ps, y+5*ps, 7*ps, ps)
        rect(x+2*ps, y+6*ps, ps, ps)
        rect(x+8*ps, y+6*ps, ps, ps)
        rect(x+3*ps, y+7*ps, 2*ps, ps)
        rect(x+6*ps, y+7*ps, 2*ps, ps)
      } else {
        rect(x, y+ps, ps, 3*ps)
        rect(x+10*ps, y+ps, ps, 3*ps)
        rect(x+ps, y+5*ps, 9*ps, ps)
        rect(x+2*ps, y+6*ps, ps, ps)
        rect(x+8*ps, y+6*ps, ps, ps)
        rect(x+ps, y+7*ps, ps, ps)
        rect(x+9*ps, y+7*ps, ps, ps)
      }
    } else if (this.type == 2) {
      rect(x+3*ps, y, 2*ps, ps)
      rect(x+2*ps, y+ps, 4*ps, ps)
      rect(x+ps, y+2*ps, 6*ps, ps)
      // eye layer
      rect(x, y+3*ps, 2*ps, ps)
      rect(x+3*ps, y+3*ps, 2*ps, ps)
      rect(x+6*ps, y+3*ps, 2*ps, ps)
      rect(x, y+4*ps, this.w, ps)
      if (enemyAnimationFrame == 0) {
        rect(x+ps, y+5*ps, ps, ps)
        rect(x+3*ps, y+5*ps, 2*ps, ps)
        rect(x+6*ps, y+5*ps, ps, ps)
        rect(x, y+6*ps, ps, ps)
        rect(x+7*ps, y+6*ps, ps)
        rect(x+ps, y+7*ps, ps, ps)
        rect(x+6*ps, y+7*ps, ps, ps)
      } else {
        rect(x+2*ps, y+5*ps, ps, ps)
        rect(x+5*ps, y+5*ps, ps, ps)
        rect(x+ps, y+6*ps, ps, ps)
        rect(x+3*ps, y+6*ps, 2*ps, ps)
        rect(x+6*ps, y+6*ps, ps, ps)
        rect(x, y+7*ps, ps, ps)
        rect(x+2*ps, y+7*ps, ps, ps)
        rect(x+5*ps, y+7*ps, ps, ps)
        rect(x+7*ps, y+7*ps, ps, ps)
      }
    }
  }
  
  move() {
    // if enemy hits the sides go down
    if (enemyVec.x != 0) {
      if (this.x+this.w >= width || this.x <= 0) {
        enemyLastXVec = enemyVec.x
        enemyVec.x = 0
        enemyVec.y = 1
        enemyTargetYPos = this.y+this.h
      }
    }
    
    // when enemy hits the target ypos go to the other side
    if (enemyVec.y === 1) {
      if (this.y >= enemyTargetYPos) {
        enemyVec.y = 0
        enemyVec.x = -enemyLastXVec
        
      }
    }
    
    this.x += enemyVec.x * ps
    this.y += enemyVec.y * ps
    
  }
  shoot() {
    if (this.type === 1) {
      if (millis()-this.lastShotTime >= this.shootCooldown) {
        enemyBullets[enemyBullets.length] = new Bullet(this.x+(this.w/2), this.y+this.h, "player", 1)
        this.lastShotTime = millis() + random(this.shootCooldown/2)
      }
    }

  }
  
  update() {
    //this.move()
    this.show()
    this.shoot()
  }
  
}


class Player {
  constructor() {
    this.w = 40
    this.h = 20
    this.x = (width/2) - (this.w/2)
    this.y = height-30 - this.h
    this.speed = 2.5
    this.dir = 0
    this.lastShotTime = 0
    this.shootCooldown = 500
    this.hp = 3
  }
  show() {
    
    fill(0, 255, 0)
    // bottom part
    rect(this.x, this.y+10, this.w, this.h-10)
    // top of bottom
    rect(this.x+2, this.y+7, this.w-4, this.h-17)
    // get center of player and offset -4 because we want to draw 8 pixels wide cannon
    rect(this.x+(this.w/2)-4, this.y+2, 8, this.h-2)
    // Doing the same but only -2 because end of cannon is 4 pixels
    rect(this.x+(this.w/2)-2, this.y, 4, this.h)
    
  }
  move() {
    this.dir = 0
    if (keyIsDown(LEFT_ARROW) && this.x > 0) {
      this.dir = -1
    }
    if (keyIsDown(RIGHT_ARROW) && this.x + this.w < width) {
      this.dir = 1
    }
    
    this.x += this.dir * this.speed
  }
  shoot() {
    
    if (keyIsDown(SHIFT) && millis() - this.lastShotTime >= this.shootCooldown) { // change from shift to spacebar
      bullets[bullets.length] = new Bullet(this.x+(this.w/2)-2.5, this.y-bulletHeight+5, "enemy")
      this.lastShotTime = millis()
    }
  }
  update() {
    this.move()
    this.show()
    this.shoot()
  }
}






function enemyLoop() {
  for (var i = 0; i < enemies.length; i++) {
    // update all enemies
    enemies[i].update()
    // Check if enemies reach bottom of the screen
    if (enemies[i].y+enemies[i].h >= height) {
      enemies.splice(i, 1)
      player.hp--
    }
    
  }
}

function objCollision(obj1, obj2) {
  if (obj1.x+obj1.w >= obj2.x && obj1.x <= obj2.x+obj2.w) {
    if (obj1.y+obj1.h >= obj2.y && obj1.y <= obj2.y+obj2.h) {
      return true
    }
  }
  return false
}

function bulletUpdater() {
  for (var i = 0; i < bullets.length; i++) {
    bullets[i].update()
    for (var n = 0; n < enemies.length; n++) {
      if (objCollision(bullets[i], enemies[n])) {
        console.log("hit")
        bullets.splice(i, 1)
        enemies[n].hp--
        if (enemies[n].hp <= 0) {
          enemies.splice(n, 1)
        }
        // Break out of loop to ensure that we dont index an entry in the array that does not exist anymore.
        break
      }
    }
  }
}



function enemyBulletUpdater() {
  for (var i = 0; i < enemyBullets.length; i++) {
    enemyBullets[i].update()
    if (objCollision(enemyBullets[i], player)) {
      enemyBullets.splice(i, 1)
      player.hp--
      if (player.hp <= 0) {
        console.log("dead")
      }
      break
    }
    if (enemyBullets[i].y >= height) {
      enemyBullets.splice(i, 1)
      break
    }
  }
}

function waveUpdater() {
  if (enemies.length === 0 && changeWave === 0 && player.hp > 0) {
    changeWave = 1
    wave++
  }
  if (wave === 1 && changeWave === 1) {
    for (var i = 0; i < 10; i++) {
      for (var n = 0; n < 3; n++) {
        enemies[enemies.length] = new Enemy((width/10)*i, 40+(-40*n),0)
      }
    }
    changeWave = 0
  }
}
    

function drawBullet(x, y, type, frame=0) {
  fill(255, 255, 255)
  if (type == 1) {
    rect(x, y, ps, ps*5)
    rect(x+ps*frame, y, ps, ps*5)
  }
  else if (type == 2) {
    for (var i = frame; i < frame+8; i++) {
      rect(x+ps*sin((i*90)), y+ps*i, ps, ps)
    }
  }
}

function setup() {
  createCanvas(400, 400);
  background(0)
  noStroke()
  //frameRate(4)
  angleMode(DEGREES)
  
  enemyVec = createVector(1, 0)
  player = new Player()
  for (var i = 0; i < enemyStartCount; i++) {
    enemies[i] = new Enemy(undefined, undefined, i)
    
  }
}

function draw() {
  
  tick = floor(millis()/tickSpeed)
  fastTick = floor(millis()/(fastTickSpeed))
  
  if (tick != lastTick) {
    lastTick = tick
    enemyAnimationFrame = !enemyAnimationFrame
    fill(0)
    rect(0, 0, width, height)
    enemyLoop()
    
    waveUpdater()
    for (var i = 0; i < enemies.length; i++) {
      enemies[i].move()
    }
  }
  fill(0)
  rect(0, player.y, width, height)
  player.update()
  bulletUpdater()
  enemyBulletUpdater()
}