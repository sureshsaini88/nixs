"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { FiMaximize2, FiPlus, FiSearch, FiCopy } from "react-icons/fi";
import { MdClose } from "react-icons/md";
import { useUser } from "../../../contexts/UserContext";
import "./addmoney.css";

export default function AddMoneyPage() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useUser();
  const [formData, setFormData] = useState({
    payway: "",
    charge: "",
    transactionId: "",
    internalNote: "",
    picture: null
  });
  const [submitting, setSubmitting] = useState(false);
  const [walletSettings, setWalletSettings] = useState({});
  const [selectedWallet, setSelectedWallet] = useState(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    fetchRequests();
    fetchWalletSettings();
  }, []);

  const fetchRequests = async () => {
    try {
      const token = localStorage.getItem('userToken');
      const response = await fetch('/api/money-requests', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        setRequests(data);
      }
    } catch (error) {
      console.error('Error fetching requests:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchWalletSettings = async () => {
    try {
      const response = await fetch('/api/wallet-settings');
      if (response.ok) {
        const data = await response.json();
        const settingsObj = {};
        data.forEach(wallet => {
          settingsObj[wallet.coin_type] = wallet;
        });
        setWalletSettings(settingsObj);
      }
    } catch (error) {
      console.error('Error fetching wallet settings:', error);
    }
  };

  const handlePaywayChange = (payway) => {
    setFormData({...formData, payway});
    if (['USDT', 'BTC', 'ETH'].includes(payway)) {
      setSelectedWallet(walletSettings[payway] || null);
    } else {
      setSelectedWallet(null);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (Number(formData.charge) < 500) {
      alert('Minimum deposit amount is $500');
      return;
    }
    setSubmitting(true);

    try {
      const token = localStorage.getItem('userToken');
      
      // Create FormData for file upload
      const formDataToSend = new FormData();
      formDataToSend.append('payway', formData.payway);
      formDataToSend.append('charge', formData.charge);
      formDataToSend.append('transactionId', formData.transactionId);
      formDataToSend.append('internalNote', formData.internalNote);
      if (formData.picture) {
        formDataToSend.append('picture', formData.picture);
      }

      const response = await fetch('/api/money-requests', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: formDataToSend
      });

      if (response.ok) {
        setIsDialogOpen(false);
        setFormData({
          payway: "",
          charge: "",
          transactionId: "",
          internalNote: "",
          picture: null
        });
        fetchRequests();
      }
    } catch (error) {
      console.error('Error submitting request:', error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="addMoneyPage">

      {/* CONTENT CONTAINER */}
      <div className="contentContainer">

        {/* ACTION BUTTONS */}
        <div className="topActions">

          <button className="greenBtn" onClick={() => setIsDialogOpen(true)}>
            <FiMaximize2 size={18} />
            add money here
          </button>

          <button className="greenBtn">
            <FiMaximize2 size={18} />
            export excel
          </button>

          <button className="searchBtn">
            <FiSearch size={18} />
          </button>

        </div>

      {/* DIALOG BOX */}
      {isDialogOpen && (
        <div className="dialogOverlay" onClick={() => setIsDialogOpen(false)}>
          <div className="dialogBox" onClick={(e) => e.stopPropagation()}>
            <div className="dialogHeader">
              <div className="dialogTitle">
                <FiPlus className="dialogTitleIcon" size={20} />
                <h3>Add Money</h3>
              </div>
              <button className="closeBtn" onClick={() => setIsDialogOpen(false)}>
                <MdClose size={20} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit}>
              <div className="formRow">
                <label>payway</label>
                <select 
                  value={formData.payway} 
                  onChange={(e) => handlePaywayChange(e.target.value)}
                  required
                >
                  <option value="">Please select a payway</option>
                  <option value="USDT">USDT</option>
                  <option value="BTC">BTC</option>
                  <option value="ETH">ETH</option>
                </select>
              </div>

              {/* Show wallet address and QR code for crypto payments */}
              {selectedWallet && (
                <div className="walletInfoBox">
                  <div className="walletHeader">
                    <span className="walletCoin">{selectedWallet.coin_type}</span>
                    <span className="walletLabel">Payment Address</span>
                  </div>
                  
                  {selectedWallet.qr_code_url && (
                    <div className="qrCodeWrapper">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img 
                        src={selectedWallet.qr_code_url} 
                        alt={`${selectedWallet.coin_type} QR Code`}
                        width={150}
                        height={150}
                        className="qrCodeImage"
                        onError={(e) => {
                          e.target.style.display = 'none';
                        }}
                      />
                    </div>
                  )}
                  
                  <div className="walletAddressWrapper">
                    <code className="walletAddress">{selectedWallet.wallet_address}</code>
                    <button 
                      type="button" 
                      className="copyBtn"
                      onClick={() => copyToClipboard(selectedWallet.wallet_address)}
                      title="Copy address"
                    >
                      <FiCopy size={16} />
                      {copied ? 'Copied!' : 'Copy'}
                    </button>
                  </div>
                  
                  <p className="walletNote">
                    Please send {selectedWallet.coin_type} to this address and enter the transaction ID below.
                  </p>
                </div>
              )}

              <div className="formRow">
                <label>charge</label>
                <div className="chargeInputWrap">
                  <input
                    type="number"
                    placeholder=""
                    value={formData.charge}
                    onChange={(e) => setFormData({...formData, charge: e.target.value})}
                    min="500"
                    required
                    onFocus={(e) => e.currentTarget.parentElement.classList.add('showMinHint')}
                    onBlur={(e) => e.currentTarget.parentElement.classList.remove('showMinHint')}
                  />
                  <span className="minHint">min $500</span>
                </div>
              </div>

              <div className="formRow">
                <label>transactionId</label>
                <input 
                  type="text" 
                  placeholder="Please input transaction id / TxID"
                  value={formData.transactionId}
                  onChange={(e) => setFormData({...formData, transactionId: e.target.value})}
                  required
                />
              </div>

              <div className="formRow">
                <label>internal note</label>
                <input 
                  type="text" 
                  placeholder="Internal Note"
                  value={formData.internalNote}
                  onChange={(e) => setFormData({...formData, internalNote: e.target.value})}
                />
              </div>

              <div className="formRow">
                <label>picture</label>
                <div className="fileUploadBox" onClick={() => document.getElementById('fileInput').click()}>
                  <span className="uploadIcon"><FiPlus /></span>
                  {formData.picture && <span className="fileName">{formData.picture.name}</span>}
                </div>
                <input 
                  id="fileInput"
                  type="file" 
                  accept="image/*"
                  className="fileInput"
                  onChange={(e) => setFormData({...formData, picture: e.target.files[0]})}
                />
              </div>

              <div className="dialogActions">
                <button type="button" className="cancelBtn" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="confirmBtn" disabled={submitting}>
                  {submitting ? 'Submitting...' : 'Confirm'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

        {/* TABLE */}
      <div className="tableWrap">
        <table>
          <thead>
            <tr>
              <th>apply id</th>
              <th>charge money</th>
              <th>transaction id</th>
              <th>state</th>
              <th>image</th>
              <th>payway</th>
              <th>create time</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr><td colSpan="7" style={{textAlign: 'center'}}>Loading...</td></tr>
            ) : requests.length === 0 ? (
              <tr><td colSpan="7" style={{textAlign: 'center'}}>No records found</td></tr>
            ) : (
              requests.map((item, index) => (
                <tr key={item.id}>
                  <td className="greenText">REQ{item.id.toString().padStart(10, '0')}</td>
                  <td className="greenText">{item.charge_amount}</td>
                  <td className="greenText">{item.transaction_id}</td>
                  <td>
                    <span className={`status ${item.status}`}>{item.status}</span>
                  </td>
                  <td>
                    {item.screenshot_url && (
                      <Image
                        src={item.screenshot_url}
                        alt="screenshot"
                        width={30}
                        height={30}
                        style={{ objectFit: 'cover', borderRadius: '4px' }}
                      />
                    )}
                  </td>
                  <td className="greenText">{item.payway}</td>
                  <td>{new Date(item.created_at).toLocaleString()}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      </div>

    </div>
  );
}
