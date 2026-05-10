// import Loader from "@/components/loader/Loader";
import HomePage8 from "./(homes)/home-8/page";
import {useTranslations} from 'next-intl';

export const metadata = {
  title: "Buy Perfumes Online | Best Perfumes in UAE | Ahmed Al Maghribi Perfumes",
  description: "Shop Ahmed Al Maghribi Perfumes in UAE Discover Premium Oriental Fragrance Collection with Oud Perfumes Gift Sets and Long Lasting Scents Buy Online Today",
  icons: {
      icon: "/assets/images/ahmed-favicon.png",
  },
};

export default function Home() {
  const t = useTranslations();
  return (
    <>
    {/* <Loader/> */}
      {/* <h1>{t('title')}</h1> */}
      <HomePage8 />
    </>
  );
}
