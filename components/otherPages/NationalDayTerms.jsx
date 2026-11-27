import React from "react";
import "./NationalDayTerms.css";

const INTRO =
  "Celebrate the 55th National Day with exclusive offers from Ahmed Al Maghribi Perfumes! Enjoy special promotions across selected products. Please read the following Terms & Conditions before placing your order.";

const SECTIONS = [
  {
    title: "Buy 3, Get 1 Free Offer",
    points: [
      "This offer is applicable only to selected products participating in the Buy 3, Get 1 Free promotion.",
      'Eligible products will be clearly identified with a "Buy 3 Get 1 Free" badge on the product listing.',
      "Customers must Add 4 eligible products to your cart and get 1 product free. Pay for only 3 products and receive the 4th free, subject to the promotional offer.",
      "A maximum quantity of 2 units per product is allowed under this promotion.",
      "Products not displaying the Buy 3 Get 1 Free badge are not eligible for this offer.",
      "This promotion cannot be combined with other promotional offers unless explicitly stated.",
    ],
  },
  {
    title: "55th National Day – Special Ending in 5 Sale",
    points: [
      "Selected products are offered at special promotional prices ending in the digit 5, as part of our 55th National Day celebration.",
      "For example, a product originally priced at AED 180 may be offered at AED 155 or AED 175.",
      "Eligible products will be identified with a Sale badge on the product listing.",
      "These products are part of a separate promotion and are not eligible for the Buy 3 Get 1 Free offer.",
      "This promotion cannot be combined with any other promotional offer.",
    ],
  },
  {
    title: "Up to 30% Off – Selected Products",
    points: [
      "Additional discounts of up to 30% are available on selected products.",
      "The applicable discount percentage will be displayed on each eligible product through a discount badge.",
      "The discount applies only to products specifically marked as part of this promotion.",
      "Products included in this promotion are separate from the Buy 3 Get 1 Free and 55th National Day Ending in 5 promotions.",
      "These discounts cannot be combined with other promotional offers.",
    ],
  },
  {
    title: "Exclusion – AURIC New Launch",
    points: [
      "The newly launched Oud & Roses AURIC is excluded from all National Day promotional offers.",
      "No discounts or promotional benefits apply to Oud & Roses AURIC.",
    ],
  },
  {
    title: "General Terms & Conditions",
    points: [
      "All promotions are valid on selected products only.",
      "Each promotional offer applies exclusively to products carrying its respective promotional badge.",
      "The three promotional categories are separate and cannot be combined or stacked.",
      "Promotional prices and discounts are applicable only during the campaign period.",
      "Offers are subject to product availability and while stocks last.",
      "Ahmed Al Maghribi Perfumes reserves the right to modify, suspend, or withdraw any promotional offer in accordance with applicable laws.",
      "In case of any promotional pricing or technical discrepancies, customers are encouraged to contact our customer support team before completing their purchase.",
    ],
  },
];

export default function NationalDayTerms() {
  return (
    <main className="ndt">
      <h1 className="ndt__title">UAE National Day Offers</h1>
      <p className="ndt__sub">Terms &amp; Conditions</p>
      <p className="ndt__intro">{INTRO}</p>

      {SECTIONS.map((section, i) => (
        <section className="ndt__section" key={section.title}>
          <h2 className="ndt__heading">
            {i + 1}. {section.title}
          </h2>
          <ul className="ndt__list">
            {section.points.map((p) => (
              <li key={p}>{p}</li>
            ))}
          </ul>
        </section>
      ))}

      <p className="ndt__thanks">
        Thank you for celebrating the 55th National Day with Ahmed Al Maghribi Perfumes!
      </p>
    </main>
  );
}
