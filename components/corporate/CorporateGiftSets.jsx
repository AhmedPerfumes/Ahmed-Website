"use client";
import { Box, Container, Typography, Chip } from "@mui/material";
import { motion } from "framer-motion";
import Image from "next/image";
import { useLocale } from "next-intl";
import { useState } from "react";

const translations = {
    en: {
        eyebrow: "PREMIUM GIFTS FOR EVERY OCCASION",
        title: "Signature Gift Sets",
        subtitle: "Each gift is thoughtfully designed with premium perfumes, concentrated oils, bakhoor, candles, chocolates, and elegant accessories — beautifully presented to reflect appreciation, refinement, and care.",
        badge_new: "New",
        badge_popular: "Popular",
        badge_hajj: "Hajj & Umrah",
        badge_fathers: "Father's Day",
        learn_more: "View Collection",
        giftSets: [
            {
                id: 1,
                name: "Black Square Elite",
                description: "A statement of power and prestige. Our signature black gift box with curated fragrances for the distinguished executive.",
                image: "/assets/Corporate Gift Sets/corporate gift set black square 01.jpg.jpeg",
                badge: "Popular",
                badgeColor: "#BF953F",
            },
            {
                id: 2,
                name: "Beige Square Luxe",
                description: "Timeless elegance in warm ivory tones. Perfect for corporate milestones, partnerships, and VIP appreciation events.",
                image: "/assets/Corporate Gift Sets/corporate gift set beige square 01.jpg.jpeg",
                badge: "New",
                badgeColor: "#4CAF50",
            },
            {
                id: 3,
                name: "Mabroor Hajj & Umrah — Blue",
                description: "A blessed collection curated for pilgrimage season. Symbolizing purity and devotion, crafted for meaningful corporate gifting.",
                image: "/assets/Corporate Gift Sets/corporate gift set 0001.jpg.jpeg",
                badge: "Hajj & Umrah",
                badgeColor: "#1976D2",
            },
            {
                id: 4,
                name: "Mabroor Hajj & Umrah — Green",
                description: "Lush green packaging echoing the spirit of the holy land. Our most requested Ramadan and Hajj corporate collection.",
                image: "/assets/Corporate Gift Sets/corporate gift set 000122222.jpg.jpeg",
                badge: "Hajj & Umrah",
                badgeColor: "#2E7D32",
            },
            {
                id: 5,
                name: "Noor Al Ab — Father's Day",
                description: "Celebrate fathers with a luxury gift curated for men of distinction. Warm, rich, and deeply meaningful.",
                image: "/assets/Corporate Gift Sets/corporate gift set 05.jpg.jpeg",
                badge: "Father's Day",
                badgeColor: "#7B5EA7",
            },
            {
                id: 6,
                name: "Heart Shape Premium",
                description: "An expression of gratitude that goes beyond words. Ideal for client appreciation gifts and celebratory milestones.",
                image: "/assets/Corporate Gift Sets/corporate gift set heart shape 01.jpg.jpeg",
                badge: "Popular",
                badgeColor: "#BF953F",
            },
            {
                id: 7,
                name: "Beige Color Signature",
                description: "Understated luxury in soft beige tones. A refined choice for year-round corporate gifting and hospitality events.",
                image: "/assets/Corporate Gift Sets/corporate gift set beige color.jpg.jpeg",
                badge: "New",
                badgeColor: "#4CAF50",
            },
            {
                id: 8,
                name: "Grand Collection No. 5",
                description: "Our most prestigious multi-fragrance ensemble. The ultimate corporate statement piece for extraordinary occasions.",
                image: "/assets/Corporate Gift Sets/corporate gift set no 5.jpg.jpeg",
                badge: "Popular",
                badgeColor: "#BF953F",
            },
        ],
    },
    ar: {
        eyebrow: "هدايا فاخرة لكل مناسبة",
        title: "أطقم الهدايا المميزة",
        subtitle: "كل هدية مصممة بعناية بعطور فاخرة وزيوت مركزة وبخور وشموع وشوكولاتة وإكسسوارات أنيقة — مُقدَّمة بشكل جميل يعكس التقدير والرقي والاهتمام.",
        badge_new: "جديد",
        badge_popular: "الأكثر طلباً",
        badge_hajj: "حج وعمرة",
        badge_fathers: "يوم الأب",
        learn_more: "عرض المجموعة",
        giftSets: [
            {
                id: 1,
                name: "النخبة السوداء المربعة",
                description: "تجسيد للقوة والمكانة الرفيعة. صندوقنا الأسود الأنيق مع عطور مختارة لرجال الأعمال المتميزين.",
                image: "/assets/Corporate Gift Sets/corporate gift set black square 01.jpg.jpeg",
                badge: "الأكثر طلباً",
                badgeColor: "#BF953F",
            },
            {
                id: 2,
                name: "الفخامة البيج المربعة",
                description: "أناقة خالدة بألوان العاج الدافئة. مثالية للمناسبات المؤسسية والشراكات وفعاليات تكريم VIP.",
                image: "/assets/Corporate Gift Sets/corporate gift set beige square 01.jpg.jpeg",
                badge: "جديد",
                badgeColor: "#4CAF50",
            },
            {
                id: 3,
                name: "مبرور للحج والعمرة — أزرق",
                description: "مجموعة مباركة مصممة لموسم الحج. ترمز إلى النقاء والتقوى، مصنوعة للهدايا المؤسسية ذات المعنى العميق.",
                image: "/assets/Corporate Gift Sets/corporate gift set 0001.jpg.jpeg",
                badge: "حج وعمرة",
                badgeColor: "#1976D2",
            },
            {
                id: 4,
                name: "مبرور للحج والعمرة — أخضر",
                description: "التغليف الأخضر الغني يعكس روح الأرض المقدسة. مجموعتنا الأكثر طلباً في رمضان والحج.",
                image: "/assets/Corporate Gift Sets/corporate gift set 000122222.jpg.jpeg",
                badge: "حج وعمرة",
                badgeColor: "#2E7D32",
            },
            {
                id: 5,
                name: "نور الآب — يوم الأب",
                description: "احتفل بالآباء بهدية فاخرة مصممة للرجال المتميزين. دافئة وعميقة ومليئة بالمعاني.",
                image: "/assets/Corporate Gift Sets/corporate gift set 05.jpg.jpeg",
                badge: "يوم الأب",
                badgeColor: "#7B5EA7",
            },
            {
                id: 6,
                name: "شكل القلب الفاخر",
                description: "تعبير عن الامتنان يتجاوز الكلمات. مثالي لهدايا تقدير العملاء والمناسبات الاحتفالية.",
                image: "/assets/Corporate Gift Sets/corporate gift set heart shape 01.jpg.jpeg",
                badge: "الأكثر طلباً",
                badgeColor: "#BF953F",
            },
            {
                id: 7,
                name: "توقيع اللون البيج",
                description: "فخامة هادئة بأتون البيج الناعمة. خيار راقٍ للهدايا المؤسسية على مدار العام وفعاليات الضيافة.",
                image: "/assets/Corporate Gift Sets/corporate gift set beige color.jpg.jpeg",
                badge: "جديد",
                badgeColor: "#4CAF50",
            },
            {
                id: 8,
                name: "المجموعة الكبرى رقم ٥",
                description: "تجميعة عطورنا الأكثر فخامة. التعبير المؤسسي الأرقى للمناسبات الاستثنائية.",
                image: "/assets/Corporate Gift Sets/corporate gift set no 5.jpg.jpeg",
                badge: "الأكثر طلباً",
                badgeColor: "#BF953F",
            },
        ],
    },
};

