// Base Statements
const canvas = document.getElementById("canvas");
const c = canvas.getContext("2d");
const cw = canvas.width;
const ch = canvas.height;
const centerX = canvas.width/2;
const centerY = canvas.height/2;

// Game Statements
let gravity = 1;
let friction = 0.5;
let coinAmount = 5;
let score = 0;

// Player Object
let player = {
    x: centerX,
    y: centerY,
    dx: 0,
    dy: 0,
    size: 50,
    doubleJumps: 2,

    color: "black",
    

    // Player Actions
    jump: function() {
        if (this.doubleJumps != 0) {
            this.dy = -20;
            this.doubleJumps--;
        } 
    },
    slam: function() {
        this.dy += 20;
        this.doubleJumps = 2;
    },
    left: function() {
        if (this.dx <= -8) {
            this.dx -= 2;
        } else {
            this.dx = -8;
        }
    },
    right: function() {
        if (this.dx >= 8) {
            this.dx += 2;
        } else {
            this.dx = 8;
        }
    },

    // Draws the player model
    draw: function() {
        c.beginPath();
        c.rect(this.x, this.y, this.size, this.size);
        c.strokeStyle = this.color;
        c.stroke();
        c.closePath();
    },

    // Updates the player logic
    update: function() {

        // Wall & Floor collisions
        if (this.x + this.size + this.dx >= cw || this.x + this.dx <= 0) {
            this.dx = Math.ceil(-this.dx * friction);
        }

        if (this.y + this.dy <= 0) {
            this.dy = Math.ceil(-this.dy * friction);
        }     

        if (this.y + this.size + this.dy >= ch) {
            if (this.dy != -0) {
                this.dy = Math.ceil(-this.dy * friction);
                if (this.doubleJumps < 2) {
                    this.doubleJumps = 2;
                }
            }
        } else {
            this.dy += gravity;
        }

        // Coin Collection
        for (i = 0; i < coins.length; i++) {
            if (this.x + this.size >= coins[i].x && this.x <= coins[i].x + coins[i].size && this.y + this.size >=coins[i].y && this.y <= coins[i].y + coins[i].size) {
                coins[i].collect()
                this.doubleJumps += 2;
                score++;
            }
        }
        // Constant force of friction
        if (this.y + this.size >= ch) {
            this.dx = this.dx * 0.94;
        }

        // x & y movement
        this.y += this.dy;
        this.x += this.dx;

        // Calls draw??????
        this.draw();
    }

};

// Collectibles
let coins = [];
function coin(x, y, size) {
    this.x = x;
    this.y = y;
    this.size = size;
    this.color = "gold",

    this.collect = function() {
        this.x = Math.random() * (cw - size * 2) + size;
        this.y = Math.random() * (ch - size * 2) + size;
    },

    this.draw = function() {
        c.beginPath();
        c.rect(this.x, this.y, this.size, this.size);
        c.strokeStyle = this.color;
        c.stroke();
        c.closePath();
    }

    this.update = function() {
        this.draw();
    }
}

// Keyboard Stuff
document.addEventListener("keydown", function(event) {
    switch(event.key) {
        case "w":
            player.jump();
            break;

        case "s":
            player.slam();
            break;

        case "a":
            player.left();
            break;

        case "d":
            player.right();
            break;

    }
})

// Initialization
window.onload = init();
function init() {
    console.log("Initiated", document.currentScript.src);
    for (let i = 0; i < coinAmount; i++) {
        let size = 25;
        let x = Math.random() * (cw - size * 2) + size;
        let y = Math.random() * (ch - size * 2) + size;

        coins.push(new coin(x, y, size));
    }
    requestAnimationFrame(update);
}

// c.translate(0.5, 0.5);
// Updates the screen and other relative info
function update() {
    c.clearRect(0, 0, cw, ch);

    player.update();
    for (var i = 0; i < coins.length; i++) {
        coins[i].update();
    }

    displayText()
    requestAnimationFrame(update);
}

function displayText() {
    c.font = "50px Major Mono Display";
    c.fillText(score, 10, 50);
    c.fillText(player.doubleJumps, 10, 100);
}