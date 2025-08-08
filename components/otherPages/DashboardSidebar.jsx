"use client";
import React, { useEffect } from "react";
import { dashboardMenuItems } from "@/data/menu";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

export default function DashboardSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  // Redirect to login if not authenticated
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.replace("/login_register");
    }
  }, [router]);

  const handleLogout = (e) => {
    e.preventDefault();
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    router.replace("/login_register");
  };

  return (
    <div className="col-lg-3">
      <ul className="account-nav">
        {dashboardMenuItems.map((elm, i) => (
          <li key={i}>
            {elm.title === "Logout" ? (
              <a
                href="#"
                onClick={handleLogout}
                className="menu-link menu-link_us-s"
              >
                Logout
              </a>
            ) : (
              <Link
                href={elm.href}
                className={`menu-link menu-link_us-s ${
                  pathname === elm.href ? "menu-link_active" : ""
                }`}
              >
                {elm.title}
              </Link>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
