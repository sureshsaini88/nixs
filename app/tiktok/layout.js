"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { FiChevronDown } from "react-icons/fi";
import { MdKeyboardArrowDown, MdAccountCircle, MdSecurity } from "react-icons/md";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useUser } from "../../contexts/UserContext";
import "./tiktok.css";

export default function TikTokLayout({ children }) {
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

  const isAccountManageActive = pathname?.startsWith('/tiktok/accountManage');
  const isFinancingActive = pathname?.startsWith('/tiktok/financing');
  const isAfterSaleActive = pathname?.startsWith('/tiktok/afterSales') || pathname?.startsWith('/afterSales');

  return (
    <div className="tiktokLayout">
      {/* SIDEBAR */}
      <aside className="tiktokSidebar">
        <div className="tiktokLogoArea">
          <Image src="/tik-tok.png" alt="TikTok" width={60} height={60} />
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
            <Link href="/tiktok/accountManage/accountList" className={`submenuItem ${pathname === '/tiktok/accountManage/accountList' ? 'active' : ''}`}>
              Account List
            </Link>
            <Link href="/tiktok/accountManage/applyTTAd" className={`submenuItem ${pathname === '/tiktok/accountManage/applyTTAd' ? 'active' : ''}`}>
              Apply TT Ad
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
            <Link href="/tiktok/financing/adsDeposit" className={`submenuItem ${pathname === '/tiktok/financing/adsDeposit' ? 'active' : ''}`}>
              Ads Deposit
            </Link>
            <Link href="/tiktok/financing/adsDepositRecord" className={`submenuItem ${pathname === '/tiktok/financing/adsDepositRecord' ? 'active' : ''}`}>
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
      <div className="tiktokMain">
        {/* NAVBAR */}
        <header className="tiktokNavbar">
          <div className="navLeft">
            <Link href="/dashboard" className="navItem">
              <Image src="/facebook.png" alt="Facebook" width={24} height={24} />
              <span>Facebook</span>
            </Link>
            <Link href="/google/accountManage/accountList" className="navItem">
              <Image src="/google.png" alt="Google" width={24} height={24} />
              <span>Google</span>
            </Link>
            <Link href="/snapchat/accountManage/accountList" className="navItem">
              <Image src="/logo (2).png" alt="Snapchat" width={24} height={24} />
              <span>Snapchat</span>
            </Link>
            <Link href="/tiktok/accountManage/accountList" className="navItem active">
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
        <div className="tiktokContent">
          {children}
        </div>
      </div>
    </div>
  );
}
