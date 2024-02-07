import React, { useRef, useEffect } from 'react';
import Sketch from 'react-p5';
import Monkey from './Monkey';
import Box from './Box';

let environ;

class Environment {
    constructor(p5, height, width) {
        this.board = [];
        for (let i = 0; i < height; i++) {
            this.board.push([]);
            for (let j = 0; j < width; j++) {
                this.board[i].push(new Box(p5, 'land'));
            }
        }
    }

    drawBoard(p5) {
        for (let i = 0; i < this.board.length; i++) { // Start loop from 0 to include all cells
            for (let j = 0; j < this.board[i].length; j++) {
                this.board[i][j].drawBox(p5, i * 10, j * 10, 10, 10);
                if (this.board[i][j].kind == 'monkey') {
                    this.board[i][j].move(p5);
                }
            }
        }
    }

    placeFood(p5) {
        if (p5.random(1) >= 0.993) {
            // Make sure to convert random values to integers
            let h = Math.floor(p5.random(this.board.length));
            let w = Math.floor(p5.random(this.board[0].length));
            this.board[h][w] = new Box(p5,'food');
        }
    }
}

function P5Sketch() {
    // Use useRef to persist the environment instance without re-creating on each render
    const environ = useRef(null);
    // Setup function for the p5 sketch
    const setup = (p5, canvasParentRef) => {
      // Create canvas and attach it to the canvas parent ref
      p5.createCanvas(1500, 1500).parent(canvasParentRef);
      // Initialize environment instance
      environ.current = new Environment(p5, 135, 72);
      environ.current.board[10][10] = new Monkey(p5, 100, 1, environ.current);
      environ.current.board[10][11] = new Monkey(p5, 20, .5, environ.current);
      environ.current.drawBoard(p5);
    };
  
    // Draw function for the p5 sketch
    const draw = (p5) => {
      // Ensure environment instance is available
      if (environ.current) {
        environ.current.placeFood(p5);
        environ.current.drawBoard(p5);
      }
    };
  
    // Effect hook to handle component mount and unmount
    useEffect(() => {
      // Effect cleanup function to handle component unmount if necessary
      return () => {
        // Perform any cleanup operations here, if needed
      };
    }, []); // Empty dependency array to ensure effect runs only once on mount
  
    // Render the Sketch component
    return <Sketch setup={setup} draw={draw} />;
  }
  
  export default P5Sketch;
        