const GiftSetCard = ({ set, index, isRtl }) => {
    const [hovered, setHovered] = useState(false);

    return (
        <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6, delay: (index % 4) * 0.1 }}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            style={{ height: "100%" }}
        >
            <Box
                sx={{
                    position: "relative",
                    borderRadius: "24px",
                    overflow: "hidden",
                    height: { xs: "280px", md: "420px" },
                    cursor: "pointer",
                    boxShadow: hovered
                        ? "0 30px 80px rgba(191,149,63,0.3), 0 0 0 2px rgba(191,149,63,0.6)"
                        : "0 10px 40px rgba(0,0,0,0.4)",
                    transition: "all 0.5s cubic-bezier(0.4,0,0.2,1)",
                    transform: hovered ? "translateY(-10px)" : "translateY(0)",
                }}
            >
                {/* Image */}
                <Image
                    src={set.image}
                    alt={set.name}
                    fill
                    style={{
                        objectFit: "cover",
                        transition: "transform 0.7s cubic-bezier(0.4,0,0.2,1)",
                        transform: hovered ? "scale(1.12)" : "scale(1)",
                    }}
                />

                {/* Gradient overlay */}
                <Box
                    sx={{
                        position: "absolute",
                        inset: 0,
                        background: hovered
                            ? "linear-gradient(to top, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.4) 50%, transparent 100%)"
                            : "linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.15) 60%, transparent 100%)",
                        transition: "background 0.5s ease",
                    }}
                />

                {/* Badge */}
                <Box
                    sx={{
                        position: "absolute",
                        top: 16,
                        [isRtl ? "left" : "right"]: 16,
                        zIndex: 2,
                    }}
                >
                    <Box
                        sx={{
                            background: set.badgeColor,
                            color: "#fff",
                            px: 2,
                            py: 0.5,
                            borderRadius: "20px",
                            fontSize: "0.65rem",
                            fontWeight: 700,
                            textTransform: "uppercase",
                            letterSpacing: "0.1em",
                            boxShadow: `0 4px 12px ${set.badgeColor}66`,
                        }}
                    >
                        {set.badge}
                    </Box>
                </Box>

                {/* Content */}
                <Box
                    sx={{
                        position: "absolute",
                        bottom: 0,
                        left: 0,
                        right: 0,
                        p: { xs: 2.5, md: 3.5 },
                        zIndex: 2,
                    }}
                >
                    {/* Gold accent line */}
                    <Box
                        sx={{
                            width: hovered ? "60px" : "40px",
                            height: "2px",
                            background: "linear-gradient(90deg, #BF953F, #FCF6BA)",
                            mb: 1.5,
                            transition: "width 0.4s ease",
                            borderRadius: "2px",
                        }}
                    />

                    <Typography
                        variant="h5"
                        sx={{
                            color: "#FFFFFF",
                            fontWeight: 700,
                            fontSize: { xs: "1rem", md: "1.25rem" },
                            fontFamily: "'Playfair Display', serif",
                            mb: 1,
                            textShadow: "0 2px 8px rgba(0,0,0,0.5)",
                            letterSpacing: "0.02em",
                        }}
                    >
                        {set.name}
                    </Typography>

                    <Box
                        sx={{
                            maxHeight: hovered ? "80px" : 0,
                            overflow: "hidden",
                            transition: "max-height 0.4s ease",
                        }}
                    >
                        <Typography
                            sx={{
                                color: "rgba(255,255,255,0.85)",
                                fontSize: { xs: "0.75rem", md: "0.88rem" },
                                lineHeight: 1.6,
                                fontWeight: 300,
                            }}
                        >
                            {set.description}
                        </Typography>
                    </Box>
                </Box>
            </Box>
        </motion.div>
    );
};

