import React, {useEffect, useRef, useState} from 'react'
import CountrySelect from "../components/CountrySelect.jsx";
import axios from "../api/axios.js";
import {useDispatch, useSelector} from "react-redux";
import TimeZoneSelect from "../components/TimeZoneSelect.jsx";
import './Settings.css';
import {FaUpload, FaUser} from "react-icons/fa";
import {uploadPhoto} from "../utils/patientRegistration.js";
import {fetchUserMe} from "../features/auth/authSlice.js";
import {useNavigate} from "react-router-dom";


const Settings = () => {
    let avatar = useSelector(state => state.auth.user?.avatar) || '';
    let userDetailId = useSelector(state => state.auth.userDetailId) || ''
    const [countryCode, setCountryCode] = useState(0);
    const [city, setCity] = useState('');
    const [timeZoneId, setTimeZoneId] = useState(0)
    const [mounting, setMounting] = useState(true);
    const [profilePhotoPreview, setProfilePhotoPreview] = useState('');
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const fileInputRef = useRef(null);

    const getFullDetails = async () => {
        try {
            const response = await axios.get('/user-details/' + userDetailId + '/full-details');
            setCountryCode(response.data.countryId);
            setCity(response.data.city);
            setTimeZoneId(response.data.timeZoneId);

            setMounting(false)
        } catch(e) {
            console.log('error: ', e)
        }
    }

    const takeBack = () => {
        window.history.back();
    }

    useEffect(() => {
        if (userDetailId.length) {
            getFullDetails().then(r => {})
        }
    }, [userDetailId])

    useEffect(() => {
        if (avatar?.startsWith('data:')) {
            setProfilePhotoPreview(avatar)
        }
    }, [avatar])

    const handleCountryCodeChange = (event) => {
        setCountryCode(event.target.value);
    };
    const handleCityChange = (event) => {
        setCity(event.target.value)
    };
    const handleTimeZoneChange = (event) => {
        setTimeZoneId(event.target.value);
    }

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            // Create a preview URL for the selected image
            const reader = new FileReader();
            reader.onloadend = () => {
                setProfilePhotoPreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
        uploadPhoto(file, userDetailId).then(r => {
            dispatch(fetchUserMe());
        })
    };

    const submitChanges = async (e) => {
        console.log('pressed')
        e.preventDefault();
        try {
            await axios.put('/user-details/' + userDetailId , {
                countryId: countryCode,
                city,
                timeZoneId
            });
            navigate('/dashboard');
        } catch (error) {
            console.error('Error saving changes:', error);
        }
    }

    if (mounting) {
        return (
            <div>

            </div>
        )
    }

    return (
        <div className='settings-wrapper'>
            <form className="auth-form" onSubmit={submitChanges}>
                <div className="form-group">
                    <label htmlFor="profilePhoto" className="select-label">Profile Photo</label>
                    <div className="profile-photo-upload">
                        <div
                            className="profile-photo-preview"
                            onClick={() => fileInputRef.current.click()}
                        >
                            {profilePhotoPreview.length ? (
                                <img src={profilePhotoPreview} alt="Profile Preview" />
                            ) : (
                                <FaUser className="profile-placeholder" />
                            )}
                        </div>
                        <button
                            type="button"
                            className="upload-button"
                            onClick={() => fileInputRef.current.click()}
                        >
                            <FaUpload className="upload-icon" /> Upload Photo
                        </button>
                        <input
                            type="file"
                            id="profilePhoto"
                            name="profilePhoto"
                            ref={fileInputRef}
                            onChange={handleFileChange}
                            accept="image/*"
                            className="file-input"
                        />
                    </div>
                </div>




                <div className="form-group form-field">
                    <CountrySelect
                        label="Country"
                        id="country"
                        name="country"
                        value={countryCode}
                        onChange={handleCountryCodeChange}
                    />

                    <p className='city-label'>City</p>
                    <input
                        type="text"
                        id="city"
                        name="city"
                        value={city}
                        onChange={handleCityChange}
                        placeholder="City"
                        required
                    />

                    <TimeZoneSelect value={timeZoneId} onChange={handleTimeZoneChange} />
                </div>

                <div className='bottom-buttons'>
                    <button type="submit"
                            className={`save-button`}
                    >Save</button>
                    {window.history.length > 1 &&
                        <>
                            <div style={{width: '12px'}}/>
                            <div onClick={takeBack} className="save-button">Back</div>
                        </>
                    }
                </div>
            </form>
        </div>

    )
}

export default Settings;

