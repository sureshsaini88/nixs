"use client";

import { useState, useEffect } from "react";
import { FiMaximize2, FiSearch, FiChevronDown } from "react-icons/fi";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useUser } from "../../../../contexts/UserContext";

const notificationData = [
  { label: "Pending Application", value: 0 },
  { label: "Pending Deposit", value: 0 },
  { label: "Pending Modify", value: 0 },
  { label: "Pending Share", value: 0 },
  { label: "Pending Transfer&Refund", value: 0 }
];

export default function GoogleAccountListPage() {
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useUser();

  useEffect(() => {
    fetchAccounts();
  }, []);

  const fetchAccounts = async () => {
    try {
      const token = localStorage.getItem('userToken');
      const response = await fetch('/api/user/accounts?platform=google', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        setAccounts(data);
      }
    } catch (error) {
      console.error('Error fetching accounts:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {/* NOTIFICATION CARDS */}
      <div className="notificationCards">
        {notificationData.map((item, index) => (
          <div key={index} className="notificationCard">
            <span className="cardLabel">{item.label}</span>
            <span className="cardValue">{item.value}</span>
          </div>
        ))}
      </div>

      {/* AD ACCOUNT LIST SECTION */}
      <div className="adAccountSection">
        <div className="sectionTitle">
          <span className="greenBar"></span>
          <h3>Google Ad Account List</h3>
        </div>

        {/* ACTION BUTTONS */}
        <div className="topActions" style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
          <Link href="/google/accountManage/applyGGCleanAd">
            <button className="greenBtn">
              <FiMaximize2 size={18} />
              Apply GG Clean Ad
            </button>
          </Link>
          <Link href="/google/accountManage/applyGGBHGHAd">
            <button className="greenBtn" style={{ background: '#dc3545' }}>
              <FiMaximize2 size={18} />
              Apply GG BH/GH Ad
            </button>
          </Link>
          <button className="searchBtn" style={{ padding: '10px', border: '1px solid #ddd', borderRadius: '6px', background: 'white', cursor: 'pointer' }}>
            <FiSearch size={18} />
          </button>
        </div>

        {/* TABLE */}
        <div className="tableWrap">
          <table>
            <thead>
              <tr>
                <th>License</th>
                <th>Ads Account ID</th>
                <th>Ads Account Name</th>
                <th>Ad Type</th>
                <th>Operate</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="5" style={{textAlign: 'center', padding: '20px'}}>Loading...</td></tr>
              ) : accounts.length === 0 ? (
                <tr><td colSpan="5" style={{textAlign: 'center', padding: '20px'}}>No accounts found</td></tr>
              ) : (
                accounts.map((account, index) => (
                  <tr key={index}>
                    <td>{account.license || '-'}</td>
                    <td>{account.ads_account_id || '-'}</td>
                    <td className="greenText">{account.ads_account_name || '-'}</td>
                    <td><span className="statusBadge pending">{account.ad_type || 'New'}</span></td>
                    <td className="operateLinks" style={{ color: '#1e7e34' }}>
                      <Link href="/google/financing/adsDeposit" style={{ color: '#1e7e34', textDecoration: 'none', cursor: 'pointer' }}>ad deposit</Link>
                    </td>
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
          <span className="totalText">Total {accounts.length}</span>
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
