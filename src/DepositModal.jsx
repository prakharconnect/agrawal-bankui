import React, { useState } from 'react';
import api from './api';
import { useAuth0 } from "@auth0/auth0-react"; // 👈 Auth0 Hook import kiya

const DepositModal = ({ accountNumber, onClose, onSuccess }) => {
  const [amount, setAmount] = useState('');
  const { getAccessTokenSilently } = useAuth0(); // 👈 Token nikalne ke liye

  const handleDeposit = async (e) => {
    e.preventDefault();
    try {
      // 🎯 1. Auth0 se valid token mangwao
      const token = await getAccessTokenSilently({
        authorizationParams: {
          audience: "https://bank-api", // 👈 Apni sahi Audience check kar lena
        },
      });

      // 🎯 2. Headers mein Token ke saath call karo
      await api.post('/accounts-service/api/v1/accounts/deposit', {
        accountNumber: accountNumber,
        amount: amount
      }, {
        headers: {
          Authorization: `Bearer ${token}` // 👈 Iske bina 401 aa raha tha
        }
      });

      alert("💰 Paisa Jama Ho Gaya!");
      onSuccess();
      onClose();
    } catch (err) {
      console.error("Deposit Error Details:", err.response?.data);
      alert("Deposit Failed: " + (err.response?.data?.message || "Check your session"));
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-sm w-[350px]">
        <h2 className="text-lg font-bold mb-4">Deposit Cash (Test)</h2>
        <form onSubmit={handleDeposit} className="space-y-4">
          <input 
            type="number" placeholder="Enter Amount" required 
            className="w-full border p-2" onChange={e => setAmount(e.target.value)} 
          />
          <div className="flex gap-2">
            <button type="button" onClick={onClose} className="flex-1 text-gray-500">Cancel</button>
            <button type="submit" className="flex-1 bg-green-600 text-white py-2 font-bold">DEPOSIT</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DepositModal;