"use client";

import { useState, useEffect } from "react";
import { FiSearch, FiChevronDown } from "react-icons/fi";

export default function GmailSharedLogPage() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch gmail shared logs - placeholder for now
    setLoading(false);
  }, []);

  return (
    <div>
      <h1 className="pageTitle">Gmail Shared Log</h1>

      {/* NOTIFICATION CARDS */}
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

      {/* GMAIL SHARED LOG SECTION */}
      <div className="adAccountSection">
        <div className="sectionTitle">
          <span className="greenBar"></span>
          <h3>Gmail Shared Log</h3>
        </div>

        {/* ACTION BUTTONS */}
        <div className="topActions" style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
          <button className="searchBtn" style={{ padding: '10px', border: '1px solid #ddd', borderRadius: '6px', background: 'white', cursor: 'pointer' }}>
            <FiSearch size={18} />
          </button>
        </div>

        {/* TABLE */}
        <div className="tableWrap">
          <table>
            <thead>
              <tr>
                <th>Request ID</th>
                <th>Gmail Address</th>
                <th>Shared Date</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="5" style={{textAlign: 'center', padding: '20px'}}>Loading...</td></tr>
              ) : logs.length === 0 ? (
                <tr><td colSpan="5" style={{textAlign: 'center', padding: '20px'}}>No gmail shared logs found</td></tr>
              ) : (
                logs.map((log, index) => (
                  <tr key={index}>
                    <td>{log.id || '-'}</td>
                    <td>{log.gmail || '-'}</td>
                    <td>{log.sharedDate || '-'}</td>
                    <td><span className="statusBadge pending">{log.status || 'Pending'}</span></td>
                    <td style={{ color: '#1e7e34', cursor: 'pointer' }}>View Details</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* PAGINATION */}
        <div className="pagination" style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: '10px', marginTop: '20px' }}>
          <div className="pageSize" style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
            <span>20/page</span>
            <FiChevronDown />
          </div>
          <span className="totalText">Total {logs.length}</span>
          <div className="pageNav" style={{ display: 'flex', gap: '5px' }}>
            <button className="pageBtn" style={{ padding: '5px 10px', border: '1px solid #ddd', background: 'white', borderRadius: '4px' }}>&lt;</button>
            <button className="pageBtn active" style={{ padding: '5px 10px', border: '1px solid #1e7e34', background: '#1e7e34', color: 'white', borderRadius: '4px' }}>1</button>
            <button className="pageBtn" style={{ padding: '5px 10px', border: '1px solid #ddd', background: 'white', borderRadius: '4px' }}>&gt;</button>
          </div>
        </div>
      </div>
    </div>
  );
}
