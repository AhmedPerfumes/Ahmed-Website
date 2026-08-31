import React from "react";
import EWDStepExperience from "@/components/emiratiwomenday/EWDStepExperience";

export async function generateMetadata({ params }) {
  const { locale } = params;
  const isArabic = locale === "ar";
  return {
    title: isArabic
      ? "يوم المرأة الإماراتية ٢٠٢٦ — أحمد المغربي للعطور"
      : "Emirati Women's Day 2026 — Ahmed Al Maghribi Perfumes",
    description: isArabic
      ? "احتفلي بيوم المرأة الإماراتية مع أحمد المغربي. اكتشفي عطرك، شاركي ذكرياتك، وادوري عجلة الجوائز."
      : "Celebrate Emirati Women's Day with Ahmed Al Maghribi. Find your scent, share your heritage memories, and spin to win in-store prizes.",
    openGraph: {
      title: isArabic
        ? "يوم المرأة الإماراتية ٢٠٢٦ — أحمد المغربي"
        : "Emirati Women's Day 2026 — Ahmed Al Maghribi",
      images: [{ url: "/ewd-hero-bg.jpg", width: 1200, height: 630 }],
    },
    icons: { icon: "/assets/images/ahmed-favicon.png" },
  };
}

const EmiratiWomenDayPage = () => {
  return (
    <div className="ewd-fullscreen-wrapper">
      <EWDStepExperience />
    </div>
  );
};

export default EmiratiWomenDayPage;
