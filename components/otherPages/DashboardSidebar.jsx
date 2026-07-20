"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { dashboardMenuItems } from "@/data/menu";

const LOCALES = ["en", "ar"];
const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH || "";

function normalize(path) {
  if (!path) return "/";
  const clean = path.split("#")[0].split("?")[0] || "/";
  const withoutBase =
    BASE_PATH && clean.startsWith(BASE_PATH)
      ? clean.slice(BASE_PATH.length) || "/"
      : clean;
  const localeRegex = new RegExp(`^/(${LOCALES.join("|")})(?=/|$)`, "i");
  const withoutLocale = withoutBase.replace(localeRegex, "") || "/";
  return withoutLocale.length > 1 && withoutLocale.endsWith("/")
    ? withoutLocale.slice(0, -1)
    : withoutLocale;
}

function isActive(currentPathname, itemHref) {
  const p = normalize(currentPathname);
  const h = normalize(itemHref || "/");
  if (h === "/") return p === "/";
  if (p === h) return true;
  if (p.startsWith(h + "/")) return true;
  return false;
}

export default function DashboardSidebar() {
  const pathname = usePathname() || "/";
  const router = useRouter();

  const [couponCount, setCouponCount] = useState(null);
  const [checkingAuth, setCheckingAuth] = useState(true);

  useEffect(() => {
    if (typeof window === "undefined") return;

    // const token = localStorage.getItem("token");
    const encryptedUser = localStorage.getItem("user");

    if (!encryptedUser) {
      router.replace("/login_register");
      return;
    }

    let user = null;
    try {
      // decode Base64 user data
      const decodedText = atob(encryptedUser);
      user = JSON.parse(decodedText);
    } catch (error) {
      console.error("Failed to decode user:", error);
      router.replace("/login_register");
      return;
    }

    // Fetch coupon count
    const fetchCouponCount = async () => {
      try {
       const response = await fetch(
        `${process.env.NEXT_PUBLIC_SMARTVIEW_API_URL}Coupon/Count`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            salesType: "EComm",
            company: "UAE",
            mobileNo: user.phone,
            email: user.email,
          }),
        }
      );
        const result = await response.json();
        if (result?.data !== undefined) setCouponCount(result.data);
      } catch (err) {
        console.error("Error fetching coupon count:", err);
      } finally {
        setCheckingAuth(false);
      }
    };

    fetchCouponCount();
  }, [router]);

  if (checkingAuth) return null;

  const handleLogout = (e) => {
    e.preventDefault();
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    router.replace("/login_register");
  };

  return (
    <>
      <div className="col-lg-3 account-nav p-4 desktop-sidebar" role="navigation" aria-label="Dashboard Sidebar">
        <ul className="account-nav">
          {dashboardMenuItems.map((elm) => {
            const active = elm.title !== "Logout" && isActive(pathname, elm.href);
            const isCouponMenu = elm.title === "My Coupons";

            return (
              <li key={elm.id} className="dashboard-sidebar-item">
                {elm.title === "Logout" ? (
                  <a href="#" onClick={handleLogout} className="menu-link menu-link_us-s">
                    Logout
                  </a>
                ) : (
                  <Link
                    href={elm.href}
                    className={`menu-link menu-link_us-s ${active ? "menu-link_active" : ""}`}
                    aria-current={active ? "page" : undefined}
                  >
                    {elm.title}
                    {isCouponMenu && couponCount !== null && (
                    <span
                      className="badge rounded-pill bg-danger ms-2"
                      style={{ fontSize: "0.75rem", minWidth: "1.5rem", textAlign: "center" }}
                    >
                      {couponCount}
                    </span>
                    )}
                  </Link>
                )}
              </li>
            );
          })}
        </ul>
      </div>

      {/* Mobile Bottom Nav */}
      <div className="dashboard-bottom-nav">
        {dashboardMenuItems.filter(item => item.title !== "Account Overview").map((item) => {
          const active = isActive(pathname, item.href);
          const isCouponMenu = item.title === "My Coupons";
          const isLogout = item.title === "Logout";

          if (isLogout) {
            return (
              <div 
                key={item.id} 
                onClick={handleLogout} 
                className="nav-item-mobile"
                style={{ cursor: 'pointer' }}
              >
                <div className="icon-wrapper">
                  <svg width="20" height="20" fill="currentColor">
                    <use href={item.icon} />
                  </svg>
                </div>
                <span>{item.shortTitle}</span>
              </div>
            );
          }

          return (
            <Link key={item.id} href={item.href} className={`nav-item-mobile ${active ? 'active' : ''}`}>
              <div className="icon-wrapper">
                <svg width="20" height="20" fill="currentColor">
                  <use href={item.icon} />
                </svg>
                {isCouponMenu && couponCount !== null && (
                  <div className="badge-mobile">{couponCount}</div>
                )}
              </div>
              <span>{item.shortTitle}</span>
            </Link>
          );
        })}
      </div>
    </>
  );
}
