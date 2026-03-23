"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { MdKeyboardArrowDown, MdAccountCircle, MdSecurity, MdMenu, MdArrowBack } from "react-icons/md";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useUser } from "../../../../../contexts/UserContext";
import "./createAd.css";

const businessModels = {
  clean: [
    "DTC (dropshipping, POD), clean product",
    "SaaS/App subscription promotion",
    "Education and training(language or Vocational skill)",
    "COD clean product",
    "game ads (like Angry Birds, not gambling)",
    "Others"
  ],
  grayHat: [
    "trademark product or copyright product",
    "Defective goods",
    "product related with health(like Medicines, aphrodisiac, breast enhancement, weight loss, height increase, hair growth)",
    "arbitrage",
    "sex related product/service",
    "Rewarded Ads",
    "teach run ads(like: how to using cloacking, how to circumvent policy)",
    "digital marketing(like: provide ads, help run ads)",
    "IPTV",
    "Others"
  ],
  blackHat: [
    "RMG (Real Money Gaming)",
    "Earn money online",
    "Job opportunity",
    "Financial services",
    "STOCK",
    "Forex",
    "Crypto",
    "Gambling",
    "Betting"
  ]
};

const depositOptions = [500, 1000, 1500, 2000, 2500, 3000, 4000, 5000, 6000, 7000, 8000, 9000, 10000];

