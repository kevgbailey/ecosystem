import React from 'react';
import Box from './Box';

class Jaguar extends Box {
    constructor(p5, x, y, sight, speed, environ, isFemale) {
        super(p5, 'jaguar');
        this.isDead = false;
        this.sight = sight;
        this.speed = speed; // Jaguars are naturally faster
        this.hunger = 3000; // Start well-fed so they don't hunt immediately
        this.matingCooldown = 2000;
        this.isFemale = isFemale;
        this.color = p5.color(204, 153, 51); // Mustard-brown-yellow
        this.environ = environ;
        this.x = x;
        this.y = y;
        this.hasSeenPrey = undefined;
        this.hasSeenMate = undefined;
        this.blockedCount = 0; // Track consecutive blocked attempts
        this.id = Math.random() * 1000;

        environ.board[x][y] = this;
    }

    // Scan for prey (monkeys)
    scanPrey() {
        // Always verify current prey is still valid, or find new prey
        if(this.hasSeenPrey !== undefined) {
            const preyX = this.hasSeenPrey.x;
            const preyY = this.hasSeenPrey.y;
            const preyBox = this.environ.board[preyX][preyY];
            
            // If prey moved, died, or doesn't exist, reset
            if (!preyBox || preyBox.kind !== 'monkey' || preyBox.isDead) {
                this.hasSeenPrey = undefined;
                this.blockedCount = 0;
            }
        }
        
        // Find new prey if we don't have a valid target
        if(this.hasSeenPrey === undefined){
            const startX = Math.max(0, Math.floor(this.x - this.sight));
            const endX = Math.min(this.environ.board.length - 1, Math.floor(this.x + this.sight));
            const startY = Math.max(0, Math.floor(this.y - this.sight));
            const endY = Math.min(this.environ.board[0].length - 1, Math.floor(this.y + this.sight));

            let closestPreyDistance = Infinity;
            let closestPreyPosition = undefined;

            // Iterate through the area within the sight of the jaguar
            for (let i = startX; i <= endX; i++) {
                for (let j = startY; j <= endY; j++) {
                    const box = this.environ.board[i][j];
                    if (box && box.kind === 'monkey' && !box.isDead) {
                        const distance = Math.abs(this.x - i) + Math.abs(this.y - j);
                        if (distance < closestPreyDistance) {
                            closestPreyDistance = distance;
                            closestPreyPosition = { x: i, y: j };
                        }
                    }
                }
            }

            if (closestPreyPosition !== undefined) {
                this.hasSeenPrey = closestPreyPosition;
            }
        }
    }

