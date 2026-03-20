"use client";

import { useState, useEffect } from "react";
import { FiMaximize2, FiSearch } from "react-icons/fi";
import Link from "next/link";
import "./accountList.css";

export default function AccountListPage() {
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAccounts();
  }, []);

  const fetchAccounts = async () => {
    try {
      const token = localStorage.getItem('userToken');
      const response = await fetch('/api/tiktok/accounts', {
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

  const getStatusBadge = (status) => {
    switch(status) {
      case 'active':
        return <span className="stateBadge approved">Active</span>;
      case 'pending':
        return <span className="stateBadge pending">Pending</span>;
      case 'suspended':
        return <span className="stateBadge rejected">Suspended</span>;
      default:
        return <span className="stateBadge">{status}</span>;
    }
  };

  return (
    <div className="applyPage">
      <div className="contentContainer">
        <div className="topActions">
          <Link href="/tiktok/accountManage/applyTTAd/createAd">
            <button className="greenBtn">
              <FiMaximize2 size={18} />
              Apply TT Ad
            </button>
          </Link>
          <button className="vipPackageBtn">
            vip package
          </button>
          <button className="searchBtn">
            <FiSearch size={18} />
          </button>
        </div>

        <div className="tableWrap">
          <table>
            <thead>
              <tr>
                <th>Account ID</th>
                <th>Account Name</th>
                <th>Email</th>
                <th>Timezone</th>
                <th>Status</th>
                <th>Balance</th>
                <th>Created At</th>
                <th>Operate</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr><td colSpan="8" style={{textAlign: 'center', padding: '20px'}}>Loading...</td></tr>
              ) : accounts.length === 0 ? (
                <tr><td colSpan="8" style={{textAlign: 'center', padding: '20px'}}>No records found</td></tr>
              ) : (
                accounts.map((item) => (
                  <tr key={item.id}>
                    <td className="greenText">TT{item.id.toString().padStart(8, '0')}</td>
                    <td>{item.account_name || '-'}</td>
                    <td>{item.email || '-'}</td>
                    <td>{item.timezone || '-'}</td>
                    <td>{getStatusBadge(item.status)}</td>
                    <td className="greenText">${item.balance || '0.00'}</td>
                    <td>{new Date(item.created_at).toLocaleString()}</td>
                    <td className="operateLinks">
                      <span className="link">detail</span>
                      <span className="divider">|</span>
                      <span className="link">edit</span>
                    </td>
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
