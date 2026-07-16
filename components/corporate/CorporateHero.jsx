"use client";
import { Box, Container, Typography, Button, useMediaQuery, useTheme } from "@mui/material";
import { motion } from "framer-motion";
import Link from "next/link";
import { useLocale } from "next-intl";
import Image from "next/image";

const translations = {
    en: {
        eyebrow: "CORPORATE GIFTING",
        title1: "Gifts Worth",
        title2: "Remembering",
        title3: "",
        description:
            "Celebrate business relationships with the timeless elegance of Ahmed Al Maghribi Perfumes. Our Corporate Gifting service offers curated fragrance gifts for companies, government departments, institutions, events, and special occasions.",
        cta_primary: "Request a Quote",
        cta_secondary: "Explore Gift Sets",
        stats: [
            { value: "500+", label: "Corporate Clients" },
            { value: "10K+", label: "Gifts Delivered" },
            { value: "15+", label: "Years of Excellence" },
        ],
    },
    ar: {
        eyebrow: "هدايا الشركات",
        title1: "هدايا",
        title2: "تستحق التذكُّر",
        title3: "",
        description:
            "احتفل بعلاقات الأعمال بأناقة عطور أحمد المغربي الخالدة. تقدم خدمة الهدايا المؤسسية لدينا هدايا عطرية مختارة للشركات والجهات الحكومية والمؤسسات والفعاليات والمناسبات الخاصة.",
        cta_primary: "طلب عرض سعر",
        cta_secondary: "استكشف أطقم الهدايا",
        stats: [
            { value: "٥٠٠+", label: "عميل مؤسسي" },
            { value: "١٠ آلاف+", label: "هدية مُسلَّمة" },
            { value: "١٥+", label: "عاماً من التميز" },
        ],
    },
};

