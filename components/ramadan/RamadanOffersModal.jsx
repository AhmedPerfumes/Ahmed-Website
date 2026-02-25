"use client";
import { useState } from "react";
import { Box, Typography, Modal, IconButton } from "@mui/material";
import { motion, AnimatePresence } from "framer-motion";
import { useLocale, useTranslations } from "next-intl";
import { LocalShipping, CardGiftcard, Percent, Inventory, AccessTime, RateReview, Close } from "@mui/icons-material";
import Image from "next/image";

export default function RamadanOffersModal({ open, onClose }) {
    const t = useTranslations("RamadanModal");
    const locale = useLocale();
    const isRtl = locale === "ar";

    const offers = [
        {
            icon: LocalShipping,
            title: t("Offer1Title"),
            description: t("Offer1Desc")
        },
        {
            icon: CardGiftcard,
            title: t("Offer2Title"),
            description: t("Offer2Desc")
        },
        {
            icon: Inventory,
            title: t("Offer3Title"),
            description: t("Offer3Desc")
        },
        {
            icon: Percent,
            title: t("Offer4Title"),
            description: t("Offer4Desc")
        },
        {
            icon: AccessTime,
            title: t("Offer5Title"),
            description: t("Offer5Desc")
        },
        {
            icon: RateReview,
            title: t("Offer6Title"),
            description: t("Offer6Desc")
        }
    ];

    return (
        <Modal
            open={open}
            onClose={onClose}
            sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                backdropFilter: "blur(8px)",
                backgroundColor: "rgba(44, 36, 22, 0.7)"
            }}
        >
            <AnimatePresence>
                {open && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        transition={{ duration: 0.3 }}
                    >
                        <Box
                            dir={isRtl ? "rtl" : "ltr"}
                            sx={{
                                position: "relative",
                                background: "linear-gradient(180deg, #F5F1E8 0%, #EDE8DC 100%)",
                                border: "3px solid rgba(191, 149, 63, 0.4)",
                                borderRadius: "20px",
                                maxWidth: { xs: "95vw", md: "750px" },
                                maxHeight: "85vh",
                                overflow: "auto",
                                p: { xs: 2.5, md: 5 },
                                outline: "none",
                                boxShadow: "0 20px 60px rgba(191, 149, 63, 0.4)"
                            }}
                        >
                            {/* Close Button */}
                            <IconButton
                                onClick={onClose}
                                sx={{
                                    position: "absolute",
                                    top: { xs: 10, md: 15 },
                                    zIndex: 99,
                                    ...(isRtl ? { left: { xs: 10, md: 15 } } : { right: { xs: 10, md: 15 } }),
                                    color: "#8B6914",
                                    backgroundColor: "rgba(191, 149, 63, 0.1)",
                                    border: "2px solid rgba(191, 149, 63, 0.3)",
                                    "&:hover": {
                                        backgroundColor: "#BF953F",
                                        color: "#FFFFFF",
                                        borderColor: "#BF953F"
                                    }
                                }}
                            >
                                <Close fontSize={isRtl ? "medium" : "small"} />
                            </IconButton>

                            {/* Gold Glow Effect */}
                            <Box
                                sx={{
                                    position: "absolute",
                                    top: "50%",
                                    left: "50%",
                                    transform: "translate(-50%, -50%)",
                                    width: "400px",
                                    height: "400px",
                                    background: "radial-gradient(circle, rgba(191, 149, 63, 0.15) 0%, transparent 70%)",
                                    filter: "blur(80px)",
                                    zIndex: 0,
                                    pointerEvents: "none"
                                }}
                            />

                            {/* Content */}
                            <Box sx={{ position: "relative", zIndex: 1 }}>
                                {/* Header */}
                                <Box sx={{ textAlign: "center", mb: { xs: 2, md: 4 } }}>
                                    <Box
                                        sx={{
                                            width: { xs: "80px", md: "150px" },
                                            height: "4px",
                                            background: "linear-gradient(90deg, transparent, #BF953F, #D4AF37, #BF953F, transparent)",
                                            margin: "0 auto 15px",
                                            borderRadius: "2px"
                                        }}
                                    />

                                    <Typography
                                        variant="overline"
                                        sx={{
                                            color: "#8B6914",
                                            letterSpacing: "0.2em",
                                            fontWeight: 600,
                                            fontSize: { xs: "0.65rem", md: "0.9rem" },
                                            mb: 1,
                                            display: "block"
                                        }}
                                    >
                                        ☪ {t("CartHeader")} ☪
                                    </Typography>

                                    <Typography
                                        variant="h3"
                                        sx={{
                                            fontSize: { xs: "1.35rem", md: "2.5rem" },
                                            fontWeight: 700,
                                            fontFamily: "'Playfair Display', serif",
                                            background: "linear-gradient(135deg, #BF953F 0%, #8B6914 100%)",
                                            WebkitBackgroundClip: "text",
                                            WebkitTextFillColor: "transparent",
                                            mb: 1,
                                            letterSpacing: "0.01em"
                                        }}
                                    >
                                        {t("Title")}
                                    </Typography>

                                    <Typography
                                        variant="body2"
                                        sx={{
                                            color: "#5C4A3A",
                                            fontSize: { xs: "0.85rem", md: "1.1rem" },
                                            lineHeight: 1.4
                                        }}
                                    >
                                        {t("Subtext")}
                                    </Typography>
                                </Box>

                                {/* Offers Grid */}
                                <Box
                                    sx={{
                                        display: "grid",
                                        gridTemplateColumns: { xs: "repeat(2, 1fr)", sm: "repeat(2, 1fr)", md: "repeat(2, 1fr)" },
                                        gap: { xs: 1.5, md: 3 }
                                    }}
                                >
                                    {offers.map((offer, index) => {
                                        const IconComponent = offer.icon;
                                        return (
                                            <motion.div
                                                key={index}
                                                initial={{ opacity: 0, y: 20 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ duration: 0.5, delay: index * 0.1 }}
                                                whileHover={{ y: -5 }}
                                            >
                                                <Box
                                                    sx={{
                                                        background: "rgba(255, 255, 255, 0.7)",
                                                        backdropFilter: "blur(10px)",
                                                        border: "2px solid rgba(191, 149, 63, 0.3)",
                                                        borderRadius: "16px",
                                                        p: { xs: 2, md: 3 },
                                                        textAlign: "center",
                                                        transition: "all 0.3s ease",
                                                        height: "100%",
                                                        display: "flex",
                                                        flexDirection: "column",
                                                        alignItems: "center",
                                                        "&:hover": {
                                                            borderColor: "#BF953F",
                                                            background: "rgba(255, 255, 255, 0.9)",
                                                            boxShadow: "0 10px 30px rgba(191, 149, 63, 0.3)",
                                                            transform: "translateY(-3px)"
                                                        }
                                                    }}
                                                >
                                                    {/* Icon Circle */}
                                                    <Box
                                                        sx={{
                                                            width: { xs: "45px", md: "70px" },
                                                            height: { xs: "45px", md: "70px" },
                                                            borderRadius: "50%",
                                                            background: "linear-gradient(135deg, #BF953F 0%, #D4AF37 100%)",
                                                            display: "flex",
                                                            alignItems: "center",
                                                            justifyContent: "center",
                                                            mb: { xs: 1.5, md: 2 },
                                                            boxShadow: "0 8px 20px rgba(191, 149, 63, 0.4)"
                                                        }}
                                                    >
                                                        <IconComponent
                                                            sx={{
                                                                fontSize: { xs: "1.25rem", md: "2rem" },
                                                                color: "#FFFFFF"
                                                            }}
                                                        />
                                                    </Box>

                                                    {/* Title */}
                                                    <Typography
                                                        variant="h6"
                                                        sx={{
                                                            color: "#2C2416",
                                                            fontSize: { xs: "0.85rem", md: "1.2rem" },
                                                            fontWeight: 700,
                                                            mb: 0.5,
                                                            lineHeight: 1.2
                                                        }}
                                                    >
                                                        {offer.title}
                                                    </Typography>

                                                    {/* Description */}
                                                    <Typography
                                                        variant="body2"
                                                        sx={{
                                                            color: "#5C4A3A",
                                                            fontSize: { xs: "0.7rem", md: "0.95rem" },
                                                            lineHeight: 1.3
                                                        }}
                                                    >
                                                        {offer.description}
                                                    </Typography>
                                                </Box>
                                            </motion.div>
                                        );
                                    })}
                                </Box>
                            </Box>
                        </Box>
                    </motion.div>
                )}
            </AnimatePresence>
        </Modal>
    );
}
