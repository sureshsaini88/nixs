"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { FiSearch } from "react-icons/fi";
import { MdKeyboardArrowDown, MdAccountCircle, MdSecurity, MdMenu } from "react-icons/md";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useUser } from "../../../../contexts/UserContext";
import "./adsDeposit.css";

export default function AdsDepositPage() {
  const [accountManageOpen, setAccountManageOpen] = useState(false);
  const [financingOpen, setFinancingOpen] = useState(true);
  const [afterSaleOpen, setAfterSaleOpen] = useState(false);
  const [adAccount, setAdAccount] = useState("");
  const [money, setMoney] = useState("");
  const [deposits, setDeposits] = useState([]);
  const [userAccounts, setUserAccounts] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const pathname = usePathname();
  const { user, loading, logout } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!user && !loading) {
      router.push('/login');
      return;
    }
    fetchUserAccounts();
  }, [user, loading]);

  const fetchUserAccounts = async () => {
    try {
      const token = localStorage.getItem('userToken');
      const response = await fetch('/api/user/accounts?platform=facebook', {
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

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  const adAccountOptions = [
    { label: "D1910-Genyy adyvibe", value: "D1910-Genyy adyvibe", id: "646508544778178" },
    { label: "D1910-Cricket Pandit 2", value: "D1910-Cricket Pandit 2", id: "624787960448644" },
    { label: "D1910-MAYA Agency", value: "D1910-MAYA Agency", id: "663700219443429" },
    { label: "D1910-Adyvibe Ac1", value: "D1910-Adyvibe Ac1", id: "2163284074103109" }
  ];

  const handleAddDeposit = () => {
    if (adAccount && money) {
      const depositAmount = parseFloat(money) || 0;
      if (depositAmount < 100) {
        alert('Minimum deposit amount is $100');
        return;
      }
      const costAmount = depositAmount * 1.03; // 3% fee
      
      const selectedAccount = userAccounts.find(acc => acc.ads_account_name === adAccount);
      
      const newDeposit = {
        id: Date.now(),
        account: adAccount,
        accountId: selectedAccount?.ads_account_id || '',
        amount: depositAmount,
        cost: costAmount
      };
      
      setDeposits([...deposits, newDeposit]);
      setAdAccount("");
      setMoney("");
    }
  };

  const handleCharge = async () => {
    if (deposits.length === 0) {
      alert('Please add at least one deposit');
      return;
    }

    setSubmitting(true);
    try {
      const token = localStorage.getItem('userToken');
      const response = await fetch('/api/ads-deposit-requests', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ deposits })
      });

      if (response.ok) {
        alert('Deposit requests submitted! Pending admin approval.');
        setDeposits([]);
        router.push('/facebook/financing/adsDepositRecord');
      } else {
        alert('Failed to submit deposit requests');
      }
    } catch (error) {
      console.error('Error submitting:', error);
      alert('Error submitting deposit requests');
    } finally {
      setSubmitting(false);
    }
  };

  const totalDeposit = deposits.reduce((sum, deposit) => sum + deposit.amount, 0);
  const totalCost = deposits.reduce((sum, deposit) => sum + deposit.cost, 0);

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
            <Link href="/facebook/financing/adsDeposit" className="submenuItem active">
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
          <div className="adsDepositPage">
            <div className="contentContainer">
              
              {/* FORM SECTION */}
              <div className="depositForm">
                {deposits.map((deposit, index) => (
                  <div key={deposit.id} className="formRow">
                    <div className="formField">
                      <label className="fieldLabel">Ad Account</label>
                      <select 
                        className="selectInput"
                        value={deposit.account}
                        onChange={(e) => {
                          const updatedDeposits = [...deposits];
                          updatedDeposits[index].account = e.target.value;
                          setDeposits(updatedDeposits);
                        }}
                      >
                        <option value="">Please select ads account</option>
                        {userAccounts.map((account, idx) => (
                          <option key={idx} value={account.ads_account_name}>
                            {account.ads_account_name} ({account.ads_account_id})
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="formField">
                      <label className="fieldLabel">Money</label>
                      <input 
                        type="text" 
                        className="textInput"
                        placeholder="enter charge money"
                        value={deposit.amount}
                        onChange={(e) => {
                          const updatedDeposits = [...deposits];
                          const newAmount = parseFloat(e.target.value) || 0;
                          updatedDeposits[index].amount = newAmount;
                          updatedDeposits[index].cost = newAmount * 1.03;
                          setDeposits(updatedDeposits);
                        }}
                      />
                    </div>
                  </div>
                ))}
                
                {/* Add new empty row if no deposits exist */}
                {deposits.length === 0 && (
                  <div className="formRow">
                    <div className="formField">
                      <label className="fieldLabel">Ad Account</label>
                      <select 
                        className="selectInput"
                        value={adAccount}
                        onChange={(e) => setAdAccount(e.target.value)}
                      >
                        <option value="">Please select ads account</option>
                        {userAccounts.map((account, index) => (
                          <option key={index} value={account.ads_account_name}>
                            {account.ads_account_name} ({account.ads_account_id})
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="formField">
                      <label className="fieldLabel">Money</label>
                      <input 
                        type="text" 
                        className="textInput"
                        placeholder="enter charge money"
                        value={money}
                        onChange={(e) => setMoney(e.target.value)}
                      />
                    </div>
                  </div>
                )}

                <button className="addDepositBtn" onClick={handleAddDeposit}>
                  Add Ads Deposit
                </button>
              </div>

              {/* TOTALS SECTION */}
              <div className="totalsSection">
                <div className="totalRow">
                  <span className="totalLabel">Total Deposit Of Ads:</span>
                  <span className="totalValue">{totalDeposit.toFixed(2)} USD</span>
                </div>
                <div className="totalRow">
                  <span className="totalLabel">Total Cost:</span>
                  <span className="totalValue">{totalCost.toFixed(2)} USD</span>
                </div>
              </div>

              {/* CHARGE BUTTON */}
              <div className="chargeSection">
                <button 
                  className="chargeBtn" 
                  onClick={handleCharge}
                  disabled={submitting || userAccounts.length === 0}
                >
                  {submitting ? 'Submitting...' : (userAccounts.length === 0 ? 'No Accounts Available' : 'Charge')}
                </button>
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
