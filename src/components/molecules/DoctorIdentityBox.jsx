import Avatar from "../atoms/Avatar.jsx";
import './DoctorIdentityBox.css';


const DoctorIdentityBox = (props) => {
    let name = props.appointment.name;
    let specialty = props.appointment.specialty;

    return (
        <div className='doctor-identity-box-wrapper'>
            <Avatar avatar={props.appointment.avatar} size={'38'}/>
            <div className='name-speciality-wrapper'>
                <div className='doctor-name'>{name}</div>
                <div className='doctor-speciality'>{specialty}</div>
            </div>
        </div>
    )
}

export default DoctorIdentityBox;



