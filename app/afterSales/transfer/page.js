"use client";

import Image from "next/image";
import { useState } from "react";
import { MdKeyboardArrowDown, MdSecurity, MdMenu } from "react-icons/md";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useUser } from "../../../contexts/UserContext";
import "./afterSales.css";

export default function TransferPage() {
  const [afterSaleOpen, setAfterSaleOpen] = useState(true);
  const pathname = usePathname();
  const { user, logout } = useUser();
  const router = useRouter();

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
              <h1 className="pageTitle">Transfer Request</h1>
              
              {/* Transfer Form */}
              <div className="formSection">
                <div className="formRow">
                  <label className="formLabel">From Ad Account</label>
                  <select className="formSelect">
                    <option value="">Select source account</option>
                    <option value="account1">Account 1</option>
                    <option value="account2">Account 2</option>
                  </select>
                </div>

                <div className="formRow">
                  <label className="formLabel">To Ad Account</label>
                  <select className="formSelect">
                    <option value="">Select destination account</option>
                    <option value="account1">Account 1</option>
                    <option value="account2">Account 2</option>
                  </select>
                </div>

                <div className="formRow">
                  <label className="formLabel">Transfer Amount</label>
                  <input type="number" className="formInput" placeholder="Enter transfer amount" />
                </div>

                <div className="formRow">
                  <label className="formLabel">Transfer Reason</label>
                  <textarea className="formTextarea" placeholder="Please describe the reason for transfer"></textarea>
                </div>

                <div className="formActions">
                  <button className="submitBtn">Submit Transfer Request</button>
                </div>
              </div>

              {/* Transfer History */}
              <div className="historySection">
                <h2 className="sectionTitle">Transfer History</h2>
                <div className="tableWrap">
                  <table>
                    <thead>
                      <tr>
                        <th>Request ID</th>
                        <th>From Account</th>
                        <th>To Account</th>
                        <th>Amount</th>
                        <th>Status</th>
                        <th>Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td colSpan="6" style={{textAlign: 'center', padding: '20px'}}>No transfer records found</td>
                      </tr>
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
