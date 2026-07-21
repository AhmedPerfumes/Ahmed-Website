"use client";
import { Box, Container, Typography, Grid } from "@mui/material";
import { motion } from "framer-motion";
import { useLocale } from "next-intl";
import Image from "next/image";

const translations = {
    en: {
        branding: {
            title: "A Gift That Speaks\nYour Brand's Language",
            subtitle: "Create a gift experience that reflects your company's identity and values — from elegant packaging to bespoke product selection.",
            features: [
                { number: "01", title: "Personalized Packaging", desc: "Custom-designed boxes and wrapping that reflect your brand identity." },
                { number: "02", title: "Logo Placement", desc: "Your mark, elegantly embossed or printed on every piece." },
                { number: "03", title: "Custom Messages", desc: "Personalized cards written for each recipient." },
                { number: "04", title: "Occasion-Based Designs", desc: "Themed collections for Eid, National Day, and more." },
                { number: "05", title: "Flexible Budgets", desc: "Expertly curated to fit any scale or budget." },
                { number: "06", title: "Curated Combinations", desc: "A refined mix of perfumes, attars, oils, and bakhoor." },
            ],
        },
        occasions: {
            eyebrow: "GIFTING SOLUTIONS & OCCASIONS",
            title: "The Right Gift for Every Moment",
            solutions: [
                "Corporate gift sets & Executive gifts",
                "Employee welcome kits",
                "Event & conference giveaways",
                "Government & institutional gifts",
            ],
            occasions: [
                "Ramadan, Eid Al Fitr & Eid Al Adha",
                "UAE National Day",
                "Teacher's Day & Children's Day",
                "Women's Day, Mother's Day & Father's Day",
            ],
        },
    },
    ar: {
        branding: {
            title: "هدية تتحدث\nبلغة علامتك التجارية",
            subtitle: "أنشئ تجربة هدايا تعكس هوية شركتك وقيمها — من التغليف الأنيق إلى اختيار المنتجات المصممة خصيصًا.",
            features: [
                { number: "٠١", title: "تغليف مخصص", desc: "صناديق وتغليف مصمم خصيصاً يعكس هوية علامتك التجارية." },
                { number: "٠٢", title: "وضع الشعار", desc: "شعار شركتك، منقوش بأناقة على كل قطعة." },
                { number: "٠٣", title: "رسائل مخصصة", desc: "بطاقات شخصية مكتوبة لكل مستلم." },
                { number: "٠٤", title: "تصاميم حسب المناسبة", desc: "مجموعات مخصصة لرمضان واليوم الوطني وغيرها." },
                { number: "٠٥", title: "ميزانيات مرنة", desc: "اختيارات منسقة بخبرة لأي حجم أو ميزانية." },
                { number: "٠٦", title: "تركيبات مختارة", desc: "مزيج راقٍ من العطور والأدهان والزيوت والبخور." },
            ],
        },
        occasions: {
            eyebrow: "حلول الهدايا والمناسبات",
            title: "الهدية المناسبة لكل لحظة",
            solutions: [
                "أطقم هدايا مؤسسية وتنفيذية",
                "أطقم ترحيب بالموظفين",
                "هدايا المؤتمرات والفعاليات",
                "هدايا حكومية ومؤسسية",
            ],
            occasions: [
                "رمضان وعيد الفطر والأضحى",
                "اليوم الوطني الإماراتي",
                "يوم المعلم ويوم الطفل",
                "يوم المرأة ويوم الأم ويوم الأب",
            ],
        },
    },
};

