import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth0 } from "@auth0/auth0-react"; 
import { CheckCircle2, ArrowLeft, Mail, LogIn } from 'lucide-react';

const SuccessPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { loginWithRedirect } = useAuth0(); 
  
  const { type, amount, message } = location.state || { type: 'Transaction', amount: 0, message: 'Done' };

  return (
    <div className="min-h-screen bg-[#F1F5F9] flex items-center justify-center p-4">
      <div className="bg-white max-w-md w-full rounded-3xl shadow-2xl p-10 text-center border-t-8 border-green-500">
        
        {/* Animated Check Icon */}
        <div className="flex justify-center mb-6">
          <div className="bg-green-100 p-4 rounded-full animate-bounce">
            <CheckCircle2 size={60} className="text-green-600" />
          </div>
        </div>

        <h1 className="text-3xl font-black text-[#0B1120] mb-2">Success!</h1>
        <p className="text-slate-500 font-medium mb-8">{message}</p>

        {/* Details Box - 🎯 Now Center Aligned */}
        <div className="bg-slate-50 rounded-2xl p-6 mb-8 border border-slate-100 text-center">
          <div className="flex flex-col items-center justify-center mb-2">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Type</span>
            <span className="font-bold text-[#0B1120] text-lg">{type}</span>
          </div>
          {amount > 0 && (
            <div className="flex flex-col items-center justify-center mb-4 border-b border-slate-200 pb-2">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Amount</span>
              <span className="font-mono font-bold text-green-600 text-2xl">₹{amount}</span>
            </div>
          )}
          <div className="flex items-center justify-center gap-3 mt-4 text-blue-600 bg-blue-50 p-3 rounded-lg">
            <Mail size={18} />
            <p className="text-[11px] font-bold leading-tight">Confirmation and credentials have been sent to your registered email.</p>
          </div>
        </div>

        {/* 🎯 Smart Button Logic */}
        <div className="space-y-3">
          {type === 'ACCOUNT OPENING' ? (
            <button 
              onClick={() => loginWithRedirect()}
              className="w-full py-4 bg-amber-500 text-[#0B1120] rounded-xl font-black text-sm uppercase tracking-[0.2em] hover:bg-amber-600 transition-all flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20"
            >
              <LogIn size={18} /> Login to My Account
            </button>
          ) : (
            <button 
              onClick={() => navigate('/dashboard')}
              className="w-full py-4 bg-[#0B1120] text-white rounded-xl font-black text-sm uppercase tracking-[0.2em] hover:bg-amber-600 transition-all flex items-center justify-center gap-2"
            >
              <ArrowLeft size={18} /> Back to Dashboard
            </button>
          )}

          <button 
            onClick={() => navigate('/')}
            className="w-full py-2 text-slate-400 text-[10px] font-bold uppercase tracking-widest hover:text-[#0B1120] transition-colors"
          >
            Go to Home Page
          </button>
        </div>
      </div>
    </div>
  );
};

export default SuccessPage;