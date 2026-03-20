"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { FiMaximize2, FiPlus, FiSearch } from "react-icons/fi";
import { MdClose } from "react-icons/md";
import { useUser } from "../../../contexts/UserContext";
import "./walletflow.css";

export default function WalletFlowPage() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [moneyRequests, setMoneyRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useUser();
  const [formData, setFormData] = useState({
    payway: "",
    charge: "",
    transactionId: "",
    picture: null
  });

  useEffect(() => {
    fetchMoneyRequests();
  }, []);

  const fetchMoneyRequests = async () => {
    try {
      const token = localStorage.getItem('userToken');
      const response = await fetch('/api/money-requests', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (response.ok) {
        const data = await response.json();
        setMoneyRequests(data);
      }
    } catch (error) {
      console.error('Error fetching money requests:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const token = localStorage.getItem('userToken');
      const submitData = new FormData();
      submitData.append('payway', formData.payway);
      submitData.append('charge_amount', formData.charge);
      submitData.append('transaction_id', formData.transactionId);
      if (formData.picture) {
        submitData.append('picture', formData.picture);
      }

      const response = await fetch('/api/money-requests', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: submitData
      });

      if (response.ok) {
        setIsDialogOpen(false);
        setFormData({ payway: "", charge: "", transactionId: "", picture: null });
        fetchMoneyRequests();
      } else {
        alert('Failed to submit request');
      }
    } catch (error) {
      console.error('Error submitting request:', error);
      alert('Failed to submit request');
    }
  };

  const getStatusBadge = (status) => {
    switch(status) {
      case 'pending':
        return <span className="statusBadge pending">Pending</span>;
      case 'approved':
        return <span className="statusBadge approved">Approved</span>;
      case 'rejected':
        return <span className="statusBadge rejected">Rejected</span>;
      default:
        return <span className="statusBadge">{status}</span>;
    }
  };

  return (
    <div className="walletFlowPage">

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
          <div className="dialogOverlay">
            <div className="dialogBox">
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
                    onChange={(e) => setFormData({...formData, payway: e.target.value})}
                    required
                  >
                    <option value="">Please select a payway</option>
                    <option value="USDT">USDT</option>
                    <option value="BTC">BTC</option>
                    <option value="ETH">ETH</option>
                  </select>
                </div>

                <div className="formRow">
                  <label>charge</label>
                  <input 
                    type="number" 
                    placeholder="Please input money"
                    value={formData.charge}
                    onChange={(e) => setFormData({...formData, charge: e.target.value})}
                    required
                  />
                </div>

                <div className="formRow">
                  <label>transactionId</label>
                  <input 
                    type="text" 
                    placeholder="Please input transaction id / TxID/ Internal Note"
                    value={formData.transactionId}
                    onChange={(e) => setFormData({...formData, transactionId: e.target.value})}
                    required
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
                  <button type="submit" className="confirmBtn">
                    Confirm
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
                <th>type</th>
                <th>apply id</th>
                <th>payway</th>
                <th>amount</th>
                <th>transaction id</th>
                <th>status</th>
                <th>create time</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr><td colSpan="7" style={{textAlign: 'center', padding: '20px'}}>Loading...</td></tr>
              ) : moneyRequests.length === 0 ? (
                <tr><td colSpan="7" style={{textAlign: 'center', padding: '20px'}}>No records found</td></tr>
              ) : (
                moneyRequests.map((item) => (
                  <tr key={item.id}>
                    <td>Wallet Charge</td>
                    <td className="greenText">REQ{item.id.toString().padStart(10, '0')}</td>
                    <td>{item.payway}</td>
                    <td className="greenText">+${item.charge_amount}</td>
                    <td>{item.transaction_id}</td>
                    <td>{getStatusBadge(item.status)}</td>
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
