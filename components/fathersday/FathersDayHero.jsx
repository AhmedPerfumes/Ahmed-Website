"use client";
import { Box, Container, Typography, Button, Grid, useMediaQuery, useTheme } from "@mui/material";
import { motion } from "framer-motion";
import Link from "next/link";
import { useLocale } from "next-intl";
import { ArrowForward } from "@mui/icons-material";
import Image from "next/image";

const translations = {
    en: {
        kareem: "CELEBRATING FATHER'S DAY 2026",
        title1: "Luxury Father's Day",
        title2: "Gifts",
        description: "Shop elegant perfumes, gift sets, Father's Day collection, and bakhoor for meaningful gifting.",
        shop_collection: "Shop Father's Day Collection",
        explore_sets: "Explore Gift Sets",
    },
    ar: {
        kareem: "نحتفل بيوم الأب ٢٠٢٦",
        title1: "هدايا يوم الأب",
        title2: "الفاخرة",
        description: "تسوّق عطور أنيقة، مجموعات هدايا، تشكيلة يوم الأب، وبخور لهدايا تحمل معنى.",
        shop_collection: "تسوّق مجموعة يوم الأب",
        explore_sets: "استكشف مجموعات الهدايا",
    },
};

const FathersDayHero = () => {
    const locale = useLocale();
    const isRtl = locale === "ar";
    const t = translations[locale] || translations.en;
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("md"));

    return (
        <Box
            component="section"
            dir="ltr"
            sx={{
                minHeight: { xs: "50vh", md: "100vh" }, // Adjusted mobile height per previous requests to 50vh
                background: "#0f0f0f",
                position: "relative",
                overflow: "hidden",
                display: "flex",
                alignItems: "center",
                py: { xs: 2, md: 12 }
            }}
        >
            {/* Animated Background Image */}
            <motion.div
                initial={isMobile ? { opacity: 0 } : { x: "100%" }}
                animate={isMobile ? { opacity: 1 } : { x: 0 }}
                transition={{ duration: 1.2, ease: "easeOut" }}
                style={{
                    position: "absolute",
                    top: 0,
                    right: 0,
                    width: "100%",
                    height: "100%",
                    zIndex: 0,
                }}
            >
                <Box
                    sx={{
                        position: "absolute",
                        top: 0,
                        right: 0,
                        width: "100%",
                        height: "100%",
                        backgroundImage: `url('/assets/images/fathersday/banner.jpeg')`,
                        backgroundSize: "cover",
                        backgroundPosition: { xs: "35% center", md: "right center" },
                        backgroundRepeat: "no-repeat"
                    }}
                />
            </motion.div>

            {/* Dark overlay to ensure text readability */}
            <Box
                sx={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: "linear-gradient(to right, rgba(15, 15, 15, 0.85) 0%, rgba(15, 15, 15, 0.4) 100%)",
                    zIndex: 1,
                }}
            />

            {/* Top Gold Border */}
            <Box
                sx={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    height: "6px",
                    background: "linear-gradient(90deg, transparent, #BF953F 20%, #C9A961 50%, #BF953F 80%, transparent)",
                    zIndex: 2
                }}
            />

            <Container maxWidth="xl" sx={{ position: "relative", zIndex: 2, height: "100%" }}>
                <Grid container justifyContent={{ xs: "center", md: "flex-start" }} alignItems="center" sx={{ height: "100%" }}>
                    {/* Content Wrapper */}
                    <Grid item xs={12} md={6} sx={{ mt: { xs: "5vh", md: 0 }, textAlign: { xs: "center", md: "inherit" } }}>
                        <motion.div
                            initial={isMobile ? { opacity: 0, y: 30 } : { opacity: 0, x: -50 }}
                            animate={{ opacity: 1, x: 0, y: 0 }}
                            transition={{ duration: 0.8 }}
                        >
                            {/* Decorative Element */}
                            <Box sx={{ display: "flex", alignItems: "center", justifyContent: { xs: "center", md: "flex-start" }, gap: 2, mb: { xs: 1, md: 3 } }}>
                                <Typography
                                    variant="overline"
                                    sx={{
                                        color: "#BF953F",
                                        letterSpacing: "0.3em",
                                        fontWeight: 600,
                                        fontSize: { xs: "0.7rem", md: "0.9rem" },
                                        mb: { xs: 1, md: 2 },
                                        display: "block"
                                    }}
                                >
                                    {t.kareem}
                                </Typography>
                            </Box>

                            {/* Main Heading */}
                            <Typography
                                variant="h1"
                                sx={{
                                    color: "#FFFFFF",
                                    fontSize: { xs: "1.5rem", sm: "3.5rem", md: "4.5rem", lg: "5.5rem", xl: "6rem" },
                                    fontWeight: 800,
                                    mb: { xs: 1.5, md: 3 },
                                    lineHeight: 0.95,
                                    textShadow: "0 4px 30px rgba(0,0,0,0.5)",
                                    letterSpacing: "-0.01em"
                                }}
                            >
                                {t.title1}
                                <br />
                                <Box
                                    component="span"
                                    sx={{
                                        background: "linear-gradient(135deg, #BF953F 0%, #C9A961 100%)",
                                        WebkitBackgroundClip: "text",
                                        WebkitTextFillColor: "transparent",
                                        backgroundClip: "text"
                                    }}
                                >
                                    {t.title2}
                                </Box>
                            </Typography>

                            {/* Description */}
                            <Typography
                                variant="h6"
                                sx={{
                                    color: "rgba(255, 255, 255, 0.9)",
                                    fontSize: { xs: "0.8rem", md: "1.1rem" },
                                    mb: { xs: 2.5, md: 5 },
                                    mx: { xs: "auto", md: 0 },
                                    maxWidth: "500px",
                                    lineHeight: { xs: 1.5, md: 1.8 },
                                    fontWeight: 300
                                }}
                            >
                                {t.description}
                            </Typography>

                            {/* CTA Buttons */}
                            <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap", justifyContent: { xs: "center", md: "flex-start" } }}>
                                <motion.div
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    <Button
                                        component={Link}
                                        href={`/${locale}/product-category/collections`}
                                        endIcon={<ArrowForward sx={{ transform: isRtl ? "rotate(180deg)" : "none" }} />}
                                        sx={{
                                            background: "linear-gradient(135deg, #BF953F 0%, #C9A961 100%)",
                                            color: "#1a0a2e",
                                            px: { xs: 3, md: 5 },
                                            py: { xs: 0.8, md: 2 },
                                            fontSize: { xs: "0.7rem", md: "1rem" },
                                            fontWeight: 700,
                                            borderRadius: "50px",
                                            textTransform: "uppercase",
                                            letterSpacing: "0.05em",
                                            boxShadow: "0 8px 30px rgba(191, 149, 63, 0.4)",
                                            "&:hover": {
                                                background: "linear-gradient(135deg, #C9A961 0%, #BF953F 100%)",
                                                boxShadow: "0 12px 40px rgba(191, 149, 63, 0.6)"
                                            }
                                        }}
                                    >
                                        {t.shop_collection}
                                    </Button>
                                </motion.div>

                                <motion.div
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    <Button
                                        component={Link}
                                        href={`/${locale}/product-category/gift-sets`}
                                        sx={{
                                            color: "#FFFFFF",
                                            borderColor: "rgba(255, 255, 255, 0.3)",
                                            border: "2px solid",
                                            px: { xs: 3, md: 5 },
                                            py: { xs: 0.8, md: 2 },
                                            fontSize: { xs: "0.7rem", md: "1rem" },
                                            fontWeight: 700,
                                            borderRadius: "50px",
                                            textTransform: "uppercase",
                                            letterSpacing: "0.05em",
                                            backdropFilter: "blur(10px)",
                                            background: "rgba(255, 255, 255, 0.05)",
                                            "&:hover": {
                                                borderColor: "#BF953F",
                                                background: "rgba(191, 149, 63, 0.1)",
                                                color: "#BF953F"
                                            }
                                        }}
                                    >
                                        {t.explore_sets}
                                    </Button>
                                </motion.div>
                            </Box>
                        </motion.div>
                    </Grid>
                </Grid>
            </Container>

            {/* Bottom Gold Border */}
            <Box
                sx={{
                    position: "absolute",
                    bottom: 0,
                    left: 0,
                    right: 0,
                    height: "6px",
                    background: "linear-gradient(90deg, transparent, #BF953F 20%, #C9A961 50%, #BF953F 80%, transparent)",
                    zIndex: 2
                }}
            />
        </Box >
    );
};

export default FathersDayHero;
