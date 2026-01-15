import React, { useState } from 'react';
import { useAuth0 } from "@auth0/auth0-react"; 
import api from './api';

const FundTransferModal = ({ sourceAccount, userEmail, onClose, onSuccess, isBillPayment }) => {
  const { getAccessTokenSilently } = useAuth0(); 
  
  const [formData, setFormData] = useState({
    targetAccountNumber: '', 
    amount: '',
    targetEmail: isBillPayment ? "billing@agrawalbank.com" : "",
    billerName: isBillPayment ? "" : "Fund Transfer",
    billReferenceNumber: 'REF-' + Date.now()
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // 🎯 1. Auth0 से Secure Token लो
      const token = await getAccessTokenSilently({
        authorizationParams: { audience: "https://bank-api" },
      });

      // 🎯 2. Endpoint Path सेट करो (Controller के हिसाब से /bill या /transfer)
      // 405 Error को फिक्स करने के लिए ये सही पाथ जोड़ना ज़रूरी है
      const path = isBillPayment ? '/bill' : '/transfer';

      const payload = { 
        ...formData, 
        sourceAccountNumber: sourceAccount, 
        email: userEmail,
        targetAccountNumber: isBillPayment ? null : formData.targetAccountNumber 
      };
      
      // 🎯 3. API Gateway (9090) के ज़रिए POST कॉल
      await api.post(`/payment-service/api/v1/payments${path}`, payload, {
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      }); 
      
      alert(isBillPayment ? "✅ Bill Paid Successfully!" : "✅ Transfer Successful!");
      onSuccess();
      onClose();
    } catch (err) {
      // Debugging के लिए console log ज़रूर देखें
      console.error("Payment Error:", err.response);
      alert("❌ Transaction Failed: " + (err.response?.data?.message || "Internal Error"));
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white p-8 rounded-2xl w-full max-w-md shadow-2xl border-b-8 border-amber-500">
        
        <div className="mb-6">
          <h2 className="text-2xl font-black text-[#0B1120] tracking-tight">
            {isBillPayment ? 'Utility Bill Payment' : 'Internal Fund Transfer'}
          </h2>
          <p className="text-xs text-slate-400 font-bold mt-1 uppercase tracking-widest">
            Source: <span className="text-amber-600">XXXX-{sourceAccount?.slice(-4)}</span>
          </p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-5">
          
          {isBillPayment ? (
            <div>
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Select Provider</label>
              <select 
                required 
                className="w-full border-2 border-slate-100 p-3 rounded-xl mt-1 bg-slate-50 focus:border-amber-500 outline-none transition-all"
                onChange={e => setFormData({...formData, billerName: e.target.value})}
              >
                <option value="">-- Select Biller --</option>
                <option value="Airtel Postpaid">Airtel Postpaid</option>
                <option value="Tata Play">Tata Play</option>
                <option value="Adani Electricity">Adani Electricity</option>
                <option value="Netflix Professional">Netflix Professional</option>
              </select>
            </div>
          ) : (
            <div>
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Recipient Account Number</label>
              <input 
                type="text" placeholder="Enter 10-digit A/C No." required 
                className="w-full border-2 border-slate-100 p-3 rounded-xl mt-1 focus:border-amber-500 outline-none transition-all" 
                onChange={e => setFormData({...formData, targetAccountNumber: e.target.value})} 
              />
            </div>
          )}

          <div>
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Transfer Amount (INR)</label>
            <div className="relative">
              <span className="absolute left-3 top-3.5 text-slate-400 font-bold">₹</span>
              <input 
                type="number" placeholder="0.00" required 
                className="w-full border-2 border-slate-100 p-3 pl-8 rounded-xl mt-1 focus:border-amber-500 outline-none transition-all font-mono text-lg" 
                onChange={e => setFormData({...formData, amount: e.target.value})} 
              />
            </div>
          </div>

          {!isBillPayment && (
            <div>
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Beneficiary Email</label>
              <input 
                type="email" placeholder="For instant e-receipt" required 
                className="w-full border-2 border-slate-100 p-3 rounded-xl mt-1 focus:border-amber-500 outline-none transition-all" 
                onChange={e => setFormData({...formData, targetEmail: e.target.value})} 
              />
            </div>
          )}

          <div className="flex gap-4 pt-6">
            <button type="button" onClick={onClose} className="flex-1 py-3 text-slate-400 font-black text-xs uppercase tracking-widest hover:text-slate-600">Cancel</button>
            <button type="submit" className="flex-1 py-3 bg-[#0B1120] text-white font-black text-xs rounded-xl shadow-xl shadow-slate-200 hover:bg-amber-600 transition-all uppercase tracking-widest">
              Authorize
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FundTransferModal;