import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from './api'; 
import { Building2, ShieldCheck, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';

const PublicRegistration = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "", lastName: "", email: "", phone: "", address: "",
    externalId: uuidv4()
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/customer-service/api/v1/customers', formData);
      
      // 🎯 ALERT हटाकर SUCCESS PAGE पर भेजा है
      navigate('/success', { 
        state: { 
          type: 'ACCOUNT OPENING', 
          amount: 0, 
          message: "Application Submitted Successfully! We have sent your temporary credentials and welcome kit to " + formData.email
        } 
      });

    } catch (error) {
      console.error(error);
      alert("System Error: Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-[#F8FAFC]">
      
      {/* LEFT SIDE: BRANDING (Static) */}
      <div className="hidden lg:flex w-1/3 bg-[#0B1120] text-white flex-col justify-between p-12">
        <div>
          <div className="flex items-center gap-2 mb-10">
            <Building2 className="w-6 h-6 text-amber-500" />
            <span className="text-xl font-bold">Agrawal<span className="text-amber-500">Bank</span></span>
          </div>
          <h2 className="text-3xl font-bold mb-4">Begin your journey with India's most trusted banking partner.</h2>
          <p className="text-slate-400">Join over 2 million customers who trust us with their financial legacy.</p>
        </div>
        <div className="space-y-4">
          <div className="flex items-center gap-3 text-sm text-slate-300">
            <CheckCircle2 className="w-5 h-5 text-amber-500" /> <span>Zero Balance Savings Account</span>
          </div>
          <div className="flex items-center gap-3 text-sm text-slate-300">
            <CheckCircle2 className="w-5 h-5 text-amber-500" /> <span>Complimentary Platinum Debit Card</span>
          </div>
          <div className="flex items-center gap-3 text-sm text-slate-300">
            <CheckCircle2 className="w-5 h-5 text-amber-500" /> <span>Priority 24/7 Support</span>
          </div>
        </div>
      </div>

      {/* RIGHT SIDE: FORM */}
      <div className="flex-1 flex flex-col justify-center p-6 lg:p-20">
        <button onClick={() => navigate('/')} className="flex items-center gap-2 text-slate-500 mb-8 hover:text-[#0B1120] w-fit">
          <ArrowLeft className="w-4 h-4" /> Return to Home
        </button>

        <div className="max-w-xl w-full mx-auto bg-white p-8 rounded-sm shadow-sm border border-slate-200">
          <h1 className="text-2xl font-bold text-[#0B1120] mb-2">Account Application</h1>
          <p className="text-slate-500 text-sm mb-8">Please enter your details as per your Aadhaar/PAN card.</p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-600 uppercase">First Name</label>
                <input type="text" required className="w-full p-3 bg-slate-50 border border-slate-300 rounded-sm focus:border-[#0B1120] focus:ring-1 focus:ring-[#0B1120] outline-none transition" 
                  onChange={e => setFormData({...formData, firstName: e.target.value})} />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-600 uppercase">Last Name</label>
                <input type="text" required className="w-full p-3 bg-slate-50 border border-slate-300 rounded-sm focus:border-[#0B1120] focus:ring-1 focus:ring-[#0B1120] outline-none transition"
                  onChange={e => setFormData({...formData, lastName: e.target.value})} />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-600 uppercase">Email Address</label>
              <input type="email" required className="w-full p-3 bg-slate-50 border border-slate-300 rounded-sm focus:border-[#0B1120] focus:ring-1 focus:ring-[#0B1120] outline-none transition"
                onChange={e => setFormData({...formData, email: e.target.value})} />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-600 uppercase">Mobile Number</label>
              <input type="tel" required className="w-full p-3 bg-slate-50 border border-slate-300 rounded-sm focus:border-[#0B1120] focus:ring-1 focus:ring-[#0B1120] outline-none transition"
                onChange={e => setFormData({...formData, phone: e.target.value})} />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-600 uppercase">Residential Address</label>
              <textarea required rows="2" className="w-full p-3 bg-slate-50 border border-slate-300 rounded-sm focus:border-[#0B1120] focus:ring-1 focus:ring-[#0B1120] outline-none transition resize-none"
                onChange={e => setFormData({...formData, address: e.target.value})} />
            </div>

            <button disabled={loading} className="w-full py-4 bg-[#0B1120] text-white font-bold uppercase tracking-wider text-sm hover:bg-slate-800 transition shadow-lg">
              {loading ? "Verifying..." : "Submit Application"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PublicRegistration;