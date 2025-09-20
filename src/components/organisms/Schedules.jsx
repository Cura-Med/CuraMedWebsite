
import './Schedules.css';
import React, {useState} from "react";
import AddSchedule from "../molecules/AddSchedule.jsx";


const Schedules = (props) => {

    let schedules = props.schedules;
    let setTick = props.setTick;


    console.log('Sche: ', schedules)
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
                        {schedules?.[0]?.id &&
                            <p>{schedules.length}</p>
                        }
                    </>
                </>
            }

            {componentStep === 'add' &&
                <AddSchedule setComponentStep={setComponentStep} setTick={setTick} />
            }


        </div>
    )
}

export default Schedules;