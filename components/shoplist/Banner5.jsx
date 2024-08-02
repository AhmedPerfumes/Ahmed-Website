import React from "react";
import Link from "next/link";
import Image from "next/image";
import BannerLinks from "./BannerLinks";

export default function Banner5() {
  return (
    <section className="full-width_padding">
      <div className="container-fluid" style={{ borderColor: "#eeeeee" }}>
        <div
          className="shop-banner position-relative"
          style={{ minHeight: "37rem" }}
        >
          <div
            className="background-img"
            style={{ backgroundColor: "#eeeeee" }}
          >
            <Image
              loading="lazy"
              src="/assets/images/laathani-banner.jpg"
              width="1920"
              height="1000"
              alt="Pattern"
              className="slideshow-bg__img object-fit-contain"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
