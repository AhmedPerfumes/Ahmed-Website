import { useState, useEffect } from "react"; // Import useEffect
import ProductDescription from "./ProductDescription";
import CustomerReviews from "./CustomerReviews";
import './ProductDescription.css'

const ProductInfoTabs = ({ product, category, subcategory }) => {
    // --- VALIDATION: Check if there is any valid fragrance note data ---
    // This determines if we should show the "Fragrance Timeline" tab at all.
    const hasFragranceNotes = product && (
        (product.note_1 && product.note_1_image) ||
        (product.note_2 && product.note_2_image) ||
        (product.note_3 && product.note_3_image)
    );

    // --- CHANGE: Set the default active tab to 'reviews' ---
    const [activeTab, setActiveTab] = useState('reviews');

    // This effect handles the edge case where the default tab ('reviews') might
    // not be the best initial choice if there are no notes.
    // If fragrance notes DO exist, we will set that as the default tab.
    // Otherwise, it will remain 'reviews'.
    useEffect(() => {
        if (hasFragranceNotes) {
            setActiveTab('timeline');
        } else {
            setActiveTab('reviews');
        }
    }, [product, hasFragranceNotes]); // Rerun this logic if the product data changes

    // If the component is still waiting for product data, show a loading state.
    if (!product) {
        return (
            <div style={{ padding: '40px', textAlign: 'center', background: '#111', color: 'white', minHeight: '50vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                Loading product information...
            </div>
        )
    }

    const fullProductData = { ...product, category, subcategory };

    // If there is no data for notes AND no data for reviews (hypothetically)
    // you might want to hide the whole section. For now, we assume reviews are always possible.
    
    return (
        <>
            <div className="product-tabs-container container">
                <div className="tab-headers">
                    
                    {/* --- CHANGE: Conditionally render the Fragrance Timeline button --- */}
                    {/* This button will now only appear if hasFragranceNotes is true. */}
                    {hasFragranceNotes && (
                        <button 
                            className={`tab-header ${activeTab === 'timeline' ? 'active' : ''}`} 
                            onClick={() => setActiveTab('timeline')}
                        >
                            Fragrance Timeline
                        </button>
                    )}

                    {/* The Customer Reviews button is always available */}
                    <button 
                        className={`tab-header ${activeTab === 'reviews' ? 'active' : ''}`} 
                        onClick={() => setActiveTab('reviews')}
                    >
                        Customer Reviews
                    </button>
                </div>

                <div className="tab-content">
                    {/* The content will correctly render based on the active tab */}
                    {activeTab === 'timeline' && <ProductDescription product={fullProductData} />}
                    {activeTab === 'reviews' && <CustomerReviews product={fullProductData} />}
                </div>
            </div>
        </>
    );
};

export default ProductInfoTabs;