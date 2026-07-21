"use client";
import { Box, Container, Typography } from "@mui/material";
import { motion } from "framer-motion";
import { useLocale } from "next-intl";

const translations = {
    en: {
        label: "THE PROCESS",
        title: "From Inquiry to Delivery",
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
        label: "العملية",
        title: "من الاستفسار إلى التسليم",
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
                backgroundColor: "#FAF8F5",
                position: "relative",
                overflow: "hidden",
            }}
        >
            <Container maxWidth="xl">

                {/* Top header strip */}
                <Box sx={{
                    display: "flex",
                    alignItems: { xs: "flex-start", md: "center" },
                    justifyContent: "space-between",
                    py: { xs: 6, md: 8 },
                    borderBottom: "1px solid rgba(0,0,0,0.07)",
                    flexDirection: { xs: "column", md: "row" },
                    gap: 3,
                }}>
                    <Typography sx={{
                        color: "#A88132",
                        letterSpacing: "0.3em",
                        fontWeight: 500,
                        fontSize: "0.7rem",
                        fontFamily: "'Montserrat', sans-serif",
                        textTransform: "uppercase",
                    }}>
                        {t.label}
                    </Typography>

                    <Typography sx={{
                        color: "#1A1A1A",
                        fontSize: { xs: "2rem", md: "2.8rem" },
                        fontWeight: 400,
                        fontFamily: "'Playfair Display', serif",
                        letterSpacing: "0.01em",
                        lineHeight: 1.2,
                        textAlign: { xs: "left", md: "center" },
                    }}>
                        {t.title}
                    </Typography>

                    {/* Decorative gold line — desktop only */}
                    <Box sx={{
                        width: "60px",
                        height: "1px",
                        backgroundColor: "#A88132",
                        display: { xs: "none", md: "block" },
                        flexShrink: 0,
                    }} />
                </Box>

                {/* Steps — horizontal editorial strip */}
                <Box sx={{
                    display: "grid",
                    gridTemplateColumns: { xs: "1fr", md: "repeat(4, 1fr)" },
                    borderBottom: "1px solid rgba(0,0,0,0.07)",
                }}>
                    {t.steps.map((step, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: i * 0.12 }}
                            style={{ height: "100%" }}
                        >
                            <Box sx={{
                                py: { xs: 5, md: 8 },
                                px: { xs: 0, md: 5 },
                                borderRight: {
                                    xs: "none",
                                    md: !isRtl && i < 3 ? "1px solid rgba(0,0,0,0.07)" : "none"
                                },
                                borderLeft: {
                                    xs: "none",
                                    md: isRtl && i > 0 ? "1px solid rgba(0,0,0,0.07)" : "none"
                                },
                                borderTop: { xs: "1px solid rgba(0,0,0,0.07)", md: "none" },
                                height: "100%",
                                display: "flex",
                                flexDirection: "column",
                            }}>
                                {/* Step number */}
                                <Typography sx={{
                                    color: "rgba(168,129,50,0.25)",
                                    fontFamily: "'Playfair Display', serif",
                                    fontSize: { xs: "3rem", md: "4rem" },
                                    fontWeight: 400,
                                    lineHeight: 1,
                                    mb: 5,
                                    letterSpacing: "-0.02em",
                                }}>
                                    {step.number}
                                </Typography>

                                {/* Step title */}
                                <Typography sx={{
                                    color: "#1A1A1A",
                                    fontFamily: "'Playfair Display', serif",
                                    fontSize: { xs: "1.4rem", md: "1.6rem" },
                                    fontWeight: 400,
                                    mb: 2.5,
                                    lineHeight: 1.2,
                                }}>
                                    {step.title}
                                </Typography>

                                {/* Thin gold accent bar */}
                                <Box sx={{
                                    width: "30px",
                                    height: "1px",
                                    backgroundColor: "#A88132",
                                    mb: 2.5,
                                }} />

                                {/* Description */}
                                <Typography sx={{
                                    color: "#555555",
                                    fontSize: "0.9rem",
                                    lineHeight: 1.8,
                                    fontFamily: "'Montserrat', sans-serif",
                                    fontWeight: 400,
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
