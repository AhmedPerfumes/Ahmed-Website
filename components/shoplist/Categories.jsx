"use client";
import { shopCategories } from "@/data/categories";
import React from "react";
import Image from "next/image";

import { useSearchParams } from "next/navigation";

import Categoriess from "@/components/homes/home-3/Categories";

export default function Categories() {
  const searchParams = useSearchParams();
  const category = searchParams.get("category");
  const subcategory = searchParams.get("subcategory");

  return (
    <>
      <section
        className="full-width_padding"
        // style={{ backgroundColor: "#faf9f8" }}
      >
        <div className="shop-categories position-relative">
          <h2 className="h3 pb-3 mb-4 fw-normal text-uppercase text-center">
            {subcategory == null ? "EAU DE PARFUM" : "ORIENTAL FRAGRANCE"}
          </h2>
          <p className="fs-6 fw-medium mb-4 text-center mw-930">
            Like a drop of perfume behind the ear, at the nape of the neck, on
            the inner wrists or in the décolleté, where the fragrance blends
            seamlessly with the skin to create a unique scent. Guerlain has left
            its mark on the history of modern fragrances with a series of
            olfactory creations that tell tales both real and imagined, inspired
            by romantic encounters, literary classics and journeys to distant
            lands. Examples include Shalimar, Habit Rouge and, more recently, La
            Petite Robe Noire. An unparalleled range of fragrances to indulge
            the senses.
          </p>
        </div>
      </section>
      {subcategory == null ? <Categoriess /> : null}
    </>
  );
}
