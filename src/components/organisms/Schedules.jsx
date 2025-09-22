
import './Schedules.css';
import React, {useState} from "react";
import AddSchedule from "../molecules/AddSchedule.jsx";
import EditSchedule from "../molecules/EditSchedule.jsx";


const Schedules = (props) => {

    let schedules = props.schedules;
    let setTick = props.setTick;
    let initialDaySelection = props.initialDaySelection;
    let setInitialDaySelection = props.setInitialDaySelection


    console.log('Sche: ', schedules)
    const [componentStep, setComponentStep] = useState('default')

    const chooseAdd = () => {
        setComponentStep('add');
    }

    return (
        <div className='scheduless-wrapper'>

{/*            {componentStep === 'default' &&
                <>
                    <div className='schedules-header'>
                        <h2>Edit Schedules</h2>
                        <div style={{flex: 1}}/>
                        <button
                            type="button"
                            className="add-slot-button"
                            onClick={chooseAdd}
                        >
                            Add Schedules
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
            }*/}

{/*            {componentStep === 'add' &&

            }*/}
            <AddSchedule setComponentStep={setComponentStep} setTick={setTick} schedules={schedules} initialDaySelection={initialDaySelection} setInitialDaySelection={setInitialDaySelection} />

        </div>
    )
}

export default Schedules;