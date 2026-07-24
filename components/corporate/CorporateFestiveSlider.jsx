"use client";
import { useState } from "react";
import { Box, Container, Typography, Button } from "@mui/material";
import { useLocale } from "next-intl";
import Image from "next/image";
import NightlightIcon from "@mui/icons-material/Nightlight";
import CardGiftcardIcon from "@mui/icons-material/CardGiftcard";
import MosquesIcon from "@mui/icons-material/Mosque";
import CelebrationIcon from "@mui/icons-material/Celebration";
import ChurchIcon from "@mui/icons-material/Church";

const translations = {
    en: {
        eyebrow: "FESTIVE CELEBRATIONS",
        heading: "Festive & Holiday Collections",
        cta: "Inquire For Festive Gifting",
        tabs: [
            {
                id: "ramadan",
                title: "Ramadan",
                badge: "Holy Month Blessings",
                eyebrow: "WHERE FAITH MEETS WARMTH",
                subtitle: "The most beautiful moments are those shared with faith, family, and heartfelt giving. From Ramadan's peace to Eid's delight, every gift shines with warmth and light.",
                image: "/assets/Corporate Gift Sets/corporate gift set beige color.jpg.jpeg",
                icon: <NightlightIcon sx={{ fontSize: "1.2rem" }} />,
                poem: "In peaceful nights and blessed days, carry warmth in sacred ways. A token of faith, a gesture pure, scents that make quiet joy endure.",
            },
            {
                id: "eid-al-fitr",
                title: "Eid Al Fitr",
                badge: "Joyous Celebrations",
                eyebrow: "WHERE JOY UNITES HEARTS",
                subtitle: "The most beautiful moments are those shared with faith, family, and heartfelt giving. From Ramadan's peace to Eid's delight, every gift shines with warmth and light.",
                image: "/assets/Corporate Gift Sets/corporate gift set 05.jpg.jpeg",
                icon: <CardGiftcardIcon sx={{ fontSize: "1.2rem" }} />,
                poem: "Laughter echoes, spirits rise, under bright celebratory skies. Gift delight and heartfelt cheer, for moments held forever dear.",
            },
            {
                id: "eid-al-adha",
                title: "Eid Al Adha",
                badge: "Sacred Traditions",
                eyebrow: "WHERE TRADITIONS LIVE ON",
                subtitle: "The most beautiful moments are those shared with faith, family, and heartfelt giving. From Ramadan's peace to Eid's delight, every gift shines with warmth and light.",
                image: "/assets/Corporate Gift Sets/corporate gift set black square 01.jpg.jpeg",
                icon: <MosquesIcon sx={{ fontSize: "1.2rem" }} />,
                poem: "Honoring sacrifice, sharing grace, joy felt in every warm embrace. A gift of reverence, rich and grand, blessings shared across the land.",
            },
            {
                id: "diwali",
                title: "Diwali",
                badge: "Festive Celebration",
                eyebrow: "WHERE LIGHT INSPIRES JOY",
                subtitle: "Illuminate Every Bond with the Essence of Diwali. Thoughtfully curated to express gratitude and create unforgettable moments with clients, employees, and friends — each perfume a symbol of warmth and new beginnings.",
                image: "/assets/Corporate Gift Sets/Diwali.jpeg",
                icon: <CelebrationIcon sx={{ fontSize: "1.2rem" }} />,
                poem: "As lamps light the sky and hearts glow bright, may this fragrance carry Diwali's light. A gift of joy, a memory divine — where every bond and blessing intertwine.",
            },
            {
                id: "christmas",
                title: "Christmas",
                badge: "Season's Greetings",
                eyebrow: "WHERE WARMTH BRINGS TOGETHER",
                subtitle: "The most beautiful moments are those shared with faith, family, and heartfelt giving. From Ramadan's peace to Eid's delight, every gift shines with warmth and light.",
                image: "/assets/Corporate Gift Sets/christmas.jpeg",
                icon: <ChurchIcon sx={{ fontSize: "1.2rem" }} />,
                poem: "Under winter lights and festive cheer, wrap love for those you hold so dear. Golden memories, timeless grace, bringing warmth to every space.",
            },
        ],
    },
    ar: {
        eyebrow: "احتفالات ومناسبات",
        heading: "تشكيلة المجموعات الاحتفالية",
        cta: "استفسر عن هدايا المناسبات",
        tabs: [
            {
                id: "ramadan",
                title: "رمضان",
                badge: "لبركات الشهر الفضيل",
                eyebrow: "حيث يلتقي الإيمان بالدفء",
                subtitle: "أجمل اللحظات هي تلك التي نتشاركها بالإيمان والعائلة والعطاء الصادق. من طمأنينة رمضان إلى فرحة العيد، كل هدية تشع بالدفء والنور.",
                image: "/assets/Corporate Gift Sets/corporate gift set beige color.jpg.jpeg",
                icon: <NightlightIcon sx={{ fontSize: "1.2rem" }} />,
                poem: "في الليالي الهادئة والأيام المباركة، احمل الدفء بطرق مقدسة. رمز للإيمان ولفتة نقية، عطور تجعل الفرح الهدوء يدوم.",
            },
            {
                id: "eid-al-fitr",
                title: "عيد الفطر",
                badge: "للاحتفالات البهيجة",
                eyebrow: "حيث يجمع الفرح القلوب",
                subtitle: "أجمل اللحظات هي تلك التي نتشاركها بالإيمان والعائلة والعطاء الصادق. من طمأنينة رمضان إلى فرحة العيد، كل هدية تشع بالدفء والنور.",
                image: "/assets/Corporate Gift Sets/corporate gift set 05.jpg.jpeg",
                icon: <CardGiftcardIcon sx={{ fontSize: "1.2rem" }} />,
                poem: "تتردد أصداء الضحكات وترتفع الأرواح، تحت سماء الاحتفال المشرقة. أهدِ البهجة والمودة الصادقة للحظات تبقى عزيزة إلى الأبد.",
            },
            {
                id: "eid-al-adha",
                title: "عيد الأضحى",
                badge: "للتقاليد المقدسة",
                eyebrow: "حيث تعيش التقاليد",
                subtitle: "أجمل اللحظات هي تلك التي نتشاركها بالإيمان والعائلة والعطاء الصادق. من طمأنينة رمضان إلى فرحة العيد، كل هدية تشع بالدفء والنور.",
                image: "/assets/Corporate Gift Sets/corporate gift set black square 01.jpg.jpeg",
                icon: <MosquesIcon sx={{ fontSize: "1.2rem" }} />,
                poem: "تكريم التضحية ومشاركة الفضل، فرح يشعر به في كل عناق دافئ. هدية التقدير الفاخرة، بركات تتشاركها الأيدي في كل مكان.",
            },
            {
                id: "diwali",
                title: "ديوالي",
                badge: "لاحتفالاتك المبهجة",
                eyebrow: "حيث يلهم النور الفرح",
                subtitle: "أضئ كل رابط بجوهر ديوالي. منسقة بعناية للتعبير عن الامتنان وخلق لحظات لا تُنسى مع العملاء والموظفين والأصدقاء — كل عطر رمز للدفء والبدايات الجديدة.",
                image: "/assets/Corporate Gift Sets/Diwali.jpeg",
                icon: <CelebrationIcon sx={{ fontSize: "1.2rem" }} />,
                poem: "كما تضيء المصابيح السماء وتتوهج القلوب، فليحمل هذا العطر نور ديوالي. هدية من الفرح وذكرى إلهية — حيث تتشابك كل الروابط والبركات.",
            },
            {
                id: "christmas",
                title: "الكريسماس",
                badge: "لتهاني الموسم",
                eyebrow: "حيث يجمع الدفء الجميع",
                subtitle: "أجمل اللحظات هي تلك التي نتشاركها بالإيمان والعائلة والعطاء الصادق. من طمأنينة رمضان إلى فرحة العيد، كل هدية تشع بالدفء والنور.",
                image: "/assets/Corporate Gift Sets/giftset4.jpeg",
                icon: <ChurchIcon sx={{ fontSize: "1.2rem" }} />,
                poem: "تحت أضواء الشتاء والبهجة الاحتفالية، لف المحبة لمن تحبهم. ذكريات ذهبية وأناقة خالدة، تضفي الدفء على كل مكان.",
            },
        ],
    },
};

