import React from 'react';
import Box from './Box';
import Environment from './Environment';
import Sketch from 'react-p5';

class Monkey extends Box {
    constructor(p5, x, y, sight, speed, environ, isFemale) {
        super(p5, 'monkey');
        this.isDead = false;
        this.sight = sight;
        this.speed = speed; //value inbetween 0 and 1. 1 is fastest 
        this.hunger = 1500;
        this.color = this.isDead ? p5.color(255, 255, 255) : p5.color(69, 44, 21);
        this.environ = environ;
        this.x = x;
        this.y = y;
        this.hasSeenFood = undefined;
        this.hasSeenMate = undefined;
        this.isFemale = isFemale;

        environ.board[x][y] = this;
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

    scanMate(){
        if(this.hasSeenMate == undefined){
            const mate = [];
            const startX = Math.max(0, this.x - this.sight); // Calculate the starting X position for scanning
            const endX = Math.min(this.environ.board.length - 1, this.x + this.sight); // Calculate the ending X position for scanning
            const startY = Math.max(0, this.y - this.sight); // Calculate the starting Y position for scanning
            const endY = Math.min(this.environ.board[0].length - 1, this.y + this.sight); // Calculate the ending Y position for scanning

            // Iterate through the area within the sight of the monkey
            for (let i = startX; i <= endX; i++) {
                for (let j = startY; j <= endY; j++) {
                    const box = this.environ.board[i][j]; // Get the box at the current position
                    if (box.kind == 'monkey' && box.isFemale != this.isFemale && !box.isDead) { // Check if the box is a Monkey, alive, and the opposite gender
                        this.isFemale ? this.hasSeenMate = { x: i-1, y: j-1 } : this.hasSeenMate = {x: i+1, y: j+1}; //females on the left, males on the right
                        console.log("mate seen")
                        console.log(this.hasSeenMate)
                        return;
                    }
                }
            }
            return;
        }
    }
    mate(p5){
        this.scanMate(); 
        if(this.hasSeenMate !== undefined){
            const matePosition = this.hasSeenMate;
            const mateX = matePosition.x;
            const mateY = matePosition.y;
            const mate = {
                mateSight: this.environ.board[mateX][mateY].sight,
                mateSpeed: this.environ.board[mateX][mateY].speed
            };
            // Set the previous position to land
            this.environ.board[this.x][this.y] = new Box(p5, 'land');

            if (mateX < this.x) {
                this.x--;
            } else if (mateX > this.x) {
                this.x++;
            }
            if (mateY < this.y) {
                this.y--;
            } else if (mateY > this.y) {
                this.y++;
            }

                // Check if the monkeys are next to each other
                if (Math.abs(this.x - mateX) === 1 && Math.abs(this.y - mateY) === 1) {
                    for(let i = 0; i < 500; i++){
                        console.log('mating');
                    }
                    const babySight = (this.sight + mate.mateSight) / 2;
                    const babySpeed = (this.speed + mate.mateSpeed) / 2;
                    if(this.isFemale){
                        this.environ.board[this.x+1][this.y+1] = new Monkey(p5, babySight, babySpeed, this.environ, Math.random() < 0.5);
                        return;
                }
                this.hasSeenMate = undefined; // Reset the hasSeenFood property
            this.environ.board[this.x][this.y] = this;
        }
    }
}
    move(p5) {
        this.scanFood();
        this.scanMate();
        if (!this.isDead) {
            if(this.hasSeenMate !== undefined){
                this.mate(p5)
            }
            else if (this.hasSeenFood !== undefined) {
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
                        this.x = 1;
                    } else if (this.x >= this.environ.board.length) {
                        this.x = this.environ.board.length - 1;
                    } else if (this.y < 0) {
                        this.y = 1;
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
