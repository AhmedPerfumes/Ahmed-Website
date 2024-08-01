'use client';

import { useRef, useLayoutEffect, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
// import 'swiper/swiper-bundle.min.css';
import SwiperCore, { Mousewheel, FreeMode } from 'swiper';

SwiperCore.use([Mousewheel, FreeMode]);

const lerp = (f0, f1, t) => (1 - t) * f0 + t * f1;
const clamp = (val, min, max) => Math.max(min, Math.min(val, max));

const Test6 = () => {
  const [progress, setProgress] = useState(0);
  const [speed, setSpeed] = useState(0);
  const [oldX, setOldX] = useState(0);
  const [x, setX] = useState(0);
  const [playrate, setPlayrate] = useState(0);
  const [dragging, setDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [maxScroll, setMaxScroll] = useState(0);
  const [wrapWidth, setWrapWidth] = useState(0);

  const swiperRef = useRef(null);
  const itemsRef = useRef([]);

  useLayoutEffect(() => {
    const calculate = () => {
      if (itemsRef.current.length > 0) {
        const wrapWidth = itemsRef.current[0].offsetWidth * itemsRef.current.length;
        setWrapWidth(wrapWidth);
        const maxScroll = wrapWidth - swiperRef.current.offsetWidth;
        setMaxScroll(maxScroll);
        setProgress(0);
      }
    };

    calculate();

    const handleResize = () => {
      calculate();
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  useLayoutEffect(() => {
    const raf = () => {
      setX((prevX) => lerp(prevX, progress, 0.1));
      setPlayrate(x / maxScroll);
      setSpeed(Math.min(100, oldX - x));
      setOldX(x);

      itemsRef.current.forEach((item) => {
        item.style.transform = `scale(${1 - Math.abs(speed) * 0.002})`;
        const img = item.querySelector('img');
        if (img) {
          img.style.transform = `scaleX(${1 + Math.abs(speed) * 0.004})`;
        }
      });

      requestAnimationFrame(raf);
    };

    requestAnimationFrame(raf);

    return () => cancelAnimationFrame(raf);
  }, [progress, x, playrate, oldX, maxScroll, speed]);

  const handleWheel = (e) => {
    setProgress((prev) => clamp(prev + e.deltaY, 0, maxScroll));
  };

  const handleTouchStart = (e) => {
    e.preventDefault();
    setDragging(true);
    setStartX(e.clientX || e.touches[0].clientX);
    swiperRef.current.classList.add('dragging');
  };

  const handleTouchMove = (e) => {
    if (!dragging) return;
    const x = e.clientX || e.touches[0].clientX;
    setProgress((prev) => clamp(prev + (startX - x) * 2.5, 0, maxScroll));
    setStartX(x);
  };

  const handleTouchEnd = () => {
    setDragging(false);
    swiperRef.current.classList.remove('dragging');
  };

  return (
    <div className="carousel" ref={swiperRef} onWheel={handleWheel}>
      <Swiper
        freeMode={true}
        // slidesPerView="auto"
        // mousewheel={{ forceToAxis: true }}
        onTouchStart={(e) => handleTouchStart}
        onTouchMove={(e) => handleTouchMove}
        onTouchEnd={(e) => handleTouchEnd}
      >
        {Array.from({ length: 10 }).map((_, index) => (
          <SwiperSlide key={index} className="carousel--item" ref={(el) => (itemsRef.current[index] = el)}>
            <img src={`https://via.placeholder.com/150?text=Item+${index + 1}`} alt={`Item ${index + 1}`} />
          </SwiperSlide>
        ))}
      </Swiper>
      <div className="carousel--progress-bar" style={{ transform: `scaleX(${0.18 + playrate * 0.82})` }}></div>
    </div>
  );
};

export default Test6;