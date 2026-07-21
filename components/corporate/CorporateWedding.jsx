"use client";
import { Box, Container, Typography, Grid, Button } from "@mui/material";
import { motion } from "framer-motion";
import { useLocale } from "next-intl";
import Image from "next/image";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";

const translations = {
    en: {
        eyebrow: "Where Every Knot Blossoms into Forever",
        title: "Our Wedding Customized Collection",
        p1: "Every knot is tied with love. Every promise is wrapped in trust. Every wedding is the beginning of a beautiful forever.",
        p2: "Celebrate your special day with the Ahmed Al Maghribi Wedding Customized Collection—luxurious fragrance gift sets crafted to make every moment unforgettable and every celebration blossom with elegance.",
        poem: "Two hearts, one soul, one beautiful way,\nTogether forever from this special day.\nA knot of love, a dream come true,\nA lifetime begins with \"Me and You.\"",
        cta: "Request a Consultation",
    },
    ar: {
        eyebrow: "حيث يزدهر كل رباط إلى الأبد",
        title: "مجموعة الزفاف المخصصة لدينا",
        p1: "كل رباط يعقد بالحب. كل وعد يغلف بالثقة. كل زفاف هو بداية لأبدية جميلة.",
        p2: "احتفل بيومك المميز مع مجموعة الزفاف المخصصة من أحمد المغربي - أطقم هدايا عطور فاخرة صُممت لتجعل كل لحظة لا تُنسى وكل احتفال يزدهر بالأناقة.",
        poem: "قلبان، روح واحدة، طريق واحد جميل،\nمعاً إلى الأبد من هذا اليوم المميز.\nعقدة حب، حلم يتحقق،\nعمر يبدأ بـ \"أنا وأنت\".",
        cta: "طلب استشارة",
    }
};

const CorporateWedding = () => {
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
                py: { xs: 10, md: 16 },
                backgroundColor: "#FFFFFF",
                position: "relative",
                overflow: "hidden",
            }}
        >
            <Container maxWidth="xl" sx={{ position: "relative", zIndex: 1 }}>
                <Grid container spacing={{ xs: 6, md: 10 }} alignItems="center">
                    
                    {/* Image Column */}
                    <Grid item xs={12} md={6}>
                        <motion.div
                            initial={{ opacity: 0, x: isRtl ? 40 : -40 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8 }}
                        >
                            <Box
                                sx={{
                                    position: "relative",
                                    borderRadius: "16px",
                                    overflow: "hidden",
                                    boxShadow: "0 20px 60px rgba(0,0,0,0.06)",
                                    "&::before": {
                                        content: '""',
                                        display: "block",
                                        paddingTop: "110%", // Taller elegant aspect ratio
                                    }
                                }}
                            >
                                <Image
                                    src="/assets/Corporate Gift Sets/corporate gift set heart shape 01.jpg.jpeg"
                                    alt="Wedding Customised Gift Set"
                                    fill
                                    style={{ objectFit: "cover" }}
                                    sizes="(max-width: 900px) 100vw, 50vw"
                                />
                                
                                {/* Floating Badge */}
                                <Box sx={{
                                    position: "absolute",
                                    top: 24,
                                    [isRtl ? "right" : "left"]: 24,
                                    backgroundColor: "rgba(255,255,255,0.9)",
                                    backdropFilter: "blur(10px)",
                                    px: 2, py: 1,
                                    borderRadius: "30px",
                                    display: "flex", alignItems: "center", gap: 1,
                                    boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
                                }}>
                                    <FavoriteBorderIcon sx={{ fontSize: "1rem", color: "#A88132" }} />
                                    <Typography sx={{ color: "#1A1A1A", fontWeight: 600, fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.1em", fontFamily: "'Montserrat', sans-serif" }}>
                                        {isRtl ? "ليومك المميز" : "FOR YOUR SPECIAL DAY"}
                                    </Typography>
                                </Box>
                            </Box>
                        </motion.div>
                    </Grid>

                    {/* Text Column */}
                    <Grid item xs={12} md={6}>
                        <motion.div
                            initial={{ opacity: 0, x: isRtl ? -40 : 40 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                        >
                            <Box sx={{ maxWidth: "550px", [isRtl ? "mr" : "ml"]: { md: 4 } }}>
                                <Typography variant="overline" sx={{ color: "#A88132", letterSpacing: "0.2em", fontWeight: 500, fontSize: "0.75rem", display: "block", mb: 2, fontFamily: "'Montserrat', sans-serif" }}>
                                    {t.eyebrow}
                                </Typography>
                                
                                <Typography variant="h2" sx={{ color: "#1A1A1A", fontSize: { xs: "2.2rem", md: "3.5rem" }, fontWeight: 400, fontFamily: "'Playfair Display', serif", mb: 3, lineHeight: 1.15 }}>
                                    {t.title}
                                </Typography>
                                
                                <Box sx={{ display: "flex", flexDirection: "column", gap: 2.5, mb: 4 }}>
                                    <Typography sx={{ color: "#4A4A4A", fontSize: { xs: "0.95rem", md: "1.05rem" }, lineHeight: 1.8, fontWeight: 300, fontFamily: "'Montserrat', sans-serif" }}>
                                        {t.p1}
                                    </Typography>
                                    <Typography sx={{ color: "#4A4A4A", fontSize: { xs: "0.95rem", md: "1.05rem" }, lineHeight: 1.8, fontWeight: 300, fontFamily: "'Montserrat', sans-serif" }}>
                                        {t.p2}
                                    </Typography>
                                </Box>

                                {/* Poetic Verse */}
                                <Box sx={{ 
                                    mb: 6, 
                                    pl: isRtl ? 0 : 3, 
                                    pr: isRtl ? 3 : 0, 
                                    borderLeft: isRtl ? "none" : "3px solid #A88132",
                                    borderRight: isRtl ? "3px solid #A88132" : "none"
                                }}>
                                    <Typography sx={{ 
                                        color: "#1A1A1A", 
                                        fontSize: { xs: "1rem", md: "1.15rem" }, 
                                        lineHeight: 2, 
                                        fontWeight: 400, 
                                        fontStyle: "italic",
                                        fontFamily: "'Playfair Display', serif",
                                        whiteSpace: "pre-line"
                                    }}>
                                        {t.poem}
                                    </Typography>
                                </Box>

                                <Button
                                    onClick={handleScroll}
                                    sx={{
                                        backgroundColor: "#A88132",
                                        color: "#FFFFFF",
                                        py: 1.8,
                                        px: 4,
                                        fontSize: "0.85rem",
                                        fontWeight: 600,
                                        borderRadius: "50px",
                                        textTransform: "uppercase",
                                        letterSpacing: "0.15em",
                                        fontFamily: "'Montserrat', sans-serif",
                                        transition: "all 0.3s ease",
                                        "&:hover": {
                                            backgroundColor: "#8C6A29",
                                        },
                                    }}
                                >
                                    {t.cta}
                                </Button>
                            </Box>
                        </motion.div>
                    </Grid>

                </Grid>
            </Container>
        </Box>
    );
};

export default CorporateWedding;
