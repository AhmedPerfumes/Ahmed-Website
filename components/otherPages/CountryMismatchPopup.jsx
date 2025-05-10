// components/CountryMismatchPopup.tsx
'use client';

import { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import "../HomePage.css";
import Link from "next/link";
import { auto } from '@popperjs/core';

const countryNames = {
  AE: 'The United Arab Emirates',
  SA: 'Saudi Arabia',
  QA: 'Qatar',
  OM: 'Oman',
  BH: 'Bahrain',
  KW: 'Kuwait',
};

export default function CountryMismatchPopup() {
  const [mismatchCountry, setMismatchCountry] = useState(null);

  useEffect(() => {
    // Check for countryMismatch cookie
    const countryCode = Cookies.get('countryMismatch');
    if (countryCode && countryNames[countryCode]) {
      setMismatchCountry(countryCode);
    }
  }, []);

  const handleClose = () => {
    setMismatchCountry(null);
    // Optionally clear the cookie
    Cookies.remove('countryMismatch');
  };

  if (!mismatchCountry) return null;

  return (
    // <div className='ipmodal-dialog'>
    //   <div className='ipmodal-content' >
    //       <div className='ipmodal-header'>
    //         Welcome To AhmedAlMaghribi.com
    //       </div>
    //       <p className='ipmodal-text'>
    //       It seems you are visiting us from {countryNames[mismatchCountry]}, Would you like to go to our  {countryNames[mismatchCountry]}?
    //       </p>
        
    //       <div className='ipmodal-btn'>
    //         <div className='btn-left'>
    //           <Link href="#"
    //             onClick={() => {
    //               // Redirect to the correct domain (optional)
    //               const domainMap = {
    //                 AE: 'https://ae.ahmedalmaghribi.com',
    //                 SA: 'https://ksa.ahmedalmaghribi.com',
    //                 QA: 'https://qa.ahmedalmaghribi.com',
    //                 OM: 'https://om.ahmedalmaghribi.com',
    //                 BH: 'https://bh.ahmedalmaghribi.com',
    //                 KW: 'https://kw.ahmedalmaghribi.com',
    //               };
    //               window.location.href = domainMap[mismatchCountry] || 'https://ae.ahmedalmaghribi.com';
    //             }} style={{ minWidth: '13.875rem', width: 'auto' }}>
    //             Visit {countryNames[mismatchCountry]} Site
    //           </Link>
    //         </div>

    //         <div className='btn-right'>
    //           <Link href="#" onClick={handleClose} style={{minWidth: '13.875rem', width: 'auto', color: '#fff',  }}>
    //             Stay Here
    //           </Link>
    //       </div>
    //     </div>  
    //   </div>    
    // </div>
    <>
    <div className="ipmodal-backdrop" onClick={handleClose}></div>
    <div className="ipmodal-dialog">
      <div className="ipmodal-content">
        <button className="ipmodal-close" onClick={handleClose}>&times;</button>
        <div className="ipmodal-header">Welcome To AhmedAlMaghribi.com</div>
        <p className="ipmodal-text">
          It seems you are visiting us from {countryNames[mismatchCountry]}. Would you like to go to our {countryNames[mismatchCountry]} site?
        </p>
        <div className="ipmodal-btn">
          <div className="btn-left">
            <Link
              href="#"
              onClick={() => {
                const domainMap = {
                  AE: 'https://ae.ahmedalmaghribi.com',
                  SA: 'https://ksa.ahmedalmaghribi.com',
                  QA: 'https://qa.ahmedalmaghribi.com',
                  OM: 'https://om.ahmedalmaghribi.com',
                  BH: 'https://bh.ahmedalmaghribi.com',
                  KW: 'https://kw.ahmedalmaghribi.com',
                };
                window.location.href = domainMap[mismatchCountry] || 'https://ae.ahmedalmaghribi.com';
              }} style={{ minWidth: '13.875rem', width: 'auto',}}
            >
              Visit {countryNames[mismatchCountry]} Site
            </Link>
          </div>
          <div className="btn-right">
            <Link href="#" onClick={handleClose} style={{ minWidth: '13.875rem', width: 'auto', color: '#fff',  }}>
              No, Stay Here
            </Link>
          </div>
        </div>
      </div>
    </div>
  </>
  );
}