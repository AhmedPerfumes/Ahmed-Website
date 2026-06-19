"use client";
import React, { useEffect, useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import { Box, Typography, Container, CircularProgress, Button } from "@mui/material";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import { ShoppingBagOutlined } from "@mui/icons-material";
import Image from "next/image";
import Link from "next/link";
import he from "he";
import { useMenu } from "@/context/MenuContext";
import { useContextElement } from "@/context/Context";
import { renderPrice } from "@/utlis/priceRenderer";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

const ProductSlider = () => {
    const t = useTranslations();
    const locale = useLocale();
    const isArabic = locale === "ar";
    const { currency } = useMenu();
    const { addProductToCart, isAddedToCartProducts } = useContextElement();

    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true);
            try {
                // Fetch best selling/featured products
                const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}api/allProducts`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ 
                        page: 1, 
                        limit: 12
                    }),
                });
                
                const result = await response.json();
                const allProducts = (result.data || []).map((p) => ({ 
                    ...p, 
                    price: Number(p.price) 
                }));

                // Filter or sort to show premium fragrances suitable for fathers (woody, oud, amber, musk, oriental)
                const fathersKeywords = ["oud", "shaikh", "amber", "zumar", "kaaf", "marj", "woody", "musk", "classic", "black", "leather"];
                const curated = allProducts.sort((a, b) => {
                    const nameA = a.product_name.toLowerCase();
                    const nameB = b.product_name.toLowerCase();
                    const matchA = fathersKeywords.some(key => nameA.includes(key)) ? 1 : 0;
                    const matchB = fathersKeywords.some(key => nameB.includes(key)) ? 1 : 0;
                    return matchB - matchA; 
                });

                setProducts(curated);
            } catch (error) {
                console.error("Failed to fetch products for slider", error);
            } finally {
                setLoading(false);
            }
        };
        fetchProducts();
    }, []);

    const clean = (s) => s?.toLowerCase().replace(/&amp;/g, "").replace(/[^\w\s-]/g, "").trim().replace(/\s+/g, "-");

    if (!loading && products.length === 0) {
        return null;
    }

    return (
        <Box
            component="section"
            dir={isArabic ? "rtl" : "ltr"}
            sx={{
                py: { xs: 6, md: 12 },
                background: "linear-gradient(180deg, #F5F1E8 0%, #EDE8DC 100%)", // Light cream background
                position: "relative",
                overflow: "hidden"
            }}
        >
            {/* Top gold divider line */}
            <Box
                sx={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    height: "4px",
                    background: "linear-gradient(90deg, transparent, #BF953F, transparent)"
                }}
            />

            {/* Glowing gold background radial effects */}
            <Box
                sx={{
                    position: "absolute",
                    top: "30%",
                    left: "10%",
                    width: "400px",
                    height: "400px",
                    background: "radial-gradient(circle, rgba(191, 149, 63, 0.12) 0%, transparent 70%)",
                    filter: "blur(60px)",
                    zIndex: 0
                }}
            />
            <Box
                sx={{
                    position: "absolute",
                    bottom: "20%",
                    right: "10%",
                    width: "400px",
                    height: "400px",
                    background: "radial-gradient(circle, rgba(191, 149, 63, 0.12) 0%, transparent 70%)",
                    filter: "blur(60px)",
                    zIndex: 0
                }}
            />

            <Container maxWidth="xl" sx={{ position: "relative", zIndex: 1 }}>
                {/* Header Section */}
                <Box sx={{ display: "flex", flexDirection: { xs: "column", md: "row" }, justifyContent: "space-between", alignItems: { xs: "center", md: "flex-end" }, mb: { xs: 4, md: 8 }, textAlign: { xs: "center", md: isArabic ? "right" : "left" } }}>
                    <Box>
                        <Typography
                            variant="overline"
                            sx={{
                                color: "#BF953F",
                                letterSpacing: "0.3em",
                                fontWeight: 700,
                                fontSize: { xs: "0.65rem", md: "0.85rem" },
                                display: "block",
                                mb: 1.5
                            }}
                        >
                            {isArabic ? "✦ اختيارات مميزة للأب ✦" : "✦ EXCLUSIVE GIFT SELECTS FOR DAD ✦"}
                        </Typography>
                        <Typography
                            variant="h2"
                            sx={{
                                color: "#2C2416",
                                fontSize: { xs: "1.75rem", md: "3.5rem" },
                                fontWeight: 800,
                                fontFamily: "'Playfair Display', serif",
                                lineHeight: 1.15
                            }}
                        >
                            {isArabic ? "العطور الفاخرة الموصى بها" : "Curated Luxury Scents"}
                        </Typography>
                    </Box>

                    {/* Navigation Buttons for desktop */}
                    <Box sx={{ display: { xs: "none", md: "flex" }, gap: 2, mt: { xs: 3, md: 0 } }}>
                        <div className="fathersday-nav-prev swiper-button-custom" aria-label="Previous slide">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M19 12H5M12 19l-7-7 7-7" />
                            </svg>
                        </div>
                        <div className="fathersday-nav-next swiper-button-custom" aria-label="Next slide">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M5 12h14M12 5l7 7-7 7" />
                            </svg>
                        </div>
                    </Box>
                </Box>

                {loading ? (
                    <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
                        <CircularProgress sx={{ color: "#BF953F" }} />
                    </Box>
                ) : (
                    <Box sx={{ position: "relative" }}>
                        <Swiper
                            modules={[Navigation, Pagination, Autoplay]}
                            navigation={{
                                prevEl: ".fathersday-nav-prev",
                                nextEl: ".fathersday-nav-next",
                            }}
                            pagination={{ clickable: true, el: ".swiper-pagination-fathersday-custom" }}
                            autoplay={{ delay: 6000, disableOnInteraction: false }}
                            slidesPerView={2}
                            spaceBetween={12}
                            breakpoints={{
                                600: { slidesPerView: 2, spaceBetween: 20 },
                                900: { slidesPerView: 3, spaceBetween: 24 },
                                1200: { slidesPerView: 4, spaceBetween: 30 }
                            }}
                            className="fathersday-luxury-swiper"
                            dir={isArabic ? "rtl" : "ltr"}
                            key={locale}
                        >
                            {products.map((elm, i) => (
                                <SwiperSlide key={elm.product_id || i}>
                                    <Box
                                        className="luxury-product-card"
                                        sx={{
                                            background: "#FFFFFF",
                                            borderRadius: { xs: "16px", md: "24px" },
                                            overflow: "hidden",
                                            border: "1px solid rgba(191, 149, 63, 0.2)",
                                            boxShadow: "0 10px 30px rgba(44, 36, 22, 0.06)",
                                            height: "100%",
                                            display: "flex",
                                            flexDirection: "column",
                                            transition: "all 0.4s cubic-bezier(0.165, 0.84, 0.44, 1)",
                                            position: "relative",
                                            "&:hover": {
                                                transform: "translateY(-10px)",
                                                borderColor: "#BF953F",
                                                boxShadow: "0 20px 45px rgba(44, 36, 22, 0.12)",
                                                "& .action-overlay": {
                                                    opacity: 1,
                                                    transform: "translateY(0)"
                                                },
                                                "& img": {
                                                    transform: "scale(1.1) rotate(1deg)"
                                                }
                                            }
                                        }}
                                    >
                                        {/* Image Area */}
                                        <Box sx={{ position: "relative", width: "100%", aspectRatio: "1 / 1.15", overflow: "hidden", background: "#F9F6F0" }}>
                                            <Link href={`/${locale}/shop/${clean(elm.category_name)}/all/${clean(elm.product_name)}`} style={{ display: "block", width: "100%", height: "100%" }}>
                                                <Image
                                                    loading="lazy"
                                                    src={`${process.env.NEXT_PUBLIC_API_URL}storage/${JSON.parse(elm.images)[0]}`}
                                                    fill
                                                    alt={elm.product_name}
                                                    style={{ objectFit: "cover", transition: "transform 0.7s cubic-bezier(0.165, 0.84, 0.44, 1)" }}
                                                />

                                                {/* Luxury dark gradient overlay inside image */}
                                                <Box sx={{ position: "absolute", bottom: 0, left: 0, right: 0, height: "40%", background: "linear-gradient(to top, rgba(17, 16, 14, 0.45) 0%, transparent 100%)", zIndex: 1 }} />
                                            </Link>

                                            {/* Custom Gold Badges */}
                                            {elm.label_name ? (
                                                <Box sx={{ position: "absolute", top: { xs: 10, md: 16 }, [isArabic ? "left" : "right"]: { xs: 10, md: 16 }, zIndex: 2, background: "linear-gradient(135deg, #BF953F 0%, #8B6914 100%)", color: "#FFFFFF", px: { xs: 1.5, md: 2 }, py: 0.5, borderRadius: "50px", fontSize: { xs: "0.55rem", md: "0.65rem" }, fontWeight: 700, letterSpacing: "1px", textTransform: "uppercase", boxShadow: "0 4px 10px rgba(139, 105, 20, 0.4)" }}>
                                                    {elm.label_name}
                                                </Box>
                                            ) : (
                                                elm.discount && elm.discount.discount_type === 'percent' && (
                                                    <Box sx={{ position: "absolute", top: { xs: 10, md: 16 }, [isArabic ? "left" : "right"]: { xs: 10, md: 16 }, zIndex: 2, background: "#dc3545", color: "#FFFFFF", px: { xs: 1.5, md: 2 }, py: 0.5, borderRadius: "50px", fontSize: { xs: "0.55rem", md: "0.65rem" }, fontWeight: 700, letterSpacing: "1px", textTransform: "uppercase" }}>
                                                        -{elm.discount.value}%
                                                    </Box>
                                                )
                                            )}

                                            {elm.product_qty <= 0 && (
                                                <Box sx={{ position: "absolute", top: { xs: 10, md: 16 }, [isArabic ? "right" : "left"]: { xs: 10, md: 16 }, zIndex: 2, background: "#dc3545", color: "#FFFFFF", px: { xs: 1.5, md: 2 }, py: 0.5, borderRadius: "50px", fontSize: { xs: "0.55rem", md: "0.65rem" }, fontWeight: 700, textTransform: "uppercase" }}>
                                                    {isArabic ? "نفذت الكمية" : "Out Of Stock"}
                                                </Box>
                                            )}

                                            {/* Hover Actions overlay */}
                                            <Box
                                                className="action-overlay"
                                                sx={{
                                                    position: "absolute",
                                                    top: 0,
                                                    left: 0,
                                                    right: 0,
                                                    bottom: 0,
                                                    background: "rgba(25, 22, 18, 0.45)",
                                                    backdropFilter: "blur(6px)",
                                                    display: "flex",
                                                    alignItems: "center",
                                                    justifyContent: "center",
                                                    opacity: 0,
                                                    transition: "all 0.4s cubic-bezier(0.165, 0.84, 0.44, 1)",
                                                    zIndex: 2
                                                }}
                                            >
                                                {/* Absolute positioned background link to make the rest of the overlay clickable */}
                                                <Link 
                                                    href={`/${locale}/shop/${clean(elm.category_name)}/all/${clean(elm.product_name)}`}
                                                    style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", zIndex: 1 }}
                                                    aria-label={elm.product_name}
                                                />

                                                {/* Content wrapper on top of background link */}
                                                <Box sx={{ position: "relative", zIndex: 2 }}>
                                                    {elm.product_qty > 0 ? (
                                                        <Button
                                                            onClick={(e) => {
                                                                e.preventDefault();
                                                                e.stopPropagation();
                                                                addProductToCart(elm);
                                                            }}
                                                            disabled={isAddedToCartProducts(elm.product_id)}
                                                            variant="contained"
                                                            startIcon={<ShoppingBagOutlined sx={{ fontSize: "1.1rem !important" }} />}
                                                            sx={{
                                                                background: "linear-gradient(135deg, #BF953F 0%, #8B6914 100%)",
                                                                color: "#FFFFFF",
                                                                px: { xs: 2.2, md: 3.5 },
                                                                py: { xs: 1.2, md: 1.5 },
                                                                borderRadius: "50px",
                                                                fontSize: { xs: "0.68rem", md: "0.75rem" },
                                                                fontWeight: 700,
                                                                letterSpacing: "0.1em",
                                                                textTransform: "uppercase",
                                                                boxShadow: "0 10px 25px rgba(139, 105, 20, 0.4)",
                                                                transition: "all 0.3s cubic-bezier(0.165, 0.84, 0.44, 1)",
                                                                whiteSpace: "nowrap",
                                                                "&:hover": {
                                                                    background: "linear-gradient(135deg, #8B6914 0%, #BF953F 100%)",
                                                                    transform: "scale(1.05)",
                                                                    boxShadow: "0 12px 30px rgba(139, 105, 20, 0.6)"
                                                                },
                                                                "&.Mui-disabled": {
                                                                    background: "#FFFFFF",
                                                                    color: "#BF953F",
                                                                    boxShadow: "none",
                                                                    opacity: 0.95
                                                                }
                                                            }}
                                                        >
                                                            {isAddedToCartProducts(elm.product_id) 
                                                                ? (isArabic ? "في السلة" : "Added") 
                                                                : (isArabic ? "أضف إلى السلة" : "Add to Cart")
                                                            }
                                                        </Button>
                                                    ) : (
                                                        <Button
                                                            component={Link}
                                                            href={`/${locale}/shop/${clean(elm.category_name)}/all/${clean(elm.product_name)}`}
                                                            variant="contained"
                                                            sx={{
                                                                background: "#FFFFFF",
                                                                color: "#2C2416",
                                                                px: { xs: 2.2, md: 3.5 },
                                                                py: { xs: 1.2, md: 1.5 },
                                                                borderRadius: "50px",
                                                                fontSize: { xs: "0.68rem", md: "0.75rem" },
                                                                fontWeight: 700,
                                                                letterSpacing: "0.1em",
                                                                textTransform: "uppercase",
                                                                boxShadow: "0 10px 25px rgba(0, 0, 0, 0.15)",
                                                                transition: "all 0.3s cubic-bezier(0.165, 0.84, 0.44, 1)",
                                                                whiteSpace: "nowrap",
                                                                "&:hover": {
                                                                    background: "#BF953F",
                                                                    color: "#FFFFFF",
                                                                    transform: "scale(1.05)",
                                                                    boxShadow: "0 12px 30px rgba(191, 149, 63, 0.5)"
                                                                }
                                                            }}
                                                        >
                                                            {isArabic ? "اكتشف العطر" : "Discover"}
                                                        </Button>
                                                    )}
                                                </Box>
                                            </Box>
                                        </Box>

                                        {/* Card Info */}
                                        <Box sx={{ p: { xs: 2, md: 3 }, flexGrow: 1, display: "flex", flexDirection: "column", justifyContent: "space-between", background: "#FFFFFF" }}>
                                            <Box>
                                                <Typography
                                                    variant="caption"
                                                    sx={{
                                                        color: "#BF953F",
                                                        textTransform: "uppercase",
                                                        letterSpacing: "2px",
                                                        fontWeight: 700,
                                                        fontSize: { xs: "0.55rem", md: "0.65rem" },
                                                        display: "block",
                                                        mb: 1
                                                    }}
                                                >
                                                    {t(elm.category_name)}
                                                </Typography>
                                                <Typography
                                                    variant="h6"
                                                    sx={{
                                                        fontSize: { xs: "0.82rem", md: "0.95rem" },
                                                        fontWeight: 600,
                                                        color: "#2C2416",
                                                        mb: { xs: 1, md: 2 },
                                                        lineHeight: 1.3,
                                                        minHeight: { xs: "3em", md: "2.6em" },
                                                        overflow: "hidden",
                                                        textOverflow: "ellipsis",
                                                        display: "-webkit-box",
                                                        WebkitLineClamp: 2,
                                                        WebkitBoxOrient: "vertical"
                                                    }}
                                                >
                                                    <Link href={`/${locale}/shop/${clean(elm.category_name)}/all/${clean(elm.product_name)}`} style={{ color: "inherit", textDecoration: "none" }}>
                                                        {t(he.decode(elm.product_name))}
                                                    </Link>
                                                </Typography>
                                            </Box>

                                            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mt: { xs: 0.5, md: 1 }, pt: { xs: 1.5, md: 2 }, borderTop: "1px solid rgba(44, 36, 22, 0.08)" }}>
                                                <Box>
                                                    <Typography variant="caption" sx={{ color: "rgba(44, 36, 22, 0.6)", display: "block", fontSize: { xs: "0.5rem", md: "0.6rem" }, textTransform: "uppercase", letterSpacing: "1px" }}>
                                                        {isArabic ? "السعر" : "Price"}
                                                    </Typography>
                                                    <Box sx={{ fontSize: { xs: "0.95rem", md: "1.1rem" }, fontWeight: 800, color: "#BF953F" }}>
                                                        {currency && renderPrice(elm, currency)}
                                                    </Box>
                                                </Box>

                                                <Link href={`/${locale}/shop/${clean(elm.category_name)}/all/${clean(elm.product_name)}`} passHref>
                                                    <Button
                                                        variant="text"
                                                        sx={{
                                                            color: "#2C2416",
                                                            fontSize: { xs: "0.65rem", md: "0.75rem" },
                                                            fontWeight: 700,
                                                            letterSpacing: { xs: "0.5px", md: "1.5px" },
                                                            textTransform: "uppercase",
                                                            borderBottom: "1px solid #BF953F",
                                                            borderRadius: 0,
                                                            px: 0,
                                                            py: 0.5,
                                                            minWidth: 0,
                                                            "&:hover": {
                                                                color: "#BF953F",
                                                                backgroundColor: "transparent"
                                                             }
                                                        }}
                                                    >
                                                        {isArabic ? "اكتشف" : "Discover"}
                                                    </Button>
                                                </Link>
                                            </Box>
                                        </Box>
                                    </Box>
                                </SwiperSlide>
                            ))}
                        </Swiper>

                        {/* Navigation bullets for mobile */}
                        <div className="swiper-pagination-fathersday-custom text-center mt-5" style={{ position: "relative" }}></div>
                    </Box>
                )}
            </Container>

            {/* Premium Style overrides */}
            <style jsx global>{`
                .swiper-button-custom {
                    width: 48px;
                    height: 48px;
                    border-radius: 50%;
                    border: 1px solid rgba(191, 149, 63, 0.35);
                    background: rgba(255, 255, 255, 0.65);
                    color: #BF953F;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    cursor: pointer;
                    transition: all 0.35s cubic-bezier(0.165, 0.84, 0.44, 1);
                    user-select: none;
                    box-shadow: 0 4px 12px rgba(44, 36, 22, 0.03);
                }
                .swiper-button-custom:hover {
                    background: linear-gradient(135deg, #BF953F 0%, #8B6914 100%);
                    color: #FFFFFF;
                    border-color: transparent;
                    box-shadow: 0 8px 20px rgba(139, 105, 20, 0.3);
                }
                .swiper-button-custom.swiper-button-disabled {
                    opacity: 0.4;
                    cursor: not-allowed;
                    pointer-events: none;
                    border-color: rgba(191, 149, 63, 0.15);
                    background: rgba(255, 255, 255, 0.4);
                    box-shadow: none;
                }
                .swiper-button-custom svg {
                    transition: transform 0.35s cubic-bezier(0.165, 0.84, 0.44, 1);
                }
                [dir="rtl"] .swiper-button-custom svg {
                    transform: rotate(180deg);
                }
                .fathersday-nav-prev:hover svg {
                    transform: translateX(-3px);
                }
                .fathersday-nav-next:hover svg {
                    transform: translateX(3px);
                }
                [dir="rtl"] .fathersday-nav-prev:hover svg {
                    transform: rotate(180deg) translateX(-3px);
                }
                [dir="rtl"] .fathersday-nav-next:hover svg {
                    transform: rotate(180deg) translateX(3px);
                }
                .swiper-pagination-fathersday-custom .swiper-pagination-bullet {
                    background: rgba(191, 149, 63, 0.25) !important;
                    opacity: 1 !important;
                    width: 10px;
                    height: 10px;
                    margin: 0 6px !important;
                    transition: all 0.3s ease;
                }
                .swiper-pagination-fathersday-custom .swiper-pagination-bullet-active {
                    background: #BF953F !important;
                    width: 32px;
                    border-radius: 6px;
                    box-shadow: 0 0 10px rgba(191, 149, 63, 0.5);
                }
            `}</style>
        </Box>
    );
};

export default ProductSlider;
