import React from 'react';
import Box from './Box';
import Environment from './Environment';
import Sketch from 'react-p5';

class Monkey extends Box {
    constructor(p5, sight, speed, environ) {
        super(p5, 'monkey');
        this.isDead = false;
        this.sight = sight;
        this.speed = speed; //value inbetween 0 and 1. 1 is fastest 
        this.hunger = 1500;
        this.color = this.isDead ? p5.color(255, 255, 255) : p5.color(69, 44, 21);
        this.environ = environ;
        this.x = Math.floor(p5.random(0, this.environ.board.length));
        this.y = Math.floor(p5.random(0, this.environ.board[0].length));
        this.hasSeenFood = undefined;
    }

    // This method scans the surrounding area of the monkey for food (Fruit) and returns an array of food positions.
    scanFood() {
        if(this.hasSeenFood == undefined){
            const food = [];
            const startX = Math.max(0, this.x - this.sight); // Calculate the starting X position for scanning
            const endX = Math.min(this.environ.board.length - 1, this.x + this.sight); // Calculate the ending X position for scanning
            const startY = Math.max(0, this.y - this.sight); // Calculate the starting Y position for scanning
            const endY = Math.min(this.environ.board[0].length - 1, this.y + this.sight); // Calculate the ending Y position for scanning

            // Iterate through the area within the sight of the monkey
            for (let i = startX; i <= endX; i++) {
                for (let j = startY; j <= endY; j++) {
                    const box = this.environ.board[i][j]; // Get the box at the current position
                    if (box.kind == 'food') { // Check if the box is a Fruit
                        this.hasSeenFood = { x: i, y: j }; // Add the position of the fruit to the food array
                        return; // Return the array of food positions
                    }
                }
            }
            return;
        }
    }
    move(p5) {
        this.scanFood();
        if (!this.isDead) {
            if (this.hasSeenFood !== undefined) {
                if ((Math.random() * 5) < this.speed) {
                    const foodPosition = this.hasSeenFood;
                    const foodX = foodPosition.x;
                    const foodY = foodPosition.y;

                    // Set the previous position to land
                    this.environ.board[this.x][this.y] = new Box(p5, 'land');

                    // Move towards the food
                    if (foodX < this.x) {
                        this.x--;
                    } else if (foodX > this.x) {
                        this.x++;
                    }
                    if (foodY < this.y) {
                        this.y--;
                    } else if (foodY > this.y) {
                        this.y++;
                    }

                    // Update the monkey's position on the board
                    if (this.environ.board[this.x][this.y].kind === 'food') {
                        this.hunger += 1500; // Add 1500 hunger if the space the monkey was on was food
                        this.hasSeenFood = undefined; // Reset the hasSeenFood property
                    }
                    this.environ.board[this.x][this.y] = this;
                }
            } else {
                if ((Math.random() * 5) < this.speed) {
                    // Set the previous position to land
                    this.environ.board[this.x][this.y] = new Box(p5, 'land');

                    // Move randomly
                    this.x += Math.floor(Math.random() * 3) - 1;
                    this.y += Math.floor(Math.random() * 3) - 1;
                    if (this.x < 0) {
                        this.x = 0;
                    } else if (this.x >= this.environ.board.length) {
                        this.x = this.environ.board.length - 1;
                    } else if (this.y < 0) {
                        this.y = 0;
                    }
                    this.environ.board[this.x][this.y] = this;
                }
            }
            this.hunger--;
            if (this.hunger <= 0) {
                this.isDead = true;
                this.color = p5.color(255,255,255);
            }
        }
    }
    

    drawMonkey(p5) {
        p5.fill(this.color);
        p5.noStroke();
        p5.ellipse(this.x, this.y, this.sight, this.sight);
    }
}

export default Monkey;
