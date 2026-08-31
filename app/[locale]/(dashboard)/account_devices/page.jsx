import ActiveDevices from "@/components/otherPages/ActiveDevices";
import React from "react";

export const metadata = {
  title: "Active Devices | Ahmed Al Maghribi Perfumes",
  description: "Manage your active device login sessions.",
  icons: {
    icon: "/assets/images/ahmed-favicon.png",
  },
};

export default function AccountDevicesPage() {
  return <ActiveDevices />;
}
