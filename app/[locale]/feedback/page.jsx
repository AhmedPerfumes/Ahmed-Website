import React from 'react'
import FeedbackForm from '@/components/common/FeedbackForm'
import Header14 from '@/components/headers/Header14'
import Footer14 from '@/components/footers/Footer14'

export const metadata = {
    title: "Perfumes | Buy Best Perfumes Online | Ahmed Perfume",
    description: "Buy Best Perfumes Online Ahmed Perfume",
    icons: {
        icon: "https://www.ahmedalmaghribi.com/wp-content/uploads/2021/08/Ahmed-Logo-e1631552829722-100x100.png",
    },
};

function Feedback() {
  return (
      <div>
        <Header14/>
        <div style={{backgroundColor: '#E5E5E5'}}>
<FeedbackForm/>
        </div>
        <Footer14/>
    </div>
  )
}

export default Feedback