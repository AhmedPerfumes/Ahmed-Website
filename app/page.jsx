import Loader from "@/components/loader/Loader";
import HomePage8 from "./(homes)/home-8/page";

export const metadata = {
  title: "Perfumes | Buy Best Perfumes Online | Ahmed Perfume",
  description: "Buy Best Perfumes Online Ahmed Perfume",
  icons: {
    icon: 'https://www.ahmedalmaghribi.com/wp-content/uploads/2021/08/Ahmed-Logo-e1631552829722-100x100.png',
  },
};
export default function Home() {
  return (
    <>
    <Loader/>
      <HomePage8 />
      
    </>
  );
}
