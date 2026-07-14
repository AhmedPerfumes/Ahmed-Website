// import Head from "next/head";
import Script from "next/script";
import Svgs from "@/components/common/Svgs";
import "../../public/assets/css/plugins/swiper.min.css";
import "../../public/assets/sass/style.scss";
import dynamic from 'next/dynamic';

const LoginFormPopup = dynamic(() => import("@/components/common/LoginFormPopup"), { ssr: false });
const CartDrawer = dynamic(() => import("@/components/shopCartandCheckout/CartDrawer"), { ssr: false });
const SiteMap = dynamic(() => import("@/components/modals/SiteMap"), { ssr: false });
const ShopFilter = dynamic(() => import("@/components/asides/ShopFilter"), { ssr: false });
const SizeGuide = dynamic(() => import("@/components/modals/SizeGuide"), { ssr: false });
const Delivery = dynamic(() => import("@/components/modals/Delivery"), { ssr: false });
const CustomerLogin = dynamic(() => import("@/components/asides/CustomerLogin"), { ssr: false });
const ProductDescription = dynamic(() => import("@/components/asides/ProductDescription"), { ssr: false });
const ProductAdditionalInformation = dynamic(() => import("@/components/asides/ProductAdditionalInformation"), { ssr: false });
const ProductReviews = dynamic(() => import("@/components/asides/ProductReviews"), { ssr: false });

import ScrollTop from "@/components/common/ScrollTop";
import Context from "@/context/Context";
import { MenuProvider } from "@/context/MenuContext";
import { UserProvider } from "@/context/UserContext";

import MobileHeader from "@/components/headers/MobileHeader";
import MobileFooter1 from "@/components/footers/MobileFooter1";
import localFont from "next/font/local";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import { FacebookPixelEvents } from "@/components/Metapixel";
import GTMPageView from "@/components/common/GTMPageView";
const CountryMismatchPopup = dynamic(() => import('@/components/otherPages/CountryMismatchPopup'), { ssr: false });
import { ShopFilterProvider } from "@/context/ShopFilterContext";
import { Toaster } from "react-hot-toast";
import IntlProviderClient from './IntlProviderClient';

const baseUrl = process.env.NEXT_PUBLIC_DEFAULT_ORIGIN || "https://ae.ahmedalmaghribi.com";

export async function generateMetadata({ params: { locale } }) {
  return {
    metadataBase: new URL(baseUrl),

    title: "Buy Best Perfumes Online | Ahmed Al Maghribi Perfumes",

    description:
      "Buy Best Perfumes Online Ahmed Al Maghribi Perfumes.",

    icons: {
      icon: "/assets/images/ahmed-favicon.png",
    },

    alternates: {
      canonical: `/${locale}`,

      languages: {
        en: `${baseUrl}/en`,
        ar: `${baseUrl}/ar`,
        "x-default": `${baseUrl}/en`,
      },
    },
  };
}

// Import English font
const englishFont = localFont({
  src: "../../public/assets/fonts/wulkan/WulkanDisplayRegular.ttf",
  display: "swap",
});

// Import Arabic font
const arabicFont = localFont({
  src: "../../public/assets/fonts/alexandria-arabic/static/Alexandria-Regular.ttf",
  display: "swap",
});

