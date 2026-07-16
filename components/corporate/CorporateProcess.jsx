"use client";
import { Box, Container, Typography } from "@mui/material";
import { motion } from "framer-motion";
import { useLocale } from "next-intl";

const translations = {
    en: {
        eyebrow: "✦ HOW IT WORKS ✦",
        title: "Our Corporate Gifting Process",
        subtitle: "From inquiry to delivery — a seamless, white-glove experience",
        steps: [
            {
                number: "01",
                title: "Consultation",
                desc: "Share your gifting requirements, company details, and vision with our corporate specialist.",
            },
            {
                number: "02",
                title: "Curation",
                desc: "We handpick the perfect fragrance collections and design bespoke packaging with your branding.",
            },
            {
                number: "03",
                title: "Approval",
                desc: "Review a sample mockup and approve the final design before full production begins.",
            },
            {
                number: "04",
                title: "Delivery",
                desc: "Receive your branded gift sets delivered with precision across the UAE — on time, every time.",
            },
        ],
    },
    ar: {
        eyebrow: "✦ كيف يعمل ✦",
        title: "عملية الهدايا المؤسسية لدينا",
        subtitle: "من الاستفسار إلى التسليم — تجربة سلسة وفاخرة",
        steps: [
            {
                number: "٠١",
                title: "الاستشارة",
                desc: "شارك متطلبات الهدايا وتفاصيل شركتك ورؤيتك مع متخصصنا المؤسسي.",
            },
            {
                number: "٠٢",
                title: "التنسيق",
                desc: "نختار بعناية مجموعات العطور المثالية ونصمم تغليفاً مخصصاً بعلامتك التجارية.",
            },
            {
                number: "٠٣",
                title: "الموافقة",
                desc: "راجع نموذج تجريبي ووافق على التصميم النهائي قبل بدء الإنتاج الكامل.",
            },
            {
                number: "٠٤",
                title: "التسليم",
                desc: "استلم أطقم هداياك المخصصة بعلامتك التجارية مع التوصيل الدقيق في جميع أنحاء الإمارات — في الموعد دائماً.",
            },
        ],
    },
};

const CorporateProcess = () => {
    const locale = useLocale();
    const isRtl = locale === "ar";
    const t = translations[locale] || translations.en;

    return (
        <Box
            component="section"
            dir={isRtl ? "rtl" : "ltr"}
            sx={{
                py: { xs: 8, md: 14 },
                background: "linear-gradient(180deg, #111111 0%, #0d0d0d 100%)",
                position: "relative",
                overflow: "hidden",
            }}
        >
            {/* Decorative horizontal gold line */}
            <Box
                sx={{
                    position: "absolute",
                    top: "50%",
                    left: "10%",
                    right: "10%",
                    height: "1px",
                    background: "linear-gradient(90deg, transparent, rgba(191,149,63,0.3), transparent)",
                    display: { xs: "none", md: "block" },
                    pointerEvents: "none",
                }}
            />

            <Container maxWidth="xl" sx={{ position: "relative", zIndex: 1 }}>
                {/* Header */}
                <Box sx={{ textAlign: "center", mb: { xs: 5, md: 9 } }}>
                    <Box sx={{
                        width: "80px", height: "2px",
                        background: "linear-gradient(90deg, transparent, #BF953F, transparent)",
                        margin: "0 auto 20px",
                    }} />
                    <Typography variant="overline" sx={{
                        color: "#BF953F", letterSpacing: "0.3em",
                        fontWeight: 600, fontSize: { xs: "0.65rem", md: "0.8rem" },
                        display: "block", mb: 2,
                    }}>
                        {t.eyebrow}
                    </Typography>
                    <Typography variant="h2" sx={{
                        color: "#FFFFFF", fontSize: { xs: "2rem", md: "3.5rem" },
                        fontWeight: 700, fontFamily: "'Playfair Display', serif", mb: 2,
                    }}>
                        {t.title}
                    </Typography>
                    <Typography sx={{
                        color: "rgba(255,255,255,0.5)",
                        fontSize: { xs: "0.88rem", md: "1rem" },
                        maxWidth: "500px", mx: "auto", lineHeight: 1.7, fontWeight: 300,
                    }}>
                        {t.subtitle}
                    </Typography>
                </Box>

                {/* Steps */}
                <Box sx={{
                    display: "grid",
                    gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr", md: "repeat(4, 1fr)" },
                    gap: { xs: 3, md: 4 },
                    position: "relative",
                }}>
                    {t.steps.map((step, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 40 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: i * 0.15 }}
                        >
                            <Box
                                sx={{
                                    background: "rgba(255,255,255,0.03)",
                                    border: "1px solid rgba(191,149,63,0.15)",
                                    borderRadius: "24px",
                                    p: { xs: 3, md: 4 },
                                    height: "100%",
                                    position: "relative",
                                    overflow: "hidden",
                                    transition: "all 0.4s ease",
                                    "&:hover": {
                                        background: "rgba(191,149,63,0.06)",
                                        border: "1px solid rgba(191,149,63,0.4)",
                                        transform: "translateY(-8px)",
                                        boxShadow: "0 20px 60px rgba(191,149,63,0.15)",
                                    },
                                    "&::before": {
                                        content: '""',
                                        position: "absolute",
                                        top: 0,
                                        left: 0,
                                        right: 0,
                                        height: "3px",
                                        background: "linear-gradient(90deg, #BF953F, #FCF6BA, #BF953F)",
                                        opacity: 0.7,
                                    },
                                }}
                            >
                                {/* Big Number */}
                                <Typography sx={{
                                    fontSize: { xs: "3.5rem", md: "4.5rem" },
                                    fontWeight: 900,
                                    color: "rgba(191,149,63,0.12)",
                                    fontFamily: "'Playfair Display', serif",
                                    lineHeight: 1,
                                    mb: 2,
                                    letterSpacing: "-0.02em",
                                }}>
                                    {step.number}
                                </Typography>

                                {/* Gold accent bar */}
                                <Box sx={{
                                    width: "40px", height: "3px",
                                    background: "linear-gradient(90deg, #BF953F, #FCF6BA)",
                                    borderRadius: "2px", mb: 2.5,
                                }} />

                                <Typography variant="h5" sx={{
                                    color: "#FFFFFF", fontWeight: 700,
                                    fontSize: { xs: "1.1rem", md: "1.3rem" },
                                    fontFamily: "'Playfair Display', serif",
                                    mb: 1.5,
                                }}>
                                    {step.title}
                                </Typography>
                                <Typography sx={{
                                    color: "rgba(255,255,255,0.55)",
                                    fontSize: { xs: "0.82rem", md: "0.92rem" },
                                    lineHeight: 1.7, fontWeight: 300,
                                }}>
                                    {step.desc}
                                </Typography>
                            </Box>
                        </motion.div>
                    ))}
                </Box>
            </Container>
        </Box>
    );
};

export default CorporateProcess;
