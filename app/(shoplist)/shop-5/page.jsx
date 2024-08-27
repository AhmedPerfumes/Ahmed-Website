import Footer1 from "@/components/footers/Footer1";
import Footer14 from "@/components/footers/Footer14";
import MobileFooter2 from "@/components/footers/MobileFooter2";

import Header1 from "@/components/headers/Header1";
import Shop10 from "@/components/shoplist/shop10/Shop10";

import Shop5 from "@/components/shoplist/Shop5";

export const metadata = {
  title: "Shop 5 || Uomo eCommerce React Nextjs Template",
  description: "Uomo eCommerce React Nextjs Template",
};
export default function ShopPage5() {
  return (
    <>
      <Header1 />
      <main className="page-wrapper">
        <Shop5 />
        <Shop10/>
      </main>
      <div className="mb-5 pb-xl-5"></div>
      <section className=" d-none d-lg-block" style={{ height: "100%" }}>
        <Footer14 />
        
      </section>
      <section className="testsect d-sm-block d-md-none bg-dark pt-5  ">
      <div className="MobileFooter">
      

      <MobileFooter2/>
      </div>
    </section>

      {/* <Footer1 /> */}
    </>
  );
}
