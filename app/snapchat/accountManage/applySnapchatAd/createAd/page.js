"use client";

import { useState, useEffect } from "react";
import { MdArrowBack } from "react-icons/md";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useUser } from "../../../../../contexts/UserContext";
import "./createAd.css";

const timezoneOptions = [
  "UTC +00:00 Africa/Abidjan",
  "UTC +00:00 Africa/Accra",
  "UTC +00:00 Africa/Casablanca",
  "UTC +01:00 Africa/Lagos",
  "UTC +01:00 Africa/Cairo",
  "UTC +01:00 Europe/London",
  "UTC +02:00 Europe/Paris",
  "UTC +02:00 Africa/Johannesburg",
  "UTC +03:00 Europe/Moscow",
  "UTC +03:00 Africa/Nairobi",
  "UTC +04:00 Asia/Dubai",
  "UTC +05:00 Asia/Karachi",
  "UTC +05:30 Asia/Kolkata",
  "UTC +06:00 Asia/Dhaka",
  "UTC +07:00 Asia/Bangkok",
  "UTC +08:00 Asia/Singapore",
  "UTC +08:00 Asia/Shanghai",
  "UTC +09:00 Asia/Tokyo",
  "UTC +10:00 Australia/Sydney",
  "UTC +12:00 Pacific/Auckland"
];

const depositOptions = [500, 1000, 1500, 2000, 2500, 3000, 4000, 5000, 6000, 7000, 8000, 9000, 10000];

