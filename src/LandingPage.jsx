import React from 'react';
import { useAuth0 } from "@auth0/auth0-react";
import { useNavigate } from 'react-router-dom';
import { Shield, Lock, Globe, ChevronRight, Building2, Smartphone, Facebook, Twitter, Linkedin, Instagram } from 'lucide-react';

const LandingPage = () => {
  const { loginWithRedirect, isAuthenticated } = useAuth0();
  const navigate = useNavigate();

  if (isAuthenticated) navigate('/dashboard');

  return (
    <div className="min-h-screen bg-[#0B1120] text-white font-sans selection:bg-amber-500 selection:text-black flex flex-col justify-between">
      
      {/* WRAPPER DIV for Content */}
      <div>
        {/* --- NAVBAR --- */}
        <nav className="fixed w-full z-50 border-b border-white/5 bg-[#0B1120]/90 backdrop-blur-md">
          <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-amber-500 rounded-sm">
                <Building2 className="w-6 h-6 text-[#0B1120]" />
              </div>
              <span className="text-2xl font-bold tracking-wide text-white">
                Agrawal<span className="text-amber-500">Bank</span>
              </span>
            </div>
            
            <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-300">
              <a href="#" className="hover:text-amber-400 transition">Personal</a>
              <a href="#" className="hover:text-amber-400 transition">Corporate</a>
              <button onClick={() => loginWithRedirect()} className="text-white hover:text-amber-400 transition">NetBanking Login</button>
              <button onClick={() => navigate('/open-account')} className="px-6 py-2 bg-amber-600 hover:bg-amber-500 text-white rounded-sm font-bold transition shadow-lg">Open Account</button>
            </div>
          </div>
        </nav>

        {/* --- HERO SECTION --- */}
        <main className="pt-32 pb-20 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-900/20 rounded-full blur-[100px] -z-10"></div>
          
          <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="inline-flex items-center gap-2 px-3 py-1 border border-amber-500/30 bg-amber-500/10 rounded-full">
                <Shield className="w-3 h-3 text-amber-500" />
                <span className="text-xs font-bold text-amber-400 tracking-wider uppercase">RBI Licensed & Secure</span>
              </div>
              
              <h1 className="text-5xl md:text-6xl font-bold leading-tight">
                A Legacy of Trust.<br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-200 to-amber-500">The Future of Wealth.</span>
              </h1>
              
              <p className="text-lg text-slate-400 max-w-xl leading-relaxed">
                Experience banking crafted for the modern Indian economy. Secure, transparent, and built on decades of financial excellence.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <button onClick={() => navigate('/open-account')} className="px-8 py-4 bg-white text-[#0B1120] font-bold rounded-sm hover:bg-slate-100 transition flex items-center gap-2">
                  Open Savings Account <ChevronRight className="w-4 h-4" />
                </button>
                <button onClick={() => loginWithRedirect()} className="px-8 py-4 border border-white/20 text-white font-bold rounded-sm hover:bg-white/5 transition flex items-center gap-2">
                  <Lock className="w-4 h-4" /> Secure Login
                </button>
              </div>
            </div>

            {/* Right Side Visual */}
            <div className="relative hidden lg:block">
              <div className="absolute inset-0 bg-gradient-to-tr from-amber-500/20 to-transparent blur-3xl"></div>
              <div className="relative bg-white/5 border border-white/10 backdrop-blur-xl p-8 rounded-2xl shadow-2xl transform rotate-3 hover:rotate-0 transition duration-500">
                <div className="flex justify-between items-start mb-12">
                  <Building2 className="w-8 h-8 text-amber-400" />
                  <span className="text-xs font-mono text-slate-400">AGRAWAL PRIVATE BANKING</span>
                </div>
                <div className="space-y-2">
                  <div className="h-4 w-12 bg-white/20 rounded"></div>
                  <div className="text-3xl font-mono text-white tracking-widest">₹ 1,24,50,000</div>
                </div>
                <div className="mt-8 flex justify-between items-end">
                  <div className="text-xs text-slate-400">VALID THRU 12/28</div>
                  <div className="w-10 h-10 bg-amber-500/20 rounded-full flex items-center justify-center"><Globe className="w-5 h-5 text-amber-400" /></div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* --- PROFESSIONAL FOOTER (ADDED THIS) --- */}
      <footer className="bg-[#050912] border-t border-white/5 pt-16 pb-8">
        <div className="max-w-7xl mx-auto px-6">
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
            <div>
              <h4 className="text-white font-bold mb-4">About Agrawal Bank</h4>
              <ul className="space-y-2 text-sm text-slate-400">
                <li><a href="#" className="hover:text-amber-500">Our Story</a></li>
                <li><a href="#" className="hover:text-amber-500">Leadership Team</a></li>
                <li><a href="#" className="hover:text-amber-500">Careers</a></li>
                <li><a href="#" className="hover:text-amber-500">Investor Relations</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-bold mb-4">Banking Services</h4>
              <ul className="space-y-2 text-sm text-slate-400">
                <li><a href="#" className="hover:text-amber-500">Savings Account</a></li>
                <li><a href="#" className="hover:text-amber-500">Current Account</a></li>
                <li><a href="#" className="hover:text-amber-500">Credit Cards</a></li>
                <li><a href="#" className="hover:text-amber-500">Home Loans</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-bold mb-4">Support</h4>
              <ul className="space-y-2 text-sm text-slate-400">
                <li><a href="#" className="hover:text-amber-500">Contact Us</a></li>
                <li><a href="#" className="hover:text-amber-500">Locate Branch</a></li>
                <li><a href="#" className="hover:text-amber-500">Report Fraud</a></li>
                <li><a href="#" className="hover:text-amber-500">Sitemap</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-bold mb-4">Connect</h4>
              <div className="flex gap-4 mb-4">
                <Facebook className="w-5 h-5 text-slate-400 hover:text-white cursor-pointer" />
                <Twitter className="w-5 h-5 text-slate-400 hover:text-white cursor-pointer" />
                <Linkedin className="w-5 h-5 text-slate-400 hover:text-white cursor-pointer" />
                <Instagram className="w-5 h-5 text-slate-400 hover:text-white cursor-pointer" />
              </div>
              <p className="text-xs text-slate-500">
                Helpline: 1800-123-9999
              </p>
            </div>
          </div>

          <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-xs text-slate-500">
              © 2026 Agrawal Bank Ltd. All rights reserved. | CIN: U65190MH2026PLC123456 | RBI Lic. No: AB-9920
            </p>
            <div className="flex gap-6 text-xs text-slate-500">
              <a href="#" className="hover:text-white">Privacy Policy</a>
              <a href="#" className="hover:text-white">Terms & Conditions</a>
              <a href="#" className="hover:text-white">Security</a>
            </div>
          </div>
          
        </div>
      </footer>

    </div>
  );
};

export default LandingPage;