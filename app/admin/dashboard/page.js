"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { MdDashboard, MdPeople, MdAdd, MdEdit, MdDelete, MdLogout, MdAttachMoney, MdAssignment } from "react-icons/md";
import "./admin.css";

export default function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [moneyRequests, setMoneyRequests] = useState([]);
  const [adApplications, setAdApplications] = useState([]);
  const [adsDepositRequests, setAdsDepositRequests] = useState([]);
  const [refundRequests, setRefundRequests] = useState([]);
  const [googleAdApplications, setGoogleAdApplications] = useState([]);
  const [snapchatAdApplications, setSnapchatAdApplications] = useState([]);
  const [tiktokAdApplications, setTiktokAdApplications] = useState([]);
  const [walletSettings, setWalletSettings] = useState([]);
  const [walletFormData, setWalletFormData] = useState({
    coin_type: '',
    wallet_address: '',
    qr_code_url: ''
  });
  const [activeTab, setActiveTab] = useState('users');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showAddAccountForm, setShowAddAccountForm] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [editingUser, setEditingUser] = useState(null);
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    license: '',
    ads_account_id: '',
    ads_account_name: '',
    ad_type: '',
    operate: ''
  });
  const [accountFormData, setAccountFormData] = useState({
    license: '',
    ads_account_id: '',
    ads_account_name: '',
    ad_type: 'New',
    operate: 'bm share | ad deposit'
  });
  const router = useRouter();

  const fetchTiktokAdApplications = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch('/api/admin/tiktok-ad-applications', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        setTiktokAdApplications(data);
      } else if (response.status === 401) {
        router.push('/admin/login');
      }
    } catch (error) {
      console.error('Error fetching TikTok ad applications:', error);
    }
  };

  useEffect(() => {
    checkAuth();
    fetchUsers();
    fetchMoneyRequests();
    fetchAdApplications();
    fetchAdsDepositRequests();
    fetchRefundRequests();
    fetchGoogleAdApplications();
    fetchSnapchatAdApplications();
    fetchTiktokAdApplications();
  }, []);

  const checkAuth = () => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      router.push('/admin/login');
      return;
    }

    // Verify token is valid (basic check)
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      if (payload.role !== 'admin') {
        router.push('/admin/login');
      }
    } catch (error) {
      router.push('/admin/login');
    }
  };

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch('/api/admin/users', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        setUsers(data);
      } else if (response.status === 401) {
        router.push('/admin/login');
      }
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const handleCreateUser = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch('/api/admin/users', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        setShowCreateForm(false);
        setFormData({
          username: '',
          password: '',
          license: '',
          ads_account_id: '',
          ads_account_name: '',
          ad_type: '',
          operate: ''
        });
        fetchUsers();
      } else if (response.status === 401) {
        router.push('/admin/login');
      }
    } catch (error) {
      console.error('Error creating user:', error);
    }
  };

  const handleLogout = async () => {
    // Clear cookie via API
    try {
      await fetch('/api/logout', { method: 'POST' });
    } catch (error) {
      console.error('Error clearing cookie:', error);
    }
    localStorage.removeItem('adminToken');
    router.push('/admin/login');
  };

  const fetchMoneyRequests = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch('/api/admin/money-requests', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        setMoneyRequests(data);
      } else if (response.status === 401) {
        router.push('/admin/login');
      }
    } catch (error) {
      console.error('Error fetching money requests:', error);
    }
  };

  const handleApprove = async (requestId) => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch('/api/admin/money-requests', {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ requestId, status: 'approved' })
      });

      if (response.ok) {
        // Fetch both requests and users immediately to update balance
        await Promise.all([fetchMoneyRequests(), fetchUsers()]);
        // Force a re-render by switching to users tab temporarily if needed
        if (activeTab === 'users') {
          // Already on users tab, data should be fresh
        }
      } else {
        const data = await response.json();
        alert(data.message || 'Failed to approve request');
      }
    } catch (error) {
      console.error('Error approving request:', error);
      alert('Error approving request');
    }
  };

  const handleReject = async (requestId) => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch('/api/admin/money-requests', {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ requestId, status: 'rejected' })
      });

      if (response.ok) {
        fetchMoneyRequests();
      }
    } catch (error) {
      console.error('Error rejecting request:', error);
    }
  };

  const fetchAdApplications = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch('/api/admin/ad-applications', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        setAdApplications(data);
      } else if (response.status === 401) {
        router.push('/admin/login');
      }
    } catch (error) {
      console.error('Error fetching ad applications:', error);
    }
  };

  const handleApproveAdApp = async (appId) => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch('/api/admin/ad-applications', {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ applicationId: appId, status: 'approved' })
      });

      if (response.ok) {
        fetchAdApplications();
        fetchUsers();
      }
    } catch (error) {
      console.error('Error approving application:', error);
    }
  };

  const handleRejectAdApp = async (appId) => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch('/api/admin/ad-applications', {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ applicationId: appId, status: 'rejected' })
      });

      if (response.ok) {
        fetchAdApplications();
      }
    } catch (error) {
      console.error('Error rejecting application:', error);
    }
  };

  const fetchAdsDepositRequests = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch('/api/admin/ads-deposit-requests', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        setAdsDepositRequests(data);
      } else if (response.status === 401) {
        router.push('/admin/login');
      }
    } catch (error) {
      console.error('Error fetching ads deposit requests:', error);
    }
  };

  const handleApproveAdsDeposit = async (requestId) => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch('/api/admin/ads-deposit-requests', {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ requestId, status: 'approved' })
      });

      if (response.ok) {
        fetchAdsDepositRequests();
        fetchUsers();
      }
    } catch (error) {
      console.error('Error approving ads deposit:', error);
    }
  };

  const handleRejectAdsDeposit = async (requestId) => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch('/api/admin/ads-deposit-requests', {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ requestId, status: 'rejected' })
      });

      if (response.ok) {
        fetchAdsDepositRequests();
      }
    } catch (error) {
      console.error('Error rejecting ads deposit:', error);
    }
  };

  const handleDeleteAdAccount = async (accountId) => {
    if (!confirm('Are you sure you want to delete this ad account?')) {
      return;
    }
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`/api/admin/ad-accounts?id=${accountId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.ok) {
        fetchUsers();
      } else {
        alert('Failed to delete ad account');
      }
    } catch (error) {
      console.error('Error deleting ad account:', error);
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!confirm('Are you sure you want to delete this user? This will delete all their data including accounts and requests.')) {
      return;
    }
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`/api/admin/users?id=${userId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.ok) {
        fetchUsers();
      } else {
        alert('Failed to delete user');
      }
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  const fetchRefundRequests = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch('/api/admin/refund-requests', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        setRefundRequests(data);
      } else if (response.status === 401) {
        router.push('/admin/login');
      }
    } catch (error) {
      console.error('Error fetching refund requests:', error);
    }
  };

  const handleApproveRefund = async (requestId) => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch('/api/admin/refund-requests', {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ requestId, status: 'approved' })
      });

      if (response.ok) {
        fetchRefundRequests();
        fetchUsers();
      }
    } catch (error) {
      console.error('Error approving refund:', error);
    }
  };

  const handleRejectRefund = async (requestId) => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch('/api/admin/refund-requests', {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ requestId, status: 'rejected' })
      });

      if (response.ok) {
        fetchRefundRequests();
      }
    } catch (error) {
      console.error('Error rejecting refund:', error);
    }
  };

  const openAddAccountForm = (userId) => {
    setSelectedUserId(userId);
    setShowAddAccountForm(true);
  };

  const handleCreateAdAccount = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch('/api/admin/ad-accounts', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          userId: selectedUserId,
          ...accountFormData
        })
      });

      if (response.ok) {
        setShowAddAccountForm(false);
        setAccountFormData({
          license: '',
          ads_account_id: '',
          ads_account_name: '',
          ad_type: 'New',
          operate: 'bm share | ad deposit'
        });
        fetchUsers();
      } else if (response.status === 401) {
        router.push('/admin/login');
      }
    } catch (error) {
      console.error('Error creating ad account:', error);
    }
  };

  const fetchGoogleAdApplications = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch('/api/admin/google-ad-applications', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        setGoogleAdApplications(data);
      } else if (response.status === 401) {
        router.push('/admin/login');
      }
    } catch (error) {
      console.error('Error fetching Google ad applications:', error);
    }
  };

  const handleApproveGoogleAdApp = async (applicationId) => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch('/api/admin/google-ad-applications', {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ applicationId, status: 'approved' })
      });

      if (response.ok) {
        fetchGoogleAdApplications();
        fetchUsers();
      } else {
        const data = await response.json();
        alert(data.message || 'Failed to approve application');
      }
    } catch (error) {
      console.error('Error approving Google ad application:', error);
    }
  };

  const handleRejectGoogleAdApp = async (applicationId) => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch('/api/admin/google-ad-applications', {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ applicationId, status: 'rejected' })
      });

      if (response.ok) {
        fetchGoogleAdApplications();
      }
    } catch (error) {
      console.error('Error rejecting Google ad application:', error);
    }
  };

  const fetchSnapchatAdApplications = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch('/api/admin/snapchat-ad-applications', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        setSnapchatAdApplications(data);
      } else if (response.status === 401) {
        router.push('/admin/login');
      }
    } catch (error) {
      console.error('Error fetching Snapchat ad applications:', error);
    }
  };

  const handleApproveSnapchatAdApp = async (applicationId) => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch('/api/admin/snapchat-ad-applications', {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ applicationId, status: 'approved' })
      });

      if (response.ok) {
        fetchSnapchatAdApplications();
        fetchUsers();
      } else {
        const data = await response.json();
        alert(data.message || 'Failed to approve application');
      }
    } catch (error) {
      console.error('Error approving Snapchat ad application:', error);
    }
  };

  const handleRejectSnapchatAdApp = async (applicationId) => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch('/api/admin/snapchat-ad-applications', {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ applicationId, status: 'rejected' })
      });

      if (response.ok) {
        fetchSnapchatAdApplications();
      }
    } catch (error) {
      console.error('Error rejecting Snapchat ad application:', error);
    }
  };

  const handleApproveTiktokAdApp = async (applicationId) => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch('/api/admin/tiktok-ad-applications', {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ applicationId, status: 'approved' })
      });

      if (response.ok) {
        fetchTiktokAdApplications();
        fetchUsers();
      } else {
        const data = await response.json();
        alert(data.message || 'Failed to approve application');
      }
    } catch (error) {
      console.error('Error approving TikTok ad application:', error);
    }
  };

  const handleRejectTiktokAdApp = async (applicationId) => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch('/api/admin/tiktok-ad-applications', {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ applicationId, status: 'rejected' })
      });

      if (response.ok) {
        fetchTiktokAdApplications();
      }
    } catch (error) {
      console.error('Error rejecting TikTok ad application:', error);
    }
  };

  const handleDeleteMoneyRequest = async (requestId) => {
    if (!confirm('Are you sure you want to delete this money request?')) {
      return;
    }
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`/api/admin/money-requests?id=${requestId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.ok) {
        fetchMoneyRequests();
      } else {
        alert('Failed to delete money request');
      }
    } catch (error) {
      console.error('Error deleting money request:', error);
    }
  };

  const handleDeleteAdApplication = async (appId) => {
    if (!confirm('Are you sure you want to delete this ad application?')) {
      return;
    }
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`/api/admin/ad-applications?id=${appId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.ok) {
        fetchAdApplications();
      } else {
        alert('Failed to delete ad application');
      }
    } catch (error) {
      console.error('Error deleting ad application:', error);
    }
  };

  const handleDeleteAdsDeposit = async (requestId) => {
    if (!confirm('Are you sure you want to delete this ads deposit request?')) {
      return;
    }
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`/api/admin/ads-deposit-requests?id=${requestId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.ok) {
        fetchAdsDepositRequests();
      } else {
        alert('Failed to delete ads deposit request');
      }
    } catch (error) {
      console.error('Error deleting ads deposit request:', error);
    }
  };

  const handleDeleteRefund = async (requestId) => {
    if (!confirm('Are you sure you want to delete this refund request?')) {
      return;
    }
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`/api/admin/refund-requests?id=${requestId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.ok) {
        fetchRefundRequests();
      } else {
        alert('Failed to delete refund request');
      }
    } catch (error) {
      console.error('Error deleting refund request:', error);
    }
  };

  const handleDeleteGoogleAdApp = async (appId) => {
    if (!confirm('Are you sure you want to delete this Google ad application?')) {
      return;
    }
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`/api/admin/google-ad-applications?id=${appId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.ok) {
        fetchGoogleAdApplications();
      } else {
        alert('Failed to delete Google ad application');
      }
    } catch (error) {
      console.error('Error deleting Google ad application:', error);
    }
  };

  const handleDeleteSnapchatAdApp = async (appId) => {
    if (!confirm('Are you sure you want to delete this Snapchat ad application?')) {
      return;
    }
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`/api/admin/snapchat-ad-applications?id=${appId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.ok) {
        fetchSnapchatAdApplications();
      } else {
        alert('Failed to delete Snapchat ad application');
      }
    } catch (error) {
      console.error('Error deleting Snapchat ad application:', error);
    }
  };

  const handleDeleteTiktokAdApp = async (appId) => {
    if (!confirm('Are you sure you want to delete this TikTok ad application?')) {
      return;
    }
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`/api/admin/tiktok-ad-applications?id=${appId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.ok) {
        fetchTiktokAdApplications();
      } else {
        alert('Failed to delete TikTok ad application');
      }
    } catch (error) {
      console.error('Error deleting TikTok ad application:', error);
    }
  };

  const fetchWalletSettings = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch('/api/admin/wallet-settings', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        setWalletSettings(data);
      } else if (response.status === 401) {
        router.push('/admin/login');
      }
    } catch (error) {
      console.error('Error fetching wallet settings:', error);
    }
  };

  const handleUpdateWallet = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch('/api/admin/wallet-settings', {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(walletFormData)
      });

      if (response.ok) {
        setWalletFormData({ coin_type: '', wallet_address: '', qr_code_url: '' });
        fetchWalletSettings();
        alert('Wallet settings updated successfully');
      } else {
        const data = await response.json();
        alert(data.message || 'Failed to update wallet settings');
      }
    } catch (error) {
      console.error('Error updating wallet settings:', error);
    }
  };

  return (
    <div className="adminLayout">
      {/* SIDEBAR */}
      <aside className="adminSidebar">
        <div className="adminLogoArea">
          <Image src="/IMG_0907.png" alt="Admin Logo" width={100} height={100} />
          <h3>Admin Panel</h3>
        </div>

        <div className="sidebarMenu">
          <div className={`menuItem ${activeTab === 'users' ? 'active' : ''}`} onClick={() => setActiveTab('users')}>
            <MdPeople size={20} />
            Users
          </div>
          <div className={`menuItem ${activeTab === 'money' ? 'active' : ''}`} onClick={() => setActiveTab('money')}>
            <MdAttachMoney size={20} />
            Money Requests
          </div>
          <div className={`menuItem ${activeTab === 'adApps' ? 'active' : ''}`} onClick={() => setActiveTab('adApps')}>
            <MdAssignment size={20} />
            Ad Applications
          </div>
          <div className={`menuItem ${activeTab === 'adsDeposits' ? 'active' : ''}`} onClick={() => setActiveTab('adsDeposits')}>
            <MdAttachMoney size={20} />
            Ads Deposits
          </div>
          <div className={`menuItem ${activeTab === 'refunds' ? 'active' : ''}`} onClick={() => setActiveTab('refunds')}>
            <MdAssignment size={20} />
            Refund Requests
          </div>
          <div className={`menuItem ${activeTab === 'googleAdApps' ? 'active' : ''}`} onClick={() => setActiveTab('googleAdApps')}>
            <MdAssignment size={20} />
            Google Ad Apps
          </div>
          <div className={`menuItem ${activeTab === 'snapchatAdApps' ? 'active' : ''}`} onClick={() => setActiveTab('snapchatAdApps')}>
            <MdAssignment size={20} />
            Snapchat Ad Apps
          </div>
          <div className={`menuItem ${activeTab === 'tiktokAdApps' ? 'active' : ''}`} onClick={() => setActiveTab('tiktokAdApps')}>
            <MdAssignment size={20} />
            TikTok Ad Apps
          </div>
          <div className={`menuItem ${activeTab === 'walletSettings' ? 'active' : ''}`} onClick={() => { setActiveTab('walletSettings'); fetchWalletSettings(); }}>
            <MdAttachMoney size={20} />
            Wallet Settings
          </div>
          <div className="menuItem" onClick={() => setShowCreateForm(true)}>
            <MdAdd size={20} />
            Create User
          </div>
          <div className="menuItem" onClick={handleLogout}>
            <MdLogout size={20} />
            Logout
          </div>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <div className="adminMain">
        {/* NAVBAR */}
        <header className="adminNavbar">
          <h1>{activeTab === 'users' ? 'User Management' : activeTab === 'money' ? 'Money Requests' : activeTab === 'adApps' ? 'Ad Applications' : activeTab === 'refunds' ? 'Refund Requests' : activeTab === 'googleAdApps' ? 'Google Ad Applications' : activeTab === 'snapchatAdApps' ? 'Snapchat Ad Applications' : activeTab === 'tiktokAdApps' ? 'TikTok Ad Applications' : activeTab === 'walletSettings' ? 'Wallet Settings' : 'Ads Deposit Requests'}</h1>
          <div className="adminInfo">
            <span>Admin: nixs_adyvibe.in</span>
          </div>
        </header>

        {/* CONTENT */}
        <div className="adminContent">
          {activeTab === 'users' ? (
            <div className="usersTable">
              <h2>Users & Their Ads Accounts</h2>
              <table>
                <thead>
                  <tr>
                    <th>Username</th>
                    <th>Balance</th>
                    <th>License</th>
                    <th>Ads Account ID</th>
                    <th>Ads Account Name</th>
                    <th>Ad Type</th>
                    <th>Operate</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user, index) => (
                    <tr key={`${user.id}-${index}`}>
                      <td>{user.username}</td>
                      <td>${user.balance || '0.00'}</td>
                      <td>{user.license || '-'}</td>
                      <td>
                        {user.ads_account_id || '-'}
                        {user.id && (
                          <button 
                            className="actionBtn delete" 
                            onClick={() => handleDeleteAdAccount(user.id)}
                            title="Delete Ad Account"
                            style={{marginLeft: '8px'}}
                          >
                            <MdDelete size={14} />
                          </button>
                        )}
                      </td>
                      <td>{user.ads_account_name || '-'}</td>
                      <td>{user.ad_type || '-'}</td>
                      <td>{user.operate || '-'}</td>
                      <td>
                        <button 
                          className="actionBtn edit" 
                          onClick={() => openAddAccountForm(user.id)}
                          title="Add Ad Account"
                        >
                          <MdAdd size={16} />
                        </button>
                        <button 
                          className="actionBtn delete" 
                          onClick={() => handleDeleteUser(user.id)}
                          title="Delete User"
                        >
                          <MdDelete size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : activeTab === 'money' ? (
            <div className="usersTable">
              <h2>Money Requests</h2>
              <table>
                <thead>
                  <tr>
                    <th>Request ID</th>
                    <th>Username</th>
                    <th>Amount</th>
                    <th>Payway</th>
                    <th>Transaction ID</th>
                    <th>Screenshot</th>
                    <th>Status</th>
                    <th>Created</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {moneyRequests.map((request) => (
                    <tr key={request.id}>
                      <td>REQ{request.id.toString().padStart(10, '0')}</td>
                      <td>{request.username}</td>
                      <td>${request.charge_amount}</td>
                      <td>{request.payway}</td>
                      <td>{request.transaction_id}</td>
                      <td>
                        {request.screenshot_url ? (
                          <a 
                            href={request.screenshot_url} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="screenshotLink"
                          >
                            <Image 
                              src={request.screenshot_url} 
                              alt="Payment Screenshot" 
                              width={50} 
                              height={50}
                              style={{objectFit: 'cover', borderRadius: '4px', cursor: 'pointer'}}
                            />
                          </a>
                        ) : (
                          <span style={{color: '#999'}}>No image</span>
                        )}
                      </td>
                      <td>
                        <span className={`statusBadge ${request.status}`}>{request.status}</span>
                      </td>
                      <td>{new Date(request.created_at).toLocaleString()}</td>
                      <td>
                        {request.status === 'pending' && (
                          <>
                            <button 
                              className="actionBtn approve" 
                              onClick={() => handleApprove(request.id)}
                              title="Approve"
                            >
                              ✓
                            </button>
                            <button 
                              className="actionBtn reject" 
                              onClick={() => handleReject(request.id)}
                              title="Reject"
                            >
                              ✗
                            </button>
                          </>
                        )}
                        <button 
                          className="actionBtn delete" 
                          onClick={() => handleDeleteMoneyRequest(request.id)}
                          title="Delete"
                        >
                          <MdDelete size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : activeTab === 'adApps' ? (
            <div className="usersTable">
              <h2>Ad Applications</h2>
              <table>
                <thead>
                  <tr>
                    <th>App ID</th>
                    <th>Username</th>
                    <th>Business Model</th>
                    <th>License</th>
                    <th>Ad Num</th>
                    <th>Status</th>
                    <th>Created</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {adApplications.map((app) => (
                    <tr key={app.id}>
                      <td>APP{app.id.toString().padStart(10, '0')}</td>
                      <td>{app.username}</td>
                      <td>{app.business_model?.substring(0, 30)}...</td>
                      <td>{app.license_name}</td>
                      <td>{app.ad_num}</td>
                      <td>
                        <span className={`statusBadge ${app.status}`}>{app.status}</span>
                      </td>
                      <td>{new Date(app.created_at).toLocaleString()}</td>
                      <td>
                        {app.status === 'pending' && (
                          <>
                            <button 
                              className="actionBtn approve" 
                              onClick={() => handleApproveAdApp(app.id)}
                              title="Approve"
                            >
                              ✓
                            </button>
                            <button 
                              className="actionBtn reject" 
                              onClick={() => handleRejectAdApp(app.id)}
                              title="Reject"
                            >
                              ✗
                            </button>
                          </>
                        )}
                        <button 
                          className="actionBtn delete" 
                          onClick={() => handleDeleteAdApplication(app.id)}
                          title="Delete"
                        >
                          <MdDelete size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : activeTab === 'adsDeposits' ? (
            <div className="usersTable">
              <h2>Ads Deposit Requests</h2>
              <table>
                <thead>
                  <tr>
                    <th>Request ID</th>
                    <th>Username</th>
                    <th>Ads Account</th>
                    <th>Deposit</th>
                    <th>Cost (with 3% fee)</th>
                    <th>Status</th>
                    <th>Created</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {adsDepositRequests.map((request) => (
                    <tr key={request.id}>
                      <td>DEP{request.id.toString().padStart(10, '0')}</td>
                      <td>{request.username}</td>
                      <td>{request.ads_account_name}</td>
                      <td>${request.deposit_amount}</td>
                      <td>${request.cost_amount}</td>
                      <td>
                        <span className={`statusBadge ${request.status}`}>{request.status}</span>
                      </td>
                      <td>{new Date(request.created_at).toLocaleString()}</td>
                      <td>
                        {request.status === 'pending' && (
                          <>
                            <button 
                              className="actionBtn approve" 
                              onClick={() => handleApproveAdsDeposit(request.id)}
                              title="Approve"
                            >
                              ✓
                            </button>
                            <button 
                              className="actionBtn reject" 
                              onClick={() => handleRejectAdsDeposit(request.id)}
                              title="Reject"
                            >
                              ✗
                            </button>
                          </>
                        )}
                        <button 
                          className="actionBtn delete" 
                          onClick={() => handleDeleteAdsDeposit(request.id)}
                          title="Delete"
                        >
                          <MdDelete size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : activeTab === 'googleAdApps' ? (
            <div className="usersTable">
              <h2>Google Ad Applications</h2>
              <table>
                <thead>
                  <tr>
                    <th>App ID</th>
                    <th>Username</th>
                    <th>Ad Type</th>
                    <th>Ad Num</th>
                    <th>Gmail</th>
                    <th>Deposit</th>
                    <th>Total Cost</th>
                    <th>Status</th>
                    <th>Created</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {googleAdApplications.map((app) => (
                    <tr key={app.id}>
                      <td>GG{app.id.toString().padStart(10, '0')}</td>
                      <td>{app.username}</td>
                      <td>{app.ad_type}</td>
                      <td>{app.ad_num}</td>
                      <td>{app.gmail}</td>
                      <td>${app.deposit_amount}</td>
                      <td>${app.total_cost}</td>
                      <td>
                        <span className={`statusBadge ${app.status}`}>{app.status}</span>
                      </td>
                      <td>{new Date(app.created_at).toLocaleString()}</td>
                      <td>
                        {app.status === 'pending' && (
                          <>
                            <button 
                              className="actionBtn approve" 
                              onClick={() => handleApproveGoogleAdApp(app.id)}
                              title="Approve"
                            >
                              ✓
                            </button>
                            <button 
                              className="actionBtn reject" 
                              onClick={() => handleRejectGoogleAdApp(app.id)}
                              title="Reject"
                            >
                              ✗
                            </button>
                          </>
                        )}
                        <button 
                          className="actionBtn delete" 
                          onClick={() => handleDeleteGoogleAdApp(app.id)}
                          title="Delete"
                        >
                          <MdDelete size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : activeTab === 'snapchatAdApps' ? (
            <div className="usersTable">
              <h2>Snapchat Ad Applications</h2>
              <table>
                <thead>
                  <tr>
                    <th>App ID</th>
                    <th>Username</th>
                    <th>Ad Num</th>
                    <th>Gmail</th>
                    <th>Timezone</th>
                    <th>Public Profile</th>
                    <th>Deposit</th>
                    <th>Domain</th>
                    <th>Status</th>
                    <th>Created</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {snapchatAdApplications.map((app) => (
                    <tr key={app.id}>
                      <td>SCAPP{app.id.toString().padStart(8, '0')}</td>
                      <td>{app.username}</td>
                      <td>{app.ad_num}</td>
                      <td>{app.gmail}</td>
                      <td>{app.timezone}</td>
                      <td>{app.public_profile_name || '-'} ({app.public_profile_id || '-'})</td>
                      <td>${app.deposit_amount}</td>
                      <td>{app.unlimited_domain ? 'Unlimited' : (app.domain || '-')}</td>
                      <td>
                        <span className={`statusBadge ${app.status}`}>{app.status}</span>
                      </td>
                      <td>{new Date(app.created_at).toLocaleString()}</td>
                      <td>
                        {app.status === 'pending' && (
                          <>
                            <button 
                              className="actionBtn approve" 
                              onClick={() => handleApproveSnapchatAdApp(app.id)}
                              title="Approve"
                            >
                              ✓
                            </button>
                            <button 
                              className="actionBtn reject" 
                              onClick={() => handleRejectSnapchatAdApp(app.id)}
                              title="Reject"
                            >
                              ✗
                            </button>
                          </>
                        )}
                        <button 
                          className="actionBtn delete" 
                          onClick={() => handleDeleteSnapchatAdApp(app.id)}
                          title="Delete"
                        >
                          <MdDelete size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : activeTab === 'tiktokAdApps' ? (
            <div className="usersTable">
              <h2>TikTok Ad Applications</h2>
              <table>
                <thead>
                  <tr>
                    <th>App ID</th>
                    <th>Username</th>
                    <th>Ad Num</th>
                    <th>Ad Name</th>
                    <th>Business Category</th>
                    <th>Timezone</th>
                    <th>Deposit</th>
                    <th>Domain</th>
                    <th>Status</th>
                    <th>Created</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {tiktokAdApplications.map((app) => (
                    <tr key={app.id}>
                      <td>TTAPP{app.id.toString().padStart(8, '0')}</td>
                      <td>{app.username}</td>
                      <td>{app.ad_num}</td>
                      <td>{app.ad_name || '-'}</td>
                      <td>{app.business_category || '-'}</td>
                      <td>{app.timezone}</td>
                      <td>${app.deposit_amount}</td>
                      <td>{app.unlimited_domain ? 'Unlimited' : (app.domain || '-')}</td>
                      <td>
                        <span className={`statusBadge ${app.status}`}>{app.status}</span>
                      </td>
                      <td>{new Date(app.created_at).toLocaleString()}</td>
                      <td>
                        {app.status === 'pending' && (
                          <>
                            <button 
                              className="actionBtn approve" 
                              onClick={() => handleApproveTiktokAdApp(app.id)}
                              title="Approve"
                            >
                              ✓
                            </button>
                            <button 
                              className="actionBtn reject" 
                              onClick={() => handleRejectTiktokAdApp(app.id)}
                              title="Reject"
                            >
                              ✗
                            </button>
                          </>
                        )}
                        <button 
                          className="actionBtn delete" 
                          onClick={() => handleDeleteTiktokAdApp(app.id)}
                          title="Delete"
                        >
                          <MdDelete size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : activeTab === 'walletSettings' ? (
            <div className="usersTable">
              <h2>Crypto Wallet Settings</h2>
              <p style={{marginBottom: '20px', color: '#666'}}>Manage wallet addresses for USDT, BTC, and ETH payments.</p>
              
              {/* Current Wallets Display */}
              <div style={{marginBottom: '30px'}}>
                <h3>Current Wallet Addresses</h3>
                <table style={{marginTop: '15px'}}>
                  <thead>
                    <tr>
                      <th>Coin Type</th>
                      <th>Wallet Address</th>
                      <th>Last Updated</th>
                    </tr>
                  </thead>
                  <tbody>
                    {walletSettings.length === 0 ? (
                      <tr><td colSpan="3" style={{textAlign: 'center'}}>No wallet settings found.</td></tr>
                    ) : (
                      walletSettings.map((wallet) => (
                        <tr key={wallet.id}>
                          <td><span style={{fontWeight: 'bold', color: '#0eab79'}}>{wallet.coin_type}</span></td>
                          <td style={{fontFamily: 'monospace', fontSize: '12px'}}>{wallet.wallet_address}</td>
                          <td>{new Date(wallet.updated_at).toLocaleString()}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              {/* Update Wallet Form */}
              <div style={{background: '#f8f9fa', padding: '20px', borderRadius: '8px'}}>
                <h3>Update Wallet Address</h3>
                <form onSubmit={handleUpdateWallet} style={{marginTop: '15px'}}>
                  <div style={{display: 'grid', gap: '15px', maxWidth: '500px'}}>
                    <div>
                      <label style={{display: 'block', marginBottom: '5px', fontWeight: '500'}}>Coin Type</label>
                      <select
                        value={walletFormData.coin_type}
                        onChange={(e) => setWalletFormData({...walletFormData, coin_type: e.target.value})}
                        required
                        style={{width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #ddd'}}
                      >
                        <option value="">Select Coin Type</option>
                        <option value="USDT">USDT</option>
                        <option value="BTC">BTC</option>
                        <option value="ETH">ETH</option>
                      </select>
                    </div>
                    <div>
                      <label style={{display: 'block', marginBottom: '5px', fontWeight: '500'}}>Wallet Address</label>
                      <input
                        type="text"
                        value={walletFormData.wallet_address}
                        onChange={(e) => setWalletFormData({...walletFormData, wallet_address: e.target.value})}
                        placeholder="Enter wallet address"
                        required
                        style={{width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #ddd', fontFamily: 'monospace'}}
                      />
                      <p style={{fontSize: '12px', color: '#666', marginTop: '5px'}}>QR code will be generated automatically from this address</p>
                    </div>
                    <div style={{marginTop: '10px'}}>
                      <button type="submit" style={{
                        background: '#0eab79',
                        color: 'white',
                        border: 'none',
                        padding: '12px 24px',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        fontWeight: '600'
                      }}>
                        Save Wallet Settings
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          ) : (
            <div className="usersTable">
              <h2>Refund Requests</h2>
              <table>
                <thead>
                  <tr>
                    <th>Request ID</th>
                    <th>Username</th>
                    <th>Refund Amount</th>
                    <th>Reason</th>
                    <th>Status</th>
                    <th>Created</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {refundRequests.map((request) => (
                    <tr key={request.id}>
                      <td>REF{request.id.toString().padStart(10, '0')}</td>
                      <td>{request.username}</td>
                      <td>${request.refund_amount}</td>
                      <td>{request.reason?.substring(0, 30) || '-'}{request.reason?.length > 30 ? '...' : ''}</td>
                      <td>
                        <span className={`statusBadge ${request.status}`}>{request.status}</span>
                      </td>
                      <td>{new Date(request.created_at).toLocaleString()}</td>
                      <td>
                        {request.status === 'pending' && (
                          <>
                            <button 
                              className="actionBtn approve" 
                              onClick={() => handleApproveRefund(request.id)}
                              title="Approve"
                            >
                              ✓
                            </button>
                            <button 
                              className="actionBtn reject" 
                              onClick={() => handleRejectRefund(request.id)}
                              title="Reject"
                            >
                              ✗
                            </button>
                          </>
                        )}
                        <button 
                          className="actionBtn delete" 
                          onClick={() => handleDeleteRefund(request.id)}
                          title="Delete"
                        >
                          <MdDelete size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* CREATE USER MODAL */}
      {showCreateForm && (
        <div className="modalOverlay">
          <div className="modal">
            <h2>Create New User</h2>
            <form onSubmit={handleCreateUser}>
              <div className="formGroup">
                <label>Username</label>
                <input
                  type="text"
                  value={formData.username}
                  onChange={(e) => setFormData({...formData, username: e.target.value})}
                  required
                />
              </div>
              <div className="formGroup">
                <label>Password</label>
                <input
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                  required
                />
              </div>
              <div className="formGroup">
                <label>License</label>
                <input
                  type="text"
                  value={formData.license}
                  onChange={(e) => setFormData({...formData, license: e.target.value})}
                />
              </div>
              <div className="formGroup">
                <label>Ads Account ID</label>
                <input
                  type="text"
                  value={formData.ads_account_id}
                  onChange={(e) => setFormData({...formData, ads_account_id: e.target.value})}
                />
              </div>
              <div className="formGroup">
                <label>Ads Account Name</label>
                <input
                  type="text"
                  value={formData.ads_account_name}
                  onChange={(e) => setFormData({...formData, ads_account_name: e.target.value})}
                />
              </div>
              <div className="formGroup">
                <label>Ad Type</label>
                <input
                  type="text"
                  value={formData.ad_type}
                  onChange={(e) => setFormData({...formData, ad_type: e.target.value})}
                />
              </div>
              <div className="formGroup">
                <label>Operate</label>
                <input
                  type="text"
                  value={formData.operate}
                  onChange={(e) => setFormData({...formData, operate: e.target.value})}
                />
              </div>
              <div className="modalActions">
                <button type="button" onClick={() => setShowCreateForm(false)}>
                  Cancel
                </button>
                <button type="submit">Create User</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ADD ACCOUNT MODAL */}
      {showAddAccountForm && (
        <div className="modalOverlay">
          <div className="modal">
            <h2>Add Ad Account for User</h2>
            <form onSubmit={handleCreateAdAccount}>
              <div className="formGroup">
                <label>License</label>
                <input
                  type="text"
                  value={accountFormData.license}
                  onChange={(e) => setAccountFormData({...accountFormData, license: e.target.value})}
                  required
                />
              </div>
              <div className="formGroup">
                <label>Ads Account ID</label>
                <input
                  type="text"
                  value={accountFormData.ads_account_id}
                  onChange={(e) => setAccountFormData({...accountFormData, ads_account_id: e.target.value})}
                  required
                />
              </div>
              <div className="formGroup">
                <label>Ads Account Name</label>
                <input
                  type="text"
                  value={accountFormData.ads_account_name}
                  onChange={(e) => setAccountFormData({...accountFormData, ads_account_name: e.target.value})}
                  required
                />
              </div>
              <div className="formGroup">
                <label>Ad Type</label>
                <input
                  type="text"
                  value={accountFormData.ad_type}
                  onChange={(e) => setAccountFormData({...accountFormData, ad_type: e.target.value})}
                />
              </div>
              <div className="formGroup">
                <label>Operate</label>
                <input
                  type="text"
                  value={accountFormData.operate}
                  onChange={(e) => setAccountFormData({...accountFormData, operate: e.target.value})}
                />
              </div>
              <div className="modalActions">
                <button type="button" onClick={() => setShowAddAccountForm(false)}>
                  Cancel
                </button>
                <button type="submit">Add Account</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
