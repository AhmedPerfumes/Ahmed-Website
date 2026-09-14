import AccountReviews from "@/components/otherPages/AccountReviews";
import React from "react";

export const metadata = {
  title: "My Reviews | Ahmed Al Maghribi Perfumes",
  description: "Manage and track your fragrance product reviews on Ahmed Al Maghribi Perfumes.",
  icons: {
    icon: "/assets/images/ahmed-favicon.png",
  },
};

export default function AccountReviewsPage() {
  return <AccountReviews />;
}
