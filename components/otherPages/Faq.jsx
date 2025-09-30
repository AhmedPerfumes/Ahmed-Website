"use client";
import { useEffect, useState } from "react";
import Image from "next/image";

export default function Faq() {
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

  if (loading) return <p>Loading FAQs...</p>;

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
          FREQUENTLY ASKED QUESTIONS
        </h2>

        {categories.map((category) => (
          <div key={category.id} className="mb-5">
            <h3 className="mb-4">{category.name}</h3>
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
                      {faq.question}
                      <svg
                        className="accordion-button__icon"
                        viewBox="0 0 14 14"
                      >
                        <g aria-hidden="true" stroke="none" fillRule="evenodd">
                          <path
                            className="svg-path-vertical"
                            d="M14,6 L14,8 L0,8 L0,6 L14,6"
                          ></path>
                          <path
                            className="svg-path-horizontal"
                            d="M14,6 L14,8 L0,8 L0,6 L14,6"
                          ></path>
                        </g>
                      </svg>
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
                      <div className="accordion-body" dangerouslySetInnerHTML={{ __html: faq.answer }}></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </section>

      <style jsx>{`
        .accordion-collapse {
          overflow: hidden;
          transition: max-height 0.35s ease, opacity 0.35s ease;
        }
        .accordion-collapse.closed {
          max-height: 0;
          opacity: 0;
        }
        .accordion-collapse.open {
          max-height: 500px; /* big enough for longest answer */
          opacity: 1;
        }
      `}</style>
    </>
  );
}
