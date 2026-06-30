import React, { useEffect, useRef } from "react";
// import { Swiper, SwiperSlide } from "swiper/react";
// import { Navigation, EffectFade } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/effect-fade";
import Zoom from "./zoom";
import { Swiper, SwiperSlide } from "swiper/react";
import { EffectFade, Navigation } from "swiper/modules";
import "./carousel.css";
import Badge from "./Badge";

const Carousel = ({ images, activeIndex, setActiveIndex, product }) => {
    const swiperRef = useRef(null);

    useEffect(() => {
        if (swiperRef.current && swiperRef.current.swiper) {
            swiperRef.current.swiper.slideTo(activeIndex);
        }
    }, [activeIndex]);

    return (
        <Swiper
            ref={swiperRef}
            modules={[Navigation, EffectFade]}
            effect="fade"
            onSlideChange={(swiper) => setActiveIndex(swiper.activeIndex)}
            className="w-100 responsive-swiper position-relative"
        >
            {/* Circular Sale Badge */}
            {(() => {
                // Show Out of Stock badge first
                if (Number(product?.product_qty) === 0) {
                    return (
                        <div
                            style={{
                                position: 'absolute',
                                top: '16px',
                                left: '16px',
                                zIndex: 10,
                                width: '70px',
                                height: '70px',
                                borderRadius: '50%',
                                background: 'rgb(87 87 86)', // Gray
                                color: '#ffffff',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                                textTransform: 'uppercase',
                                fontWeight: 800,
                                textAlign: 'center',
                                lineHeight: 1.1,
                                fontSize: '10px',
                                padding: '6px',
                            }}
                        >
                            Out of Stock
                        </div>
                    );
                }

                // Discount badge
                const now = new Date(new Date().getTime() + 4 * 60 * 60 * 1000);
                const parseUTC = (dt) => (dt ? new Date(dt.replace(' ', 'T') + 'Z') : null);

                const start = parseUTC(product?.discount?.start_date);
                const end = parseUTC(product?.discount?.end_date);

                const isActive = product?.discount && start && end && now >= start && now <= end;

                if (!isActive) return null;

                const { discount_type, value } = product.discount;

                return (
                    <div
                        style={{
                            position: 'absolute',
                            top: '16px',
                            left: '16px',
                            zIndex: 10,
                            width: '56px',
                            height: '56px',
                            borderRadius: '50%',
                            background: '#5a9a5a',
                            color: '#ffffff',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            boxShadow: '0 4px 12px rgba(90,154,90,0.25)',
                            textTransform: 'uppercase',
                            fontWeight: 800,
                            lineHeight: 1.1,
                            textAlign: 'center',
                        }}
                    >
                        {discount_type === 'percent' ? (
                            <>
                                <span style={{ fontSize: '15px' }}>{value}%</span>
                                <span style={{ fontSize: '9px', opacity: 0.9 }}>OFF</span>
                            </>
                        ) : (
                            <span style={{ fontSize: '12px' }}>Sale</span>
                        )}
                    </div>
                );
            })()}

            {images.map((image, index) => (
                <SwiperSlide key={index}>
                    {/* Render the badge if its data exists for this image */}
                    {image.badgeTypes && image.badgeTypes.map((badgeType, index) => (
                            <Badge key={index} type={badgeType} index={index} />
                            ))}
                    <div className="d-flex align-items-center justify-content-center w-100 h-100">
                        <Zoom
                            src={`${process.env.NEXT_PUBLIC_API_URL}storage/${image.src}`}
                            zoom={2}
                            lensSize={180}
                        />
                    </div>
                </SwiperSlide>
            ))}
        </Swiper>
    );
};

export default Carousel;
