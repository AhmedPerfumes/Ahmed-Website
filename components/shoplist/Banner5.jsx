import React from "react";
import Link from "next/link";
import Image from "next/image";
import BannerLinks from "./BannerLinks";

export default function Banner5() {
  return (
    <section className="full-width_padding">
      <div
        className="container"
        style={{ borderColor: "#eeeeee" }}
      >
        <div className="shop-banner position-relative" style={{ minHeight: "37rem" }}>
          <div
            className="background-img"
            style={{ backgroundColor: "#eeeeee" }}
          >
            <Image
              loading="lazy"
              src="/assets/images/laathani-banner.jpg"
              width="1420"
              height="600"
              alt="Pattern"
              className="slideshow-bg__img object-fit-cover"
            />
          </div>

          {/* <div className="shop-banner__content container position-absolute start-50 top-50 translate-middle">
            <h2 className="h1 stroke-text smooth-16 text-uppercase fw-bold mb-3 mb-xl-4 mb-xl-5">
              WOMEN
            </h2>
            <ul className="d-flex flex-wrap list-unstyled text-uppercase h6">
              <BannerLinks />
            </ul>
          </div> */}
          {/* <!-- /.shop-banner__content --> */}
        </div>
        {/* <!-- /.shop-banner position-relative --> */}
      </div>
      {/* <!-- /.full-width_border --> */}
    </section>
  );
}
