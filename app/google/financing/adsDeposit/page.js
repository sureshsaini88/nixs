"use client";

import { useState, useEffect } from "react";
import { FiSearch } from "react-icons/fi";
import { useUser } from "../../../../contexts/UserContext";
import { useRouter } from "next/navigation";

export default function GoogleAdsDepositPage() {
  const [adAccount, setAdAccount] = useState("");
  const [money, setMoney] = useState("");
  const [deposits, setDeposits] = useState([]);
  const [userAccounts, setUserAccounts] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const { user, loading } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!user && !loading) {
      router.push('/login');
      return;
    }
    fetchUserAccounts();
  }, [user, loading]);

  const fetchUserAccounts = async () => {
    try {
      const token = localStorage.getItem('userToken');
      const response = await fetch('/api/user/accounts', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        setUserAccounts(data);
      }
    } catch (error) {
      console.error('Error fetching accounts:', error);
    }
  };

  const handleAddDeposit = () => {
    if (adAccount && money) {
      const depositAmount = parseFloat(money) || 0;
      const costAmount = depositAmount * 1.03; // 3% fee
      
      const selectedAccount = userAccounts.find(acc => acc.ads_account_id === adAccount);
      
      const newDeposit = {
        id: Date.now(),
        account: selectedAccount?.ads_account_name || adAccount,
        accountId: adAccount,
        amount: depositAmount,
        cost: costAmount
      };
      
      setDeposits([...deposits, newDeposit]);
      setAdAccount("");
      setMoney("");
    }
  };

  const handleCharge = async () => {
    if (deposits.length === 0) {
      alert('Please add at least one deposit');
      return;
    }

    setSubmitting(true);
    try {
      const token = localStorage.getItem('userToken');
      const response = await fetch('/api/ads-deposit-requests', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ deposits })
      });

      if (response.ok) {
        alert('Deposit requests submitted! Pending admin approval.');
        setDeposits([]);
      } else {
        const data = await response.json();
        alert(data.message || 'Failed to submit deposit requests');
      }
    } catch (error) {
      console.error('Error submitting deposits:', error);
      alert('Error submitting deposit requests');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteDeposit = (id) => {
    setDeposits(deposits.filter(d => d.id !== id));
  };

  return (
    <div>
      <h1 className="pageTitle">Google Ads Deposit</h1>

      {/* DEPOSIT FORM */}
      <div className="formSection">
        <div className="formRow">
          <label className="formLabel">Select Ad Account</label>
          <select
            className="formSelect"
            value={adAccount}
            onChange={(e) => setAdAccount(e.target.value)}
          >
            <option value="">Select an ad account</option>
            {userAccounts.map((account) => (
              <option key={account.id} value={account.ads_account_id}>
                {account.ads_account_name || account.ads_account_id}
              </option>
            ))}
          </select>
        </div>

        <div className="formRow">
          <label className="formLabel">Deposit Amount</label>
          <input
            type="number"
            className="formInput"
            placeholder="Enter deposit amount"
            value={money}
            onChange={(e) => setMoney(e.target.value)}
          />
        </div>

        <div className="formActions">
          <button 
            type="button" 
            className="submitBtn" 
            style={{ background: '#6c757d' }}
            onClick={() => {setAdAccount(""); setMoney("");}}
          >
            Reset
          </button>
          <button 
            type="button" 
            className="submitBtn"
            onClick={handleAddDeposit}
            disabled={!adAccount || !money}
          >
            Add Deposit
          </button>
        </div>
      </div>

      {/* DEPOSITS TABLE */}
      {deposits.length > 0 && (
        <div className="tableWrap" style={{ marginBottom: '20px' }}>
          <table>
            <thead>
              <tr>
                <th>Account</th>
                <th>Deposit Amount</th>
                <th>Cost (3% fee)</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {deposits.map((deposit) => (
                <tr key={deposit.id}>
                  <td>{deposit.account}</td>
                  <td>${deposit.amount.toFixed(2)}</td>
                  <td>${deposit.cost.toFixed(2)}</td>
                  <td>
                    <button 
                      onClick={() => handleDeleteDeposit(deposit.id)}
                      style={{ 
                        background: '#dc3545', 
                        color: 'white', 
                        border: 'none', 
                        padding: '5px 10px', 
                        borderRadius: '4px',
                        cursor: 'pointer'
                      }}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* TOTAL AND CHARGE BUTTON */}
      {deposits.length > 0 && (
        <div className="formSection" style={{ background: '#f8f9fa' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <div>
              <div style={{ fontSize: '14px', color: '#666' }}>Total Deposit: ${deposits.reduce((sum, d) => sum + d.amount, 0).toFixed(2)}</div>
              <div style={{ fontSize: '18px', fontWeight: 700, color: '#1e7e34' }}>
                Total Cost: ${deposits.reduce((sum, d) => sum + d.cost, 0).toFixed(2)}
              </div>
            </div>
            <button 
              className="submitBtn" 
              onClick={handleCharge}
              disabled={submitting}
            >
              {submitting ? 'Submitting...' : 'Submit Deposit Request'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
