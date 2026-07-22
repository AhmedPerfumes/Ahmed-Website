import CorporateHero from "@/components/corporate/CorporateHero";
import CorporatePartnersSlider from "@/components/corporate/CorporatePartnersSlider";
import CorporateMarquee from "@/components/corporate/CorporateMarquee";
import CorporateGiftSets from "@/components/corporate/CorporateGiftSets";
import CorporateBranding from "@/components/corporate/CorporateBranding";
import CorporateProcess from "@/components/corporate/CorporateProcess";
import CorporateContact from "@/components/corporate/CorporateContact";
import CorporateWedding from "@/components/corporate/CorporateWedding";
import CorporateCollections from "@/components/corporate/CorporateCollections";

export const metadata = {
    title: "Corporate Gifting | Ahmed Al Maghribi Perfumes",
    description:
        "Celebrate business relationships with the timeless elegance of Ahmed Al Maghribi Perfumes. Curated fragrance gift sets for companies, government departments, institutions, events, and special occasions across the UAE. Trusted by Amazon, Emaar, Emirates, ENBD, DAMAC, ADCB, and more.",
    keywords:
        "corporate gifting UAE, luxury perfume gifts Dubai, bespoke gift sets, Ahmed Al Maghribi corporate, Ramadan corporate gifts, Hajj gift sets, UAE National Day gifts, branded perfume gifts, executive gifts Dubai",
    openGraph: {
        title: "Corporate Gifting | Ahmed Al Maghribi Perfumes",
        description:
            "Fragrance That Leaves a Lasting Impression. Bespoke luxury fragrance gift sets for corporate clients across the UAE.",
        images: ["/assets/Corporate Gift Sets/corporate gift set black square 01.jpg.jpeg"],
    },
};

const CorporateGiftingPage = () => {
    return (
        <main>
            {/* 1. Hero — headline + description + stats */}
            <CorporateHero />

            {/* 2. Partner slider — Travel, Hajj & Umrah, Bank, Diwali */}
            <CorporatePartnersSlider />

            {/* 2.5. Company logos continuous marquee */}
            <CorporateMarquee />

            {/* 3. Dedicated Wedding Section */}
            <CorporateWedding />

            {/* 3.6. Collections — Specialized collections with content */}
            <CorporateCollections />

            {/* 4. Occasions table + Customized Branding features */}
            <CorporateBranding />

            {/* 5. How it works — 4 step process */}
            <CorporateProcess />

            {/* 6. Corporate inquiry form + contact details */}
            <CorporateContact />
        </main>
    );
};

export default CorporateGiftingPage;