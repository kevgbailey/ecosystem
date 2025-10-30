import React from 'react';
import { Line } from 'react-chartjs-2';
import './StatsDisplay.css';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

function StatsDisplay (props){
 const totalMonkeys = props.maleMonkeys + props.femMonkeys;
 const totalJaguars = props.maleJaguars + props.femJaguars;

 // Create labels for x-axis (just indices)
 const labels = props.monkeySightHistory.map((_, index) => index);
 const populationLabels = props.monkeyPopulationHistory.map((_, index) => index);

 // Chart data for Monkey Sight
 const monkeySightData = {
   labels: labels,
   datasets: [
     {
       label: 'Monkey Sight',
       data: props.monkeySightHistory,
       borderColor: 'rgb(139, 69, 19)',
       backgroundColor: 'rgba(139, 69, 19, 0.5)',
       tension: 0.4,
     },
   ],
 };

 // Chart data for Monkey Speed
 const monkeySpeedData = {
   labels: labels,
   datasets: [
     {
       label: 'Monkey Speed',
       data: props.monkeySpeedHistory,
       borderColor: 'rgb(101, 67, 33)',
       backgroundColor: 'rgba(101, 67, 33, 0.5)',
       tension: 0.4,
     },
   ],
 };

 // Chart data for Jaguar Sight
 const jaguarSightData = {
   labels: labels,
   datasets: [
     {
       label: 'Jaguar Sight',
       data: props.jaguarSightHistory,
       borderColor: 'rgb(204, 153, 51)',
       backgroundColor: 'rgba(204, 153, 51, 0.5)',
       tension: 0.4,
     },
   ],
 };

 // Chart data for Jaguar Speed
 const jaguarSpeedData = {
   labels: labels,
   datasets: [
     {
       label: 'Jaguar Speed',
       data: props.jaguarSpeedHistory,
       borderColor: 'rgb(184, 134, 11)',
       backgroundColor: 'rgba(184, 134, 11, 0.5)',
       tension: 0.4,
     },
   ],
 };

 // Chart data for Population - Combined view
 const populationData = {
   labels: populationLabels,
   datasets: [
     {
       label: 'Monkey Population',
       data: props.monkeyPopulationHistory,
       borderColor: 'rgb(139, 69, 19)',
       backgroundColor: 'rgba(139, 69, 19, 0.1)',
       tension: 0.4,
       borderWidth: 2,
       fill: true,
     },
     {
       label: 'Jaguar Population',
       data: props.jaguarPopulationHistory,
       borderColor: 'rgb(204, 153, 51)',
       backgroundColor: 'rgba(204, 153, 51, 0.1)',
       tension: 0.4,
       borderWidth: 2,
       fill: true,
     },
   ],
 };

 const chartOptions = {
   responsive: true,
   maintainAspectRatio: false,
   plugins: {
     legend: {
       display: false,
     },
   },
   scales: {
     x: {
       display: false,
     },
     y: {
       beginAtZero: true,
       grid: {
         color: 'rgba(128, 128, 128, 0.1)',
       },
       ticks: {
         color: 'var(--text-tertiary)',
       },
     },
   },
 };

 const populationChartOptions = {
   responsive: true,
   maintainAspectRatio: false,
   plugins: {
     legend: {
       display: true,
       position: 'top',
       labels: {
         color: 'var(--text-primary)',
         font: {
           size: 12,
           weight: 600,
         },
         padding: 12,
         usePointStyle: true,
       },
     },
   },
   scales: {
     x: {
       display: false,
     },
     y: {
       beginAtZero: true,
       grid: {
         color: 'rgba(128, 128, 128, 0.1)',
       },
       ticks: {
         color: 'var(--text-tertiary)',
       },
     },
   },
   interaction: {
     mode: 'index',
     intersect: false,
   },
 };

 return (
    <div className = "statsDisplayWrapper">
        <div className = "statsDisplay">
            <div className="stats-section population-overview">
              <h3>
                <span className="section-icon icon-environment"></span>
                Population Over Time
              </h3>
              <div className="population-chart-container">
                {props.monkeyPopulationHistory.length > 0 && (
                  <Line data={populationData} options={populationChartOptions} />
                )}
              </div>
            </div>

            <div className="stats-section">
              <h3>
                <span className="section-icon icon-monkey"></span>
                Monkey Population
              </h3>
              <div className="stat-row">
                <span className="stat-label">Total Population</span>
                <span className="stat-value">
                  {totalMonkeys}
                  <span className="gender-split">({props.maleMonkeys}M / {props.femMonkeys}F)</span>
                </span>
              </div>
              
              <div className="metric-card">
                <div className="chart-label">Average Sight</div>
                <div className="stat-value">{props.averageMonkeySight.toFixed(2)}</div>
                <div className="chart-container">
                  {props.monkeySightHistory.length > 0 && (
                    <Line data={monkeySightData} options={chartOptions} />
                  )}
                </div>
              </div>
              
              <div className="metric-card">
                <div className="chart-label">Average Speed</div>
                <div className="stat-value">{props.averageMonkeySpeed.toFixed(2)}</div>
                <div className="chart-container">
                  {props.monkeySpeedHistory.length > 0 && (
                    <Line data={monkeySpeedData} options={chartOptions} />
                  )}
                </div>
              </div>
            </div>
            
            <div className="stats-section">
              <h3>
                <span className="section-icon icon-jaguar"></span>
                Jaguar Population
              </h3>
              <div className="stat-row">
                <span className="stat-label">Total Population</span>
                <span className="stat-value">
                  {totalJaguars}
                  <span className="gender-split">({props.maleJaguars}M / {props.femJaguars}F)</span>
                </span>
              </div>
              
              <div className="metric-card">
                <div className="chart-label">Average Sight</div>
                <div className="stat-value">{props.averageJaguarSight.toFixed(2)}</div>
                <div className="chart-container">
                  {props.jaguarSightHistory.length > 0 && (
                    <Line data={jaguarSightData} options={chartOptions} />
                  )}
                </div>
              </div>
              
              <div className="metric-card">
                <div className="chart-label">Average Speed</div>
                <div className="stat-value">{props.averageJaguarSpeed.toFixed(2)}</div>
                <div className="chart-container">
                  {props.jaguarSpeedHistory.length > 0 && (
                    <Line data={jaguarSpeedData} options={chartOptions} />
                  )}
                </div>
              </div>
            </div>
            
            <div className="stats-section">
              <h3>
                <span className="section-icon icon-environment"></span>
                Environment
              </h3>
              <div className="stat-row">
                <span className="stat-label">Food Available</span>
                <span className="stat-value">{props.noOfFruit}</span>
              </div>
            </div>

        </div>
    </div>
 )
}

export default StatsDisplay;