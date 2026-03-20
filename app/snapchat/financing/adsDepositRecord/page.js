"use client";

import { useState, useEffect } from "react";
import { FiSearch } from "react-icons/fi";
import { useUser } from "../../../../contexts/UserContext";
import "./adsDepositRecord.css";

export default function AdsDepositRecordPage() {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRecords();
  }, []);

  const fetchRecords = async () => {
    try {
      const token = localStorage.getItem('userToken');
      const response = await fetch('/api/snapchat/deposit-records', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (response.ok) {
        const data = await response.json();
        setRecords(data);
      }
    } catch (error) {
      console.error('Error fetching records:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    switch(status) {
      case 'completed':
        return <span className="stateBadge approved">Completed</span>;
      case 'pending':
        return <span className="stateBadge pending">Pending</span>;
      case 'failed':
        return <span className="stateBadge rejected">Failed</span>;
      default:
        return <span className="stateBadge">{status}</span>;
    }
  };

  return (
    <div className="recordPage">
      <h2 className="pageTitle">Ads Deposit Record</h2>
      
      <div className="searchBar">
        <input 
          type="text" 
          className="searchInput"
          placeholder="Search by account name or ID..."
        />
        <button className="searchBtn">
          <FiSearch size={18} />
        </button>
      </div>

      <div className="tableWrap">
        <table>
          <thead>
            <tr>
              <th>Record ID</th>
              <th>Account Name</th>
              <th>Account ID</th>
              <th>Amount</th>
              <th>Type</th>
              <th>Status</th>
              <th>Date</th>
              <th>Operate</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr><td colSpan="8" style={{textAlign: 'center', padding: '20px'}}>Loading...</td></tr>
            ) : records.length === 0 ? (
              <tr><td colSpan="8" style={{textAlign: 'center', padding: '20px'}}>No records found</td></tr>
            ) : (
              records.map((item) => (
                <tr key={item.id}>
                  <td className="greenText">SCREC{item.id.toString().padStart(8, '0')}</td>
                  <td>{item.account_name || '-'}</td>
                  <td>SC{item.account_id?.toString().padStart(8, '0') || '-'}</td>
                  <td className="greenText">${item.amount || '0.00'}</td>
                  <td><span className="typeBadge">{item.type || 'Deposit'}</span></td>
                  <td>{getStatusBadge(item.status)}</td>
                  <td>{new Date(item.created_at).toLocaleString()}</td>
                  <td className="operateLinks">
                    <span className="link">detail</span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="pagination">
        <span>Total {records.length} records</span>
      </div>
    </div>
  );
}
