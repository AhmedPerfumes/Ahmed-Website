'use client';
import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useLocale } from 'next-intl';

export default function CheckoutPromotionSlider({
  sliderKey = 'checkout',
  sliderId = 2,
  className = '',
  style = {},
}) {
  const locale = useLocale();
  const isArabic = locale === 'ar';
  const [sliderData, setSliderData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Fetch slider data
  useEffect(() => {
    if (!sliderKey && !sliderId) {
      setIsLoading(false);
      return;
    }

    let isMounted = true;
    setIsLoading(true);

    const apiBase = (process.env.NEXT_PUBLIC_API_URL || 'https://admin.ahmedalmaghribi.com/').replace(/\/+$/, '');
    const apiUrl = sliderKey
      ? `${apiBase}/api/sliders/key/${sliderKey}?_t=${Date.now()}`
      : `${apiBase}/api/sliders/${sliderId}?_t=${Date.now()}`;

    fetch(apiUrl, { cache: 'no-store' })
      .then((res) => {
        if (!res.ok) throw new Error('Slider not found');
        return res.json();
      })
      .then((data) => {
        if (isMounted) {
          if (data && data.status && data.data) {
            setSliderData(data.data);
          } else if (data && data.id) {
            setSliderData(data);
          } else {
            setSliderData(null);
          }
          setIsLoading(false);
        }
      })
      .catch(() => {
        if (isMounted) {
          setIsLoading(false);
          setSliderData(null);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [sliderKey, sliderId]);

  const items = sliderData?.items || sliderData?.desktop_sliders || [];

  // Auto-slide interval if more than 1 item
  useEffect(() => {
    if (items.length <= 1 || isPaused) return;

    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % items.length);
    }, 4000);

    return () => clearInterval(timer);
  }, [items.length, isPaused]);

  if (isLoading || !sliderData || items.length === 0) {
    return null;
  }

  const currentItem = items[currentIndex] || items[0];

  const getFullImageUrl = (img) => {
    if (!img) return '';
    if (img.startsWith('http://') || img.startsWith('https://')) return img;
    const baseApi = (process.env.NEXT_PUBLIC_API_URL || 'https://admin.ahmedalmaghribi.com/').replace(/\/+$/, '');
    const cleanImg = img.replace(/^\/+/, '');
    if (cleanImg.startsWith('storage/')) {
      return `${baseApi}/${cleanImg}`;
    }
    return `${baseApi}/storage/${cleanImg}`;
  };

  const handleTouchStart = (e) => {
    touchStartX.current = e.targetTouches[0].clientX;
  };

  const handleTouchMove = (e) => {
    touchEndX.current = e.targetTouches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (!touchStartX.current || !touchEndX.current) return;
    const diff = touchStartX.current - touchEndX.current;
    if (diff > 40) {
      // Swiped left -> next
      setCurrentIndex((prev) => (prev + 1) % items.length);
    } else if (diff < -40) {
      // Swiped right -> prev
      setCurrentIndex((prev) => (prev - 1 + items.length) % items.length);
    }
    touchStartX.current = 0;
    touchEndX.current = 0;
  };

  const chosenImg = isMobile && currentItem.mobile_image ? currentItem.mobile_image : currentItem.image;
  const fullImg = getFullImageUrl(chosenImg);
  const accentColor = currentItem.color && currentItem.color !== 'transparent' ? currentItem.color : '#D4AF37';

  const title = isArabic && currentItem.title_ar ? currentItem.title_ar : currentItem.title;
  const subTitle = isArabic && currentItem.sub_title_ar ? currentItem.sub_title_ar : (currentItem.sub_title || currentItem.description);
  const season = isArabic && currentItem.season_ar ? currentItem.season_ar : currentItem.season;

  const card = (
    <div
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      style={{
        display: 'flex',
        alignItems: 'center',
        padding: '10px 12px',
        backgroundColor: '#ffffff',
        border: '1px solid #e9ecef',
        borderRadius: '10px',
        boxShadow: '0 1px 4px rgba(0, 0, 0, 0.03)',
        transition: 'all 0.2s ease',
        cursor: currentItem.link ? 'pointer' : 'default',
        textDecoration: 'none',
        width: '100%',
        boxSizing: 'border-box',
      }}
    >
      {/* Left Thumbnail Image */}
      <div
        style={{
          width: '56px',
          height: '56px',
          minWidth: '56px',
          borderRadius: '8px',
          overflow: 'hidden',
          backgroundColor: '#f8f9fa',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
          border: '1px solid #f0f0f0',
        }}
      >
        {fullImg ? (
          <img
            src={fullImg}
            alt={currentItem.title || 'Promotion'}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              display: 'block',
            }}
            loading="lazy"
          />
        ) : (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#adb5bd" strokeWidth="1.5">
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
            <circle cx="8.5" cy="8.5" r="1.5"></circle>
            <polyline points="21 15 16 10 5 21"></polyline>
          </svg>
        )}
      </div>

      {/* Right Content */}
      <div
        style={{
          flex: 1,
          marginLeft: '12px',
          minWidth: 0,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
        }}
      >
        {season && (
          <span
            style={{
              fontSize: '10px',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
              color: accentColor,
              marginBottom: '2px',
              lineHeight: 1.2,
            }}
          >
            {season}
          </span>
        )}

        {title && (
          <h6
            style={{
              fontSize: '13px',
              fontWeight: 600,
              color: '#212529',
              margin: 0,
              lineHeight: 1.3,
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              textTransform: 'none',
            }}
          >
            {title}
          </h6>
        )}

        {subTitle && (
          <p
            style={{
              fontSize: '11px',
              color: '#6c757d',
              margin: '2px 0 0 0',
              lineHeight: 1.3,
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              textTransform: 'none',
            }}
          >
            {subTitle}
          </p>
        )}
      </div>

      {/* Right Arrow */}
      {currentItem.link && (
        <div
          style={{
            marginLeft: '8px',
            color: '#adb5bd',
            display: 'flex',
            alignItems: 'center',
            flexShrink: 0,
          }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="9 18 15 12 9 6"></polyline>
          </svg>
        </div>
      )}
    </div>
  );

  return (
    <div
      className={`checkout-promo-slider-box ${className}`}
      style={{
        marginTop: '10px',
        marginBottom: '15px',
        width: '100%',
        boxSizing: 'border-box',
        ...style,
      }}
    >
      {currentItem.link ? (
        currentItem.link.startsWith('http://') || currentItem.link.startsWith('https://') ? (
          <a
            href={currentItem.link}
            target="_blank"
            rel="noopener noreferrer"
            style={{ textDecoration: 'none', display: 'block' }}
          >
            {card}
          </a>
        ) : (
          <Link href={currentItem.link} style={{ textDecoration: 'none', display: 'block' }}>
            {card}
          </Link>
        )
      ) : (
        card
      )}

      {/* Subtle indicator dots if more than 1 item */}
      {items.length > 1 && (
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: '5px',
            marginTop: '6px',
          }}
        >
          {items.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setCurrentIndex(i)}
              style={{
                width: i === currentIndex ? '14px' : '5px',
                height: '5px',
                borderRadius: '3px',
                backgroundColor: i === currentIndex ? '#212529' : '#dee2e6',
                border: 'none',
                padding: 0,
                cursor: 'pointer',
                transition: 'all 0.2s ease',
              }}
              aria-label={`Slide ${i + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
