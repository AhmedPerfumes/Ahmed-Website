"use client";
import { Box, Container, Typography } from "@mui/material";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useLocale } from "next-intl";

const translations = {
    en: {
        subtitle: "✦ EXPLORE BY CATEGORY ✦",
        title: "Father's Day Essentials",
        categories: {
            perfumes: "Perfumes",
            concentrated_parfum: "Concentrated Parfum",
            dakhoon: "Dakhoon",
            gift_sets: "Gift Sets",
            collection: "Collection",
            care_essentials: "Care Essentials",
        }
    },
    ar: {
        subtitle: "✦ استكشف حسب الفئة ✦",
        title: "أساسيات يوم الأب",
        categories: {
            perfumes: "عطور",
            concentrated_parfum: "العطورالزيتية",
            dakhoon: "دخون",
            gift_sets: "أطقم هدايا",
            collection: "المجموعات",
            care_essentials: "أساسيات العناية",
        }
    }
};

const FathersDayBentoGrid = () => {
    const locale = useLocale();
    const isRtl = locale === "ar";
    const t = translations[locale] || translations.en;

    const categories = [
        {
            title: t.categories.perfumes,
            image: "/assets/images/fathersday/perfumes.jpeg",
            gridArea: { xs: "auto", md: "1 / 1 / 3 / 3" }, // 2x2
            slug: "perfumes",
        },
        {
            title: t.categories.gift_sets,
            image: "/assets/images/fathersday/gift-set2.jpeg",
            gridArea: { xs: "auto", md: "1 / 3 / 2 / 6" }, // 1x3
            slug: "gift-sets",
        },
        {
            title: t.categories.dakhoon,
            image: "/assets/images/fathersday/bakhoooor.jpeg",
            gridArea: { xs: "auto", md: "2 / 3 / 3 / 5" }, // 1x2
            slug: "dakhoon",
        },
        {
            title: t.categories.concentrated_parfum,
            image: "/assets/images/fathersday/oil.jpeg",
            gridArea: { xs: "auto", md: "2 / 5 / 4 / 6" }, // 2x1
            slug: "concentrated-parfum",
        },
        {
            title: t.categories.collection,
            image: "/assets/images/fathersday/collections-1.jpeg",
            gridArea: { xs: "auto", md: "3 / 1 / 4 / 3" }, // 1x2
            slug: "collections",
        },
        {
            title: t.categories.care_essentials,
            image: "/assets/images/fathersday/care-essentials.jpeg",
            gridArea: { xs: "auto", md: "3 / 3 / 4 / 5" }, // 1x2
            slug: "care-essentials",
        }
    ];

    return (
        <Box
            component="section"
            dir={isRtl ? "rtl" : "ltr"}
            sx={{
                py: { xs: 4, md: 12 },
                background: "linear-gradient(180deg, #F5F1E8 0%, #EDE8DC 100%)",
                position: "relative",
                overflow: "hidden"
            }}
        >
            {/* Gold radial glow */}
            <Box
                sx={{
                    position: "absolute",
                    top: "20%",
                    [isRtl ? "left" : "right"]: "10%",
                    width: "500px",
                    height: "500px",
                    background: "radial-gradient(circle, rgba(191, 149, 63, 0.15) 0%, transparent 70%)",
                    filter: "blur(80px)",
                    zIndex: 0
                }}
            />

            <Container maxWidth="xl" sx={{ position: "relative", zIndex: 1 }}>
                {/* Section Header */}
                <Box sx={{ textAlign: "center", mb: { xs: 3, md: 6 } }}>
                    <Box
                        sx={{
                            width: { xs: "80px", md: "120px" },
                            height: "3px",
                            background: "linear-gradient(90deg, transparent, #BF953F, transparent)",
                            margin: { xs: "0 auto 10px", md: "0 auto 20px" }
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
                            fontSize: { xs: "1.5rem", md: "3rem" },
                            fontWeight: 700,
                            fontFamily: "'Playfair Display', serif"
                        }}
                    >
                        {t.title}
                    </Typography>
                </Box>

                {/* Bento Grid */}
                <Box
                    sx={{
                        display: "grid",
                        gridTemplateColumns: { xs: "1fr", md: "repeat(5, 1fr)" },
                        gridTemplateRows: { xs: "auto", md: "repeat(3, 280px)" },
                        gap: { xs: 2, md: 3 },
                        width: "100%"
                    }}
                >
                    {categories.map((category, index) => (
                        <Box
                            key={index}
                            sx={{
                                gridArea: category.gridArea,
                                minHeight: { xs: "180px", md: "220px" }
                            }}
                        >
                            <motion.div
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.6, delay: index * 0.1 }}
                                style={{
                                    height: "100%"
                                }}
                            >
                                <Link
                                    href={`/${locale}/product-category/${category.slug}`}
                                    style={{ display: "block", height: "100%", textDecoration: "none" }}
                                >
                                    <Box
                                        sx={{
                                            position: "relative",
                                            width: "100%",
                                            height: "100%",
                                            borderRadius: "16px",
                                            overflow: "hidden",
                                            boxShadow: "0 10px 40px rgba(44, 36, 22, 0.12)",
                                            transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
                                            cursor: "pointer",
                                            "&:hover": {
                                                transform: "translateY(-8px)",
                                                boxShadow: "0 20px 60px rgba(44, 36, 22, 0.2)",
                                                "& .category-overlay": {
                                                    opacity: 1
                                                },
                                                "& img": {
                                                    transform: "scale(1.1)"
                                                }
                                            }
                                        }}
                                    >
                                        {/* Image */}
                                        <Image
                                            src={category.image}
                                            alt={category.title}
                                            fill
                                            style={{
                                                objectFit: "cover",
                                                transition: "transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)"
                                            }}
                                        />

                                        {/* Gradient Overlay */}
                                        <Box
                                            className="category-overlay"
                                            sx={{
                                                position: "absolute",
                                                bottom: 0,
                                                left: 0,
                                                right: 0,
                                                top: 0,
                                                background: "linear-gradient(to top, rgba(0, 0, 0, 0.85) 0%, rgba(0, 0, 0, 0.01) 50%, transparent 100%)",
                                                opacity: 0.6,
                                                transition: "opacity 0.4s ease",
                                                display: "flex",
                                                alignItems: "flex-end",
                                                p: { xs: 2, md: 3 }
                                            }}
                                        >
                                            <Typography
                                                variant="h5"
                                                sx={{
                                                    color: "#FFFFFF",
                                                    fontWeight: 700,
                                                    fontSize: { xs: "1.1rem", md: "1.5rem" },
                                                    textShadow: "0 2px 8px rgba(0,0,0,0.3)",
                                                    letterSpacing: "0.5px"
                                                }}
                                            >
                                                {category.title}
                                            </Typography>
                                        </Box>
                                    </Box>
                                </Link>
                            </motion.div>
                        </Box>
                    ))}
                </Box>
            </Container>
        </Box>
    );
};

export default FathersDayBentoGrid;
