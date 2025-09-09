"use client"
import { useLocale } from 'next-intl'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import NewLaunchGrid from '../common/features/NewLaunchGrid'
import Hero from '../homes/home-1/Hero'


function NewLaunch() {
    const locale= useLocale();
  return (
   <>
    <div>
            {/* <div className="container-fluid p-0 pt-2">
                <Link href={`/${locale}/shop`}>
                    <Image
                        loading="lazy"
                        className="w-100 h-auto d-none d-lg-block"
                        src="/assets/images/campaigns/landing-page.jpg"
                        alt="Father's Day Web"
                        width={1500}
                        height={550}
                    />
                </Link>
            </div>
            <div className="container-fluid p-0 pt-2">
                <Link href={`/${locale}/shop`}>
                    <Image
                        loading="lazy"
                        className="w-100 h-auto d-lg-none"
                        src="/assets/images/campaigns/SummerMobile.jpg"
                        alt="Father's Day Mobile"
                        width={1500}
                        height={550}
                    />
                </Link>
            </div> */}
            <Hero/>

        </div>
        <NewLaunchGrid title="Our Newest Creations" onlyNew />
   </>
  )
}

export default NewLaunch