import React, { useRef, useEffect } from 'react';
import Sketch from 'react-p5';
import Monkey from './Monkey';
import Box from './Box';

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
        if (p5.random(1) >= 0.99) {
            let h = Math.floor(p5.random(this.board.length));
            let w = Math.floor(p5.random(this.board[0].length));
            this.board[h][w] = new Box(p5,'food');
        }
    }
    
}

function P5Sketch(props) {
    // Use useRef to persist the environment instance without re-creating on each render
    const environ = useRef(null);
    // Setup function for the p5 sketch
    const setup = (p5, canvasParentRef) => {
      // Create canvas and attach it to the canvas parent ref
      p5.createCanvas(1500, 1500).parent(canvasParentRef);
      // Initialize environment instance
      environ.current = new Environment(p5, 135, 72);
      new Monkey(p5,10,10, 20, .5, environ.current, false);
      new Monkey(p5,20,10, 20, .5, environ.current, true);
      new Monkey(p5,20,15, 20, .5, environ.current, true);

      environ.current.drawBoard(p5);
    };

    function scanBoard(board){
      //console.log("board", board.board[1])
      const boardObject = {
        femMonkeys: 0,
        maleMonkeys: 0, 
        noOfFruit: 0,
        timeElapsed: 0, 
        averageMonkeySight: [], 
        averageMonkeySpeed: [],
      };
      for(let i = 0; i < board.board.length; i++){
        for(let j = 0; j < board.board[i].length; j++){
          if(board.board[i][j].kind == "food"){
            boardObject.noOfFruit++;
          }
        }
      }
      props.setNoOfFruit(boardObject.noOfFruit);
    }
  
    // Draw function for the p5 sketch
    const draw = (p5) => {
      // Ensure environment instance is available
      if (environ.current) {
        environ.current.placeFood(p5);
        environ.current.drawBoard(p5);
        scanBoard(environ.current);
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
        