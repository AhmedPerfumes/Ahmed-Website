import React from "react";
import Header14 from "@/components/headers/Header14";
import Footer14 from "@/components/footers/Footer14";
import MobileFooter2 from "@/components/footers/MobileFooter2";
import CityWalk from "@/components/campagin/Citywalk";

export const metadata = {
  title: "Buy Best Perfumes Online | Ahmed Al Maghribi Perfumes",
  description: "Buy Best Perfumes Online Ahmed Al Maghribi Perfumes.",
  icons: {
      icon: "/assets/images/ahmed-favicon.png",
  },
};

const Citywalk = () => {
  return (
    <div className="page-wrapper min-vh-100 d-flex flex-column">
      {/* Navigation Header */}
      <Header14 />

      {/* Main Content Area */}
      <main className="flex-grow-1">
        <CityWalk />
      </main>

      {/* Responsive Footer Strategy */}
      <footer>
        {/* Desktop Footer */}
        <section className="d-none d-lg-block border-top">
          <Footer14 />
        </section>

        {/* Mobile Footer */}
        <section className="d-block d-lg-none bg-dark pt-5 pb-4">
          <div className="container">
            <MobileFooter2 />
          </div>
        </section>
      </footer>
    </div>
  );
}

export default Citywalk;
