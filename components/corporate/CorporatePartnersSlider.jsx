"use client";
import { Box, Container, Typography, Button } from "@mui/material";
import { useLocale } from "next-intl";
import Image from "next/image";
import FlightTakeoffIcon from "@mui/icons-material/FlightTakeoff";
import MosqueIcon from "@mui/icons-material/Mosque";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import CelebrationIcon from "@mui/icons-material/Celebration";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";

const translations = {
    en: {
        eyebrow: "CURATED COLLABORATIONS",
        cta: "Partner With Us",
        slides: [
            {
                id: "airline",
                title: "Travel Collection",
                badge: "For Every Journey",
                eyebrow: "WHERE JOURNEYS BECOME MEMORIES",
                subtitle: "Crafted for airlines, luxury hotels, travel companies, and hospitality partners, the Ahmed Al Maghribi Travel Collection is designed to elevate every voyage with elegance, comfort, and unforgettable aromas.",
                image: "/assets/Corporate Gift Sets/Airline.jpeg",
                icon: <FlightTakeoffIcon sx={{ fontSize: "1.2rem", color: "#A88132" }} />,
                poem: "Fly with grace, arrive in style — carry a fragrance every mile. From sky to shore, from dawn till night, a scent that makes each journey bright.",
            },
            {
                id: "hajj-umrah",
                title: "Hajj & Umrah Collection",
                badge: "For your Sacred Journey",
                eyebrow: "WHERE FAITH MEETS GRACE",
                subtitle: "A Journey of Faith. A Gift of Blessings. Featuring our signature perfumes and premium attars, elegantly presented in bespoke gift boxes — a meaningful keepsake for pilgrims, loved ones, and guests.",
                image: "/assets/Corporate Gift Sets/corporate gift set beige color.jpg.jpeg",
                icon: <MosqueIcon sx={{ fontSize: "1.2rem", color: "#A88132" }} />,
                poem: "From Makkah's light to Madinah's grace, may peace and mercy your heart embrace. With every aroma, memories remain — a sacred journey lived again.",
            },
            {
                id: "bank",
                title: "Our Corporate Alliances",
                badge: "For Valued Partnerships",
                eyebrow: "WHERE TRUST BUILDS LEGACY",
                subtitle: "Prestige gifting for the financial sector. Curated for banks, investment firms, and financial institutions, each set is a statement of distinction — perfectly crafted to honour clients, partners, and leadership.",
                image: "/assets/Corporate Gift Sets/corporate gift set black square 01.jpg.jpeg",
                icon: <AccountBalanceIcon sx={{ fontSize: "1.2rem", color: "#A88132" }} />,
                poem: "Where trust is built and legacies grow, a fragrance speaks what words cannot show. A gift of prestige, a bond of gold — a story of excellence yet to be told.",
            },
        ],
    },
    ar: {
        eyebrow: "شركاء موثوقون",
        cta: "كن شريكاً لنا",
        slides: [
            {
                id: "airline",
                title: "مجموعة السفر",
                badge: "لكل رحلة",
                eyebrow: "حيث تصبح الرحلات ذكريات",
                subtitle: "صُممت مجموعة سفر أحمد المغربي لشركات الطيران والفنادق الفاخرة وشركاء الضيافة، لترتقي بكل رحلة بالأناقة والراحة والعطور التي لا تُنسى.",
                image: "/assets/Corporate Gift Sets/corporate gift set 05.jpg.jpeg",
                icon: <FlightTakeoffIcon sx={{ fontSize: "1.2rem", color: "#A88132" }} />,
                poem: "سافر برقي وصِل بأناقة — احمل عطراً في كل ميل. من السماء إلى الشاطئ، من الفجر حتى الليل، رائحة تجعل كل رحلة مشرقة.",
            },
            {
                id: "hajj-umrah",
                title: "مجموعة الحج والعمرة",
                badge: "لرحلتك المقدسة",
                eyebrow: "حيث يلتقي الإيمان بالرقي",
                subtitle: "رحلة الإيمان. هدية البركات. تضم عطورنا المميزة والأدهان الفاخرة، معروضة بأناقة في صناديق هدايا مخصصة — تذكار قيم للحجاج والأحباء والضيوف.",
                image: "/assets/Corporate Gift Sets/corporate gift set beige color.jpg.jpeg",
                icon: <MosqueIcon sx={{ fontSize: "1.2rem", color: "#A88132" }} />,
                poem: "من نور مكة إلى فضل المدينة، عسى أن يغمر السلام والرحمة قلبك. مع كل عطر تبقى الذكريات — رحلة مقدسة تعاش من جديد.",
            },
            {
                id: "bank",
                title: "مجموعة البنوك",
                badge: "للشراكات القيمة",
                eyebrow: "حيث تبني الثقة الإرث",
                subtitle: "هدايا راقية للقطاع المالي. منسقة للبنوك وشركات الاستثمار والمؤسسات المالية، كل طقم تعبير عن التميز — مصمم لتكريم العملاء والشركاء والقيادات.",
                image: "/assets/Corporate Gift Sets/corporate gift set black square 01.jpg.jpeg",
                icon: <AccountBalanceIcon sx={{ fontSize: "1.2rem", color: "#A88132" }} />,
                poem: "حيث يُبنى الثقة وتنمو الإرث، يتحدث عطر بما لا تستطيع الكلمات التعبير عنه. هدية من الرقي، وعهد من الذهب — قصة تميز لم تُكتب بعد.",
            },
        ],
    },
};

