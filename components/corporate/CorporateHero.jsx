"use client";
import { Box, Container, Typography, Button } from "@mui/material";
import { motion } from "framer-motion";
import { useLocale } from "next-intl";
import Image from "next/image";

const translations = {
    en: {
        eyebrow: "AHMED AL MAGHRIBI PERFUMES",
        title_part1: "Corporate",
        title_part2: "Gifting",
        quote: "Where every fragrance celebrates excellence, every gift inspires appreciation, and every relationship blossoms into a lasting legacy.",
        cta_primary: "Request a Consultation",
    },
    ar: {
        eyebrow: "عطور أحمد المغربي",
        title_part1: "هدايا",
        title_part2: "الشركات",
        quote: ".حيث تحتفي كل رائحة بالتميز، وتلهم كل هدية مشاعر التقدير، وتزهر كل علاقة لتصبح أثراً ورمزاً يدوم",
        cta_primary: "طلب استشارة",
    },
};

const CorporateHero = () => {
    const locale = useLocale();
    const isRtl = locale === "ar";
    const t = translations[locale] || translations.en;

    const handleScroll = () => {
        const contactSection = document.getElementById("corporate-inquiry");
        if (contactSection) {
            contactSection.scrollIntoView({ behavior: "smooth" });
        }
    };

    return (
        <Box
            component="section"
            dir={isRtl ? "rtl" : "ltr"}
            sx={{
                minHeight: { xs: "100vh", md: "100vh" },
                position: "relative",
                display: "flex",
                alignItems: "center",
                backgroundColor: "#0D0C0A",
                pt: { xs: 14, md: 0 },
                pb: { xs: 10, md: 0 },
                color: "#FFFFFF",
                overflow: "hidden"
            }}
        >
            {/* ── Background Image (Desktop) ── */}
            <Box
                sx={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    zIndex: 1,
                    display: { xs: "none", md: "block" }
                }}
            >
                <Image
                    src="/assets/Corporate Gift Sets/banner.jpeg"
                    alt="Corporate Gifting Ahmed Al Maghribi Desktop"
                    fill
                    style={{ objectFit: "cover", objectPosition: isRtl ? "left center" : "right center" }}
                    priority
                    sizes="100vw"
                />
            </Box>

            {/* ── Background Image (Mobile) ── */}
            <Box
                sx={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    zIndex: 1,
                    display: { xs: "block", md: "none" }
                }}
            >
                <Image
                    src="/assets/Corporate Gift Sets/mobilebanner.jpeg"
                    alt="Corporate Gifting Ahmed Al Maghribi Mobile"
                    fill
                    style={{ objectFit: "cover", objectPosition: "center center" }}
                    priority
                    sizes="100vw"
                />
            </Box>

            {/* ── Gradient Overlay: ONLY on Left Text Side (Fades completely transparent before right image) ── */}
            <Box
                sx={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    zIndex: 2,
                    background: isRtl
                        ? "linear-gradient(270deg, rgba(13,12,10,0.95) 0%, rgba(13,12,10,0.85) 30%, rgba(13,12,10,0.4) 45%, transparent 55%)"
                        : "linear-gradient(90deg, rgba(13,12,10,0.95) 0%, rgba(13,12,10,0.85) 30%, rgba(13,12,10,0.4) 45%, transparent 55%)",
                    "@media (max-width: 900px)": {
                        background: "linear-gradient(0deg, rgba(13,12,10,0.95) 0%, rgba(13,12,10,0.7) 60%, transparent 100%)",
                    }
                }}
            />

            {/* ── Content Container (Left Side) ── */}
            <Container maxWidth="xl" sx={{ position: "relative", zIndex: 5 }}>
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                >
                    <Box sx={{
                        maxWidth: { xs: "100%", md: "620px" },
                        textAlign: { xs: "center", md: isRtl ? "right" : "left" },
                        ml: { xs: 0, md: isRtl ? "auto" : 0 },
                        mr: { xs: 0, md: isRtl ? 0 : "auto" },
                    }}>

                        <Typography
                            variant="overline"
                            sx={{
                                color: "#fed1a5",
                                letterSpacing: "0.25em",
                                fontWeight: 500,
                                fontSize: { xs: "0.75rem", md: "0.85rem" },
                                display: "block",
                                mb: 3,
                                fontFamily: "'Montserrat', sans-serif",
                            }}
                        >
                            {t.eyebrow}
                        </Typography>

                        {/* Title */}
                        <Typography
                            component="h1"
                            sx={{
                                color: "#FFFFFF",
                                fontSize: { xs: "2.8rem", sm: "3.5rem", md: "4.5rem", lg: "5rem" },
                                fontWeight: 400,
                                textTransform: "uppercase",
                                lineHeight: 1.1,
                                mb: 4,
                                letterSpacing: "0.02em",
                                fontFamily: "'Playfair Display', serif",
                                textShadow: "0 4px 20px rgba(0,0,0,0.5)"
                            }}
                        >
                            {t.title_part1}{" "}
                            <Box
                                component="span"
                                sx={{ color: "#fed1a5" }}
                            >
                                {t.title_part2}
                            </Box>
                        </Typography>

                        {t.p1 && (
                            <Box sx={{ display: "flex", flexDirection: "column", gap: 2.5, mb: 5 }}>
                                <Typography sx={{ color: "rgba(255,255,255,0.9)", fontSize: { xs: "0.95rem", md: "1.1rem" }, lineHeight: 1.7, fontWeight: 300, fontFamily: "'Montserrat', sans-serif" }}>
                                    {t.p1}
                                </Typography>
                                <Typography sx={{ color: "rgba(255,255,255,0.9)", fontSize: { xs: "0.95rem", md: "1.1rem" }, lineHeight: 1.7, fontWeight: 300, fontFamily: "'Montserrat', sans-serif" }}>
                                    {t.p2}
                                </Typography>
                                <Typography sx={{ color: "rgba(255,255,255,0.9)", fontSize: { xs: "0.95rem", md: "1.1rem" }, lineHeight: 1.7, fontWeight: 300, fontFamily: "'Montserrat', sans-serif" }}>
                                    {t.p3}
                                </Typography>
                            </Box>
                        )}

                        {/* Emphasized Quote */}
                        <Box sx={{
                            borderLeft: isRtl ? "none" : "3px solid #fed1a5",
                            borderRight: isRtl ? "3px solid #fed1a5" : "none",
                            pl: isRtl ? 0 : 3,
                            pr: isRtl ? 3 : 0,
                            mb: 6
                        }}>
                            <Typography sx={{
                                color: "#fde8cc",
                                fontSize: { xs: "1.1rem", md: "1.3rem" },
                                lineHeight: 1.6,
                                fontWeight: 400,
                                fontStyle: "italic",
                                fontFamily: "'Playfair Display', serif",
                                textShadow: "0 2px 10px rgba(0,0,0,0.3)"
                            }}>
                                "{t.quote}"
                            </Typography>
                        </Box>

                        <Button
                            onClick={handleScroll}
                            sx={{
                                backgroundColor: "#fed1a5",
                                color: "#2C1810",
                                py: { xs: 1.8, md: 2 },
                                px: { xs: 4, md: 5 },
                                fontSize: "0.85rem",
                                fontWeight: 600,
                                borderRadius: "50px",
                                textTransform: "uppercase",
                                letterSpacing: "0.15em",
                                fontFamily: "'Montserrat', sans-serif",
                                transition: "all 0.3s ease",
                                "&:hover": {
                                    backgroundColor: "#e8b882",
                                    transform: "translateY(-2px)",
                                    boxShadow: "0 10px 25px rgba(254,209,165,0.35)"
                                },
                            }}
                        >
                            {t.cta_primary}
                        </Button>

                    </Box>
                </motion.div>
            </Container>
        </Box>
    );
};

export default CorporateHero;
