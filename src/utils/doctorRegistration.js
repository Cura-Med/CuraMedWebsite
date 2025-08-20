import axios from 'axios';

const API_BASE_URL = 'https://curamed-auth-api-973580931654.europe-north1.run.app';

// Helper function to convert file to base64
const fileToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      // Remove the data:image/jpeg;base64, prefix
      const base64 = reader.result.split(',')[1];
      resolve(base64);
    };
    reader.onerror = error => reject(error);
  });
};

// Helper function to convert day names to numbers
const dayNameToNumber = {
  'sunday': 0,
  'monday': 1,
  'tuesday': 2,
  'wednesday': 3,
  'thursday': 4,
  'friday': 5,
  'saturday': 6
};

// Helper function to get payment method type ID
const getPaymentMethodTypeId = (payoutMethod) => {
  switch (payoutMethod) {
    case 'paypal': return 1;
    case 'stripe': return 2;
    case 'bank': return 3;
    default: return 1;
  }
};

export const registerDoctor = async (formData) => {
  try {
    console.log('Starting doctor registration process...');
    
    // Step 1: Upload photo first
    let photoId = null;
    if (formData.profilePhoto) {
      console.log('Uploading profile photo...');
      const base64Data = await fileToBase64(formData.profilePhoto);
      
      const photoData = {
        fileName: formData.profilePhoto.name,
        contentType: formData.profilePhoto.type,
        size: formData.profilePhoto.size,
        data: base64Data,
        filePath: `doctors/profiles/${Date.now()}_${formData.profilePhoto.name}`
      };
      
      const photoResponse = await axios.post(`${API_BASE_URL}/photos/add`, photoData, {
        headers: { 'Content-Type': 'application/json' }
      });
      
      photoId = photoResponse.data.id;
      console.log('Photo uploaded successfully, ID:', photoId);
    }

    // Step 2: Register doctor
    console.log('Registering doctor...');
    const birthdayISO = new Date(formData.dateOfBirth).toISOString().split('T')[0];
    
    const doctorRegistrationData = {
      email: formData.email,
      firstName: formData.firstName,
      lastName: formData.lastName,
      password: formData.password,
      birthday: birthdayISO,
      sexTypeId: parseInt(formData.gender),
      titleId: parseInt(formData.title) || 1, // Default to 1 if not provided
      experienceYears: parseInt(formData.yearsOfExperience),
      specialtyId: parseInt(formData.specialty),
      photoId: photoId,
      shortBiografy: formData.shortBio, // Note: API uses "shortBiografy" (typo in API)
      practiceCountryId: parseInt(formData.country),
      practiceCity: formData.city,
      clinicAddress: formData.clinicAddress || '',
      timeZoneId: parseInt(formData.timeZone),
      medicalSchool: formData.medicalSchool,
      graduationYear: parseInt(formData.graduationYear),
      postGraduateTraining: formData.postGraduateTraining || '',
      certifications: formData.certifications || '',
      taxIdentificationNumber: formData.taxIdentificationNumber,
      taxResidenceCountryId: parseInt(formData.taxResidenceCountry),
      billingCurrencyId: parseInt(formData.billingCurrency),
      paymentSetupCompleted: true
    };

    const doctorResponse = await axios.post(`${API_BASE_URL}/users/register-doctor`, doctorRegistrationData, {
      headers: { 'Content-Type': 'application/json' }
    });

    const { id: userId, doctorDetailId } = doctorResponse.data;
    console.log('Doctor registered successfully:', { userId, doctorDetailId });

    // Step 3: Add schedules
    if (formData.availabilitySlots) {
      console.log('Adding doctor schedules...');
      const schedules = [];
      
      Object.entries(formData.availabilitySlots).forEach(([dayName, slots]) => {
        if (slots && slots.length > 0) {
          slots.forEach(slot => {
            const [startTime, endTime] = slot.split(' - ');
            schedules.push({
              dayOfWeek: dayNameToNumber[dayName.toLowerCase()],
              startTime: startTime,
              endTime: endTime
            });
          });
        }
      });

      if (schedules.length > 0) {
        await axios.post(`${API_BASE_URL}/doctor-schedules/add-multiple`, {
          doctorId: doctorDetailId,
          schedules: schedules
        }, {
          headers: { 'Content-Type': 'application/json' }
        });
        console.log('Schedules added successfully');
      }
    }

    // Step 4: Add languages
    if (formData.languagesSpoken && formData.languagesSpoken.length > 0) {
      console.log('Adding doctor languages...');
      const languageIds = Array.isArray(formData.languagesSpoken) 
        ? formData.languagesSpoken.map(lang => typeof lang === 'object' ? lang.value : lang)
        : [formData.languagesSpoken];

      await axios.post(`${API_BASE_URL}/doctor-languages/add-multiple`, {
        doctorId: doctorDetailId,
        languageIds: languageIds
      }, {
        headers: { 'Content-Type': 'application/json' }
      });
      console.log('Languages added successfully');
    }

    // Step 5: Add payment method
    if (formData.payoutMethod) {
      console.log('Adding payment method...');
      const paymentMethodData = {
        doctorId: doctorDetailId,
        paymentMethodTypeId: getPaymentMethodTypeId(formData.payoutMethod),
        isPrimary: true,
        paypalEmail: formData.payoutMethod === 'paypal' ? formData.paypalEmail : null,
        stripeAccountId: formData.payoutMethod === 'stripe' ? formData.stripeAccountId : null,
        isActive: true
      };

      const paymentMethodResponse = await axios.post(`${API_BASE_URL}/doctor-payment-methods/add`, paymentMethodData, {
        headers: { 'Content-Type': 'application/json' }
      });

      const paymentMethodId = paymentMethodResponse.data.id;
      console.log('Payment method added successfully, ID:', paymentMethodId);

      // Step 6: Add bank details if payment method is bank
      if (formData.payoutMethod === 'bank' && formData.bankName) {
        console.log('Adding bank details...');
        const bankDetailsData = {
          doctorPaymentMethodId: paymentMethodId,
          bankName: formData.bankName,
          accountNumber: formData.accountNumber,
          routingNumber: formData.routingNumber,
          iban: formData.iban || '',
          swiftBicCode: formData.swiftCode || '',
          accountHolderName: `${formData.firstName} ${formData.lastName}`,
          bankCountryId: parseInt(formData.taxResidenceCountry) // Assuming bank country is same as tax residence
        };

        await axios.post(`${API_BASE_URL}/doctor-bank-details/add`, bankDetailsData, {
          headers: { 'Content-Type': 'application/json' }
        });
        console.log('Bank details added successfully');
      }
    }

    // Step 7: Update agreements
    console.log('Updating agreements...');
    const agreementsData = {
      doctorId: doctorDetailId,
      agreeTelehealthTerms: formData.consentTelehealth || false,
      agreeGdprCompliance: formData.consentHIPAA || false, // Using HIPAA field for GDPR
      agreePlatformRules: formData.consentPlatformRules || false,
      agreeBackgroundCheck: formData.consentBackgroundCheck || false
    };

    await axios.put(`${API_BASE_URL}/doctors/${doctorDetailId}/edit-agreements`, agreementsData, {
      headers: { 'Content-Type': 'application/json' }
    });
    console.log('Agreements updated successfully');

    console.log('Doctor registration completed successfully!');
    return {
      success: true,
      userId,
      doctorDetailId,
      message: 'Doctor registration completed successfully!'
    };

  } catch (error) {
    console.error('Doctor registration failed:', error);
    
    // Handle different types of errors
    if (error.response) {
      const errorMessage = error.response.data?.message || 
                          error.response.data?.error || 
                          `Registration failed: ${error.response.status}`;
      throw new Error(errorMessage);
    } else if (error.request) {
      throw new Error('Network error. Please check your connection and try again.');
    } else {
      throw new Error('An unexpected error occurred during registration. Please try again.');
    }
  }
};