const CorporatePartnersSlider = () => {
    const locale = useLocale();
    const isRtl = locale === "ar";
    const t = translations[locale] || translations.en;

    const handleScroll = () => {
        const el = document.getElementById("corporate-inquiry");
        if (el) el.scrollIntoView({ behavior: "smooth" });
    };

    return (
        <Box
            component="section"
            dir={isRtl ? "rtl" : "ltr"}
            sx={{
                py: { xs: 4, md: 8 },
                backgroundColor: "#FAF8F5",
                position: "relative",
            }}
        >
            {/* ── Section Header ── */}
            <Container maxWidth="xl" sx={{ position: "relative", zIndex: 1 }}>
                <Box sx={{ textAlign: "center", mb: { xs: 3, md: 6 } }}>
                    <Typography
                        variant="overline"
                        sx={{
                            color: "#A88132",
                            letterSpacing: "0.2em",
                            fontWeight: 500,
                            fontSize: { xs: "0.68rem", md: "0.75rem" },
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
                            fontSize: { xs: "1.75rem", md: "3rem" },
                            fontWeight: 400,
                            fontFamily: "'Playfair Display', serif",
                            mb: 1.5,
                        }}
                    >
                        {isRtl ? "مجموعات الشركاء" : "Signature Partner Collections"}
                    </Typography>
                    <Box sx={{ width: "40px", height: "2px", backgroundColor: "#A88132", mx: "auto" }} />
                </Box>
            </Container>

            {/* ── Slider Card ── */}
            <Box sx={{ px: { xs: 1.5, sm: 3, md: 4 }, maxWidth: "1440px", mx: "auto", width: "100%" }}>
                <Box
                    sx={{
                        borderRadius: { xs: "16px", sm: "20px", md: "24px" },
                        overflow: "hidden",
                        backgroundColor: "#FFFFFF",
                        boxShadow: "0 24px 80px rgba(0,0,0,0.08)",
                        position: "relative",
                        /* Swiper nav buttons */
                        "& .swiper-button-next, & .swiper-button-prev": {
                            color: "#FFFFFF",
                            width: { xs: "32px", sm: "38px", md: "44px" },
                            height: { xs: "32px", sm: "38px", md: "44px" },
                            backgroundColor: "rgba(168,129,50,0.9)",
                            borderRadius: "50%",
                            boxShadow: "0 6px 20px rgba(168,129,50,0.35)",
                            transition: "all 0.3s ease",
                            zIndex: 10,
                            "&::after": { fontSize: { xs: "0.75rem", md: "1rem" }, fontWeight: 900 },
                            "&:hover": { backgroundColor: "#8C6A29", transform: "scale(1.1)" },
                        },
                        "& .swiper-button-next": { right: { xs: "6px", sm: "14px", md: "20px" } },
                        "& .swiper-button-prev": { left: { xs: "6px", sm: "14px", md: "20px" } },
                        "& .swiper-slide": { padding: 0, margin: 0 },
                    }}
                >
                    <Swiper
                        modules={[Autoplay, Navigation]}
                        navigation
                        speed={900}
                        spaceBetween={0}
                        autoplay={{ delay: 5000, disableOnInteraction: false }}
                        loop
                        dir={isRtl ? "rtl" : "ltr"}
                        key={isRtl ? "rtl" : "ltr"}
                        style={{ width: "100%" }}
                    >
                        {t.slides.map((slide, index) => (
                            <SwiperSlide key={slide.id}>
                                {/* ── Two-column flex layout ── */}
                                <Box
                                    sx={{
                                        display: "flex",
                                        flexDirection: { xs: "column", md: "row" },
                                        alignItems: "stretch",
                                        minHeight: { xs: "auto", md: "520px" },
                                    }}
                                >
                                    {/* ── Image ── */}
                                    <Box
                                        sx={{
                                            position: "relative",
                                            width: { xs: "100%", md: "48%", lg: "50%" },
                                            minHeight: { xs: "280px", sm: "360px", md: "100%" },
                                            height: { xs: "280px", sm: "360px", md: "auto" },
                                            flexShrink: 0,
                                            alignSelf: "stretch",
                                        }}
                                    >
                                        <Image
                                            src={slide.image}
                                            alt={slide.title}
                                            fill
                                            style={{ objectFit: "cover", objectPosition: "center" }}
                                            sizes="(max-width: 900px) 100vw, 50vw"
                                            priority={index === 0}
                                        />
                                        {/* Badge */}
                                        <Box
                                            sx={{
                                                position: "absolute",
                                                top: { xs: 12, md: 24 },
                                                [isRtl ? "right" : "left"]: { xs: 12, md: 24 },
                                                backgroundColor: "rgba(255,255,255,0.96)",
                                                backdropFilter: "blur(12px)",
                                                px: { xs: 1.5, md: 2.5 },
                                                py: { xs: 0.6, md: 1.2 },
                                                borderRadius: "30px",
                                                display: "flex",
                                                alignItems: "center",
                                                gap: 0.8,
                                                boxShadow: "0 8px 24px rgba(0,0,0,0.10)",
                                                zIndex: 2,
                                            }}
                                        >
                                            {slide.icon}
                                            <Typography
                                                sx={{
                                                    color: "#1A1A1A",
                                                    fontWeight: 600,
                                                    fontSize: { xs: "0.62rem", md: "0.72rem" },
                                                    textTransform: "uppercase",
                                                    letterSpacing: "0.1em",
                                                    fontFamily: "'Montserrat', sans-serif",
                                                    lineHeight: 1,
                                                }}
                                            >
                                                {slide.badge || slide.title}
                                            </Typography>
                                        </Box>

                                        {/* Slide counter */}
                                        <Box
                                            sx={{
                                                position: "absolute",
                                                bottom: { xs: 12, md: 24 },
                                                [isRtl ? "left" : "right"]: { xs: 12, md: 24 },
                                                backgroundColor: "rgba(168,129,50,0.9)",
                                                px: 1.4,
                                                py: 0.4,
                                                borderRadius: "20px",
                                                zIndex: 2,
                                            }}
                                        >
                                            <Typography sx={{ color: "#FFFFFF", fontSize: { xs: "0.62rem", md: "0.72rem" }, fontFamily: "'Montserrat', sans-serif", fontWeight: 500 }}>
                                                {String(index + 1).padStart(2, "0")} / {String(t.slides.length).padStart(2, "0")}
                                            </Typography>
                                        </Box>
                                    </Box>

                                    {/* ── Text ── */}
                                    <Box
                                        sx={{
                                            flex: 1,
                                            display: "flex",
                                            flexDirection: "column",
                                            justifyContent: "center",
                                            p: { xs: 3, sm: 4, md: 6, lg: 7 },
                                            textAlign: isRtl ? "right" : "left",
                                        }}
                                    >
                                        {/* Eyebrow */}
                                        <Typography
                                            variant="overline"
                                            sx={{
                                                color: "#A88132",
                                                letterSpacing: "0.2em",
                                                fontWeight: 500,
                                                fontSize: { xs: "0.68rem", md: "0.72rem" },
                                                display: "block",
                                                mb: 1.5,
                                                fontFamily: "'Montserrat', sans-serif",
                                            }}
                                        >
                                            {slide.eyebrow || t.eyebrow}
                                        </Typography>

                                        {/* Title */}
                                        <Typography
                                            variant="h2"
                                            sx={{
                                                color: "#1A1A1A",
                                                fontSize: { xs: "1.5rem", sm: "2rem", md: "2.8rem" },
                                                fontWeight: 400,
                                                fontFamily: "'Playfair Display', serif",
                                                mb: { xs: 2, md: 3 },
                                                lineHeight: 1.2,
                                            }}
                                        >
                                            {slide.title}
                                        </Typography>

                                        {/* Subtitle */}
                                        <Typography
                                            sx={{
                                                color: "#4A4A4A",
                                                fontSize: { xs: "0.85rem", sm: "0.95rem", md: "1rem" },
                                                lineHeight: 1.75,
                                                fontWeight: 300,
                                                mb: { xs: 2.5, md: 4 },
                                                fontFamily: "'Montserrat', sans-serif",
                                            }}
                                        >
                                            {slide.subtitle}
                                        </Typography>

                                        {/* Poem — single paragraph, gold left border */}
                                        {slide.poem && (
                                            <Box
                                                sx={{
                                                    mb: { xs: 3.5, md: 5 },
                                                    pl: isRtl ? 0 : { xs: 2, md: 3 },
                                                    pr: isRtl ? { xs: 2, md: 3 } : 0,
                                                    borderLeft: isRtl ? "none" : "3px solid #A88132",
                                                    borderRight: isRtl ? "3px solid #A88132" : "none",
                                                }}
                                            >
                                                <Typography
                                                    sx={{
                                                        color: "#2A2A2A",
                                                        fontSize: { xs: "0.85rem", sm: "0.95rem", md: "1rem" },
                                                        lineHeight: 1.8,
                                                        fontWeight: 400,
                                                        fontStyle: "italic",
                                                        fontFamily: "'Playfair Display', serif",
                                                    }}
                                                >
                                                    {slide.poem}
                                                </Typography>
                                            </Box>
                                        )}

                                        {/* CTA */}
                                        <Box>
                                            <Button
                                                onClick={handleScroll}
                                                sx={{
                                                    backgroundColor: "#A88132",
                                                    color: "#FFFFFF",
                                                    py: { xs: 1.4, md: 1.6 },
                                                    px: { xs: 3, md: 4 },
                                                    fontSize: { xs: "0.78rem", md: "0.8rem" },
                                                    fontWeight: 600,
                                                    borderRadius: "50px",
                                                    textTransform: "uppercase",
                                                    letterSpacing: "0.15em",
                                                    fontFamily: "'Montserrat', sans-serif",
                                                    boxShadow: "0 8px 24px rgba(168,129,50,0.3)",
                                                    width: { xs: "100%", sm: "auto" },
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
                            </SwiperSlide>
                        ))}
                    </Swiper>
                </Box>
            </Box>
        </Box>
    );
};

export default CorporatePartnersSlider;