const CorporateFestiveSlider = () => {
    const locale = useLocale();
    const isRtl = locale === "ar";
    const t = translations[locale] || translations.en;
    const [activeIndex, setActiveIndex] = useState(0);

    const activeTab = t.tabs[activeIndex];

    const handleScroll = () => {
        const el = document.getElementById("corporate-inquiry");
        if (el) el.scrollIntoView({ behavior: "smooth" });
    };

    return (
        <Box
            component="section"
            dir={isRtl ? "rtl" : "ltr"}
            sx={{
                py: { xs: 6, md: 10 },
                backgroundColor: "#FAF8F5",
                position: "relative",
            }}
        >
            <Container maxWidth="xl">
                {/* ── Section Title ── */}
                <Box sx={{ textAlign: "center", mb: { xs: 4, md: 6 } }}>
                    <Typography
                        variant="overline"
                        sx={{
                            color: "#A88132",
                            letterSpacing: "0.25em",
                            fontWeight: 500,
                            fontSize: { xs: "0.7rem", md: "0.8rem" },
                            display: "block",
                            mb: 1,
                            fontFamily: "'Montserrat', sans-serif",
                        }}
                    >
                        {t.eyebrow}
                    </Typography>
                    <Typography
                        variant="h2"
                        sx={{
                            color: "#1A1A1A",
                            fontSize: { xs: "2rem", sm: "2.5rem", md: "3.2rem" },
                            fontWeight: 400,
                            fontFamily: "'Playfair Display', serif",
                            mb: 2,
                        }}
                    >
                        {t.heading}
                    </Typography>
                    <Box sx={{ width: "50px", height: "2px", backgroundColor: "#A88132", mx: "auto" }} />
                </Box>

                {/* ── Interactive Category Pills Bar ── */}
                <Box
                    sx={{
                        display: "flex",
                        justifyContent: "center",
                        flexWrap: "wrap",
                        gap: { xs: 1, sm: 1.5, md: 2 },
                        mb: { xs: 4, md: 6 },
                    }}
                >
                    {t.tabs.map((tab, idx) => {
                        const isActive = idx === activeIndex;
                        return (
                            <Box
                                key={tab.id}
                                onClick={() => setActiveIndex(idx)}
                                sx={{
                                    py: { xs: 1, md: 1.2 },
                                    px: { xs: 2.2, md: 3.2 },
                                    borderRadius: "30px",
                                    cursor: "pointer",
                                    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                                    backgroundColor: isActive ? "#A88132" : "#FFFFFF",
                                    color: isActive ? "#FFFFFF" : "#1A1A1A",
                                    border: isActive ? "1px solid #A88132" : "1px solid rgba(168, 129, 50, 0.25)",
                                    boxShadow: isActive
                                        ? "0 8px 24px rgba(168,129,50,0.3)"
                                        : "0 2px 10px rgba(0,0,0,0.03)",
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 1,
                                    userSelect: "none",
                                    "&:hover": {
                                        backgroundColor: isActive ? "#8C6A29" : "rgba(168, 129, 50, 0.08)",
                                        transform: "translateY(-2px)",
                                    },
                                }}
                            >
                                <Box sx={{ color: isActive ? "#FFFFFF" : "#A88132", display: "flex" }}>
                                    {tab.icon}
                                </Box>
                                <Typography
                                    sx={{
                                        fontSize: { xs: "0.82rem", md: "0.92rem" },
                                        fontWeight: isActive ? 600 : 500,
                                        fontFamily: "'Montserrat', sans-serif",
                                    }}
                                >
                                    {tab.title}
                                </Typography>
                            </Box>
                        );
                    })}
                </Box>

                {/* ── Square-Tailored Showcase Layout ── */}
                <Box
                    sx={{
                        borderRadius: { xs: "20px", md: "24px" },
                        backgroundColor: "#FFFFFF",
                        border: "1px solid rgba(168, 129, 50, 0.15)",
                        boxShadow: "0 20px 60px rgba(0,0,0,0.06)",
                        overflow: "hidden",
                        maxWidth: "1140px",
                        mx: "auto",
                    }}
                >
                    <Box
                        sx={{
                            display: "flex",
                            flexDirection: { xs: "column", md: "row" },
                            alignItems: "stretch",
                        }}
                    >
                        {/* Square Image Box (1:1 Aspect Ratio + Full Height Stretch) */}
                        <Box
                            sx={{
                                position: "relative",
                                width: { xs: "100%", md: "460px", lg: "500px" },
                                minHeight: { xs: "320px", sm: "400px", md: "100%" },
                                flexShrink: 0,
                                alignSelf: "stretch",
                                overflow: "hidden",
                                backgroundColor: "#FAF7F2",
                            }}
                        >
                            <Image
                                key={activeTab.id}
                                src={activeTab.image}
                                alt={activeTab.title}
                                fill
                                style={{
                                    objectFit: "cover",
                                    objectPosition: "center",
                                    transition: "all 0.5s ease",
                                }}
                                sizes="(max-width: 900px) 100vw, 460px"
                                priority
                            />

                            {/* Badge */}
                            <Box
                                sx={{
                                    position: "absolute",
                                    top: 16,
                                    [isRtl ? "right" : "left"]: 16,
                                    backgroundColor: "rgba(255,255,255,0.95)",
                                    backdropFilter: "blur(10px)",
                                    border: "1px solid rgba(168, 129, 50, 0.2)",
                                    px: 2,
                                    py: 0.8,
                                    borderRadius: "30px",
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 1,
                                    boxShadow: "0 6px 20px rgba(0,0,0,0.08)",
                                    zIndex: 2,
                                }}
                            >
                                <Box sx={{ color: "#A88132", display: "flex" }}>{activeTab.icon}</Box>
                                <Typography
                                    sx={{
                                        color: "#1A1A1A",
                                        fontWeight: 600,
                                        fontSize: "0.7rem",
                                        textTransform: "uppercase",
                                        letterSpacing: "0.1em",
                                        fontFamily: "'Montserrat', sans-serif",
                                    }}
                                >
                                    {activeTab.badge}
                                </Typography>
                            </Box>
                        </Box>

                        {/* Content Side Box */}
                        <Box
                            sx={{
                                flex: 1,
                                p: { xs: 3, sm: 4, md: 6 },
                                textAlign: isRtl ? "right" : "left",
                            }}
                        >
                            <Typography
                                variant="overline"
                                sx={{
                                    color: "#A88132",
                                    letterSpacing: "0.2em",
                                    fontWeight: 500,
                                    fontSize: { xs: "0.7rem", md: "0.78rem" },
                                    display: "block",
                                    mb: 1,
                                    fontFamily: "'Montserrat', sans-serif",
                                }}
                            >
                                {activeTab.eyebrow}
                            </Typography>

                            <Typography
                                variant="h3"
                                sx={{
                                    color: "#1A1A1A",
                                    fontSize: { xs: "1.7rem", sm: "2.2rem", md: "2.5rem" },
                                    fontWeight: 400,
                                    fontFamily: "'Playfair Display', serif",
                                    mb: 2,
                                    lineHeight: 1.25,
                                }}
                            >
                                {activeTab.title} Collection
                            </Typography>

                            <Typography
                                sx={{
                                    color: "#4A4A4A",
                                    fontSize: { xs: "0.9rem", sm: "0.98rem", md: "1.02rem" },
                                    lineHeight: 1.75,
                                    fontWeight: 300,
                                    mb: 3,
                                    fontFamily: "'Montserrat', sans-serif",
                                }}
                            >
                                {activeTab.subtitle}
                            </Typography>

                            {/* Poem / Quote Block */}
                            {activeTab.poem && (
                                <Box
                                    sx={{
                                        mb: 4,
                                        p: 2.5,
                                        backgroundColor: "rgba(168, 129, 50, 0.05)",
                                        borderRadius: "12px",
                                        borderLeft: isRtl ? "none" : "3px solid #A88132",
                                        borderRight: isRtl ? "3px solid #A88132" : "none",
                                    }}
                                >
                                    <Typography
                                        sx={{
                                            color: "#2A2A2A",
                                            fontSize: { xs: "0.88rem", md: "0.98rem" },
                                            lineHeight: 1.7,
                                            fontStyle: "italic",
                                            fontFamily: "'Playfair Display', serif",
                                        }}
                                    >
                                        "{activeTab.poem}"
                                    </Typography>
                                </Box>
                            )}

                            <Box sx={{ mt: 1 }}>
                                <Button
                                    onClick={handleScroll}
                                    sx={{
                                        backgroundColor: "#A88132",
                                        color: "#FFFFFF",
                                        py: { xs: 1.3, md: 1.5 },
                                        px: { xs: 3.5, md: 4.5 },
                                        fontSize: { xs: "0.78rem", md: "0.82rem" },
                                        fontWeight: 600,
                                        borderRadius: "50px",
                                        textTransform: "uppercase",
                                        letterSpacing: "0.15em",
                                        fontFamily: "'Montserrat', sans-serif",
                                        boxShadow: "0 8px 24px rgba(168,129,50,0.25)",
                                        transition: "all 0.3s ease",
                                        "&:hover": {
                                            backgroundColor: "#8C6A29",
                                            transform: "translateY(-2px)",
                                            boxShadow: "0 12px 32px rgba(168,129,50,0.4)",
                                        },
                                    }}
                                >
                                    {t.cta}
                                </Button>
                            </Box>
                        </Box>
                    </Box>
                </Box>
            </Container>
        </Box>
    );
};

export default CorporateFestiveSlider;
