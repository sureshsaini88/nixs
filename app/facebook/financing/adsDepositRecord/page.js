"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { FiMaximize2, FiSearch } from "react-icons/fi";
import { MdKeyboardArrowDown, MdAccountCircle, MdSecurity, MdMenu } from "react-icons/md";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useUser } from "../../../../contexts/UserContext";
import "./adsDepositRecord.css";

export default function AdsDepositRecordPage() {
  const [accountManageOpen, setAccountManageOpen] = useState(false);
  const [financingOpen, setFinancingOpen] = useState(true);
  const [afterSaleOpen, setAfterSaleOpen] = useState(false);
  const [deposits, setDeposits] = useState([]);
  const [loading, setLoading] = useState(true);
  const pathname = usePathname();
  const { user, logout } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!user && !loading) {
      router.push('/login');
      return;
    }
    fetchDeposits();
  }, [user, loading]);

  const fetchDeposits = async () => {
    try {
      const token = localStorage.getItem('userToken');
      const response = await fetch('/api/ads-deposit-requests', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        setDeposits(data);
      }
    } catch (error) {
      console.error('Error fetching deposits:', error);
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
          className="sidebarItem"
          onClick={() => setAccountManageOpen(!accountManageOpen)}
        >
          <MdAccountCircle size={20} />
          <span>AccountManage</span>
          <MdKeyboardArrowDown className={accountManageOpen ? "rotate" : ""} />
        </div>

        {accountManageOpen && (
          <div className="submenu">
            <Link href="/facebook/accountManage/accountList" className="submenuItem">
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
          className="sidebarItem active"
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
            <Link href="/facebook/financing/adsDepositRecord" className="submenuItem active">
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
              <Image src="/facebook.png" width={20} height={20} alt="fb" />
              <span>Facebook</span>
              <MdKeyboardArrowDown />
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
          <div className="adsDepositRecordPage">
            <div className="contentContainer">
              
              {/* ACTION BUTTONS */}
              <div className="topActions">
                <button className="exportBtn">
                  <FiMaximize2 size={18} />
                  export excel
                </button>
                <button className="searchBtn">
                  <FiSearch size={18} />
                </button>
              </div>

              {/* TABLE */}
              <div className="tableWrap">
                <table>
                  <thead>
                    <tr>
                      <th>apply id</th>
                      <th>ads id</th>
                      <th>ads name</th>
                      <th>charge money</th>
                      <th>total cost</th>
                      <th>state</th>
                      <th>create time</th>
                    </tr>
                  </thead>

                  <tbody>
                    {loading ? (
                      <tr><td colSpan="7" style={{textAlign: 'center'}}>Loading...</td></tr>
                    ) : deposits.length === 0 ? (
                      <tr><td colSpan="7" style={{textAlign: 'center'}}>No records found</td></tr>
                    ) : (
                      deposits.map((item, index) => (
                        <tr key={item.id}>
                          <td className="greenText">DEP{item.id.toString().padStart(10, '0')}</td>
                          <td className="greenText">{item.ads_account_id}</td>
                          <td className="greenText">{item.ads_account_name}</td>
                          <td>{item.deposit_amount}</td>
                          <td className="greenText">{item.cost_amount}</td>
                          <td>
                            <span className={`stateBadge ${item.status}`}>
                              {item.status === 'approved' ? 'sent to ads' : item.status}
                            </span>
                          </td>
                          <td>{new Date(item.created_at).toLocaleString()}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
