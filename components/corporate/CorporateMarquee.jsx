"use client";
import { Box } from "@mui/material";
import { useLocale } from "next-intl";

const companyLogos = [
    { id: 1, src: "/assets/Corporate Gift Sets/company1.png", alt: "Corporate Partner 1" },
    { id: 2, src: "/assets/Corporate Gift Sets/company2.png", alt: "Corporate Partner 2" },
    { id: 3, src: "/assets/Corporate Gift Sets/company3.png", alt: "Corporate Partner 3" },
    { id: 4, src: "/assets/Corporate Gift Sets/company4.png", alt: "Corporate Partner 4" },
    { id: 5, src: "/assets/Corporate Gift Sets/company5.png", alt: "Corporate Partner 5" },
    { id: 6, src: "/assets/Corporate Gift Sets/company6.png", alt: "Corporate Partner 6" },
    { id: 7, src: "/assets/Corporate Gift Sets/company7.png", alt: "Corporate Partner 7" },
    { id: 8, src: "/assets/Corporate Gift Sets/company8.png", alt: "Corporate Partner 8" },
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
                py: { xs: 5, md: 7 },
                backgroundColor: "#FAF8F5",
                overflow: "hidden",
                position: "relative",
            }}
        >
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
                        py: "10px",
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
