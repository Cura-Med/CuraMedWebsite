

import React from "react";
import SingleSchedule from "../atoms/SingleSchedule.jsx";

const EditSchedule = (props) => {

    let schedules = props.schedules;


    return (
        <div className="edit-schedule__wrapper">
            {schedules.map((schedule, index) => (
                <div key={schedule.id}>
                    <SingleSchedule schedule={schedule} />
                </div>
                )

            )

            }
        </div>
    )
}


export default EditSchedule;


