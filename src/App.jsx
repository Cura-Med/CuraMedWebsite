import React from 'react';
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
import './App.css';
import AuthModal from "./components/AuthModal.jsx";
import { useDispatch, useSelector } from 'react-redux';
import {closeAuthModal} from "./features/modal/modalSlice.js";


import VideoCall2 from "./components/VideoCall2.jsx";
import VideoCall from "./components/VideoCall.jsx";

function App() {

  const dispatch = useDispatch();
  const isModalOpen = useSelector((state) => state.modal.isAuthModalOpen);

  return (
    <div className="app">
      <Header />
        {isModalOpen &&
            <div id="tester">
                <AuthModal isOpen={isModalOpen} onClose={() => dispatch(closeAuthModal())} />
            </div>
        }

      <main>
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

            <Route path="/video-test" element={<VideoCall />} />
            <Route path="/video-test-joiner" element={<VideoCall2 />} />
         </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;
