"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useUser } from "../../../contexts/UserContext";

export default function DashboardPage() {
  const [adAccountCount, setAdAccountCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const { user, updateUser } = useUser();

  useEffect(() => {
    fetchAdAccountCount();
    
    // Refresh user balance every 5 seconds
    const interval = setInterval(() => {
      fetchUserBalance();
    }, 5000);
    
    // Also refresh when tab becomes visible again
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        fetchUserBalance();
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    return () => {
      clearInterval(interval);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  const fetchUserBalance = async () => {
    try {
      const token = localStorage.getItem('userToken');
      if (!token) return;
      
      const response = await fetch('/api/user/profile', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (response.ok) {
        const userData = await response.json();
        // Update user context with fresh balance
        if (userData.balance !== undefined && user) {
          updateUser({ ...user, balance: userData.balance });
        }
      }
    } catch (error) {
      console.error('Error fetching balance:', error);
    }
  };

  const fetchAdAccountCount = async () => {
    try {
      const token = localStorage.getItem('userToken');
      const response = await fetch('/api/user/accounts', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (response.ok) {
        const data = await response.json();
        setAdAccountCount(data.length);
      }
    } catch (error) {
      console.error('Error fetching ad accounts:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* GREEN HEADER */}
      <div className="welcomeBanner">

        <Image
          src="/IMG_0907.png"
          alt="header"
          width={180}
          height={180}
        />

        <div>
          <h2>{user?.username || 'User'}, have a nice day</h2>
          <p>wish you happy every day</p>
        </div>
      </div>

      {/* OVERVIEW */}
      <div className="overviewSection">
        <h3 className="overviewTitle">Overview</h3>

        <div className="cards">

          {/* BALANCE CARD */}
          <div className="card">
            <div>
              <div className="balanceRow">
                <span>Balance</span>
                <Link href="/add-money" className="addMoney">add money</Link>
              </div>
              <h2>${user?.balance || '0.00'}</h2>
            </div>

            {/* YOUR SVG ICON */}
            <svg width="60" height="60" viewBox="0 0 48 48" fill="none">
              <path d="M2 23.3548H11L17.8889 4L28.8889 44L37 23.3548H46"
                stroke="#000000"
                strokeWidth="4"
                strokeLinecap="round"
                strokeLinejoin="round"/>
            </svg>
          </div>

          {/* AD ACCOUNT CARD */}
          <div className="card">
            <div>
              <p>AD Account</p>
              <h2>{loading ? '...' : adAccountCount}</h2>
            </div>

            {/* YOUR SVG ICON */}
            <svg width="60" height="60" viewBox="0 0 48 48" fill="none">
  <circle cx="24" cy="24" r="20"
    stroke="#000"
    strokeWidth="4" />
  <path d="M38 38L35 35"
    stroke="#000"
    strokeWidth="4"/>
  <path d="M10 10L13 13"
    stroke="#000"
    strokeWidth="4"/>
  <path d="M14 31L14.8571 28M22 31L21.1429 28M21.1429 28L18 17L14.8571 28M21.1429 28H14.8571"
    stroke="#000"
    strokeWidth="4"/>
  <path d="M35 24C35 29 31.4183 31 27 31V17C31.4183 17 35 19 35 24Z"
    stroke="#000"
    strokeWidth="4"/>
</svg>

          </div>

        </div>
      </div>
    </>
  );
}
