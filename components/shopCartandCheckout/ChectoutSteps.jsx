"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { useLocale } from "next-intl";

const CartIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
    <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
  </svg>
);

const ShippingIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="1" y="3" width="15" height="13" rx="1"/>
    <path d="M16 8h4l3 5v3h-7V8z"/>
    <circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/>
  </svg>
);

const ConfirmIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
    <polyline points="22 4 12 14.01 9 11.01"/>
  </svg>
);

const CheckDoneIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12"/>
  </svg>
);

const steps = [
  {
    id: 1,
    href: "/shop-cart",
    title: "Cart",
    description: "Your items",
    Icon: CartIcon,
  },
  {
    id: 2,
    href: "/shop-checkout",
    title: "Checkout",
    description: "Shipping & payment",
    Icon: ShippingIcon,
  },
  {
    id: 3,
    href: "/shop-order-complete",
    title: "Confirmed",
    description: "Order placed",
    Icon: ConfirmIcon,
  },
];

export default function ChectoutSteps() {
  const locale = useLocale();
  const [activePathIndex, setactivePathIndex] = useState(0);
  const pathname = usePathname();

  useEffect(() => {
    const activeTab = steps.filter((elm) => elm.href == "/" + pathname.split("/")[2])[0];
    const activeTabIndex = steps.indexOf(activeTab);
    setactivePathIndex(activeTabIndex);
  }, [pathname]);

  return (
    <div className="checkout-steps">
      {steps.map((elm, i) => {
        const isCompleted = activePathIndex > i;
        const isActive = activePathIndex === i;
        const Icon = elm.Icon;
        return (
          <Link
            key={i}
            href={elm.id === 3 ? "#" : `/${locale}${elm.href}`}
            className={`checkout-steps__item${isActive ? " active" : ""}${isCompleted ? " completed" : ""}`}
          >
            {/* Connector line (not on first item) */}
            {i > 0 && <span className="checkout-steps__connector" />}

            <span className="checkout-steps__icon-wrap">
              {isCompleted ? <CheckDoneIcon /> : <Icon />}
            </span>

            <span className="checkout-steps__item-title">
              <span>{elm.title}</span>
              <em>{elm.description}</em>
            </span>
          </Link>
        );
      })}
    </div>
  );
}
