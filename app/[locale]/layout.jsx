import Head from "next/head";
import Script from "next/script";
import Svgs from "@/components/common/Svgs";
import "react-tooltip/dist/react-tooltip.css";
import "../../public/assets/css/plugins/swiper.min.css";
import "../../public/assets/sass/style.scss";
import "rc-slider/assets/index.css";
import "tippy.js/dist/tippy.css";
import LoginFormPopup from "@/components/common/LoginFormPopup";
import ScrollTop from "@/components/common/ScrollTop";
import Context from "@/context/Context";
import { MenuProvider } from "@/context/MenuContext";
import { UserProvider } from "@/context/UserContext";
import CartDrawer from "@/components/shopCartandCheckout/CartDrawer";
import SiteMap from "@/components/modals/SiteMap";
import NewsLetter from "@/components/modals/NewsLetter";
import MobileHeader from "@/components/headers/MobileHeader";
import SizeGuide from "@/components/modals/SizeGuide";
import Delivery from "@/components/modals/Delivery";
import CustomerLogin from "@/components/asides/CustomerLogin";
import ProductDescription from "@/components/asides/ProductDescription";
import ProductAdditionalInformation from "@/components/asides/ProductAdditionalInformation";
import ProductReviews from "@/components/asides/ProductReviews";
import MobileFooter1 from "@/components/footers/MobileFooter1";
import localFont from "next/font/local";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { notFound, redirect } from "next/navigation";
import { routing } from "@/i18n/routing";
import { FacebookPixelEvents } from "@/components/Metapixel";
import GTMPageView from "@/components/common/GTMPageView";
import { headers } from 'next/headers';
import { getCountryFromIP } from './lib/getCountryFromIP';

export const metadata = {
    title: "Buy Best Perfumes Online | Ahmed Al Maghribi Perfumes",
    description: "Buy Best Perfumes Online Ahmed Al Maghribi Perfumes.",
    icons: {
        icon: "/assets/images/ahmed-favicon.png",
    },
};

// Import English font
const englishFont = localFont({
    src: "../../public/assets/fonts/wulkan/WulkanDisplayRegular.ttf",
});

// Import Arabic font
const arabicFont = localFont({
    src: "../../public/assets/fonts/alexandria-arabic/static/Alexandria-Regular.ttf",
});

// Import Sofia Pro Regular font as a secondary font
const sofiaFont = localFont({
    src: "../../public/assets/fonts/sofia/SofiaProRegular.ttf",
});

const COUNTRY_DOMAINS = {
    AE: 'https://ae.ahmedalmaghribi.com',
    SA: 'https://ksa.ahmedalmaghribi.com',
    BH: 'https://bh.ahmedalmaghribi.com',
    KW: 'https://kw.ahmedalmaghribi.com',
    QA: 'https://qa.ahmedalmaghribi.com',
    OM: 'https://om.ahmedalmaghribi.com',
};

export default async function LocaleLayout({ children, params: { locale } }) {
    if (!routing.locales.includes(locale)) {
        notFound();
    }

    // Select the font based on locale
    let selectedFont = englishFont;
    if (locale === "ar") {
        selectedFont = arabicFont;
    } else if (locale === "secondary") {
        selectedFont = sofiaFont;
    }

    // Fetch translation messages
    const messages = await getMessages();
    const GTM_ID = "GTM-M4B7GLV";

    const headersList = headers();
    const ip = headersList.get('x-forwarded-for')?.split(',')[0] || '217.165.35.39';
    // const ip = '62.215.0.0'; // KW
    // const ip = '92.97.63.173'; // UAE
    // const ip = '159.0.14.172'; // KSA
    // const ip = '37.210.202.22'; // QA
    // const ip = '37.41.136.118'; // OM
    // const ip = '88.201.99.52'; // BH

    const countryCode = await getCountryFromIP(ip);
    // const redirectUrl = COUNTRY_DOMAINS[countryCode];

    const currentHost = headersList.get('host');

    const countryDomain = COUNTRY_DOMAINS[countryCode];

    if (countryDomain) {
        let expectedHost = null;
        try {
            expectedHost = new URL(countryDomain).host;
        } catch (err) {
            console.error('Failed to parse expected country domain:', err);
        }

        if (expectedHost && currentHost !== expectedHost) {
            const currentPath = headersList.get('x-next-url') || `/${locale}`;
            const redirectUrl = `${countryDomain}${currentPath}`;
            redirect(redirectUrl); // This should NOT be inside the try-catch
        }
    }

    // console.log('=============================================================================', new URL(countryDomain).host, currentHost, headersList.get('x-next-url'));

    return (
        <html lang={locale} dir={locale === "ar" ? "rtl" : "ltr"}>
            <head>
            
            </head>
           

            <body className={selectedFont.className}>
            <Script id="gtm-script" strategy="afterInteractive">
          {`
            (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
            new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
            j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
            'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
            })(window,document,'script','dataLayer','${GTM_ID}');
          `}
        </Script>
            <noscript>
          <iframe
            src={`https://www.googletagmanager.com/ns.html?id=${GTM_ID}`}
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
          />
        </noscript>

                <NextIntlClientProvider messages={messages}>
                    <Svgs />
                    <Context>
                        <UserProvider>
                            <FacebookPixelEvents />
                            <MenuProvider>
                                <MobileHeader />
                                {children}
                                <MobileFooter1 />
                                <GTMPageView/>
                                {/* Modals and Asides */}
                                <LoginFormPopup />
                                <SizeGuide />
                                <Delivery />
                                <CartDrawer />
                                <SiteMap />
                                <CustomerLogin />
                                <ProductDescription />
                                <ProductAdditionalInformation />
                                <ProductReviews />
                            </MenuProvider>
                        </UserProvider>
                    </Context>
                    <div className="page-overlay" id="pageOverlay"></div>
                    <ScrollTop />
                </NextIntlClientProvider>
            </body>
        </html>
    );
}
