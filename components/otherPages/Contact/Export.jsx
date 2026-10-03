import TopDeals from "@/components/homes/home-11/TopDeals";
import Categories from "@/components/homes/home-5/Categories";
import TopCollections from "@/components/homes/home-5/TopCollections";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { useLocale, useTranslations } from "next-intl";

export default function Export() {
  const t = useTranslations();
  const locale = useLocale();
  return (
    <>
      <div className="container-fluid p-0 pt-5">
        <Image
          loading="lazy"
          className="w-100 h-auto d-none d-lg-block"
          src="/assets/images/export/export_banner.jpg"
          alt="image"
          width={1500}
          height={550}
        />
      </div>
      <div className="">
        <Image
          loading="lazy"
          className="w-100 h-auto d-lg-none pt-5"
          src="/assets/images/export/export_mobile.jpg"
          alt="image"
          width={500}
          height={500}
        />
      </div>
      <div className="container pt-5 mt-2">
        <div className="section2 text-center">
          <h3 className="text-uppercase fs-2 mb-5">
            Ahmed Al Maghribi Exports
          </h3>
        </div>
        <div className="row align-items-center mt-4">
          <div className="col-md-6">
            <video className="w-100" autoPlay loop muted>
              <source
                src="https://www.ahmedalmaghribi.com/wp-content/uploads/2024/07/SHOP-VIDEO-1.mp4"
                type="video/mp4"
              />
              Your browser does not support the video tag.
            </video>
          </div>
          <div className="col-md-6 text-center pt-5">
            <h4 className="text-uppercase fs-2">
              {t("Global Reach of Ahmed Al Maghribi Perfumes")}
            </h4>
            <p className="mt-3 fs-6">
              {t(
                "At Ahmed Al Maghribi Perfumes our passion for excellence knows no borders Our International Exports Division with over a decade of expertise proudly serves more than 91 countries Our carefully crafted fragrances renowned for their unmatched quality captivate both distributors and consumers worldwide"
              )}
            </p>
            <p className="mt-3 fs-6">
              {t(
                "We have partnered with leading retail chains and independent perfumery stores ensuring our signature scents reach every corner of the globe From strategic growth to evolving product offerings we are dedicated to bringing the essence of luxury to a global audience"
              )}
            </p>
          </div>
        </div>
      </div>

      {/* Beautyworld Dubai 2026 Section */}
      <section className="beautyworld-export-section py-5 mt-4">
        <div className="container">
          <div className="p-4 p-md-5 rounded-4">
            {/* Header visible only on mobile (< lg) */}
            <div className="d-lg-none mb-4 text-center">
              <span
                className="text-uppercase fw-semibold d-inline-block mb-2"
                style={{
                  color: "#a67b30",
                  letterSpacing: "2.5px",
                  fontSize: "0.85rem",
                }}
              >
                {t("Connecting Fragrance with the World")}
              </span>
              <h3
                className="text-uppercase fw-bold mb-3"
                style={{
                  fontSize: "clamp(1.75rem, 2.8vw, 2.35rem)",
                  letterSpacing: "0.5px",
                  color: "#1a1a1a",
                  lineHeight: 1.25,
                }}
              >
                {t("Beautyworld Dubai 2026")}
              </h3>
              <div
                style={{
                  width: "60px",
                  height: "3px",
                  backgroundColor: "#a67b30",
                  margin: "0 auto 1.5rem",
                  borderRadius: "2px",
                }}
              />
            </div>

            <div className="row align-items-center g-4 g-lg-5">
              {/* Image: on mobile order-1 (after mobile header), on desktop order-lg-2 (right column) */}
              <div className="col-lg-6 order-1 order-lg-2">
                <div
                  className="position-relative overflow-hidden rounded-4 shadow-sm"
                  style={{
                    border: "1px solid rgba(166, 123, 48, 0.2)",
                  }}
                >
                  <Image
                    loading="lazy"
                    src="/assets/images/export/PressRelease.jpeg"
                    alt="Beautyworld Dubai 2026 - Ahmed Al Maghribi Perfumes"
                    width={1200}
                    height={900}
                    className="w-100 h-auto object-fit-cover d-block"
                  />
                </div>
              </div>

              {/* Text content: on mobile order-2 (after image), on desktop order-lg-1 (left column) */}
              <div className="col-lg-6 order-2 order-lg-1 text-center">
                <div className="px-lg-3 text-center">
                  {/* Header visible only on desktop (lg and up) */}
                  <div className="d-none d-lg-block text-center">
                    <span
                      className="text-uppercase fw-semibold d-inline-block mb-2"
                      style={{
                        color: "#a67b30",
                        letterSpacing: "2.5px",
                        fontSize: "0.85rem",
                      }}
                    >
                      {t("Connecting Fragrance with the World")}
                    </span>
                    <h3
                      className="text-uppercase fw-bold mb-3"
                      style={{
                        fontSize: "clamp(1.75rem, 2.8vw, 2.35rem)",
                        letterSpacing: "0.5px",
                        color: "#1a1a1a",
                        lineHeight: 1.25,
                      }}
                    >
                      {t("Beautyworld Dubai 2026")}
                    </h3>
                    <div
                      style={{
                        width: "60px",
                        height: "3px",
                        backgroundColor: "#a67b30",
                        margin: "0 auto 1.5rem",
                        borderRadius: "2px",
                      }}
                    />
                  </div>
                  {locale === "ar" ? (
                    <>
                      <p
                        className="fs-6 mb-3"
                        style={{ lineHeight: "1.8", color: "#4a4a4a" }}
                      >
                        يمثل بيوتي وورلد دبي 2026 محطة جديدة في{" "}
                        <em className="fst-italic fw-medium text-dark">
                          رحلة أحمد المغربي للعطور العالمية
                        </em>
                        ، حيث نستعرض أحدث إبداعاتنا العطرية ونعزز شراكاتنا الدولية ونتواصل مع الموزعين وتجار التجزئة والجملة والمهنيين في صناعة العطور من مختلف أنحاء العالم.
                      </p>
                      <p
                        className="fs-6 mb-4"
                        style={{ lineHeight: "1.8", color: "#4a4a4a" }}
                      >
                        يعكس وجودنا المستمر في بيوتي وورلد طموحنا للتوسع في أسواق جديدة مع مشاركة تراث وحرفية وأصالة{" "}
                        <em className="fst-italic fw-medium text-dark">
                          العطور العربية
                        </em>{" "}
                        مع جمهور عالمي.
                      </p>
                    </>
                  ) : (
                    <>
                      <p
                        className="fs-6 mb-3"
                        style={{ lineHeight: "1.8", color: "#4a4a4a" }}
                      >
                        Beautyworld Dubai 2026 marks another chapter in{" "}
                        <em className="fst-italic fw-medium text-dark">
                          Ahmed Al Maghribi Perfumes’ global journey
                        </em>
                        , showcasing new fragrance creations, strengthening
                        international partnerships, and connecting with
                        distributors, retailers, wholesalers, and industry
                        professionals from around the world.
                      </p>
                      <p
                        className="fs-6 mb-4"
                        style={{ lineHeight: "1.8", color: "#4a4a4a" }}
                      >
                        Our continued presence at Beautyworld reflects our
                        ambition to expand into new markets while sharing the
                        heritage, craftsmanship, and distinctive character of{" "}
                        <em className="fst-italic fw-medium text-dark">
                          Arabian perfumery
                        </em>{" "}
                        with a global audience.
                      </p>
                    </>
                  )}
                  <div className="pt-2 d-flex justify-content-center">
                    <Link
                      href={`/${locale}/beautyworld-dubai-2026`}
                      className="btn btn-outline-dark btn-sm rounded-pill px-3 py-2 px-md-4 py-md-2 d-inline-flex align-items-center gap-2"
                      style={{
                        letterSpacing: "0.5px",
                        fontSize: "0.8125rem",
                        fontWeight: 500,
                        borderColor: "rgba(0, 0, 0, 0.35)",
                        transition: "all 0.2s ease-in-out",
                      }}
                    >
                      <span>{t("Discover Our Beautyworld Journey")}</span>
                      <svg
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        style={{
                          transform: locale === "ar" ? "rotate(180deg)" : "none",
                        }}
                      >
                        <path d="M5 12h14M12 5l7 7-7 7" />
                      </svg>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <TopCollections categoryId={19} category={"Online Exclusive"} sub_category={"Online Exclusive"} title={t("Top Collections")} />

      {/* <div className="container d-flex justify-content-center">
  <video
    className="w-75 w-md-50 w-lg-25"
    src="https://www.ahmedalmaghribi.com/wp-content/uploads/2024/07/Ahmed-Perfume-Street-View.mp4"
    autoPlay
    loop
    muted
  ></video>
</div> */}

      <div className="container d-flex justify-content-center pt-5">
        <div className="contact-us__form ">
          <h3 className="text-center fs-2 text-uppercase">
            For Distributor's Enquiries
          </h3>
          <form className="needs-validation mx-5">
            <h4 className="pt-5 fs-3">Drop us a Line</h4>
            <p className="fs-5">
              Simply fill out the form, include your message, and we’ll get back
              to you as soon as we can.
            </p>
            <div className="form-floating my-4">
              <input
                type="text"
                className="form-control"
                id="contact_us_name"
                placeholder="Name *"
                required
              />
              <label htmlFor="contact_us_name">Name *</label>
            </div>
            <div className="form-floating my-4">
              <input
                type="email"
                className="form-control"
                id="contact_us_email"
                placeholder="Email address *"
                required
              />
              <label htmlFor="contact_us_email">Email address *</label>
            </div>
            <div className="form-floating my-4">
              <input
                type="text"
                className="form-control"
                id="contact_us_subject"
                placeholder="Subject *"
                required
              />
              <label htmlFor="contact_us_subject">Subject *</label>
            </div>
            <div className="my-4">
              <textarea
                className="form-control form-control_gray"
                placeholder="Your Message"
                cols="30"
                rows="8"
                required
              ></textarea>
            </div>
            <div className="my-4">
              <button type="submit" className="btn btn-primary">
                Submit
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
