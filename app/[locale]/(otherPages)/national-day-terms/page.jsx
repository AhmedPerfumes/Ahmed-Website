import Footer14 from "@/components/footers/Footer14";
import MobileFooter2 from "@/components/footers/MobileFooter2";
import Header14 from "@/components/headers/Header14";
import NationalDayTerms from "@/components/otherPages/NationalDayTerms";
import React from "react";

export const metadata = {
    title: "UAE National Day Offers – Terms & Conditions | Ahmed Al Maghribi Perfumes",
    description:
        "Terms & Conditions for the 55th UAE National Day offers at Ahmed Al Maghribi Perfumes: Buy 3 Get 1 Free, Ending in 5 sale and up to 30% off selected products.",
    icons: {
        icon: "/assets/images/ahmed-favicon.png",
    },
};

function NationalDayTermsPage() {
    return (
        <div
            style={{
                backgroundImage: `url(/assets/background-ivory.webp)`,
            }}
        >
            <Header14 />
            <NationalDayTerms />
            <section className="d-none d-lg-block" style={{ height: "100%" }}>
                <Footer14 />
            </section>
            <section className="d-sm-block d-md-none bg-dark pt-5  ">
                <div className="MobileFooter">
                    <MobileFooter2 />
                </div>
            </section>
        </div>
    );
}

export default NationalDayTermsPage;
