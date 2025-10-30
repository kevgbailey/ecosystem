import './App.css';
import P5Sketch from './components/sketch';
import StatsDisplay from './components/StatsDisplay.js';
import PlacementTool from './components/PlacementTool.js';
import { useState, useEffect } from 'react';

function App() {

  const [femMonkeys, setFemMonkeys] = useState(0);
  const [maleMonkeys, setMaleMonkeys] = useState(0);
  const [noOfFruit, setNoOfFruit] = useState(0);
  const [femJaguars, setFemJaguars] = useState(0);
  const [maleJaguars, setMaleJaguars] = useState(0);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [averageMonkeySight, setAverageMonkeySight] = useState(0);
  const [averageMonkeySpeed, setAverageMonkeySpeed] = useState(0);
  const [averageJaguarSight, setAverageJaguarSight] = useState(0);
  const [averageJaguarSpeed, setAverageJaguarSpeed] = useState(0);
  
  // Historical data for charts
  const [monkeySightHistory, setMonkeySightHistory] = useState([]);
  const [monkeySpeedHistory, setMonkeySpeedHistory] = useState([]);
  const [jaguarSightHistory, setJaguarSightHistory] = useState([]);
  const [jaguarSpeedHistory, setJaguarSpeedHistory] = useState([]);
  const [monkeyPopulationHistory, setMonkeyPopulationHistory] = useState([]);
  const [jaguarPopulationHistory, setJaguarPopulationHistory] = useState([]);
  
  // Placement tool state
  const [selectedTool, setSelectedTool] = useState(null);
  const [placementSight, setPlacementSight] = useState(23);
  const [placementSpeed, setPlacementSpeed] = useState(0.55);
  
  // Dark mode state
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('darkMode');
    return saved ? JSON.parse(saved) : false;
  });
  
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', darkMode ? 'dark' : 'light');
    localStorage.setItem('darkMode', JSON.stringify(darkMode));
  }, [darkMode]);
  
  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const appDataType = {
    noOfMonkeys:{
      femMonkeys: femMonkeys,
      maleMonkeys: maleMonkeys, 
    },
    noOfFruit: noOfFruit,
    noOfJaguars:{
      femJaguars: femJaguars,
      maleJaguars: maleJaguars,
    },
    timeElapsed: timeElapsed, 
    averageMonkeySight: averageMonkeySight, 
    averageMonkeySpeed: averageMonkeySpeed,
    averageJaguarSight: averageJaguarSight,
    averageJaguarSpeed: averageJaguarSpeed,
  };

  return (
    <div className='container'>
      <div className={`sketch ${selectedTool ? 'tool-active' : ''}`}>
        <div className="header">
          <h1>Ecosystem Evolution Simulator</h1>
          <button className="theme-toggle" onClick={toggleDarkMode}>
            {darkMode ? '☀️ Light' : '🌙 Dark'}
          </button>
        </div>
        <div className="canvas-wrapper">
          <P5Sketch 
          setMaleMonkeys={setMaleMonkeys} 
          setFemMonkeys={setFemMonkeys} 
          setNoOfFruit={setNoOfFruit} 
          setFemJaguars={setFemJaguars} 
          setMaleJaguars={setMaleJaguars} 
          setTimeElapsed={setTimeElapsed} 
          setAverageMonkeySight={setAverageMonkeySight} 
          setAverageMonkeySpeed={setAverageMonkeySpeed} 
          setAverageJaguarSight={setAverageJaguarSight} 
          setAverageJaguarSpeed={setAverageJaguarSpeed}
          setMonkeySightHistory={setMonkeySightHistory}
          setMonkeySpeedHistory={setMonkeySpeedHistory}
          setJaguarSightHistory={setJaguarSightHistory}
          setJaguarSpeedHistory={setJaguarSpeedHistory}
          setMonkeyPopulationHistory={setMonkeyPopulationHistory}
          setJaguarPopulationHistory={setJaguarPopulationHistory}
          selectedTool={selectedTool}
          placementSight={placementSight}
          placementSpeed={placementSpeed}
        />
        </div>
        <StatsDisplay 
          maleMonkeys={maleMonkeys} 
          femMonkeys={femMonkeys} 
          noOfFruit={noOfFruit} 
          femJaguars={femJaguars} 
          maleJaguars={maleJaguars} 
          timeElapsed={timeElapsed} 
          averageMonkeySight={averageMonkeySight} 
          averageMonkeySpeed={averageMonkeySpeed}
          averageJaguarSight={averageJaguarSight}
          averageJaguarSpeed={averageJaguarSpeed}
          monkeySightHistory={monkeySightHistory}
          monkeySpeedHistory={monkeySpeedHistory}
          jaguarSightHistory={jaguarSightHistory}
          jaguarSpeedHistory={jaguarSpeedHistory}
          monkeyPopulationHistory={monkeyPopulationHistory}
          jaguarPopulationHistory={jaguarPopulationHistory}
        />
      </div>
      <PlacementTool 
        selectedTool={selectedTool}
        setSelectedTool={setSelectedTool}
        placementSight={placementSight}
        setPlacementSight={setPlacementSight}
        placementSpeed={placementSpeed}
        setPlacementSpeed={setPlacementSpeed}
      />
    </div>
  );
}
 
export default App;
