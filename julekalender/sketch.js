var days = [];
var daysNum = 25;


function setupDays(days) {
  for (var i = 0; i < daysNum; i++) {
    days[i] = {
      "num": i+1,
      "event": null,
      "active": false,
      "hovering": false,
      "image": null
    }
  }
  return days
}

days = setupDays(days);

function preload() {
  for (var i = 0; i < daysNum; i++) {
    days[i].image = loadImage(`images/img${i}.png`);
  }
}

function setup() {
  createCanvas(800, 800);
  
  textAlign(CENTER, CENTER);
  
}

function drawDays() {
  // Create days box
  textSize(32);
  for (var row = 0; row < sqrt(daysNum); row++) {
    for (var col = 0; col < sqrt(daysNum); col++) {
      // Draw a box for each day that fits in the canvas
      var boxWidth = width / sqrt(daysNum);
      var boxHeight = height / sqrt(daysNum);
      var x = col * boxWidth;
      var y = row * boxHeight;
      fill(255);
      if (days[row * sqrt(daysNum) + col].hovering) {
        fill(0, 255, 0);
      }
      rect(x, y, boxWidth, boxHeight);
      // Draw the day number
      fill(0);
      if (days[row * sqrt(daysNum) + col].active) {
        fill(255, 0, 0);
        image(days[row * sqrt(daysNum) + col].image, x, y, boxWidth, boxHeight);
      }
      else {
        text(days[row * sqrt(daysNum) + col].num, x + boxWidth / 2, y + boxHeight / 2);
      }
    }
  }
}

function interactDay() {
  // Check if mouse is hovering over a day
  for (var row = 0; row < sqrt(daysNum); row++) {
    for (var col = 0; col < sqrt(daysNum); col++) {
      var boxWidth = width / sqrt(daysNum);
      var boxHeight = height / sqrt(daysNum);
      var x = col * boxWidth;
      var y = row * boxHeight;
      if (mouseX > x && mouseX < x + boxWidth && mouseY > y && mouseY < y + boxHeight) {
        days[row * sqrt(daysNum) + col].hovering = true;
      }
      else {
        days[row * sqrt(daysNum) + col].hovering = false;
      }
    }
  }
}

function mousePressed() {
  // Toggle the active state of a day when it is clicked
  for (var i = 0; i < daysNum; i++) {
    var row = floor(i / sqrt(daysNum));
    var col = i % int(sqrt(daysNum));
    var boxWidth = width / sqrt(daysNum);
    var boxHeight = height / sqrt(daysNum);
    var x = col * boxWidth;
    var y = row * boxHeight;
    if (mouseX > x && mouseX < x + boxWidth && mouseY > y && mouseY < y + boxHeight) {
      days[i].active = !days[i].active;
      break; // Stop checking once we've found the clicked day
    }
  }
}

function draw() {
  background(220);
  drawDays();
  interactDay();
}