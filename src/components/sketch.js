import React, { useRef, useEffect } from 'react';
import Sketch from 'react-p5';
import Monkey from './Monkey';
import Jaguar from './Jaguar';
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
        for (let i = 0; i < this.board.length; i++) {
            for (let j = 0; j < this.board[i].length; j++) {
                // i = row (vertical), j = column (horizontal)
                // drawBox expects (x, y) where x is horizontal, y is vertical
                this.board[i][j].drawBox(p5, j * 10, i * 10, 10, 10);
                if (this.board[i][j].kind == 'monkey') {
                    this.board[i][j].move(p5);
                } else if (this.board[i][j].kind == 'jaguar') {
                    this.board[i][j].move(p5);
                }
            }
        }
    }

    placeFood(p5) {
        if (p5.random(1) >= 0.7) { // More frequent food spawning (30% chance per frame)
            let h = Math.floor(p5.random(this.board.length));
            let w = Math.floor(p5.random(this.board[0].length));
            this.board[h][w] = new Box(p5,'food');
        }
    }
    
}

function P5Sketch(props) {
    // Use useRef to persist the environment instance without re-creating on each render
    const environ = useRef(null);
    const frameCounter = useRef(0); // Track frames for history updates
    // Setup function for the p5 sketch
    const setup = (p5, canvasParentRef) => {
      // Create canvas and attach it to the canvas parent ref
      // Canvas size should match grid: 75 rows x 150 cols, each cell 10x10 pixels
      p5.createCanvas(1500, 750).parent(canvasParentRef);
      // Initialize environment instance (rows, cols) to match canvas
      environ.current = new Environment(p5, 75, 150);
      
      // Start with more monkeys (15 total) - spread them out for better survival
      // Board is 75 rows (0-74) x 150 columns (0-149)
      new Monkey(p5, 10, 10, 25, 0.5, environ.current, false);
      new Monkey(p5, 40, 20, 22, 0.55, environ.current, true);
      new Monkey(p5, 20, 50, 20, 0.5, environ.current, true);
      new Monkey(p5, 60, 30, 23, 0.6, environ.current, false);
      new Monkey(p5, 50, 70, 24, 0.55, environ.current, true);
      new Monkey(p5, 30, 90, 21, 0.5, environ.current, false);
      new Monkey(p5, 65, 110, 22, 0.58, environ.current, true);
      new Monkey(p5, 70, 55, 26, 0.6, environ.current, false);
      new Monkey(p5, 15, 35, 23, 0.52, environ.current, true);
      new Monkey(p5, 45, 130, 24, 0.56, environ.current, false);
      new Monkey(p5, 5, 25, 21, 0.54, environ.current, true);
      new Monkey(p5, 55, 100, 25, 0.57, environ.current, false);
      new Monkey(p5, 35, 140, 22, 0.53, environ.current, true);
      new Monkey(p5, 25, 15, 23, 0.51, environ.current, false);
      new Monkey(p5, 70, 120, 24, 0.59, environ.current, true);
      
      // Start with fewer jaguars (3 total) - slower and with worse sight initially
      new Jaguar(p5, 40, 60, 25, 0.55, environ.current, false);
      new Jaguar(p5, 50, 100, 24, 0.5, environ.current, true);
      new Jaguar(p5, 25, 45, 26, 0.58, environ.current, false);

      environ.current.drawBoard(p5);
    };

    function scanBoard(board){
      //console.log("board", board.board[1])
      const boardObject = {
        femMonkeys: 0,
        maleMonkeys: 0, 
        noOfFruit: 0,
        femJaguars: 0,
        maleJaguars: 0,
        timeElapsed: 0, 
        totalMonkeySight: 0,
        totalMonkeySpeed: 0,
        totalJaguarSight: 0,
        totalJaguarSpeed: 0,
        monkeyCount: 0,
        jaguarCount: 0,
      };
      for(let i = 0; i < board.board.length; i++){
        for(let j = 0; j < board.board[i].length; j++){
          if(board.board[i][j].kind == "food"){
            boardObject.noOfFruit++;
          }
          if(board.board[i][j].kind =="monkey" && !board.board[i][j].isDead){
            if(board.board[i][j].isFemale == true){
              boardObject.femMonkeys++;
            }
            else{
              boardObject.maleMonkeys++;
            }
            boardObject.totalMonkeySight += board.board[i][j].sight;
            boardObject.totalMonkeySpeed += board.board[i][j].speed;
            boardObject.monkeyCount++;
          }
          if(board.board[i][j].kind == "jaguar" && !board.board[i][j].isDead){
            if(board.board[i][j].isFemale == true){
              boardObject.femJaguars++;
            }
            else{
              boardObject.maleJaguars++;
            }
            boardObject.totalJaguarSight += board.board[i][j].sight;
            boardObject.totalJaguarSpeed += board.board[i][j].speed;
            boardObject.jaguarCount++;
          }
        }
      }
      
      // Calculate averages
      const avgMonkeySight = boardObject.monkeyCount > 0 ? boardObject.totalMonkeySight / boardObject.monkeyCount : 0;
      const avgMonkeySpeed = boardObject.monkeyCount > 0 ? boardObject.totalMonkeySpeed / boardObject.monkeyCount : 0;
      const avgJaguarSight = boardObject.jaguarCount > 0 ? boardObject.totalJaguarSight / boardObject.jaguarCount : 0;
      const avgJaguarSpeed = boardObject.jaguarCount > 0 ? boardObject.totalJaguarSpeed / boardObject.jaguarCount : 0;
      
      props.setNoOfFruit(boardObject.noOfFruit);
      props.setFemMonkeys(boardObject.femMonkeys)
      props.setMaleMonkeys(boardObject.maleMonkeys)
      props.setFemJaguars(boardObject.femJaguars)
      props.setMaleJaguars(boardObject.maleJaguars)
      props.setAverageMonkeySight(avgMonkeySight)
      props.setAverageMonkeySpeed(avgMonkeySpeed)
      props.setAverageJaguarSight(avgJaguarSight)
      props.setAverageJaguarSpeed(avgJaguarSpeed)
      
      // Update history every 10 frames to keep data smooth
      frameCounter.current++;
      if (frameCounter.current % 10 === 0) {
        props.setMonkeySightHistory(prev => [...prev, avgMonkeySight]);
        props.setMonkeySpeedHistory(prev => [...prev, avgMonkeySpeed]);
        props.setJaguarSightHistory(prev => [...prev, avgJaguarSight]);
        props.setJaguarSpeedHistory(prev => [...prev, avgJaguarSpeed]);
        props.setMonkeyPopulationHistory(prev => [...prev, boardObject.monkeyCount]);
        props.setJaguarPopulationHistory(prev => [...prev, boardObject.jaguarCount]);
      }
    }
  
    // Draw function for the p5 sketch
    const draw = (p5) => {
      // Ensure environment instance is available
      if (environ.current) {
        environ.current.placeFood(p5);
        environ.current.drawBoard(p5);
        scanBoard(environ.current);
        
        // Draw cursor indicator when a tool is selected
        if (props.selectedTool && p5.mouseX >= 0 && p5.mouseX < p5.width && 
            p5.mouseY >= 0 && p5.mouseY < p5.height) {
          // mouseX is horizontal (column), mouseY is vertical (row)
          const gridCol = Math.floor(p5.mouseX / 10);
          const gridRow = Math.floor(p5.mouseY / 10);
          
          if (gridRow >= 0 && gridRow < environ.current.board.length && 
              gridCol >= 0 && gridCol < environ.current.board[0].length) {
            
            // Draw highlight box
            p5.noFill();
            p5.strokeWeight(2);
            
            // Color based on tool type
            if (props.selectedTool.includes('monkey')) {
              p5.stroke(139, 69, 19, 200); // Brown
            } else if (props.selectedTool.includes('jaguar')) {
              p5.stroke(204, 153, 51, 200); // Mustard yellow
            } else if (props.selectedTool === 'food') {
              p5.stroke(247, 15, 2, 200); // Red
            } else {
              p5.stroke(107, 219, 69, 200); // Green
            }
            
            p5.rect(gridCol * 10, gridRow * 10, 10, 10);
            
            // Draw small icon in center
            p5.fill(255, 255, 255, 180);
            p5.noStroke();
            p5.circle(gridCol * 10 + 5, gridRow * 10 + 5, 4);
          }
        }
      }
    };
    
    // Mouse click handler for placement tool
    const mouseClicked = (p5, event) => {
      if (!environ.current || !props.selectedTool) return;
      
      // Only handle clicks on the canvas
      if (p5.mouseX < 0 || p5.mouseX >= p5.width || 
          p5.mouseY < 0 || p5.mouseY >= p5.height) {
        return;
      }
      
      // Calculate grid position from mouse click
      // mouseX is horizontal (column), mouseY is vertical (row)
      const gridCol = Math.floor(p5.mouseX / 10);
      const gridRow = Math.floor(p5.mouseY / 10);
      
      // Check if click is within bounds
      if (gridRow < 0 || gridRow >= environ.current.board.length || 
          gridCol < 0 || gridCol >= environ.current.board[0].length) {
        return;
      }
      
      // Check if the space is already occupied (skip for land/food)
      const currentBox = environ.current.board[gridRow][gridCol];
      if (props.selectedTool !== 'land' && props.selectedTool !== 'food') {
        if (currentBox.kind === 'monkey' || currentBox.kind === 'jaguar') {
          return; // Don't place on top of living creatures
        }
      }
      
      // Place the selected entity
      // Monkey/Jaguar constructors expect (p5, row, col, sight, speed, environ, isFemale)
      // Use custom stats from sliders
      switch(props.selectedTool) {
        case 'monkey-male':
          new Monkey(p5, gridRow, gridCol, props.placementSight, props.placementSpeed, environ.current, false);
          break;
        case 'monkey-female':
          new Monkey(p5, gridRow, gridCol, props.placementSight, props.placementSpeed, environ.current, true);
          break;
        case 'jaguar-male':
          new Jaguar(p5, gridRow, gridCol, props.placementSight, props.placementSpeed, environ.current, false);
          break;
        case 'jaguar-female':
          new Jaguar(p5, gridRow, gridCol, props.placementSight, props.placementSpeed, environ.current, true);
          break;
        case 'food':
          environ.current.board[gridRow][gridCol] = new Box(p5, 'food');
          break;
        case 'land':
          environ.current.board[gridRow][gridCol] = new Box(p5, 'land');
          break;
        default:
          break;
      }
    };
  
    // Effect hook to handle component mount and unmount
    useEffect(() => {
      // Effect cleanup function to handle component unmount if necessary
      return () => {
        // Perform any cleanup operations here, if needed
      };
    }, []); // Empty dependency array to ensure effect runs only once on mount
  
    // Alternative: use mousePressed instead of mouseClicked (more reliable in react-p5)
    const mousePressed = (p5, event) => {
      mouseClicked(p5, event);
    };
    
    // Render the Sketch component
    return <Sketch setup={setup} draw={draw} mousePressed={mousePressed} />;
  }
  
  export default P5Sketch;
        