"use client";
import React, { useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";

export const FacebookPixelEvents = () => {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    import("react-facebook-pixel")
      .then((x) => x.default)
      .then((ReactPixel) => {
        ReactPixel.init("235034997951707"); // Don't forget to replace this
        ReactPixel.pageView();
      });
  }, [pathname, searchParams]);

  return null;
};
