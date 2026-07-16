"use client";
import { Box, Container, Typography, Grid } from "@mui/material";
import { motion } from "framer-motion";
import { useLocale } from "next-intl";

const translations = {
    en: {
        branding: {
            eyebrow: "CUSTOMIZED TO YOUR BRAND",
            title: "A Gift That Speaks Your Brand's Language",
            subtitle:
                "Create a gift experience that reflects your company's identity and values — from packaging to product selection.",
            features: [
                { icon: "🎨", title: "Personalized Packaging", desc: "Custom-designed boxes and wrapping that carry your brand identity." },
                { icon: "🏷️", title: "Logo Placement", desc: "Your company logo elegantly embossed or printed on every gift." },
                { icon: "✉️", title: "Custom Messages", desc: "Personalized cards and messages for each recipient or occasion." },
                { icon: "🎁", title: "Occasion-Based Designs", desc: "Themed collections for Ramadan, National Day, Eid, and more." },
                { icon: "💰", title: "Flexible Budgets", desc: "Curated selections to suit any budget without compromising quality." },
                { icon: "🛍️", title: "Curated Combinations", desc: "Mix of perfumes, oils, bakhoor, candles, and chocolates — your choice." },
            ],
        },
        occasions: {
            eyebrow: "GIFTING SOLUTIONS & IDEAL OCCASIONS",
            title: "The Right Gift for Every Moment",
            solutions: [
                "Corporate gift sets",
                "Executive gifts",
                "Employee welcome kits",
                "Event giveaways",
                "Government & institutional gifts",
            ],
            occasions: [
                "Ramadan & Eid",
                "UAE National Day",
                "Diwali & Christmas",
                "Women's Day, Mother's Day & Father's Day",
                "Annual events, graduations & milestones",
            ],
            solutionsLabel: "Gifting Solutions",
            occasionsLabel: "Ideal Occasions",
        },
    },
    ar: {
        branding: {
            eyebrow: "مخصص لعلامتك التجارية",
            title: "هدية تتحدث بلغة علامتك التجارية",
            subtitle:
                "أنشئ تجربة هدايا تعكس هوية شركتك وقيمها — من التغليف إلى اختيار المنتجات.",
            features: [
                { icon: "🎨", title: "تغليف مخصص", desc: "صناديق وتغليف مصمم خصيصاً يحمل هوية علامتك التجارية." },
                { icon: "🏷️", title: "وضع الشعار", desc: "شعار شركتك منقوش أو مطبوع بأناقة على كل هدية." },
                { icon: "✉️", title: "رسائل مخصصة", desc: "بطاقات ورسائل شخصية لكل مستلم أو مناسبة." },
                { icon: "🎁", title: "تصاميم حسب المناسبة", desc: "مجموعات مخصصة لرمضان واليوم الوطني والعيد والمزيد." },
                { icon: "💰", title: "ميزانيات مرنة", desc: "اختيارات مدروسة تناسب أي ميزانية دون المساس بالجودة." },
                { icon: "🛍️", title: "تركيبات مختارة", desc: "مزيج من العطور والزيوت والبخور والشموع والشوكولاتة — حسب اختيارك." },
            ],
        },
        occasions: {
            eyebrow: "حلول الهدايا والمناسبات المثالية",
            title: "الهدية المناسبة لكل لحظة",
            solutions: [
                "أطقم هدايا مؤسسية",
                "هدايا تنفيذية",
                "أطقم ترحيب بالموظفين",
                "هدايا الفعاليات",
                "هدايا حكومية ومؤسسية",
            ],
            occasions: [
                "رمضان وعيد الفطر والأضحى",
                "اليوم الوطني الإماراتي",
                "ديوالي وعيد الميلاد",
                "يوم المرأة ويوم الأم ويوم الأب",
                "الفعاليات السنوية والتخرج والإنجازات",
            ],
            solutionsLabel: "حلول الهدايا",
            occasionsLabel: "المناسبات المثالية",
        },
    },
};

