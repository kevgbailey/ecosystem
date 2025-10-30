import React from 'react';
import Box from './Box';
import Environment from './Environment';
import Sketch from 'react-p5';

class Monkey extends Box {
    constructor(p5, x, y, sight, speed, environ, isFemale) {
        super(p5, 'monkey');
        this.isDead = false;
        this.sight = sight;
        this.speed = speed; //value inbetween 0 and 1, 1 is fastest 
        this.hunger = 1500;
        this.matingCooldown = 1500;
        this.color = this.isDead ? p5.color(255, 255, 255) : p5.color(69, 44, 21);
        this.environ = environ;
        this.x = x;
        this.y = y;
        this.hasSeenFood = undefined;
        this.hasSeenMate = undefined;
        this.isFemale = isFemale;
        this.id = Math.random()*1000;

        environ.board[x][y] = this;
    }

    // This method scans the surrounding area of the monkey for food (Fruit) and returns an array of food positions.
    scanFood() {
        // Verify current food target is still valid
        if(this.hasSeenFood !== undefined){
            const foodX = this.hasSeenFood.x;
            const foodY = this.hasSeenFood.y;
            const foodBox = this.environ.board[foodX][foodY];
            
            // If food was eaten or doesn't exist, reset
            if (!foodBox || foodBox.kind !== 'food') {
                this.hasSeenFood = undefined;
            }
        }
        
        // Find new food if we don't have a valid target
        if(this.hasSeenFood === undefined){
            const startX = Math.max(0, Math.floor(this.x - this.sight)); // Calculate the starting X position for scanning
            const endX = Math.min(this.environ.board.length - 1, Math.floor(this.x + this.sight)); // Calculate the ending X position for scanning
            const startY = Math.max(0, Math.floor(this.y - this.sight)); // Calculate the starting Y position for scanning
            const endY = Math.min(this.environ.board[0].length - 1, Math.floor(this.y + this.sight)); // Calculate the ending Y position for scanning

            let closestFoodDistance = Infinity; // Initialize the closest food distance as infinity
            let closestFoodPosition = undefined; // Initialize the closest food position as undefined

            // Iterate through the area within the sight of the monkey
            for (let i = startX; i <= endX; i++) {
                for (let j = startY; j <= endY; j++) {
                    const box = this.environ.board[i][j]; // Get the box at the current position
                    if (box && box.kind === 'food') { // Check if the box is a Fruit
                        const distance = Math.abs(this.x - i) + Math.abs(this.y - j); // Calculate the distance between the monkey and the food
                        if (distance < closestFoodDistance) { // If the distance is smaller than the closest food distance
                            closestFoodDistance = distance; // Update the closest food distance
                            closestFoodPosition = { x: i, y: j }; // Update the closest food position
                        }
                    }
                }
            }

            if (closestFoodPosition !== undefined) {
                this.hasSeenFood = closestFoodPosition; // Set the closest food position as the hasSeenFood
            }
        }
    }

    scanMate(){
        // Verify current mate target is still valid
        if(this.hasSeenMate !== undefined){
            const mateX = this.hasSeenMate.x;
            const mateY = this.hasSeenMate.y;
            const mateBox = this.environ.board[mateX][mateY];
            
            // If mate moved, died, or is no longer available, reset
            if (!mateBox || mateBox.kind !== 'monkey' || mateBox.isDead || 
                mateBox.isFemale === this.isFemale || mateBox.matingCooldown > 0) {
                this.hasSeenMate = undefined;
            }
        }
        
        if(this.hasSeenMate === undefined && this.matingCooldown <= 0){
            const startX = Math.max(0, Math.floor(this.x - this.sight)); 
            const endX = Math.min(this.environ.board.length - 1, Math.floor(this.x + this.sight));
            const startY = Math.max(0, Math.floor(this.y - this.sight));
            const endY = Math.min(this.environ.board[0].length - 1, Math.floor(this.y + this.sight));

            let closestMateDistance = Infinity;
            let closestMatePosition = undefined;

            // Iterate through the area within the sight of the monkey
            for (let i = startX; i <= endX; i++) {
                for (let j = startY; j <= endY; j++) {
                    const box = this.environ.board[i][j];
                    // Check if opposite gender, alive, and ready to mate
                    if (box && box.kind === 'monkey' && box.isFemale !== this.isFemale && !box.isDead && box.matingCooldown <= 0) {
                        const distance = Math.abs(this.x - i) + Math.abs(this.y - j);
                        if (distance < closestMateDistance) {
                            closestMateDistance = distance;
                            closestMatePosition = { x: i, y: j };
                        }
                    }
                }
            }

            if (closestMatePosition !== undefined) {
                this.hasSeenMate = closestMatePosition;
            }
        }
    }

