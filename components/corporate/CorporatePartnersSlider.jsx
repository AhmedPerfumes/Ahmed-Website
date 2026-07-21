"use client";
import { Box, Container, Typography, Grid, Button } from "@mui/material";
import { motion } from "framer-motion";
import { useLocale } from "next-intl";
import Image from "next/image";
import BusinessCenterIcon from "@mui/icons-material/BusinessCenter";
import FlightTakeoffIcon from "@mui/icons-material/FlightTakeoff";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";

const translations = {
    en: {
        eyebrow: "TRUSTED PARTNERS",
        cta: "Partner With Us",
        slides: [
            {
                id: "airline",
                title: "Travel Collection",
                subtitle: "Luxury Travel Packs for Airlines, Hotels & the Travel Industry. Crafted for airlines, luxury hotels, travel companies, and hospitality partners, the Ahmed Al Maghribi Travel Collection is designed to elevate every voyage with elegance, comfort, and unforgettable aromas.",
                image: "/assets/Corporate Gift Sets/corporate gift set 05.jpg.jpeg",
                icon: <FlightTakeoffIcon sx={{ fontSize: "1.2rem", color: "#A88132" }} />,
                partners: [],
                poem: "Fly with grace, arrive in style,\nCarry a fragrance every mile.\nFrom sky to shore, from dawn till night,\nA scent that makes each journey bright.\n\nPack the aroma, carry the cheer,\nCreating memories far and near.\nWhere every voyage finds its art,\nA lasting fragrance, a lasting heart."
            },
            {
                id: "airline",
                title: "Travel Collection",
                subtitle: "Luxury Travel Packs for Airlines, Hotels & the Travel Industry. Crafted for airlines, luxury hotels, travel companies, and hospitality partners, the Ahmed Al Maghribi Travel Collection is designed to elevate every voyage with elegance, comfort, and unforgettable aromas.",
                image: "/assets/Corporate Gift Sets/corporate gift set 05.jpg.jpeg",
                icon: <FlightTakeoffIcon sx={{ fontSize: "1.2rem", color: "#A88132" }} />,
                partners: [],
                poem: "Fly with grace, arrive in style,\nCarry a fragrance every mile.\nFrom sky to shore, from dawn till night,\nA scent that makes each journey bright.\n\nPack the aroma, carry the cheer,\nCreating memories far and near.\nWhere every voyage finds its art,\nA lasting fragrance, a lasting heart."
            },
            {
                id: "diwali",
                title: "Diwali Collection",
                subtitle: "Illuminate Every Bond with the Essence of Diwali. As countless lamps brighten every home, may every fragrance awaken joy, prosperity, and togetherness. This Diwali, celebrate the festival of lights with the timeless elegance of Ahmed Al Maghribi Perfumes. Our luxurious fragrance collections are thoughtfully curated to express gratitude, strengthen relationships, and create unforgettable moments with clients, employees, family, and friends. Each exquisite perfume is a symbol of warmth, success, and new beginnings—wrapped in festive elegance and crafted to leave a lasting impression long after the celebrations have ended.",
                image: "/assets/Corporate Gift Sets/corporate gift set 05.jpg.jpeg",
                icon: <AccountBalanceIcon sx={{ fontSize: "1.2rem", color: "#A88132" }} />,
                partners: [],
                poem: "This Diwali, gift more than a fragrance—\ngift a blessing, a memory, and an experience that lingers beautifully."
            }
        ]
    },
    ar: {
        eyebrow: "شركاء موثوقون",
        cta: "كن شريكاً لنا",
        slides: [
            {
                id: "airline",
                title: "مجموعة سفر أحمد المغربي",
                subtitle: "باقات سفر فاخرة لشركات الطيران والفنادق وقطاع السفر. صُممت مجموعة سفر أحمد المغربي لترتقي بكل رحلة بالأناقة والراحة والعطور التي لا تُنسى.",
                image: "/assets/Corporate Gift Sets/corporate gift set 05.jpg.jpeg",
                icon: <FlightTakeoffIcon sx={{ fontSize: "1.2rem", color: "#A88132" }} />,
                partners: [],
                poem: "سافر برقي، وصِل بأناقة،\nاحمل عطراً في كل ميل.\nمن السماء إلى الشاطئ، من الفجر حتى الليل،\nرائحة تجعل كل رحلة مشرقة.\n\nاحزم العطر، احمل البهجة،\nنصنع ذكريات قريبة وبعيدة.\nحيث تجد كل رحلة فنها،\nرائحة تدوم، وقلب يدوم."
            },
            {
                id: "national-day",
                title: "مجموعة اليوم الوطني الإماراتي الخاصة",
                subtitle: "هدية الفخر. عطر الوحدة. مغلفة بألوان علم الإمارات الزاهية الأحمر والأخضر والأبيض والأسود، تحتفل مجموعة اليوم الوطني من أحمد المغربي بروح أمة بُنيت على الوحدة والرؤية والتميز. احتفل بهذه المناسبة مع أطقم هدايا مخصصة بشكل جميل، صُممت لتكريم الموظفين والعملاء والشركاء والأحباء بالأناقة الخالدة لعطور أحمد المغربي.",
                image: "/assets/Corporate Gift Sets/national.jpeg",
                icon: <BusinessCenterIcon sx={{ fontSize: "1.2rem", color: "#A88132" }} />,
                partners: [],
                poem: "عطر يدوم، فخر أمة،\nمع الأمل والأحلام دليلنا الدائم.\nفي كل زجاجة، تتكشف قصة،\nعن ذكريات غالية أثمن من الذهب."
            },
            {
                id: "diwali",
                title: "مجموعة عطور ديوالي",
                subtitle: "أضئ كل رابط بجوهر ديوالي. كما تضيء المصابيح التي لا تعد ولا تحصى كل منزل، نتمنى أن يوقظ كل عطر الفرح والازدهار والعمل الجماعي. احتفل بمهرجان الأضواء في ديوالي مع الأناقة الخالدة لعطور أحمد المغربي. مجموعات العطور الفاخرة لدينا منسقة بعناية للتعبير عن الامتنان وتعزيز العلاقات وخلق لحظات لا تُنسى مع العملاء والموظفين والعائلة والأصدقاء. كل عطر رائع هو رمز للدفء والنجاح والبدايات الجديدة - مغلف بأناقة احتفالية ومصمم ليترك انطباعاً يدوم طويلاً بعد انتهاء الاحتفالات.",
                image: "/assets/Corporate Gift Sets/Diwali.jpeg",
                icon: <AccountBalanceIcon sx={{ fontSize: "1.2rem", color: "#A88132" }} />,
                partners: [],
                poem: "في ديوالي هذا، أهدِ أكثر من مجرد عطر -\nأهدِ بركة وذكرى وتجربة تدوم بجمال."
            }
        ]
    }
};

