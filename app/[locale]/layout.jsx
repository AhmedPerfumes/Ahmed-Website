import Svgs from "@/components/common/Svgs";
import "react-tooltip/dist/react-tooltip.css";
import "../../public/assets/css/plugins/swiper.min.css";
import "../../public/assets/sass/style.scss";
import "rc-slider/assets/index.css";
import "tippy.js/dist/tippy.css";
import LoginFormPopup from "@/components/common/LoginFormPopup";
// import { useEffect } from "react";
import ScrollTop from "@/components/common/ScrollTop";
import Context from "@/context/Context";
import { MenuProvider } from "@/context/MenuContext";
import { UserProvider } from "@/context/UserContext";
// import QuickView from "@/components/modals/QuickView";
import CartDrawer from "@/components/shopCartandCheckout/CartDrawer";
import SiteMap from "@/components/modals/SiteMap";
import NewsLetter from "@/components/modals/NewsLetter";
// import CookieContainer from "@/components/common/CookieContainer";
import MobileHeader from "@/components/headers/MobileHeader";
import SizeGuide from "@/components/modals/SizeGuide";
import Delivery from "@/components/modals/Delivery";
import CustomerLogin from "@/components/asides/CustomerLogin";
import ShopFilter from "@/components/asides/ShopFilter";
import ProductDescription from "@/components/asides/ProductDescription";
import ProductAdditionalInformation from "@/components/asides/ProductAdditionalInformation";
import ProductReviews from "@/components/asides/ProductReviews";
import MobileFooter1 from "@/components/footers/MobileFooter1";
import localFont from "next/font/local";
import {NextIntlClientProvider} from 'next-intl';
import {getMessages} from 'next-intl/server';
import {notFound} from 'next/navigation';
import {routing} from '@/i18n/routing';

const myFont = localFont({
  src: "../../public/assets/fonts/kanit/Kanit-Medium.ttf",
});

