

import React from "react";

const EditSchedule = (props) => {

    let schedules = props.schedules;


    return (
        <div className="edit-schedule__wrapper">
            {schedules.map((schedule, index) => (
                <div key={schedule.id}>
                    {schedule.dayOfWeek}  {schedule.startTime}
                </div>
                )

            )

            }
        </div>
    )
}


export default EditSchedule;


