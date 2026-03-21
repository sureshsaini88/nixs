"use client";

import { useState, useEffect } from "react";
import { useUser } from "../../../../contexts/UserContext";
import "./adsDeposit.css";

const depositOptions = [500, 1000, 1500, 2000, 2500, 3000, 4000, 5000, 6000, 7000, 8000, 9000, 10000];

export default function AdsDepositPage() {
  const [selectedAmount, setSelectedAmount] = useState("");
  const [customAmount, setCustomAmount] = useState("");
  const [selectedAccount, setSelectedAccount] = useState("");
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const { user } = useUser();

  useEffect(() => {
    fetchAccounts();
  }, []);

  const fetchAccounts = async () => {
    try {
      const token = localStorage.getItem('userToken');
      const response = await fetch('/api/tiktok/accounts', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (response.ok) {
        const data = await response.json();
        setAccounts(data.filter(acc => acc.status === 'active'));
      }
    } catch (error) {
      console.error('Error fetching accounts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeposit = async () => {
    const amount = customAmount ? parseInt(customAmount) : parseInt(selectedAmount);
    
    if (!amount || amount < 100) {
      alert('Minimum deposit amount is $100');
      return;
    }
    
    if (!selectedAccount) {
      alert('Please select an account');
      return;
    }

    if (user?.balance < amount) {
      alert(`Insufficient balance. You need $${amount} but have $${user?.balance || 0}.`);
      return;
    }
    
    setSubmitting(true);
    
    try {
      const token = localStorage.getItem('userToken');
      const response = await fetch('/api/tiktok/deposit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          account_id: selectedAccount,
          amount: amount
        })
      });

      if (response.ok) {
        alert('Deposit successful!');
        setSelectedAmount("");
        setCustomAmount("");
        setSelectedAccount("");
        fetchAccounts();
      } else {
        const data = await response.json();
        alert(data.error || 'Deposit failed');
      }
    } catch (error) {
      console.error('Error depositing:', error);
      alert('Error processing deposit');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="depositPage">
      <h2 className="pageTitle">Ads Deposit</h2>
      
      <div className="depositForm">
        <div className="formSection">
          <label className="sectionLabel">Select Account</label>
          <select 
            className="selectInput fullWidth"
            value={selectedAccount}
            onChange={(e) => setSelectedAccount(e.target.value)}
          >
            <option value="">-- Select an account --</option>
            {accounts.map((acc) => (
              <option key={acc.id} value={acc.id}>
                {acc.account_name} (Balance: ${acc.balance || '0.00'})
              </option>
            ))}
          </select>
          {loading && <p className="loadingText">Loading accounts...</p>}
          {!loading && accounts.length === 0 && (
            <p className="noAccountsText">No active accounts found. Please apply for an account first.</p>
          )}
        </div>

        <div className="formSection">
          <label className="sectionLabel">Deposit Amount</label>
          <div className="amountOptions">
            {depositOptions.map((amount) => (
              <button
                key={amount}
                className={`amountBtn ${selectedAmount === amount.toString() ? 'selected' : ''}`}
                onClick={() => {
                  setSelectedAmount(amount.toString());
                  setCustomAmount("");
                }}
              >
                ${amount}
              </button>
            ))}
          </div>
          
          <div className="customAmountRow">
            <span className="orText">OR</span>
            <input
              type="number"
              className="customAmountInput"
              placeholder="Enter custom amount (min $100)"
              value={customAmount}
              onChange={(e) => {
                setCustomAmount(e.target.value);
                setSelectedAmount("");
              }}
              min="100"
            />
          </div>
        </div>

        <div className="summarySection">
          <div className="summaryRow">
            <span>Selected Amount:</span>
            <span className="amount">${customAmount || selectedAmount || '0'}</span>
          </div>
          <div className="summaryRow">
            <span>Your Balance:</span>
            <span className="balance">${user?.balance || '0.00'}</span>
          </div>
        </div>

        <div className="formActions">
          <button 
            className="submitBtn"
            onClick={handleDeposit}
            disabled={submitting || !selectedAccount || (!selectedAmount && !customAmount)}
          >
            {submitting ? 'Processing...' : 'Confirm Deposit'}
          </button>
        </div>
      </div>
    </div>
  );
}