    scanPredator(){
        const startX = Math.max(0, Math.floor(this.x - this.sight));
        const endX = Math.min(this.environ.board.length - 1, Math.floor(this.x + this.sight));
        const startY = Math.max(0, Math.floor(this.y - this.sight));
        const endY = Math.min(this.environ.board[0].length - 1, Math.floor(this.y + this.sight));

        // Iterate through the area within the sight of the monkey
        for (let i = startX; i <= endX; i++) {
            for (let j = startY; j <= endY; j++) {
                const box = this.environ.board[i][j];
                if (box && box.kind == 'jaguar' && !box.isDead) {
                    return { x: i, y: j }; // Return predator position
                }
            }
        }
        return undefined;
    }
    mate(p5){
        if(this.hasSeenMate !== undefined){
            const matePosition = this.hasSeenMate;
            const mateX = matePosition.x;
            const mateY = matePosition.y;
            const mateBox = this.environ.board[mateX][mateY];

            // Check if mate is still there and valid
            if(mateBox.kind !== 'monkey' || mateBox.isDead || mateBox.isFemale === this.isFemale){
                this.hasSeenMate = undefined;
                return;
            }

            const distance = Math.abs(this.x - mateX) + Math.abs(this.y - mateY);
            
            // If adjacent (distance of 1 or 2), try to mate
            if (distance <= 2) {
                // Random chance of mating (100%)
                if (Math.random() < 1.0) {
                    // Combine stats with some variation
                    const babySight = (this.sight + mateBox.sight) / 2 + (Math.random() * 4 - 2);
                    const babySpeed = (this.speed + mateBox.speed) / 2 + (Math.random() * 0.2 - 0.1);
                    const babyGender = Math.random() < 0.5;

                    // Find empty adjacent spot for baby
                    const directions = [[-1, 0], [1, 0], [0, -1], [0, 1], [-1, -1], [-1, 1], [1, -1], [1, 1]];
                    for (let [dx, dy] of directions) {
                        const newX = this.x + dx;
                        const newY = this.y + dy;
                        if (newX >= 0 && newX < this.environ.board.length && 
                            newY >= 0 && newY < this.environ.board[0].length &&
                            this.environ.board[newX][newY].kind === 'land') {
                            new Monkey(p5, newX, newY, Math.max(10, babySight), Math.max(0.1, Math.min(1, babySpeed)), this.environ, babyGender);
                            break;
                        }
                    }

                    // Set cooldown for both parents
                    this.matingCooldown = 3000;
                    mateBox.matingCooldown = 3000;
                }
                this.hasSeenMate = undefined;
                return;
            }

            // Move towards mate
            if (Math.random() < this.speed) {
                const oldX = this.x;
                const oldY = this.y;

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

                // Check if new position is valid
                const targetBox = this.environ.board[this.x][this.y];
                if (targetBox && (targetBox.kind === 'land' || targetBox.kind === 'food' || 
                   (targetBox.kind === 'monkey' && targetBox.isFemale !== this.isFemale))) {
                    // Valid move (land, food, or opposite gender monkey for mating)
                    this.environ.board[this.x][this.y] = this;
                } else {
                    // Blocked, stay in place
                    this.x = oldX;
                    this.y = oldY;
                    this.environ.board[this.x][this.y] = this;
                }
            }
        }
    }

