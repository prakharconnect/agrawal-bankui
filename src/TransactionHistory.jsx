import React, { useEffect, useState } from 'react';
import api from './api';
import { ChevronLeft, ChevronRight, Search, Filter, Download } from 'lucide-react';

const TransactionHistory = ({ accountNumber, token }) => {
  const [transactions, setTransactions] = useState([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(false);

  const fetchFullLedger = async (pageNumber) => {
    try {
      setLoading(true);
      const headers = { Authorization: `Bearer ${token}` };
      
      // 🎯 Backend Pagination Call: /api/v1/accounts/{no}/transactions?page=X&size=10
      const res = await api.get(`/accounts-service/api/v1/accounts/${accountNumber}/transactions?page=${pageNumber}&size=10`, { headers });
      
      setTransactions(res.data.content);
      setTotalPages(res.data.totalPages);
      setPage(pageNumber);
    } catch (err) {
      console.error("Ledger Error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (accountNumber) fetchFullLedger(0);
  }, [accountNumber]);

  return (
    <div className="bg-white border border-slate-200 rounded-2xl shadow-xl overflow-hidden mt-8">
      {/* Header with Search & Filter */}
      <div className="p-6 border-b border-slate-100 flex flex-col md:flex-row justify-between items-center gap-4 bg-slate-50/50">
        <h2 className="text-lg font-black text-[#0B1120] uppercase tracking-tighter">Full Transaction Ledger</h2>
        <div className="flex gap-2 w-full md:w-auto">
           <div className="relative flex-1">
              <Search className="absolute left-3 top-2.5 text-slate-400" size={16} />
              <input type="text" placeholder="Search transactions..." className="pl-10 pr-4 py-2 border rounded-lg text-sm w-full outline-none focus:border-amber-500" />
           </div>
           <button className="p-2 border rounded-lg bg-white hover:bg-slate-50"><Filter size={18} className="text-slate-600" /></button>
           <button className="p-2 border rounded-lg bg-[#0B1120] text-white hover:bg-slate-800"><Download size={18} /></button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="text-[10px] text-slate-400 font-black uppercase tracking-[0.2em] border-b bg-white">
            <tr>
              <th className="px-8 py-4">Execution Date</th>
              <th className="px-8 py-4">Transaction Details</th>
              <th className="px-8 py-4 text-right">Amount (INR)</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {loading ? (
              <tr><td colSpan="3" className="px-8 py-20 text-center animate-pulse font-bold text-slate-400">DECRYPTING LEDGER DATA...</td></tr>
            ) : (
              transactions.map((t, i) => (
                <tr key={i} className="hover:bg-slate-50/80 transition-colors">
                  <td className="px-8 py-5 text-[11px] font-mono text-slate-500">
                    {new Date(t.timeStamp).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                    <br/><span className="text-[9px] text-slate-300">{new Date(t.timeStamp).toLocaleTimeString()}</span>
                  </td>
                  <td className="px-8 py-5">
                    <p className="text-sm font-bold text-[#0B1120] uppercase">{t.description}</p>
                    <p className="text-[9px] text-slate-400 font-mono italic">REF: {t.referenceId}</p>
                  </td>
                  <td className={`px-8 py-5 text-right font-mono font-bold ${t.amount > 0 ? 'text-green-600' : 'text-red-500'}`}>
                    {t.amount > 0 ? '+' : ''}{t.amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* 🎯 PAGINATION CONTROLS */}
      <div className="px-8 py-4 border-t border-slate-50 flex justify-between items-center bg-white">
        <span className="text-xs text-slate-500 font-medium">
          Showing Page <span className="text-[#0B1120] font-bold">{page + 1}</span> of {totalPages}
        </span>
        <div className="flex gap-2">
          <button 
            disabled={page === 0 || loading}
            onClick={() => fetchFullLedger(page - 1)}
            className="p-2 border rounded-lg disabled:opacity-30 hover:bg-slate-50"
          >
            <ChevronLeft size={20} />
          </button>
          <button 
            disabled={page + 1 === totalPages || loading}
            onClick={() => fetchFullLedger(page + 1)}
            className="p-2 border rounded-lg disabled:opacity-30 hover:bg-slate-50"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default TransactionHistory;