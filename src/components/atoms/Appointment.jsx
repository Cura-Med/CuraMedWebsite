import React from "react";
import {FaCheckDouble} from 'react-icons/fa';
import './Appointment.css';
import { useNavigate } from 'react-router-dom';


const Appointment = (props) => {

    const navigate = useNavigate();

    const appointment = props.appointment;

    const goToCall = () => {
        navigate('/video-call/' + appointment.id)
    }

    // /video-call/callId

    return (
        <li className="consultation-item">
            <span className="category">{appointment.name} </span>
            <span className="date">{appointment.appointmentDate + ' ' + appointment.startTime}</span>


            <div className="call-button" onClick={goToCall}>
                <FaCheckDouble style={{color: 'green'}} />
                <p>Join Call</p>
            </div>
        </li>
    )
}



export default Appointment;


