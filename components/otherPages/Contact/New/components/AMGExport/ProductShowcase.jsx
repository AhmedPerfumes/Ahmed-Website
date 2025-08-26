import React from 'react';
import styles from './AMGExport.module.css';

const ProductCard = ({ product, onProductClick }) => (
    <div className={styles.productCard} onClick={() => onProductClick(product)}>
        <div className={styles.productCardImageWrapper}>
            <img src={product.imageUrl} alt={product.name} />
        </div>
        <h3>{product.name}</h3>
        <p>{product.tagline}</p>
    </div>
);

const ProductShowcase = ({ onProductClick }) => {
    const products = [
        { name: 'Bin Shaikh', tagline: 'The Scent of Royalty', description: 'A majestic blend of oud and rose, Bin Shaikh is a royal fragrance that commands attention. A bestseller in over 50 countries.', imageUrl: 'https://placehold.co/600x600/b8860b/ffffff?text=Bin+Shaikh' },
        { name: 'Oud & Roses', tagline: 'Timeless Elegance', description: 'A classic combination, this fragrance is a poetic dance between the deep, woody notes of oud and the delicate sweetness of Turkish roses.', imageUrl: 'https://placehold.co/600x600/a0740a/ffffff?text=Oud+%26+Roses' },
        { name: 'Kaaf', tagline: 'A Wave of Freshness', description: 'An invigorating and fresh scent with citrus and aquatic notes, perfect for the modern individual. A top performer in warmer climates.', imageUrl: 'https://placehold.co/600x600/8c6c3a/ffffff?text=Kaaf' },
        { name: 'Marj', tagline: 'The Scent of a Garden', description: 'A sweet and floral fragrance that captures the essence of a blooming garden. Marj is a celebration of femininity and grace.', imageUrl: 'https://placehold.co/600x600/78582a/ffffff?text=Marj' },
    ];

    return (
        <section className={styles.productSection}>
            <div className={styles.container}>
                <h2 className={styles.sectionTitle}>Signature Scents for Global Markets</h2>
                <div className={styles.productGrid}>
                    {products.map(product => (
                        <ProductCard key={product.name} product={product} onProductClick={onProductClick} />
                    ))}
                </div>
            </div>
        </section>
    );
};

export default ProductShowcase;