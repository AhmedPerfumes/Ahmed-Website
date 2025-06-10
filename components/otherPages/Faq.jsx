"use client";
import { useEffect } from "react";
import Image from "next/image";

const accordionData = [
  {
    id: 1,
    heading: "What payment methods are available for my order?",
    body: `We provide a variety of easy payment options for your convenience. You can choose between cash on delivery or secure online payment through our website.`,
    expanded: false,
  },
  {
    id: 2,
    heading: "What should I do if my order is delivered in a damaged condition?",
    body: `We want you to enjoy your Ahmed Al Maghribi fragrance in perfect condition. If your order arrives damaged, kindly contact our customer service team within a reasonable time. Please include clear photos of the damaged item(s) via email or WhatsApp. Make sure not to discard any products until you've heard back from us.`,
    expanded: false,
  },
  {
    id: 3,
    heading: "Am I allowed to cancel my order?",
    body: `We want you to enjoy your Ahmed Al Maghribi fragrance in perfect condition. If your order arrives damaged, kindly contact our customer service team within a reasonable time. Please include clear photos of the damaged item(s) via email or WhatsApp. Make sure not to discard any products until you've heard back from us.`,
    expanded: false,
  },
];

const accordionData2 = [
  {
    id: 1,
    heading: "I placed my order today, how soon will it be shipped?",
    body: `Your items will typically arrive within 2 to 5 days after your order is confirmed. If, for any reason, there is a delay beyond one week, please feel free to reach out to our customer care team.`,
    expanded: false,
  },
  {
    id: 2,
    heading: "What steps should I take if I wasn't available to receive my delivery?",
    body: `Please reach out to our Support team via WhatsApp, Email, or Chat. We'll be happy to assist you in rescheduling your delivery.`,
    expanded: false,
  },
  {
    id: 3,
    heading: "Is it possible to select a preferred delivery time for my order?",
    body: `Since we work with an external courier service, we can pass along your preferred delivery time, but we cannot guarantee it. If you have a specific time in mind, feel free to contact us via WhatsApp for further assistance.`,
    expanded: false,
  },
  {
    id: 4,
    heading: "Am I allowed to return a perfume if I've already tried it?",
    body: `Unfortunately, we cannot accept returns on products that have been opened or used.`,
    expanded: false,
  },
  {
    id: 5,
    heading: "What should I do if I receive an incorrect item with my order?",
    body: `We strive to deliver your chosen fragrance exactly as ordered. If you happen to receive the wrong item, please get in touch with our customer service team right away. Share a clear photo of the item you received along with your invoice, and we'll promptly arrange to send you the correct fragrance.`,
    expanded: false,
  },
];
const accordionData3 = [
  {
    id: 1,
    heading: "Is it possible to use a card for payment if I select cash on delivery?",
    body: `Card payments are not supported with the cash on delivery option. You’ll need to pay in cash when your order is delivered. If you'd like to pay by card, please choose our online payment method during checkout.`,
    expanded: false,
  },
  {
    id: 2,
    heading: "Is it possible to use foreign currency when paying by Cash on Delivery?",
    body: `Unfortunately, we can only accept local currency for Cash on Delivery orders.`,
    expanded: false,
  },
  {
    id: 3,
    heading: "If I use a Credit or Debit Card to pay for my order, how long will it take to receive a refund?",
    body: `Generally, refunds to credit or debit cards take between 7 to 14 working days to appear in your original account or card.`,
    expanded: false,
  },
];
export default function Faq() {
  useEffect(() => {
    if (typeof window !== "undefined") {
      // Import the script only on the client side
      import("bootstrap/dist/js/bootstrap.esm").then(() => {
        // Module is imported, you can access any exported functionality if
      });
    }
  }, []);
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
      <h3 className="mb-4">Orders</h3>
      <div id="faq_accordion" className="faq-accordion accordion mb-5">
        {accordionData.map((item) => (
          <div key={item.id} className="accordion-item">
            <h5
              className="accordion-header"
              id={`faq-accordion-heading-${item.id}`}
            >
              <button
                className={`accordion-button ${
                  !item.expanded ? "collapsed" : ""
                }`}
                type="button"
                data-bs-toggle="collapse"
                data-bs-target={`#faq-accordion-collapse-${item.id}`}
                aria-expanded={item.expanded}
                aria-controls={`faq-accordion-collapse-${item.id}`}
              >
                {item.heading}
                <svg className="accordion-button__icon" viewBox="0 0 14 14">
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
              id={`faq-accordion-collapse-${item.id}`}
              className={`accordion-collapse collapse ${
                item.expanded ? "show" : ""
              }`}
              aria-labelledby={`faq-accordion-heading-${item.id}`}
              data-bs-parent="#faq_accordion"
            >
              <div className="accordion-body">
                <p>{item.body}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
      <h3 className="mb-4">Shipping</h3>
      <div id="faq_accordion_2" className="faq-accordion accordion mb-5">
        {accordionData2.map((item) => (
          <div key={item.id} className="accordion-item">
            <h5
              className="accordion-header"
              id={`faq-accordion-heading-2-${item.id}`}
            >
              <button
                className={`accordion-button ${
                  !item.expanded ? "collapsed" : ""
                }`}
                type="button"
                data-bs-toggle="collapse"
                data-bs-target={`#faq-accordion-collapse-2-${item.id}`}
                aria-expanded={item.expanded}
                aria-controls={`faq-accordion-collapse-2-${item.id}`}
              >
                {item.heading}
                <svg className="accordion-button__icon" viewBox="0 0 14 14">
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
              id={`faq-accordion-collapse-2-${item.id}`}
              className={`accordion-collapse collapse ${
                item.expanded ? "show" : ""
              }`}
              aria-labelledby={`faq-accordion-heading-2-${item.id}`}
              data-bs-parent="#faq_accordion_2"
            >
              <div className="accordion-body">
                <p>{item.body}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
      <h3 className="mb-4">Payment</h3>
      <div id="faq_accordion_3" className="faq-accordion accordion mb-5">
        {accordionData3.map((item) => (
          <div key={item.id} className="accordion-item">
            <h5
              className="accordion-header"
              id={`faq-accordion-heading-3-${item.id}`}
            >
              <button
                className={`accordion-button ${
                  !item.expanded ? "collapsed" : ""
                }`}
                type="button"
                data-bs-toggle="collapse"
                data-bs-target={`#faq-accordion-collapse-3-${item.id}`}
                aria-expanded={item.expanded}
                aria-controls={`faq-accordion-collapse-3-${item.id}`}
              >
                {item.heading}
                <svg className="accordion-button__icon" viewBox="0 0 14 14">
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
              id={`faq-accordion-collapse-3-${item.id}`}
              className={`accordion-collapse collapse ${
                item.expanded ? "show" : ""
              }`}
              aria-labelledby={`faq-accordion-heading-3-${item.id}`}
              data-bs-parent="#faq_accordion_3"
            >
              <div className="accordion-body">
                <p>{item.body}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
    </>
  );
}
