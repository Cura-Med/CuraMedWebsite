
import './Schedules.css';
import React from "react";


const Schedules = (schedules) => {
    return (
        <div className='scheduless-wrapper'>
            <div className='schedules-header'>
                <h2>Upcoming Schedules</h2>
                <div style={{flex: 1}}/>
                <div>Add</div>
            </div>

            {!schedules?.[0]?.id &&
                <p>No upcoming schedules</p>
            }
        </div>
    )
}

export default Schedules;