"use client";
import { Box, Container, Typography, Button, TextField, Grid, Snackbar, Alert, MenuItem } from "@mui/material";
import { motion } from "framer-motion";
import { useLocale } from "next-intl";
import { useState } from "react";
import EmailIcon from "@mui/icons-material/Email";
import PhoneIcon from "@mui/icons-material/Phone";
import BusinessIcon from "@mui/icons-material/Business";
import CardGiftcardIcon from "@mui/icons-material/CardGiftcard";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import WorkspacePremiumIcon from "@mui/icons-material/WorkspacePremium";
import HandshakeIcon from "@mui/icons-material/Handshake";

const CONTACT_EMAIL = "corporate@ahmedalmaghribi.com";
const CONTACT_PHONE = "+971 55 864 7854";
const CONTACT_WHATSAPP = "971558647854";

const translations = {
    en: {
        eyebrow: "CORPORATE INQUIRY",
        title: "Let's Create Something Memorable",
        subtitle:
            "Let us help you create a thoughtful gifting experience for your clients, employees, partners, or event guests.",
        dept_title: "Corporate Gifting Department",
        fields: {
            name: "Name",
            company: "Company Name",
            email: "Email",
            phone: "Phone",
            occasion: "Occasion / Requirement",
            quantity: "Quantity",
            budget: "Budget Range (AED)",
            message: "Message",
        },
        quantities: ["10–50", "50–100", "100–300", "300–500", "500–1,000", "1,000+"],
        occasions: [
            "Ramadan & Eid",
            "UAE National Day",
            "Teacher's Day and Children's Day",
            "Women's Day",
            "Mother's Day",
            "Father's Day",
            "Company Anniversary",
            "Employee Welcome Kits",
            "Event Giveaways",
            "Government & Institutional Gifts",
            "Other",
        ],
        budgets: ["Under AED 5,000", "AED 5,000–15,000", "AED 15,000–50,000", "AED 50,000–100,000", "AED 100,000+"],
        submit: "Send Inquiry",
        whatsapp: "WhatsApp Us",
        success: "Your inquiry has been received! Our corporate gifting team will be in touch within 24 hours.",
        why_title: "Why Ahmed Al Maghribi?",
        why_items: [
            { icon: <CardGiftcardIcon sx={{ color: "#A88132", fontSize: "1.8rem" }} />, title: "Custom Branding", desc: "Personalized packaging with your company logo, custom messages, and occasion-based designs" },
            { icon: <LocalShippingIcon sx={{ color: "#A88132", fontSize: "1.8rem" }} />, title: "Reliable Delivery", desc: "Bulk delivery across the UAE within 3–5 business days, on time every time" },
            { icon: <WorkspacePremiumIcon sx={{ color: "#A88132", fontSize: "1.8rem" }} />, title: "Authentic Quality", desc: "Premium perfumes, concentrated oils, bakhoor, candles, and chocolates crafted to the highest standards" },
            { icon: <HandshakeIcon sx={{ color: "#A88132", fontSize: "1.8rem" }} />, title: "Dedicated Support", desc: "A dedicated corporate account manager assigned to every client from inquiry to delivery" },
        ],
    },
    ar: {
        eyebrow: "استفسار مؤسسي",
        title: "لنصنع شيئاً لا يُنسى",
        subtitle:
            "دعنا نساعدك في إنشاء تجربة هدايا مدروسة لعملائك وموظفيك وشركائك أو ضيوف فعالياتك.",
        dept_title: "قسم الهدايا المؤسسية",
        fields: {
            name: "الاسم",
            company: "اسم الشركة",
            email: "البريد الإلكتروني",
            phone: "الهاتف",
            occasion: "المناسبة / المتطلب",
            quantity: "الكمية",
            budget: "نطاق الميزانية (درهم)",
            message: "الرسالة",
        },
        quantities: ["١٠–٥٠", "٥٠–١٠٠", "١٠٠–٣٠٠", "٣٠٠–٥٠٠", "٥٠٠–١٠٠٠", "أكثر من ١٠٠٠"],
        occasions: [
            "رمضان وعيد الفطر والأضحى",
            "اليوم الوطني الإماراتي",
            "ديوالي وعيد الميلاد",
            "يوم المرأة",
            "يوم الأم",
            "يوم الأب",
            "ذكرى الشركة السنوية",
            "أطقم ترحيب بالموظفين",
            "هدايا الفعاليات",
            "هدايا حكومية ومؤسسية",
            "أخرى",
        ],
        budgets: ["أقل من ٥٠٠٠ درهم", "٥٠٠٠–١٥٠٠٠ درهم", "١٥٠٠٠–٥٠٠٠٠ درهم", "٥٠٠٠٠–١٠٠٠٠٠ درهم", "أكثر من ١٠٠٠٠٠ درهم"],
        submit: "إرسال الاستفسار",
        whatsapp: "تواصل عبر واتساب",
        success: "تم استلام استفسارك! سيتواصل معك فريق الهدايا المؤسسية خلال ٢٤ ساعة.",
        why_title: "لماذا أحمد المغربي؟",
        why_items: [
            { icon: <CardGiftcardIcon sx={{ color: "#A88132", fontSize: "1.8rem" }} />, title: "علامة تجارية مخصصة", desc: "تغليف مخصص بشعار شركتك ورسائل مخصصة وتصاميم حسب المناسبة" },
            { icon: <LocalShippingIcon sx={{ color: "#A88132", fontSize: "1.8rem" }} />, title: "توصيل موثوق", desc: "توصيل بالجملة في جميع أنحاء الإمارات خلال ٣–٥ أيام عمل، في الموعد دائماً" },
            { icon: <WorkspacePremiumIcon sx={{ color: "#A88132", fontSize: "1.8rem" }} />, title: "جودة أصيلة", desc: "عطور فاخرة وزيوت مركزة وبخور وشموع وشوكولاتة مصنوعة وفق أعلى المعايير" },
            { icon: <HandshakeIcon sx={{ color: "#A88132", fontSize: "1.8rem" }} />, title: "دعم متخصص", desc: "مدير حساب مؤسسي مخصص لكل عميل من الاستفسار حتى التسليم" },
        ],
    },
};

