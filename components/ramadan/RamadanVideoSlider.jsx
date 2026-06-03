"use client";
import { Box, Container, Typography, Button, useMediaQuery, useTheme } from "@mui/material";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import { useEffect, useState } from "react";
import { useLocale } from "next-intl";
import Link from "next/link";
import Image from "next/image";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import he from "he";

const translations = {
    en: {
        subtitle: "✦ DISCOVER THE COLLECTION ✦",
        cta: "Explore Collection",
        cta_mobile: "Explore",
        view_all: "View All Collections"
    },
    ar: {
        subtitle: "✦ اكتشف المجموعة ✦",
        cta: "استكشف المجموعة",
        cta_mobile: "استكشف",
        view_all: "عرض كل المجموعات"
    }
};

const RamadanVideoSlider = () => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
    const locale = useLocale();
    const isRtl = locale === "ar";
    const t = translations[locale] || translations.en;

    const [slides, setSlides] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Determine origin for the request (client-side fallback)
                const origin = typeof window !== 'undefined' ? window.location.origin : '';

                const res = await fetch("https://admin.ahmedalmaghribi.com/public/api/products", {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'origin': origin,
                    },
                    body: JSON.stringify({
                        category: "Collections",
                    }),
                });

                if (!res.ok) throw new Error("Network response was not ok");

                const data = await res.json();

                // The API returns the specific category object directly when querying by category
                const collectionsCategory = data;

                if (collectionsCategory) {
                    // Find Ramadan Collection (ID: 30)
                    const ramadanCollection = collectionsCategory.productSubCategories?.find(sub => sub.id === 34);

                    if (ramadanCollection && ramadanCollection.products) {
                        const formattedSlides = ramadanCollection.products.map(product => {
                            // Strip HTML tags from description
                            const cleanDescription = product.description
                                ? product.description.replace(/<[^>]*>?/gm, '').substring(0, 150) + "..."
                                : "";

                            // Generate slug from product name
                            const productSlug = product.product_name
                                ? product.product_name.toLowerCase().replace(/\s+/g, '-')
                                : product.product_id;

                            return {
                                id: product.product_id,
                                title: isRtl ? (product.product_name_ar || product.product_name) : product.product_name,
                                subtitle: isRtl ? "مجموعة العيد" : "Eid Collection",
                                description: cleanDescription,
                                image: `https://admin.ahmedalmaghribi.com/public/storage/${JSON.parse(product.images)[0]}`,
                                link: `/shop/collections/ramadan-collection/${productSlug}`
                            };
                        });
                        setSlides(formattedSlides);
                    }
                }
            } catch (error) {
                console.error("Error fetching collections:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [isRtl]);

    if (loading) return null; // Or a loading spinner

    if (slides.length === 0) return null;

    return (
        <Box
            component="section"
            dir={isRtl ? "rtl" : "ltr"}
            sx={{
                py: { xs: 6, md: 10 },
                background: "linear-gradient(180deg, #F5F1E8 0%, #EDE8DC 100%)",
                position: "relative",
                overflow: "hidden"
            }}
        >
            <Container maxWidth="xl">
                {/* Section Header */}
                <Box sx={{ textAlign: "center", mb: 6, position: "relative", zIndex: 2 }}>
                    {/* Decorative Top Line */}
                    <Box
                        sx={{
                            width: "120px",
                            height: "3px",
                            background: "linear-gradient(90deg, transparent, #BF953F, transparent)",
                            margin: "0 auto 20px"
                        }}
                    />

                    <Typography
                        variant="overline"
                        sx={{
                            color: "#BF953F",
                            letterSpacing: "0.25em",
                            fontWeight: 600,
                            fontSize: { xs: "0.75rem", md: "0.85rem" },
                            display: "block",
                            mb: 2
                        }}
                    >
                        {t.subtitle}
                    </Typography>

                    <Typography
                        variant="h2"
                        sx={{
                            color: "#2C2416",
                            fontSize: { xs: "2rem", md: "3rem" },
                            fontWeight: 700,
                            fontFamily: "'Playfair Display', serif",
                            mb: 2
                        }}
                    >
                        {isRtl ? "مجموعات العيد" : "Eid Collections"}
                    </Typography>

                    <Typography
                        variant="body1"
                        sx={{
                            color: "rgba(44, 36, 22, 0.8)",
                            fontSize: { xs: "0.95rem", md: "1.1rem" },
                            maxWidth: "600px",
                            mx: "auto",
                            lineHeight: 1.6
                        }}
                    >
                        {t.description}
                    </Typography>
                </Box>

                <Swiper
                    modules={[Navigation, Pagination, Autoplay]}
                    navigation
                    pagination={{ clickable: true }}
                    autoplay={{ delay: 4500, disableOnInteraction: false }}
                    loop
                    speed={700}
                    dir={isRtl ? "rtl" : "ltr"}
                    key={locale}
                >
                    {slides.map((slide, index) => (
                        <SwiperSlide key={slide.id}>
                            <Box
                                sx={{
                                    position: "relative",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    minHeight: { xs: "600px", md: "700px" },
                                    py: 4
                                }}
                            >
                                {/* Replaced Video Card with Image Card - Top Left */}
                                <Box
                                    sx={{
                                        position: "absolute",
                                        top: { xs: "8%", md: "10%" },
                                        [isRtl ? "right" : "left"]: { xs: "5%", md: "10%" },
                                        width: { xs: "200px", md: "350px" },
                                        height: { xs: "280px", md: "450px" },
                                        borderRadius: "20px",
                                        overflow: "hidden",
                                        boxShadow: "0 25px 60px rgba(191, 149, 63, 0.25)",
                                        border: "3px solid rgba(191, 149, 63, 0.3)",
                                        transform: isRtl ? "rotate(8deg)" : "rotate(-8deg)",
                                        zIndex: 1
                                    }}
                                >
                                    <Image
                                        src={slide.image}
                                        alt={slide.title}
                                        fill
                                        style={{
                                            objectFit: "cover"
                                        }}
                                    />
                                </Box>

                                {/* Product Image - Bottom Right, Overlapping */}
                                <Box
                                    sx={{
                                        position: "absolute",
                                        bottom: { xs: "8%", md: "10%" },
                                        [isRtl ? "left" : "right"]: { xs: "5%", md: "12%" },
                                        width: { xs: "200px", md: "350px" },
                                        height: { xs: "280px", md: "450px" },
                                        borderRadius: "20px",
                                        overflow: "hidden",
                                        boxShadow: "0 25px 60px rgba(191, 149, 63, 0.25)",
                                        border: "3px solid rgba(191, 149, 63, 0.3)",
                                        transform: isRtl ? "rotate(-5deg)" : "rotate(5deg)",
                                        zIndex: 2
                                    }}
                                >
                                    <Image
                                        src={slide.image}
                                        alt={slide.title}
                                        fill
                                        style={{ objectFit: "cover" }}
                                        priority={index === 0}
                                    />
                                </Box>

                                {/* Title & Subtitle - Beside Video on Mobile, Centered on Desktop */}
                                <Box
                                    sx={{
                                        position: { xs: "absolute", md: "absolute" },
                                        top: { xs: "8%", md: "50%" },
                                        [isRtl ? "left" : "right"]: { xs: "2%", md: "auto" },
                                        [isRtl ? "right" : "left"]: { xs: "auto", md: "50%" },
                                        transform: { xs: "none", md: isRtl ? "translate(50%, -50%)" : "translate(-50%, -50%)" },
                                        textAlign: { xs: isRtl ? "left" : "right", md: "center" },
                                        zIndex: 3,
                                        px: 2,
                                        maxWidth: { xs: "45%", md: "500px" },
                                        display: "flex",
                                        flexDirection: "column",
                                        alignItems: { xs: isRtl ? "flex-start" : "flex-end", md: "center" }
                                    }}
                                >
                                    {/* Title - Split Design */}
                                    <Typography
                                        variant="h2"
                                        sx={{
                                            fontSize: { xs: "1.5rem", md: "4.5rem" },
                                            fontWeight: 300,
                                            fontFamily: "'Playfair Display', serif",
                                            color: { xs: "#2C2416", md: "rgba(44, 36, 22, 0.85)" },
                                            lineHeight: { xs: 1.1, md: 0.9 },
                                            mb: 0.5,
                                            letterSpacing: "0.02em",
                                            textShadow: "2px 2px 10px rgba(255,255,255,0.5)"
                                        }}
                                    >
                                        {he.decode(slide.title)}
                                    </Typography>
                                    <Typography
                                        variant="h2"
                                        sx={{
                                            fontSize: { xs: "1.5rem", md: "4.5rem" },
                                            fontWeight: 700,
                                            fontFamily: "'Playfair Display', serif",
                                            background: "linear-gradient(135deg, #BF953F 0%, #8B6914 100%)",
                                            WebkitBackgroundClip: "text",
                                            WebkitTextFillColor: "transparent",
                                            lineHeight: { xs: 1.1, md: 0.9 },
                                            letterSpacing: "0.02em",
                                            mb: 3,
                                            filter: "drop-shadow(0px 2px 4px rgba(0,0,0,0.1))"
                                        }}
                                    >
                                        {/* {slide.subtitle} */}
                                    </Typography>

                                    {/* CTA Button Moved Here */}
                                    <Link href={`/${locale}${slide.link}`} passHref>
                                        <Button
                                            variant="contained"
                                            sx={{
                                                background: "linear-gradient(135deg, #BF953F 0%, #8B6914 100%)",
                                                color: "#FFFFFF",
                                                borderRadius: "30px",
                                                px: { xs: 2, md: 6 },
                                                py: { xs: 0.8, md: 1.8 },
                                                fontSize: { xs: "0.7rem", md: "1rem" },
                                                fontWeight: 700,
                                                textTransform: "uppercase",
                                                letterSpacing: "1.5px",
                                                boxShadow: "0 10px 25px rgba(139, 105, 20, 0.4)",
                                                transition: "all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
                                                "&:hover": {
                                                    background: "linear-gradient(135deg, #8B6914 0%, #BF953F 100%)",
                                                    transform: "translateY(-5px) scale(1.05)",
                                                    boxShadow: "0 15px 35px rgba(139, 105, 20, 0.5)"
                                                }
                                            }}
                                        >
                                            {isMobile ? t.cta_mobile : t.cta}
                                        </Button>
                                    </Link>
                                </Box>


                                {/* Description - Beside Image on Mobile, Below Video on Desktop */}
                                <Box
                                    sx={{
                                        position: "absolute",
                                        bottom: { xs: "8%", md: "10%" },
                                        [isRtl ? "right" : "left"]: { xs: "2%", md: "10%" },
                                        [isRtl ? "left" : "right"]: { xs: "auto", md: "auto" },
                                        zIndex: 3,
                                        maxWidth: { xs: "45%", md: "450px" }
                                    }}
                                >
                                    <Box
                                        sx={{
                                            background: "rgba(255, 255, 255, 0.95)",
                                            backdropFilter: "blur(10px)",
                                            borderRadius: { xs: "12px", md: "16px" },
                                            px: { xs: 2, md: 4 },
                                            py: { xs: 1.5, md: 3 },
                                            border: "2px solid rgba(191, 149, 63, 0.2)",
                                            boxShadow: "0 8px 24px rgba(44, 36, 22, 0.1)"
                                        }}
                                    >
                                        {/* Decorative accent line */}
                                        <Box
                                            sx={{
                                                width: { xs: "40px", md: "60px" },
                                                height: "3px",
                                                background: "linear-gradient(90deg, #BF953F, #D4AF37)",
                                                mb: { xs: 1, md: 2 },
                                                borderRadius: "2px"
                                            }}
                                        />
                                        <Typography
                                            variant="body1"
                                            sx={{
                                                fontSize: { xs: "0.7rem", md: "1.1rem" },
                                                color: "#2C2416",
                                                lineHeight: 1.6,
                                                fontWeight: 400,
                                                letterSpacing: "0.3px",
                                                fontStyle: "italic",
                                                position: "relative",
                                                [isRtl ? "pr" : "pl"]: { xs: 2, md: 3 },
                                                "&::before": {
                                                    content: '"\u201C"',
                                                    position: "absolute",
                                                    [isRtl ? "right" : "left"]: 0,
                                                    top: { xs: "-6px", md: "-10px" },
                                                    fontSize: { xs: "1.5rem", md: "2.5rem" },
                                                    color: "rgba(191, 149, 63, 0.3)",
                                                    fontFamily: "Georgia, serif",
                                                    lineHeight: 1
                                                }
                                            }}
                                        >
                                            {slide.description}
                                        </Typography>
                                    </Box>
                                </Box>

                                {/* Decorative Elements */}
                                {/* Large Circles */}
                                <Box
                                    sx={{
                                        position: "absolute",
                                        top: "30%",
                                        right: "8%",
                                        width: "150px",
                                        height: "150px",
                                        border: "2px solid rgba(191, 149, 63, 0.15)",
                                        borderRadius: "50%",
                                        zIndex: 0
                                    }}
                                />
                                <Box
                                    sx={{
                                        position: "absolute",
                                        top: "5%",
                                        left: "50%",
                                        width: "100px",
                                        height: "100px",
                                        border: "2px solid rgba(191, 149, 63, 0.12)",
                                        borderRadius: "50%",
                                        zIndex: 0
                                    }}
                                />

                                {/* Additional Decorative Circles */}
                                <Box
                                    sx={{
                                        position: "absolute",
                                        bottom: "15%",
                                        left: "8%",
                                        width: "80px",
                                        height: "80px",
                                        border: "1px solid rgba(191, 149, 63, 0.1)",
                                        borderRadius: "50%",
                                        zIndex: 0
                                    }}
                                />
                                <Box
                                    sx={{
                                        position: "absolute",
                                        top: "60%",
                                        right: "25%",
                                        width: "60px",
                                        height: "60px",
                                        border: "1px solid rgba(191, 149, 63, 0.08)",
                                        borderRadius: "50%",
                                        zIndex: 0
                                    }}
                                />
                                <Box
                                    sx={{
                                        position: "absolute",
                                        top: "20%",
                                        left: "20%",
                                        width: "120px",
                                        height: "120px",
                                        border: "1px dashed rgba(191, 149, 63, 0.12)",
                                        borderRadius: "50%",
                                        zIndex: 0
                                    }}
                                />
                                <Box
                                    sx={{
                                        position: "absolute",
                                        bottom: "35%",
                                        right: "15%",
                                        width: "90px",
                                        height: "90px",
                                        border: "1px dashed rgba(191, 149, 63, 0.1)",
                                        borderRadius: "50%",
                                        zIndex: 0
                                    }}
                                />

                                {/* Star/Sparkle Elements */}
                                <Box
                                    sx={{
                                        position: "absolute",
                                        top: "15%",
                                        right: "20%",
                                        width: "8px",
                                        height: "8px",
                                        background: "#BF953F",
                                        borderRadius: "50%",
                                        zIndex: 0,
                                        opacity: 0.6,
                                        boxShadow: "0 0 10px rgba(191, 149, 63, 0.5)"
                                    }}
                                />
                                <Box
                                    sx={{
                                        position: "absolute",
                                        bottom: "25%",
                                        left: "30%",
                                        width: "6px",
                                        height: "6px",
                                        background: "#D4AF37",
                                        borderRadius: "50%",
                                        zIndex: 0,
                                        opacity: 0.5,
                                        boxShadow: "0 0 8px rgba(212, 175, 55, 0.5)"
                                    }}
                                />
                                <Box
                                    sx={{
                                        position: "absolute",
                                        top: "40%",
                                        left: "12%",
                                        width: "5px",
                                        height: "5px",
                                        background: "#BF953F",
                                        borderRadius: "50%",
                                        zIndex: 0,
                                        opacity: 0.4
                                    }}
                                />
                                <Box
                                    sx={{
                                        position: "absolute",
                                        top: "70%",
                                        right: "35%",
                                        width: "7px",
                                        height: "7px",
                                        background: "#D4AF37",
                                        borderRadius: "50%",
                                        zIndex: 0,
                                        opacity: 0.5,
                                        boxShadow: "0 0 8px rgba(212, 175, 55, 0.4)"
                                    }}
                                />

                                {/* Decorative Corner Elements */}
                                <Box
                                    sx={{
                                        position: "absolute",
                                        top: 0,
                                        right: 0,
                                        width: "200px",
                                        height: "200px",
                                        zIndex: 0,
                                        pointerEvents: "none"
                                    }}
                                />
                                <Box
                                    sx={{
                                        position: "absolute",
                                        bottom: 0,
                                        left: 0,
                                        width: "250px",
                                        height: "250px",
                                        zIndex: 0,
                                        pointerEvents: "none"
                                    }}
                                />
                            </Box>
                        </SwiperSlide>
                    ))}
                </Swiper>

                {/* View All Collections Button */}
                <Box sx={{ textAlign: "center", mt: 6 }}>
                    <Link href={`/${locale}/product-category/collections`} passHref>
                        <Button
                            variant="outlined"
                            sx={{
                                borderColor: "#BF953F",
                                color: "#2C2416",
                                borderRadius: "30px",
                                px: { xs: 3, md: 5 },
                                py: { xs: 1, md: 1.5 },
                                fontSize: { xs: "0.8rem", md: "1rem" },
                                fontWeight: 600,
                                textTransform: "uppercase",
                                letterSpacing: "1px",
                                transition: "all 0.3s ease",
                                "&:hover": {
                                    backgroundColor: "#BF953F",
                                    color: "#FFFFFF",
                                    borderColor: "#BF953F"
                                }
                            }}
                        >
                            {t.view_all}
                        </Button>
                    </Link>
                </Box>
            </Container>

            {/* Swiper Custom Styling */}
            <style jsx global>{`
                .swiper-button-next,
                .swiper-button-prev {
                    color: #BF953F !important;
                    background: #BF953F !important;
                    backdrop-filter: blur(10px);
                    width: 50px;
                    height: 50px;
                    border-radius: 50%;
                    border: 2px solid rgba(191, 149, 63, 0.3);
                    transition: all 0.3s ease;
                    box-shadow: 0 4px 12px rgba(44, 36, 22, 0.15);
                }

                @media (max-width: 768px) {
                    .swiper-button-next,
                    .swiper-button-prev {
                        display: none;
                    }
                }

                .swiper-button-next:hover,
                .swiper-button-prev:hover {
                    background: #bf953fab;
                    color: #000000 !important;
                    border-color: #BF953F;
                    transform: scale(1.1);
                    box-shadow: 0 6px 16px rgba(191, 149, 63, 0.3);
                }

                .swiper-button-next:after,
                .swiper-button-prev:after {
                    font-size: 20px !important;
                }

                .swiper-pagination-bullet {
                    background: rgba(191, 149, 63, 0.3) !important;
                    opacity: 1 !important;
                    width: 10px;
                    height: 10px;
                }

                .swiper-pagination-bullet-active {
                    border: 2px solid #BF953F !important;
                    width: 30px;
                    border-radius: 5px;
                }
            `}</style>
        </Box>
    );
};

export default RamadanVideoSlider;
