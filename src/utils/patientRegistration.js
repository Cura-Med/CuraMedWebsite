// utils/patientRegistration.js
import axios from 'axios';

const API_BASE_URL = 'https://curamed-auth-api-973580931654.europe-north1.run.app';

// Reuse the same base64 helper approach as doctors
const fileToBase64 = (file) =>
    new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result.split(',')[1]);
        reader.onerror = (err) => reject(err);
    });

export const registerPatient = async (formData) => {
    try {
        // 1) Upload profile photo first (if provided) to /photos/add, same as doctors
        let photoId = null;
        if (formData.profilePhoto) {
            const base64Data = await fileToBase64(formData.profilePhoto);
            const photoPayload = {
                fileName: formData.profilePhoto.name,
                contentType: formData.profilePhoto.type,
                size: formData.profilePhoto.size,
                data: base64Data,
                filePath: `patients/profiles/${Date.now()}_${formData.profilePhoto.name}`,
            };

            const photoRes = await axios.post(`${API_BASE_URL}/photos/add`, photoPayload, {
                headers: { 'Content-Type': 'application/json' },
            });
            photoId = photoRes?.data?.id;
            if (!photoId) throw new Error('Photo upload failed: no id returned');
        }

        // 2) Register patient with photoId (NOT the raw File)
        //    IMPORTANT: API expects YYYY-MM-DD (doctor flow uses split('T')[0])
        const birthday = new Date(formData.dateOfBirth).toISOString().split('T')[0];

        const patientPayload = {
            email: formData.email,
            firstName: formData.firstName,
            lastName: formData.lastName,
            password: formData.password,
            birthday, // YYYY-MM-DD
            sexTypeId: parseInt(formData.gender),
            countryId: parseInt(formData.country),
            city: formData.city,
            timeZoneId: parseInt(formData.timeZone),
            photoId: photoId || null,
        };

        console.log('Patient payload: ', patientPayload)

        const regRes = await axios.post(`${API_BASE_URL}/users/register`, patientPayload, {
            headers: { 'Content-Type': 'application/json' },
        });
        let photoPayload = {
            photoId
        }
        let the_id = regRes?.data?.userDetailId || regRes?.data?.id || 'debug';
        const res2 = await axios.patch(`${API_BASE_URL}/user-details/` + the_id + '/photo' , photoPayload, {
            headers: { 'Content-Type': 'application/json' },
        });
        console.log('Image registration successful:', res2);


        return regRes.data;
    } catch (error) {
        if (error.response) {
            const msg =
                error.response.data?.message ||
                error.response.data?.error ||
                `Registration failed: ${error.response.status}`;
            throw new Error(msg);
        } else if (error.request) {
            throw new Error('Network error. Please check your connection and try again.');
        } else {
            throw new Error('An unexpected error occurred during registration. Please try again.');
        }
    }
};


export const uploadPhoto = async (file, userDetailId) => {
    try {
        if (!file) throw new Error('No file provided');

        const base64Data = await fileToBase64(file);

        const photoPayload = {
            fileName: file.name,
            contentType: file.type,
            size: file.size,
            data: base64Data,
            filePath: `patients/profiles/${Date.now()}_${file.name}`,
        };

        const res = await axios.post(`${API_BASE_URL}/photos/add`, photoPayload, {
            headers: { 'Content-Type': 'application/json' },
        });

        const photoId = res?.data?.id;
        if (!photoId) throw new Error('Photo upload failed: no id returned');

        console.log('Photo uploaded successfully:', photoId);


        let photoPayload2 = {
            photoId
        }

        const res2 = await axios.patch(`${API_BASE_URL}/user-details/` + userDetailId + '/photo' , photoPayload2, {
            headers: { 'Content-Type': 'application/json' },
        });

        console.log('Image registration successful:', res2);


    } catch (error) {
        if (error.response) {
            const msg =
                error.response.data?.message ||
                error.response.data?.error ||
                `Upload failed: ${error.response.status}`;
            throw new Error(msg);
        } else if (error.request) {
            throw new Error('Network error. Please check your connection and try again.');
        } else {
            throw new Error('Unexpected error during photo upload. Please try again.');
        }
    }
};