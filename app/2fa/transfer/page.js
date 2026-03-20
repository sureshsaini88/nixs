"use client";

import Image from "next/image";
import { useState } from "react";
import { MdKeyboardArrowDown, MdAccountCircle, MdSecurity, MdMenu } from "react-icons/md";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useUser } from "../../../contexts/UserContext";

export default function TransferPage() {
  const [twoFAOpen, setTwoFAOpen] = useState(true);
  const pathname = usePathname();
  const { user, logout } = useUser();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  return (
    <div className="dashboardLayout">
      {/* SIDEBAR */}
      <aside className="sidebar">
        <div className="logoArea">
          <Image src="/product_logo.png" alt="logo" width={80} height={80} />
        </div>

        <Link href="/dashboard" className="menuItem">
          Dashboard
        </Link>

        <Link href="/wallet-flow" className="menuItem">
          Wallet
        </Link>

        <div
          className={`menuItem ${pathname.startsWith('/2fa') ? 'active' : ''}`}
          onClick={() => setTwoFAOpen(!twoFAOpen)}
        >
          <MdSecurity size={20} />
          2FA Tool
          <MdKeyboardArrowDown className={twoFAOpen ? "rotate" : ""} />
        </div>

        {twoFAOpen && (
          <div className="submenuWrap">
            <Link href="/2fa/refund" className={`submenu ${pathname === '/2fa/refund' ? 'active' : ''}`}>Refund</Link>
            <Link href="/2fa/transfer" className={`submenu ${pathname === '/2fa/transfer' ? 'active' : ''}`}>Transfer</Link>
          </div>
        )}
      </aside>

      {/* MAIN CONTENT */}
      <div className="mainArea">
        <header className="navbar">
          <div className="navLeft">
            <div className="openSidebarBtn">
              <MdMenu size={28} />
            </div>
            <Link href="/dashboard" className="homeText">Home</Link>
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

        <div className="pageContent">
          <h1>2FA Tool - Transfer</h1>
          <p>Process transfers with two-factor authentication verification.</p>
          
          <div className="formSection" style={{marginTop: '20px', maxWidth: '500px'}}>
            <div className="formRow" style={{marginBottom: '15px'}}>
              <label style={{display: 'block', marginBottom: '5px', fontWeight: 500}}>Transfer Request ID</label>
              <input type="text" placeholder="Enter transfer request ID" style={{width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #ddd'}} />
            </div>
            
            <div className="formRow" style={{marginBottom: '15px'}}>
              <label style={{display: 'block', marginBottom: '5px', fontWeight: 500}}>2FA Code</label>
              <input type="text" placeholder="Enter 6-digit code" maxLength="6" style={{width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #ddd'}} />
            </div>
            
            <button style={{background: '#0eab79', color: 'white', border: 'none', padding: '12px 24px', borderRadius: '6px', cursor: 'pointer', fontWeight: 500}}>
              Verify & Process Transfer
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
