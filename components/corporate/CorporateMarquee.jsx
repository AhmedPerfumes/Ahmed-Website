"use client";
import { Box, Container, Typography } from "@mui/material";
import { useLocale } from "next-intl";

const translations = {
    en: {
        subtitle: "TRUSTED BY LEADING ORGANIZATIONS",
        title: "Our Corporate Partners",
    },
    ar: {
        subtitle: "موثوق به من قِبل كبرى المؤسسات",
        title: "شركاؤنا في قطاع الأعمال",
    },
};

/* ─────────────────────────────────────────────────────────────
   Inline SVG logos — no network dependency, always renders
   ───────────────────────────────────────────────────────────── */
const partners = [
    {
        name: "Amazon",
        svg: (
            <svg viewBox="0 0 603 182" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ height: 36, width: "auto" }}>
                <path d="M372.5 143.3c-34.6 25.5-84.8 39.1-128 39.1-60.6 0-115.1-22.4-156.4-59.6-3.2-2.9-.3-6.9 3.5-4.6 44.6 25.9 99.7 41.5 156.6 41.5 38.4 0 80.6-7.9 119.5-24.5 5.8-2.6 10.7 3.8 4.8 8.1z" fill="#FF9900" />
                <path d="M385.8 127.9c-4.4-5.7-29.3-2.7-40.5-1.4-3.4.4-3.9-2.6-.9-4.7 19.8-13.9 52.3-9.9 56.1-5.2 3.8 4.7-1 37.3-19.6 52.8-2.9 2.4-5.6 1.1-4.3-2 4.2-10.5 13.6-34 9.2-39.5z" fill="#FF9900" />
                <path d="M346.5 20.4V7.7c0-1.9 1.4-3.1 3.1-3.1h55c1.8 0 3.2 1.3 3.2 3.1v10.9c0 1.8-1.5 4.1-4.1 7.7l-28.5 40.7c10.6-.3 21.8 1.3 31.4 6.7 2.2 1.2 2.7 3 2.9 4.8v13.6c0 1.8-2 3.9-4.1 2.8-17.1-9-39.8-10-58.7.1-1.9 1-4-.9-4-2.8V79.7c0-2 0-5.4 2.1-8.5l33-47.3h-28.7c-1.8 0-3.2-1.2-3.6-3.5zM123.7 94.7H109c-1.6-.1-2.9-1.3-3-2.9V8c0-1.8 1.5-3.2 3.3-3.2h13.8c1.7.1 3 1.4 3.1 3v11.1h.3c3.6-10.9 10.4-16 19.6-16 9.3 0 15.2 5.1 19.4 16 3.6-10.9 11.7-16 20.5-16 6.2 0 13 2.6 17.2 8.4 4.7 6.4 3.7 15.7 3.7 23.9v48.7c0 1.8-1.5 3.2-3.3 3.2h-14.6c-1.7-.1-3.1-1.5-3.1-3.2V45.3c0-3.2.3-11.2-.4-14.2-1.1-5.1-4.3-6.5-8.5-6.5-3.5 0-7.2 2.3-8.7 6-1.5 3.7-1.3 9.9-1.3 14.7v48.6c0 1.8-1.5 3.2-3.3 3.2h-14.6c-1.7-.1-3.1-1.5-3.1-3.2V45.3c0-9.8 1.6-24.2-8.9-24.2-10.7 0-10.3 14.1-10.3 24.2v48.6c-.1 1.8-1.6 3.2-3.3 3.2l-.1-.2zM449.7 4.6c22.1 0 34 19 34 43.1 0 23.3-13.2 41.9-34 41.9-21.7 0-33.5-19-33.5-42.6C416.2 23 428.2 4.6 449.7 4.6zm0 15.4c-10.9 0-11.6 14.9-11.6 24.1 0 9.3-.1 29.1 11.5 29.1 11.5 0 12-16 12-25.7 0-6.4-.3-14-2.2-20.1-1.7-5.3-5-7.4-9.7-7.4zM517.4 94.7h-14.6c-1.7-.1-3.1-1.5-3.1-3.2V7.8c.1-1.7 1.5-3 3.3-3h13.6c1.5.1 2.7 1 3.1 2.4v13.4h.3c4.1-11.9 9.9-17.5 20.1-17.5 6.6 0 13 2.4 17.2 8.9 3.8 6.1 3.8 16.3 3.8 23.7v48.5c-.2 1.6-1.6 2.9-3.3 2.9H543c-1.6-.1-2.9-1.3-3.1-2.9v-50c0-9.6 1.1-23.7-9.1-23.7-3.5 0-6.8 2.4-8.4 5.9-2 4.5-2.3 9-2.3 13.8v50.4c0 1.9-1.5 3.2-3.4 3.2l-.3-.2zM283.5 52.6c0 6.6.2 12.1-3.2 18-2.7 4.8-7 7.7-11.8 7.7-6.5 0-10.4-5-10.4-12.4 0-14.5 13-17.2 25.4-17.2v3.9zm17.2 41.5c-1.1 1-2.8 1.1-4.1.4-5.7-4.7-6.7-6.9-9.9-11.4-9.4 9.6-16.1 12.5-28.3 12.5-14.5 0-25.7-8.9-25.7-26.8 0-14 7.6-23.5 18.4-28.1 9.4-4.1 22.4-4.8 32.4-5.9V32c0-4.3.3-9.4-2.2-13.2-2.2-3.4-6.4-4.8-10.1-4.8-6.9 0-13 3.5-14.5 10.8-.3 1.6-1.5 3.2-3.1 3.3l-14.3-1.5c-1.5-.3-3.1-1.5-2.7-3.8C239.4 5.6 255.9 0 270.6 0c7.5 0 17.3 2 23.3 7.7 7.5 7 6.8 16.4 6.8 26.5v24c0 7.2 3 10.4 5.8 14.3 1 1.4 1.2 3.1-.1 4.2l-5.7 4.8v.6zM65.7 52.6c0 6.6.2 12.1-3.2 18-2.7 4.8-7 7.7-11.8 7.7-6.5 0-10.4-5-10.4-12.4 0-14.5 13-17.2 25.4-17.2v3.9zm17.2 41.5c-1.1 1-2.8 1.1-4.1.4C73.1 89.8 72 87.6 68.8 83.1c-9.4 9.6-16.1 12.5-28.3 12.5C26 95.6 14.7 86.7 14.7 68.8c0-14 7.6-23.5 18.4-28.1 9.4-4.1 22.5-4.8 32.4-5.9V32c0-4.3.3-9.4-2.2-13.2-2.2-3.4-6.4-4.8-10.1-4.8-6.9 0-13 3.5-14.5 10.8-.3 1.6-1.5 3.2-3.1 3.3L21.2 26.6c-1.5-.3-3.1-1.5-2.7-3.8C21.5 5.6 38 0 52.7 0c7.5 0 17.3 2 23.3 7.7 7.5 7 6.8 16.4 6.8 26.5v24c0 7.2 3 10.4 5.8 14.3 1 1.4 1.2 3.1-.1 4.2l-5.6 4.8v.6z" fill="#1A1A1A" />
            </svg>
        ),
        accent: "#FF9900",
    },





    
    {
        name: "Danube",
        svg: null,
        label: "DANUBE",
        accent: "#e31e24",
        subLabel: "PROPERTIES",
    },
    {
        name: "Emaar",
        svg: null,
        label: "EMAAR",
        accent: "#c8a96e",
        subLabel: "PROPERTIES",
    },
    {
        name: "Emirates NBD",
        svg: null,
        label: "Emirates",
        accent: "#C8102E",
        subLabel: "NBD",
    },
    {
        name: "Emirates",
        svg: (
            <svg viewBox="0 0 200 60" xmlns="http://www.w3.org/2000/svg" style={{ height: 40, width: "auto" }}>
                <text x="10" y="42" fontFamily="Georgia, serif" fontWeight="bold" fontSize="38" fill="#1a1a1a" letterSpacing="-1">Emirates</text>
                <rect x="10" y="48" width="165" height="3" fill="#C8102E" rx="1.5" />
            </svg>
        ),
        accent: "#C8102E",
    },
    {
        name: "DIB",
        svg: null,
        label: "DIB",
        accent: "#006838",
        subLabel: "DUBAI ISLAMIC BANK",
    },
    {
        name: "DAMAC",
        svg: null,
        label: "DAMAC",
        accent: "#b5872a",
        subLabel: "PROPERTIES",
    },
    {
        name: "ADCB",
        svg: null,
        label: "ADCB",
        accent: "#e31837",
        subLabel: "Abu Dhabi Commercial Bank",
    },
];

