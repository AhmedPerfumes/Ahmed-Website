import Footer14 from '@/components/footers/Footer14'
import MobileFooter2 from '@/components/footers/MobileFooter2'
import Header14 from '@/components/headers/Header14'
import NewLaunch from '@/components/otherPages/NewLaunch'
import React from 'react'

function page() {
  return (
    <div>
        <Header14 />
        <NewLaunch/>
         <section className="d-none d-lg-block" style={{ height: "100%" }}>
                <Footer14 />
              </section>
              <section className="d-sm-block d-md-none bg-dark pt-5  ">
                <div className="MobileFooter">
                  <MobileFooter2/>
                </div>
              </section>

    </div>
  )
}

export default page