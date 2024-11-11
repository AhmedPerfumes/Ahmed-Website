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
import QuickView from "@/components/modals/QuickView";
import CartDrawer from "@/components/shopCartandCheckout/CartDrawer";
import SiteMap from "@/components/modals/SiteMap";
import NewsLetter from "@/components/modals/NewsLetter";
import CookieContainer from "@/components/common/CookieContainer";
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
      <head></head>
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
              <QuickView />
              <NewsLetter />
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
