"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/effect-fade";
import Zoom from "./zoom";
import { Swiper, SwiperSlide } from "swiper/react";
import { EffectFade, Navigation } from "swiper/modules";
import "./carousel.css";
import Badge from "./Badge";
import he from "he";
import { useLocale, useTranslations } from "next-intl";
import { ProductCardCountdown, isDiscountCurrentlyActive } from "@/components/common/ProductCard";
import { useBogoCampaigns, getCampaignForProduct } from "@/utils/bogo";

const Carousel = ({ images, activeIndex, setActiveIndex, product }) => {
    const swiperRef = useRef(null);
    const locale = useLocale();
    const t = useTranslations();
    const [isDiscountExpired, setIsDiscountExpired] = useState(false);

    useEffect(() => {
        setIsDiscountExpired(false);
    }, [product?.discount?.end_date, product?.discount?.start_date, product?.product_id]);

    const handleDiscountExpired = useCallback(() => {
        setIsDiscountExpired(true);
    }, []);

    const isDiscountActive =
        Number(product?.product_qty) > 0 &&
        !isDiscountExpired &&
        isDiscountCurrentlyActive(product?.discount);

    const showCountdown =
        isDiscountActive &&
        Boolean(product?.discount?.end_date) &&
        Boolean(
            product.discount?.show_timer &&
            product.discount?.show_timer !== "0" &&
            product.discount?.show_timer !== 0
        );

    const bogoCampaigns = useBogoCampaigns();
    const bogoCampaign = getCampaignForProduct(bogoCampaigns, product?.product_id);
    const showBogoBadge = Boolean(bogoCampaign) && Number(product?.product_qty) > 0;

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

                if (!isDiscountActive) return null;

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

            {/* Top-Right stack: Sale countdown timer + Buy X Get Y badge */}
            {(showCountdown || showBogoBadge) && (
                <div
                    style={{
                        position: "absolute",
                        top: "16px",
                        right: "16px",
                        zIndex: 10,
                        pointerEvents: "none",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "flex-end",
                        gap: "6px",
                    }}
                >
                    {showCountdown && (
                        <ProductCardCountdown
                            endDate={product.discount.end_date}
                            startDate={product.discount.start_date}
                            locale={locale}
                            onExpire={handleDiscountExpired}
                        />
                    )}
                    {showBogoBadge && (
                        <div
                            style={{
                                backgroundColor: "#D4AF37",
                                color: "#fff",
                                padding: "5px 12px",
                                borderRadius: "3px",
                                fontSize: "12px",
                                fontWeight: 600,
                                letterSpacing: "0.3px",
                                boxShadow: "0 4px 12px rgba(212,175,55,0.3)",
                            }}
                        >
                            {bogoCampaign.name
                                ? he.decode(bogoCampaign.name)
                                : t("Buy {buy} Get {get} Free", {
                                    buy: Number(bogoCampaign.buy_quantity) || 1,
                                    get: Number(bogoCampaign.get_quantity) || 1,
                                })}
                        </div>
                    )}
                </div>
            )}

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
