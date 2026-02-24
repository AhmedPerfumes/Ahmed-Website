"use client";
import { Box, Container, Typography, Button, Grid, useMediaQuery, useTheme } from "@mui/material";
import { motion } from "framer-motion";
import Link from "next/link";
import { useLocale } from "next-intl";
import { ArrowForward } from "@mui/icons-material";
import Image from "next/image";

const translations = {
    en: {
        kareem: "RAMADAN KAREEM 2026",
        title1: "Luxury Ramadan",
        title2: "Gifts",
        description: "Shop elegant perfumes, gift sets, Ramadan collection, and bakhoor for meaningful gifting.",
        shop_collection: "Shop Ramadan Collection",
        explore_sets: "Explore Gift Sets",
    },
    ar: {
        kareem: "رمضان كريم ٢٠٢٦",
        title1: "هدايا رمضان",
        title2: "الفاخرة",
        description: "تسوّق عطور أنيقة، مجموعات هدايا، تشكيلة رمضان، وبخور لهدايا تحمل معنى.",
        shop_collection: "تسوّق مجموعة رمضان",
        explore_sets: "استكشف مجموعات الهدايا",
    },
};

const IslamicHero = () => {
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
                minHeight: { xs: "75vh", md: "100vh" },
                background: "#0f0f0f",
                position: "relative",
                overflow: "hidden",
                display: "flex",
                alignItems: "center",
                py: { xs: 4, md: 12 }
            }}
        >
            {/* Animated Background Image */}
            <motion.div
                initial={isMobile ? { y: "-100%" } : { x: "100%" }}
                animate={isMobile ? { y: 0 } : { x: 0 }}
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
                        backgroundImage: `url('${isMobile ? "/assets/images/ramadan/top-banner-ramadan-mobile.jpeg" : "/assets/images/ramadan/top-banner-ramadan.jpeg"}')`,
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                        backgroundRepeat: "no-repeat"
                    }}
                />
            </motion.div>

            {/* Sparkle-2 Full Width Background */}
            <Box
                sx={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    zIndex: 0,
                    opacity: 0.15
                }}
            >
                <Image
                    src="/assets/images/ramadan/sparkle-2.png"
                    alt="Background Sparkle"
                    fill
                    style={{ objectFit: "cover" }}
                    priority
                />
            </Box>

            {/* Top Left Lanterns */}
            <Box
                sx={{
                    position: "absolute",
                    top: 0,
                    left: { xs: "0.5rem", sm: "2rem", md: "4rem", lg: "6rem", xl: "8rem" },
                    width: { xs: "100px", sm: "200px", md: "250px", lg: "300px" },
                    height: { xs: "100px", sm: "200px", md: "250px", lg: "300px" },
                    zIndex: 1,
                    filter: "drop-shadow(0 10px 30px rgba(191, 149, 63, 0.5))"
                }}
            >
                <Image
                    src="/assets/images/ramadan/2-lantern.png"
                    alt="Ramadan Lanterns"
                    fill
                    style={{ objectFit: "contain", objectPosition: "top left" }}
                    priority
                />
            </Box>

            {/* Top Right Lanterns */}
            <Box
                sx={{
                    position: "absolute",
                    top: 0,
                    right: { xs: "0.5rem", sm: "2rem", md: "4rem", lg: "6rem", xl: "8rem" },
                    width: { xs: "120px", sm: "240px", md: "300px", lg: "360px" },
                    height: { xs: "120px", sm: "240px", md: "300px", lg: "360px" },
                    zIndex: 1,
                    filter: "drop-shadow(0 10px 30px rgba(191, 149, 63, 0.5))"
                }}
            >
                <Image
                    src="/assets/images/ramadan/3-lanterns.png"
                    alt="Ramadan Lanterns"
                    fill
                    style={{ objectFit: "contain", objectPosition: "top right" }}
                    priority
                />
            </Box>

            {/* Top Gold Border */}
            <Box
                sx={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    height: "6px",
                    background: "linear-gradient(90deg, transparent, #BF953F 20%, #C9A961 50%, #BF953F 80%, transparent)"
                }}
            />

            <Container maxWidth="xl" sx={{ position: "relative", zIndex: 2, height: "100%" }}>
                <Grid container justifyContent={{ xs: "center", md: "flex-start" }} alignItems="center" sx={{ height: "100%" }}>
                    {/* Content Wrapper */}
                    <Grid item xs={12} md={6} sx={{ mt: { xs: "20vh", md: 0 }, textAlign: { xs: "center", md: "inherit" } }}>
                        <motion.div
                            initial={isMobile ? { opacity: 0, y: 50 } : { opacity: 0, x: -50 }}
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

                            {/* Trust Badges */}
                            {/* <Box
                                sx={{
                                    display: "flex",
                                    gap: 4,
                                    mt: 6,
                                    flexWrap: "wrap"
                                }}
                            >
                                {[
                                    { label: "100% Authentic", value: "Guaranteed" },
                                    { label: "Free Delivery", value: "UAE Wide" },
                                    { label: "Premium Packaging", value: "Included" }
                                ].map((badge, index) => (
                                    <motion.div
                                        key={index}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.6, delay: 0.8 + index * 0.1 }}
                                    >
                                        <Box>
                                            <Typography
                                                sx={{
                                                    color: "#BF953F",
                                                    fontSize: { xs: "0.65rem", sm: "0.7rem", md: "0.75rem" },
                                                    fontWeight: 600,
                                                    letterSpacing: "0.1em",
                                                    textTransform: "uppercase",
                                                    mb: 0.5
                                                }}
                                            >
                                                {badge.label}
                                            </Typography>
                                            <Typography
                                                sx={{
                                                
                                                    color: "rgba(255, 255, 255, 0.7)",
                                                    fontSize: { xs: "0.75rem", sm: "0.8rem", md: "0.85rem" }
                                                }}
                                            >
                                                {badge.value}
                                            </Typography>
                                        </Box>
                                    </motion.div>
                                ))}
                            </Box> */}
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
                    background: "linear-gradient(90deg, transparent, #BF953F 20%, #C9A961 50%, #BF953F 80%, transparent)"
                }}
            />

            {/* CSS Animation for Pulse Effect */}
            <style jsx>{`
                @keyframes pulse {
                    0%, 100% {
                        transform: scale(1);
                        opacity: 0.2;
                    }
                    50% {
                        transform: scale(1.05);
                        opacity: 0.3;
                    }
                }
            `}</style>
        </Box >
    );
};

export default IslamicHero;
