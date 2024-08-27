"use client";
import React from "react";
import Link from "next/link";

export default function Wedding() {
  return (
    <div className="bg-white">
      <div className="container text-center pt-5 ">
        <h4 className="fs-4 text-uppercase">
          We would like to create your memorable day to be remembered forever!
        </h4>
        <h2 className="fs-2 text-uppercase pt-4">Wedding packages</h2>
      </div>
      <div className="container">
        <div className="row align-items-center">
          <div className="col-md-6">
            <img
              src="https://www.ahmed-perfume.com/wp-content/uploads/2023/11/multiple-products-1.png"
              className="img-fluid"
              alt="Description of image"
            />
          </div>
          <div className="col-md-6 px-5 mb-2">
            <p className="fs-2 text-center text-uppercase">
              Indulge in the Scent of Love
            </p>
            <p className="fs-6 text-center">
              Creating a truly aromatic ambiance that complements your special
              day.
            </p>
            <p className="fs-6 text-center">
              Discover the perfect blend of elegance and fragrance, as we curate
              a scented journey to accompany your magical celebration, leaving
              lasting memories for you and your guests.
            </p>
            <p className="fs-6 text-center">
              Trust us to make your wedding an unforgettable sensory experience.
            </p>

            <div className="d-flex justify-content-center">
              <Link
                href="/shop-1"
                className="btn-link btn-link_lg default-underline text-uppercase fw-medium"
              >
                Know More
              </Link>
            </div>
          </div>
        </div>
      </div>
      <div className="container">
        <div className="row align-items-center">
          <div className="col-md-6 px-5 mb-2">
            <p className="fs-2 text-center text-uppercase">
              Wedding Service we offer
            </p>
            <p className="fs-6 text-center">
              We provide a perfuming service for the purpose of welcoming your
              guests with some of the best Arabic and French perfumes as well as
              luxury oils with incense and Oud Ma'attar.
            </p>
            <p className="fs-6 text-center">
              Elevate every welcoming moment with a delicate blend of scents
              that captivate and embrace, leaving an indelible mark of
              sophistication and luxury.
            </p>

            <div className="d-flex justify-content-center">
              <Link
                href="/shop-1"
                className="btn-link btn-link_lg default-underline text-uppercase fw-medium"
              >
                Know More
              </Link>
            </div>
          </div>

          <div className="col-md-6">
            <img
              src="https://www.ahmed-perfume.com/wp-content/uploads/2023/11/multiple-products-2.png"
              className="img-fluid"
              alt="Description of image"
            />
          </div>
        </div>
      </div>

      <div className="container pt-5">
        <h2 className="fs-2 text-uppercase text-center mb-5">
          Wedding Packages
        </h2>

        <div className="row">
          <div className="col-md-6 text-center">
            <img
              width={500}
              src="https://www.ahmed-perfume.com/wp-content/uploads/2023/11/setup-1.png"
              className="img-fluid mb-3"
              alt="First Wedding Package"
            />
            <h3 className="fs-3 text-uppercase">Enchanting Harbor</h3>
            <h4 className="fs-6 text-uppercase fw-bold">package 1</h4>
            <h4 className="fs-5 fw-bold" style={{ color: "#C58B14" }}>
              6000 Aed
            </h4>

            <p className="lh-sm">With AMG Luxury Stand (Enchanting Harbor)</p>
            <p className="lh-sm">1 Gift for the Bride & Groom</p>
            <p className="lh-sm">20 best-selling perfumes</p>
            <p className="lh-sm">3 types of Luxury oils (Arabic & French)</p>
            <p className="lh-sm">2 types of incense</p>
            <p className="lh-sm">2 types of scented oud</p>

            <div className="d-flex justify-content-center pt-4">
              <Link
                href="/shop-1"
                className="btn-link btn-link_lg default-underline text-uppercase fw-medium "
              >
                Know More
              </Link>
            </div>
          </div>

          <div className="col-md-6 text-center">
            <img
              width={500}
              src="https://www.ahmed-perfume.com/wp-content/uploads/2023/11/setup-2.png"
              className="img-fluid mb-3"
              alt="Second Wedding Package"
            />
            <h3 className="fs-3 text-uppercase">Modern Bliss</h3>
            <h4 className="fs-6 text-uppercase fw-bold pt-1">package 2</h4>
            <h4 className="fs-5 fw-bold" style={{ color: "#C58B14" }}>
              4000 Aed
            </h4>

            <p className="lh-sm">With AMG Golden stand (Modern Bliss)</p>
            <p className="lh-sm">15 best-selling perfumes</p>
            <p className="lh-sm">2 types of luxury oils (Arabic & French)</p>
            <p className="lh-sm">2 types of incense</p>
            <p className="lh-sm">2 types of scented oud</p>
            <div className="d-flex justify-content-center pt-4">
              <Link
                href="/shop-1"
                className="btn-link btn-link_lg default-underline text-uppercase fw-medium"
              >
                Know More
              </Link>
            </div>
          </div>
        </div>
      </div>
      <div className="container pt-5">
        <div className="row">
          <div className="col-md-6 text-center">
            <img
              width={500}
              src="https://www.ahmed-perfume.com/wp-content/uploads/2023/11/setup-1.png"
              className="img-fluid mb-3"
              alt="First Wedding Package"
            />
            <h3 className="fs-2 text-uppercase">Enchanting Harbor</h3>
            <h4 className="fs-4 text-uppercase fw-bold">package 3</h4>
            <h4 className="fs-5 fw-bold" style={{ color: "#C58B14" }}>
              2000 Aed
            </h4>

            <p className="lh-sm">With AMG Golden stand (Modern Bliss)</p>
            <p className="lh-sm">15 best-selling perfumes</p>
            <p className="lh-sm">2 types of luxury oils (Arabic & French)</p>
            <p className="lh-sm">2 types of incense</p>
            <p className="lh-sm">2 types of scented oud</p>
            <div className="d-flex justify-content-center pt-4">
              <Link
                href="/shop-1"
                className="btn-link btn-link_lg default-underline text-uppercase fw-medium"
              >
                Know More
              </Link>
            </div>
          </div>

          <div className="col-md-6 text-center">
            <img
              width={500}
              src="https://www.ahmed-perfume.com/wp-content/uploads/2023/11/setup-2.png"
              className="img-fluid mb-3"
              alt="Second Wedding Package"
            />
            <h3 className="fs-2 text-uppercase">Modern Bliss</h3>
            <h4 className="fs-4 text-uppercase fw-bold">package 4</h4>
            <h4 className="fs-5 fw-bold" style={{ color: "#C58B14" }}>
              1500 Aed
            </h4>

            <p className="lh-sm">With AMG Golden stand (Modern Bliss)</p>
            <p className="lh-sm">15 best-selling perfumes</p>
            <p className="lh-sm">2 types of luxury oils (Arabic & French)</p>
            <p className="lh-sm">2 types of incense</p>
            <p className="lh-sm">2 types of scented oud</p>
            <div className="d-flex justify-content-center pt-4">
              <Link
                href="/shop-1"
                className="btn-link btn-link_lg default-underline text-uppercase fw-medium"
              >
                Know More
              </Link>
            </div>
          </div>
        </div>
      </div>
      <div className="container pt-5">
        <div className="row align-items-center">
          <div className="col-md-6 px-5 mb-2">
            <p className="fs-2 text-center text-uppercase">
              Indulge in the scent of{" "}
            </p>
            <p className="fs-6 text-center">
              The wedding day is a day that will be remembered forever. And how
              beautiful it would be if the joy of life was crowned with a
              breath-taking fragrant and a precious memory that will be
              remembered at all times.
            </p>
            <p className="fs-6 text-center">
              Ahmed Al Maghribi Perfumes offers you a wedding service and the
              possibility of being present at wedding parties with the finest
              types of incense, luxurious oils, fragrant oud perfumes that are
              presented in coordination distinctive honoring guests.
            </p>

            <div className="d-flex justify-content-center pt-3">
              <Link
                href="/shop-1"
                className="btn-link btn-link_lg default-underline text-uppercase fw-medium"
              >
                Know More
              </Link>
            </div>
          </div>

          <div className="col-md-6">
            <img
              src="https://www.ahmed-perfume.com/wp-content/uploads/2023/11/weeding-min.png"
              className="img-fluid"
              alt="Description of image"
            />
          </div>
        </div>
      </div>
      <div className="pt-5"></div>
    </div>
  );
}
