
import './Schedules.css';
import React, {useState} from "react";
import AddSchedule from "../molecules/AddSchedule.jsx";
import EditSchedule from "../molecules/EditSchedule.jsx";


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
                        <button
                            type="button"
                            className="add-slot-button"
                            onClick={chooseAdd}
                        >
                            Add
                        </button>
                    </div>
                    <>
                        {!schedules?.[0]?.id &&
                            <p>No upcoming schedules</p>
                        }
                        {schedules?.[0]?.id &&
                            <EditSchedule schedules={schedules} />
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