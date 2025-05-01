// components/CountryMismatchPopup.tsx
'use client';

import { useEffect, useState } from 'react';
import Cookies from 'js-cookie';

const countryNames = {
  AE: 'United Arab Emirates',
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
    <div style={{
      position: 'fixed',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      background: 'white',
      padding: '20px',
      border: '1px solid #ccc',
      zIndex: 1000,
      boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
    }}>
      <h2>Country Mismatch</h2>
      <p>
        It looks like you are accessing this site from {countryNames[mismatchCountry]}. Would you like to visit our site for {countryNames[mismatchCountry]}?
      </p>
      <button
        onClick={() => {
          // Redirect to the correct domain (optional)
          const domainMap = {
            AE: 'https://ae.ahmedalmaghribi.com',
            SA: 'https://ksa.ahmedalmaghribi.com',
            QA: 'https://qa.ahmedalmaghribi.com',
            OM: 'https://om.ahmedalmaghribi.com',
            BH: 'https://bh.ahmedalmaghribi.com',
            KW: 'https://kw.ahmedalmaghribi.com',
          };
          window.location.href = domainMap[mismatchCountry] || 'https://ae.ahmedalmaghribi.com';
        }}
      >
        Visit {countryNames[mismatchCountry]} Site
      </button>
      <button onClick={handleClose} style={{ marginLeft: '10px' }}>
        Stay Here
      </button>
    </div>
  );
}