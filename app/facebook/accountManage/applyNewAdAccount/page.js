"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { FiMaximize2, FiSearch } from "react-icons/fi";
import { MdKeyboardArrowDown, MdAccountCircle, MdSecurity, MdMenu } from "react-icons/md";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useUser } from "../../../../contexts/UserContext";
import "./apply.css";

export default function ApplyNewAdAccountPage() {
  const [accountManageOpen, setAccountManageOpen] = useState(true);
  const [financingOpen, setFinancingOpen] = useState(false);
  const [afterSaleOpen, setAfterSaleOpen] = useState(false);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const pathname = usePathname();
  const { user, logout } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!user && !loading) {
      router.push('/login');
      return;
    }
    fetchApplications();
  }, [user, loading]);

  const fetchApplications = async () => {
    try {
      const token = localStorage.getItem('userToken');
      const response = await fetch('/api/ad-applications', {
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
            <Link href="/facebook/accountManage/accountList" className="submenuItem">
              Account List
            </Link>
            <Link href="/facebook/accountManage/applyNewAdAccount" className="submenuItem active">
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
          <div className="applyPage">
            <div className="contentContainer">
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
              <div className="tableWrap">
                <table>
                  <thead>
                    <tr>
                      <th>apply id</th>
                      <th>license name</th>
                      <th>ads number</th>
                      <th>business type</th>
                      <th>business model</th>
                      <th>state</th>
                      <th>total cost</th>
                      <th>apply time</th>
                      <th>operate</th>
                    </tr>
                  </thead>

                  <tbody>
                    {loading ? (
                      <tr><td colSpan="9" style={{textAlign: 'center', padding: '20px'}}>Loading...</td></tr>
                    ) : applications.length === 0 ? (
                      <tr><td colSpan="9" style={{textAlign: 'center', padding: '20px'}}>No records found</td></tr>
                    ) : (
                      applications.map((item) => (
                        <tr key={item.id}>
                          <td className="greenText">APP{item.id.toString().padStart(10, '0')}</td>
                          <td>{item.license_name || '-'}</td>
                          <td>{item.ads_number || '-'}</td>
                          <td><span className="typeBadge">{item.business_type || '-'}</span></td>
                          <td>{item.business_model || '-'}</td>
                          <td>{getStatusBadge(item.status)}</td>
                          <td className="greenText">${item.total_cost || '0.00'}</td>
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