const inputSx = {
    "& .MuiOutlinedInput-root": {
        color: "#1A1A1A",
        background: "rgba(0,0,0,0.02)",
        borderRadius: "8px",
        fontFamily: "'Montserrat', sans-serif",
        "& fieldset": { borderColor: "transparent" },
        "&:hover fieldset": { borderColor: "rgba(0,0,0,0.1)" },
        "&.Mui-focused fieldset": { borderColor: "#A88132" },
    },
    "& .MuiInputLabel-root": {
        color: "rgba(0,0,0,0.5)",
        fontFamily: "'Montserrat', sans-serif",
        fontWeight: 400,
        "&.Mui-focused": { color: "#A88132" },
    },
    "& .MuiSelect-icon": { color: "rgba(0,0,0,0.5)" },
};

const menuProps = {
    PaperProps: {
        sx: {
            background: "#FFFFFF",
            border: "1px solid rgba(0,0,0,0.05)",
            borderRadius: "8px",
            boxShadow: "0 10px 40px rgba(0,0,0,0.08)",
            "& .MuiMenuItem-root": {
                color: "#1A1A1A",
                fontSize: "0.9rem",
                fontFamily: "'Montserrat', sans-serif",
                "&:hover": { background: "rgba(0,0,0,0.02)" },
                "&.Mui-selected": { background: "rgba(168,129,50,0.1)" },
            },
        },
    },
};

