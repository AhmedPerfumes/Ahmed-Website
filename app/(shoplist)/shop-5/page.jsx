import Footer14 from "@/components/footers/Footer14";
import MobileFooter2 from "@/components/footers/MobileFooter2";

import Header14 from "@/components/headers/Header14";
import Shop10 from "@/components/shoplist/shop10/Shop10";

import Shop5 from "@/components/shoplist/Shop5";

export const metadata = {
  title: "Perfumes | Buy Best Perfumes Online | Ahmed Perfume",
  description: "Buy Best Perfumes Online Ahmed Perfume",
  icons: {
    icon: 'https://www.ahmed-perfume.com/wp-content/uploads/2021/08/Ahmed-Logo-e1631552829722-100x100.png',
  },
};
export default function ShopPage5() {
  return (
    <>
      <Header14 />
      <main>
        <Shop5 />
        <Shop10/>
      </main>

      <section className=" d-none d-lg-block" style={{ height: "100%" }}>
        <Footer14 />
        
      </section>
      <section className=" d-sm-block d-md-none bg-dark pt-5  ">
      <div className="MobileFooter">
      

      <MobileFooter2/>
      </div>
    </section>

      {/* <Footer1 /> */}
    </>
  );
}
