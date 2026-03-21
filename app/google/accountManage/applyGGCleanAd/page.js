"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const depositOptions = [
  { value: 500, label: "$500" },
  { value: 1000, label: "$1,000" },
  { value: 1500, label: "$1,500" },
  { value: 2000, label: "$2,000" },
  { value: 2500, label: "$2,500" },
  { value: 3000, label: "$3,000" },
  { value: 3500, label: "$3,500" },
  { value: 4000, label: "$4,000" },
  { value: 4500, label: "$4,500" },
  { value: 5000, label: "$5,000" },
  { value: 6000, label: "$6,000" },
  { value: 7000, label: "$7,000" },
  { value: 8000, label: "$8,000" },
  { value: 9000, label: "$9,000" },
  { value: 10000, label: "$10,000" }
];

export default function ApplyGGCleanAdPage() {
  const [adNum, setAdNum] = useState(1);
  const [gmail, setGmail] = useState("");
  const [depositAmount, setDepositAmount] = useState(500);
  const [targetMarket, setTargetMarket] = useState("");
  const [singleDomain, setSingleDomain] = useState(false);
  const [unlimitedDomain, setUnlimitedDomain] = useState(false);
  const [remarks, setRemarks] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const router = useRouter();

  const handleUnlimitedDomainChange = (e) => {
    setUnlimitedDomain(e.target.checked);
    if (e.target.checked) {
      setSingleDomain(false);
    }
  };

  const handleSingleDomainChange = (e) => {
    setSingleDomain(e.target.checked);
    if (e.target.checked) {
      setUnlimitedDomain(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!gmail) {
      alert("Please enter a Gmail address");
      return;
    }

    setSubmitting(true);
    try {
      const token = localStorage.getItem('userToken');
      const response = await fetch('/api/google/ad-applications', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          adType: 'Clean',
          adNum,
          gmail,
          depositAmount,
          targetMarket,
          domainType: unlimitedDomain ? 'unlimited' : singleDomain ? 'single' : 'none',
          remarks,
          totalCost: adNum * depositAmount
        })
      });

      if (response.ok) {
        alert('Application submitted successfully');
        router.push('/google/accountManage/accountList');
      } else {
        const data = await response.json();
        alert(data.message || 'Failed to submit application');
      }
    } catch (error) {
      console.error('Error submitting application:', error);
      alert('Error submitting application');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <h1 className="pageTitle">Apply GG Clean Ad</h1>

      {/* Notification Cards */}
      <div className="notificationCards">
        <div className="notificationCard">
          <span className="cardLabel">Pending Application</span>
          <span className="cardValue">0</span>
        </div>
        <div className="notificationCard">
          <span className="cardLabel">Pending Deposit</span>
          <span className="cardValue">0</span>
        </div>
        <div className="notificationCard">
          <span className="cardLabel">Pending Modify</span>
          <span className="cardValue">0</span>
        </div>
        <div className="notificationCard">
          <span className="cardLabel">Pending Share</span>
          <span className="cardValue">0</span>
        </div>
        <div className="notificationCard">
          <span className="cardLabel">Pending Transfer&Refund</span>
          <span className="cardValue">0</span>
        </div>
      </div>

      {/* Application Form */}
      <form className="formSection" onSubmit={handleSubmit}>
        <div className="formRow">
          <label className="formLabel">Ad Number *</label>
          <input
            type="number"
            className="formInput"
            value={adNum}
            onChange={(e) => setAdNum(parseInt(e.target.value) || 1)}
            min={1}
            max={50}
            required
          />
        </div>

        <div className="formRow">
          <label className="formLabel">Gmail Address *</label>
          <input
            type="email"
            className="formInput"
            placeholder="Enter Gmail address"
            value={gmail}
            onChange={(e) => setGmail(e.target.value)}
            required
          />
        </div>

        <div className="formRow">
          <label className="formLabel">Target Market</label>
          <input
            type="text"
            className="formInput"
            placeholder="Enter target market (e.g., USA, UK, India)"
            value={targetMarket}
            onChange={(e) => setTargetMarket(e.target.value)}
          />
        </div>

        <div className="formRow">
          <label className="formLabel">Domain Options</label>
          <div style={{ display: 'flex', gap: '20px', marginTop: '8px' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={singleDomain}
                onChange={handleSingleDomainChange}
              />
              <span>Single Domain</span>
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={unlimitedDomain}
                onChange={handleUnlimitedDomainChange}
              />
              <span>Unlimited Domain</span>
            </label>
          </div>
        </div>

        <div className="formRow">
          <label className="formLabel">Remarks</label>
          <textarea
            className="formInput"
            placeholder="If you have special requirements, please fill remark here..."
            value={remarks}
            onChange={(e) => setRemarks(e.target.value)}
            rows={4}
            style={{ resize: 'vertical', minHeight: '80px' }}
          />
        </div>

        <div className="formRow">
          <label className="formLabel">Ads Deposit Amount *</label>
          <select
            className="formSelect"
            value={depositAmount}
            onChange={(e) => setDepositAmount(parseInt(e.target.value))}
            required
          >
            {depositOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <div className="formRow" style={{ background: '#f8f9fa', padding: '15px', borderRadius: '6px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <span style={{ fontWeight: 600, color: '#333' }}>Total Deposit Of Ads:</span>
            <span style={{ fontSize: '18px', fontWeight: 700, color: '#333' }}>
              ${(adNum * depositAmount).toLocaleString()}
            </span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontWeight: 600, color: '#333' }}>Total Cost:</span>
            <span style={{ fontSize: '20px', fontWeight: 700, color: '#1e7e34' }}>
              ${(adNum * depositAmount * 1.03).toFixed(2)}
            </span>
          </div>
        </div>

        <div className="formActions">
          <button 
            type="button" 
            className="submitBtn" 
            style={{ background: '#6c757d' }}
            onClick={() => router.back()}
          >
            Cancel
          </button>
          <button 
            type="submit" 
            className="submitBtn" 
            disabled={submitting}
          >
            {submitting ? 'Submitting...' : 'Submit Application'}
          </button>
        </div>
      </form>
    </div>
  );
}
