import React from 'react'
import FeedbackForm from '@/components/common/FeedbackForm'
import Header14 from '@/components/headers/Header14'
import Footer14 from '@/components/footers/Footer14'

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