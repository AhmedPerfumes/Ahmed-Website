"use client";
import { Box, Container, Typography } from "@mui/material";
import { useLocale } from "next-intl";
import Image from "next/image";

const collections = [
    {
        id: "fathers-day",
        titleEn: "Father's Day Collection",
        titleAr: "مجموعة عيد الأب",
        desc1En: "A father's love is steadfast, his guidance everlasting, and his presence unforgettable.",
        desc1Ar: "حب الأب ثابت، وتوجيهاته خالدة، وحضوره لا يُنسى.",
        desc2En: "This Father's Day, honour the man whose strength inspires and whose love never fades with the timeless elegance of Ahmed Al Maghribi Perfumes.",
        desc2Ar: "في عيد الأب هذا، كرم الرجل الذي تلهم قوته وحبه الذي لا يتلاشى مع الأناقة الخالدة لعطور أحمد المغربي.",
        poemEn: "A lasting aroma, a lasting embrace,\nA father's love, beyond time and space.\nEvery fragrance tells a story true,\nOf cherished moments shared with you.",
        poemAr: "رائحة تدوم، عناق يدوم،\nحب الأب يتجاوز الزمان والمكان.\nكل عطر يروي قصة حقيقية،\nعن لحظات غالية شاركناها معك.",
        image: "/assets/Corporate Gift Sets/corporate gift set 000122222.jpg.jpeg",
        bg: "#FFFFFF",
    },
    {
        id: "mothers-day",
        titleEn: "Mother's Day Collection",
        titleAr: "مجموعة عيد الأم",
        desc1En: "A mother's love is life's sweetest perfume—pure, endless, and unforgettable.",
        desc1Ar: "حب الأم هو أجمل عطر في الحياة - نقي ولا نهاية له ولا يُنسى.",
        desc2En: "For someone you love, cherish, and simply cannot imagine life without... A gift that speaks when words fall silent.",
        desc2Ar: "لشخص تحبه وتعتز به ولا يمكنك تخيل الحياة بدونه... هدية تتحدث عندما تعجز الكلمات.",
        poemEn: "A lasting fragrance, a love so bright,\nHer endless warmth, her guiding light.\nThrough every season, through every breeze,\nHer love remains with effortless ease\n\nA Lasting Aroma. A Lasting Bond.\nFor the One You Love Beyond Words.",
        poemAr: "عطر يدوم، حب مشرق،\nدفئها الذي لا ينتهي، ونورها الهادي.\nعبر كل الفصول، وعبر كل نسيم،\nيبقى حبها بكل سهولة ويُسر\n\nرائحة تدوم. رابط يدوم.\nلمن تحبها بصدق يفوق الكلمات.",
        image: "/assets/Corporate Gift Sets/corporate gift set heart shape 01.jpg.jpeg",
        bg: "#FAF8F5",
    },
    {
        id: "hajj-umrah",
        titleEn: "Hajj & Umrah Collection",
        titleAr: "مجموعة الحج والعمرة",
        desc1En: "A Journey of Faith. A Gift of Blessings.",
        desc1Ar: "رحلة الإيمان. هدية البركات.",
        desc2En: "Featuring our signature perfumes and premium attars, elegantly presented in bespoke gift boxes, each collection is a meaningful keepsake for pilgrims, loved ones, and guests.",
        desc2Ar: "تضم عطورنا المميزة والأدهان الفاخرة، معروضة بأناقة في صناديق هدايا مخصصة، كل مجموعة تعد تذكاراً قيماً للحجاج والأحباء والضيوف.",
        poemEn: "From Makkah's light to Madinah's grace,\nMay peace and mercy your heart embrace.\nWith every aroma, memories remain,\nA sacred journey lived again",
        poemAr: "من نور مكة إلى فضل المدينة،\nعسى أن يغمر السلام والرحمة قلبك.\nمع كل عطر، تبقى الذكريات،\nرحلة مقدسة تعاش من جديد",
        image: "/assets/Corporate Gift Sets/corporate gift set beige color.jpg.jpeg",
        bg: "#FFFFFF",
    },
    {
        id: "teachers-day",
        titleEn: "Teacher's Day Collection",
        titleAr: "مجموعة يوم المعلم",
        desc1En: "A Fragrance of Gratitude for Every Guiding Heart",
        desc1Ar: "عطر الامتنان لكل قلب مرشد",
        desc2En: "This Teacher's Day, honour the mentors who shape minds and touch lives with the timeless elegance of Ahmed Al Maghribi Perfumes—a gift that reflects respect, appreciation, and heartfelt gratitude.",
        desc2Ar: "في يوم المعلم، كرم المرشدين الذين يبنون العقول ويلامسون القلوب بأناقة عطور أحمد المغربي الخالدة - هدية تعكس الاحترام والتقدير والامتنان الصادق.",
        poemEn: "They teach with wisdom, lead with grace,\nLeaving hope in every place.\nTheir words inspire, their lessons stay,\nLighting countless hearts each day\n\nHonouring Every Teacher. Celebrating Every Lesson.\nA Lasting Aroma for a Lasting Inspiration.",
        poemAr: "يعلمون بحكمة، ويقودون بنعمة،\nيتركون الأمل في كل مكان.\nتلهم كلماتهم، وتبقى دروسهم،\nتضيء قلوباً لا حصر لها كل يوم\n\nتكريم لكل معلم. احتفال بكل درس.\nرائحة تدوم لإلهام يدوم.",
        image: "/assets/Corporate Gift Sets/corporate gift set 05.jpg.jpeg",
        bg: "#FAF8F5",
    },
    {
        id: "childrens-day",
        titleEn: "Children's Day Collection",
        titleAr: "مجموعة يوم الطفل",
        desc1En: "A child's smile is the purest joy, their laughter the sweetest melody, and their dreams the brightest light.",
        desc1Ar: "ابتسامة الطفل هي أنقى فرح، وضحكاته أجمل لحن، وأحلامه أسطع نور.",
        desc2En: "Celebrate the innocence, love, tender care, curiosity, and boundless imagination of childhood with the delightful fragrances of Ahmed Al Maghribi Perfumes.",
        desc2Ar: "احتفل ببراءة الطفولة والحب والرعاية الفائقة والفضول والخيال الذي لا حدود له مع العطور المبهجة من أحمد المغربي.",
        poemEn: "Tiny hearts, big dreams,\nBrighter than the sun's warm beams.\nEvery smile, a precious treasure,\nEvery hug, a joy beyond measure.",
        poemAr: "قلوب صغيرة، أحلام كبيرة،\nأكثر إشراقاً من أشعة الشمس الدافئة.\nكل ابتسامة كنز ثمين،\nكل عناق فرح لا يقاس.",
        image: "/assets/Corporate Gift Sets/corporate gift set black square 01.jpg.jpeg",
        bg: "#FFFFFF",
    },
];

