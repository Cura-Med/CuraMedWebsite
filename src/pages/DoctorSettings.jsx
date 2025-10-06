import {useSelector} from "react-redux";
import axios from "../api/axios.js";
import {useEffect, useState} from "react";


const DoctorSettings = () => {

    let doctorId = useSelector(state => state?.auth?.user?.doctorId) || '';
    const [mounting, setMounting] = useState(true);


    const getFullDetails = async () => {
        try {
            const response = await axios.get('/doctors/' + doctorId + '/full-details');
            console.log('Doctor Details: ', response.data)

            setMounting(false)
        } catch(e) {
            console.log('error: ', e)
        }
    }

    const takeBack = () => {
        window.history.back();
    }

    useEffect(() => {
        if (doctorId.length) {
            getFullDetails().then(r => {})
        }
    }, [doctorId])

    return (
        <div>
            Init
        </div>
    )

}



export default DoctorSettings;