/* ─── Occasions & Solutions Table ─── */
const OccasionsTable = ({ data, isRtl }) => (
    <Box
        sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
            border: "1px solid rgba(191,149,63,0.25)",
            borderRadius: "20px",
            overflow: "hidden",
        }}
    >
        {/* Solutions column */}
        <Box sx={{ borderRight: { xs: "none", md: "1px solid rgba(191,149,63,0.2)" } }}>
            <Box
                sx={{
                    background: "linear-gradient(135deg, rgba(191,149,63,0.2), rgba(191,149,63,0.08))",
                    px: { xs: 3, md: 4 },
                    py: 2.5,
                    borderBottom: "1px solid rgba(191,149,63,0.2)",
                }}
            >
                <Typography
                    sx={{
                        color: "#BF953F",
                        fontWeight: 700,
                        fontSize: { xs: "0.8rem", md: "0.9rem" },
                        textTransform: "uppercase",
                        letterSpacing: "0.1em",
                    }}
                >
                    {data.solutionsLabel}
                </Typography>
            </Box>
            {data.solutions.map((item, i) => (
                <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.08 }}
                >
                    <Box
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 2,
                            px: { xs: 3, md: 4 },
                            py: 2,
                            borderBottom: i < data.solutions.length - 1 ? "1px solid rgba(191,149,63,0.1)" : "none",
                            "&:hover": { background: "rgba(191,149,63,0.05)" },
                            transition: "background 0.2s",
                        }}
                    >
                        <Box
                            sx={{
                                width: 6,
                                height: 6,
                                borderRadius: "50%",
                                background: "#BF953F",
                                flexShrink: 0,
                            }}
                        />
                        <Typography sx={{ color: "rgba(255,255,255,0.85)", fontSize: { xs: "0.85rem", md: "0.95rem" } }}>
                            {item}
                        </Typography>
                    </Box>
                </motion.div>
            ))}
        </Box>

        {/* Occasions column */}
        <Box sx={{ borderTop: { xs: "1px solid rgba(191,149,63,0.2)", md: "none" } }}>
            <Box
                sx={{
                    background: "linear-gradient(135deg, rgba(191,149,63,0.2), rgba(191,149,63,0.08))",
                    px: { xs: 3, md: 4 },
                    py: 2.5,
                    borderBottom: "1px solid rgba(191,149,63,0.2)",
                }}
            >
                <Typography
                    sx={{
                        color: "#BF953F",
                        fontWeight: 700,
                        fontSize: { xs: "0.8rem", md: "0.9rem" },
                        textTransform: "uppercase",
                        letterSpacing: "0.1em",
                    }}
                >
                    {data.occasionsLabel}
                </Typography>
            </Box>
            {data.occasions.map((item, i) => (
                <motion.div
                    key={i}
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.08 }}
                >
                    <Box
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 2,
                            px: { xs: 3, md: 4 },
                            py: 2,
                            borderBottom: i < data.occasions.length - 1 ? "1px solid rgba(191,149,63,0.1)" : "none",
                            "&:hover": { background: "rgba(191,149,63,0.05)" },
                            transition: "background 0.2s",
                        }}
                    >
                        <Box
                            sx={{
                                width: 6,
                                height: 6,
                                borderRadius: "50%",
                                background: "linear-gradient(135deg, #BF953F, #FCF6BA)",
                                flexShrink: 0,
                            }}
                        />
                        <Typography sx={{ color: "rgba(255,255,255,0.85)", fontSize: { xs: "0.85rem", md: "0.95rem" } }}>
                            {item}
                        </Typography>
                    </Box>
                </motion.div>
            ))}
        </Box>
    </Box>
);

