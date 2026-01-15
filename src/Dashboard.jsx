import React, { useEffect, useState } from 'react';
import { useAuth0 } from "@auth0/auth0-react";
import { useNavigate } from 'react-router-dom'; // 👈 Navigation के लिए
import api from './api';
import SpendingChart from './SpendingChart'; 
import { 
  LogOut, LayoutGrid, CreditCard, ArrowRightLeft, 
  FileText, Settings, Bell, Download, Shield, PlusCircle,
  ChevronLeft, ChevronRight 
} from 'lucide-react';

const Dashboard = () => {
  const { user, getAccessTokenSilently, logout } = useAuth0();
  const navigate = useNavigate(); // 👈 Hook initialize kiya
  
  const [customerData, setCustomerData] = useState(null);
  const [accountData, setAccountData] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      setLoading(true);
      const token = await getAccessTokenSilently({ authorizationParams: { audience: "https://bank-api" } });
      const headers = { Authorization: `Bearer ${token}` };
      const custRes = await api.get('/customer-service/api/v1/customers/me', { headers });
      setCustomerData(custRes.data);
      if(custRes.data.accountNumber) {
         const accRes = await api.get(`/accounts-service/api/v1/accounts/${custRes.data.accountNumber}`, { headers });
         setAccountData(accRes.data);
         fetchTransactions(custRes.data.accountNumber, 0, token);
      }
    } catch (err) { console.error("Fetch Error:", err); } finally { setLoading(false); }
  };

  const fetchTransactions = async (accNo, page, token) => {
    try {
      if(!token) token = await getAccessTokenSilently({ authorizationParams: { audience: "https://bank-api" } });
      const transRes = await api.get(`/accounts-service/api/v1/accounts/${accNo}/transactions?page=${page}&size=5`, { 
        headers: { Authorization: `Bearer ${token}` } 
      });
      setTransactions(transRes.data.content || []);
      setTotalPages(transRes.data.totalPages);
      setCurrentPage(page);
    } catch (err) { console.error("Pagination Error:", err); }
  };

  useEffect(() => { fetchData(); }, [user]);

  // 🎯 Navigation Helper: Razorpay jaisa dedicated page kholne ke liye
  const goToPayment = (paymentType) => {
    navigate('/payment', { 
      state: { 
        type: paymentType, 
        sourceAccount: customerData.accountNumber, 
        userEmail: user.email 
      } 
    });
  };

  if (loading) return <div className="h-screen flex items-center justify-center bg-[#F1F5F9] text-[#0B1120] font-bold tracking-widest animate-pulse uppercase">Establishing Secure Connection...</div>;
  if (!customerData) return <div className="h-screen flex items-center justify-center bg-[#F1F5F9] font-bold uppercase tracking-widest animate-bounce">Syncing with Registry...</div>;

  return (
    <div className="min-h-screen bg-[#F1F5F9] flex font-sans">
      <aside className="w-72 bg-[#0B1120] text-white flex flex-col fixed h-full z-20 shadow-2xl">
        <div className="h-20 flex items-center px-6 border-b border-white/10">
          <span className="text-2xl tracking-tight"><span className="font-bold text-white">Agrawal</span><span className="font-light text-amber-500">Bank</span></span>
        </div>
        <nav className="p-4 space-y-2 flex-1 mt-4">
          <button onClick={() => navigate('/dashboard')} className="w-full flex items-center gap-4 px-4 py-3 bg-amber-600 rounded text-sm font-bold shadow-lg shadow-amber-600/20 transition-all"><LayoutGrid size={20}/> Overview</button>
          <button onClick={() => goToPayment('deposit')} className="w-full flex items-center gap-4 px-4 py-3 text-slate-400 hover:bg-white/5 hover:text-white transition rounded"><PlusCircle size={20}/> Quick Deposit</button>
          <button onClick={() => goToPayment('transfer')} className="w-full flex items-center gap-4 px-4 py-3 text-slate-400 hover:bg-white/5 hover:text-white transition rounded"><ArrowRightLeft size={20}/> Fund Transfer</button>
          <button onClick={() => goToPayment('bill')} className="w-full flex items-center gap-4 px-4 py-3 text-slate-400 hover:bg-white/5 hover:text-white transition rounded"><FileText size={20}/> Pay Bills</button>
        </nav>
        <div className="p-6 border-t border-white/10 bg-black/20">
          <div className="flex items-center gap-3">
             <div className="w-10 h-10 bg-amber-500 rounded-full flex items-center justify-center font-black text-black shadow-lg">{customerData?.firstName?.[0] || 'U'}</div>
             <div className="flex-1 overflow-hidden">
                <p className="text-sm font-bold truncate">{customerData?.firstName} {customerData?.lastName}</p>
                <span className="flex items-center gap-1.5 text-[9px] text-green-400 font-bold uppercase tracking-widest animate-pulse">● Secure</span>
             </div>
             <button onClick={() => logout()} className="text-slate-400 hover:text-red-500 transition-colors"><LogOut size={18} /></button>
          </div>
        </div>
      </aside>

      <main className="flex-1 ml-72 p-10">
        <header className="flex justify-between items-end mb-10">
          <div><h1 className="text-3xl font-black text-[#0B1120]">Overview</h1><p className="text-slate-500 font-medium">Manage your global accounts and liquid assets.</p></div>
          <button onClick={fetchData} className="p-3 bg-white border border-slate-200 rounded-xl text-[#0B1120] hover:bg-slate-50 transition shadow-sm relative"><Bell size={22} /><span className="absolute top-2.5 right-2.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span></button>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10">
           <div className="lg:col-span-2 bg-[#0B1120] text-white p-10 rounded-2xl shadow-2xl relative overflow-hidden group">
              <div className="absolute -top-10 -right-10 opacity-5 group-hover:opacity-10 transition-opacity"><Shield size={250} /></div>
              <div className="relative z-10 flex flex-col h-full justify-between gap-12">
                 <div className="flex justify-between items-start">
                    <div><p className="text-slate-400 text-xs font-bold uppercase tracking-[0.2em] mb-3">Available Balance</p><h2 className="text-5xl font-mono font-bold tracking-tighter text-white">₹ {accountData?.availableBalance?.toLocaleString('en-IN', { minimumFractionDigits: 2 }) || '0.00'}</h2></div>
                    <div className="flex flex-col items-end gap-2 text-right"><span className="px-3 py-1 bg-green-500/10 text-green-400 text-[9px] font-black rounded-full border border-green-500/20 uppercase tracking-widest">Active Tier-1</span><p className="text-slate-500 font-mono text-[10px]">{accountData?.currency || 'INR'} Savings</p></div>
                 </div>
                 <div className="flex justify-between items-end border-t border-white/5 pt-8">
                    <div><p className="text-[10px] text-slate-500 font-bold mb-1 tracking-widest uppercase italic">A/C Number</p><p className="font-mono text-xl tracking-[0.2em] text-slate-200">{customerData?.accountNumber}</p></div>
                    <div className="text-right"><p className="text-[10px] text-slate-500 font-bold mb-1 tracking-widest uppercase italic">Digital Branch</p><p className="font-bold text-slate-300 italic tracking-tight uppercase tracking-widest">Mumbai Digital HQ</p></div>
                 </div>
              </div>
           </div>

           <div className="flex flex-col gap-6">
              <div className="bg-white p-6 rounded-2xl shadow-xl border border-slate-100 grid grid-cols-2 gap-4">
                  <button onClick={() => goToPayment('transfer')} className="p-4 bg-slate-50 border border-slate-100 hover:border-amber-500 hover:bg-amber-50 rounded-xl flex flex-col items-center gap-2 transition-all"><ArrowRightLeft className="text-slate-400" size={20} /><span className="text-[10px] font-black tracking-wider uppercase">Send</span></button>
                  <button onClick={() => goToPayment('deposit')} className="p-4 bg-slate-50 border border-slate-100 hover:border-green-500 hover:bg-green-50 rounded-xl flex flex-col items-center gap-2 transition-all"><Download className="text-slate-400" size={20} /><span className="text-[10px] font-black tracking-wider uppercase">Deposit</span></button>
                  <button onClick={() => goToPayment('bill')} className="p-4 bg-slate-50 border border-slate-100 hover:border-blue-500 hover:bg-blue-50 rounded-xl flex flex-col items-center gap-2 transition-all"><FileText className="text-slate-400" size={20} /><span className="text-[10px] font-black tracking-wider uppercase">Bills</span></button>
                  <button className="p-4 bg-slate-50 border border-slate-100 opacity-40 rounded-xl flex flex-col items-center gap-2 cursor-not-allowed"><CreditCard className="text-slate-400" size={20} /><span className="text-[10px] font-black tracking-wider uppercase">Cards</span></button>
              </div>
              <div className="bg-white p-6 rounded-2xl shadow-xl border border-slate-100">
                  <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 italic">Expense Analysis</h3>
                  <div className="min-h-[150px] flex items-center justify-center"><SpendingChart transactions={transactions} /></div>
              </div>
           </div>
        </div>

        <div className="bg-white border border-slate-100 rounded-2xl shadow-xl overflow-hidden">
           <div className="px-8 py-6 border-b border-slate-50 flex justify-between items-center bg-slate-50/30">
              <h3 className="font-black text-[#0B1120] text-xs tracking-widest uppercase">Transaction Ledger</h3>
              <div className="flex items-center gap-3">
                 <button disabled={currentPage === 0} onClick={() => fetchTransactions(customerData?.accountNumber, currentPage - 1)} className="p-1.5 border rounded hover:bg-white disabled:opacity-20 transition"><ChevronLeft size={16} /></button>
                 <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest font-mono">Page {currentPage + 1} of {totalPages || 1}</span>
                 <button disabled={currentPage + 1 >= totalPages} onClick={() => fetchTransactions(customerData?.accountNumber, currentPage + 1)} className="p-1.5 border rounded hover:bg-white disabled:opacity-20 transition"><ChevronRight size={16} /></button>
              </div>
           </div>
           <table className="w-full text-left">
              <thead className="text-[9px] text-slate-400 border-b border-slate-50 uppercase tracking-[0.2em]"><tr><th className="px-8 py-4 font-black">Description / Ref</th><th className="px-8 py-4 font-black">Date</th><th className="px-8 py-4 font-black text-right">Amount (INR)</th></tr></thead>
              <tbody className="divide-y divide-slate-50">
                 {transactions.length > 0 ? transactions.map((row, i) => (
                    <tr key={i} className="hover:bg-slate-50/80 transition-colors">
                       <td className="px-8 py-5 flex flex-col"><span className="text-sm font-bold text-[#0B1120]">{row.description}</span><span className="text-[9px] text-slate-400 font-mono tracking-tighter uppercase">{row?.referenceId?.substring(0, 15)}...</span></td>
                       <td className="px-8 py-5 font-bold text-slate-500 uppercase tracking-widest text-[10px]">{new Date(row.timeStamp).toLocaleDateString('en-GB')}</td>
                       <td className={`px-8 py-5 text-right font-mono font-bold text-base ${row.amount > 0 ? 'text-green-600' : 'text-red-500'}`}>{row.amount > 0 ? '+' : ''} {row.amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
                    </tr>
                 )) : (<tr><td colSpan="3" className="px-8 py-20 text-center text-slate-300 font-black italic tracking-widest uppercase">No Ledger Data</td></tr>)}
              </tbody>
           </table>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;