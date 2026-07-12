import React, {useEffect} from 'react';
import { Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import FeaturesPage from './pages/FeaturesPage';
import ServicesPage from './pages/ServicesPage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import SymptomCheckerPage from './pages/SymptomCheckerPage';
import EmailVerificationPending from './pages/EmailVerificationPending';
import EmailVerification from './pages/EmailVerification';
import UserDashboard from './pages/UserDashboard';
import DoctorDashboard from './pages/DoctorDashboard';
import BookConsultation from './pages/BookConsultation';
import './App.css';
import AuthModal from "./components/AuthModal.jsx";
import { useDispatch, useSelector } from 'react-redux';
import {closeAuthModal} from "./features/modal/modalSlice.js";


import {fetchUserMe, logout} from "./features/auth/authSlice.js";
import VideoCall3 from "./components/VideoCall3.jsx";
import {updateMainClick} from "./features/utils/utilsSlice.js";
import Settings from "./pages/Settings.jsx";
import DoctorSettings from "./pages/DoctorSettings.jsx";

import PaymentSuccess from "./pages/PaymentSuccess.jsx";
import PaymentCancel from "./pages/PaymentCancel.jsx";

import RegistrationComplete from "./pages/RegistrationComplete.jsx";

function App() {

  const dispatch = useDispatch();
  const isModalOpen = useSelector((state) => state.modal.isAuthModalOpen);
  const accessToken = useSelector((state) => state.auth.accessToken);
  const status = useSelector((state) => state.auth.status)
  const error = useSelector((state) => state.auth.error)

    useEffect(() => {
       // console.log('accessToken: ', accessToken, status)
        if (accessToken) {
            dispatch(fetchUserMe());
        }
    }, [accessToken, status]);

  useEffect(() => {
      if (error) {
          dispatch(logout());
      }
  }, [error])

  const updateMainTick = () => { dispatch(updateMainClick()) }

  return (
    <div className="app">
      <Header />
        {isModalOpen &&
            <div id="tester">
                <AuthModal isOpen={isModalOpen} onClose={() => dispatch(closeAuthModal())} />
            </div>
        }

      <main onClick={updateMainTick}>
        <Routes>
           <Route path="/" element={<HomePage />} />
           <Route path="/features" element={<FeaturesPage />} />
           <Route path="/services" element={<ServicesPage />} />
           <Route path="/about" element={<AboutPage />} />
           <Route path="/contact" element={<ContactPage />} />
           <Route path="/symptom-checker" element={<SymptomCheckerPage />} />
           <Route path="/email-verification-pending" element={<EmailVerificationPending />} />
           <Route path="/email-verification" element={<EmailVerification />} />
           <Route path="/dashboard" element={<UserDashboard />} />
           <Route path="/doctor-dashboard" element={<DoctorDashboard />} />

            <Route path="/video-call/:callId" element={<VideoCall3 />} />
           <Route path="/book-consultation" element={<BookConsultation />} />

            <Route path="/settings" element={<Settings />} />
            <Route path="/doctor-settings" element={<DoctorSettings />} />
            <Route path="/success" element={<PaymentSuccess />} />
            <Route path="/cancel" element={<PaymentCancel />} />
            <Route path="/registration-complete" element={<RegistrationComplete />} />
         </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;