/* ── Single logo card ── */
const LogoCard = ({ partner }) => (
    <Box
        className="logo-card"
        sx={{
            display: "inline-flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            mx: { xs: "12px", md: "20px" },
            px: { xs: "20px", md: "32px" },
            minWidth: { xs: "130px", md: "190px" },
            height: { xs: "72px", md: "90px" },
            backgroundColor: "#FFFFFF",
            borderRadius: "12px",
            boxShadow: "0 10px 30px rgba(0,0,0,0.03)",
            border: "1px solid rgba(0,0,0,0.02)",
            flexShrink: 0,
            userSelect: "none",
            transition: "all 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
            "&:hover": {
                transform: "translateY(-4px)",
                boxShadow: "0 20px 40px rgba(0,0,0,0.06)",
                border: "1px solid rgba(0,0,0,0.05)",
            },
        }}
    >
        {partner.svg ? (
            /* Rendered SVG */
            <Box
                sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    opacity: 0.9,
                    transition: "opacity 0.3s",
                    ".logo-card:hover &": { opacity: 1 },
                }}
            >
                {partner.svg}
            </Box>
        ) : (
            /* Styled text fallback — always visible */
            <>
                <Typography
                    component="span"
                    sx={{
                        color: "#1A1A1A",
                        fontWeight: 900,
                        fontSize: { xs: "1.05rem", md: "1.3rem" },
                        letterSpacing: "0.08em",
                        lineHeight: 1,
                        fontFamily: "'Playfair Display', serif",
                        transition: "color 0.3s",
                        ".logo-card:hover &": { color: partner.accent || "#BF953F" },
                    }}
                >
                    {partner.label}
                </Typography>
                {partner.subLabel && (
                    <Typography
                        component="span"
                        sx={{
                            color: partner.accent || "#BF953F",
                            fontWeight: 600,
                            fontSize: { xs: "0.5rem", md: "0.6rem" },
                            letterSpacing: "0.18em",
                            lineHeight: 1,
                            mt: "3px",
                            textTransform: "uppercase",
                            opacity: 0.85,
                        }}
                    >
                        {partner.subLabel}
                    </Typography>
                )}
                {/* Bottom accent bar */}
                <Box
                    sx={{
                        width: "30px",
                        height: "2px",
                        background: partner.accent || "#BF953F",
                        borderRadius: "2px",
                        mt: "5px",
                        transition: "width 0.3s ease",
                        ".logo-card:hover &": { width: "50px" },
                    }}
                />
            </>
        )}
    </Box>
);

