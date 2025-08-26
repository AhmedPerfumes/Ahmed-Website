"use client"; 
import React, { useState } from 'react';
import Hero from './Hero';
import Advantage from './Advantage';
import ProductShowcase from './ProductShowcase';
import Testimonials from './Testimonials';
import EnquirySection from './EnquirySection';
import Modal from './Modal';
// Note: We no longer import the CSS file here directly.
// Next.js handles this automatically when using CSS Modules.
// The global CSS should be imported in your root layout file.

export default function AMGExport() {
    const [selectedProduct, setSelectedProduct] = useState(null);

    const handleProductClick = (product) => {
        setSelectedProduct(product);
    };

    const handleCloseModal = () => {
        setSelectedProduct(null);
    };

    return (
        <main>
            <Hero />
            <Advantage />
            <ProductShowcase onProductClick={handleProductClick} />
            <Testimonials />
            <EnquirySection />
            <Modal product={selectedProduct} onClose={handleCloseModal} />
        </main>
    );
}