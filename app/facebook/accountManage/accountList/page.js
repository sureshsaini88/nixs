"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { FiMaximize2, FiPlus, FiSearch, FiChevronDown } from "react-icons/fi";
import { MdKeyboardArrowDown, MdAccountCircle, MdSecurity, MdMenu } from "react-icons/md";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useUser } from "../../../../contexts/UserContext";
import "./facebook.css";

const notificationData = [
  { label: "Pending Application", value: 0 },
  { label: "Pending Deposit", value: 0 },
  { label: "Pending Modify", value: 0 },
  { label: "Pending Share", value: 0 },
  { label: "Pending Transfer&Refund", value: 0 }
];

export default function FacebookAccountListPage() {
  const [accountManageOpen, setAccountManageOpen] = useState(true);
  const [financingOpen, setFinancingOpen] = useState(false);
  const [afterSaleOpen, setAfterSaleOpen] = useState(false);
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showBmModal, setShowBmModal] = useState(false);
  const [bmAccount, setBmAccount] = useState(null);
  const [bmId, setBmId] = useState('');
  const [bmSubmitting, setBmSubmitting] = useState(false);
  const pathname = usePathname();
  const { user, logout } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!user && !loading) {
      router.push('/login');
      return;
    }
    fetchAccounts();
  }, [user, loading]);

  const fetchAccounts = async () => {
    try {
      const token = localStorage.getItem('userToken');
      const response = await fetch('/api/user/accounts?platform=facebook', {
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

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  const openBmModal = (account) => {
    setBmAccount(account);
    setBmId('');
    setShowBmModal(true);
  };

  const handleBmSubmit = async () => {
    if (!bmId.trim()) { alert('Please enter a BM ID'); return; }
    setBmSubmitting(true);
    try {
      const token = localStorage.getItem('userToken');
      const response = await fetch('/api/bm-share-requests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({
          ads_account_id: bmAccount.ads_account_id,
          ads_account_name: bmAccount.ads_account_name,
          bm_id: bmId.trim(),
        })
      });
      if (response.ok) {
        alert('BM Share request submitted successfully!');
        setShowBmModal(false);
        setBmId('');
      } else {
        alert('Failed to submit BM Share request');
      }
    } catch (error) {
      console.error('BM share error:', error);
      alert('Error submitting BM Share request');
    } finally {
      setBmSubmitting(false);
    }
  };

  return (
    <div className="facebookLayout">
      {/* SIDEBAR */}
      <aside className="facebookSidebar">
        <div className="facebookLogoArea">
          <Image src="/facebook.png" alt="Facebook" width={60} height={60} />
        </div>

        {/* AccountManage */}
        <div
          className="sidebarItem active"
          onClick={() => setAccountManageOpen(!accountManageOpen)}
        >
          <MdAccountCircle size={20} />
          <span>AccountManage</span>
          <MdKeyboardArrowDown className={accountManageOpen ? "rotate" : ""} />
        </div>

        {accountManageOpen && (
          <div className="submenu">
            <Link href="/facebook/accountManage/accountList" className="submenuItem active">
              Account List
            </Link>
            <Link href="/facebook/accountManage/applyNewAdAccount" className="submenuItem">
              Apply New Ad Account
            </Link>
            <Link href="/facebook/accountManage/bmShareLog" className="submenuItem">
              BM Share Log
            </Link>
          </div>
        )}

        {/* Financing */}
        <div
          className="sidebarItem"
          onClick={() => setFinancingOpen(!financingOpen)}
        >
          <MdSecurity size={20} />
          <span>Financing</span>
          <MdKeyboardArrowDown className={financingOpen ? "rotate" : ""} />
        </div>

        {financingOpen && (
          <div className="submenu">
            <Link href="/facebook/financing/adsDeposit" className="submenuItem">
              Ads Deposit
            </Link>
            <Link href="/facebook/financing/adsDepositRecord" className="submenuItem">
              Ads Deposit Record
            </Link>
          </div>
        )}

        {/* AfterSale */}
        <div
          className="sidebarItem"
          onClick={() => setAfterSaleOpen(!afterSaleOpen)}
        >
          <MdSecurity size={20} />
          <span>AfterSale</span>
          <MdKeyboardArrowDown className={afterSaleOpen ? "rotate" : ""} />
        </div>

        {afterSaleOpen && (
          <div className="submenu">
            <Link href="/afterSales/refund" className="submenuItem">Refund</Link>
            <Link href="/afterSales/transfer" className="submenuItem">Transfer</Link>
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
            
            <div className="navItem active">
              <Image src="/facebook.png" width={20} height={20} alt="facebook" />
              <span>Facebook</span>
            </div>

            <div className="navItem">
              <Image src="/google.png" width={20} height={20} alt="google" />
              <Link href="/google/accountManage/accountList"><span>Google</span></Link>
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
            <div className="userDropdown" style={{position:'relative'}} onClick={() => setShowUserMenu(!showUserMenu)}>
              <span className="username">{user?.username}</span>
              <MdKeyboardArrowDown />
              {showUserMenu && (
                <div style={{position:'absolute',top:'100%',right:0,background:'#fff',border:'1px solid #ddd',borderRadius:'6px',boxShadow:'0 2px 8px rgba(0,0,0,0.15)',zIndex:999,minWidth:'120px'}}>
                  <div onClick={handleLogout} style={{padding:'10px 16px',cursor:'pointer',color:'#dc3545',fontWeight:500}}>Logout</div>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* CONTENT */}
        <div className="facebookContent">
          {/* NOTIFICATION SECTION */}
          <div className="notificationSection">
            <div className="sectionTitle">
              <span className="greenBar"></span>
              <h3>Notification</h3>
            </div>
            
            <div className="notificationCards">
              {notificationData.map((item, index) => (
                <div key={index} className="notificationCard">
                  <span className="cardLabel">{item.label}</span>
                  <span className="cardValue">{item.value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* AD ACCOUNT LIST SECTION */}
          <div className="adAccountSection">
            <div className="sectionTitle">
              <span className="greenBar"></span>
              <h3>Ad Account List</h3>
            </div>

            {/* ACTION BUTTONS */}
            <div className="topActions">
              <Link href="/facebook/accountManage/applyNewAdAccount/createAd">
                <button className="greenBtn">
                  <FiMaximize2 size={18} />
                  create ad here
                </button>
              </Link>
              <button className="vipPackageBtn">
                vip package
              </button>
              <button className="searchBtn">
                <FiSearch size={18} />
              </button>
            </div>

            {/* TABLE */}
            <div className="adAccountTable">
              <table>
                <thead>
                  <tr>
                    <th>license</th>
                    <th>ads account id</th>
                    <th>ads account name</th>
                    <th>ad type</th>
                    <th>operate</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr><td colSpan="5" style={{textAlign: 'center'}}>Loading...</td></tr>
                  ) : accounts.length === 0 ? (
                    <tr><td colSpan="5" style={{textAlign: 'center'}}>No accounts found</td></tr>
                  ) : (
                    accounts.map((account, index) => (
                      <tr key={index}>
                        <td>{account.license}</td>
                        <td>{account.ads_account_id}</td>
                        <td className="greenText">{account.ads_account_name}</td>
                        <td><span className="adTypeBadge">{account.ad_type}</span></td>
                        <td className="operateLinks">
                          <span className="link" style={{cursor:'pointer'}} onClick={() => openBmModal(account)}>bm share</span>
                          <span className="divider">|</span>
                          <Link href="/facebook/financing/adsDeposit" className="link">ad deposit</Link>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* PAGINATION */}
            <div className="pagination">
              <div className="pageSize">
                <span>20/page</span>
                <FiChevronDown />
              </div>
              <span className="totalText">Total 4</span>
              <div className="pageNav">
                <button className="pageBtn">&lt;</button>
                <button className="pageBtn active">1</button>
                <button className="pageBtn">&gt;</button>
              </div>
              <div className="goToPage">
                <span>Go to</span>
                <input type="text" className="pageInput" defaultValue="1" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* BM SHARE MODAL */}
      {showBmModal && (
        <div style={{position:'fixed',inset:0,background:'rgba(0,0,0,0.5)',display:'flex',alignItems:'center',justifyContent:'center',zIndex:1000}} onClick={() => setShowBmModal(false)}>
          <div style={{background:'#fff',borderRadius:'10px',padding:'28px',minWidth:'360px',boxShadow:'0 8px 32px rgba(0,0,0,0.2)'}} onClick={(e) => e.stopPropagation()}>
            <h3 style={{marginBottom:'6px',fontSize:'16px',fontWeight:700}}>BM Share Request</h3>
            {bmAccount && (
              <p style={{fontSize:'13px',color:'#666',marginBottom:'18px'}}>
                Account: <strong>{bmAccount.ads_account_name}</strong> ({bmAccount.ads_account_id})
              </p>
            )}
            <div style={{marginBottom:'18px'}}>
              <label style={{display:'block',marginBottom:'6px',fontWeight:500,fontSize:'14px'}}>Enter BM ID</label>
              <input
                type="text"
                value={bmId}
                onChange={(e) => setBmId(e.target.value)}
                placeholder="e.g. 123456789012345"
                style={{width:'100%',padding:'10px',border:'1px solid #ddd',borderRadius:'6px',fontSize:'14px',boxSizing:'border-box'}}
                onKeyDown={(e) => e.key === 'Enter' && handleBmSubmit()}
                autoFocus
              />
            </div>
            <div style={{display:'flex',gap:'10px',justifyContent:'flex-end'}}>
              <button
                onClick={() => setShowBmModal(false)}
                style={{padding:'9px 20px',border:'1px solid #ddd',borderRadius:'6px',background:'#fff',cursor:'pointer',fontSize:'14px'}}
              >
                Cancel
              </button>
              <button
                onClick={handleBmSubmit}
                disabled={bmSubmitting}
                style={{padding:'9px 20px',border:'none',borderRadius:'6px',background:'#1e7e34',color:'#fff',cursor:'pointer',fontSize:'14px',fontWeight:600}}
              >
                {bmSubmitting ? 'Submitting...' : 'Submit'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
