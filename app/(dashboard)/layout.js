"use client";

import Image from "next/image";
import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  MdDashboard,
  MdWallet,
  MdSecurity,
  MdKeyboardArrowDown,
  MdMenu,
  MdAdd
} from "react-icons/md";
import { useUser } from "../../contexts/UserContext";
import "./dashboard.css";

export default function DashboardLayout({ children }) {

  const [walletOpen, setWalletOpen] = useState(true);
  const [fbOpen, setFbOpen] = useState(false);
  const [userOpen, setUserOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const pathname = usePathname();
  const router = useRouter();
  const { user, loading, logout } = useUser();

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  return (
    <div className="dashboardLayout">

      {/* SIDEBAR */}
      <aside className={`sidebar ${!sidebarOpen ? 'closed' : ''}`}>

        <div className="logoArea">
          <Image src="/IMG_0907.png" alt="logo" width={120} height={120} />
        </div>

        <Link href="/dashboard" className={`menuItem ${pathname === '/dashboard' ? 'active' : ''}`}>
          <MdDashboard size={20} />
          Dashboard
        </Link>

        <div
          className="menuItem"
          onClick={() => setWalletOpen(!walletOpen)}
        >
          <MdWallet size={20} />
          Wallet
          <MdKeyboardArrowDown
            className={walletOpen ? "rotate" : ""}
          />
        </div>

        {walletOpen && (
          <div className="submenuWrap">
            <Link href="/add-money" className={`submenu ${pathname === '/add-money' ? 'active' : ''}`}>Add Money</Link>
            <Link href="/wallet-flow" className={`submenu ${pathname === '/wallet-flow' ? 'active' : ''}`}>Wallet Flow</Link>
          </div>
        )}

        <Link href="/2fa" className={`menuItem ${pathname.startsWith('/2fa') ? 'active' : ''}`}>
          <MdSecurity size={20} />
          2FA Tool
        </Link>

      </aside>

      {/* MAIN */}
      <div className="mainArea">

        {/* NAVBAR */}
        <header className="navbar">

          <div className="navLeft">

            <div className="openSidebarBtn" onClick={() => setSidebarOpen(!sidebarOpen)}>
              <MdMenu size={28} />
            </div>

            <Link href="/dashboard" className="homeText">Home</Link>

            <div className="navItem" onClick={() => window.location.href = '/facebook/accountManage/accountList'}>
              <Image src="/facebook.png" width={20} height={20} alt="facebook" />
              <span>Facebook</span>
            </div>

            <div className="navItem" onClick={() => window.location.href = '/google/accountManage/accountList'}>
              <Image src="/google.png" width={20} height={20} alt="google" />
              <span>Google</span>
            </div>

            <div className="navItem" onClick={() => window.location.href = '/snapchat/accountManage/accountList'}>
              <Image src="/logo (2).png" width={20} height={20} alt="snapchat" />
              <span>Snapchat</span>
            </div>

            <div className="navItem" onClick={() => window.location.href = '/tiktok/accountManage/accountList'}>
              <Image src="/tik-tok.png" width={20} height={20} alt="tiktok" />
              <span>TikTok</span>
            </div>

          </div>

          <div className="navRight">

            <div className="balanceBox">
              <span className="dollarIcon">$</span>
              <span className="balanceAmount">${loading ? '0.00' : (user?.balance ?? '0.00')}</span>
              <Link href="/add-money" className="addMoneyBtn" title="Add Money">
                <MdAdd size={20} />
              </Link>
            </div>

            {/* USER DROPDOWN */}
            <div
              className="navDropdown username"
              onClick={() => setUserOpen(!userOpen)}
            >
              <span className="username">{loading ? 'Loading...' : user?.username}</span> <MdKeyboardArrowDown />
              {userOpen && (
                <div className="dropdownMenu">
                  <div>Profile</div>
                  <div onClick={handleLogout}>Logout</div>
                </div>
              )}
            </div>

          </div>
        </header>

        <div className="pageContent">
          {children}

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
