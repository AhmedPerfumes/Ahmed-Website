"use client";
import React from "react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

export default function Banner5() {
  console.log(`${process.env.NEXT_PUBLIC_API_URL}api/products?category=${categoryName.split("-").join(" ").toUpperCase()}`);
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);

  const pathname = usePathname();
  const categoryName = pathname.split("/")[2];

  const fetchData = async () => {
    setLoading(true);
    // console.log(`${process.env.NEXT_PUBLIC_API_URL}api/blogs?page=${page}&limit=${limit}}`);
    // const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}api/blogs?page=${page}&limit=${limit}}`);
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}api/products?category=${categoryName.split("-").join(" ").toUpperCase()}`);
    const data = await res.json();
    // console.log(data);
    setImage(data.image); // Append new data
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []); // Fetch data on page change

  return (
    <section className="full-width_padding ">
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
              src={image ? `${process.env.NEXT_PUBLIC_API_URL}storage/${image}` : '/assets/images/home/demo10/grid_banner_4.jpg'}
              width="1920"
              height="1000"
              alt="Pattern"
              className="slideshow-bg__img object-fit-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
