"use client"
import React from 'react'
import Link from "next/link";

export default function Wedding() {
  return (
    <div className='bg-white'>
        <div className='container text-center pt-5 '>
            <h4 className='fs-4 text-uppercase'>We would like to create your memorable day to be remembered forever!</h4>
            <h2 className='fs-2 text-uppercase pt-4'>Wedding packages</h2>
        </div>
        <div className="container">
  <div className="row align-items-center">
    <div className="col-md-6">
      <img src="https://www.ahmed-perfume.com/wp-content/uploads/2023/11/multiple-products-1.png" className="img-fluid" alt="Description of image"/>
    </div>
    <div className="col-md-6 px-5 mb-2">
  <p className='fs-2 text-center text-uppercase'>Indulge in the Scent of Love</p>
  <p className='fs-6 text-center'>Creating a truly aromatic ambiance that complements your special day.</p>
  <p className='fs-6 text-center'>Discover the perfect blend of elegance and fragrance, as we curate a scented journey to accompany your magical celebration, leaving lasting memories for you and your guests.</p>
  <p className='fs-6 text-center'>Trust us to make your wedding an unforgettable sensory experience.</p>
  
  <div className="d-flex justify-content-center">
    <Link
      href="/shop-1"
      className="btn-link btn-link_lg default-underline text-uppercase fw-medium"
    >
      Know More
    </Link>
  </div>
</div>

  </div>
</div>
<div className="container">
  <div className="row align-items-center">
    
    <div className="col-md-6 px-5 mb-2">
      <p className='fs-2 text-center text-uppercase'>Wedding Service we offer</p>
      <p className='fs-6 text-center'>We provide a perfuming service for the purpose of welcoming your guests with some of the best Arabic and French perfumes as well as luxury oils with incense and Oud Ma'attar.</p>
      <p className='fs-6 text-center'>Elevate every welcoming moment with a delicate blend of scents that captivate and embrace, leaving an indelible mark of sophistication and luxury.</p>
      
      <div className="d-flex justify-content-center">
        <Link
          href="/shop-1"
          className="btn-link btn-link_lg default-underline text-uppercase fw-medium"
        >
          Know More
        </Link>
      </div>
    </div>

   
    <div className="col-md-6">
      <img src="https://www.ahmed-perfume.com/wp-content/uploads/2023/11/multiple-products-2.png" className="img-fluid" alt="Description of image"/>
    </div>
  </div>
</div>


    </div>
  )
}