    move(p5) {
        if (!this.isDead) {
            // Priority 1: Escape from predators
            const predatorPosition = this.scanPredator();
            if (predatorPosition !== undefined) {
                if (Math.random() < this.speed) {
                    const oldX = this.x;
                    const oldY = this.y;

                    this.environ.board[this.x][this.y] = new Box(p5, 'land');

                    // Move away from predator
                    if (predatorPosition.x < this.x) {
                        this.x++;
                    } else if (predatorPosition.x > this.x) {
                        this.x--;
                    }
                    if (predatorPosition.y < this.y) {
                        this.y++;
                    } else if (predatorPosition.y > this.y) {
                        this.y--;
                    }

                    // Boundary checks
                    if (this.x < 0) this.x = 0;
                    if (this.x >= this.environ.board.length) this.x = this.environ.board.length - 1;
                    if (this.y < 0) this.y = 0;
                    if (this.y >= this.environ.board[0].length) this.y = this.environ.board[0].length - 1;

                    // Check if new position is valid
                    const targetBox = this.environ.board[this.x][this.y];
                    if (targetBox && (targetBox.kind === 'land' || targetBox.kind === 'food')) {
                        this.environ.board[this.x][this.y] = this;
                    } else {
                        // Blocked, stay in place (better than being caught!)
                        this.x = oldX;
                        this.y = oldY;
                        this.environ.board[this.x][this.y] = this;
                    }
                }
                // Reset other priorities when fleeing
                this.hasSeenFood = undefined;
                this.hasSeenMate = undefined;
            }
            // Priority 2: Look for food if hungry
            else {
                this.scanFood();
                
                // Priority 3: Look for mate if not too hungry
                if (this.hunger > 800) {
                    this.scanMate();
                }

                if(this.hasSeenMate !== undefined && this.hunger > 800){
                    this.mate(p5);
                }
                else if (this.hasSeenFood !== undefined) {
                    if (Math.random() < this.speed) {
                        const foodPosition = this.hasSeenFood;
                        const foodX = foodPosition.x;
                        const foodY = foodPosition.y;

                        const oldX = this.x;
                        const oldY = this.y;

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

                        // Check if new position is valid
                        const targetBox = this.environ.board[this.x][this.y];
                        if (targetBox && targetBox.kind === 'food') {
                            this.hunger += 1500;
                            this.hasSeenFood = undefined;
                            this.environ.board[this.x][this.y] = this;
                        } else if (targetBox && targetBox.kind === 'land') {
                            this.environ.board[this.x][this.y] = this;
                        } else {
                            // Blocked, stay in place
                            this.x = oldX;
                            this.y = oldY;
                            this.environ.board[this.x][this.y] = this;
                            this.hasSeenFood = undefined; // Reset to find new path
                        }
                    }
                } else {
                    if (Math.random() < this.speed) {
                        const oldX = this.x;
                        const oldY = this.y;

                        this.environ.board[this.x][this.y] = new Box(p5, 'land');

                        // Move randomly
                        this.x += Math.floor(Math.random() * 3) - 1;
                        this.y += Math.floor(Math.random() * 3) - 1;
                        if (this.x < 0) {
                            this.x = 0;
                        } else if (this.x >= this.environ.board.length) {
                            this.x = this.environ.board.length - 1;
                        }
                        if (this.y < 0) {
                            this.y = 0;
                        } else if (this.y >= this.environ.board[0].length) {
                            this.y = this.environ.board[0].length - 1;
                        }

                        // Check if new position is valid
                        const targetBox = this.environ.board[this.x][this.y];
                        if (targetBox && (targetBox.kind === 'land' || targetBox.kind === 'food')) {
                            this.environ.board[this.x][this.y] = this;
                        } else {
                            // Blocked, stay in place
                            this.x = oldX;
                            this.y = oldY;
                            this.environ.board[this.x][this.y] = this;
                        }
                    }
                }
            }
            
            this.hunger--;
            this.matingCooldown--;
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
