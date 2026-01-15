import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { useAuth0 } from "@auth0/auth0-react";

// Components Import
import LandingPage from './LandingPage';
import PublicRegistration from './PublicRegistration';
import Dashboard from './Dashboard';
import PaymentPage from './PaymentPage'; // 👈 Naya Payment Page Import kiya
import SuccessPage from './SuccessPage'; // 👈 Naya Success Page Import kiya

const App = () => {
  const { isLoading } = useAuth0();

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center">Loading Bank App...</div>;
  }

  return (
    <Routes>
      {/* 1. Home Page (Jahan Login aur Open Account ke button hain) */}
      <Route path="/" element={<LandingPage />} />

      {/* 2. Open Account Form (Sabke liye khula hai) */}
      <Route path="/open-account" element={<PublicRegistration />} />

      {/* 3. Dashboard (Sirf Login hone ke baad dikhega) */}
      <Route path="/dashboard" element={<Dashboard />} />

      {/* 🎯 4. Payment Page (Razorpay Style Checkout) */}
      <Route path="/payment" element={<PaymentPage />} />

      {/* 🎯 5. Success Page (Transaction Completion Screen) */}
      <Route path="/success" element={<SuccessPage />} />
    </Routes>
  );
};

export default App;