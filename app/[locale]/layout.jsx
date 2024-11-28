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
        <link rel="preload" href="/assets/mobilescreencompressed/1-min.jpg" as="image" />
        <link rel="preload" href="/assets/mobilescreencompressed/2-min.jpg" as="image" />
        <link rel="preload" href="/assets/mobilescreencompressed/3-min.jpg" as="image" />
        <link rel="preload" href="/assets/mobilescreencompressed/4-min.jpg" as="image" />
        <link rel="preload" href="/assets/mobilescreencompressed/5-min.jpg" as="image" />
        <link rel="preload" href="/assets/mobilescreencompressed/6-min.jpg" as="image" />
        <link rel="preload" href="/assets/mobilescreencompressed/7-min.jpg" as="image" />
        <link rel="preload" href="/assets/mobilescreencompressed/8-min.jpg" as="image" />
        <link rel="preload" href="/assets/mobilescreencompressed/9-min.jpg" as="image" />
        <link rel="preload" href="/assets/mobilescreencompressed/10-min.jpg" as="image" />
        <link rel="preload" href="/assets/mobilescreencompressed/11-min.jpg" as="image" />
        <link rel="preload" href="/assets/mobilescreencompressed/12-min.jpg" as="image" />
        <link rel="preload" href="/assets/mobilescreencompressed/13-min.jpg" as="image" />
        <link rel="preload" href="/assets/mobilescreencompressed/14-min.jpg" as="image" />
        <link rel="preload" href="/assets/mobilescreencompressed/15-min.jpg" as="image" />
        <link rel="preload" href="/assets/mobilescreencompressed/16-min.jpg" as="image" />
        <link rel="preload" href="/assets/mobilescreencompressed/17-min.jpg" as="image" />
        <link rel="preload" href="/assets/mobilescreencompressed/18-min.jpg" as="image" />
        <link rel="preload" href="/assets/mobilescreencompressed/19-min.jpg" as="image" />
        <link rel="preload" href="/assets/mobilescreencompressed/20-min.jpg" as="image" />
        <link rel="preload" href="/assets/mobilescreencompressed/21-min.jpg" as="image" />
        {/* <link rel="preload" href="/assets/mobilescreencompressed/22-min.jpg" as="image" /> */}
        <link rel="preload" href="/assets/mobilescreencompressed/23-min.jpg" as="image" />
        <link rel="preload" href="/assets/mobilescreencompressed/24-min.jpg" as="image" />
        <link rel="preload" href="/assets/mobilescreencompressed/25-min.jpg" as="image" />
        <link rel="preload" href="/assets/mobilescreencompressed/26-min.jpg" as="image" />
        <link rel="preload" href="/assets/mobilescreencompressed/27-min.jpg" as="image" />
        <link rel="preload" href="/assets/mobilescreencompressed/28-min.jpg" as="image" />
        <link rel="preload" href="/assets/mobilescreencompressed/29-min.jpg" as="image" />
        <link rel="preload" href="/assets/mobilescreencompressed/30-min.jpg" as="image" />
        <link rel="preload" href="/assets/mobilescreencompressed/31-min.jpg" as="image" />
        <link rel="preload" href="/assets/mobilescreencompressed/32-min.jpg" as="image" />
        <link rel="preload" href="/assets/mobilescreencompressed/33-min.jpg" as="image" />
        <link rel="preload" href="/assets/mobilescreencompressed/34-min.jpg" as="image" />
        <link rel="preload" href="/assets/mobilescreencompressed/35-min.jpg" as="image" />
        <link rel="preload" href="/assets/mobilescreencompressed/36-min.jpg" as="image" />
        <link rel="preload" href="/assets/mobilescreencompressed/37-min.jpg" as="image" />
        <link rel="preload" href="/assets/mobilescreencompressed/38-min.jpg" as="image" />
        <link rel="preload" href="/assets/mobilescreencompressed/39-min.jpg" as="image" />
        <link rel="preload" href="/assets/mobilescreencompressed/40-min.jpg" as="image" />
        <link rel="preload" href="/assets/mobilescreencompressed/41-min.jpg" as="image" />
        <link rel="preload" href="/assets/mobilescreencompressed/42-min.jpg" as="image" />
        <link rel="preload" href="/assets/mobilescreencompressed/43-min.jpg" as="image" />
        <link rel="preload" href="/assets/mobilescreencompressed/44-min.jpg" as="image" />
        <link rel="preload" href="/assets/mobilescreencompressed/45-min.jpg" as="image" />
        <link rel="preload" href="/assets/mobilescreencompressed/46-min.jpg" as="image" />
        <link rel="preload" href="/assets/mobilescreencompressed/47-min.jpg" as="image" />
        <link rel="preload" href="/assets/mobilescreencompressed/48-min.jpg" as="image" />
        <link rel="preload" href="/assets/mobilescreencompressed/49-min.jpg" as="image" />
        <link rel="preload" href="/assets/mobilescreencompressed/50-min.jpg" as="image" />

        <link rel="preload" href="/assets/mobilescreencompressed/51-min.jpg" as="image" />
        <link rel="preload" href="/assets/mobilescreencompressed/52-min.jpg" as="image" />
        <link rel="preload" href="/assets/mobilescreencompressed/53-min.jpg" as="image" />
        <link rel="preload" href="/assets/mobilescreencompressed/54-min.jpg" as="image" />
        <link rel="preload" href="/assets/mobilescreencompressed/55-min.jpg" as="image" />
        <link rel="preload" href="/assets/mobilescreencompressed/56-min.jpg" as="image" />
        <link rel="preload" href="/assets/mobilescreencompressed/57-min.jpg" as="image" />
        <link rel="preload" href="/assets/mobilescreencompressed/58-min.jpg" as="image" />
        <link rel="preload" href="/assets/mobilescreencompressed/59-min.jpg" as="image" />
        <link rel="preload" href="/assets/mobilescreencompressed/60-min.jpg" as="image" />
        <link rel="preload" href="/assets/mobilescreencompressed/61-min.jpg" as="image" />
        <link rel="preload" href="/assets/mobilescreencompressed/62-min.jpg" as="image" />
        <link rel="preload" href="/assets/mobilescreencompressed/63-min.jpg" as="image" />
        <link rel="preload" href="/assets/mobilescreencompressed/64-min.jpg" as="image" />
        <link rel="preload" href="/assets/mobilescreencompressed/65-min.jpg" as="image" />
        <link rel="preload" href="/assets/mobilescreencompressed/66-min.jpg" as="image" />
        <link rel="preload" href="/assets/mobilescreencompressed/67-min.jpg" as="image" />
        <link rel="preload" href="/assets/mobilescreencompressed/68-min.jpg" as="image" />
        <link rel="preload" href="/assets/mobilescreencompressed/69-min.jpg" as="image" />
        <link rel="preload" href="/assets/mobilescreencompressed/70-min.jpg" as="image" />
        <link rel="preload" href="/assets/mobilescreencompressed/71-min.jpg" as="image" />
        <link rel="preload" href="/assets/mobilescreencompressed/72-min.jpg" as="image" />
        <link rel="preload" href="/assets/mobilescreencompressed/73-min.jpg" as="image" />
        <link rel="preload" href="/assets/mobilescreencompressed/74-min.jpg" as="image" />
        <link rel="preload" href="/assets/mobilescreencompressed/75-min.jpg" as="image" />
        <link rel="preload" href="/assets/mobilescreencompressed/76-min.jpg" as="image" />
        <link rel="preload" href="/assets/mobilescreencompressed/77-min.jpg" as="image" />
        <link rel="preload" href="/assets/mobilescreencompressed/78-min.jpg" as="image" />
        <link rel="preload" href="/assets/mobilescreencompressed/79-min.jpg" as="image" />
        <link rel="preload" href="/assets/mobilescreencompressed/80-min.jpg" as="image" />
        <link rel="preload" href="/assets/mobilescreencompressed/81-min.jpg" as="image" />
        <link rel="preload" href="/assets/mobilescreencompressed/82-min.jpg" as="image" />
        <link rel="preload" href="/assets/mobilescreencompressed/83-min.jpg" as="image" />
        <link rel="preload" href="/assets/mobilescreencompressed/84-min.jpg" as="image" />
        <link rel="preload" href="/assets/mobilescreencompressed/85-min.jpg" as="image" />
        <link rel="preload" href="/assets/mobilescreencompressed/86-min.jpg" as="image" />
        <link rel="preload" href="/assets/mobilescreencompressed/87-min.jpg" as="image" />
        <link rel="preload" href="/assets/mobilescreencompressed/88-min.jpg" as="image" />
        <link rel="preload" href="/assets/mobilescreencompressed/89-min.jpg" as="image" />
        <link rel="preload" href="/assets/mobilescreencompressed/90-min.jpg" as="image" />
        <link rel="preload" href="/assets/mobilescreencompressed/91-min.jpg" as="image" />
        <link rel="preload" href="/assets/mobilescreencompressed/92-min.jpg" as="image" />
        <link rel="preload" href="/assets/mobilescreencompressed/93-min.jpg" as="image" />
        <link rel="preload" href="/assets/mobilescreencompressed/94-min.jpg" as="image" />
        <link rel="preload" href="/assets/mobilescreencompressed/95-min.jpg" as="image" />
        <link rel="preload" href="/assets/mobilescreencompressed/96-min.jpg" as="image" />
        <link rel="preload" href="/assets/mobilescreencompressed/97-min.jpg" as="image" />
        <link rel="preload" href="/assets/mobilescreencompressed/98-min.jpg" as="image" />
        <link rel="preload" href="/assets/mobilescreencompressed/99-min.jpg" as="image" />
        <link rel="preload" href="/assets/mobilescreencompressed/100-min.jpg" as="image" />

        <link rel="preload" href="/assets/mobilescreencompressed/101-min.jpg" as="image" />
        <link rel="preload" href="/assets/mobilescreencompressed/102-min.jpg" as="image" />
        <link rel="preload" href="/assets/mobilescreencompressed/103-min.jpg" as="image" />
        <link rel="preload" href="/assets/mobilescreencompressed/104-min.jpg" as="image" />
        <link rel="preload" href="/assets/mobilescreencompressed/105-min.jpg" as="image" />
        <link rel="preload" href="/assets/mobilescreencompressed/106-min.jpg" as="image" />
        <link rel="preload" href="/assets/mobilescreencompressed/107-min.jpg" as="image" />
        <link rel="preload" href="/assets/mobilescreencompressed/108-min.jpg" as="image" />
        <link rel="preload" href="/assets/mobilescreencompressed/109-min.jpg" as="image" />
        <link rel="preload" href="/assets/mobilescreencompressed/110-min.jpg" as="image" />
        <link rel="preload" href="/assets/mobilescreencompressed/111-min.jpg" as="image" />
        <link rel="preload" href="/assets/mobilescreencompressed/112-min.jpg" as="image" />
        <link rel="preload" href="/assets/mobilescreencompressed/113-min.jpg" as="image" />
        <link rel="preload" href="/assets/mobilescreencompressed/114-min.jpg" as="image" />
        <link rel="preload" href="/assets/mobilescreencompressed/115-min.jpg" as="image" />
        <link rel="preload" href="/assets/mobilescreencompressed/116-min.jpg" as="image" />
        <link rel="preload" href="/assets/mobilescreencompressed/117-min.jpg" as="image" />
        <link rel="preload" href="/assets/mobilescreencompressed/118-min.jpg" as="image" />
        <link rel="preload" href="/assets/mobilescreencompressed/119-min.jpg" as="image" />
        <link rel="preload" href="/assets/mobilescreencompressed/120-min.jpg" as="image" />
        <link rel="preload" href="/assets/mobilescreencompressed/121-min.jpg" as="image" />
        <link rel="preload" href="/assets/mobilescreencompressed/122-min.jpg" as="image" />
        <link rel="preload" href="/assets/mobilescreencompressed/123-min.jpg" as="image" />
        <link rel="preload" href="/assets/mobilescreencompressed/124-min.jpg" as="image" />
        <link rel="preload" href="/assets/mobilescreencompressed/125-min.jpg" as="image" />
        <link rel="preload" href="/assets/mobilescreencompressed/126-min.jpg" as="image" />
        <link rel="preload" href="/assets/mobilescreencompressed/127-min.jpg" as="image" />
        <link rel="preload" href="/assets/mobilescreencompressed/128-min.jpg" as="image" />
        <link rel="preload" href="/assets/mobilescreencompressed/129-min.jpg" as="image" />
        <link rel="preload" href="/assets/mobilescreencompressed/130-min.jpg" as="image" />
        <link rel="preload" href="/assets/mobilescreencompressed/131-min.jpg" as="image" />
        <link rel="preload" href="/assets/mobilescreencompressed/132-min.jpg" as="image" />
        <link rel="preload" href="/assets/mobilescreencompressed/133-min.jpg" as="image" />
        <link rel="preload" href="/assets/mobilescreencompressed/134-min.jpg" as="image" />
        <link rel="preload" href="/assets/mobilescreencompressed/135-min.jpg" as="image" />
        <link rel="preload" href="/assets/mobilescreencompressed/136-min.jpg" as="image" />
        <link rel="preload" href="/assets/mobilescreencompressed/137-min.jpg" as="image" />
        <link rel="preload" href="/assets/mobilescreencompressed/138-min.jpg" as="image" />
        <link rel="preload" href="/assets/mobilescreencompressed/139-min.jpg" as="image" />
        <link rel="preload" href="/assets/mobilescreencompressed/140-min.jpg" as="image" />
        <link rel="preload" href="/assets/mobilescreencompressed/141-min.jpg" as="image" />
        <link rel="preload" href="/assets/mobilescreencompressed/142-min.jpg" as="image" />
        <link rel="preload" href="/assets/mobilescreencompressed/143-min.jpg" as="image" />
        <link rel="preload" href="/assets/mobilescreencompressed/144-min.jpg" as="image" />
        <link rel="preload" href="/assets/mobilescreencompressed/145-min.jpg" as="image" />
        <link rel="preload" href="/assets/mobilescreencompressed/146-min.jpg" as="image" />
        <link rel="preload" href="/assets/mobilescreencompressed/147-min.jpg" as="image" />
        {/* <link rel="preload" href="/assets/mobilescreencompressed/148-min.jpg" as="image" /> */}
        <link rel="preload" href="/assets/mobilescreencompressed/149-min.jpg" as="image" />
        <link rel="preload" href="/assets/mobilescreencompressed/150-min.jpg" as="image" />

        <link rel="preload" href="/assets/mobilescreencompressed/151-min.jpg" as="image" />
        <link rel="preload" href="/assets/mobilescreencompressed/152-min.jpg" as="image" />
        <link rel="preload" href="/assets/mobilescreencompressed/153-min.jpg" as="image" />
        <link rel="preload" href="/assets/mobilescreencompressed/154-min.jpg" as="image" />
        <link rel="preload" href="/assets/mobilescreencompressed/155-min.jpg" as="image" />
        <link rel="preload" href="/assets/mobilescreencompressed/156-min.jpg" as="image" />
        <link rel="preload" href="/assets/mobilescreencompressed/157-min.jpg" as="image" />
        <link rel="preload" href="/assets/mobilescreencompressed/158-min.jpg" as="image" />
        <link rel="preload" href="/assets/mobilescreencompressed/159-min.jpg" as="image" />
        <link rel="preload" href="/assets/mobilescreencompressed/160-min.jpg" as="image" />
        <link rel="preload" href="/assets/mobilescreencompressed/161-min.jpg" as="image" />
        <link rel="preload" href="/assets/mobilescreencompressed/162-min.jpg" as="image" />
        <link rel="preload" href="/assets/mobilescreencompressed/163-min.jpg" as="image" />
        <link rel="preload" href="/assets/mobilescreencompressed/164-min.jpg" as="image" />
        <link rel="preload" href="/assets/mobilescreencompressed/165-min.jpg" as="image" />
        <link rel="preload" href="/assets/mobilescreencompressed/166-min.jpg" as="image" />
        <link rel="preload" href="/assets/mobilescreencompressed/167-min.jpg" as="image" />
        <link rel="preload" href="/assets/mobilescreencompressed/168-min.jpg" as="image" />
        <link rel="preload" href="/assets/mobilescreencompressed/169-min.jpg" as="image" />
        <link rel="preload" href="/assets/mobilescreencompressed/170-min.jpg" as="image" />
        <link rel="preload" href="/assets/mobilescreencompressed/171-min.jpg" as="image" />
        <link rel="preload" href="/assets/mobilescreencompressed/172-min.jpg" as="image" />
        <link rel="preload" href="/assets/mobilescreencompressed/173-min.jpg" as="image" />
        <link rel="preload" href="/assets/mobilescreencompressed/174-min.jpg" as="image" />
        <link rel="preload" href="/assets/mobilescreencompressed/175-min.jpg" as="image" />
        <link rel="preload" href="/assets/mobilescreencompressed/176-min.jpg" as="image" />
        <link rel="preload" href="/assets/mobilescreencompressed/177-min.jpg" as="image" />
        <link rel="preload" href="/assets/mobilescreencompressed/178-min.jpg" as="image" />
        <link rel="preload" href="/assets/mobilescreencompressed/179-min.jpg" as="image" />
        <link rel="preload" href="/assets/mobilescreencompressed/180-min.jpg" as="image" />
        <link rel="preload" href="/assets/mobilescreencompressed/181-min.jpg" as="image" />
        <link rel="preload" href="/assets/mobilescreencompressed/182-min.jpg" as="image" />
        <link rel="preload" href="/assets/mobilescreencompressed/183-min.jpg" as="image" />
        <link rel="preload" href="/assets/mobilescreencompressed/184-min.jpg" as="image" />
        <link rel="preload" href="/assets/mobilescreencompressed/185-min.jpg" as="image" />
        <link rel="preload" href="/assets/mobilescreencompressed/186-min.jpg" as="image" />
        <link rel="preload" href="/assets/mobilescreencompressed/187-min.jpg" as="image" />
        <link rel="preload" href="/assets/mobilescreencompressed/188-min.jpg" as="image" />
        <link rel="preload" href="/assets/mobilescreencompressed/189-min.jpg" as="image" />
        <link rel="preload" href="/assets/mobilescreencompressed/190-min.jpg" as="image" />
        <link rel="preload" href="/assets/mobilescreencompressed/191-min.jpg" as="image" />
        <link rel="preload" href="/assets/mobilescreencompressed/192-min.jpg" as="image" />
        <link rel="preload" href="/assets/mobilescreencompressed/193-min.jpg" as="image" />
        <link rel="preload" href="/assets/mobilescreencompressed/194-min.jpg" as="image" />
        <link rel="preload" href="/assets/mobilescreencompressed/195-min.jpg" as="image" />
        <link rel="preload" href="/assets/mobilescreencompressed/196-min.jpg" as="image" />
        <link rel="preload" href="/assets/mobilescreencompressed/197-min.jpg" as="image" />
        <link rel="preload" href="/assets/mobilescreencompressed/198-min.jpg" as="image" />
        <link rel="preload" href="/assets/mobilescreencompressed/199-min.jpg" as="image" />
        <link rel="preload" href="/assets/mobilescreencompressed/200-min.jpg" as="image" />

        <link rel="preload" href="/assets/mobilescreencompressed/201-min.jpg" as="image" />
        <link rel="preload" href="/assets/mobilescreencompressed/202-min.jpg" as="image" />
        <link rel="preload" href="/assets/mobilescreencompressed/203-min.jpg" as="image" />
        <link rel="preload" href="/assets/mobilescreencompressed/204-min.jpg" as="image" />
        <link rel="preload" href="/assets/mobilescreencompressed/205-min.jpg" as="image" />
        <link rel="preload" href="/assets/mobilescreencompressed/206-min.jpg" as="image" />
        <link rel="preload" href="/assets/mobilescreencompressed/207-min.jpg" as="image" />
        <link rel="preload" href="/assets/mobilescreencompressed/208-min.jpg" as="image" />
        <link rel="preload" href="/assets/mobilescreencompressed/209-min.jpg" as="image" />
        <link rel="preload" href="/assets/mobilescreencompressed/210-min.jpg" as="image" />
        <link rel="preload" href="/assets/mobilescreencompressed/211-min.jpg" as="image" />
        <link rel="preload" href="/assets/mobilescreencompressed/212-min.jpg" as="image" />
        <link rel="preload" href="/assets/mobilescreencompressed/213-min.jpg" as="image" />
        <link rel="preload" href="/assets/mobilescreencompressed/214-min.jpg" as="image" />
        <link rel="preload" href="/assets/mobilescreencompressed/215-min.jpg" as="image" />
        <link rel="preload" href="/assets/mobilescreencompressed/216-min.jpg" as="image" />
        <link rel="preload" href="/assets/mobilescreencompressed/217-min.jpg" as="image" />
        <link rel="preload" href="/assets/mobilescreencompressed/218-min.jpg" as="image" />
        <link rel="preload" href="/assets/mobilescreencompressed/219-min.jpg" as="image" />
        <link rel="preload" href="/assets/mobilescreencompressed/220-min.jpg" as="image" />
        <link rel="preload" href="/assets/mobilescreencompressed/221-min.jpg" as="image" />
        <link rel="preload" href="/assets/mobilescreencompressed/222-min.jpg" as="image" />
        {/* <link rel="preload" href="/assets/mobilescreencompressed/223-min.jpg" as="image" />
        <link rel="preload" href="/assets/mobilescreencompressed/224-min.jpg" as="image" />
        <link rel="preload" href="/assets/mobilescreencompressed/225-min.jpg" as="image" />
        <link rel="preload" href="/assets/mobilescreencompressed/226-min.jpg" as="image" />
        <link rel="preload" href="/assets/mobilescreencompressed/227-min.jpg" as="image" />
        <link rel="preload" href="/assets/mobilescreencompressed/228-min.jpg" as="image" />
        <link rel="preload" href="/assets/mobilescreencompressed/229-min.jpg" as="image" />
        <link rel="preload" href="/assets/mobilescreencompressed/230-min.jpg" as="image" />
        <link rel="preload" href="/assets/mobilescreencompressed/231-min.jpg" as="image" />
        <link rel="preload" href="/assets/mobilescreencompressed/232-min.jpg" as="image" />
        <link rel="preload" href="/assets/mobilescreencompressed/233-min.jpg" as="image" />
        <link rel="preload" href="/assets/mobilescreencompressed/234-min.jpg" as="image" />
        <link rel="preload" href="/assets/mobilescreencompressed/235-min.jpg" as="image" />
        <link rel="preload" href="/assets/mobilescreencompressed/236-min.jpg" as="image" />
        <link rel="preload" href="/assets/mobilescreencompressed/237-min.jpg" as="image" />
        <link rel="preload" href="/assets/mobilescreencompressed/238-min.jpg" as="image" />
        <link rel="preload" href="/assets/mobilescreencompressed/239-min.jpg" as="image" />
        <link rel="preload" href="/assets/mobilescreencompressed/240-min.jpg" as="image" />
        <link rel="preload" href="/assets/mobilescreencompressed/241-min.jpg" as="image" />
        <link rel="preload" href="/assets/mobilescreencompressed/242-min.jpg" as="image" />
        <link rel="preload" href="/assets/mobilescreencompressed/243-min.jpg" as="image" />
        <link rel="preload" href="/assets/mobilescreencompressed/244-min.jpg" as="image" /> */}
        <link rel="preload" href="/assets/mobilescreencompressed/245-min.jpg" as="image" />
        <link rel="preload" href="/assets/mobilescreencompressed/246-min.jpg" as="image" />
        <link rel="preload" href="/assets/mobilescreencompressed/247-min.jpg" as="image" />
        <link rel="preload" href="/assets/mobilescreencompressed/248-min.jpg" as="image" />
        <link rel="preload" href="/assets/mobilescreencompressed/249-min.jpg" as="image" />
        <link rel="preload" href="/assets/mobilescreencompressed/250-min.jpg" as="image" />

        <link rel="preload" href="/assets/mobilescreencompressed/251-min.jpg" as="image" />
        <link rel="preload" href="/assets/mobilescreencompressed/252-min.jpg" as="image" />
        <link rel="preload" href="/assets/mobilescreencompressed/253-min.jpg" as="image" />
        <link rel="preload" href="/assets/mobilescreencompressed/254-min.jpg" as="image" />
        <link rel="preload" href="/assets/mobilescreencompressed/255-min.jpg" as="image" />
        <link rel="preload" href="/assets/mobilescreencompressed/256-min.jpg" as="image" />
        <link rel="preload" href="/assets/mobilescreencompressed/257-min.jpg" as="image" />
        <link rel="preload" href="/assets/mobilescreencompressed/258-min.jpg" as="image" />
        <link rel="preload" href="/assets/mobilescreencompressed/259-min.jpg" as="image" />
        <link rel="preload" href="/assets/mobilescreencompressed/260-min.jpg" as="image" />
        <link rel="preload" href="/assets/mobilescreencompressed/261-min.jpg" as="image" />
        <link rel="preload" href="/assets/mobilescreencompressed/262-min.jpg" as="image" />
        <link rel="preload" href="/assets/mobilescreencompressed/263-min.jpg" as="image" />
        <link rel="preload" href="/assets/mobilescreencompressed/264-min.jpg" as="image" />
        <link rel="preload" href="/assets/mobilescreencompressed/265-min.jpg" as="image" />
        <link rel="preload" href="/assets/mobilescreencompressed/266-min.jpg" as="image" />
        <link rel="preload" href="/assets/mobilescreencompressed/267-min.jpg" as="image" />
        <link rel="preload" href="/assets/mobilescreencompressed/268-min.jpg" as="image" />
        <link rel="preload" href="/assets/mobilescreencompressed/269-min.jpg" as="image" />
        <link rel="preload" href="/assets/mobilescreencompressed/270-min.jpg" as="image" />
        <link rel="preload" href="/assets/mobilescreencompressed/271-min.jpg" as="image" />
        <link rel="preload" href="/assets/mobilescreencompressed/272-min.jpg" as="image" />
        <link rel="preload" href="/assets/mobilescreencompressed/273-min.jpg" as="image" />
        <link rel="preload" href="/assets/mobilescreencompressed/274-min.jpg" as="image" />
        <link rel="preload" href="/assets/mobilescreencompressed/275-min.jpg" as="image" />
        <link rel="preload" href="/assets/mobilescreencompressed/276-min.jpg" as="image" />
        <link rel="preload" href="/assets/mobilescreencompressed/277-min.jpg" as="image" />
        <link rel="preload" href="/assets/mobilescreencompressed/278-min.jpg" as="image" />
        <link rel="preload" href="/assets/mobilescreencompressed/279-min.jpg" as="image" />
        <link rel="preload" href="/assets/mobilescreencompressed/280-min.jpg" as="image" />
        <link rel="preload" href="/assets/mobilescreencompressed/281-min.jpg" as="image" />
        <link rel="preload" href="/assets/mobilescreencompressed/282-min.jpg" as="image" />
        <link rel="preload" href="/assets/mobilescreencompressed/283-min.jpg" as="image" />
        <link rel="preload" href="/assets/mobilescreencompressed/284-min.jpg" as="image" />
        <link rel="preload" href="/assets/mobilescreencompressed/285-min.jpg" as="image" />
        <link rel="preload" href="/assets/mobilescreencompressed/286-min.jpg" as="image" />
        <link rel="preload" href="/assets/mobilescreencompressed/287-min.jpg" as="image" />
        <link rel="preload" href="/assets/mobilescreencompressed/288-min.jpg" as="image" />
        <link rel="preload" href="/assets/mobilescreencompressed/289-min.jpg" as="image" />
        <link rel="preload" href="/assets/mobilescreencompressed/290-min.jpg" as="image" />
        <link rel="preload" href="/assets/mobilescreencompressed/291-min.jpg" as="image" />
        <link rel="preload" href="/assets/mobilescreencompressed/292-min.jpg" as="image" />
        <link rel="preload" href="/assets/mobilescreencompressed/293-min.jpg" as="image" />
        <link rel="preload" href="/assets/mobilescreencompressed/294-min.jpg" as="image" />
        <link rel="preload" href="/assets/mobilescreencompressed/295-min.jpg" as="image" />
        <link rel="preload" href="/assets/mobilescreencompressed/296-min.jpg" as="image" />
        <link rel="preload" href="/assets/mobilescreencompressed/297-min.jpg" as="image" />
        <link rel="preload" href="/assets/mobilescreencompressed/298-min.jpg" as="image" />
        <link rel="preload" href="/assets/mobilescreencompressed/299-min.jpg" as="image" />
        <link rel="preload" href="/assets/mobilescreencompressed/300-min.jpg" as="image" />

        <link rel="preload" href="/assets/mobilescreencompressed/301-min.jpg" as="image" />
        <link rel="preload" href="/assets/mobilescreencompressed/302-min.jpg" as="image" />
        <link rel="preload" href="/assets/mobilescreencompressed/303-min.jpg" as="image" />
        <link rel="preload" href="/assets/mobilescreencompressed/304-min.jpg" as="image" />
        <link rel="preload" href="/assets/mobilescreencompressed/305-min.jpg" as="image" />
        <link rel="preload" href="/assets/mobilescreencompressed/306-min.jpg" as="image" />
        <link rel="preload" href="/assets/mobilescreencompressed/307-min.jpg" as="image" />
        <link rel="preload" href="/assets/mobilescreencompressed/308-min.jpg" as="image" />
        <link rel="preload" href="/assets/mobilescreencompressed/309-min.jpg" as="image" />
        <link rel="preload" href="/assets/mobilescreencompressed/310-min.jpg" as="image" />
        <link rel="preload" href="/assets/mobilescreencompressed/311-min.jpg" as="image" />
        <link rel="preload" href="/assets/mobilescreencompressed/312-min.jpg" as="image" />
        <link rel="preload" href="/assets/mobilescreencompressed/313-min.jpg" as="image" />
        <link rel="preload" href="/assets/mobilescreencompressed/314-min.jpg" as="image" />
        <link rel="preload" href="/assets/mobilescreencompressed/315-min.jpg" as="image" />
        <link rel="preload" href="/assets/mobilescreencompressed/316-min.jpg" as="image" />
        <link rel="preload" href="/assets/mobilescreencompressed/317-min.jpg" as="image" />
        <link rel="preload" href="/assets/mobilescreencompressed/318-min.jpg" as="image" />
        <link rel="preload" href="/assets/mobilescreencompressed/319-min.jpg" as="image" />
        <link rel="preload" href="/assets/mobilescreencompressed/320-min.jpg" as="image" />
        <link rel="preload" href="/assets/mobilescreencompressed/321-min.jpg" as="image" />
        <link rel="preload" href="/assets/mobilescreencompressed/322-min.jpg" as="image" />
        <link rel="preload" href="/assets/mobilescreencompressed/323-min.jpg" as="image" />
        <link rel="preload" href="/assets/mobilescreencompressed/324-min.jpg" as="image" />
        <link rel="preload" href="/assets/mobilescreencompressed/325-min.jpg" as="image" />
        <link rel="preload" href="/assets/mobilescreencompressed/326-min.jpg" as="image" />
        <link rel="preload" href="/assets/mobilescreencompressed/327-min.jpg" as="image" />
        <link rel="preload" href="/assets/mobilescreencompressed/328-min.jpg" as="image" />
        <link rel="preload" href="/assets/mobilescreencompressed/329-min.jpg" as="image" />
        <link rel="preload" href="/assets/mobilescreencompressed/330-min.jpg" as="image" />
        <link rel="preload" href="/assets/mobilescreencompressed/331-min.jpg" as="image" />
        <link rel="preload" href="/assets/mobilescreencompressed/332-min.jpg" as="image" />
        <link rel="preload" href="/assets/mobilescreencompressed/333-min.jpg" as="image" />
        <link rel="preload" href="/assets/mobilescreencompressed/334-min.jpg" as="image" />
        <link rel="preload" href="/assets/mobilescreencompressed/335-min.jpg" as="image" />
        <link rel="preload" href="/assets/mobilescreencompressed/336-min.jpg" as="image" />
        <link rel="preload" href="/assets/mobilescreencompressed/337-min.jpg" as="image" />
        <link rel="preload" href="/assets/mobilescreencompressed/338-min.jpg" as="image" />
        <link rel="preload" href="/assets/mobilescreencompressed/339-min.jpg" as="image" />
        <link rel="preload" href="/assets/mobilescreencompressed/340-min.jpg" as="image" />
        <link rel="preload" href="/assets/mobilescreencompressed/341-min.jpg" as="image" />
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