export default function CreateAdPage() {
  const [accountManageOpen, setAccountManageOpen] = useState(true);
  const [financingOpen, setFinancingOpen] = useState(false);
  const [afterSaleOpen, setAfterSaleOpen] = useState(false);
  const [selectedModel, setSelectedModel] = useState('');
  const [error, setError] = useState('');
  const [pageNum, setPageNum] = useState(2);
  const [domainNum, setDomainNum] = useState(1);
  const [adNum, setAdNum] = useState(2);
  const [needUnlimitedDomain, setNeedUnlimitedDomain] = useState(false);
  const [licenseName, setLicenseName] = useState("");
  const [remarks, setRemarks] = useState("");
  const [pageUrls, setPageUrls] = useState(['', '']);
  const [domains, setDomains] = useState(['']);
  const [adAccounts, setAdAccounts] = useState([
    { name: '', timezone: '', deposit: '' },
    { name: '', timezone: '', deposit: '' }
  ]);
  const [submitting, setSubmitting] = useState(false);
  const pathname = usePathname();
  const { user: currentUser, logout, loading } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!currentUser && !loading) {
      router.push('/login');
    }
  }, [currentUser, loading]);

  const handlePageUrlChange = (index, value) => {
    const newUrls = [...pageUrls];
    newUrls[index] = value;
    setPageUrls(newUrls);
  };

  const handleDomainChange = (index, value) => {
    const newDomains = [...domains];
    newDomains[index] = value;
    setDomains(newDomains);
  };

  const handleAdAccountChange = (index, field, value) => {
    const newAccounts = [...adAccounts];
    newAccounts[index] = { ...newAccounts[index], [field]: field === 'deposit' ? parseInt(value) || 0 : value };
    setAdAccounts(newAccounts);
  };

  const handlePageNumChange = (value) => {
    const newNum = parseInt(value) || 1;
    setPageNum(newNum);
    setPageUrls(prev => {
      if (newNum > prev.length) {
        return [...prev, ...Array(newNum - prev.length).fill('')];
      }
      return prev.slice(0, newNum);
    });
  };

  const handleDomainNumChange = (value) => {
    const newNum = parseInt(value) || 1;
    setDomainNum(newNum);
    setDomains(prev => {
      if (newNum > prev.length) {
        return [...prev, ...Array(newNum - prev.length).fill('')];
      }
      return prev.slice(0, newNum);
    });
  };

  const handleAdNumChange = (value) => {
    const newNum = parseInt(value) || 1;
    setAdNum(newNum);
    setAdAccounts(prev => {
      if (newNum > prev.length) {
        return [...prev, ...Array(newNum - prev.length).fill({ name: '', timezone: '', deposit: '' })];
      }
      return prev.slice(0, newNum);
    });
  };

  const calculateTotalDeposit = () => {
    return adAccounts.reduce((total, account) => total + (parseInt(account.deposit) || 0), 0);
  };

  const handleSubmit = async () => {
    setError('');
    
    // Check balance first
    const totalDeposit = calculateTotalDeposit();
    if (currentUser?.balance < totalDeposit) {
      setError(`Insufficient balance. You need $${totalDeposit} but have $${currentUser?.balance || 0}. Please add money first.`);
      return;
    }
    
    if (!selectedModel) {
      setError('Please select a business model');
      return;
    }
    
    // Check all required fields
    const hasEmptyFields = adAccounts.some(acc => !acc.name || !acc.timezone || !acc.deposit);
    if (hasEmptyFields) {
      setError('Please fill in all ad account details');
      return;
    }
    
    setSubmitting(true);
    
    try {
      const token = localStorage.getItem('userToken');
      const formData = {
        businessModel: selectedModel,
        licenseName,
        pageNum,
        pageUrls,
        domainNum: needUnlimitedDomain ? 0 : domainNum,
        domains: needUnlimitedDomain ? [] : domains,
        adNum,
        adAccounts,
        remarks,
        needUnlimitedDomain
      };

      const response = await fetch('/api/ad-applications', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        alert('Application submitted successfully! Pending admin approval.');
        router.push('/facebook/accountManage/accountList');
      } else {
        alert('Failed to submit application');
      }
    } catch (error) {
      console.error('Error submitting:', error);
      alert('Error submitting application');
    } finally {
      setSubmitting(false);
    }
  };

  const renderPageUrlInputs = () => {
    const inputs = [];
    for (let i = 1; i <= pageNum; i++) {
      inputs.push(
        <div key={i} className="formRow">
          <label className="inputLabel">{i}.Page URL</label>
          <input 
            type="text" 
            className="textInput"
            placeholder="Please enter Page URL"
            value={pageUrls[i-1] || ''}
            onChange={(e) => handlePageUrlChange(i-1, e.target.value)}
          />
        </div>
      );
    }
    return inputs;
  };

  const renderDomainInputs = () => {
    if (needUnlimitedDomain) return null;
    const inputs = [];
    for (let i = 1; i <= domainNum; i++) {
      inputs.push(
        <div key={i} className="formRow">
          <label className="inputLabel">{i}.Domain</label>
          <input 
            type="text" 
            className="textInput"
            placeholder="Please enter a domain"
            value={domains[i-1] || ''}
            onChange={(e) => handleDomainChange(i-1, e.target.value)}
          />
        </div>
      );
    }
    return inputs;
  };

  const renderAdAccountForms = () => {
    const forms = [];
    for (let i = 1; i <= adNum; i++) {
      forms.push(
        <div key={i} className="adAccountForm">
          <div className="formRow">
            <label className="inputLabel">{i}.ads account name</label>
            <div className="inputWithPrefix">
              <span className="prefix">DN1910-</span>
              <input 
                type="text" 
                className="textInput withPrefix"
                placeholder="Please enter ads account name"
                value={adAccounts[i-1]?.name || ''}
                onChange={(e) => handleAdAccountChange(i-1, 'name', e.target.value)}
              />
            </div>
          </div>
          <div className="formRowInline">
            <div className="inlineField">
              <label className="inputLabel">{i}.timezone</label>
              <select 
                className="selectInput"
                value={adAccounts[i-1]?.timezone || ''}
                onChange={(e) => handleAdAccountChange(i-1, 'timezone', e.target.value)}
              >
                <option value="">Please select timezone</option>
                <option value="UTC+0">UTC+0</option>
                <option value="UTC+1">UTC+1</option>
                <option value="UTC+2">UTC+2</option>
                <option value="UTC+3">UTC+3</option>
                <option value="UTC+4">UTC+4</option>
                <option value="UTC+5">UTC+5</option>
                <option value="UTC+6">UTC+6</option>
                <option value="UTC+7">UTC+7</option>
                <option value="UTC+8">UTC+8</option>
              </select>
            </div>
            <div className="inlineField">
              <label className="inputLabel">{i}.deposit</label>
              <select
                className="selectInput"
                value={adAccounts[i-1]?.deposit || ''}
                onChange={(e) => handleAdAccountChange(i-1, 'deposit', e.target.value)}
              >
                <option value="">Select deposit amount</option>
                {depositOptions.map(amount => (
                  <option key={amount} value={amount}>${amount}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      );
    }
    return forms;
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
              <Link href="#" className="submenuItem">Refund & Transfer</Link>
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
              <span className="balanceAmount">${currentUser?.balance || '0.00'}</span>
            </div>
            <div className="userDropdown">
              <span className="username">{currentUser?.username}</span>
              <MdKeyboardArrowDown />
            </div>
          </div>
        </header>

        {/* CONTENT */}
        <div className="facebookContent">
          <div className="createAdPage">
            <div className="contentContainer">
              
              {/* BUSINESS MODEL SECTION */}
              <div className="formSection">
                <label className="sectionLabel">* business model</label>
                
                {/* Clean */}
                <div className="modelCategory">
                  <div className="categoryHeader clean">
                    <span className="categoryDot"></span>
                    <span className="categoryName">Clean</span>
                  </div>
                  <div className="modelOptions">
                    {businessModels.clean.map((option, idx) => (
                      <button 
                        key={idx}
                        className={`modelOption ${selectedModel === option ? 'selected' : ''}`}
                        onClick={() => setSelectedModel(option)}
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Gray Hat */}
                <div className="modelCategory">
                  <div className="categoryHeader grayHat">
                    <span className="categoryDot"></span>
                    <span className="categoryName">Gray Hat</span>
                  </div>
                  <div className="modelOptions">
                    {businessModels.grayHat.map((option, idx) => (
                      <button 
                        key={idx}
                        className={`modelOption ${selectedModel === option ? 'selected' : ''}`}
                        onClick={() => setSelectedModel(option)}
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Black Hat */}
                <div className="modelCategory">
                  <div className="categoryHeader blackHat">
                    <span className="categoryDot"></span>
                    <span className="categoryName">Black Hat</span>
                  </div>
                  <div className="modelOptions">
                    {businessModels.blackHat.map((option, idx) => (
                      <button 
                        key={idx}
                        className={`modelOption ${selectedModel === option ? 'selected' : ''}`}
                        onClick={() => setSelectedModel(option)}
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* LICENSE NAME */}
              <div className="formSection">
                <label className="sectionLabel">* The License name</label>
                <select 
                  className="selectInput fullWidth"
                  value={licenseName}
                  onChange={(e) => setLicenseName(e.target.value)}
                >
                  <option value="">select license mode</option>
                  <option value="license1">License 1</option>
                  <option value="license2">License 2</option>
                </select>
              </div>

              {/* PAGE NUM */}
              <div className="formSection">
                <div className="sectionHeader">
                  <label className="sectionLabel">* Page Num</label>
                  <input 
                    type="number" 
                    className="numberInput"
                    value={pageNum}
                    onChange={(e) => handlePageNumChange(e.target.value)}
                    min="1"
                  />
                </div>
                {renderPageUrlInputs()}
              </div>

              {/* DOMAIN */}
              <div className="formSection">
                <div className="sectionHeader">
                  <div className="checkboxRow">
                    <input 
                      type="checkbox" 
                      id="unlimitedDomain"
                      checked={needUnlimitedDomain}
                      onChange={(e) => setNeedUnlimitedDomain(e.target.checked)}
                    />
                    <label htmlFor="unlimitedDomain">Need Unlimited Domain</label>
                  </div>
                  {!needUnlimitedDomain && (
                    <>
                      <label className="sectionLabel">Domain Num</label>
                      <input 
                        type="number" 
                        className="numberInput"
                        value={domainNum}
                        onChange={(e) => handleDomainNumChange(e.target.value)}
                        min="1"
                      />
                    </>
                  )}
                </div>
                {!needUnlimitedDomain && renderDomainInputs()}
              </div>

              {/* AD NUM */}
              <div className="formSection">
                <div className="sectionHeader">
                  <label className="sectionLabel">* Ad Num</label>
                  <input 
                    type="number" 
                    className="numberInput"
                    value={adNum}
                    onChange={(e) => handleAdNumChange(e.target.value)}
                    min="1"
                  />
                </div>
                {renderAdAccountForms()}
              </div>

              {/* REMARKS */}
              <div className="formSection">
                <label className="sectionLabel">if you have special requirement ,please fill remark here:</label>
                <textarea 
                  className="remarkTextarea"
                  rows={4}
                  placeholder="Enter your remarks here..."
                  value={remarks}
                  onChange={(e) => setRemarks(e.target.value)}
                />
              </div>

            </div>
          </div>

          {/* FOOTER WITH TOTALS */}
          <div className="createAdFooter">
            <div className="totalsSection">
              <div className="totalRow">
                <span className="totalLabel">Total Deposit Of Ads:</span>
                <span className="totalValue">{calculateTotalDeposit()} USD</span>
              </div>
              <div className="totalRow">
                <span className="totalLabel">Total Cost:</span>
                <span className="totalValue">{(calculateTotalDeposit() * 1.03).toFixed(2)} USD</span>
              </div>
              <div className="totalRow">
                <span className="totalLabel">Wallet:</span>
                <span className="walletValue">${currentUser?.balance || '0.00'} USD</span>
              </div>
            </div>
            {error && (
              <div className="errorMessage" style={{color: '#dc3545', background: '#f8d7da', padding: '10px 15px', borderRadius: '6px', marginBottom: '15px', fontSize: '14px'}}>
                {error}
              </div>
            )}

            <div className="footerActions">
              <Link href="/facebook/accountManage/applyNewAdAccount">
                <button className="backBtn">
                  <MdArrowBack size={18} />
                  Back
                </button>
              </Link>
              <button 
                className="payBtn" 
                onClick={handleSubmit}
                disabled={submitting}
              >
                {submitting ? 'Submitting...' : 'Pay'}
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
