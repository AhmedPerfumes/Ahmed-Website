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

        <link rel="preload" href="/assets/webp/151.webp" as="image" />
        <link rel="preload" href="/assets/webp/152.webp" as="image" />
        <link rel="preload" href="/assets/webp/153.webp" as="image" />
        <link rel="preload" href="/assets/webp/154.webp" as="image" />
        <link rel="preload" href="/assets/webp/155.webp" as="image" />
        <link rel="preload" href="/assets/webp/156.webp" as="image" />
        <link rel="preload" href="/assets/webp/157.webp" as="image" />
        <link rel="preload" href="/assets/webp/158.webp" as="image" />
        <link rel="preload" href="/assets/webp/159.webp" as="image" />
        <link rel="preload" href="/assets/webp/160.webp" as="image" />
        <link rel="preload" href="/assets/webp/161.webp" as="image" />
        <link rel="preload" href="/assets/webp/162.webp" as="image" />
        <link rel="preload" href="/assets/webp/163.webp" as="image" />
        <link rel="preload" href="/assets/webp/164.webp" as="image" />
        <link rel="preload" href="/assets/webp/165.webp" as="image" />
        <link rel="preload" href="/assets/webp/166.webp" as="image" />
        <link rel="preload" href="/assets/webp/167.webp" as="image" />
        <link rel="preload" href="/assets/webp/168.webp" as="image" />
        <link rel="preload" href="/assets/webp/169.webp" as="image" />
        <link rel="preload" href="/assets/webp/170.webp" as="image" />
        <link rel="preload" href="/assets/webp/171.webp" as="image" />
        <link rel="preload" href="/assets/webp/172.webp" as="image" />
        <link rel="preload" href="/assets/webp/173.webp" as="image" />
        <link rel="preload" href="/assets/webp/174.webp" as="image" />
        <link rel="preload" href="/assets/webp/175.webp" as="image" />
        <link rel="preload" href="/assets/webp/176.webp" as="image" />
        <link rel="preload" href="/assets/webp/177.webp" as="image" />
        <link rel="preload" href="/assets/webp/178.webp" as="image" />
        <link rel="preload" href="/assets/webp/179.webp" as="image" />
        <link rel="preload" href="/assets/webp/180.webp" as="image" />
        <link rel="preload" href="/assets/webp/181.webp" as="image" />
        <link rel="preload" href="/assets/webp/182.webp" as="image" />
        <link rel="preload" href="/assets/webp/183.webp" as="image" />
        <link rel="preload" href="/assets/webp/184.webp" as="image" />
        <link rel="preload" href="/assets/webp/185.webp" as="image" />
        <link rel="preload" href="/assets/webp/186.webp" as="image" />
        <link rel="preload" href="/assets/webp/187.webp" as="image" />
        <link rel="preload" href="/assets/webp/188.webp" as="image" />
        <link rel="preload" href="/assets/webp/189.webp" as="image" />
        <link rel="preload" href="/assets/webp/190.webp" as="image" />
        <link rel="preload" href="/assets/webp/191.webp" as="image" />
        <link rel="preload" href="/assets/webp/192.webp" as="image" />
        <link rel="preload" href="/assets/webp/193.webp" as="image" />
        <link rel="preload" href="/assets/webp/194.webp" as="image" />
        <link rel="preload" href="/assets/webp/195.webp" as="image" />
        <link rel="preload" href="/assets/webp/196.webp" as="image" />
        <link rel="preload" href="/assets/webp/197.webp" as="image" />
        <link rel="preload" href="/assets/webp/198.webp" as="image" />
        <link rel="preload" href="/assets/webp/199.webp" as="image" />
        <link rel="preload" href="/assets/webp/200.webp" as="image" />

        <link rel="preload" href="/assets/webp/201.webp" as="image" />
        <link rel="preload" href="/assets/webp/202.webp" as="image" />
        <link rel="preload" href="/assets/webp/203.webp" as="image" />
        <link rel="preload" href="/assets/webp/204.webp" as="image" />
        <link rel="preload" href="/assets/webp/205.webp" as="image" />
        <link rel="preload" href="/assets/webp/206.webp" as="image" />
        <link rel="preload" href="/assets/webp/207.webp" as="image" />
        <link rel="preload" href="/assets/webp/208.webp" as="image" />
        <link rel="preload" href="/assets/webp/209.webp" as="image" />
        <link rel="preload" href="/assets/webp/210.webp" as="image" />
        <link rel="preload" href="/assets/webp/211.webp" as="image" />
        <link rel="preload" href="/assets/webp/212.webp" as="image" />
        <link rel="preload" href="/assets/webp/213.webp" as="image" />
        <link rel="preload" href="/assets/webp/214.webp" as="image" />
        <link rel="preload" href="/assets/webp/215.webp" as="image" />
        <link rel="preload" href="/assets/webp/216.webp" as="image" />
        <link rel="preload" href="/assets/webp/217.webp" as="image" />
        <link rel="preload" href="/assets/webp/218.webp" as="image" />
        <link rel="preload" href="/assets/webp/219.webp" as="image" />
        <link rel="preload" href="/assets/webp/220.webp" as="image" />
        <link rel="preload" href="/assets/webp/221.webp" as="image" />
        <link rel="preload" href="/assets/webp/222.webp" as="image" />
        <link rel="preload" href="/assets/webp/223.webp" as="image" />
        <link rel="preload" href="/assets/webp/224.webp" as="image" />
        <link rel="preload" href="/assets/webp/225.webp" as="image" />
        <link rel="preload" href="/assets/webp/226.webp" as="image" />
        <link rel="preload" href="/assets/webp/227.webp" as="image" />
        <link rel="preload" href="/assets/webp/228.webp" as="image" />
        <link rel="preload" href="/assets/webp/229.webp" as="image" />
        <link rel="preload" href="/assets/webp/230.webp" as="image" />
        <link rel="preload" href="/assets/webp/231.webp" as="image" />
        <link rel="preload" href="/assets/webp/232.webp" as="image" />
        <link rel="preload" href="/assets/webp/233.webp" as="image" />
        <link rel="preload" href="/assets/webp/234.webp" as="image" />
        <link rel="preload" href="/assets/webp/235.webp" as="image" />
        <link rel="preload" href="/assets/webp/236.webp" as="image" />
        <link rel="preload" href="/assets/webp/237.webp" as="image" />
        <link rel="preload" href="/assets/webp/238.webp" as="image" />
        <link rel="preload" href="/assets/webp/239.webp" as="image" />
        <link rel="preload" href="/assets/webp/240.webp" as="image" />
        <link rel="preload" href="/assets/webp/241.webp" as="image" />
        <link rel="preload" href="/assets/webp/242.webp" as="image" />
        <link rel="preload" href="/assets/webp/243.webp" as="image" />
        <link rel="preload" href="/assets/webp/244.webp" as="image" />
        <link rel="preload" href="/assets/webp/245.webp" as="image" />
        <link rel="preload" href="/assets/webp/246.webp" as="image" />
        <link rel="preload" href="/assets/webp/247.webp" as="image" />
        <link rel="preload" href="/assets/webp/248.webp" as="image" />
        <link rel="preload" href="/assets/webp/249.webp" as="image" />
        <link rel="preload" href="/assets/webp/250.webp" as="image" />

        <link rel="preload" href="/assets/webp/251.webp" as="image" />
        <link rel="preload" href="/assets/webp/252.webp" as="image" />
        <link rel="preload" href="/assets/webp/253.webp" as="image" />
        <link rel="preload" href="/assets/webp/254.webp" as="image" />
        <link rel="preload" href="/assets/webp/255.webp" as="image" />
        <link rel="preload" href="/assets/webp/256.webp" as="image" />
        <link rel="preload" href="/assets/webp/257.webp" as="image" />
        <link rel="preload" href="/assets/webp/258.webp" as="image" />
        <link rel="preload" href="/assets/webp/259.webp" as="image" />
        <link rel="preload" href="/assets/webp/260.webp" as="image" />
        <link rel="preload" href="/assets/webp/261.webp" as="image" />
        <link rel="preload" href="/assets/webp/262.webp" as="image" />
        <link rel="preload" href="/assets/webp/263.webp" as="image" />
        <link rel="preload" href="/assets/webp/264.webp" as="image" />
        <link rel="preload" href="/assets/webp/265.webp" as="image" />
        <link rel="preload" href="/assets/webp/266.webp" as="image" />
        <link rel="preload" href="/assets/webp/267.webp" as="image" />
        <link rel="preload" href="/assets/webp/268.webp" as="image" />
        <link rel="preload" href="/assets/webp/269.webp" as="image" />
        <link rel="preload" href="/assets/webp/270.webp" as="image" />
        <link rel="preload" href="/assets/webp/271.webp" as="image" />
        <link rel="preload" href="/assets/webp/272.webp" as="image" />
        <link rel="preload" href="/assets/webp/273.webp" as="image" />
        <link rel="preload" href="/assets/webp/274.webp" as="image" />
        <link rel="preload" href="/assets/webp/275.webp" as="image" />
        <link rel="preload" href="/assets/webp/276.webp" as="image" />
        <link rel="preload" href="/assets/webp/277.webp" as="image" />
        <link rel="preload" href="/assets/webp/278.webp" as="image" />
        <link rel="preload" href="/assets/webp/279.webp" as="image" />
        <link rel="preload" href="/assets/webp/280.webp" as="image" />
        <link rel="preload" href="/assets/webp/281.webp" as="image" />
        <link rel="preload" href="/assets/webp/282.webp" as="image" />
        <link rel="preload" href="/assets/webp/283.webp" as="image" />
        <link rel="preload" href="/assets/webp/284.webp" as="image" />
        <link rel="preload" href="/assets/webp/285.webp" as="image" />
        <link rel="preload" href="/assets/webp/286.webp" as="image" />
        <link rel="preload" href="/assets/webp/287.webp" as="image" />
        <link rel="preload" href="/assets/webp/288.webp" as="image" />
        <link rel="preload" href="/assets/webp/289.webp" as="image" />
        <link rel="preload" href="/assets/webp/290.webp" as="image" />
        <link rel="preload" href="/assets/webp/291.webp" as="image" />
        <link rel="preload" href="/assets/webp/292.webp" as="image" />
        <link rel="preload" href="/assets/webp/293.webp" as="image" />
        <link rel="preload" href="/assets/webp/294.webp" as="image" />
        <link rel="preload" href="/assets/webp/295.webp" as="image" />
        <link rel="preload" href="/assets/webp/296.webp" as="image" />
        <link rel="preload" href="/assets/webp/297.webp" as="image" />
        <link rel="preload" href="/assets/webp/298.webp" as="image" />
        <link rel="preload" href="/assets/webp/299.webp" as="image" />
        <link rel="preload" href="/assets/webp/300.webp" as="image" />

        <link rel="preload" href="/assets/webp/301.webp" as="image" />
        <link rel="preload" href="/assets/webp/302.webp" as="image" />
        <link rel="preload" href="/assets/webp/303.webp" as="image" />
        <link rel="preload" href="/assets/webp/304.webp" as="image" />
        <link rel="preload" href="/assets/webp/305.webp" as="image" />
        <link rel="preload" href="/assets/webp/306.webp" as="image" />
        <link rel="preload" href="/assets/webp/307.webp" as="image" />
        <link rel="preload" href="/assets/webp/308.webp" as="image" />
        <link rel="preload" href="/assets/webp/309.webp" as="image" />
        <link rel="preload" href="/assets/webp/310.webp" as="image" />
        <link rel="preload" href="/assets/webp/311.webp" as="image" />
        <link rel="preload" href="/assets/webp/312.webp" as="image" />
        <link rel="preload" href="/assets/webp/313.webp" as="image" />
        <link rel="preload" href="/assets/webp/314.webp" as="image" />
        <link rel="preload" href="/assets/webp/315.webp" as="image" />
        <link rel="preload" href="/assets/webp/316.webp" as="image" />
        <link rel="preload" href="/assets/webp/317.webp" as="image" />
        <link rel="preload" href="/assets/webp/318.webp" as="image" />
        <link rel="preload" href="/assets/webp/319.webp" as="image" />
        <link rel="preload" href="/assets/webp/320.webp" as="image" />
        <link rel="preload" href="/assets/webp/321.webp" as="image" />
        <link rel="preload" href="/assets/webp/322.webp" as="image" />
        <link rel="preload" href="/assets/webp/323.webp" as="image" />
        <link rel="preload" href="/assets/webp/324.webp" as="image" />
        <link rel="preload" href="/assets/webp/325.webp" as="image" />
        <link rel="preload" href="/assets/webp/326.webp" as="image" />
        <link rel="preload" href="/assets/webp/327.webp" as="image" />
        <link rel="preload" href="/assets/webp/328.webp" as="image" />
        <link rel="preload" href="/assets/webp/329.webp" as="image" />
        <link rel="preload" href="/assets/webp/330.webp" as="image" />
        <link rel="preload" href="/assets/webp/331.webp" as="image" />
        <link rel="preload" href="/assets/webp/332.webp" as="image" />
        <link rel="preload" href="/assets/webp/333.webp" as="image" />
        <link rel="preload" href="/assets/webp/334.webp" as="image" />
        <link rel="preload" href="/assets/webp/335.webp" as="image" />
        <link rel="preload" href="/assets/webp/336.webp" as="image" />
        <link rel="preload" href="/assets/webp/337.webp" as="image" />
        <link rel="preload" href="/assets/webp/338.webp" as="image" />
        <link rel="preload" href="/assets/webp/339.webp" as="image" />
        <link rel="preload" href="/assets/webp/340.webp" as="image" />
        <link rel="preload" href="/assets/webp/341.webp" as="image" />
        <link rel="preload" href="/assets/webp/342.webp" as="image" />
        <link rel="preload" href="/assets/webp/343.webp" as="image" />
        <link rel="preload" href="/assets/webp/344.webp" as="image" />
        <link rel="preload" href="/assets/webp/345.webp" as="image" />
        <link rel="preload" href="/assets/webp/346.webp" as="image" />
        <link rel="preload" href="/assets/webp/347.webp" as="image" />
        <link rel="preload" href="/assets/webp/348.webp" as="image" />
        <link rel="preload" href="/assets/webp/349.webp" as="image" />
        <link rel="preload" href="/assets/webp/350.webp" as="image" />

        <link rel="preload" href="/assets/webp/351.webp" as="image" />
        <link rel="preload" href="/assets/webp/352.webp" as="image" />
        <link rel="preload" href="/assets/webp/353.webp" as="image" />
        <link rel="preload" href="/assets/webp/354.webp" as="image" />
        <link rel="preload" href="/assets/webp/355.webp" as="image" />
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
