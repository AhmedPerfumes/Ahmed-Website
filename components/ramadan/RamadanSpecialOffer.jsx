"use client";
import React, { useEffect, useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import { Box, Typography, Container, Grid, CircularProgress } from "@mui/material";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import Image from "next/image";
import Link from "next/link";
import he from "he";
import { useMenu } from "@/context/MenuContext";
import { useContextElement } from "@/context/Context";
import { renderPrice } from "@/utlis/priceRenderer";

const RamadanSpecialOffer = () => {
    const t = useTranslations();
    const locale = useLocale();
    const { currency } = useMenu();
    const { addProductToCart, isAddedToCartProducts } = useContextElement();

    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true);
            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}api/allProducts`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    // Added discount_name: "TEST" to the payload
                    body: JSON.stringify({ 
                        page: 1, 
                        limit: 6, 
                        discount_name: "Test" 
                    }),
                });
                
                const result = await response.json();
                
                // The API now returns only the products associated with the "TEST" discount
                const allProducts = (result.data || []).map((p) => ({ 
                    ...p, 
                    price: Number(p.price) 
                }));

                setProducts(allProducts);
            } catch (error) {
                console.error("Failed to fetch products", error);
            } finally {
                setLoading(false);
            }
        };
        fetchProducts();
    }, []);

    // Scroll to section handling for redirected users
    useEffect(() => {
        if (!loading && typeof window !== 'undefined' && window.location.hash === '#ramadan-special-offers') {
            const element = document.getElementById('ramadan-special-offers');
            if (element) {
                setTimeout(() => {
                    const offset = 80;
                    const bodyRect = document.body.getBoundingClientRect().top;
                    const elementRect = element.getBoundingClientRect().top;
                    const elementPosition = elementRect - bodyRect;
                    const offsetPosition = elementPosition - offset;

                    window.scrollTo({
                        top: offsetPosition,
                        behavior: 'smooth'
                    });
                }, 100);
            }
        }
    }, [loading]);

    const clean = (s) => s?.toLowerCase().replace(/&amp;/g, "").replace(/[^\w\s-]/g, "").trim().replace(/\s+/g, "-");

    if (!loading && products.length === 0) {
        return null;
    }

    return (
        <Box
            id="ramadan-special-offers"
            component="section"
            sx={{
                py: { xs: 4, md: 8 },
            }}
        >
            <Container maxWidth="xl">
                <Box sx={{ textAlign: "center", mb: { xs: 4, md: 6 } }}>
                    <Typography
                        variant="h2"
                        sx={{
                            color: "#2C2416",
                            fontSize: { xs: "1.5rem", sm: "2rem", md: "3rem" },
                            fontWeight: 800,
                            textTransform: "uppercase",
                            mb: 1.5,
                            letterSpacing: "0.05em"
                        }}
                    >
                        {t("Ramadan Special Offers")}
                    </Typography>
                    <Box
                        sx={{
                            width: { xs: "60px", md: "100px" },
                            height: { xs: "3px", md: "4px" },
                            background: "linear-gradient(90deg, #BF953F, #C9A961)",
                            mx: "auto",
                            borderRadius: "2px"
                        }}
                    />
                </Box>

                {loading ? (
                    <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
                        <CircularProgress sx={{ color: "#BF953F" }} />
                    </Box>
                ) : (
                    <div className="products-grid row row-cols-2 row-cols-md-3 row-cols-lg-4 g-2 g-md-4">
                        {products.map((elm, i) => (
                            <div key={elm.product_id || i} className="product-card-wrapper">
                                <div className="product-card mb-3 mb-md-5">
                                    <div className="pc__img-wrapper">
                                        <Swiper className="background-img" slidesPerView={1} navigation={false} modules={[Navigation]}>
                                            {JSON.parse(elm.images).map((img, index) => (
                                                <SwiperSlide key={index}>
                                                    <Link href={`/${locale}/shop/${clean(elm.category_name)}/all/${clean(elm.product_name)}`}>
                                                        <Image
                                                            loading="lazy"
                                                            src={`${process.env.NEXT_PUBLIC_API_URL}storage/${img}`}
                                                            width={330}
                                                            height={400}
                                                            alt={elm.product_name}
                                                            className={`pc__img ${index === 1 ? "pc__img-second" : ""}`}
                                                        />
                                                    </Link>
                                                </SwiperSlide>
                                            ))}
                                        </Swiper>

                                        {elm.label_name && (
                                            <div style={{ backgroundColor: elm.label_color }} className="product-label text-uppercase text-white top-0 left-auto right-0 mt-2 mx-2"
                                                sx={{ fontSize: { xs: '0.6rem', md: '0.75rem' }, px: 1 }}>
                                                {elm.label_name}
                                            </div>
                                        )}

                                        {elm.product_qty <= 0 ? (
                                            <div style={{ backgroundColor: "#dc3545" }} className="product-label text-uppercase text-white top-0 left-0 mt-2 mx-2 "
                                                sx={{ fontSize: { xs: '0.6rem', md: '0.75rem' }, px: 1 }}>
                                                Out Of Stock
                                            </div>
                                        ) : (
                                            elm.discount && elm.discount.discount_type === 'percent' && (
                                                <div style={{ backgroundColor: "#198754" }} className="product-label text-uppercase text-white top-0 left-0 mt-2 mx-2"
                                                    sx={{ fontSize: { xs: '0.6rem', md: '0.75rem' }, px: 1 }}>
                                                    Sale {elm.discount.value}%
                                                </div>
                                            )
                                        )}

                                        {elm.product_qty > 0 && (
                                            <button
                                                className="pc__atc btn anim_appear-bottom position-absolute border-0 text-uppercase fw-medium"
                                                onClick={() => addProductToCart(elm)}
                                                disabled={isAddedToCartProducts(elm.product_id)}
                                                style={{ fontSize: '0.7rem', padding: '8px 12px' }}
                                            >
                                                {t(isAddedToCartProducts(elm.product_id) ? "Already Added" : "Add To Cart")}
                                            </button>
                                        )}
                                    </div>

                                    <div className="pc__info position-relative">
                                        <p className="pc__category" style={{ fontSize: '0.65rem', marginBottom: '2px' }}>{t(elm.category_name)}</p>
                                        <h6 className="pc__title" style={{ fontSize: '0.85rem', marginBottom: '4px', lineHeight: 1.2 }}>
                                            <Link href={`/${locale}/shop/${clean(elm.category_name)}/all/${clean(elm.product_name)}`}>
                                                {t(he.decode(elm.product_name))}
                                            </Link>
                                        </h6>
                                        <div className="product-card__price d-flex" style={{ fontSize: '0.9rem' }}>
                                            {currency && renderPrice(elm, currency)}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </Container>
        </Box>
    );
};

export default RamadanSpecialOffer;
