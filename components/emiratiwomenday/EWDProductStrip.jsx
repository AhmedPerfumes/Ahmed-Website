"use client";
import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useLocale } from "next-intl";
import Image from "next/image";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "";

const FALLBACK_PRODUCTS = [
  { product_name: "Niswa", price: "195", category: "Perfumes", img: "/assets/images/fathersday/perfumes.jpeg" },
  { product_name: "Shaikhahind", price: "220", category: "Concentrated Parfum", img: "/assets/images/fathersday/oil.jpeg" },
  { product_name: "Bidun Esam", price: "180", category: "Perfumes", img: "/assets/images/fathersday/perfumes.jpeg" },
  { product_name: "Lamsat Harir", price: "165", category: "Perfumes", img: "/assets/images/fathersday/perfumes.jpeg" },
  { product_name: "Bint Al Arab", price: "210", category: "Collections", img: "/assets/images/fathersday/collections-1.jpeg" },
  { product_name: "Laila Gift Set", price: "295", category: "Gift Sets", img: "/assets/images/fathersday/gift-set2.jpeg" },
  { product_name: "Mukhallat Laila", price: "175", category: "Concentrated Parfum", img: "/assets/images/fathersday/oil.jpeg" },
  { product_name: "Rose Oud", price: "245", category: "Perfumes", img: "/assets/images/fathersday/perfumes.jpeg" },
];

const translations = {
  en: {
    label: "Women's Collection",
    heading: "Fragrances For",
    headingEm: "Her",
    sub: "Discover Ahmed Al Maghribi's most-loved women's fragrances — each one a story of elegance and heritage.",
    loading: "Loading collection…",
    view: "View All Women's Fragrances →",
    quickView: "Quick View",
    aed: "AED",
  },
  ar: {
    label: "مجموعة المرأة",
    heading: "عطور",
    headingEm: "لها",
    sub: "اكتشفي أكثر عطور أحمد المغربي قرباً لقلوب النساء — كل عطر قصة من الأناقة والتراث.",
    loading: "تحميل المجموعة…",
    view: "عرض جميع عطور المرأة ←",
    quickView: "عرض سريع",
    aed: "درهم",
  },
};

function ProductCard({ product, locale, t }) {
  const name = product.product_name || product.name || "Fragrance";
  const price = product.price || product.product_price || "—";
  const category = product.category_name || product.category || "Perfumes";
  const img = product.main_image || product.img || "/assets/images/fathersday/perfumes.jpeg";
  const slug = product.product_id
    ? `/${locale}/product/${product.product_id}`
    : `/${locale}/product-category/perfumes`;

  return (
    <motion.div
      className="ewd-product-card"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
    >
      <Link href={slug} style={{ textDecoration: "none", display: "block" }}>
        <div className="ewd-product-card__img-wrap">
          <Image
            src={img}
            alt={name}
            fill
            style={{ objectFit: "cover", transition: "transform 0.6s cubic-bezier(0.22,1,0.36,1)" }}
            sizes="240px"
            onError={(e) => { e.target.src = "/assets/images/fathersday/perfumes.jpeg"; }}
          />
          <div className="ewd-product-card__overlay">
            <span className="ewd-product-card__quick-view">{t.quickView}</span>
          </div>
        </div>
        <div className="ewd-product-card__body">
          <div className="ewd-product-card__sub">{category}</div>
          <div className="ewd-product-card__name">{name}</div>
          <div className="ewd-product-card__price">
            {t.aed} {price}
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

export default function EWDProductStrip() {
  const locale = useLocale();
  const isRtl = locale === "ar";
  const t = translations[locale] || translations.en;
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const stripRef = useRef(null);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch(`${BASE_URL}api/allProducts`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ page: 1, limit: 100 }),
        });
        const data = await res.json();
        const all = data.data || [];

        // Filter for women's products
        const keywords = ["niswa", "shaikhahind", "bidun esam", "laila", "bint", "harir", "rose", "women", "lady", "her", "lana", "fatima"];
        const filtered = all.filter((p) => {
          const nm = (p.product_name || "").toLowerCase();
          return keywords.some((k) => nm.includes(k));
        });

        setProducts(filtered.length >= 4 ? filtered.slice(0, 12) : FALLBACK_PRODUCTS);
      } catch {
        setProducts(FALLBACK_PRODUCTS);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  return (
    <section id="ewd-products" className="ewd-section ewd-products" dir={isRtl ? "rtl" : "ltr"}>
      <div className="ewd-container">
        {/* Header */}
        <motion.div
          className="ewd-products__header"
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <div className="ewd-section-label">{t.label}</div>
          <h2 className="ewd-heading">
            {t.heading} <em>{t.headingEm}</em>
          </h2>
          <p className="ewd-subheading" style={{ margin: "0 auto" }}>{t.sub}</p>
        </motion.div>

        {/* Product Strip */}
        {loading ? (
          <div className="ewd-products__loading">
            <div className="ewd-products__loading-dot" />
            <div className="ewd-products__loading-dot" />
            <div className="ewd-products__loading-dot" />
            <span>{t.loading}</span>
          </div>
        ) : (
          <div className="ewd-products__strip" ref={stripRef}>
            {products.map((p, i) => (
              <ProductCard key={i} product={p} locale={locale} t={t} />
            ))}
          </div>
        )}

        {/* CTA */}
        <motion.div
          style={{ textAlign: "center", marginTop: 40 }}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
        >
          <Link
            href={`/${locale}/product-category/perfumes`}
            className="ewd-btn-outline"
            id="ewd-view-all-womens"
          >
            {t.view}
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
