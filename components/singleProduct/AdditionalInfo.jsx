import React from "react";

export default function AdditionalInfo() {
  return (
    // <div className="product-single__addtional-info">
    //   <div className="item">
    //     <label className="h6">Weight</label>
    //     <span>1.25 kg</span>
    //   </div>
    //   <div className="item">
    //     <label className="h6">Dimensions</label>
    //     <span>90 x 60 x 90 cm</span>
    //   </div>
    //   <div className="item">
    //     <label className="h6">Size</label>
    //     <span>XS, S, M, L, XL</span>
    //   </div>
    //   <div className="item">
    //     <label className="h6">Color</label>
    //     <span>Black, Orange, White</span>
    //   </div>
    //   <div className="item">
    //     <label className="h6">Storage</label>
    //     <span>Relaxed fit shirt-style dress with a rugged</span>
    //   </div>
    // </div>
    <>
    <div className="mw-930 d-lg-flex align-items-lg-center">
          <div className="image-wrapper col-lg-6">
            <img
              style={{ height: "fit-content" }}
              className="h-auto"
              loading="lazy"
              src="/assets/images/about/about-2.jpg"
              width="450"
              height="500"
              alt="image"
            />
          </div>
          <div className="content-wrapper col-lg-6 px-lg-4">
            <h5 className="mb-3">The Company</h5>
            <p>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Amet
              sapien dignissim a elementum. Sociis metus, hendrerit mauris id
              in. Quis sit sit ultrices tincidunt euismod luctus diam. Turpis
              sodales orci etiam phasellus lacus id leo. Amet turpis nunc, nulla
              massa est viverra interdum. Praesent auctor nulla morbi non
              posuere mattis. Arcu eu id maecenas cras.
            </p>
          </div>
        </div>
        
        <div className="mw-930 d-lg-flex align-items-lg-center">
        <div className="content-wrapper col-lg-6 px-lg-4">
            <h5 className="mb-3">The Company</h5>
            <p>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Amet
              sapien dignissim a elementum. Sociis metus, hendrerit mauris id
              in. Quis sit sit ultrices tincidunt euismod luctus diam. Turpis
              sodales orci etiam phasellus lacus id leo. Amet turpis nunc, nulla
              massa est viverra interdum. Praesent auctor nulla morbi non
              posuere mattis. Arcu eu id maecenas cras.
            </p>
          </div>
          <div className="image-wrapper col-lg-6">
            <img
              style={{ height: "fit-content" }}
              className="h-auto"
              loading="lazy"
              src="/assets/images/about/about-2.jpg"
              width="450"
              height="500"
              alt="image"
            />
          </div>
        </div>

        <div className="mw-930 d-lg-flex align-items-lg-center">
          <div className="image-wrapper col-lg-6">
            <img
              style={{ height: "fit-content" }}
              className="h-auto"
              loading="lazy"
              src="/assets/images/about/about-2.jpg"
              width="450"
              height="500"
              alt="image"
            />
          </div>
          <div className="content-wrapper col-lg-6 px-lg-4">
            <h5 className="mb-3">The Company</h5>
            <p>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Amet
              sapien dignissim a elementum. Sociis metus, hendrerit mauris id
              in. Quis sit sit ultrices tincidunt euismod luctus diam. Turpis
              sodales orci etiam phasellus lacus id leo. Amet turpis nunc, nulla
              massa est viverra interdum. Praesent auctor nulla morbi non
              posuere mattis. Arcu eu id maecenas cras.
            </p>
          </div>
        </div>

        <div className="d-lg-flex align-items-lg-center">
        <div className="content-wrapper col-lg-12">
            <h5 className="mb-3">LES PARFUMS, A SPELLBINDING INTENSITY</h5>
          </div>
          <div className="image-wrapper col-lg-12">
            <video
              style={{ height: "fit-content" }}
              className="h-auto"
              autoPlay
              loop
              muted
              src="https://www.ahmed-perfume.com/wp-content/uploads/2024/03/laathani-short.mp4"
              width="450"
              height="500"
              alt=""
            />
          </div>
        </div>
        </>
  );
}
