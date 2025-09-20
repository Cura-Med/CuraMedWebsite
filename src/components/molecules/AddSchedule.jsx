import {FaClock} from "react-icons/fa";
import React, {useState} from "react";
import './AddSchedule.css';
import axios from "../../api/axios.js";
import {useSelector} from "react-redux";





const AddSchedule = (props) => {

    const setComponentStep = props.setComponentStep;
    const setTick = props.setTick;
    const user = useSelector((state) => state.auth.user);
    const handleChange = () => {};
    const [selectedDay, setSelectedDay] = useState('monday');
    const [timeSlot, setTimeSlot] = useState({ start: '09:00', end: '10:00' });

    const handleDaySelect = (day) => {
        setSelectedDay(day);
    };

    const handleTimeSlotChange = (e) => {
        const { name, value } = e.target;
        setTimeSlot(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const addTimeSlot = () => {
        if (timeSlot.start && timeSlot.end) {
            const newSlot = `${timeSlot.start} - ${timeSlot.end}`;

            // Check if this slot already exists for the selected day
            if (!formData.availabilitySlots[selectedDay].includes(newSlot)) {
                setFormData(prev => ({
                    ...prev,
                    availabilitySlots: {
                        ...prev.availabilitySlots,
                        [selectedDay]: [...prev.availabilitySlots[selectedDay], newSlot]
                    }
                }));
            }
        }
    };

    const dayMap = {
        sunday: 0,
        monday: 1,
        tuesday: 2,
        wednesday: 3,
        thursday: 4,
        friday: 5,
        saturday: 6,
    };

    const addSchedules = async () => {
        try {
            const schedules = [];

            Object.entries(formData.availabilitySlots).forEach(([day, slots]) => {
                slots.forEach((slot) => {
                    const [startTime, endTime] = slot.split(" - ");
                    schedules.push({
                        dayOfWeek: dayMap[day],
                        startTime,
                        endTime,
                    });
                });
            });

            let docId = user?.doctorId || 'debug'
            const payload = {
                doctorId: docId,
                schedules,
            };

            console.log("Final payload:", payload);

            const response = await axios.post(
                "/doctor-schedules/add-multiple",
                payload,
                {
                    headers: { "Content-Type": "application/json" },
                }
            );

            console.log("Schedules saved:", response.data);
            setTick(new Date().getTime())
            setComponentStep('default')
        } catch (error) {
            console.error("Error saving schedules:", error);
        }
    };



    const [formData, setFormData] = useState({
        timeZone: "",
        availabilitySlots: {
            monday: [],
            tuesday: [],
            wednesday: [],
            thursday: [],
            friday: [],
            saturday: [],
            sunday: [],
        },
    });

    const removeTimeSlot = (day, slot) => {
        setFormData(prev => ({
            ...prev,
            availabilitySlots: {
                ...prev.availabilitySlots,
                [day]: prev.availabilitySlots[day].filter(s => s !== slot)
            }
        }));
    };


    return (
    <form className="auth-form">
        {/*<TimeZoneSelect value={formData.timeZone} onChange={handleChange} />*/}

        <div className="form-group form-field">
            <label className="select-label">
                <FaClock className="field-icon" /> Consultation Availability
            </label>
            <div className="availability-container">
                <div className="day-selector">
                    {['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'].map(day => (
                        <button
                            key={day}
                            type="button"
                            className={`day-button ${selectedDay === day ? 'selected' : ''}`}
                            onClick={() => handleDaySelect(day)}
                        >
                            {day.charAt(0).toUpperCase() + day.slice(1, 3)}
                        </button>
                    ))}
                </div>

                <div className="time-slot-selector">
                    <div className="time-inputs">
                        <div className="time-input-group">
                            <label>Start</label>
                            <input
                                type="time"
                                name="start"
                                value={timeSlot.start}
                                onChange={handleTimeSlotChange}
                                className="time-input"
                            />
                        </div>
                        <div className="time-input-group">
                            <label>End</label>
                            <input
                                type="time"
                                name="end"
                                value={timeSlot.end}
                                onChange={handleTimeSlotChange}
                                className="time-input"
                            />
                        </div>
                        <button
                            type="button"
                            className="add-slot-button"
                            onClick={addTimeSlot}
                        >
                            Add
                        </button>
                    </div>

                    <div className="selected-slots">
                        <h4>Selected time slots for {selectedDay.charAt(0).toUpperCase() + selectedDay.slice(1)}</h4>
                        {formData.availabilitySlots[selectedDay].length > 0 ? (
                                <div className="slots-wrap">
                                    <ul className="slot-list">
                                        {formData.availabilitySlots[selectedDay].map((slot, index) => (
                                            <li key={index} className="slot-item">
                                                <span>{slot}</span>
                                                <button
                                                    type="button"
                                                    className="remove-slot-button"
                                                    onClick={() => removeTimeSlot(selectedDay, slot)}
                                                >
                                                    ×
                                                </button>
                                            </li>
                                        ))}
                                    </ul>
                                    <div style={{flex: 1}}/>
                                    <button
                                        type="button"
                                        className="add-slot-button"
                                        onClick={addSchedules}
                                    >
                                        Submit
                                    </button>
                                </div>

                        ) : (
                            <p className="no-slots-message">No time slots added yet</p>
                        )}
                    </div>
                </div>
            </div>
        </div>


    </form>)


};



export default AddSchedule;