/* ── Main Component ── */
const CorporateMarquee = () => {
    const locale = useLocale();
    const isRtl = locale === "ar";
    const t = translations[locale] || translations.en;

    /*
     * Triple-duplicate so the loop is always seamless regardless
     * of viewport width. We translate -33.33% per cycle (one copy).
     */
    const allPartners = [...partners, ...partners, ...partners];

    return (
        <Box
            component="section"
            dir={isRtl ? "rtl" : "ltr"}
            sx={{
                py: { xs: 8, md: 12 },
                backgroundColor: "#FAF8F5",
                overflow: "hidden",
                position: "relative",
            }}
        >
            <Container maxWidth="xl" sx={{ position: "relative", zIndex: 1 }}>
                <Box sx={{ textAlign: "center", mb: { xs: 5, md: 8 } }}>
                    <Typography
                        variant="overline"
                        sx={{
                            color: "#A88132",
                            letterSpacing: "0.2em",
                            fontWeight: 500,
                            fontSize: { xs: "0.7rem", md: "0.85rem" },
                            display: "block",
                            mb: 1.5,
                            fontFamily: "'Montserrat', sans-serif",
                        }}
                    >
                        {t.subtitle}
                    </Typography>
                    <Typography
                        variant="h2"
                        sx={{
                            color: "#1A1A1A",
                            fontSize: { xs: "2rem", md: "3rem" },
                            fontWeight: 400,
                            fontFamily: "'Playfair Display', serif",
                        }}
                    >
                        {t.title}
                    </Typography>
                </Box>
            </Container>

            {/* ── Marquee track ── */}
            <Box
                sx={{
                    position: "relative",
                    overflow: "hidden",
                    /* Edge fade masks */
                    "&::before, &::after": {
                        content: '""',
                        position: "absolute",
                        top: 0,
                        bottom: 0,
                        width: { xs: "60px", md: "140px" },
                        zIndex: 2,
                        pointerEvents: "none",
                    },
                    "&::before": {
                        left: 0,
                        background: "linear-gradient(to right, #FAF8F5 0%, transparent 100%)",
                    },
                    "&::after": {
                        right: 0,
                        background: "linear-gradient(to left, #FAF8F5 0%, transparent 100%)",
                    },
                }}
            >
                {/* Inner track — the animation shifts exactly 1/3 of the total width
                    back to 0, creating a perfect infinite loop */}
                <Box
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        /* width = 3× the original set, so 1/3 = one full set */
                        width: "max-content",
                        animation: "corporate-marquee 28s linear infinite",
                        "@keyframes corporate-marquee": {
                            "0%": { transform: "translateX(0)" },
                            "100%": { transform: "translateX(-33.333%)" },
                        },
                        "&:hover": {
                            animationPlayState: "paused",
                        },
                        py: "8px",
                    }}
                >
                    {allPartners.map((partner, i) => (
                        <LogoCard key={i} partner={partner} />
                    ))}
                </Box>
            </Box>
        </Box>
    );
};

export default CorporateMarquee;
