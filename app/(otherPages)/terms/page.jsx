import Footer14 from "@/components/footers/Footer14";

import Header14 from "@/components/headers/Header14";
import Terms from "@/components/otherPages/Terms";
import React from "react";

export const metadata = {
  title: "Terms || Uomo eCommerce React Nextjs Template",
  description: "Uomo eCommerce React Nextjs Template",
};
export default function TermsPage() {
  return (
    <>
      <Header14 />
      <main className="page-wrapper">
        <div className="mb-4 pb-4"></div>
        <Terms />
      </main>

      <div className="mb-5 pb-xl-5"></div>
      <Footer14 />
    </>
  );
}
