
import Image from "next/image";
import React from 'react'

export default function Export() {
  return (
  <>

<div className="container-fluid p-0">
        <Image
          loading="lazy"
          className="w-100 h-auto d-block"
          src="/assets/images/about/map.jpg"
          alt="image"
          width={1500}
          height={550}
        />
      </div>
      <div className="section2 text-center">
        <h3>Ahmed Al Maghribi Exports</h3>
      </div>


  </>
    
  )
}

