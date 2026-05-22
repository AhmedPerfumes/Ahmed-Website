"use client";
import React, { useState, useEffect } from "react";
import { Box, Typography, Container, Stack } from "@mui/material";
import { motion, AnimatePresence } from "framer-motion";
import { useLocale, useTranslations } from "next-intl";
import { AccessTimeFilled, KeyboardArrowDown } from "@mui/icons-material";

const RamadanCountdown = ({ targetLink, isHomePage, isCheckout }) => {
    const locale = useLocale();
    const t = useTranslations();
    const isRtl = locale === "ar";

    const [timeLeft, setTimeLeft] = useState({
        hours: "00",
        minutes: "00",
        seconds: "00"
    });
    const [endDate, setEndDate] = useState(null);
    const [expired, setExpired] = useState(false);
    const [fetched, setFetched] = useState(false);

    // Fetch the discount end_date from the allProducts API
    useEffect(() => {
        const fetchEndDate = async () => {
            try {
                const response = await fetch(
                    `${process.env.NEXT_PUBLIC_API_URL}api/allProducts`,
                    {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ page: 1, limit: 6, discount_name: "ramadan-daily-offer" }),
                    }
                );
                const result = await response.json();
                const firstProduct = result?.data?.[0];
                const rawEndDate = firstProduct?.discount?.end_date;
                if (rawEndDate) {
                    setEndDate(new Date(rawEndDate));
                }
            } catch (err) {
                console.error("RamadanCountdown: failed to fetch end date", err);
            } finally {
                setFetched(true);
            }
        };
        fetchEndDate();
    }, []);

    // Countdown ticker — runs once endDate is resolved
    useEffect(() => {
        if (!endDate) return;

        const calculateTimeLeft = () => {
            const now = new Date();
            const diff = endDate - now;

            if (diff > 0) {
                const hours = Math.floor(diff / (1000 * 60 * 60));
                const minutes = Math.floor((diff / (1000 * 60)) % 60);
                const seconds = Math.floor((diff / 1000) % 60);

                setTimeLeft({
                    hours: hours.toString().padStart(2, "0"),
                    minutes: minutes.toString().padStart(2, "0"),
                    seconds: seconds.toString().padStart(2, "0")
                });
            } else {
                setExpired(true);
            }
        };

        const timer = setInterval(calculateTimeLeft, 1000);
        calculateTimeLeft();

        return () => clearInterval(timer);
    }, [endDate]);

    const TimerUnit = ({ value, label }) => (
        <Stack alignItems="center" spacing={0} sx={{ minWidth: { xs: "40px", md: "70px" } }}>
            <Box
                sx={{
                    background: "rgba(255, 255, 255, 0.05)",
                    backdropFilter: "blur(10px)",
                    border: "1px solid rgba(191, 149, 63, 0.3)",
                    borderRadius: "6px",
                    px: { xs: 1, md: 2 },
                    py: { xs: 0.5, md: 1 },
                    minWidth: "100%",
                    display: "flex",
                    justifyContent: "center",
                    boxShadow: "0 4px 15px rgba(0,0,0,0.05)"
                }}
            >
                <Typography
                    variant="h4"
                    sx={{
                        fontWeight: 700,
                        color: "#2C2416",
                        fontFamily: "monospace",
                        fontSize: { xs: "1rem", md: "1.8rem" },
                        letterSpacing: "1px"
                    }}
                >
                    {value}
                </Typography>
            </Box>
            <Typography
                variant="caption"
                sx={{
                    color: "#BF953F",
                    textTransform: "uppercase",
                    fontWeight: 700,
                    fontSize: { xs: "0.5rem", md: "0.6rem" },
                    letterSpacing: "0.1em",
                    mt: 0.2
                }}
            >
                {label}
            </Typography>
        </Stack>
    );

    // Hide if: still loading, no active discount, or offer has expired
    if (!fetched || expired || !endDate) return null;

    return (
        <Box
            component="section"
            id="ramadan-countdown"
            dir={isRtl ? "rtl" : "ltr"}
            sx={{
                py: { xs: 0, md: 0 }, // Vertical padding handled by flex items
                backgroundColor: "#ffffff",
                backgroundImage: `
                    linear-gradient(rgba(191, 149, 63, 0.08) 1.5px, transparent 1.5px),
                    linear-gradient(90deg, rgba(191, 149, 63, 0.08) 1.5px, transparent 1.5px)
                `,
                backgroundSize: "30px 30px",
                borderBottom: "1px solid rgba(191, 149, 63, 0.15)",
                position: "relative",
                overflow: "hidden",
            }}
        >
            <Stack direction={{ xs: "column", md: "row" }} sx={{ minHeight: { md: "180px" } }}>
                {/* Arrow Banner Left */}
                <Box
                    sx={{
                        position: "relative",
                        flex: { xs: "1 1 auto", md: "0 0 35%", lg: "0 0 40%" },
                        display: "flex",
                        alignItems: "center",
                        zIndex: 2,
                    }}
                >
                    {/* Gold Background Layer (Border Effect) */}
                    <Box
                        sx={{
                            position: "absolute",
                            inset: 0,
                            backgroundColor: "#BF953F",
                            clipPath: {
                                xs: "none",
                                md: isRtl
                                    ? "polygon(100% 0, 48px 0, 0 50%, 48px 100%, 100% 100%)"
                                    : "polygon(0 0, calc(100% - 48px) 0, 100% 50%, calc(100% - 48px) 100%, 0 100%)"
                            },
                        }}
                    />
                    {/* Main Dark Layer */}
                    <Box
                        sx={{
                            position: { xs: "relative", md: "absolute" },
                            inset: { md: isRtl ? "0 0 0 3px" : "0 3px 0 0" },
                            backgroundColor: "#0d0d0d",
                            backgroundImage: `
                                linear-gradient(rgba(191, 149, 63, 0.05) 1px, transparent 1px),
                                linear-gradient(90deg, rgba(191, 149, 63, 0.05) 1px, transparent 1px)
                            `,
                            backgroundSize: "20px 20px",
                            clipPath: {
                                xs: "none",
                                md: isRtl
                                    ? "polygon(100% 0, 50px 0, 3px 50%, 50px 100%, 100% 100%)"
                                    : "polygon(0 0, calc(100% - 50px) 0, calc(100% - 3px) 50%, calc(100% - 50px) 100%, 0 100%)"
                            },
                            display: "flex",
                            alignItems: "center",
                            justifyContent: { xs: "center", md: "flex-start" },
                            pl: { xs: 0, sm: 4, md: 6, lg: 10 },
                            pr: { xs: 0, sm: 4, md: isRtl ? 10 : 2 },
                            py: { xs: 1.5, md: 0 },
                            width: "100%",
                            height: { md: "100%" }
                        }}
                    >
                        <Typography
                            sx={{
                                color: "#BF953F",
                                fontWeight: 900,
                                textTransform: "uppercase",
                                fontSize: { xs: "0.7rem", sm: "1.2rem", md: "1.5rem" },
                                letterSpacing: "0.1em",
                                borderLeft: { xs: "none", md: "4px solid #BF953F" },
                                pl: { xs: 0, md: 2.5 },
                                textAlign: { xs: "center", md: "start" },
                                lineHeight: 1.1,
                                maxWidth: "300px",
                                pointerEvents: "none"
                            }}
                        >
                            {isCheckout ? t("Last Chance To Avail") : t("Everyday Eid Deals")}
                        </Typography>
                    </Box>
                </Box>

                {/* Countdown Content Right */}
                <Box
                    sx={{
                        flex: 1,
                        display: "flex",
                        alignItems: "center",
                        py: { xs: 2.5, md: 0 }
                    }}
                >
                    <Container maxWidth="lg">
                        <Stack
                            direction={{ xs: "column", sm: "row" }}
                            spacing={{ xs: 2, md: 4, lg: 6 }}
                            alignItems="center"
                            justifyContent="center"
                        >
                            {/* Title & Icon Group */}
                            <Stack
                                direction="row"
                                alignItems="center"
                                spacing={1.5}
                                sx={{ textAlign: { xs: "center", sm: "start" } }}
                            >
                                <motion.div
                                    animate={{ rotate: [0, 5, -5, 0] }}
                                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                                >
                                    <AccessTimeFilled sx={{ color: "#BF953F", fontSize: { xs: "1.8rem", md: "2.5rem" }, opacity: 0.8 }} />
                                </motion.div>
                                <Box>
                                    <Typography
                                        variant="overline"
                                        sx={{
                                            color: "#BF953F",
                                            fontWeight: 700,
                                            letterSpacing: isRtl ? "0" : "0.1em",
                                            display: "block",
                                            lineHeight: 1,
                                            mb: 0.2,
                                            fontSize: { xs: "0.6rem", md: "0.75rem" }
                                        }}
                                    >
                                        {t("Special Eid Offer")}
                                    </Typography>
                                    <Typography
                                        variant="h6"
                                        sx={{
                                            color: "#2C2416",
                                            fontWeight: 800,
                                            textTransform: "uppercase",
                                            fontSize: { xs: "0.8rem", md: "1.1rem" },
                                            lineHeight: 1.2
                                        }}
                                    >
                                        {t("Exclusive")}
                                    </Typography>
                                </Box>
                            </Stack>

                            {/* Timer Group - Forced LTR for Numbers */}
                            <Stack
                                direction="row"
                                spacing={{ xs: 1, md: 3 }}
                                dir="ltr"
                                sx={{ alignItems: "center" }}
                            >
                                <TimerUnit value={timeLeft.hours} label={t("Hours")} />
                                <Typography sx={{ fontSize: { xs: "1rem", md: "1.5rem" }, fontWeight: 700, color: "#BF953F", mb: 2 }}>:</Typography>
                                <TimerUnit value={timeLeft.minutes} label={t("Minutes")} />
                                <Typography sx={{ fontSize: { xs: "1rem", md: "1.5rem" }, fontWeight: 700, color: "#BF953F", mb: 2 }}>:</Typography>
                                <TimerUnit value={timeLeft.seconds} label={t("Seconds")} />
                            </Stack>

                            {/* CTA Arrow Button - Respects parent direction (rtl/ltr) */}
                            <motion.div
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                            >
                                <Box
                                    component="a"
                                    href={targetLink || "#ramadan-special-offers"}
                                    onClick={(e) => {
                                        if (targetLink) return; // Let default link behavior work
                                        e.preventDefault();
                                        const element = document.getElementById('ramadan-special-offers');
                                        if (element) {
                                            const offset = 80;
                                            const bodyRect = document.body.getBoundingClientRect().top;
                                            const elementRect = element.getBoundingClientRect().top;
                                            const elementPosition = elementRect - bodyRect;
                                            const offsetPosition = elementPosition - offset;

                                            window.scrollTo({
                                                top: offsetPosition,
                                                behavior: 'smooth'
                                            });
                                        }
                                    }}
                                    sx={{
                                        width: { xs: 32, md: 45 },
                                        height: { xs: 32, md: 45 },
                                        borderRadius: "50%",
                                        backgroundColor: "#BF953F",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        color: "white",
                                        boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
                                        transition: "all 0.3s ease",
                                        cursor: "pointer",
                                        "&:hover": {
                                            color: "#2C2416",
                                        }
                                    }}
                                >
                                    <KeyboardArrowDown sx={{ fontSize: { xs: "1.2rem", md: "1.5rem" } }} />
                                </Box>
                            </motion.div>
                        </Stack>
                    </Container>
                </Box>
            </Stack>
        </Box>
    );
};

export default RamadanCountdown;
