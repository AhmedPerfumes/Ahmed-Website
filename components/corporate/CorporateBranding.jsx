"use client";
import { Box, Container, Typography, Grid } from "@mui/material";
import { motion } from "framer-motion";
import { useLocale } from "next-intl";

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
                "Corporate Gift Sets & Executive Gifts",
                "Employee Welcome & Appreciation Kits",
                "Event & Conference Giveaways",
                "Government & Institutional Gifts",
            ],
            occasionsList: [
                "Ramadan, Eid Al Fitr & Eid Al Adha",
                "Christmas & Festive Holidays",
                "Annual Corporate Events",
                "Graduations & Milestones",
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
                "أطقم ترحيب وتقدير الموظفين",
                "هدايا المؤتمرات والفعاليات",
                "هدايا حكومية ومؤسسية",
            ],
            occasionsList: [
                "رمضان وعيد الفطر وعيد الأضحى",
                "عيد الميلاد والمواسم الاحتفالية",
                "الفعاليات والمؤتمرات السنوية",
                "حفلات التخرج والإنجازات",
            ],
        },
    },
};

const CorporateBranding = () => {
    const locale = useLocale();
    const isRtl = locale === "ar";
    const t = translations[locale] || translations.en;

    return (
        <Box
            component="section"
            id="gifting-solutions"
            dir={isRtl ? "rtl" : "ltr"}
            sx={{
                py: { xs: 8, sm: 10, md: 16 },
                backgroundColor: "#FAF8F5",
                position: "relative",
            }}
        >
            <Container maxWidth="xl">
                {/* ── Section Header ── */}
                <Box sx={{ textAlign: "center", mb: { xs: 6, md: 10 } }}>
                    <Typography
                        variant="overline"
                        sx={{
                            color: "#A88132",
                            letterSpacing: "0.25em",
                            fontWeight: 500,
                            fontSize: { xs: "0.7rem", md: "0.78rem" },
                            display: "block",
                            mb: 2,
                            fontFamily: "'Montserrat', sans-serif",
                        }}
                    >
                        {t.occasions.eyebrow}
                    </Typography>
                    <Typography
                        variant="h2"
                        sx={{
                            color: "#1A1A1A",
                            fontSize: { xs: "1.8rem", sm: "2.5rem", md: "3.5rem" },
                            fontWeight: 400,
                            fontFamily: "'Playfair Display', serif",
                            mb: 2.5,
                            lineHeight: 1.2,
                        }}
                    >
                        {t.occasions.title}
                    </Typography>
                    <Box sx={{ width: "40px", height: "2px", backgroundColor: "#A88132", mx: "auto" }} />
                </Box>

                {/* ── Two-Column Premium Cards Layout (Symmetrical 2x2 Grid on Both Sides) ── */}
                <Grid container spacing={{ xs: 3, md: 5 }} alignItems="stretch">

                    {/* Left Column: Gifting Solutions */}
                    <Grid item xs={12} md={6}>
                        <motion.div
                            initial={{ opacity: 0, y: 25 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.7 }}
                            style={{ height: "100%" }}
                        >
                            <Box
                                sx={{
                                    backgroundColor: "#FFFFFF",
                                    borderRadius: { xs: "16px", md: "24px" },
                                    p: { xs: 3.5, sm: 5, md: 6 },
                                    height: "100%",
                                    boxShadow: "0 16px 45px rgba(0,0,0,0.03)",
                                    border: "1px solid rgba(168,129,50,0.14)",
                                    display: "flex",
                                    flexDirection: "column",
                                    justifyContent: "space-between",
                                }}
                            >
                                <Box>
                                    <Typography
                                        component="div"
                                        sx={{
                                            color: "#A88132",
                                            fontWeight: 600,
                                            mb: 3.5,
                                            fontSize: "0.75rem",
                                            textTransform: "uppercase",
                                            letterSpacing: "0.2em",
                                            fontFamily: "'Montserrat', sans-serif",
                                            display: "flex",
                                            alignItems: "center",
                                            gap: 1.5,
                                        }}
                                    >
                                        <Box sx={{ width: "20px", height: "2px", backgroundColor: "#A88132" }} />
                                        {isRtl ? "حلول الهدايا" : "Gifting Solutions"}
                                    </Typography>

                                    <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "repeat(2, 1fr)" }, gap: 2.5 }}>
                                        {t.occasions.solutions.map((item, i) => (
                                            <Box
                                                key={i}
                                                sx={{
                                                    p: { xs: 2.5, md: 3 },
                                                    borderRadius: "14px",
                                                    backgroundColor: "#FAF8F5",
                                                    border: "1px solid rgba(0,0,0,0.04)",
                                                    transition: "all 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
                                                    "&:hover": {
                                                        transform: "translateY(-3px)",
                                                        borderColor: "rgba(168,129,50,0.35)",
                                                        boxShadow: "0 12px 28px rgba(168,129,50,0.08)",
                                                        backgroundColor: "#FFFFFF",
                                                    },
                                                }}
                                            >
                                                <Typography
                                                    sx={{
                                                        color: "#A88132",
                                                        fontFamily: "'Playfair Display', serif",
                                                        fontSize: "1.2rem",
                                                        fontWeight: 600,
                                                        mb: 1,
                                                    }}
                                                >
                                                    {String(i + 1).padStart(2, "0")}
                                                </Typography>
                                                <Typography
                                                    sx={{
                                                        color: "#1A1A1A",
                                                        fontSize: { xs: "0.9rem", md: "0.95rem" },
                                                        fontFamily: "'Montserrat', sans-serif",
                                                        fontWeight: 500,
                                                        lineHeight: 1.5,
                                                    }}
                                                >
                                                    {item}
                                                </Typography>
                                            </Box>
                                        ))}
                                    </Box>
                                </Box>

                                {/* Footer Quote inside Solutions Card */}
                                <Box
                                    sx={{
                                        mt: 4,
                                        pt: 3,
                                        borderTop: "1px solid rgba(0,0,0,0.06)",
                                    }}
                                >
                                    <Typography
                                        sx={{
                                            color: "#666666",
                                            fontSize: "0.82rem",
                                            fontFamily: "'Montserrat', sans-serif",
                                            fontWeight: 400,
                                        }}
                                    >
                                        {isRtl
                                            ? "أطقم هدايا مخصصة تلبي متطلبات وتطلعات مؤسستك."
                                            : "Tailored gift collections designed to match your organization's exact stature."
                                        }
                                    </Typography>
                                </Box>
                            </Box>
                        </motion.div>
                    </Grid>

                    {/* Right Column: Ideal Occasions (Identical 2x2 Grid Layout) */}
                    <Grid item xs={12} md={6}>
                        <motion.div
                            initial={{ opacity: 0, y: 25 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.7, delay: 0.15 }}
                            style={{ height: "100%" }}
                        >
                            <Box
                                sx={{
                                    backgroundColor: "#FFFFFF",
                                    borderRadius: { xs: "16px", md: "24px" },
                                    p: { xs: 3.5, sm: 5, md: 6 },
                                    height: "100%",
                                    boxShadow: "0 16px 45px rgba(0,0,0,0.03)",
                                    border: "1px solid rgba(168,129,50,0.14)",
                                    display: "flex",
                                    flexDirection: "column",
                                    justifyContent: "space-between",
                                }}
                            >
                                <Box>
                                    <Typography
                                        component="div"
                                        sx={{
                                            color: "#A88132",
                                            fontWeight: 600,
                                            mb: 3.5,
                                            fontSize: "0.75rem",
                                            textTransform: "uppercase",
                                            letterSpacing: "0.2em",
                                            fontFamily: "'Montserrat', sans-serif",
                                            display: "flex",
                                            alignItems: "center",
                                            gap: 1.5,
                                        }}
                                    >
                                        <Box sx={{ width: "20px", height: "2px", backgroundColor: "#A88132" }} />
                                        {isRtl ? "المناسبات المثالية" : "Ideal Occasions"}
                                    </Typography>

                                    <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "repeat(2, 1fr)" }, gap: 2.5 }}>
                                        {t.occasions.occasionsList.map((item, i) => (
                                            <Box
                                                key={i}
                                                sx={{
                                                    p: { xs: 2.5, md: 3 },
                                                    borderRadius: "14px",
                                                    backgroundColor: "#FAF8F5",
                                                    border: "1px solid rgba(0,0,0,0.04)",
                                                    transition: "all 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
                                                    "&:hover": {
                                                        transform: "translateY(-3px)",
                                                        borderColor: "rgba(168,129,50,0.35)",
                                                        boxShadow: "0 12px 28px rgba(168,129,50,0.08)",
                                                        backgroundColor: "#FFFFFF",
                                                    },
                                                }}
                                            >
                                                <Typography
                                                    sx={{
                                                        color: "#A88132",
                                                        fontFamily: "'Playfair Display', serif",
                                                        fontSize: "1.2rem",
                                                        fontWeight: 600,
                                                        mb: 1,
                                                    }}
                                                >
                                                    {String(i + 1).padStart(2, "0")}
                                                </Typography>
                                                <Typography
                                                    sx={{
                                                        color: "#1A1A1A",
                                                        fontSize: { xs: "0.9rem", md: "0.95rem" },
                                                        fontFamily: "'Montserrat', sans-serif",
                                                        fontWeight: 500,
                                                        lineHeight: 1.5,
                                                    }}
                                                >
                                                    {item}
                                                </Typography>
                                            </Box>
                                        ))}
                                    </Box>
                                </Box>

                                {/* Footer Quote inside Occasions Card */}
                                <Box
                                    sx={{
                                        mt: 4,
                                        pt: 3,
                                        borderTop: "1px solid rgba(0,0,0,0.06)",
                                    }}
                                >
                                    <Typography
                                        sx={{
                                            color: "#666666",
                                            fontSize: "0.82rem",
                                            fontFamily: "'Montserrat', sans-serif",
                                            fontWeight: 400,
                                        }}
                                    >
                                        {isRtl
                                            ? "مصممة بعناية لتترك انطباعاً راقياً في كل مناسبة واحتفال."
                                            : "Thoughtfully crafted to leave a timeless impression across every milestone and celebration."
                                        }
                                    </Typography>
                                </Box>
                            </Box>
                        </motion.div>
                    </Grid>

                </Grid>
            </Container>
        </Box>
    );
};

export default CorporateBranding;