const CorporatePartnersSlider = () => {
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
                py: { xs: 8, md: 14 },
                backgroundColor: "#FAF8F5", // Slight contrast from pure white sections
                position: "relative",
                overflow: "hidden",
            }}
        >
            <Container maxWidth="xl" sx={{ position: "relative", zIndex: 1 }}>

                {/* Section Header */}
                <Box sx={{ textAlign: "center", mb: { xs: 6, md: 10 } }}>
                    <Typography variant="overline" sx={{ color: "#A88132", letterSpacing: "0.2em", fontWeight: 500, fontSize: "0.75rem", display: "block", mb: 2, fontFamily: "'Montserrat', sans-serif" }}>
                        {t.eyebrow}
                    </Typography>
                    <Typography variant="h2" sx={{ color: "#1A1A1A", fontSize: { xs: "2rem", md: "3rem" }, fontWeight: 400, fontFamily: "'Playfair Display', serif", mb: 2 }}>
                        {isRtl ? "مجموعات الشركاء" : "Partner Collections"}
                    </Typography>
                    <Box sx={{ width: "40px", height: "2px", backgroundColor: "#A88132", mx: "auto" }} />
                </Box>

                <Box sx={{
                    borderRadius: "20px",
                    overflow: "hidden",
                    backgroundColor: "#FFFFFF",
                    boxShadow: "0 20px 60px rgba(0,0,0,0.04)",
                    position: "relative",
                    "& .swiper-button-next, & .swiper-button-prev": {
                        color: "#FFFFFF",
                        width: "50px",
                        height: "50px",
                        backgroundColor: "#A88132",
                        borderRadius: "50%",
                        boxShadow: "0 8px 25px rgba(168,129,50,0.4)",
                        transition: "all 0.3s ease",
                        "&::after": {
                            fontSize: "1.2rem",
                            fontWeight: 900
                        },
                        "&:hover": {
                            backgroundColor: "#8C6A29",
                            transform: "scale(1.1)",
                        }
                    },
                    "& .swiper-button-next": {
                        right: { xs: "10px", md: "24px" }
                    },
                    "& .swiper-button-prev": {
                        left: { xs: "10px", md: "24px" }
                    }
                }}>
                    <Swiper
                        modules={[Autoplay, Navigation]}
                        navigation={true}
                        speed={1000}
                        spaceBetween={0}
                        autoplay={{
                            delay: 4000,
                            disableOnInteraction: false,
                        }}
                        loop={true}
                        dir={isRtl ? "rtl" : "ltr"}
                        key={isRtl ? "rtl" : "ltr"}
                        style={{ width: "100%" }}
                    >
                        {t.slides.map((slide, index) => (
                            <SwiperSlide key={index}>
                                <Grid container>

                                    {/* Image Column */}
                                    <Grid item xs={12} md={6}>
                                        <Box
                                            sx={{
                                                position: "relative",
                                                height: "100%",
                                                minHeight: { xs: "350px", md: "600px" },
                                                "&::before": {
                                                    content: '""',
                                                    position: "absolute",
                                                    top: 0, left: 0, right: 0, bottom: 0,
                                                    backgroundColor: "rgba(0,0,0,0.03)",
                                                    zIndex: 1,
                                                }
                                            }}
                                        >
                                            <Image
                                                src={slide.image}
                                                alt={slide.title}
                                                fill
                                                style={{ objectFit: "cover" }}
                                                sizes="(max-width: 900px) 100vw, 50vw"
                                                priority={index === 0}
                                            />

                                            {/* Floating Badge */}
                                            <Box sx={{
                                                position: "absolute",
                                                top: 30,
                                                [isRtl ? "right" : "left"]: 30,
                                                backgroundColor: "rgba(255,255,255,0.95)",
                                                backdropFilter: "blur(10px)",
                                                px: 2.5, py: 1.5,
                                                borderRadius: "30px",
                                                display: "flex", alignItems: "center", gap: 1.5,
                                                boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
                                                zIndex: 2,
                                            }}>
                                                {slide.icon}
                                                <Typography sx={{ color: "#1A1A1A", fontWeight: 600, fontSize: "0.8rem", textTransform: "uppercase", letterSpacing: "0.1em", fontFamily: "'Montserrat', sans-serif", mt: "2px" }}>
                                                    {slide.title}
                                                </Typography>
                                            </Box>
                                        </Box>
                                    </Grid>

                                    {/* Text Column */}
                                    <Grid item xs={12} md={6}>
                                        <Box sx={{
                                            p: { xs: 4, md: 8, lg: 10 },
                                            display: "flex",
                                            flexDirection: "column",
                                            justifyContent: "center",
                                            height: "100%"
                                        }}>
                                            <Typography variant="overline" sx={{ color: "#A88132", letterSpacing: "0.2em", fontWeight: 500, fontSize: "0.75rem", display: "block", mb: 2, fontFamily: "'Montserrat', sans-serif" }}>
                                                {t.eyebrow}
                                            </Typography>

                                            <Typography variant="h2" sx={{ color: "#1A1A1A", fontSize: { xs: "2.2rem", md: "3.2rem" }, fontWeight: 400, fontFamily: "'Playfair Display', serif", mb: 3, lineHeight: 1.15 }}>
                                                {slide.title}
                                            </Typography>

                                            <Typography sx={{ color: "#4A4A4A", fontSize: { xs: "0.95rem", md: "1.05rem" }, lineHeight: 1.8, fontWeight: 300, mb: 5, fontFamily: "'Montserrat', sans-serif" }}>
                                                {slide.subtitle}
                                            </Typography>

                                            {slide.poem && (
                                                <Box sx={{
                                                    mb: 6,
                                                    pl: isRtl ? 0 : 3,
                                                    pr: isRtl ? 3 : 0,
                                                    borderLeft: isRtl ? "none" : "3px solid #A88132",
                                                    borderRight: isRtl ? "3px solid #A88132" : "none"
                                                }}>
                                                    <Typography sx={{
                                                        color: "#1A1A1A",
                                                        fontSize: { xs: "0.95rem", md: "1.05rem" },
                                                        lineHeight: 1.8,
                                                        fontWeight: 400,
                                                        fontStyle: "italic",
                                                        fontFamily: "'Playfair Display', serif",
                                                        whiteSpace: "pre-line"
                                                    }}>
                                                        {slide.poem}
                                                    </Typography>
                                                </Box>
                                            )}

                                            {slide.partners && slide.partners.length > 0 && (
                                                <Box sx={{ display: "flex", flexDirection: "column", gap: 2.5, mb: 6 }}>
                                                    {slide.partners.map((partner, idx) => (
                                                        <Box key={idx} sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                                                            <Box sx={{
                                                                width: "24px", height: "24px",
                                                                borderRadius: "50%",
                                                                backgroundColor: "rgba(168,129,50,0.1)",
                                                                display: "flex", alignItems: "center", justifyContent: "center",
                                                                flexShrink: 0
                                                            }}>
                                                                <Box sx={{ width: "6px", height: "6px", borderRadius: "50%", backgroundColor: "#A88132" }} />
                                                            </Box>
                                                            <Typography sx={{ color: "#1A1A1A", fontWeight: 500, fontSize: "1rem", fontFamily: "'Montserrat', sans-serif" }}>
                                                                {partner}
                                                            </Typography>
                                                        </Box>
                                                    ))}
                                                </Box>
                                            )}

                                            <Box>
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
                                        </Box>
                                    </Grid>

                                </Grid>
                            </SwiperSlide>
                        ))}
                    </Swiper>
                </Box>
            </Container>
        </Box>
    );
};

export default CorporatePartnersSlider;
