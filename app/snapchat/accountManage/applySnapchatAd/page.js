"use client";

import { useState, useEffect } from "react";
import { FiMaximize2, FiSearch } from "react-icons/fi";
import Link from "next/link";
import "./applySnapchatAd.css";

export default function ApplySnapchatAdPage() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      const token = localStorage.getItem('userToken');
      const response = await fetch('/api/snapchat/ad-applications', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (response.ok) {
        const data = await response.json();
        setApplications(data);
      }
    } catch (error) {
      console.error('Error fetching applications:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    switch(status) {
      case 'pending':
        return <span className="stateBadge pending">Pending</span>;
      case 'approved':
        return <span className="stateBadge approved">Approved</span>;
      case 'rejected':
        return <span className="stateBadge rejected">Rejected</span>;
      default:
        return <span className="stateBadge">{status}</span>;
    }
  };

  return (
    <div className="applyPage">
      <div className="contentContainer">
        <div className="topActions">
          <Link href="/snapchat/accountManage/applySnapchatAd/createAd">
            <button className="greenBtn">
              <FiMaximize2 size={18} />
              Apply Snapchat Ad
            </button>
          </Link>
          <button className="vipPackageBtn">vip package</button>
          <button className="searchBtn"><FiSearch size={18} /></button>
        </div>

        <div className="tableWrap">
          <table>
            <thead>
              <tr>
                <th>apply id</th>
                <th>ad num</th>
                <th>gmail</th>
                <th>timezone</th>
                <th>public profile</th>
                <th>deposit amount</th>
                <th>domain</th>
                <th>state</th>
                <th>apply time</th>
                <th>operate</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="10" style={{textAlign: 'center', padding: '20px'}}>Loading...</td></tr>
              ) : applications.length === 0 ? (
                <tr><td colSpan="10" style={{textAlign: 'center', padding: '20px'}}>No records found</td></tr>
              ) : (
                applications.map((item) => (
                  <tr key={item.id}>
                    <td className="greenText">SCAPP{item.id.toString().padStart(8, '0')}</td>
                    <td>{item.ad_num || '-'}</td>
                    <td>{item.gmail || '-'}</td>
                    <td>{item.timezone || '-'}</td>
                    <td>{item.public_profile_name || '-'} ({item.public_profile_id || '-'})</td>
                    <td className="greenText">${item.deposit_amount || '0'}</td>
                    <td>{item.unlimited_domain ? 'Unlimited' : (item.domain || '-')}</td>
                    <td>{getStatusBadge(item.status)}</td>
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
