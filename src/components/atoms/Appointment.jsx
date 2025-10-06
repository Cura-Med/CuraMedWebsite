import React from "react";
import './Appointment.css';
import { useNavigate } from 'react-router-dom';
import DoctorIdentityBox from "../molecules/DoctorIdentityBox.jsx";


const Appointment = (props) => {

    const navigate = useNavigate();

    const appointment = props.appointment;

    const goToCall = () => {
        navigate('/video-call/' + appointment.id)
    }

    // /video-call/callId

    return (
        <li className="consultation-item cm-item-border">
            <div className='appointment-doctor-wrapper'>
                <DoctorIdentityBox appointment={appointment}/>
                <span className="date">{appointment.appointmentDate + ' ' + appointment.startTime}</span>
            </div>



            <div className="call-button cm-item-border__darker" onClick={goToCall}>
                <p>Join call</p>
            </div>
        </li>
    )
}



export default Appointment;


