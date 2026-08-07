"use client";
import { Box, Typography } from "@mui/material";
import { useLocale } from "next-intl";

const companyLogos = [
    { id: 0, src: "/assets/Corporate Gift Sets/company.jpeg", alt: "Corporate Partner" },
    { id: 1, src: "/assets/Corporate Gift Sets/company1.png", alt: "Corporate Partner 1" },
    { id: 2, src: "/assets/Corporate Gift Sets/company2.png", alt: "Corporate Partner 2" },
    { id: 3, src: "/assets/Corporate Gift Sets/company3.png", alt: "Corporate Partner 3" },
    { id: 4, src: "/assets/Corporate Gift Sets/company4.png", alt: "Corporate Partner 4" },
    { id: 5, src: "/assets/Corporate Gift Sets/company5.png", alt: "Corporate Partner 5" },
    { id: 6, src: "/assets/Corporate Gift Sets/company6.png", alt: "Corporate Partner 6" },
    { id: 7, src: "/assets/Corporate Gift Sets/company7.png", alt: "Corporate Partner 7" },
    { id: 8, src: "/assets/Corporate Gift Sets/company8.png", alt: "Corporate Partner 8" },
    { id: 9, src: "/assets/Corporate Gift Sets/company9.png", alt: "Corporate Partner 9" },
    { id: 10, src: "/assets/Corporate Gift Sets/company10.png", alt: "Corporate Partner 10" },
    { id: 11, src: "/assets/Corporate Gift Sets/company11.png", alt: "Corporate Partner 11" },
    { id: 12, src: "/assets/Corporate Gift Sets/company12.png", alt: "Corporate Partner 12" },
    { id: 13, src: "/assets/Corporate Gift Sets/company13.png", alt: "Corporate Partner 13" },
    // { id: 14, src: "/assets/Corporate Gift Sets/company14.jpeg", alt: "Corporate Partner 14" },
    { id: 15, src: "/assets/Corporate Gift Sets/company15.jpeg", alt: "Corporate Partner 15" },
    { id: 16, src: "/assets/Corporate Gift Sets/company16.jpeg", alt: "Corporate Partner 16" },
    { id: 17, src: "/assets/Corporate Gift Sets/company17.jpeg", alt: "Corporate Partner 17" },
    { id: 18, src: "/assets/Corporate Gift Sets/company18.jpeg", alt: "Corporate Partner 18" },
    { id: 19, src: "/assets/Corporate Gift Sets/company19.jpeg", alt: "Corporate Partner 19" },
    { id: 20, src: "/assets/Corporate Gift Sets/kn logo.png", alt: "Corporate Partner KN" },
];

const LogoCard = ({ logo }) => (
    <Box
        className="logo-card"
        sx={{
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            mx: { xs: "14px", md: "24px" },
            flexShrink: 0,
            userSelect: "none",
            transition: "transform 0.3s ease",
            "&:hover": {
                transform: "scale(1.08)",
            },
        }}
    >
        {/* Standard img tag for direct pixel-level CSS mixBlendMode & contrast filter */}
        <img
            src={logo.src}
            alt={logo.alt}
            style={{
                height: "160px",
                maxHeight: "180px",
                width: "auto",
                maxWidth: "380px",
                objectFit: "contain",
                mixBlendMode: "multiply",
                filter: "contrast(115%) brightness(98%)",
            }}
        />
    </Box>
);

const CorporateMarquee = () => {
    const locale = useLocale();
    const isRtl = locale === "ar";

    // Quadruple duplicate for seamless infinite scrolling loop
    const allLogos = [...companyLogos, ...companyLogos, ...companyLogos, ...companyLogos];

    return (
        <Box
            component="section"
            dir={isRtl ? "rtl" : "ltr"}
            sx={{
                py: { xs: 3, md: 5 },
                backgroundColor: "#FAF8F5",
                overflow: "hidden",
                position: "relative",
            }}
        >
            {/* ── Section Title ── */}
            <Box sx={{ textAlign: "center", mb: { xs: 2, md: 3 } }}>
                <Typography
                    variant="overline"
                    sx={{
                        color: "#A88132",
                        letterSpacing: "0.2em",
                        fontWeight: 500,
                        fontSize: { xs: "0.68rem", md: "0.75rem" },
                        display: "block",
                        mb: 0.5,
                        fontFamily: "'Montserrat', sans-serif",
                    }}
                >
                    {isRtl ? "موثوق بنا من قبل مؤسسات رائدة" : "TRUSTED BY LEADING ORGANIZATIONS"}
                </Typography>
                <Typography
                    variant="h4"
                    sx={{
                        color: "#1A1A1A",
                        fontSize: { xs: "1.2rem", md: "1.6rem" },
                        fontWeight: 400,
                        fontFamily: "'Playfair Display', serif",
                    }}
                >
                    {isRtl ? "شركاؤنا المؤسسيون الموقرون" : "Our Esteemed Corporate Partners"}
                </Typography>
            </Box>

            {/* ── Marquee track ── */}
            <Box
                sx={{
                    position: "relative",
                    overflow: "hidden",
                    // Edge fade masks
                    "&::before, &::after": {
                        content: '""',
                        position: "absolute",
                        top: 0,
                        bottom: 0,
                        width: { xs: "50px", md: "120px" },
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
                <Box
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        width: "max-content",
                        animation: "corporate-marquee 24s linear infinite",
                        "@keyframes corporate-marquee": {
                            "0%": { transform: "translateX(0)" },
                            "100%": { transform: "translateX(-25%)" },
                        },
                        "&:hover": {
                            animationPlayState: "paused",
                        },
                        py: "5px",
                    }}
                >
                    {allLogos.map((logo, i) => (
                        <LogoCard key={i} logo={logo} />
                    ))}
                </Box>
            </Box>
        </Box>
    );
};

export default CorporateMarquee;
