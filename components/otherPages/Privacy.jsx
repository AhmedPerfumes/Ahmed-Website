"use client";
import React from "react";
import { useTranslations, useLocale } from "next-intl";

function Privacy() {
  const t = useTranslations();
  const locale = useLocale();

  return (
    <div className="privacy-container container mw-1300 mt-5 mb-5">
      <div className="privacy-header text-center mb-5">
        <h1 className="display-4 fw-bold text-uppercase">{t("Privacy Policy")}</h1>
        <div className="accent-line"></div>
      </div>

      <div className="privacy-content">
        <section className="privacy-section">
          <p className="lead fw-bold">
            {t("Privacy commitment p1")}
          </p>
          <p className="mt-3">
            {t("Privacy commitment p2")}
          </p>
        </section>

        <section className="privacy-section mt-5">
          <h2 className="h4 gold-text mb-3">{t("Collection and use of online information title")}</h2>
          <p>
            {t("When you visit our websites we will not collect your personal information unless you choose to use and receive online products and services that require it")}
          </p>
        </section>

        <section className="privacy-section mt-5">
          <h2 className="h4 gold-text mb-3">{t("Use of cookies title")}</h2>
          <p>
            {t("Ahmed Al Maghribi Perfumes LLC websites may use cookies")}
          </p>
        </section>

        <section className="privacy-section mt-5">
          <h2 className="h4 gold-text mb-3">{t("Protection of personal information title")}</h2>
          <p>
            {t("The personal information you enter on our websites is only available to the authorized Ahmed Al Maghribi Perfumes LLC employees who have a need to know it")}
          </p>
        </section>

        <section className="privacy-section mt-5">
          <h2 className="h4 gold-text mb-3">{t("Important notice title")}</h2>
          <p>
            {t("Some of our websites link to other sites created and maintained by other public and or private sector organizations")}
          </p>
        </section>

        <section className="privacy-section mt-5">
          <h2 className="h4 gold-text mb-3">{t("PRODUCT INFORMATION title")}</h2>
          <p>
            {t("All products displayed on website are subject to availability")}
          </p>
        </section>

        <section className="privacy-section mt-5">
          <h2 className="h4 gold-text mb-3">{t("Third Party Website Disclaimer title")}</h2>
          <p>
            {t("Ahmed Al Maghribi Perfumes LLC website may periodically provide links to third party websites")}
          </p>
        </section>

        <section className="privacy-section mt-5">
          <h2 className="h4 gold-text mb-3">{t("External links from Ahmed Al Maghribi Perfumes LLC Website title")}</h2>
          <p className="mb-2">{t("A link from the Ahmed Al Maghribi Perfumes LLC website may be defined as")}</p>
          <ul className="privacy-list">
            <li>{t("Hyperlinks are activated by clicking on an image or text leading to a web page that does not reside on the Ahmed Al Maghribi Perfumes LLC website explicit")}</li>
            <li>{t("Mention of a URL address providing users with the address of a web page that does not reside on the Ahmed Al Maghribi Perfumes LLC website implicit")}</li>
            <li>{t("Ahmed Al Maghribi Perfumes LLC marketing and IT may establish links to external sites on the Ahmed Al Maghribi Perfumes LLC website provided that each external site meets at least one of the following criteria")}</li>
          </ul>
        </section>

        <section className="privacy-section mt-5">
          <h2 className="h4 gold-text mb-3">{t("External links To Ahmed Al Maghribi Perfumes LLC website title")}</h2>
          <p className="mb-2">{t("A site that links to the Ahmed Al Maghribi Perfumes LLC website should not misrepresent its relationship with Ahmed Al Maghribi Perfumes LLC")}</p>
          <ul className="privacy-list">
            <li>{t("A browser or border environment should not be created around Ahmed Al Maghribi Perfumes LLC content")}</li>
            <li>{t("The Ahmed Al Maghribi Perfumes LLC logo should not be used without the permission of Ahmed Al Maghribi Perfumes LLC")}</li>
            <li>{t("The site should not present false inaccurate information about Ahmed Al Maghribi Perfumes LLC services")}</li>
          </ul>
        </section>

        <section className="privacy-section mt-5 mb-5">
          <h2 className="h4 gold-text mb-3">{t("Governing Law and Jurisdiction title")}</h2>
          <p>
            {t("All matters regarding the use of this website and or any related matter shall be governed by and construed in accordance with the laws")}
          </p>
        </section>
      </div>

      <style jsx>{`
        .privacy-container {
          color: #333;
          line-height: 1.8;
          font-family: 'Inter', sans-serif;
        }

        .display-4 {
          font-family: 'Playfair Display', serif;
          color: #1a1a1a;
          letter-spacing: 2px;
        }

        .accent-line {
          width: 80px;
          height: 3px;
          background: #b9a16b;
          margin: 20px auto;
        }

        .gold-text {
          color: #b9a16b;
          font-family: 'Playfair Display', serif;
          font-weight: 700;
          letter-spacing: 0.5px;
          border-bottom: 1px solid #eee;
          padding-bottom: 10px;
          display: inline-block;
          margin-bottom: 15px !important;
        }

        .privacy-section p {
          font-size: 1.05rem;
          color: #4a4a4a;
          text-align: justify;
        }

        .lead {
          font-size: 1.25rem;
          color: #1a1a1a !important;
          border-left: 4px solid #b9a16b;
          padding-left: 20px;
          margin-bottom: 30px;
        }

        .privacy-list {
          list-style: none;
          padding: 0;
        }

        .privacy-list li {
          position: relative;
          padding-left: 25px;
          margin-bottom: 12px;
          font-size: 1rem;
          color: #4a4a4a;
        }

        .privacy-list li::before {
          content: '•';
          position: absolute;
          left: 0;
          color: #b9a16b;
          font-weight: bold;
          font-size: 1.2rem;
        }

        /* RTL Specifics */
        [dir='rtl'] .display-4 {
          letter-spacing: 0;
        }

        [dir='rtl'] .lead {
          border-left: none;
          border-right: 4px solid #b9a16b;
          padding-left: 0;
          padding-right: 20px;
        }

        [dir='rtl'] .privacy-list li {
          padding-left: 0;
          padding-right: 25px;
        }

        [dir='rtl'] .privacy-list li::before {
          left: auto;
          right: 0;
        }

        [dir='rtl'] .privacy-section p {
          text-align: right;
        }
      `}</style>
    </div>
  );
}

export default Privacy;