export default function CreateSnapchatAdPage() {
  const [adNum, setAdNum] = useState(1);
  const [gmail, setGmail] = useState("");
  const [timezone, setTimezone] = useState("");
  const [depositAmount, setDepositAmount] = useState("");
  const [publicProfileName, setPublicProfileName] = useState("");
  const [publicProfileId, setPublicProfileId] = useState("");
  const [domain, setDomain] = useState("");
  const [hasDomain, setHasDomain] = useState(false);
  const [unlimitedDomain, setUnlimitedDomain] = useState(false);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  
  const { user: currentUser } = useUser();
  const router = useRouter();

  const handleSubmit = async () => {
    setError("");
    
    if (!adNum || adNum < 1) {
      setError("Please enter a valid ad number");
      return;
    }
    
    if (!gmail) {
      setError("Please enter a Gmail address");
      return;
    }
    
    if (!timezone) {
      setError("Please select a timezone");
      return;
    }
    
    if (!depositAmount) {
      setError("Please select a deposit amount");
      return;
    }
    
    if (!publicProfileName || !publicProfileId) {
      setError("Please enter public profile name and ID");
      return;
    }
    
    if (hasDomain && !unlimitedDomain && !domain) {
      setError("Please enter a domain or select unlimited domain");
      return;
    }
    
    if (currentUser?.balance < parseInt(depositAmount)) {
      setError(`Insufficient balance. You need $${depositAmount} but have $${currentUser?.balance || 0}. Please add money first.`);
      return;
    }
    
    setSubmitting(true);
    
    try {
      const token = localStorage.getItem('userToken');
      const formData = {
        platform: 'snapchat',
        ad_num: parseInt(adNum),
        gmail,
        timezone,
        deposit_amount: parseInt(depositAmount),
        public_profile_name: publicProfileName,
        public_profile_id: publicProfileId,
        has_domain: hasDomain,
        unlimited_domain: unlimitedDomain,
        domain: unlimitedDomain ? "" : domain
      };

      const response = await fetch('/api/snapchat/ad-applications', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        alert('Application submitted successfully! Pending admin approval.');
        router.push('/snapchat/accountManage/accountList');
      } else {
        const data = await response.json();
        alert(data.error || 'Failed to submit application');
      }
    } catch (error) {
      console.error('Error submitting:', error);
      alert('Error submitting application');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="createAdPage">
      <div className="contentContainer">
        <div className="formSection">
          <div className="sectionHeader">
            <label className="sectionLabel">* Ad Num</label>
            <input 
              type="number" 
              className="numberInput"
              value={adNum}
              onChange={(e) => setAdNum(parseInt(e.target.value) || 1)}
              min="1"
              placeholder="Enter number"
            />
          </div>
        </div>

        <div className="formSection">
          <label className="sectionLabel">* Ads Timezone</label>
          <select 
            className="selectInput fullWidth"
            value={timezone}
            onChange={(e) => setTimezone(e.target.value)}
          >
            <option value="">Please select timezone</option>
            {timezoneOptions.map((tz, idx) => (
              <option key={idx} value={tz}>{tz}</option>
            ))}
          </select>
        </div>

        <div className="formSection">
          <label className="sectionLabel">* Gmail</label>
          <input 
            type="email" 
            className="textInput fullWidth"
            placeholder="Enter email address"
            value={gmail}
            onChange={(e) => setGmail(e.target.value)}
          />
        </div>

        <div className="formSection">
          <label className="sectionLabel">* Ads Deposit Amount</label>
          <select 
            className="selectInput fullWidth"
            value={depositAmount}
            onChange={(e) => setDepositAmount(e.target.value)}
          >
            <option value="">Select deposit amount</option>
            {depositOptions.map(amount => (
              <option key={amount} value={amount}>${amount}</option>
            ))}
          </select>
        </div>

        <div className="formSection">
          <label className="sectionLabel">* Public Profile</label>
          <div className="formRowInline">
            <div className="inlineField">
              <input 
                type="text" 
                className="textInput fullWidth"
                placeholder="Enter profile name"
                value={publicProfileName}
                onChange={(e) => setPublicProfileName(e.target.value)}
              />
            </div>
            <div className="inlineField">
              <input 
                type="text" 
                className="textInput fullWidth"
                placeholder="Enter profile ID"
                value={publicProfileId}
                onChange={(e) => setPublicProfileId(e.target.value)}
              />
            </div>
          </div>
        </div>

        <div className="formSection">
          <div className="checkboxRow">
            <input 
              type="checkbox" 
              id="hasDomain"
              checked={hasDomain}
              onChange={(e) => {
                setHasDomain(e.target.checked);
                if (!e.target.checked) {
                  setUnlimitedDomain(false);
                  setDomain("");
                }
              }}
            />
            <label htmlFor="hasDomain">Has Domain</label>
          </div>
          
          {hasDomain && (
            <div className="domainSection">
              <div className="checkboxRow" style={{marginTop: '10px'}}>
                <input 
                  type="checkbox" 
                  id="unlimitedDomain"
                  checked={unlimitedDomain}
                  onChange={(e) => {
                    setUnlimitedDomain(e.target.checked);
                    if (e.target.checked) {
                      setDomain("");
                    }
                  }}
                />
                <label htmlFor="unlimitedDomain">Unlimited Domain</label>
              </div>
              
              {!unlimitedDomain && (
                <div className="formRow" style={{marginTop: '10px'}}>
                  <input 
                    type="text" 
                    className="textInput fullWidth"
                    placeholder="Enter domain"
                    value={domain}
                    onChange={(e) => setDomain(e.target.value)}
                  />
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="createAdFooter">
        <div className="totalsSection">
          <div className="totalRow">
            <span className="totalLabel">Total Deposit Of Ads:</span>
            <span className="totalValue">{depositAmount ? `$${depositAmount} USD` : '$0 USD'}</span>
          </div>
          <div className="totalRow">
            <span className="totalLabel">Total Cost:</span>
            <span className="totalValue">{depositAmount ? `$${depositAmount} USD` : '$0 USD'}</span>
          </div>
          <div className="totalRow">
            <span className="totalLabel">Wallet:</span>
            <span className="walletValue">${currentUser?.balance || '0.00'} USD</span>
          </div>
        </div>
        
        {error && (
          <div className="errorMessage">
            {error}
          </div>
        )}

        <div className="footerActions">
          <Link href="/snapchat/accountManage/applySnapchatAd">
            <button className="backBtn">
              <MdArrowBack size={18} />
              Back
            </button>
          </Link>
          <button 
            className="payBtn" 
            onClick={handleSubmit}
            disabled={submitting}
          >
            {submitting ? 'Submitting...' : 'Pay'}
          </button>
        </div>
      </div>
    </div>
  );
}
