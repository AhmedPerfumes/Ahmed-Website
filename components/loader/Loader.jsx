// components/Preloader.js
"use client"
import { useEffect, useState } from 'react';

const Loader = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000); // Adjust the timeout as needed

    return () => clearTimeout(timer);
  }, []);

  if (!loading) return null;

  return (
    <div className="preloader">
    
        <img src="assets/images/preloader.gif" alt="loading"className='preloader-gif' />
      
    </div>
  );
};

export default Loader;
