import Image from 'next/image';
import BotPenguinWidget from '@/components/common/BotPenguinWidget';
import dynamic from 'next/dynamic';

const Footer14 = dynamic(() => import('@/components/footers/Footer14'));
const MobileFooter2 = dynamic(() => import('@/components/footers/MobileFooter2'));

import Header14 from '@/components/headers/Header14';
import HomePage from '@/components/HomePage';
import NewsLetter from '@/components/modals/NewsLetter';
import React from 'react';
import PopUp from '@/components/common/Popup';
import NewHomePage from '@/components/new-homepage/NewHomePage';

export const metadata = {
  title: 'Buy Best Perfumes Online | Ahmed Al Maghribi Perfumes',
  description: 'Buy Best Perfumes Online Ahmed Al Maghribi Perfumes.',
  icons: {
    icon: '/assets/images/ahmed-favicon.png',
  },
};

export default function HomePage8() {
  return (
    <div style={{ position: 'relative', minHeight: '100vh' }}>
      {/* 
        This fixed <div> sits behind everything and stretches to fill the viewport.
        Next/Image with `priority` will:
         - preload your LCP image,
         - add fetchpriority="high" under the hood,
         - load it eagerly.
      */}
      <div
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: -1,
          pointerEvents: 'none',
        }}
      >
        <Image
          src="/assets/background-ivory.webp"
          alt=""               // decorative
          fill
          sizes="100vw"
          style={{ objectFit: 'cover' }}
          loading="lazy"            // lazy to prevent competing with LCP
        />
      </div>

      {/* Your actual page content */}
      
      <BotPenguinWidget />
      {/* <PopUp/> */}
      <Header14 />

      <div className="d-none d-lg-block">{/* CanvasAnimation */}</div>
      <div className="d-sm-block d-md-none">{/* MobileAnimation */}</div>

      <main>
        {/* <HomePage /> */}
        <NewHomePage/>
      </main>

      <section className="d-none d-md-block" style={{ height: '100%' }}>
        <Footer14 />
      </section>

      <section className="d-sm-block d-md-none bg-dark pt-5">
        <div className="MobileFooter">
          <MobileFooter2 />
        </div>
      </section>
    </div>
  );
}
