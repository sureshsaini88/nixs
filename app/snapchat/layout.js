"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { FiChevronDown } from "react-icons/fi";
import { MdKeyboardArrowDown, MdAccountCircle, MdSecurity, MdMenu } from "react-icons/md";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useUser } from "../../contexts/UserContext";
import "./snapchat.css";

export default function SnapchatLayout({ children }) {
  const [accountManageOpen, setAccountManageOpen] = useState(true);
  const [financingOpen, setFinancingOpen] = useState(false);
  const [afterSaleOpen, setAfterSaleOpen] = useState(false);
  const pathname = usePathname();
  const { user, logout, loading } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!user && !loading) {
      router.push('/login');
    }
  }, [user, loading]);

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  const isAccountManageActive = pathname?.startsWith('/snapchat/accountManage');
  const isFinancingActive = pathname?.startsWith('/snapchat/financing');
  const isAfterSaleActive = pathname?.startsWith('/snapchat/afterSales') || pathname?.startsWith('/afterSales');

  return (
    <div className="snapchatLayout">
      {/* SIDEBAR */}
      <aside className="snapchatSidebar">
        <div className="snapchatLogoArea">
          <Image src="/logo (2).png" alt="Snapchat" width={60} height={60} />
        </div>

        {/* AccountManage */}
        <div
          className={`sidebarItem ${isAccountManageActive ? 'active' : ''}`}
          onClick={() => setAccountManageOpen(!accountManageOpen)}
        >
          <MdAccountCircle size={20} />
          <span>AccountManage</span>
          <MdKeyboardArrowDown className={accountManageOpen ? "rotate" : ""} />
        </div>

        {accountManageOpen && (
          <div className="submenu">
            <Link href="/snapchat/accountManage/accountList" className={`submenuItem ${pathname === '/snapchat/accountManage/accountList' ? 'active' : ''}`}>
              Account List
            </Link>
            <Link href="/snapchat/accountManage/applySnapchatAd" className={`submenuItem ${pathname === '/snapchat/accountManage/applySnapchatAd' ? 'active' : ''}`}>
              Apply Snapchat Ad
            </Link>
          </div>
        )}

        {/* Financing */}
        <div
          className={`sidebarItem ${isFinancingActive ? 'active' : ''}`}
          onClick={() => setFinancingOpen(!financingOpen)}
        >
          <MdSecurity size={20} />
          <span>Financing</span>
          <MdKeyboardArrowDown className={financingOpen ? "rotate" : ""} />
        </div>

        {financingOpen && (
          <div className="submenu">
            <Link href="/snapchat/financing/adsDeposit" className={`submenuItem ${pathname === '/snapchat/financing/adsDeposit' ? 'active' : ''}`}>
              Ads Deposit
            </Link>
            <Link href="/snapchat/financing/adsDepositRecord" className={`submenuItem ${pathname === '/snapchat/financing/adsDepositRecord' ? 'active' : ''}`}>
              Ads Deposit Record
            </Link>
          </div>
        )}

        {/* AfterSale */}
        <div
          className={`sidebarItem ${isAfterSaleActive ? 'active' : ''}`}
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
      <div className="snapchatMain">
        {/* NAVBAR */}
        <header className="snapchatNavbar">
          <div className="navLeft">
            <Link href="/dashboard" className="navItem">
              <Image src="/facebook.png" alt="Facebook" width={24} height={24} />
              <span>Facebook</span>
            </Link>
            <Link href="/google/accountManage/accountList" className="navItem">
              <Image src="/google.png" alt="Google" width={24} height={24} />
              <span>Google</span>
            </Link>
            <Link href="/snapchat/accountManage/accountList" className="navItem active">
              <Image src="/logo (2).png" alt="Snapchat" width={24} height={24} />
              <span>Snapchat</span>
            </Link>
            <Link href="/tiktok/accountManage/accountList" className="navItem">
              <Image src="/tik-tok.png" alt="TikTok" width={24} height={24} />
              <span>TikTok</span>
            </Link>
          </div>

          <div className="navRight">
            <div className="userInfo">
              <span className="balance">${user?.balance || '0.00'}</span>
              <div className="userDropdown">
                <span className="username">{user?.username}</span>
                <FiChevronDown size={16} />
                <div className="dropdownMenu">
                  <button onClick={handleLogout}>Logout</button>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* CONTENT */}
        <div className="snapchatContent">
          {children}
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
  );
}
