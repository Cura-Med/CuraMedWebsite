
import './Schedules.css';
import React from "react";


const Schedules = (schedules) => {
    return (
        <div className='scheduless-wrapper'>
            <h2>Upcoming Schedules</h2>
            {!schedules?.[0]?.id &&
                <p>No upcoming schedules</p>
            }
        </div>
    )
}

export default Schedules;