import React, { useState, useEffect } from 'react';
import { useAuth0 } from "@auth0/auth0-react";
import api from './api';
import { ShieldCheck, User, MapPin, Phone, Mail } from 'lucide-react';

const KycForm = ({ onKycComplete }) => {
  const { user, getAccessTokenSilently } = useAuth0();
  const [loading, setLoading] = useState(false);
  
  // Form Data Initial State
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    externalId: ""
  });

  // User load hote hi data bharna
  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.given_name || "",
        lastName: user.family_name || "",
        email: user.email || "", // Ab hum ise input mein dikhayenge
        phone: "",
        address: "",
        externalId: user.sub || ""
      });
    }
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    console.log("Sending Data to Backend:", formData); // Console mein check karna

    try {
      const token = await getAccessTokenSilently();
      
      // Request bhej rahe hain
      await api.post('/customer-service/api/v1/customers', formData, {
         headers: { Authorization: `Bearer ${token}` }
      });

      alert("Account Created Successfully! 🎉");
      onKycComplete(); 
      
    } catch (error) {
      console.error("KYC Error:", error);
      // Agar backend se koi message aaya hai to wo dikhao
      if (error.response && error.response.data) {
          alert(`Error: ${JSON.stringify(error.response.data)}`);
      } else {
          alert("Failed to submit. Console check karo!");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 bg-white p-8 rounded-2xl shadow-xl border border-slate-100">
      <div className="text-center mb-6">
        <div className="bg-primary/10 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
            <ShieldCheck className="text-primary w-6 h-6" />
        </div>
        <h2 className="text-2xl font-bold text-primary">Complete Setup</h2>
        <p className="text-slate-500 text-sm">We need a few details to open your bank account.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        
        {/* NAME FIELDS */}
        <div className="grid grid-cols-2 gap-4">
            <div>
                <label className="text-xs font-bold text-slate-600">First Name</label>
                <input type="text" value={formData.firstName} 
                    onChange={e => setFormData({...formData, firstName: e.target.value})}
                    className="w-full p-3 border rounded-lg bg-slate-50 mt-1" required />
            </div>
            <div>
                <label className="text-xs font-bold text-slate-600">Last Name</label>
                <input type="text" value={formData.lastName} 
                    onChange={e => setFormData({...formData, lastName: e.target.value})}
                    className="w-full p-3 border rounded-lg bg-slate-50 mt-1" required />
            </div>
        </div>

        {/* EMAIL FIELD (New) */}
        <div>
            <label className="text-xs font-bold text-slate-600">Email Address</label>
            <div className="relative">
                <Mail className="w-4 h-4 absolute left-3 top-4 text-slate-400" />
                <input type="email" value={formData.email} 
                    onChange={e => setFormData({...formData, email: e.target.value})}
                    className="w-full p-3 pl-10 border rounded-lg mt-1 focus:ring-2 focus:ring-primary outline-none" 
                    required />
            </div>
        </div>

        {/* PHONE */}
        <div>
            <label className="text-xs font-bold text-slate-600">Phone Number</label>
            <div className="relative">
                <Phone className="w-4 h-4 absolute left-3 top-4 text-slate-400" />
                <input type="tel" placeholder="9876543210" value={formData.phone}
                    onChange={e => setFormData({...formData, phone: e.target.value})}
                    className="w-full p-3 pl-10 border rounded-lg mt-1 focus:ring-2 focus:ring-primary outline-none" required />
            </div>
        </div>

        {/* ADDRESS */}
        <div>
            <label className="text-xs font-bold text-slate-600">Address</label>
            <div className="relative">
                <MapPin className="w-4 h-4 absolute left-3 top-4 text-slate-400" />
                <input type="text" placeholder="House No, City, State" value={formData.address}
                    onChange={e => setFormData({...formData, address: e.target.value})}
                    className="w-full p-3 pl-10 border rounded-lg mt-1 focus:ring-2 focus:ring-primary outline-none" required />
            </div>
        </div>

        <button disabled={loading} className="w-full bg-primary text-white py-3 rounded-xl font-bold hover:bg-primary-light transition shadow-lg shadow-primary/20">
            {loading ? "Processing..." : "Create Account"}
        </button>
      </form>
    </div>
  );
};

export default KycForm;