"use client";
import React from "react";
import NewHero from "./NewHero";
import ProductSlider from "./ProductSlider";
import ProductShowcase from "./singleProduct/ProductShowcase/ProductShowcase";

const NewHomePage = () => {
    return (
        <React.Fragment>
            <NewHero />
            <ProductShowcase />
            <ProductSlider prodSlide="bestSellers" />
        </React.Fragment>
    );
};

export default NewHomePage;
