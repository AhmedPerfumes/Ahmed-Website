import Bogo from '@/components/campagin/Bogo';
import Footer14 from '@/components/footers/Footer14';
import MobileFooter2 from '@/components/footers/MobileFooter2';
import Header14 from '@/components/headers/Header14';
import Style2 from '@/components/shoplist/shop10/Style2';
import React from 'react'

export default function BOGO() {
    return (
        <>
          {/* <Loader/> */}
          <Header14 />
    
           <Bogo />
          <section className="d-none d-lg-block" style={{ height: "100%" }}>
            <Footer14 />
          </section>
          <section className="d-sm-block d-md-none bg-dark pt-5  ">
            <div className="MobileFooter">
              <MobileFooter2/>
            </div>
          </section>
        </>
      );
}
