// This file now imports the real product data to be used in our simulation.
import { default as mockProducts } from './perfume_data.json';

export const mockFaqs = [
  {
    id: "faq_1",
    question_en: "What are the shipping options?",
    question_ar: "ما هي خيارات الشحن؟",
    answer_en: "We offer standard and express shipping to all Emirates.",
    answer_ar: "نحن نقدم الشحن العادي والسريع لجميع الإمارات.",
    category: "shipping",
    keywords: ["shipping", "delivery", "options"],
    priority: 1,
    is_active: true,
  },
  {
    id: "faq_2",
    question_en: "What is your return policy?",
    question_ar: "ما هي سياسة الإرجاع الخاصة بكم؟",
    answer_en: "You can return any item within 14 days of purchase, provided it is in its original packaging.",
    answer_ar: "يمكنك إرجاع أي منتج في غضون 14 يومًا من الشراء، بشرط أن يكون في عبوته الأصلية.",
    category: "returns",
    keywords: ["return", "policy", "refund"],
    priority: 2,
    is_active: true,
  }
];

// We are exporting the full list of products from the JSON file.
export { mockProducts };