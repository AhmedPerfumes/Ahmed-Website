import { shopCategories } from "@/data/categories";
import React from "react";
import Image from "next/image";

export default function Categories() {
  return (
    <section
      className="full-width_padding"
      // style={{ backgroundColor: "#faf9f8" }}
    >
      <div className="shop-categories position-relative">
        <h2 className="h3 pb-3 mb-4 fw-normal text-uppercase text-center">
        EAU DE PARFUM
        </h2>
        <p className="fs-6 fw-medium mb-4 text-center mw-930">
          Like a drop of perfume behind the ear, at the nape of the neck, on the inner wrists or in the décolleté, where the fragrance blends seamlessly with the skin to create a unique scent. Guerlain has left its mark on the history of modern fragrances with a series of olfactory creations that tell tales both real and imagined, inspired by romantic encounters, literary classics and journeys to distant lands. Examples include Shalimar, Habit Rouge and, more recently, La Petite Robe Noire. An unparalleled range of fragrances to indulge the senses.
        </p>

        <div className="shop-categories__list d-flex align-items-center flex-wrap justify-content-center">
          {shopCategories.map((elm, i) => (
            <a key={i} href="#" className="shop-categories__item mb-3">
              <video
                loading="lazy"
                // src={elm.imgSrc}
                width="120"
                height="120"
                // alt="Women Tops"
                className="shop-categories__item-img rounded-circle"
                autoPlay
                loop
                muted
              >
                <source src={elm.videoSrc} type="video/mp4" />
              </video>
              <h6 className="pt-1 mt-3 mt-xl-4 mb-0 text-center">
                {elm.category.split(" ").slice(0, 1).join(" ")}
                <br />
                {elm.category.split(" ").slice(1).join(" ")}
              </h6>
            </a>
          ))}
        </div>
      </div>
      {/* <!-- /.shop-categories position-relative --> */}
    </section>
  );
}