    scanMate() {
        // Verify current mate is still valid
        if(this.hasSeenMate !== undefined) {
            const mateX = this.hasSeenMate.x;
            const mateY = this.hasSeenMate.y;
            const mateBox = this.environ.board[mateX][mateY];
            
            // If mate moved, died, or is no longer available, reset
            if (!mateBox || mateBox.kind !== 'jaguar' || mateBox.isDead || 
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

            // Look for opposite gender jaguars
            for (let i = startX; i <= endX; i++) {
                for (let j = startY; j <= endY; j++) {
                    const box = this.environ.board[i][j];
                    if (box && box.kind === 'jaguar' && box.isFemale !== this.isFemale && !box.isDead && box.matingCooldown <= 0) {
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

    mate(p5) {
        if(this.hasSeenMate !== undefined){
            const matePosition = this.hasSeenMate;
            const mateX = matePosition.x;
            const mateY = matePosition.y;
            const mateBox = this.environ.board[mateX][mateY];

            // Check if mate is still there and valid
            if(mateBox.kind !== 'jaguar' || mateBox.isDead || mateBox.isFemale === this.isFemale){
                this.hasSeenMate = undefined;
                return;
            }

            const distance = Math.abs(this.x - mateX) + Math.abs(this.y - mateY);
            
            // If adjacent, try to mate
            if (distance <= 2) {
                // Random chance of mating (40% for jaguars, slightly lower than monkeys)
                if (Math.random() < 0.4) {
                    // Combine stats with some variation
                    const babySight = (this.sight + mateBox.sight) / 2 + (Math.random() * 4 - 2);
                    const babySpeed = (this.speed + mateBox.speed) / 2 + (Math.random() * 0.15 - 0.075);
                    const babyGender = Math.random() < 0.5;

                    // Find empty adjacent spot for baby
                    const directions = [[-1, 0], [1, 0], [0, -1], [0, 1], [-1, -1], [-1, 1], [1, -1], [1, 1]];
                    for (let [dx, dy] of directions) {
                        const newX = this.x + dx;
                        const newY = this.y + dy;
                        if (newX >= 0 && newX < this.environ.board.length && 
                            newY >= 0 && newY < this.environ.board[0].length &&
                            this.environ.board[newX][newY].kind === 'land') {
                            new Jaguar(p5, newX, newY, Math.max(20, babySight), Math.max(0.3, Math.min(1, babySpeed)), this.environ, babyGender);
                            break;
                        }
                    }

                    // Set cooldown for both parents
                    this.matingCooldown = 4000; // Longer cooldown for jaguars
                    mateBox.matingCooldown = 4000;
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
                   (targetBox.kind === 'jaguar' && targetBox.isFemale !== this.isFemale))) {
                    // Valid move (land, food, or opposite gender jaguar for mating)
                    this.environ.board[this.x][this.y] = this;
                } else {
                    // Blocked - immediately reset to find new path (like monkeys do)
                    this.x = oldX;
                    this.y = oldY;
                    this.environ.board[this.x][this.y] = this;
                    this.hasSeenMate = undefined; // Reset to find new mate
                }
            }
        }
    }

    move(p5) {
        if (!this.isDead) {
            // Priority 1: Hunt when hungry
            if (this.hunger < 2000) {
                this.scanPrey();
            }
            
            // Priority 2: Look for mate when well-fed
            if (this.hunger >= 2000) {
                this.scanMate();
            }

            if (this.hasSeenPrey !== undefined && this.hunger < 2000) {
                // If stuck too many times, give up on this prey
                if (this.blockedCount > 5) {
                    this.hasSeenPrey = undefined;
                    this.blockedCount = 0;
                    return; // Try again next frame with fresh scan
                }
                
                // Hunt prey
                if (Math.random() < this.speed) {
                    const preyPosition = this.hasSeenPrey;
                    const preyX = preyPosition.x;
                    const preyY = preyPosition.y;

                    const oldX = this.x;
                    const oldY = this.y;

                    this.environ.board[this.x][this.y] = new Box(p5, 'land');

                    // Move towards the prey
                    if (preyX < this.x) {
                        this.x--;
                    } else if (preyX > this.x) {
                        this.x++;
                    }
                    if (preyY < this.y) {
                        this.y--;
                    } else if (preyY > this.y) {
                        this.y++;
                    }

                    // Check if new position is valid
                    const targetBox = this.environ.board[this.x][this.y];
                    if (targetBox && targetBox.kind === 'monkey') {
                        // Caught the prey
                        const monkey = targetBox;
                            if (!monkey.isDead) {
                                monkey.isDead = true;
                                monkey.color = p5.color(255, 255, 255);
                                this.hunger += 3500; // More sustenance from prey
                                this.hasSeenPrey = undefined;
                            }
                        this.environ.board[this.x][this.y] = this;
                        this.blockedCount = 0;
                    } else if (targetBox && (targetBox.kind === 'land' || targetBox.kind === 'food')) {
                        // Valid move
                        this.environ.board[this.x][this.y] = this;
                        this.blockedCount = 0;
                    } else {
                        // Blocked - increment counter and reset to try alternative path
                        this.x = oldX;
                        this.y = oldY;
                        this.environ.board[this.x][this.y] = this;
                        this.blockedCount++;
                        
                        // Try a random sidestep to get around obstacles
                        if (this.blockedCount > 2) {
                            const sideX = oldX + (Math.random() < 0.5 ? -1 : 1);
                            const sideY = oldY + (Math.random() < 0.5 ? -1 : 1);
                            
                            if (sideX >= 0 && sideX < this.environ.board.length &&
                                sideY >= 0 && sideY < this.environ.board[0].length) {
                                const sideBox = this.environ.board[sideX][sideY];
                                if (sideBox && (sideBox.kind === 'land' || sideBox.kind === 'food')) {
                                    this.environ.board[this.x][this.y] = new Box(p5, 'land');
                                    this.x = sideX;
                                    this.y = sideY;
                                    this.environ.board[this.x][this.y] = this;
                                    this.blockedCount = 0;
                                }
                            }
                        }
                    }
                }
            } else if (this.hasSeenMate !== undefined && this.hunger >= 2000) {
                // Pursue mate
                this.blockedCount = 0; // Reset when switching behaviors
                this.mate(p5);
            } else {
                // Move randomly if no priority target
                this.blockedCount = 0; // Reset when not hunting
                if (Math.random() < this.speed) {
                    const oldX = this.x;
                    const oldY = this.y;

                    this.environ.board[this.x][this.y] = new Box(p5, 'land');

                    // Move randomly
                    this.x += Math.floor(Math.random() * 3) - 1;
                    this.y += Math.floor(Math.random() * 3) - 1;
                    
                    // Boundary checks
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
            
            // Jaguars lose hunger slower (0.5 per frame instead of 1)
            this.hunger -= 0.5;
            this.matingCooldown--;
            if (this.hunger <= 0) {
                this.isDead = true;
                this.color = p5.color(150, 150, 150); // Gray when dead
            }
        }
    }

    drawJaguar(p5) {
        p5.fill(this.color);
        p5.noStroke();
        p5.rect(this.x * 10, this.y * 10, 10, 10);
    }
}

export default Jaguar;

