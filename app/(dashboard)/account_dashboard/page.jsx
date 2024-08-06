import Footer14 from "@/components/footers/Footer14";

import Header14 from "@/components/headers/Header14";
import Dashboard from "@/components/otherPages/Dashboard";
import DashboardSidebar from "@/components/otherPages/DashboardSidebar";
import React from "react";

export const metadata = {
  title: "Dashboard-account || Uomo eCommerce React Nextjs Template",
  description: "Uomo eCommerce React Nextjs Template",
};
export default function AccountPage() {
  return (
    <>
      <Header14 />
      <main className="page-wrapper">
        <div className="mb-4 pb-4"></div>
        <section className="my-account container">
          <h2 className="page-title">My Account</h2>
          <div className="row">
            <DashboardSidebar />
            <Dashboard />
          </div>
        </section>
      </main>

      <div className="mb-5 pb-xl-5"></div>
      <Footer14 />
    </>
  );
}
