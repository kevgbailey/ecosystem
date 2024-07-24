import './App.css';
import P5Sketch from './components/sketch';
import StatsDisplay from './components/StatsDisplay.js';
import { useState } from 'react';

function App() {

  const [femMonkeys, setFemMonkeys] = useState(0);
  const [maleMonkeys, setMaleMonkeys] = useState(0);
  const [noOfFruit, setNoOfFruit] = useState(0);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [averageMonkeySight, setAverageMonkeySight] = useState([]);
  const [averageMonkeySpeed, setAverageMonkeySpeed] = useState([]);

  const appDataType = {
    noOfMonkeys:{
      femMonkeys: femMonkeys,
      maleMonkeys: maleMonkeys, 
    },
    noOfFruit: noOfFruit,
    timeElapsed: timeElapsed, 
    averageMonkeySight: averageMonkeySight, 
    averageMonkeySpeed: averageMonkeySpeed,
  };

  return (
    <div className='container'>
      <div className='sketch'>
        <P5Sketch setMaleMonkeys ={ setMaleMonkeys } setFemMonkeys ={setFemMonkeys} setNoOfFruit={setNoOfFruit} setTimeElapsed={setTimeElapsed} setAverageMonkeySight={setAverageMonkeySight} setAverageMonkeySpeed={setAverageMonkeySpeed} />
        <StatsDisplay maleMonkeys ={ maleMonkeys } femMonkeys ={femMonkeys} noOfFruit={noOfFruit} timeElapsed={timeElapsed} averageMonkeySight={averageMonkeySight} averageMonkeySpeed={setAverageMonkeySpeed}/>
      </div>
    </div>
  );
}
 
export default App;
