"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { MdKeyboardArrowDown, MdSecurity, MdMenu } from "react-icons/md";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useUser } from "../../../contexts/UserContext";
import "./afterSales.css";

export default function RefundPage() {
  const [afterSaleOpen, setAfterSaleOpen] = useState(true);
  const [adAccount, setAdAccount] = useState('');
  const [refundAmount, setRefundAmount] = useState('');
  const [reason, setReason] = useState('');
  const [transactionId, setTransactionId] = useState('');
  const [refundHistory, setRefundHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [userAccounts, setUserAccounts] = useState([]);
  const pathname = usePathname();
  const { user, logout } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (user) {
      fetchRefundHistory();
      fetchUserAccounts();
    }
  }, [user]);

  const fetchUserAccounts = async () => {
    try {
      const token = localStorage.getItem('userToken');
      const response = await fetch('/api/user/accounts', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        setUserAccounts(data);
      }
    } catch (error) {
      console.error('Error fetching accounts:', error);
    }
  };

  const fetchRefundHistory = async () => {
    try {
      const token = localStorage.getItem('userToken');
      const response = await fetch('/api/refund-requests', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        setRefundHistory(data);
      }
    } catch (error) {
      console.error('Error fetching refund history:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!refundAmount || !reason) {
      alert('Please fill in all required fields');
      return;
    }

    setSubmitting(true);
    try {
      const token = localStorage.getItem('userToken');
      const response = await fetch('/api/refund-requests', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          refundAmount: parseFloat(refundAmount),
          reason,
          adAccountId: adAccount
        })
      });

      if (response.ok) {
        alert('Refund request submitted successfully');
        setAdAccount('');
        setRefundAmount('');
        setReason('');
        setTransactionId('');
        fetchRefundHistory();
      } else {
        const data = await response.json();
        alert(data.message || 'Failed to submit refund request');
      }
    } catch (error) {
      console.error('Error submitting refund request:', error);
      alert('Error submitting refund request');
    } finally {
      setSubmitting(false);
    }
  };

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  return (
    <div className="facebookLayout">
      {/* SIDEBAR */}
      <aside className="facebookSidebar">
        <div className="facebookLogoArea">
          <Image src="/facebook.png" alt="Facebook" width={60} height={60} />
        </div>

        {/* AfterSale */}
        <div
          className="sidebarItem active"
          onClick={() => setAfterSaleOpen(!afterSaleOpen)}
        >
          <MdSecurity size={20} />
          <span>AfterSale</span>
          <MdKeyboardArrowDown className={afterSaleOpen ? "rotate" : ""} />
        </div>

        {afterSaleOpen && (
          <div className="submenu">
            <Link href="/afterSales/refund" className={`submenuItem ${pathname === '/afterSales/refund' ? 'active' : ''}`}>
              Refund
            </Link>
            <Link href="/afterSales/transfer" className={`submenuItem ${pathname === '/afterSales/transfer' ? 'active' : ''}`}>
              Transfer
            </Link>
          </div>
        )}
      </aside>

      {/* MAIN CONTENT */}
      <div className="facebookMain">
        {/* NAVBAR */}
        <header className="facebookNavbar">
          <div className="navLeft">
            <MdMenu size={24} className="hamburgerIcon" />
            <Link href="/dashboard" className="homeText">Home</Link>
            
            <div className="navItem">
              <Image src="/facebook.png" width={20} height={20} alt="fb" />
              <span>Facebook</span>
            </div>

            <div className="navItem">
              <Image src="/google.png" width={20} height={20} alt="google" />
              <span>Google</span>
            </div>

            <div className="navItem">
              <Image src="/logo (2).png" width={20} height={20} alt="snapchat" />
              <span>Snapchat</span>
            </div>

            <div className="navItem">
              <Image src="/tik-tok.png" width={20} height={20} alt="tiktok" />
              <span>TikTok</span>
            </div>
          </div>

          <div className="navRight">
            <div className="balanceBox">
              <span className="dollarIcon">$</span>
              <span className="balanceAmount">${user?.balance || '0.00'}</span>
            </div>
            <div className="userDropdown">
              <span className="username">{user?.username}</span>
              <MdKeyboardArrowDown />
            </div>
          </div>
        </header>

        {/* CONTENT */}
        <div className="facebookContent">
          <div className="afterSalesPage">
            <div className="contentContainer">
              <h1 className="pageTitle">Refund Request</h1>
              
              {/* Refund Form */}
              <form className="formSection" onSubmit={handleSubmit}>
                <div className="formRow">
                  <label className="formLabel">Select Ad Account</label>
                  <select 
                    className="formSelect" 
                    value={adAccount} 
                    onChange={(e) => setAdAccount(e.target.value)}
                  >
                    <option value="">Select an ad account</option>
                    {userAccounts.map((account) => (
                      <option key={account.id} value={account.ads_account_id}>
                        {account.ads_account_name || account.ads_account_id}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="formRow">
                  <label className="formLabel">Refund Amount *</label>
                  <input 
                    type="number" 
                    className="formInput" 
                    placeholder="Enter refund amount" 
                    value={refundAmount}
                    onChange={(e) => setRefundAmount(e.target.value)}
                    required
                  />
                </div>

                <div className="formRow">
                  <label className="formLabel">Reason for Refund *</label>
                  <textarea 
                    className="formTextarea" 
                    placeholder="Please describe the reason for refund request"
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    required
                  ></textarea>
                </div>

                <div className="formRow">
                  <label className="formLabel">Transaction ID</label>
                  <input 
                    type="text" 
                    className="formInput" 
                    placeholder="Enter transaction ID" 
                    value={transactionId}
                    onChange={(e) => setTransactionId(e.target.value)}
                  />
                </div>

                <div className="formActions">
                  <button className="submitBtn" type="submit" disabled={submitting}>
                    {submitting ? 'Submitting...' : 'Submit Refund Request'}
                  </button>
                </div>
              </form>

              {/* Refund History */}
              <div className="historySection">
                <h2 className="sectionTitle">Refund History</h2>
                <div className="tableWrap">
                  <table>
                    <thead>
                      <tr>
                        <th>Request ID</th>
                        <th>Amount</th>
                        <th>Reason</th>
                        <th>Status</th>
                        <th>Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {refundHistory.length === 0 ? (
                        <tr>
                          <td colSpan="5" style={{textAlign: 'center', padding: '20px'}}>No refund records found</td>
                        </tr>
                      ) : (
                        refundHistory.map((request) => (
                          <tr key={request.id}>
                            <td>REF{request.id.toString().padStart(10, '0')}</td>
                            <td>${request.refund_amount}</td>
                            <td>{request.reason?.substring(0, 30) || '-'}{request.reason?.length > 30 ? '...' : ''}</td>
                            <td>
                              <span className={`statusBadge ${request.status}`}>{request.status}</span>
                            </td>
                            <td>{new Date(request.created_at).toLocaleString()}</td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>

          {/* FOOTER */}
          <div className="footerEnd">
            <div className="footer">
              Complaint and Suggestion:
              <span className="email"> cs@hdedu.net</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