/* ─── Main Component ─── */
const CorporateBranding = () => {
    const locale = useLocale();
    const isRtl = locale === "ar";
    const t = translations[locale] || translations.en;

    return (
        <>
            {/* ══════ OCCASIONS & SOLUTIONS ══════ */}
            <Box
                component="section"
                id="gifting-solutions"
                dir={isRtl ? "rtl" : "ltr"}
                sx={{
                    py: { xs: 8, md: 12 },
                    background: "linear-gradient(180deg, #111111 0%, #0d0d0d 100%)",
                    position: "relative",
                    overflow: "hidden",
                }}
            >
                {/* Gold glow */}
                <Box sx={{
                    position: "absolute", top: "50%", left: "50%",
                    transform: "translate(-50%,-50%)",
                    width: "700px", height: "400px",
                    background: "radial-gradient(ellipse, rgba(191,149,63,0.07) 0%, transparent 70%)",
                    filter: "blur(80px)", pointerEvents: "none",
                }} />

                <Container maxWidth="xl" sx={{ position: "relative", zIndex: 1 }}>
                    <Box sx={{ textAlign: "center", mb: { xs: 5, md: 8 } }}>
                        <Box sx={{ width: "80px", height: "2px", background: "linear-gradient(90deg, transparent, #BF953F, transparent)", margin: "0 auto 16px" }} />
                        <Typography variant="overline" sx={{ color: "#BF953F", letterSpacing: "0.25em", fontWeight: 600, fontSize: { xs: "0.65rem", md: "0.78rem" }, display: "block", mb: 1.5 }}>
                            {t.occasions.eyebrow}
                        </Typography>
                        <Typography variant="h2" sx={{ color: "#FFFFFF", fontSize: { xs: "1.8rem", md: "3rem" }, fontWeight: 700, fontFamily: "'Playfair Display', serif" }}>
                            {t.occasions.title}
                        </Typography>
                    </Box>
                    <OccasionsTable data={t.occasions} isRtl={isRtl} />
                </Container>
            </Box>

            {/* ══════ CUSTOMIZED BRANDING ══════ */}
            <Box
                component="section"
                id="custom-branding"
                dir={isRtl ? "rtl" : "ltr"}
                sx={{
                    py: { xs: 8, md: 14 },
                    background: "linear-gradient(180deg, #0d0d0d 0%, #0a0a0a 100%)",
                    position: "relative",
                    overflow: "hidden",
                }}
            >
                {/* Ambient glows */}
                <Box sx={{
                    position: "absolute", top: "10%", [isRtl ? "left" : "right"]: "5%",
                    width: "500px", height: "500px",
                    background: "radial-gradient(circle, rgba(191,149,63,0.09) 0%, transparent 70%)",
                    filter: "blur(80px)", pointerEvents: "none",
                }} />
                <Box sx={{
                    position: "absolute", bottom: "10%", [isRtl ? "right" : "left"]: "5%",
                    width: "300px", height: "300px",
                    background: "radial-gradient(circle, rgba(191,149,63,0.07) 0%, transparent 70%)",
                    filter: "blur(60px)", pointerEvents: "none",
                }} />

                <Container maxWidth="xl" sx={{ position: "relative", zIndex: 1 }}>
                    {/* Header */}
                    <Box sx={{ textAlign: "center", mb: { xs: 5, md: 8 } }}>
                        <Box sx={{ width: "80px", height: "2px", background: "linear-gradient(90deg, transparent, #BF953F, transparent)", margin: "0 auto 16px" }} />
                        <Typography variant="overline" sx={{ color: "#BF953F", letterSpacing: "0.25em", fontWeight: 600, fontSize: { xs: "0.65rem", md: "0.78rem" }, display: "block", mb: 1.5 }}>
                            {t.branding.eyebrow}
                        </Typography>
                        <Typography variant="h2" sx={{ color: "#FFFFFF", fontSize: { xs: "1.8rem", md: "3rem" }, fontWeight: 700, fontFamily: "'Playfair Display', serif", mb: 2 }}>
                            {t.branding.title}
                        </Typography>
                        <Typography sx={{ color: "rgba(255,255,255,0.5)", fontSize: { xs: "0.88rem", md: "1rem" }, maxWidth: "580px", mx: "auto", lineHeight: 1.8, fontWeight: 300 }}>
                            {t.branding.subtitle}
                        </Typography>
                    </Box>

                    {/* Features grid */}
                    <Box
                        sx={{
                            display: "grid",
                            gridTemplateColumns: { xs: "1fr 1fr", md: "repeat(3, 1fr)" },
                            gap: { xs: 2, md: 3 },
                        }}
                    >
                        {t.branding.features.map((feature, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: i * 0.08 }}
                            >
                                <Box
                                    sx={{
                                        background: "rgba(255,255,255,0.03)",
                                        border: "1px solid rgba(191,149,63,0.15)",
                                        borderRadius: "20px",
                                        p: { xs: 2.5, md: 4 },
                                        height: "100%",
                                        position: "relative",
                                        overflow: "hidden",
                                        transition: "all 0.35s ease",
                                        "&::before": {
                                            content: '""',
                                            position: "absolute",
                                            top: 0, left: 0, right: 0,
                                            height: "2px",
                                            background: "linear-gradient(90deg, #BF953F, #FCF6BA, #BF953F)",
                                            opacity: 0,
                                            transition: "opacity 0.35s ease",
                                        },
                                        "&:hover": {
                                            background: "rgba(191,149,63,0.06)",
                                            border: "1px solid rgba(191,149,63,0.4)",
                                            transform: "translateY(-6px)",
                                            boxShadow: "0 20px 50px rgba(191,149,63,0.12)",
                                            "&::before": { opacity: 1 },
                                        },
                                    }}
                                >
                                    <Box sx={{ fontSize: { xs: "1.8rem", md: "2.2rem" }, mb: 1.5, lineHeight: 1 }}>
                                        {feature.icon}
                                    </Box>
                                    <Typography
                                        sx={{
                                            color: "#FFFFFF",
                                            fontWeight: 700,
                                            fontSize: { xs: "0.9rem", md: "1.05rem" },
                                            mb: 1,
                                            fontFamily: "'Playfair Display', serif",
                                        }}
                                    >
                                        {feature.title}
                                    </Typography>
                                    <Typography
                                        sx={{
                                            color: "rgba(255,255,255,0.5)",
                                            fontSize: { xs: "0.78rem", md: "0.88rem" },
                                            lineHeight: 1.65,
                                            fontWeight: 300,
                                        }}
                                    >
                                        {feature.desc}
                                    </Typography>
                                </Box>
                            </motion.div>
                        ))}
                    </Box>
                </Container>
            </Box>
        </>
    );
};

export default CorporateBranding;
