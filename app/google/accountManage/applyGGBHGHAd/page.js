"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "../../../../contexts/UserContext";

const timezones = [
  { value: "UTC+00:00", label: "UTC +00:00 Africa/Abidjan" },
  { value: "UTC+01:00", label: "UTC +01:00 Europe/London" },
  { value: "UTC+02:00", label: "UTC +02:00 Europe/Paris" },
  { value: "UTC+03:00", label: "UTC +03:00 Europe/Moscow" },
  { value: "UTC+04:00", label: "UTC +04:00 Asia/Dubai" },
  { value: "UTC+05:00", label: "UTC +05:00 Asia/Karachi" },
  { value: "UTC+05:30", label: "UTC +05:30 Asia/Kolkata" },
  { value: "UTC+06:00", label: "UTC +06:00 Asia/Dhaka" },
  { value: "UTC+07:00", label: "UTC +07:00 Asia/Bangkok" },
  { value: "UTC+08:00", label: "UTC +08:00 Asia/Singapore" },
  { value: "UTC+09:00", label: "UTC +09:00 Asia/Tokyo" },
  { value: "UTC+10:00", label: "UTC +10:00 Australia/Sydney" },
  { value: "UTC+11:00", label: "UTC +11:00 Pacific/Noumea" },
  { value: "UTC+12:00", label: "UTC +12:00 Pacific/Auckland" },
  { value: "UTC-01:00", label: "UTC -01:00 Atlantic/Azores" },
  { value: "UTC-03:00", label: "UTC -03:00 America/Sao_Paulo" },
  { value: "UTC-04:00", label: "UTC -04:00 America/New_York" },
  { value: "UTC-05:00", label: "UTC -05:00 America/Chicago" },
  { value: "UTC-06:00", label: "UTC -06:00 America/Denver" },
  { value: "UTC-07:00", label: "UTC -07:00 America/Los_Angeles" },
  { value: "UTC-08:00", label: "UTC -08:00 America/Anchorage" },
  { value: "UTC-09:00", label: "UTC -09:00 Pacific/Gambier" },
  { value: "UTC-10:00", label: "UTC -10:00 Pacific/Honolulu" },
  { value: "UTC-11:00", label: "UTC -11:00 Pacific/Midway" },
  { value: "UTC-12:00", label: "UTC -12:00 Pacific/Wake" }
];

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

export default function ApplyGGBHGHAdPage() {
  const [adNum, setAdNum] = useState(1);
  const [timezone, setTimezone] = useState("UTC+00:00");
  const [gmail, setGmail] = useState("");
  const [depositAmount, setDepositAmount] = useState(500);
  const [targetMarket, setTargetMarket] = useState("");
  const [singleDomain, setSingleDomain] = useState(false);
  const [unlimitedDomain, setUnlimitedDomain] = useState(false);
  const [remarks, setRemarks] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const { user } = useUser();
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
          adType: 'BH/GH',
          adNum,
          timezone,
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
      <h1 className="pageTitle">Apply GG BH/GH Ad</h1>

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
          <label className="formLabel">Ads Timezone *</label>
          <select
            className="formSelect"
            value={timezone}
            onChange={(e) => setTimezone(e.target.value)}
            required
          >
            {timezones.map((tz) => (
              <option key={tz.value} value={tz.value}>
                {tz.label}
              </option>
            ))}
          </select>
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
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontWeight: 600, color: '#333' }}>Total Cost:</span>
            <span style={{ fontSize: '20px', fontWeight: 700, color: '#1e7e34' }}>
              ${(adNum * depositAmount).toLocaleString()}
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