const CorporateContact = () => {
    const locale = useLocale();
    const isRtl = locale === "ar";
    const t = translations[locale] || translations.en;
    const [snackOpen, setSnackOpen] = useState(false);
    const [form, setForm] = useState({
        name: "", company: "", email: "", phone: "",
        occasion: "", quantity: "", budget: "", message: "",
    });

    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

    const handleSubmit = (e) => {
        e.preventDefault();
        // Build mailto string
        const subject = encodeURIComponent(`Corporate Gifting Inquiry — ${form.company || form.name}`);
        const body = encodeURIComponent(
            `Name: ${form.name}\nCompany: ${form.company}\nEmail: ${form.email}\nPhone: ${form.phone}\nOccasion: ${form.occasion}\nQuantity: ${form.quantity}\nBudget: ${form.budget}\n\nMessage:\n${form.message}`
        );
        window.location.href = `mailto:${CONTACT_EMAIL}?subject=${subject}&body=${body}`;
        setSnackOpen(true);
        setForm({ name: "", company: "", email: "", phone: "", occasion: "", quantity: "", budget: "", message: "" });
    };

    return (
        <Box
            component="section"
            id="corporate-inquiry"
            dir={isRtl ? "rtl" : "ltr"}
            sx={{
                py: { xs: 8, md: 14 },
                backgroundColor: "#FAF8F5",
                position: "relative",
                overflow: "hidden",
            }}
        >

            <Container maxWidth="xl" sx={{ position: "relative", zIndex: 1 }}>
                <Grid container spacing={{ xs: 4, md: 8 }} alignItems="flex-start">

                    {/* ── LEFT: Header + Contact Info + Why Us ── */}
                    <Grid item xs={12} md={5}>
                        <motion.div
                            initial={{ opacity: 0, x: isRtl ? 40 : -40 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8 }}
                        >
                            <Box sx={{ mb: { xs: 1, md: 2 } }}>
                                <Typography variant="overline" sx={{ color: "#A88132", letterSpacing: "0.2em", fontWeight: 500, fontSize: "0.75rem", display: "block", mb: 2, fontFamily: "'Montserrat', sans-serif" }}>
                                    {t.eyebrow}
                                </Typography>
                                <Typography variant="h2" sx={{ color: "#1A1A1A", fontSize: { xs: "2rem", md: "3rem" }, fontWeight: 400, fontFamily: "'Playfair Display', serif", mb: 2, lineHeight: 1.15 }}>
                                    {t.title}
                                </Typography>
                                <Typography sx={{ color: "#4A4A4A", fontSize: { xs: "0.85rem", md: "1.05rem" }, lineHeight: 1.8, fontWeight: 300, mb: 4, fontFamily: "'Montserrat', sans-serif" }}>
                                    {t.subtitle}
                                </Typography>
                            </Box>

                            {/* Contact info card */}
                            <Box
                                sx={{
                                    backgroundColor: "#FFFFFF",
                                    border: "1px solid rgba(0,0,0,0.03)",
                                    boxShadow: "0 10px 30px rgba(0,0,0,0.02)",
                                    borderRadius: "16px",
                                    p: { xs: 3, md: 3.5 },
                                    mb: 4,
                                }}
                            >
                                <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 3 }}>
                                    <BusinessIcon sx={{ color: "#A88132", fontSize: "1.2rem" }} />
                                    <Typography sx={{ color: "#A88132", fontWeight: 600, fontSize: "0.85rem", textTransform: "uppercase", letterSpacing: "0.15em", fontFamily: "'Montserrat', sans-serif" }}>
                                        {t.dept_title}
                                    </Typography>
                                </Box>

                                {/* Email */}
                                <Box
                                    component="a"
                                    href={`mailto:${CONTACT_EMAIL}`}
                                    sx={{
                                        display: "flex", alignItems: "center", gap: 2, mb: 2.5,
                                        textDecoration: "none", color: "inherit",
                                        transition: "all 0.2s",
                                        "&:hover .contact-text": { color: "#A88132" },
                                    }}
                                >
                                    <Box sx={{ width: 40, height: 40, borderRadius: "10px", backgroundColor: "rgba(168,129,50,0.08)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                                        <EmailIcon sx={{ color: "#A88132", fontSize: "1.1rem" }} />
                                    </Box>
                                    <Box>
                                        <Typography sx={{ color: "rgba(0,0,0,0.5)", fontSize: "0.7rem", textTransform: "uppercase", letterSpacing: "0.1em", fontFamily: "'Montserrat', sans-serif" }}>Email</Typography>
                                        <Typography className="contact-text" sx={{ color: "#1A1A1A", fontSize: { xs: "0.85rem", md: "0.95rem" }, fontWeight: 500, transition: "color 0.2s", fontFamily: "'Montserrat', sans-serif" }}>
                                            {CONTACT_EMAIL}
                                        </Typography>
                                    </Box>
                                </Box>

                                {/* Phone */}
                                <Box
                                    component="a"
                                    href={`tel:${CONTACT_PHONE.replace(/\s/g, "")}`}
                                    sx={{
                                        display: "flex", alignItems: "center", gap: 2, mb: 2.5,
                                        textDecoration: "none", color: "inherit",
                                        transition: "all 0.2s",
                                        "&:hover .contact-text": { color: "#A88132" },
                                    }}
                                >
                                    <Box sx={{ width: 40, height: 40, borderRadius: "10px", backgroundColor: "rgba(168,129,50,0.08)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                                        <PhoneIcon sx={{ color: "#A88132", fontSize: "1.1rem" }} />
                                    </Box>
                                    <Box>
                                        <Typography sx={{ color: "rgba(0,0,0,0.5)", fontSize: "0.7rem", textTransform: "uppercase", letterSpacing: "0.1em", fontFamily: "'Montserrat', sans-serif" }}>Phone</Typography>
                                        <Typography className="contact-text" sx={{ color: "#1A1A1A", fontSize: { xs: "0.85rem", md: "0.95rem" }, fontWeight: 500, transition: "color 0.2s", fontFamily: "'Montserrat', sans-serif" }}>
                                            {CONTACT_PHONE}
                                        </Typography>
                                    </Box>
                                </Box>

                                {/* WhatsApp CTA */}
                                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                                    <Box
                                        component="a"
                                        href={`https://wa.me/${CONTACT_WHATSAPP}?text=Hello%2C%20I%20am%20interested%20in%20corporate%20gifting%20from%20Ahmed%20Al%20Maghribi.`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        sx={{
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            gap: 1.5,
                                            background: "#25D366",
                                            color: "#fff",
                                            textDecoration: "none",
                                            borderRadius: "50px",
                                            py: 1.5,
                                            px: 3,
                                            fontWeight: 600,
                                            fontSize: "0.9rem",
                                            letterSpacing: "0.05em",
                                            fontFamily: "'Montserrat', sans-serif",
                                            transition: "all 0.3s ease",
                                            "&:hover": { background: "#1da851" },
                                        }}
                                    >
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="white"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                                        {t.whatsapp}
                                    </Box>
                                </motion.div>
                            </Box>

                            {/* Credibility Statement — replaces generic icon cards */}
                            <Box sx={{ 
                                mt: 5,
                                pt: 5, 
                                borderTop: "1px solid rgba(0,0,0,0.08)" 
                            }}>
                                <Typography sx={{
                                    color: "#1A1A1A",
                                    fontSize: { xs: "1.3rem", md: "1.6rem" },
                                    fontFamily: "'Playfair Display', serif",
                                    fontWeight: 400,
                                    fontStyle: "italic",
                                    lineHeight: 1.5,
                                    mb: 4
                                }}>
                                    {isRtl
                                        ? "موثوق به من قِبل أمازون وإعمار وطيران الإمارات وأكثر من ١٢٠ شريكاً مؤسسياً في الإمارات."
                                        : "Trusted by Amazon, Emaar, Emirates Airline, and over 120 corporate partners across the UAE."
                                    }
                                </Typography>
                                <Box sx={{ display: "flex", flexDirection: "column", gap: 0 }}>
                                    {(isRtl ? [
                                        "تسليم بالجملة في جميع أنحاء الإمارات خلال ٣–٥ أيام عمل",
                                        "تغليف مخصص بشعار شركتك",
                                        "مدير حساب مخصص لكل عميل",
                                        "عطور فاخرة مصنوعة وفق أعلى المعايير",
                                    ] : [
                                        "Bulk delivery across the UAE within 3–5 business days",
                                        "Custom packaging with your company logo",
                                        "A dedicated account manager for every client",
                                        "Premium quality perfumes, attars, oils & bakhoor",
                                    ]).map((item, i) => (
                                        <Box key={i} sx={{ display: "flex", gap: 3, alignItems: "baseline", py: 2, borderBottom: "1px solid rgba(0,0,0,0.05)", "&:last-child": { borderBottom: "none" } }}>
                                            <Box sx={{ width: "4px", height: "4px", borderRadius: "50%", backgroundColor: "#A88132", flexShrink: 0, mt: "6px" }} />
                                            <Typography sx={{ color: "#333333", fontSize: "0.9rem", fontFamily: "'Montserrat', sans-serif", fontWeight: 400, lineHeight: 1.6 }}>
                                                {item}
                                            </Typography>
                                        </Box>
                                    ))}
                                </Box>
                            </Box>
                        </motion.div>
                    </Grid>

                    {/* ── RIGHT: Form ── */}
                    <Grid item xs={12} md={7}>
                        <motion.div
                            initial={{ opacity: 0, x: isRtl ? -40 : 40 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8 }}
                        >
                            <Box
                                component="form"
                                onSubmit={handleSubmit}
                                sx={{
                                    backgroundColor: "#FFFFFF",
                                    border: "1px solid rgba(0,0,0,0.05)",
                                    borderRadius: "16px",
                                    p: { xs: 3, md: 5 },
                                    boxShadow: "0 20px 60px rgba(0,0,0,0.04)",
                                    position: "relative",
                                    overflow: "hidden",
                                }}
                            >
                                <Grid container spacing={2.5}>
                                    <Grid item xs={12} sm={6}>
                                        <TextField fullWidth label={t.fields.name} name="name" value={form.name} onChange={handleChange} required sx={inputSx} />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <TextField fullWidth label={t.fields.company} name="company" value={form.company} onChange={handleChange} required sx={inputSx} />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <TextField fullWidth label={t.fields.email} name="email" type="email" value={form.email} onChange={handleChange} required sx={inputSx} />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <TextField fullWidth label={t.fields.phone} name="phone" value={form.phone} onChange={handleChange} required sx={inputSx} />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <TextField
                                            select fullWidth label={t.fields.occasion} name="occasion"
                                            value={form.occasion} onChange={handleChange} required sx={inputSx}
                                            SelectProps={{ MenuProps: menuProps }}
                                        >
                                            {t.occasions.map(o => <MenuItem key={o} value={o}>{o}</MenuItem>)}
                                        </TextField>
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            select fullWidth label={t.fields.quantity} name="quantity"
                                            value={form.quantity} onChange={handleChange} required sx={inputSx}
                                            SelectProps={{ MenuProps: menuProps }}
                                        >
                                            {t.quantities.map(q => <MenuItem key={q} value={q}>{q}</MenuItem>)}
                                        </TextField>
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            select fullWidth label={t.fields.budget} name="budget"
                                            value={form.budget} onChange={handleChange} sx={inputSx}
                                            SelectProps={{ MenuProps: menuProps }}
                                        >
                                            {t.budgets.map(b => <MenuItem key={b} value={b}>{b}</MenuItem>)}
                                        </TextField>
                                    </Grid>
                                    <Grid item xs={12}>
                                        <TextField fullWidth multiline rows={4} label={t.fields.message} name="message" value={form.message} onChange={handleChange} sx={inputSx} />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                                            <Button
                                                type="submit"
                                                fullWidth
                                                sx={{
                                                    backgroundColor: "#A88132",
                                                    color: "#FFFFFF",
                                                    py: 2,
                                                    fontSize: { xs: "0.85rem", md: "0.95rem" },
                                                    fontWeight: 600,
                                                    borderRadius: "50px",
                                                    textTransform: "uppercase",
                                                    letterSpacing: "0.1em",
                                                    fontFamily: "'Montserrat', sans-serif",
                                                    transition: "all 0.3s ease",
                                                    "&:hover": {
                                                        backgroundColor: "#8C6A29",
                                                    },
                                                }}
                                            >
                                                {t.submit}
                                            </Button>
                                        </motion.div>
                                    </Grid>
                                </Grid>
                            </Box>
                        </motion.div>
                    </Grid>
                </Grid>
            </Container>

            <Snackbar open={snackOpen} autoHideDuration={6000} onClose={() => setSnackOpen(false)} anchorOrigin={{ vertical: "bottom", horizontal: "center" }}>
                <Alert severity="success" onClose={() => setSnackOpen(false)} sx={{ backgroundColor: "#FFFFFF", color: "#A88132", fontWeight: 500, borderRadius: "12px", border: "1px solid rgba(0,0,0,0.05)", boxShadow: "0 10px 40px rgba(0,0,0,0.08)", fontFamily: "'Montserrat', sans-serif" }}>
                    {t.success}
                </Alert>
            </Snackbar>
        </Box>
    );
};

export default CorporateContact;
