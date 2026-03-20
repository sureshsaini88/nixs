"use client";

import { useState, useEffect } from "react";
import { FiSearch, FiChevronDown } from "react-icons/fi";
import { useUser } from "../../../../contexts/UserContext";
import { useRouter } from "next/navigation";

export default function GoogleAdsDepositRecordPage() {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user, loading: userLoading } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!user && !userLoading) {
      router.push('/login');
      return;
    }
    fetchDepositRecords();
  }, [user, userLoading]);

  const fetchDepositRecords = async () => {
    try {
      const token = localStorage.getItem('userToken');
      const response = await fetch('/api/ads-deposit-requests', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        setRecords(data);
      }
    } catch (error) {
      console.error('Error fetching deposit records:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1 className="pageTitle">Google Ads Deposit Record</h1>

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

      {/* DEPOSIT RECORDS */}
      <div className="adAccountSection">
        <div className="sectionTitle">
          <span className="greenBar"></span>
          <h3>Deposit Records</h3>
        </div>

        {/* SEARCH */}
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
                <th>Ads Account</th>
                <th>Deposit Amount</th>
                <th>Cost (3% fee)</th>
                <th>Status</th>
                <th>Created</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="6" style={{textAlign: 'center', padding: '20px'}}>Loading...</td></tr>
              ) : records.length === 0 ? (
                <tr><td colSpan="6" style={{textAlign: 'center', padding: '20px'}}>No deposit records found</td></tr>
              ) : (
                records.map((record) => (
                  <tr key={record.id}>
                    <td>DEP{record.id.toString().padStart(10, '0')}</td>
                    <td>{record.ads_account_name || record.ads_account_id || '-'}</td>
                    <td>${record.deposit_amount || record.amount || '-'}</td>
                    <td>${record.cost_amount || record.cost || '-'}</td>
                    <td>
                      <span className={`statusBadge ${record.status || 'pending'}`}>
                        {record.status || 'pending'}
                      </span>
                    </td>
                    <td>{new Date(record.created_at).toLocaleString()}</td>
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
          <span className="totalText">Total {records.length}</span>
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
