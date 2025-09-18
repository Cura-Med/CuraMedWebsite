
import './Appointments.css';
import React from "react";


const Appointments = (appointments) => {
    return (
        <div className='appointments-wrapper'>
            <h2>Upcoming Appointments</h2>
            {!appointments?.[0]?.id &&
                <p>No upcoming appointments</p>
            }
        </div>
    )
}

export default Appointments;