export default async  function LocaleLayout({ children, params: {locale} }) {
  // useEffect(() => {
  //   if (typeof window !== "undefined") {
  //     // Import the script only on the client side
  //     import("bootstrap/dist/js/bootstrap.esm").then(() => {
  //       // Module is imported, you can access any exported functionality if
  //     });

  //     localStorage.setItem("orderData", "");
  //     localStorage.setItem("cartList", []);
  //     localStorage.setItem("wishList", []);
  //   }
  // }, []);

  if (!routing.locales.includes(locale)) {
    notFound();
  }
 
  // Providing all messages to the client
  // side is the easiest way to get started
  const messages = await getMessages();

  return (
    <html lang={locale} dir={locale == 'ar' ? 'rtl' : 'ltr'}>
      <head>
        <link rel="preload" href="/assets/webp/1.webp" as="image" />
        <link rel="preload" href="/assets/webp/2.webp" as="image" />
        <link rel="preload" href="/assets/webp/3.webp" as="image" />
        <link rel="preload" href="/assets/webp/4.webp" as="image" />
        <link rel="preload" href="/assets/webp/5.webp" as="image" />
        <link rel="preload" href="/assets/webp/6.webp" as="image" />
        <link rel="preload" href="/assets/webp/7.webp" as="image" />
        <link rel="preload" href="/assets/webp/8.webp" as="image" />
        <link rel="preload" href="/assets/webp/9.webp" as="image" />
        <link rel="preload" href="/assets/webp/10.webp" as="image" />
        <link rel="preload" href="/assets/webp/11.webp" as="image" />
        <link rel="preload" href="/assets/webp/12.webp" as="image" />
        <link rel="preload" href="/assets/webp/13.webp" as="image" />
        <link rel="preload" href="/assets/webp/14.webp" as="image" />
        <link rel="preload" href="/assets/webp/15.webp" as="image" />
        <link rel="preload" href="/assets/webp/16.webp" as="image" />
        <link rel="preload" href="/assets/webp/17.webp" as="image" />
        <link rel="preload" href="/assets/webp/18.webp" as="image" />
        <link rel="preload" href="/assets/webp/19.webp" as="image" />
        <link rel="preload" href="/assets/webp/20.webp" as="image" />
        <link rel="preload" href="/assets/webp/21.webp" as="image" />
        <link rel="preload" href="/assets/webp/22.webp" as="image" />
        <link rel="preload" href="/assets/webp/23.webp" as="image" />
        <link rel="preload" href="/assets/webp/24.webp" as="image" />
        <link rel="preload" href="/assets/webp/25.webp" as="image" />
        <link rel="preload" href="/assets/webp/26.webp" as="image" />
        <link rel="preload" href="/assets/webp/27.webp" as="image" />
        <link rel="preload" href="/assets/webp/28.webp" as="image" />
        <link rel="preload" href="/assets/webp/29.webp" as="image" />
        <link rel="preload" href="/assets/webp/30.webp" as="image" />
        <link rel="preload" href="/assets/webp/31.webp" as="image" />
        <link rel="preload" href="/assets/webp/32.webp" as="image" />
        <link rel="preload" href="/assets/webp/33.webp" as="image" />
        <link rel="preload" href="/assets/webp/34.webp" as="image" />
        <link rel="preload" href="/assets/webp/35.webp" as="image" />
        <link rel="preload" href="/assets/webp/36.webp" as="image" />
        <link rel="preload" href="/assets/webp/37.webp" as="image" />
        <link rel="preload" href="/assets/webp/38.webp" as="image" />
        <link rel="preload" href="/assets/webp/39.webp" as="image" />
        <link rel="preload" href="/assets/webp/40.webp" as="image" />
        <link rel="preload" href="/assets/webp/41.webp" as="image" />
        <link rel="preload" href="/assets/webp/42.webp" as="image" />
        <link rel="preload" href="/assets/webp/43.webp" as="image" />
        <link rel="preload" href="/assets/webp/44.webp" as="image" />
        <link rel="preload" href="/assets/webp/45.webp" as="image" />
        <link rel="preload" href="/assets/webp/46.webp" as="image" />
        <link rel="preload" href="/assets/webp/47.webp" as="image" />
        <link rel="preload" href="/assets/webp/48.webp" as="image" />
        <link rel="preload" href="/assets/webp/49.webp" as="image" />
        <link rel="preload" href="/assets/webp/50.webp" as="image" />

        <link rel="preload" href="/assets/webp/51.webp" as="image" />
        <link rel="preload" href="/assets/webp/52.webp" as="image" />
        <link rel="preload" href="/assets/webp/53.webp" as="image" />
        <link rel="preload" href="/assets/webp/54.webp" as="image" />
        <link rel="preload" href="/assets/webp/55.webp" as="image" />
        <link rel="preload" href="/assets/webp/56.webp" as="image" />
        <link rel="preload" href="/assets/webp/57.webp" as="image" />
        <link rel="preload" href="/assets/webp/58.webp" as="image" />
        <link rel="preload" href="/assets/webp/59.webp" as="image" />
        <link rel="preload" href="/assets/webp/60.webp" as="image" />
        <link rel="preload" href="/assets/webp/61.webp" as="image" />
        <link rel="preload" href="/assets/webp/62.webp" as="image" />
        <link rel="preload" href="/assets/webp/63.webp" as="image" />
        <link rel="preload" href="/assets/webp/64.webp" as="image" />
        <link rel="preload" href="/assets/webp/65.webp" as="image" />
        <link rel="preload" href="/assets/webp/66.webp" as="image" />
        <link rel="preload" href="/assets/webp/67.webp" as="image" />
        <link rel="preload" href="/assets/webp/68.webp" as="image" />
        <link rel="preload" href="/assets/webp/69.webp" as="image" />
        <link rel="preload" href="/assets/webp/70.webp" as="image" />
        <link rel="preload" href="/assets/webp/71.webp" as="image" />
        <link rel="preload" href="/assets/webp/72.webp" as="image" />
        <link rel="preload" href="/assets/webp/73.webp" as="image" />
        <link rel="preload" href="/assets/webp/74.webp" as="image" />
        <link rel="preload" href="/assets/webp/75.webp" as="image" />
        <link rel="preload" href="/assets/webp/76.webp" as="image" />
        <link rel="preload" href="/assets/webp/77.webp" as="image" />
        <link rel="preload" href="/assets/webp/78.webp" as="image" />
        <link rel="preload" href="/assets/webp/79.webp" as="image" />
        <link rel="preload" href="/assets/webp/80.webp" as="image" />
        <link rel="preload" href="/assets/webp/81.webp" as="image" />
        <link rel="preload" href="/assets/webp/82.webp" as="image" />
        <link rel="preload" href="/assets/webp/83.webp" as="image" />
        <link rel="preload" href="/assets/webp/84.webp" as="image" />
        <link rel="preload" href="/assets/webp/85.webp" as="image" />
        <link rel="preload" href="/assets/webp/86.webp" as="image" />
        <link rel="preload" href="/assets/webp/87.webp" as="image" />
        <link rel="preload" href="/assets/webp/88.webp" as="image" />
        <link rel="preload" href="/assets/webp/89.webp" as="image" />
        <link rel="preload" href="/assets/webp/90.webp" as="image" />
        <link rel="preload" href="/assets/webp/91.webp" as="image" />
        <link rel="preload" href="/assets/webp/92.webp" as="image" />
        <link rel="preload" href="/assets/webp/93.webp" as="image" />
        <link rel="preload" href="/assets/webp/94.webp" as="image" />
        <link rel="preload" href="/assets/webp/95.webp" as="image" />
        <link rel="preload" href="/assets/webp/96.webp" as="image" />
        <link rel="preload" href="/assets/webp/97.webp" as="image" />
        <link rel="preload" href="/assets/webp/98.webp" as="image" />
        <link rel="preload" href="/assets/webp/99.webp" as="image" />
        <link rel="preload" href="/assets/webp/100.webp" as="image" />

        <link rel="preload" href="/assets/webp/101.webp" as="image" />
        <link rel="preload" href="/assets/webp/102.webp" as="image" />
        <link rel="preload" href="/assets/webp/103.webp" as="image" />
        <link rel="preload" href="/assets/webp/104.webp" as="image" />
        <link rel="preload" href="/assets/webp/105.webp" as="image" />
        <link rel="preload" href="/assets/webp/106.webp" as="image" />
        <link rel="preload" href="/assets/webp/107.webp" as="image" />
        <link rel="preload" href="/assets/webp/108.webp" as="image" />
        <link rel="preload" href="/assets/webp/109.webp" as="image" />
        <link rel="preload" href="/assets/webp/110.webp" as="image" />
        <link rel="preload" href="/assets/webp/111.webp" as="image" />
        <link rel="preload" href="/assets/webp/112.webp" as="image" />
        <link rel="preload" href="/assets/webp/113.webp" as="image" />
        <link rel="preload" href="/assets/webp/114.webp" as="image" />
        <link rel="preload" href="/assets/webp/115.webp" as="image" />
        <link rel="preload" href="/assets/webp/116.webp" as="image" />
        <link rel="preload" href="/assets/webp/117.webp" as="image" />
        <link rel="preload" href="/assets/webp/118.webp" as="image" />
        <link rel="preload" href="/assets/webp/119.webp" as="image" />
        <link rel="preload" href="/assets/webp/120.webp" as="image" />
        <link rel="preload" href="/assets/webp/121.webp" as="image" />
        <link rel="preload" href="/assets/webp/122.webp" as="image" />
        <link rel="preload" href="/assets/webp/123.webp" as="image" />
        <link rel="preload" href="/assets/webp/124.webp" as="image" />
        <link rel="preload" href="/assets/webp/125.webp" as="image" />
        <link rel="preload" href="/assets/webp/126.webp" as="image" />
        <link rel="preload" href="/assets/webp/127.webp" as="image" />
        <link rel="preload" href="/assets/webp/128.webp" as="image" />
        <link rel="preload" href="/assets/webp/129.webp" as="image" />
        <link rel="preload" href="/assets/webp/130.webp" as="image" />
        <link rel="preload" href="/assets/webp/131.webp" as="image" />
        <link rel="preload" href="/assets/webp/132.webp" as="image" />
        <link rel="preload" href="/assets/webp/133.webp" as="image" />
        <link rel="preload" href="/assets/webp/134.webp" as="image" />
        <link rel="preload" href="/assets/webp/135.webp" as="image" />
        <link rel="preload" href="/assets/webp/136.webp" as="image" />
        <link rel="preload" href="/assets/webp/137.webp" as="image" />
        <link rel="preload" href="/assets/webp/138.webp" as="image" />
        <link rel="preload" href="/assets/webp/139.webp" as="image" />
        <link rel="preload" href="/assets/webp/140.webp" as="image" />
        <link rel="preload" href="/assets/webp/141.webp" as="image" />
        <link rel="preload" href="/assets/webp/142.webp" as="image" />
        <link rel="preload" href="/assets/webp/143.webp" as="image" />
        <link rel="preload" href="/assets/webp/144.webp" as="image" />
        <link rel="preload" href="/assets/webp/145.webp" as="image" />
        <link rel="preload" href="/assets/webp/146.webp" as="image" />
        <link rel="preload" href="/assets/webp/147.webp" as="image" />
        <link rel="preload" href="/assets/webp/148.webp" as="image" />
        <link rel="preload" href="/assets/webp/149.webp" as="image" />
        <link rel="preload" href="/assets/webp/150.webp" as="image" />
      </head>
      <body className={myFont.className}>
      <NextIntlClientProvider messages={messages}>
        <Svgs />
        <Context>
          <UserProvider>
            <MenuProvider>
              <MobileHeader />
                {children}
              <MobileFooter1 />
              {/* //modals and asides */}
              <LoginFormPopup />
              {/* <QuickView /> */}
              {/* <NewsLetter /> */}
              {/* <CookieContainer /> */}
              <SizeGuide />
              <Delivery />
              <CartDrawer />
              <SiteMap />
              <CustomerLogin />
              {/* <ShopFilter /> */}
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
