"use client";

import { useState } from "react";
import InfoBase from "./infobase";
import GalleryBase from "./gallerybase";
import ProductAccordion from "./accordian";
import "./base.css"
// import "./bootstrap-local.scss"
import Sticky from './sticky';
import { useEffect } from 'react';
import he from 'he';


const Base = ({product}) => {
    const cleanName = he.decode(product?.product_name || "Default");
    const [activeIndex, setActiveIndex] = useState(0);

    const images = product?.images ? JSON.parse(product.images) : [];
    useEffect(() => {
        require("bootstrap");
        console.log(product, "Product")
    }, [])

    return (
        <div className="App" style={{ backgroundColor: "#FAF9F7" }}>
            <div className="head-container container-fluid px-3 px-sm-4 px-lg-5">
                <div
                    className="d-flex flex-column flex-lg-row justify-content-center align-items-start gap-3 gap-lg-4 "
                    style={{ minHeight: "100vh" }}
                >
                    <div className="info-container order-2 order-lg-1">
                        <InfoBase
                            images={images}
                            product={product}
                            onThumbnailClick={setActiveIndex}
                        />
                    </div>

                    <div className="gallery-container d-flex justify-content-center order-1 order-lg-2">
                        <GalleryBase
                            images={images}
                            product={product}
                            activeIndex={activeIndex}
                            setActiveIndex={setActiveIndex}
                            onThumbnailClick={setActiveIndex}
                        />
                    </div>

                    <div className="accordion-container order-3 order-lg-3">
                        <ProductAccordion product={product}/>
                    </div>
                </div>

                <Sticky image={images[0]} name={cleanName} price={product?.price || "0.00"} product={product} />
            </div>
        </div>
    );
};

export default Base;