const CorporateHero = () => {
    const locale = useLocale();
    const isRtl = locale === "ar";
    const t = translations[locale] || translations.en;
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("md"));

    return (
        <Box
            component="section"
            dir={isRtl ? "rtl" : "ltr"}
            sx={{
                minHeight: { xs: "100svh", md: "100vh" },
                background: "linear-gradient(135deg, #0a0a0a 0%, #111111 40%, #1a1208 100%)",
                position: "relative",
                overflow: "hidden",
                display: "flex",
                alignItems: "center",
                pt: { xs: "80px", md: 0 },
            }}
        >
            {/* Ambient Gold Glows */}
            <Box
                sx={{
                    position: "absolute",
                    top: "10%",
                    [isRtl ? "left" : "right"]: "5%",
                    width: { xs: "300px", md: "600px" },
                    height: { xs: "300px", md: "600px" },
                    background: "radial-gradient(circle, rgba(191,149,63,0.18) 0%, transparent 70%)",
                    filter: "blur(80px)",
                    zIndex: 0,
                    pointerEvents: "none",
                }}
            />
            <Box
                sx={{
                    position: "absolute",
                    bottom: "10%",
                    [isRtl ? "right" : "left"]: "0%",
                    width: { xs: "200px", md: "400px" },
                    height: { xs: "200px", md: "400px" },
                    background: "radial-gradient(circle, rgba(191,149,63,0.1) 0%, transparent 70%)",
                    filter: "blur(60px)",
                    zIndex: 0,
                    pointerEvents: "none",
                }}
            />

            {/* Top Gold Border */}
            <Box
                sx={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    height: "3px",
                    background: "linear-gradient(90deg, transparent, #BF953F 20%, #FCF6BA 50%, #BF953F 80%, transparent)",
                    zIndex: 10,
                }}
            />

            {/* Background Hero Image */}
            <Box
                sx={{
                    position: "absolute",
                    top: 0,
                    [isRtl ? "left" : "right"]: 0,
                    width: { xs: "100%", md: "55%" },
                    height: "100%",
                    zIndex: 1,
                }}
            >
                <motion.div
                    initial={{ opacity: 0, x: isRtl ? -80 : 80 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 1.2, ease: "easeOut" }}
                    style={{ width: "100%", height: "100%", position: "relative" }}
                >
                    <Image
                        src="/assets/Corporate Gift Sets/corporate gift set black square 01.jpg.jpeg"
                        alt="Corporate Gift Sets - Ahmed Al Maghribi"
                        fill
                        style={{ objectFit: "cover", objectPosition: "center" }}
                        priority
                    />
                    {/* Gradient overlay blending into the dark bg */}
                    <Box
                        sx={{
                            position: "absolute",
                            inset: 0,
                            background: isRtl
                                ? "linear-gradient(to left, rgba(10,10,10,0) 0%, rgba(10,10,10,0.5) 60%, rgba(10,10,10,0.98) 100%)"
                                : "linear-gradient(to right, rgba(10,10,10,0) 0%, rgba(10,10,10,0.5) 60%, rgba(10,10,10,0.98) 100%)",
                        }}
                    />
                </motion.div>
            </Box>

            {/* Content */}
            <Container maxWidth="xl" sx={{ position: "relative", zIndex: 5 }}>
                <Box
                    sx={{
                        maxWidth: { xs: "100%", md: "52%" },
                        textAlign: { xs: "center", md: isRtl ? "right" : "left" },
                        ml: { xs: 0, md: isRtl ? "auto" : 0 },
                        mr: { xs: 0, md: isRtl ? 0 : "auto" },
                        px: { xs: 2, md: 0 },
                    }}
                >
                    {/* Eyebrow */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                    >
                        <Typography
                            variant="overline"
                            sx={{
                                color: "#BF953F",
                                letterSpacing: "0.25em",
                                fontWeight: 600,
                                fontSize: { xs: "0.65rem", md: "0.8rem" },
                                display: "block",
                                mb: { xs: 2, md: 3 },
                            }}
                        >
                            {t.eyebrow}
                        </Typography>
                    </motion.div>

                    {/* Headline */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.3 }}
                    >
                        <Typography
                            component="h1"
                            sx={{
                                color: "#FFFFFF",
                                fontSize: { xs: "2rem", sm: "2.6rem", md: "3.4rem", lg: "4rem" },
                                fontWeight: 800,
                                lineHeight: 1.1,
                                mb: { xs: 2, md: 3.5 },
                                letterSpacing: "-0.02em",
                                fontFamily: "'Playfair Display', serif",
                            }}
                        >
                            {t.title1}
                            <br />
                            <Box
                                component="span"
                                sx={{
                                    background: "linear-gradient(135deg, #BF953F 0%, #FCF6BA 50%, #BF953F 100%)",
                                    WebkitBackgroundClip: "text",
                                    WebkitTextFillColor: "transparent",
                                    backgroundClip: "text",
                                }}
                            >
                                {t.title2}
                            </Box>
                        </Typography>
                    </motion.div>

                    {/* Description */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.5 }}
                    >
                        <Typography
                            sx={{
                                color: "rgba(255,255,255,0.75)",
                                fontSize: { xs: "0.9rem", md: "1.1rem" },
                                lineHeight: 1.8,
                                mb: { xs: 3, md: 5 },
                                maxWidth: "520px",
                                mx: { xs: "auto", md: isRtl ? "auto 0" : "0" },
                                fontWeight: 300,
                            }}
                        >
                            {t.description}
                        </Typography>
                    </motion.div>

                    {/* CTA Buttons */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.7 }}
                    >
                        <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap", justifyContent: { xs: "center", md: isRtl ? "flex-end" : "flex-start" } }}>
                            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.96 }}>
                                <Button
                                    component="a"
                                    href="#corporate-inquiry"
                                    sx={{
                                        background: "linear-gradient(135deg, #BF953F 0%, #FCF6BA 50%, #BF953F 100%)",
                                        backgroundSize: "200% auto",
                                        color: "#1a0a00",
                                        px: { xs: 3, md: 5 },
                                        py: { xs: 1.2, md: 2 },
                                        fontSize: { xs: "0.75rem", md: "1rem" },
                                        fontWeight: 800,
                                        borderRadius: "50px",
                                        textTransform: "uppercase",
                                        letterSpacing: "0.08em",
                                        boxShadow: "0 8px 30px rgba(191,149,63,0.45)",
                                        transition: "all 0.4s ease",
                                        "&:hover": {
                                            backgroundPosition: "right center",
                                            boxShadow: "0 14px 40px rgba(191,149,63,0.65)",
                                        },
                                    }}
                                >
                                    {t.cta_primary}
                                </Button>
                            </motion.div>

                            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.96 }}>
                                <Button
                                    href="#gift-sets"
                                    component="a"
                                    sx={{
                                        color: "#BF953F",
                                        border: "2px solid rgba(191,149,63,0.5)",
                                        px: { xs: 3, md: 5 },
                                        py: { xs: 1.2, md: 2 },
                                        fontSize: { xs: "0.75rem", md: "1rem" },
                                        fontWeight: 700,
                                        borderRadius: "50px",
                                        textTransform: "uppercase",
                                        letterSpacing: "0.08em",
                                        backdropFilter: "blur(10px)",
                                        background: "rgba(191,149,63,0.08)",
                                        "&:hover": {
                                            borderColor: "#BF953F",
                                            background: "rgba(191,149,63,0.18)",
                                        },
                                    }}
                                >
                                    {t.cta_secondary}
                                </Button>
                            </motion.div>
                        </Box>
                    </motion.div>

                    {/* Stats */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.9 }}
                    >
                        <Box
                            sx={{
                                display: "flex",
                                gap: { xs: 3, md: 5 },
                                mt: { xs: 4, md: 6 },
                                justifyContent: { xs: "center", md: isRtl ? "flex-end" : "flex-start" },
                                flexWrap: "wrap",
                            }}
                        >
                            {t.stats.map((stat, i) => (
                                <Box key={i} sx={{ textAlign: "center" }}>
                                    <Typography
                                        sx={{
                                            color: "#BF953F",
                                            fontSize: { xs: "1.6rem", md: "2.2rem" },
                                            fontWeight: 800,
                                            lineHeight: 1,
                                            fontFamily: "'Playfair Display', serif",
                                        }}
                                    >
                                        {stat.value}
                                    </Typography>
                                    <Typography
                                        sx={{
                                            color: "rgba(255,255,255,0.55)",
                                            fontSize: { xs: "0.65rem", md: "0.8rem" },
                                            textTransform: "uppercase",
                                            letterSpacing: "0.1em",
                                            mt: 0.5,
                                        }}
                                    >
                                        {stat.label}
                                    </Typography>
                                </Box>
                            ))}
                        </Box>
                    </motion.div>
                </Box>
            </Container>

            {/* Bottom Gold Border */}
            <Box
                sx={{
                    position: "absolute",
                    bottom: 0,
                    left: 0,
                    right: 0,
                    height: "3px",
                    background: "linear-gradient(90deg, transparent, #BF953F 20%, #FCF6BA 50%, #BF953F 80%, transparent)",
                    zIndex: 10,
                }}
            />
        </Box>
    );
};

export default CorporateHero;
