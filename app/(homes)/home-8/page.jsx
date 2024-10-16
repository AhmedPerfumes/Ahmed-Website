import Footer14 from "@/components/footers/Footer14";
import Header14 from "@/components/headers/Header14";
import Hero from "@/components/homes/home-8/Hero";
import Animation from "@/components/Animation";
import MobileFooter2 from "@/components/footers/MobileFooter2";

import React from "react";
import CanvasAnimation from "@/components/CanvasAnimation";
import MobileAnimation from "@/components/MobileAnimation";

export const metadata = {
  title: "Perfumes | Buy Best Perfumes Online | Ahmed Perfume",
  description: "Buy Best Perfumes Online Ahmed Perfume",
  icons: {
    icon: "https://www.ahmedalmaghribi.com/wp-content/uploads/2021/08/Ahmed-Logo-e1631552829722-100x100.png",
  },
};
export default function HomePage8() {
  return (
    <div style={{
      backgroundImage : `url(
        https://www.ateliercologne.com/us_en/images/backgrounds/background-ivory.jpg)`
      }}>
        <div className="d-none d-lg-block">

        <CanvasAnimation/>
        </div>
        <div className="d-sm-block d-md-none"> 
          <MobileAnimation/>

        </div>
      <main id="animation-section">
        
      <Header14 />
        <Animation />
      </main>
      <section className="d-none d-lg-block" style={{ height: "100%" }}>
        <Footer14 />
        
      </section>
      <section className="d-sm-block d-md-none bg-dark pt-5  ">
      <div className="MobileFooter">
      

      <MobileFooter2/>
      </div>
      </section>
      {/* <Footer14 /> */}
    </div>
  );
}
