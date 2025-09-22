
import './Schedules.css';
import React from "react";
import AddSchedule from "../molecules/AddSchedule.jsx";


const Schedules = (props) => {

    let schedules = props.schedules;
    let setTick = props.setTick;
    let initialDaySelection = props.initialDaySelection;
    let setInitialDaySelection = props.setInitialDaySelection

    return (
        <div className='scheduless-wrapper'>

            <AddSchedule setTick={setTick} schedules={schedules} initialDaySelection={initialDaySelection} setInitialDaySelection={setInitialDaySelection} />

        </div>
    )
}

export default Schedules;