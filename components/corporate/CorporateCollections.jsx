"use client";
import { Box, Container, Typography } from "@mui/material";
import { useLocale } from "next-intl";
import Image from "next/image";

const collections = [
    {
        id: "womens-day",
        titleEn: "Women's Day Collection",
        titleAr: "مجموعة يوم المرأة",
        desc1En: "Celebrating the strength, grace, and elegance of every woman.",
        desc1Ar: "احتفال بقوة ونعمة وأناقة كل امرأة.",
        desc2En: "This Women's Day, honour the inspiring women in your life with the timeless elegance of Ahmed Al Maghribi Perfumes. A gift that reflects her beauty, resilience, and unyielding spirit.",
        desc2Ar: "في يوم المرأة، كرم النساء الملهمات في حياتك مع الأناقة الخالدة لعطور أحمد المغربي. هدية تعكس جمالها ومرونتها وروحها التي لا تلين.",
        poemEn: "A lasting aroma, a lasting grace,\nHer strength and beauty time cannot erase.\nEvery fragrance tells a story true,\nOf the endless wonder that is you.",
        poemAr: "رائحة تدوم، نعمة تدوم،\nقوتها وجمالها لا يمحوه الزمان.\nكل عطر يروي قصة حقيقية،\nعن العجب الذي لا ينتهي وهو أنت.",
        image: "/assets/Corporate Gift Sets/corporate gift set 05.jpg.jpeg",
        bg: "#FFFFFF",
    },
    {
        id: "mothers-day",
        titleEn: "Mother's Day Collection",
        titleAr: "مجموعة عيد الأم",
        desc1En: "A mother's love is life's sweetest perfume, pure, endless, and unforgettable.",
        desc1Ar: "حب الأم هو أجمل عطر في الحياة, نقي ولا نهاية له ولا يُنسى.",
        desc2En: "For someone you love, cherish, and simply cannot imagine life without... A gift that speaks when words fall silent.",
        desc2Ar: "لشخص تحبه وتعتز به ولا يمكنك تخيل الحياة بدونه... هدية تتحدث عندما تعجز الكلمات.",
        poemEn: "A lasting fragrance, a love so bright,\nHer endless warmth, her guiding light.\nThrough every season, through every breeze,\nHer love remains with effortless ease\n\nA Lasting Aroma. A Lasting Bond.\nFor the One You Love Beyond Words.",
        poemAr: "عطر يدوم، حب مشرق،\nدفئها الذي لا ينتهي، ونورها الهادي.\nعبر كل الفصول، وعبر كل نسيم،\nيبقى حبها بكل سهولة ويُسر\n\nرائحة تدوم. رابط يدوم.\nلمن تحبها بصدق يفوق الكلمات.",
        image: "/assets/Corporate Gift Sets/mothersday.jpeg",
        bg: "#FAF8F5",
    },
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
        image: "/assets/Corporate Gift Sets/fathersday.jpeg",
        bg: "#FFFFFF",
    },
    {
        id: "teachers-day",
        titleEn: "Teacher's Day Collection",
        titleAr: "مجموعة يوم المعلم",
        desc1En: "A Fragrance of Gratitude for Every Guiding Heart",
        desc1Ar: "عطر الامتنان لكل قلب مرشد",
        desc2En: "This Teacher's Day, honour the mentors who shape minds and touch lives with the timeless elegance of Ahmed Al Maghribi Perfumes, a gift that reflects respect, appreciation, and heartfelt gratitude.",
        desc2Ar: "في يوم المعلم، كرم المرشدين الذين يبنون العقول ويلامسون القلوب بأناقة عطور أحمد المغربي الخالدة, هدية تعكس الاحترام والتقدير والامتنان الصادق.",
        poemEn: "They teach with wisdom, lead with grace,\nLeaving hope in every place.\nTheir words inspire, their lessons stay,\nLighting countless hearts each day\n\nHonouring Every Teacher. Celebrating Every Lesson.\nA Lasting Aroma for a Lasting Inspiration.",
        poemAr: "يعلمون بحكمة، ويقودون بنعمة،\nيتركون الأمل في كل مكان.\nتلهم كلماتهم، وتبقى دروسهم،\nتضيء قلوباً لا حصر لها كل يوم\n\nتكريم لكل معلم. احتفال بكل درس.\nرائحة تدوم لإلهام يدوم.",
        image: "/assets/Corporate Gift Sets/teachersday.jpeg",
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
    {
        id: "national-day",
        titleEn: "National Day Collection",
        titleAr: "مجموعة اليوم الوطني",
        desc1En: "A Gift of Pride. A Fragrance of Unity.",
        desc1Ar: "هدية الفخر. عطر الوحدة.",
        desc2En: "Wrapped in the vibrant Red, Green, White, and Black of the UAE National Flag, the Ahmed Al Maghribi National Day Collection celebrates the spirit of a nation built on unity, vision, and excellence. Celebrate the occasion with beautifully customized gift sets, crafted to honour employees, clients, partners, and loved ones with the timeless elegance of Ahmed Al Maghribi Perfumes.",
        desc2Ar: "مغلفة بألوان علم الإمارات الزاهية الأحمر والأخضر والأبيض والأسود، تحتفل مجموعة اليوم الوطني من أحمد المغربي بروح أمة بُنيت على الوحدة والرؤية والتميز. احتفل بهذه المناسبة مع أطقم هدايا مخصصة بشكل جميل، صُممت لتكريم الموظفين والعملاء والشركاء والأحباء بالأناقة الخالدة لعطور أحمد المغربي.",
        poemEn: "A lasting fragrance, a nation's pride,\nWith hope and dreams forever our guide.\nIn every bottle, a story unfolds,\nOf treasured memories more precious than gold.",
        poemAr: "عطر يدوم، فخر أمة،\nمع الأمل والأحلام دليلنا الدائم.\nفي كل زجاجة، تتكشف قصة،\nعن ذكريات غالية أثمن من الذهب.",
        image: "/assets/Corporate Gift Sets/NationalDay.jpeg",
        bg: "#FAF8F5",
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
                <Box sx={{ textAlign: "center", pt: { xs: 8, sm: 10, md: 16 }, pb: { xs: 6, sm: 8, md: 12 } }}>
                    <Typography
                        variant="overline"
                        sx={{
                            color: "#A88132",
                            letterSpacing: "0.2em",
                            fontWeight: 500,
                            fontSize: { xs: "0.7rem", md: "0.75rem" },
                            display: "block",
                            mb: 1.5,
                            fontFamily: "'Montserrat', sans-serif",
                        }}
                    >
                        {isRtl ? "توزيعات حصرية" : "EXCLUSIVE CURATIONS"}
                    </Typography>
                    <Typography
                        variant="h2"
                        sx={{
                            color: "#1A1A1A",
                            fontSize: { xs: "1.8rem", sm: "2.4rem", md: "3.5rem" },
                            fontWeight: 400,
                            fontFamily: "'Playfair Display', serif",
                            mb: 2.5,
                        }}
                    >
                        {isRtl ? "مجموعاتنا المخصصة" : "Celebrations"}
                    </Typography>
                    <Box sx={{ width: "40px", height: "2px", backgroundColor: "#A88132", mx: "auto", mb: 2 }} />
                    <Typography sx={{
                        color: "#999999",
                        fontSize: { xs: "0.78rem", md: "0.85rem" },
                        fontFamily: "'Montserrat', sans-serif",
                        fontWeight: 400,
                        mt: 1.5,
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
                            top: {
                                xs: `${55 + index * 8}px`,
                                sm: `${70 + index * 12}px`,
                                md: `${STACK_TOP_BASE + index * STACK_OFFSET}px`,
                            },
                            zIndex: index + 1,
                            mb: index < collections.length - 1 ? { xs: 3, sm: 4, md: 6 } : 0,
                        }}
                    >
                        <Container maxWidth="xl" sx={{ px: { xs: 2, sm: 3, md: 4 } }}>
                            {/* Card */}
                            <Box
                                sx={{
                                    backgroundColor: item.bg,
                                    borderRadius: { xs: "16px", sm: "20px", md: "24px" },
                                    overflow: "hidden",
                                    boxShadow: `0 ${6 + index * 2}px ${30 + index * 15}px rgba(0,0,0,${0.04 + index * 0.01})`,
                                    display: "flex",
                                    flexDirection: { xs: "column", md: "row" },
                                    minHeight: { xs: "auto", md: "65vh", lg: "70vh" },
                                    border: "1px solid rgba(0,0,0,0.05)",
                                }}
                            >
                                {/* Image */}
                                <Box
                                    sx={{
                                        width: { xs: "100%", md: "45%" },
                                        position: "relative",
                                        minHeight: { xs: "200px", sm: "260px", md: "auto" },
                                        height: { xs: "220px", sm: "280px", md: "auto" },
                                        flexShrink: 0,
                                    }}
                                >
                                    <Image
                                        src={item.image}
                                        alt={isRtl ? item.titleAr : item.titleEn}
                                        fill
                                        style={{ objectFit: "cover", objectPosition: "center" }}
                                        sizes="(max-width: 900px) 100vw, 45vw"
                                    />
                                    {/* Counter badge */}
                                    <Box sx={{
                                        position: "absolute",
                                        top: { xs: 14, md: 24 },
                                        [isRtl ? "right" : "left"]: { xs: 14, md: 24 },
                                        backgroundColor: "rgba(255,255,255,0.94)",
                                        backdropFilter: "blur(10px)",
                                        px: { xs: 1.5, md: 2 },
                                        py: { xs: 0.5, md: 0.8 },
                                        borderRadius: "30px",
                                        boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                                    }}>
                                        <Typography sx={{
                                            color: "#A88132",
                                            fontFamily: "'Playfair Display', serif",
                                            fontSize: { xs: "0.75rem", md: "0.85rem" },
                                            fontWeight: 500,
                                        }}>
                                            {String(index + 1).padStart(2, "0")} / {String(collections.length).padStart(2, "0")}
                                        </Typography>
                                    </Box>
                                </Box>

                                {/* Text */}
                                <Box
                                    sx={{
                                        flex: 1,
                                        p: { xs: 3, sm: 5, md: 7, lg: 9 },
                                        display: "flex",
                                        flexDirection: "column",
                                        justifyContent: "center",
                                        textAlign: isRtl ? "right" : "left",
                                    }}
                                >
                                    <Typography
                                        variant="h3"
                                        sx={{
                                            color: "#1A1A1A",
                                            fontSize: { xs: "1.4rem", sm: "1.8rem", md: "2.4rem" },
                                            fontWeight: 400,
                                            fontFamily: "'Playfair Display', serif",
                                            mb: { xs: 2, md: 3.5 },
                                            lineHeight: 1.25,
                                        }}
                                    >
                                        {isRtl ? item.titleAr : item.titleEn}
                                    </Typography>

                                    <Box sx={{ display: "flex", flexDirection: "column", gap: { xs: 1.5, md: 2.5 }, mb: { xs: 3, md: 4.5 } }}>
                                        <Typography sx={{
                                            color: "#333333",
                                            fontSize: { xs: "0.88rem", sm: "0.95rem", md: "1.05rem" },
                                            lineHeight: 1.7,
                                            fontWeight: 400,
                                            fontFamily: "'Montserrat', sans-serif",
                                        }}>
                                            {isRtl ? item.desc1Ar : item.desc1En}
                                        </Typography>
                                        <Typography sx={{
                                            color: "#555555",
                                            fontSize: { xs: "0.84rem", sm: "0.9rem", md: "1rem" },
                                            lineHeight: 1.7,
                                            fontWeight: 300,
                                            fontFamily: "'Montserrat', sans-serif",
                                        }}>
                                            {isRtl ? item.desc2Ar : item.desc2En}
                                        </Typography>
                                    </Box>

                                    {/* Poem */}
                                    <Box sx={{
                                        pl: isRtl ? 0 : { xs: 2, md: 3 },
                                        pr: isRtl ? { xs: 2, md: 3 } : 0,
                                        borderLeft: isRtl ? "none" : "2px solid rgba(168,129,50,0.4)",
                                        borderRight: isRtl ? "2px solid rgba(168,129,50,0.4)" : "none",
                                    }}>
                                        <Typography sx={{
                                            color: "#2A2A2A",
                                            fontSize: { xs: "0.85rem", sm: "0.95rem", md: "1.05rem" },
                                            lineHeight: 1.8,
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
            <Box sx={{ height: { xs: "40px", sm: "60px", md: "120px" } }} />
        </Box>
    );
};

export default CorporateCollections;
