"use client";

import { createContext, useContext, useState, useEffect, useCallback } from 'react';

const UserContext = createContext();

export function UserProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch fresh user data from API
  const fetchUserData = async () => {
    try {
      const token = localStorage.getItem('userToken');
      if (!token) {
        setLoading(false);
        return;
      }
      
      // Fetch user accounts (for accounts list)
      const accountsResponse = await fetch('/api/user/accounts', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      // Fetch user profile (for actual balance from users table)
      const profileResponse = await fetch('/api/user/profile', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      let accounts = [];
      if (accountsResponse.ok) {
        accounts = await accountsResponse.json();
      }
      
      let profileData = {};
      if (profileResponse.ok) {
        profileData = await profileResponse.json();
      }
      
      // Use the actual balance from users table (this is what admin updates)
      const actualBalance = parseFloat(profileData.balance) || 0;
      
      const updatedUser = {
        ...profileData,
        balance: actualBalance,
        accounts: accounts
      };
      
      setUser(updatedUser);
      localStorage.setItem('userData', JSON.stringify(updatedUser));
    } catch (error) {
      console.error('Error fetching user data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Refresh just the balance (lightweight)
  const refreshBalance = useCallback(async () => {
    try {
      const token = localStorage.getItem('userToken');
      if (!token || !user) return;
      
      const response = await fetch('/api/user/profile', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (response.ok) {
        const profileData = await response.json();
        const actualBalance = parseFloat(profileData.balance) || 0;
        
        const updatedUser = {
          ...user,
          balance: actualBalance,
          username: profileData.username || user.username
        };
        
        setUser(updatedUser);
        localStorage.setItem('userData', JSON.stringify(updatedUser));
      }
    } catch (error) {
      console.error('Error refreshing balance:', error);
    }
  }, [user]);

  useEffect(() => {
    // Check for stored user data on mount
    const token = localStorage.getItem('userToken');
    const userData = localStorage.getItem('userData');
    
    if (token && userData) {
      try {
        setUser(JSON.parse(userData));
      } catch (error) {
        console.error('Error parsing user data:', error);
        localStorage.removeItem('userToken');
        localStorage.removeItem('userData');
      }
    }
    
    // Fetch fresh data
    fetchUserData();
  }, []);

  // Periodic balance refresh (every 30 seconds)
  useEffect(() => {
    if (!user) return;
    
    // Initial refresh
    refreshBalance();
    
    // Set up interval for periodic refresh
    const interval = setInterval(() => {
      refreshBalance();
    }, 30000); // 30 seconds
    
    return () => clearInterval(interval);
  }, [user, refreshBalance]);

  const updateUser = (userData) => {
    setUser(userData);
    localStorage.setItem('userData', JSON.stringify(userData));
  };

  const logout = async () => {
    // Clear cookie via API
    try {
      await fetch('/api/logout', { method: 'POST' });
    } catch (error) {
      console.error('Error clearing cookie:', error);
    }
    // Clear local storage
    setUser(null);
    localStorage.removeItem('userToken');
    localStorage.removeItem('userData');
  };

  return (
    <UserContext.Provider value={{ user, loading, updateUser, logout, refreshBalance }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}
