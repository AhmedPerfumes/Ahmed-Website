import Footer14 from "@/components/footers/Footer14";
import Header14 from "@/components/headers/Header14";
import Notfound from "@/components/otherPages/Notfound";
import MobileFooter2 from "@/components/footers/MobileFooter2";

export const metadata = {
  title: "Page Not Found || Uomo eCommerce React Nextjs Template",
  description: "Uomo eCommerce React Nextjs Template",
};
export default function PageNotFound() {
  return (
    <>
      <Header14 />
      <main className="page-wrapper">
        <div className="mb-4 pb-4"></div>
        <Notfound />
      </main>

      <section className="d-none d-lg-block" style={{ height: "100%" }}>
        <Footer14 />
        
      </section>
      <section className="d-sm-block d-md-none bg-dark pt-5  ">
      <div className="MobileFooter">
      

      <MobileFooter2/>
      </div>
      </section>
    </>
  );
}
