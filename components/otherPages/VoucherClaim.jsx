import React from 'react'
import LoginRegister from './LoginRegister'
import Footer14 from '../footers/Footer14'
import MobileFooter2 from '../footers/MobileFooter2'
import Header14 from '../headers/Header14'

function VoucherClaim() {
  return (
    <div>
      <Header14/>
      <LoginRegister/>
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

export default VoucherClaim