// Import Lato Regular font as a secondary font
const sofiaFont = localFont({
  src: "../../public/assets/fonts/kanit/Kanit-Regular.ttf",
  display: "swap",
});

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

  // Dynamic CSS imports deferred to client-side
  const NonCriticalCSS = dynamic(() => import('@/components/common/NonCriticalCSS'), { ssr: false });

  let initialMenuData = null;
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}api/productCategoriesTemp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({}),
      next: { revalidate: 60 } // Cache for 60 seconds
    });
    if (res.ok) {
      initialMenuData = await res.json();
    }
  } catch (err) {
    console.error("Failed to fetch menu data on server:", err);
  }

  return (
    <div
      lang={locale}
      dir={locale === "ar" ? "rtl" : "ltr"}
      className={selectedFont.className}
    >

      <Script id="gtm-script" strategy="lazyOnload">
        {`
          (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
          new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
          j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
          'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
          })(window,document,'script','dataLayer','${GTM_ID}');
        `}
      </Script>

      <Script id="tiktok-pixel" strategy="lazyOnload">
        {`
          !function (w, d, t) {
            w.TiktokAnalyticsObject=t;var ttq=w[t]=w[t]||[];ttq.methods=["page","track","identify","instances","debug","on","off","once","ready","alias","group","enableCookie","disableCookie","holdConsent","revokeConsent","grantConsent"],ttq.setAndDefer=function(t,e){t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}};for(var i=0;i<ttq.methods.length;i++)ttq.setAndDefer(ttq,ttq.methods[i]);ttq.instance=function(t){for(var e=ttq._i[t]||[],n=0;n<ttq.methods.length;n++)ttq.setAndDefer(e,ttq.methods[n]);return e},ttq.load=function(e,n){var r="https://analytics.tiktok.com/i18n/pixel/events.js",o=n&&n.partner;ttq._i=ttq._i||{},ttq._i[e]=[],ttq._i[e]._u=r,ttq._t=ttq._t||{},ttq._t[e]=+new Date,ttq._o=ttq._o||{},ttq._o[e]=n||{};n=document.createElement("script");n.type="text/javascript",n.async=!0,n.src=r+"?sdkid="+e+"&lib="+t;e=document.getElementsByTagName("script")[0];e.parentNode.insertBefore(n,e)};
            ttq.load('CA6RMBBC77UC097ILMD0');
            ttq.page();
          }(window, document, 'ttq');
        `}
      </Script>

      <Script id="tiktok-listener" strategy="lazyOnload">
        {`
          (function(){
            // Ensure dataLayer exists
            window.dataLayer = window.dataLayer || [];

            // Save original push method
            const originalPush = window.dataLayer.push;

            // Override push to also send TikTok events
            window.dataLayer.push = function(){
              const args = Array.from(arguments);
              originalPush.apply(window.dataLayer, args);

              const eventObj = args[0];
              if(eventObj && eventObj.event){
                const ecommerce = eventObj.ecommerce || {};
                const items = ecommerce.items || [];

                switch(eventObj.event){
                  case "view_item":
                    window.ttq?.track("ViewContent", {
                      contents: items.map(i => ({
                        content_id: i.item_id,
                        content_type: "product",
                        content_name: i.item_name
                      })),
                      value: ecommerce.value,
                      currency: ecommerce.currency
                    });
                    break;

                  case "add_to_cart":
                    window.ttq?.track("AddToCart", {
                      contents: items.map(i => ({
                        content_id: i.item_id,
                        content_type: "product",
                        content_name: i.item_name
                      })),
                      value: ecommerce.value,
                      currency: ecommerce.currency
                    });
                    break;

                  case "begin_checkout":
                    window.ttq?.track("InitiateCheckout", {
                      contents: items.map(i => ({
                        content_id: i.item_id,
                        content_type: "product",
                        content_name: i.item_name
                      })),
                      value: ecommerce.value,
                      currency: ecommerce.currency
                    });
                    break;

                  case "add_payment_info":
                    window.ttq?.track("AddPaymentInfo", {
                      contents: items.map(i => ({
                        content_id: i.item_id,
                        content_type: "product",
                        content_name: i.item_name
                      })),
                      value: ecommerce.value,
                      currency: ecommerce.currency
                    });
                    break;

                  case "purchase":
                    window.ttq?.track("Purchase", {
                      contents: items.map(i => ({
                        content_id: i.item_id,
                        content_type: "product",
                        content_name: i.item_name
                      })),
                      value: ecommerce.value,
                      currency: ecommerce.currency
                    });
                    break;

                  case "place_order": // custom GA4 event name if used
                    window.ttq?.track("PlaceAnOrder", {
                      contents: items.map(i => ({
                        content_id: i.item_id,
                        content_type: "product",
                        content_name: i.item_name
                      })),
                      value: ecommerce.value,
                      currency: ecommerce.currency
                    });
                    break;

                  case "search":
                    window.ttq?.track("Search", {
                      contents: items.map(i => ({
                        content_id: i.item_id || "search", // fallback if no product_id
                        content_type: "product",
                        content_name: i.item_name || (eventObj.search_term || "search")
                      })),
                      value: ecommerce.value || 0,
                      currency: ecommerce.currency || "AED",
                      search_string: eventObj.search_term || ""
                    });
                    break;
                }
              }
            };
          })();
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


      <IntlProviderClient locale={locale} messages={messages}>
        <Svgs />
        <NonCriticalCSS />
        <MenuProvider initialData={initialMenuData}>
          <Context>
            <UserProvider>
              <FacebookPixelEvents />
              <MobileHeader />
              <ShopFilterProvider>
                {children}
                <MobileFooter1 />
                <GTMPageView />
                {/* Modals and Asides */}
                <LoginFormPopup />
                <SizeGuide />
                <Delivery />
                <CartDrawer />
                <SiteMap />
                <CustomerLogin />
                <ShopFilter />
                <ProductDescription />
                <ProductAdditionalInformation />
                <ProductReviews />
                <Toaster />
              </ShopFilterProvider>
            </UserProvider>
          </Context>
        </MenuProvider>
        <div className="page-overlay" id="pageOverlay"></div>
        <ScrollTop />
        <CountryMismatchPopup />
      </IntlProviderClient>
    </div>
  );
}
