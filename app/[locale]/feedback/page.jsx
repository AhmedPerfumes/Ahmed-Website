import React from 'react'
import FeedbackForm from '@/components/common/FeedbackForm'
import Header14 from '@/components/headers/Header14'
import Footer14 from '@/components/footers/Footer14'

export const metadata = {
  title: "Buy Best Perfumes Online | Ahmed Al Maghribi Perfumes",
  description: "Buy Best Perfumes Online Ahmed Al Maghribi Perfumes.",
  icons: {
      icon: "/assets/images/ahmed-favicon.png",
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