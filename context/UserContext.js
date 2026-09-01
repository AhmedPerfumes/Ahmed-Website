'use client';
import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import {
  apiClient,
  forceLogout,
  clearStoredTokens,
  getAccessToken,
  silentRefresh,
} from '@/lib/apiClient';

const UserContext = createContext();

export function UserProvider({ children }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [couponCount, setCouponCount] = useState(null);
  /**
   * authLoading: true while we are attempting the silent refresh on page load.
   * Components that need auth (e.g. account pages) should wait for this before
   * deciding to redirect.
   */
  const [authLoading, setAuthLoading] = useState(true);

  /**
   * Fetch coupon count once for the authenticated customer.
   */
  const fetchCouponCount = useCallback(async (userData) => {
    const activeUser = userData || user;
    if (!activeUser?.phone || !activeUser?.email) return;

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_SMARTVIEW_API_URL}Coupon/Count`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            salesType: 'EComm',
            company: 'UAE',
            mobileNo: activeUser.phone,
            email: activeUser.email,
          }),
        }
      );
      const result = await response.json();
      if (result?.data !== undefined) setCouponCount(result.data);
    } catch (err) {
      console.error('Error fetching coupon count:', err);
    }
  }, [user]);

  /**
   * Attempt to restore the session on every page load.
   * - User profile is stored in localStorage (not sensitive).
   * - Access token lives in memory (lost on refresh) — restored via the
   *   HttpOnly refresh_token cookie through POST /api/refresh.
   */
  const checkUser = async () => {
    try {
      const rawUser = localStorage.getItem('user');

      if (!rawUser) {
        // No profile → definitely logged out
        setIsLoggedIn(false);
        setUser(null);
        setCouponCount(null);
        return;
      }

      if (!getAccessToken()) {
        // Profile exists but access token is gone (page refresh) → try silent restore
        const refreshed = await silentRefresh();
        if (!refreshed) {
          // Cookie missing or expired → clear stale profile and log out
          clearStoredTokens();
          setIsLoggedIn(false);
          setUser(null);
          setCouponCount(null);
          return;
        }
      }

      // Access token is in memory; parse and set user
      let parsedUser = null;
      try {
        parsedUser = JSON.parse(atob(rawUser));
        setUser(parsedUser);
      } catch {
        setUser(null);
      }

      setIsLoggedIn(true);

      if (parsedUser) {
        fetchCouponCount(parsedUser);
      }
    } catch {
      setIsLoggedIn(false);
      setUser(null);
      setCouponCount(null);
    } finally {
      setAuthLoading(false);
    }
  };

  // Automatically fetch coupon count whenever login state becomes true
  useEffect(() => {
    if (isLoggedIn) {
      let activeUser = user;
      if (!activeUser && typeof window !== 'undefined') {
        const rawUser = localStorage.getItem('user');
        if (rawUser) {
          try {
            activeUser = JSON.parse(atob(rawUser));
            setUser(activeUser);
          } catch { }
        }
      }
      if (activeUser && couponCount === null) {
        fetchCouponCount(activeUser);
      }
    }
  }, [isLoggedIn, user, couponCount, fetchCouponCount]);

  useEffect(() => {
    checkUser();

    const handleLogoutEvent = () => {
      setIsLoggedIn(false);
      setUser(null);
      setCouponCount(null);
      if (typeof window !== 'undefined' && window.location.pathname.includes('/account')) {
        window.location.href = '/login_register';
      }
    };

    window.addEventListener('user-logged-out', handleLogoutEvent);
    return () => window.removeEventListener('user-logged-out', handleLogoutEvent);
  }, []);

  const logout = async () => {
    // 1. Immediately wipe auth state & localStorage so UI updates synchronously
    setIsLoggedIn(false);
    setUser(null);
    setCouponCount(null);

    // 2. Notify backend to revoke JWT & clear HttpOnly refresh_token cookie
    try {
      await apiClient('api/signout');
    } catch {
      // Proceed with client-side logout even if backend call fails
    }

    clearStoredTokens();
    // 3. Dispatch global logout event
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new Event('user-logged-out'));
    }
  };

  return (
    <UserContext.Provider
      value={{
        isLoggedIn,
        setIsLoggedIn,
        user,
        setUser,
        couponCount,
        setCouponCount,
        refreshCouponCount: fetchCouponCount,
        logout,
        checkUser,
        authLoading,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  return useContext(UserContext);
}