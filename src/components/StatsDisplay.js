import React from 'react';

function StatsDisplay (props){
    console.log("props", props)
 return (
    <div className = "statsDisplayWrapper">
        <div className = "statsDisplay">
            <p>Number of Male Monkeys: {props.maleMonkeys}</p>
            <p>Number of Female Monkeys: {props.femMonkeys}</p>
            <p>Number of Fruit: {props.noOfFruit}</p>

        </div>
    </div>
 )
}

export default StatsDisplay;