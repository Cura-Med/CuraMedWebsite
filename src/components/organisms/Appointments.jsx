
import './Appointments.css';
import React from "react";
import Appointment from "../atoms/Appointment.jsx";


const Appointments = (props) => {

    let appointments = props.appointments;

    return (
        <div className='appointments-wrapper'>
            <h2>Upcoming Appointments</h2>
            {!appointments?.[0]?.id &&
                <p>No upcoming appointments</p>
            }
            {appointments?.[0]?.id &&
                <>
                    {appointments.map((appointment, index) => (
                        <Appointment
                            key={index}
                            appointment={appointment}
                        />
                    ))}
                </>
            }
        </div>
    )
}

export default Appointments;