const CorporateBranding = () => {
    const locale = useLocale();
    const isRtl = locale === "ar";
    const t = translations[locale] || translations.en;

    return (
        <>
            {/* ══════ OCCASIONS & SOLUTIONS (Editorial Tag Style) ══════ */}
            <Box
                component="section"
                id="gifting-solutions"
                dir={isRtl ? "rtl" : "ltr"}
                sx={{
                    py: { xs: 10, md: 18 },
                    backgroundColor: "#FAF8F5",
                    position: "relative",
                    overflow: "hidden",
                }}
            >
                <Container maxWidth="xl" sx={{ position: "relative", zIndex: 1 }}>
                    <Grid container spacing={{ xs: 8, md: 14 }} alignItems="center">
                        {/* Image Content */}
                        <Grid item xs={12} md={6} sx={{ order: { xs: 1, md: 1 } }}>
                            <motion.div
                                initial={{ opacity: 0, x: isRtl ? 40 : -40 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
                            >
                                <Box
                                    sx={{
                                        position: "relative",
                                        borderRadius: "4px",
                                        overflow: "hidden",
                                        boxShadow: "0 30px 70px rgba(0,0,0,0.07)",
                                        "&::before": {
                                            content: '""',
                                            display: "block",
                                            paddingTop: "125%",
                                        }
                                    }}
                                >
                                    <Image
                                        src="/assets/Corporate Gift Sets/corporate gift set 05.jpg.jpeg"
                                        alt="Corporate Occasions"
                                        fill
                                        style={{ objectFit: "cover" }}
                                        sizes="(max-width: 900px) 100vw, 50vw"
                                    />
                                </Box>
                            </motion.div>
                        </Grid>

                        {/* Text Content */}
                        <Grid item xs={12} md={6} sx={{ order: { xs: 2, md: 2 } }}>
                            <motion.div
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.8, delay: 0.15 }}
                            >
                                <Typography
                                    variant="overline"
                                    sx={{
                                        color: "#A88132",
                                        letterSpacing: "0.25em",
                                        fontWeight: 500,
                                        fontSize: "0.72rem",
                                        display: "block",
                                        mb: 2,
                                        fontFamily: "'Montserrat', sans-serif",
                                    }}
                                >
                                    {t.occasions.eyebrow}
                                </Typography>

                                <Box sx={{ width: "40px", height: "1px", backgroundColor: "#A88132", mb: 3, opacity: 0.6 }} />

                                <Typography
                                    variant="h2"
                                    sx={{
                                        color: "#1A1A1A",
                                        fontSize: { xs: "2.5rem", md: "3.8rem" },
                                        fontWeight: 400,
                                        fontFamily: "'Playfair Display', serif",
                                        mb: 6,
                                        lineHeight: 1.15,
                                        letterSpacing: "0.01em",
                                    }}
                                >
                                    {t.occasions.title}
                                </Typography>

                                {/* Solutions — Editorial numbered prose */}
                                <Box sx={{ mb: 6 }}>
                                    <Typography sx={{
                                        color: "#A88132",
                                        fontWeight: 600,
                                        mb: 3,
                                        fontSize: "0.72rem",
                                        textTransform: "uppercase",
                                        letterSpacing: "0.2em",
                                        fontFamily: "'Montserrat', sans-serif",
                                        borderBottom: "1px solid rgba(168,129,50,0.2)",
                                        pb: 1.5
                                    }}>
                                        {isRtl ? "حلول الهدايا" : "Gifting Solutions"}
                                    </Typography>
                                    <Box sx={{ display: "flex", flexDirection: "column", gap: 0 }}>
                                        {t.occasions.solutions.map((item, i) => (
                                            <Box
                                                key={i}
                                                sx={{
                                                    display: "flex",
                                                    alignItems: "baseline",
                                                    gap: 3,
                                                    py: 2,
                                                    borderBottom: "1px solid rgba(0,0,0,0.05)",
                                                    "&:last-child": { borderBottom: "none" }
                                                }}
                                            >
                                                <Typography sx={{
                                                    color: "rgba(168,129,50,0.5)",
                                                    fontFamily: "'Playfair Display', serif",
                                                    fontSize: "0.85rem",
                                                    flexShrink: 0,
                                                    minWidth: "24px"
                                                }}>
                                                    {String(i + 1).padStart(2, "0")}
                                                </Typography>
                                                <Typography sx={{
                                                    color: "#2A2A2A",
                                                    fontSize: "0.95rem",
                                                    fontFamily: "'Montserrat', sans-serif",
                                                    fontWeight: 400,
                                                    lineHeight: 1.5
                                                }}>
                                                    {item}
                                                </Typography>
                                            </Box>
                                        ))}
                                    </Box>
                                </Box>

                                {/* Occasions — Inline tag cloud */}
                                <Box>
                                    <Typography sx={{
                                        color: "#A88132",
                                        fontWeight: 600,
                                        mb: 3,
                                        fontSize: "0.72rem",
                                        textTransform: "uppercase",
                                        letterSpacing: "0.2em",
                                        fontFamily: "'Montserrat', sans-serif",
                                        borderBottom: "1px solid rgba(168,129,50,0.2)",
                                        pb: 1.5
                                    }}>
                                        {isRtl ? "المناسبات المثالية" : "Ideal Occasions"}
                                    </Typography>
                                    <Typography sx={{
                                        color: "#2A2A2A",
                                        fontSize: { xs: "1rem", md: "1.1rem" },
                                        lineHeight: 2.2,
                                        fontFamily: "'Playfair Display', serif",
                                        fontWeight: 400,
                                        fontStyle: "italic",
                                        letterSpacing: "0.01em"
                                    }}>
                                        {t.occasions.occasions.join("  ·  ")}
                                    </Typography>
                                </Box>

                            </motion.div>
                        </Grid>
                    </Grid>
                </Container>
            </Box>

            {/* ══════ CUSTOMIZED BRANDING — Numbered Editorial List ══════ */}
            <Box
                component="section"
                id="custom-branding"
                dir={isRtl ? "rtl" : "ltr"}
                sx={{
                    py: { xs: 10, md: 18 },
                    backgroundColor: "#FFFFFF",
                    position: "relative",
                    overflow: "hidden",
                }}
            >
                <Container maxWidth="xl" sx={{ position: "relative", zIndex: 1 }}>
                    <Grid container spacing={{ xs: 8, md: 14 }} alignItems="center">

                        {/* Text & Numbered List */}
                        <Grid item xs={12} md={6}>
                            <motion.div
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.8 }}
                            >
                                <Typography
                                    variant="h2"
                                    sx={{
                                        color: "#1A1A1A",
                                        fontSize: { xs: "2.5rem", md: "3.5rem" },
                                        fontWeight: 400,
                                        fontFamily: "'Playfair Display', serif",
                                        mb: 4,
                                        lineHeight: 1.15,
                                        whiteSpace: "pre-line"
                                    }}
                                >
                                    {t.branding.title}
                                </Typography>

                                <Typography sx={{
                                    color: "#666666",
                                    fontSize: "1rem",
                                    lineHeight: 1.8,
                                    fontWeight: 400,
                                    mb: 8,
                                    maxWidth: "480px",
                                    fontFamily: "'Montserrat', sans-serif"
                                }}>
                                    {t.branding.subtitle}
                                </Typography>

                                {/* Numbered prose feature list */}
                                <Box sx={{ display: "flex", flexDirection: "column" }}>
                                    {t.branding.features.map((feature, i) => (
                                        <motion.div
                                            key={i}
                                            initial={{ opacity: 0, x: -10 }}
                                            whileInView={{ opacity: 1, x: 0 }}
                                            viewport={{ once: true }}
                                            transition={{ duration: 0.5, delay: i * 0.07 }}
                                        >
                                            <Box sx={{
                                                display: "flex",
                                                gap: { xs: 3, md: 5 },
                                                alignItems: "baseline",
                                                py: { xs: 2.5, md: 3 },
                                                borderTop: "1px solid rgba(0,0,0,0.07)",
                                                "&:last-child": { borderBottom: "1px solid rgba(0,0,0,0.07)" }
                                            }}>
                                                <Typography sx={{
                                                    color: "rgba(168,129,50,0.4)",
                                                    fontFamily: "'Playfair Display', serif",
                                                    fontSize: { xs: "0.85rem", md: "0.9rem" },
                                                    flexShrink: 0,
                                                    letterSpacing: "0.05em"
                                                }}>
                                                    {feature.number}
                                                </Typography>
                                                <Box>
                                                    <Typography sx={{
                                                        color: "#1A1A1A",
                                                        fontWeight: 600,
                                                        fontSize: { xs: "0.95rem", md: "1rem" },
                                                        mb: 0.5,
                                                        fontFamily: "'Montserrat', sans-serif",
                                                        letterSpacing: "0.02em"
                                                    }}>
                                                        {feature.title}
                                                    </Typography>
                                                    <Typography sx={{
                                                        color: "#777777",
                                                        fontSize: "0.88rem",
                                                        lineHeight: 1.6,
                                                        fontFamily: "'Montserrat', sans-serif",
                                                        fontWeight: 300
                                                    }}>
                                                        {feature.desc}
                                                    </Typography>
                                                </Box>
                                            </Box>
                                        </motion.div>
                                    ))}
                                </Box>
                            </motion.div>
                        </Grid>

                        {/* Image */}
                        <Grid item xs={12} md={6}>
                            <motion.div
                                initial={{ opacity: 0, x: isRtl ? -40 : 40 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
                            >
                                <Box
                                    sx={{
                                        position: "relative",
                                        borderRadius: "4px",
                                        overflow: "hidden",
                                        boxShadow: "0 30px 70px rgba(0,0,0,0.07)",
                                        "&::before": {
                                            content: '""',
                                            display: "block",
                                            paddingTop: "135%",
                                        }
                                    }}
                                >
                                    <Image
                                        src="/assets/Corporate Gift Sets/corporate gift set black square 01.jpg.jpeg"
                                        alt="Custom Branding"
                                        fill
                                        style={{ objectFit: "cover" }}
                                        sizes="(max-width: 900px) 100vw, 50vw"
                                    />
                                </Box>
                            </motion.div>
                        </Grid>
                    </Grid>
                </Container>
            </Box>
        </>
    );
};

export default CorporateBranding;
