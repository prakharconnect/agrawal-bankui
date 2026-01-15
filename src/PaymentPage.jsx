import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth0 } from "@auth0/auth0-react";
import api from './api';
import { ShieldCheck, ArrowLeft, CreditCard, Landmark, Send } from 'lucide-react';

const PaymentPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { getAccessTokenSilently } = useAuth0();
  const { type, sourceAccount, userEmail } = location.state || {};

  const [formData, setFormData] = useState({
    targetAccountNumber: '',
    amount: '',
    targetEmail: type === 'bill' ? "billing@agrawalbank.com" : "",
    billerName: type === 'bill' ? "" : "Internal Transfer",
    billReferenceNumber: 'REF-' + Date.now()
  });

  const handleAuthorize = async (e) => {
    e.preventDefault();
    try {
      const token = await getAccessTokenSilently({ authorizationParams: { audience: "https://bank-api" } });
      
      const path = type === 'deposit' ? '/accounts-service/api/v1/accounts/deposit' : 
                   (type === 'bill' ? '/payment-service/api/v1/payments/bill' : '/payment-service/api/v1/payments/transfer');

      const payload = { 
        ...formData, 
        sourceAccountNumber: sourceAccount, 
        accountNumber: sourceAccount, 
        email: userEmail 
      };

      await api.post(path, payload, { headers: { Authorization: `Bearer ${token}` } });

      navigate('/success', { 
        state: { 
          type: type.toUpperCase(), 
          amount: formData.amount,
          message: "Transaction processed securely. Confirmation sent to " + userEmail + (type === 'transfer' ? " and recipient." : "")
        } 
      });
    } catch (err) {
      alert("Transaction Failed!");
    }
  };

  return (
    <div className="min-h-screen bg-[#F1F5F9] flex flex-col items-center py-12 px-4">
      <div className="mb-8 flex items-center gap-2">
        <div className="bg-[#0B1120] p-2 rounded-lg text-amber-500"><Landmark size={24}/></div>
        <span className="text-xl font-black text-[#0B1120] uppercase tracking-tighter">Agrawal <span className="text-amber-500 font-light">Bank</span></span>
      </div>

      <div className="max-w-4xl w-full grid grid-cols-1 md:grid-cols-2 bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-200">
        
        <div className="bg-[#0B1120] p-10 text-white flex flex-col justify-between">
          <div>
            <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-slate-400 hover:text-white mb-10 transition-colors">
              <ArrowLeft size={18}/> Back
            </button>
            <p className="text-amber-500 font-black text-xs uppercase tracking-[0.3em] mb-2">Secure Checkout</p>
            <h2 className="text-3xl font-bold mb-6 italic capitalize">{type} Request</h2>
            
            <div className="space-y-6">
              <div className="border-l-2 border-amber-500 pl-4">
                <p className="text-slate-400 text-[10px] uppercase font-bold tracking-widest">Source Account</p>
                <p className="font-mono text-lg">XXXX-XXXX-{sourceAccount?.slice(-4)}</p>
              </div>
              <div className="border-l-2 border-slate-700 pl-4 text-slate-400">
                <p className="text-[10px] uppercase font-bold tracking-widest">Logged in as</p>
                <p className="text-sm truncate">{userEmail}</p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 text-green-400 bg-green-400/10 p-4 rounded-xl border border-green-400/20">
            <ShieldCheck size={24}/>
            <p className="text-[10px] font-bold uppercase leading-tight">PCI-DSS Compliant <br/> 256-bit Encryption</p>
          </div>
        </div>

        <div className="p-10">
          <form onSubmit={handleAuthorize} className="space-y-6">
            {type === 'bill' && (
               <div>
                 <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Select Provider</label>
                 <select required className="w-full border-b-2 border-slate-100 py-3 bg-transparent focus:border-amber-500 outline-none transition-all font-bold"
                   onChange={e => setFormData({...formData, billerName: e.target.value})}>
                   <option value="">Choose Biller...</option>
                   <option value="Airtel">Airtel Postpaid</option>
                   <option value="Adani">Adani Electricity</option>
                 </select>
               </div>
            )}

            {type === 'transfer' && (
               <>
                 <div>
                   <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Recipient A/C No.</label>
                   <input type="text" required placeholder="0000 0000 00" className="w-full border-b-2 border-slate-100 py-3 focus:border-amber-500 outline-none transition-all font-mono text-lg"
                     onChange={e => setFormData({...formData, targetAccountNumber: e.target.value})}/>
                 </div>
                 {/* 🎯 Receiver's Email Field Added Here */}
                 <div>
                   <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Recipient Email (for Credit Alert)</label>
                   <input type="email" required placeholder="recipient@example.com" className="w-full border-b-2 border-slate-100 py-3 focus:border-amber-500 outline-none transition-all font-medium text-sm"
                     onChange={e => setFormData({...formData, targetEmail: e.target.value})}/>
                 </div>
               </>
            )}

            <div>
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Amount (INR)</label>
              <div className="relative">
                <span className="absolute left-0 top-3 text-2xl font-bold text-slate-300">₹</span>
                <input type="number" required placeholder="0.00" className="w-full border-b-2 border-slate-100 py-3 pl-6 focus:border-amber-500 outline-none transition-all font-mono text-3xl font-bold text-[#0B1120]"
                  onChange={e => setFormData({...formData, amount: e.target.value})}/>
              </div>
            </div>

            <button type="submit" className="w-full bg-[#0B1120] text-white py-5 rounded-2xl font-black text-sm uppercase tracking-[0.2em] shadow-xl hover:bg-amber-600 transition-all flex items-center justify-center gap-3 group">
               Confirm & Authorize <Send size={18} className="group-hover:translate-x-1 transition-transform"/>
            </button>
          </form>
          
          <p className="text-center text-[9px] text-slate-400 mt-8 uppercase font-bold tracking-widest">
            By clicking Authorize, you agree to Agrawal Bank's <br/> Terms of Digital Transfer.
          </p>
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;