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
      const response = await fetch('/api/user/accounts', {
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
            <div className="userDropdown">
              <span className="username">{user?.username}</span>
              <MdKeyboardArrowDown />
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
                          <span className="link">bm share</span>
                          <span className="divider">|</span>
                          <span className="link">ad deposit</span>
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