const CorporateGiftSets = () => {
    const locale = useLocale();
    const isRtl = locale === "ar";
    const t = translations[locale] || translations.en;

    return (
        <Box
            id="gift-sets"
            component="section"
            dir={isRtl ? "rtl" : "ltr"}
            sx={{
                py: { xs: 8, md: 14 },
                background: "linear-gradient(180deg, #0f0f0f 0%, #111111 50%, #0f0f0f 100%)",
                position: "relative",
                overflow: "hidden",
            }}
        >
            {/* Decorative BG element */}
            <Box
                sx={{
                    position: "absolute",
                    top: "20%",
                    left: "50%",
                    transform: "translateX(-50%)",
                    width: "800px",
                    height: "800px",
                    background: "radial-gradient(circle, rgba(191,149,63,0.06) 0%, transparent 70%)",
                    filter: "blur(100px)",
                    pointerEvents: "none",
                }}
            />

            <Container maxWidth="xl" sx={{ position: "relative", zIndex: 1 }}>
                {/* Header */}
                <Box sx={{ textAlign: "center", mb: { xs: 5, md: 8 } }}>
                    <Box
                        sx={{
                            width: "100px",
                            height: "2px",
                            background: "linear-gradient(90deg, transparent, #BF953F, transparent)",
                            margin: "0 auto 20px",
                        }}
                    />
                    <Typography
                        variant="overline"
                        sx={{
                            color: "#BF953F",
                            letterSpacing: "0.3em",
                            fontWeight: 600,
                            fontSize: { xs: "0.65rem", md: "0.8rem" },
                            display: "block",
                            mb: 2,
                        }}
                    >
                        {t.eyebrow}
                    </Typography>
                    <Typography
                        variant="h2"
                        sx={{
                            color: "#FFFFFF",
                            fontSize: { xs: "2rem", md: "3.5rem" },
                            fontWeight: 700,
                            fontFamily: "'Playfair Display', serif",
                            mb: 2,
                        }}
                    >
                        {t.title}
                    </Typography>
                    <Typography
                        sx={{
                            color: "rgba(255,255,255,0.5)",
                            fontSize: { xs: "0.85rem", md: "1.05rem" },
                            maxWidth: "600px",
                            mx: "auto",
                            lineHeight: 1.7,
                            fontWeight: 300,
                        }}
                    >
                        {t.subtitle}
                    </Typography>
                </Box>

                {/* Gift Sets Grid */}
                <Box
                    sx={{
                        display: "grid",
                        gridTemplateColumns: {
                            xs: "repeat(2, 1fr)",
                            sm: "repeat(2, 1fr)",
                            md: "repeat(4, 1fr)",
                        },
                        gap: { xs: 2, md: 3 },
                    }}
                >
                    {t.giftSets.map((set, index) => (
                        <GiftSetCard key={set.id} set={set} index={index} isRtl={isRtl} />
                    ))}
                </Box>
            </Container>
        </Box>
    );
};

export default CorporateGiftSets;
