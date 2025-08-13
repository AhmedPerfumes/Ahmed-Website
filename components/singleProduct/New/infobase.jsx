"use client";

import { useEffect, useState } from "react";

import ThumbLarge from "./Common/thumb-large";
import Top from "./Common/top";
import Description from "./Common/description";
import Checkout from "./Common/checkout";

const InfoBase = ({ images, product, onThumbnailClick }) => {
  const description = "This expressive scent shall envelop every ripple of your being like slippery smooth silk and become one with your soul. The heady notes of musk wafting upwards through the fresh and sweet rose notes and tangy flavourful raspberry top notes is similar to the raw earthy smells of damp mud reaching you through the overlying bed of blooming flowers interspersed with juicy ripe berries. The white square bottle embodies the raw beauty of human touch and intimacy through its untouched notes of musk and rose, making this fragrance feel like a part of you.";

  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Runs only on client
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    // console.log(product?.product_name && t(he.decode(product?.product_name)), "Product Name");

    checkMobile(); // initial check
    window.addEventListener("resize", checkMobile);

    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  

  return (
    <div
      className="container"
      style={{
        maxWidth: "500px",
        fontFamily: "serif",
        display: "flex",
        flexDirection: "column",
        minHeight: isMobile ? "auto" : "100vh",
      }}
    >
      <div className="d-none d-lg-block">
        <Top product={product} />
      </div>
      <div className="h1"></div>
      <Description description={description} />
      <ThumbLarge images={images} onThumbnailClick={onThumbnailClick} />
      <Checkout product={product} />
    </div>
  );
};

export default InfoBase;
