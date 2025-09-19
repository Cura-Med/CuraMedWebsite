
import './Schedules.css';
import React, {useState} from "react";
import AddSchedule from "../molecules/AddSchedule.jsx";


const Schedules = (schedules) => {

    const [componentStep, setComponentStep] = useState('default')

    const chooseAdd = () => {
        setComponentStep('add');
    }

    return (
        <div className='scheduless-wrapper'>

            {componentStep === 'default' &&
                <>
                    <div className='schedules-header'>
                        <h2>Upcoming Schedules</h2>
                        <div style={{flex: 1}}/>
                        <div style={{cursor: 'pointer'}} onClick={chooseAdd}>Add</div>
                    </div>
                    <>
                        {!schedules?.[0]?.id &&
                            <p>No upcoming schedules</p>
                        }
                    </>
                </>
            }

            {componentStep === 'add' &&
                <AddSchedule />
            }


        </div>
    )
}

export default Schedules;