const STACK_TOP_BASE = 80;
const STACK_OFFSET = 16;

const CorporateCollections = () => {
    const locale = useLocale();
    const isRtl = locale === "ar";

    return (
        <Box
            component="section"
            dir={isRtl ? "rtl" : "ltr"}
            sx={{ backgroundColor: "#FFFFFF", position: "relative" }}
        >
            {/* Section Header */}
            <Container maxWidth="xl">
                <Box sx={{ textAlign: "center", pt: { xs: 10, md: 16 }, pb: { xs: 8, md: 12 } }}>
                    <Typography
                        variant="overline"
                        sx={{
                            color: "#A88132",
                            letterSpacing: "0.2em",
                            fontWeight: 500,
                            fontSize: "0.75rem",
                            display: "block",
                            mb: 2,
                            fontFamily: "'Montserrat', sans-serif",
                        }}
                    >
                        {isRtl ? "توزيعات حصرية" : "EXCLUSIVE CURATIONS"}
                    </Typography>
                    <Typography
                        variant="h2"
                        sx={{
                            color: "#1A1A1A",
                            fontSize: { xs: "2.5rem", md: "3.5rem" },
                            fontWeight: 400,
                            fontFamily: "'Playfair Display', serif",
                            mb: 3,
                        }}
                    >
                        {isRtl ? "مجموعاتنا المخصصة" : "Our Bespoke Collections"}
                    </Typography>
                    <Box sx={{ width: "40px", height: "2px", backgroundColor: "#A88132", mx: "auto", mb: 2 }} />
                    <Typography sx={{
                        color: "#999999",
                        fontSize: "0.85rem",
                        fontFamily: "'Montserrat', sans-serif",
                        fontWeight: 400,
                        mt: 2,
                        letterSpacing: "0.05em",
                    }}>
                        {isRtl ? "تمرير للأسفل لاستكشاف المجموعات" : "Scroll to explore each collection"}
                    </Typography>
                </Box>
            </Container>

            {/* Stacking Cards */}
            <Box sx={{ position: "relative" }}>
                {collections.map((item, index) => (
                    <Box
                        key={item.id}
                        sx={{
                            position: "sticky",
                            top: `${STACK_TOP_BASE + index * STACK_OFFSET}px`,
                            zIndex: index + 1,
                            mb: index < collections.length - 1 ? { xs: 4, md: 6 } : 0,
                        }}
                    >
                        <Container maxWidth="xl">
                            {/* Card */}
                            <Box
                                sx={{
                                    backgroundColor: item.bg,
                                    borderRadius: "20px",
                                    overflow: "hidden",
                                    boxShadow: `0 ${8 + index * 3}px ${40 + index * 20}px rgba(0,0,0,${0.05 + index * 0.015})`,
                                    display: "flex",
                                    flexDirection: { xs: "column", md: "row" },
                                    minHeight: { xs: "auto", md: "70vh" },
                                    border: "1px solid rgba(0,0,0,0.04)",
                                }}
                            >
                                {/* Image */}
                                <Box
                                    sx={{
                                        width: { xs: "100%", md: "45%" },
                                        order: { xs: 0, md: 0 },
                                        position: "relative",
                                        minHeight: { xs: "260px", md: "auto" },
                                        flexShrink: 0,
                                    }}
                                >
                                    <Image
                                        src={item.image}
                                        alt={isRtl ? item.titleAr : item.titleEn}
                                        fill
                                        style={{ objectFit: "cover" }}
                                        sizes="(max-width: 900px) 100vw, 45vw"
                                    />
                                    {/* Counter badge */}
                                    <Box sx={{
                                        position: "absolute",
                                        top: 24,
                                        left: 24,
                                        backgroundColor: "rgba(255,255,255,0.92)",
                                        backdropFilter: "blur(10px)",
                                        px: 2,
                                        py: 0.8,
                                        borderRadius: "30px",
                                    }}>
                                        <Typography sx={{
                                            color: "#A88132",
                                            fontFamily: "'Playfair Display', serif",
                                            fontSize: "0.85rem",
                                            fontWeight: 400,
                                        }}>
                                            {String(index + 1).padStart(2, "0")} / {String(collections.length).padStart(2, "0")}
                                        </Typography>
                                    </Box>
                                </Box>

                                {/* Text */}
                                <Box
                                    sx={{
                                        flex: 1,
                                        p: { xs: 4, md: 7, lg: 9 },
                                        display: "flex",
                                        flexDirection: "column",
                                        justifyContent: "center",
                                        order: { xs: 1, md: 1 },
                                        textAlign: isRtl ? "right" : "left",
                                    }}
                                >
                                    <Typography
                                        variant="h3"
                                        sx={{
                                            color: "#1A1A1A",
                                            fontSize: { xs: "1.8rem", md: "2.5rem" },
                                            fontWeight: 400,
                                            fontFamily: "'Playfair Display', serif",
                                            mb: 4,
                                            lineHeight: 1.2,
                                        }}
                                    >
                                        {isRtl ? item.titleAr : item.titleEn}
                                    </Typography>

                                    <Box sx={{ display: "flex", flexDirection: "column", gap: 2.5, mb: 5 }}>
                                        <Typography sx={{
                                            color: "#333333",
                                            fontSize: { xs: "0.95rem", md: "1.05rem" },
                                            lineHeight: 1.8,
                                            fontWeight: 400,
                                            fontFamily: "'Montserrat', sans-serif",
                                        }}>
                                            {isRtl ? item.desc1Ar : item.desc1En}
                                        </Typography>
                                        <Typography sx={{
                                            color: "#555555",
                                            fontSize: { xs: "0.9rem", md: "1rem" },
                                            lineHeight: 1.8,
                                            fontWeight: 300,
                                            fontFamily: "'Montserrat', sans-serif",
                                        }}>
                                            {isRtl ? item.desc2Ar : item.desc2En}
                                        </Typography>
                                    </Box>

                                    {/* Poem */}
                                    <Box sx={{
                                        pl: isRtl ? 0 : 3,
                                        pr: isRtl ? 3 : 0,
                                        borderLeft: isRtl ? "none" : "2px solid rgba(168,129,50,0.3)",
                                        borderRight: isRtl ? "2px solid rgba(168,129,50,0.3)" : "none",
                                    }}>
                                        <Typography sx={{
                                            color: "#2A2A2A",
                                            fontSize: { xs: "0.95rem", md: "1.05rem" },
                                            lineHeight: 2,
                                            fontWeight: 400,
                                            fontStyle: "italic",
                                            fontFamily: "'Playfair Display', serif",
                                            whiteSpace: "pre-line",
                                        }}>
                                            {isRtl ? item.poemAr : item.poemEn}
                                        </Typography>
                                    </Box>
                                </Box>
                            </Box>
                        </Container>
                    </Box>
                ))}
            </Box>

            {/* Bottom padding */}
            <Box sx={{ height: { xs: "60px", md: "120px" } }} />
        </Box>
    );
};

export default CorporateCollections;
