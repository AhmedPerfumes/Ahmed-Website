import React from "react";
import DescriptionSection from "./DescriptionSection";
import "./ProductDescription.css";

const ProductDescription = ({ product }) => {
    if (!product) {
        return null; // Don't render anything if there is no product data
    }

    // Convert inline styles to JSX style objects
    const packagingTitleStyle = {
        textAlign: "center",
        color: "hsl(342, 28%, 69%)",
        fontSize: "18px",
    };
    const packagingTextStyle = {
        textAlign: "center",
    };

    return (
        <section className="product-single product-single__type-9 bg-dark text-white d-flex align-items-center justify-content-center p-5">
            <div className="product-single__details-list">
                {product.description && (
                    <>
                        <h2 className="product-single__details-list__title text-white">
                            Description
                        </h2>
                        <div className="product-single__details-list__content text-white">
                            <div className="product-single__description">
                                <div
                                    dangerouslySetInnerHTML={{
                                        __html: product.description,
                                    }}
                                />
                            </div>
                        </div>
                    </>
                )}

                {(() => {
                    const showImageTextLayout = product.note_1 && product.note_1_image && product.note_2 && product.note_2_image && product.note_3 && product.note_3_image;

                    const hasNotesData = product.note_1 || product.note_2 || product.note_3;

                    return (
                        hasNotesData && (
                            <>
                                <h2 className="product-single__details-list__title text-white">
                                    Fragrance Notes
                                </h2>
                                <div className="product-single__details-list__content text-white">
                                    {/* Top Notes */}
                                    {showImageTextLayout ? (
                                        <DescriptionSection
                                            image={product.note_1_image}
                                            title="Top Notes"
                                            text={product.note_1}
                                            imagePosition="left"
                                        />
                                    ) : (
                                        product.note_1 && (
                                            <div className="simple-note">
                                                <h3 className="simple-note__title">
                                                    Top Notes
                                                </h3>
                                                <p className="simple-note__description">
                                                    {product.note_1}
                                                </p>
                                            </div>
                                        )
                                    )}

                                    {/* Heart Notes */}
                                    {showImageTextLayout ? (
                                        <DescriptionSection
                                            image={product.note_2_image}
                                            title="Heart Notes"
                                            text={product.note_2}
                                            imagePosition="right"
                                        />
                                    ) : (
                                        product.note_2 && (
                                            <div className="simple-note">
                                                <h3 className="simple-note__title">
                                                    Heart Notes
                                                </h3>
                                                <p className="simple-note__description">
                                                    {product.note_2}
                                                </p>
                                            </div>
                                        )
                                    )}

                                    {/* Base Notes */}
                                    {showImageTextLayout ? (
                                        <DescriptionSection
                                            image={product.note_3_image}
                                            title="Base Notes"
                                            text={product.note_3}
                                            imagePosition="left"
                                        />
                                    ) : (
                                        product.note_3 && (
                                            <div className="simple-note">
                                                <h3 className="simple-note__title">
                                                    Base Notes
                                                </h3>
                                                <p className="simple-note__description">
                                                    {product.note_3}
                                                </p>
                                            </div>
                                        )
                                    )}
                                </div>
                            </>
                        )
                    );
                })()}
            </div>
        </section>
    );
};

export default ProductDescription;
