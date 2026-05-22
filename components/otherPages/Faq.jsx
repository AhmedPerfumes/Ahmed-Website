"use client";
import { useLocale, useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import Image from "next/image";

export default function Faq() {
  const locale = useLocale();
  const t = useTranslations();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}api/faqs/categories`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          const formatted = data.data.map((cat) => ({
            ...cat,
            faqs: cat.faqs.map((f) => ({ ...f, expanded: false })),
          }));
          setCategories(formatted);
        }
      })
      .finally(() => setLoading(false));
  }, []);

  // toggle accordion
  const toggleFaq = (categoryId, faqId) => {
    setCategories((prev) =>
      prev.map((cat) =>
        cat.id === categoryId
          ? {
              ...cat,
              faqs: cat.faqs.map((f) =>
                f.id === faqId ? { ...f, expanded: !f.expanded } : f
              ),
            }
          : cat
      )
    );
  };

  if (loading) return (
    <div className="container py-5 text-center">
      <p>{t("Loading FAQs")}</p>
    </div>
  );

  return (
    <>
      <div className="container-fluid p-0 mb-5">
        <Image
          loading="lazy"
          className="w-100 h-auto d-block"
          src="/assets/images/blog/blogs-banner.jpg"
          alt="image"
          width={1500}
          height={550}
        />
      </div>

      <section className="container mw-930 lh-30">
        <h2 className="section-title text-uppercase fw-bold mb-5">
          {t("FREQUENTLY ASKED QUESTIONS")}
        </h2>

        {categories.map((category) => (
          <div key={category.id} className="mb-5">
            <h3 className="category-title mb-4">{locale === "ar" ? (category.ar_name || category.name) : category.name}</h3>
            <div className="faq-accordion accordion">
              {category.faqs.map((faq) => (
                <div key={faq.id} className="accordion-item">
                  <h5 className="accordion-header">
                    <button
                      className={`accordion-button ${
                        faq.expanded ? "" : "collapsed"
                      }`}
                      type="button"
                      onClick={() => toggleFaq(category.id, faq.id)}
                    >
                      <span>{locale === "ar" ? (faq.ar_question || faq.question) : faq.question}</span>
                      <div className="custom-icon">
                        <span className="icon-h"></span>
                        <span className="icon-v"></span>
                      </div>
                    </button>
                  </h5>
                  <div
                    className={`accordion-collapse ${
                      faq.expanded ? "open" : "closed"
                    }`}
                  >
                    {/* <div className="accordion-body">
                     {faq.answer}
                    </div> */}
                      <div 
                        className="accordion-body" 
                        dangerouslySetInnerHTML={{ 
                          __html: locale === "ar" ? (faq.ar_answer || faq.answer) : faq.answer 
                        }}
                      ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </section>

      <style jsx>{`
        .section-title {
          font-family: 'Playfair Display', serif;
          letter-spacing: 2px;
          color: #1a1a1a;
          position: relative;
          padding-bottom: 20px;
        }
        .section-title::after {
          content: '';
          position: absolute;
          bottom: 0;
          left: ${locale === 'ar' ? 'auto' : '0'};
          right: ${locale === 'ar' ? '0' : 'auto'};
          width: 60px;
          height: 2px;
          background: #b9a16b;
        }

        .category-title {
          font-family: 'Playfair Display', serif;
          font-size: 2rem;
          color: #333;
          margin-top: 60px;
          border-bottom: 1px solid #eee;
          padding-bottom: 15px;
        }

        .faq-accordion {
          border-top: none;
        }

        .accordion-item {
          border: none;
          border-bottom: 1px solid #f0f0f0;
          background: transparent;
        }

        .accordion-button {
          background: transparent;
          box-shadow: none;
          padding: 25px 0;
          font-weight: 500;
          color: #222;
          font-size: 1.1rem;
          display: flex;
          align-items: center;
          justify-content: space-between;
          text-align: ${locale === 'ar' ? 'right' : 'left'};
          gap: 20px;
          transition: color 0.3s ease;
        }

        .accordion-button:not(.collapsed) {
          background: transparent;
          color: #b9a16b;
        }

        .accordion-button::after {
          display: none; /* Hide default icon */
        }

        .custom-icon {
          width: 20px;
          height: 20px;
          position: relative;
          flex-shrink: 0;
          transition: transform 0.4s ease;
        }

        .custom-icon span {
          position: absolute;
          background: currentColor;
          transition: all 0.3s ease;
        }

        .icon-v {
          width: 2px;
          height: 100%;
          left: 50%;
          top: 0;
          transform: translateX(-50%);
        }

        .icon-h {
          width: 100%;
          height: 2px;
          top: 50%;
          left: 0;
          transform: translateY(-50%);
        }

        .accordion-button:not(.collapsed) .icon-v {
          transform: translateX(-50%) rotate(90deg);
          opacity: 0;
        }

        .accordion-collapse {
          overflow: hidden;
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .accordion-collapse.closed {
          max-height: 0;
          opacity: 0;
        }

        .accordion-collapse.open {
          max-height: 1000px;
          opacity: 1;
        }

        .accordion-body {
          padding: 0 0 30px 0;
          color: #666;
          line-height: 1.8;
          font-size: 1rem;
        }

        /* RTL TYPOGRAPHY IMPROVEMENTS */
        [dir='rtl'] .section-title,
        [dir='rtl'] .category-title {
          letter-spacing: 0;
          font-family: 'Inter', sans-serif; /* Playfair often doesn't look great with Arabic, using clean sans-serif */
          font-weight: 700;
        }

        [dir='rtl'] .accordion-button {
          font-size: 1.2rem;
          line-height: 1.4;
        }

        [dir='rtl'] .accordion-body {
          font-size: 1.05rem;
          line-height: 1.9;
        }
      `}</style>
    </>
  );
}
