import Header14 from "@/components/headers/Header14";
import Footer14 from "@/components/footers/Footer14";
import MobileFooter2 from "@/components/footers/MobileFooter2";
import FindYourScentPage from "./FindYourScentPage";

export const metadata = {
  title: "Find Your Scent | Ahmed Al Maghribi Perfumes",
  description:
    "Discover your perfect fragrance through our personalised scent quiz. Answer 8 elegant questions and receive curated perfume recommendations crafted for your unique essence.",
  icons: {
    icon: "/assets/images/ahmed-favicon.png",
  },
};

export default function FindYourScentRoute() {
  return (
    <>
      <Header14 />
      <main>
        <FindYourScentPage />
      </main>
      <section className="d-none d-md-block">
        <Footer14 />
      </section>
      <section className="d-sm-block d-md-none bg-dark pt-5">
        <div className="MobileFooter">
          <MobileFooter2 />
        </div>
      </section>
    </>
  );
}
