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
                title: "Seamless Delivery",
                desc: "Receive your branded gift sets delivered with precision across the UAE, on time, every time.",
            },
        ],
    },
    ar: {
        label: "آلية العمل",
        title: "من الاستفسار إلى التسليم",
        steps: [
            {
                number: "١",
                title: "الاستشارة",
                desc: "شارك متطلبات الهدايا الخاصة بك، وبيانات شركتك، ورؤيتك مع مختص هدايا الشركات لدينا.",
            },
            {
                number: "٢",
                title: "الانتقاء",
                desc: "ننتقي بعناية مجموعات العطور المثالية ونصمم تغليفاً مخصصاً يحمل هوية علامتك التجارية.",
            },
            {
                number: "٣",
                title: "الموافقة",
                desc: "راجع نموذجاً تجريبياً واعتمد التصميم النهائي قبل بدء الإنتاج الكامل.",
            },
            {
                number: "٤",
                title: "تسليم سلس",
                desc: "استلم أطقم الهدايا التي تحمل علامتك التجارية، تُسلّم بدقة في جميع أنحاء دولة الإمارات، في الموعد المحدد دائماً.",
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
                    py: { xs: 4, sm: 6, md: 8 },
                    borderBottom: "1px solid rgba(0,0,0,0.07)",
                    flexDirection: { xs: "column", md: "row" },
                    gap: { xs: 1.5, md: 3 },
                }}>
                    <Typography sx={{
                        color: "#A88132",
                        letterSpacing: "0.3em",
                        fontWeight: 500,
                        fontSize: { xs: "0.68rem", md: "0.7rem" },
                        fontFamily: "'Montserrat', sans-serif",
                        textTransform: "uppercase",
                    }}>
                        {t.label}
                    </Typography>

                    <Typography sx={{
                        color: "#1A1A1A",
                        fontSize: { xs: "1.6rem", sm: "2rem", md: "2.8rem" },
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

                {/* Steps — 2x2 grid on mobile, 4-column strip on desktop */}
                <Box sx={{
                    display: "grid",
                    gridTemplateColumns: { xs: "repeat(2, 1fr)", md: "repeat(4, 1fr)" },
                    borderBottom: "1px solid rgba(0,0,0,0.07)",
                }}>
                    {t.steps.map((step, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: i * 0.1 }}
                            style={{ height: "100%" }}
                        >
                            <Box sx={{
                                py: { xs: 3.5, sm: 5, md: 8 },
                                px: { xs: 2, sm: 3, md: 5 },
                                borderRight: {
                                    xs: i % 2 === 0 ? (!isRtl ? "1px solid rgba(0,0,0,0.07)" : "none") : (!isRtl ? "none" : "1px solid rgba(0,0,0,0.07)"),
                                    md: !isRtl && i < 3 ? "1px solid rgba(0,0,0,0.07)" : "none"
                                },
                                borderLeft: {
                                    xs: i % 2 === 1 ? (!isRtl ? "none" : "1px solid rgba(0,0,0,0.07)") : (!isRtl ? "1px solid rgba(0,0,0,0.07)" : "none"),
                                    md: isRtl && i > 0 ? "1px solid rgba(0,0,0,0.07)" : "none"
                                },
                                borderTop: {
                                    xs: i >= 2 ? "1px solid rgba(0,0,0,0.07)" : "none",
                                    md: "none"
                                },
                                height: "100%",
                                display: "flex",
                                flexDirection: "column",
                            }}>
                                {/* Step number */}
                                <Typography sx={{
                                    color: "rgba(168,129,50,0.25)",
                                    fontFamily: "'Playfair Display', serif",
                                    fontSize: { xs: "2.2rem", sm: "3rem", md: "4rem" },
                                    fontWeight: 400,
                                    lineHeight: 1,
                                    mb: { xs: 2, md: 5 },
                                    letterSpacing: "-0.02em",
                                }}>
                                    {step.number}
                                </Typography>

                                {/* Step title */}
                                <Typography sx={{
                                    color: "#1A1A1A",
                                    fontFamily: "'Playfair Display', serif",
                                    fontSize: { xs: "1.1rem", sm: "1.3rem", md: "1.6rem" },
                                    fontWeight: 400,
                                    mb: { xs: 1.5, md: 2.5 },
                                    lineHeight: 1.25,
                                }}>
                                    {step.title}
                                </Typography>

                                {/* Thin gold accent bar */}
                                <Box sx={{
                                    width: "24px",
                                    height: "1px",
                                    backgroundColor: "#A88132",
                                    mb: { xs: 1.5, md: 2.5 },
                                }} />

                                {/* Description */}
                                <Typography sx={{
                                    color: "#555555",
                                    fontSize: { xs: "0.8rem", sm: "0.85rem", md: "0.9rem" },
                                    lineHeight: { xs: 1.5, md: 1.8 },
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
