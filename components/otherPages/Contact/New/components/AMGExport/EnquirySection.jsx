import React, { useState, useRef } from 'react';
import styles from './AMGExport.module.css';

const InteractiveMap = () => {
    const tooltipRef = useRef(null);
    const mapRef = useRef(null);

    const regionData = {
        'North America': 'Established presence in key markets.',
        'South America': 'Growing network of distributors.',
        'Europe': 'Strong partnerships in UK, France, and Germany.',
        'Africa': 'Expanding into new and emerging markets.',
        'Asia': 'Headquartered in the UAE with extensive reach across the continent.',
        'Australia': 'Serving major cities and online retailers.'
    };

    const handleMouseMove = (e, region) => {
        const tooltip = tooltipRef.current;
        const mapRect = mapRef.current.getBoundingClientRect();
        tooltip.innerHTML = `<strong>${region}</strong><br>${regionData[region]}`;
        tooltip.style.opacity = '1';
        tooltip.style.left = `${e.clientX - mapRect.left + 15}px`;
        tooltip.style.top = `${e.clientY - mapRect.top + 15}px`;
    };

    const handleMouseLeave = () => {
        tooltipRef.current.style.opacity = '0';
    };

    return (
        <div className={styles.enquiryMap}>
            <div ref={tooltipRef} className={styles.mapTooltip}></div>
            <svg ref={mapRef} viewBox="0 0 1000 500" xmlns="http://www.w3.org/2000/svg" className={styles.mapSvg}>
                <path className={styles.mapPath} data-region="North America" onMouseMove={(e) => handleMouseMove(e, 'North America')} onMouseLeave={handleMouseLeave} d="M10 210 L100 150 L250 10 L400 150 L350 250 L200 300 Z" />
                <path className={styles.mapPath} data-region="South America" onMouseMove={(e) => handleMouseMove(e, 'South America')} onMouseLeave={handleMouseLeave} d="M280 320 L350 260 L450 350 L350 480 Z" />
                <path className={styles.mapPath} data-region="Europe" onMouseMove={(e) => handleMouseMove(e, 'Europe')} onMouseLeave={handleMouseLeave} d="M420 150 L550 120 L580 200 L480 220 Z" />
                <path className={styles.mapPath} data-region="Africa" onMouseMove={(e) => handleMouseMove(e, 'Africa')} onMouseLeave={handleMouseLeave} d="M460 230 L600 210 L650 380 L500 400 Z" />
                <path className={styles.mapPath} data-region="Asia" onMouseMove={(e) => handleMouseMove(e, 'Asia')} onMouseLeave={handleMouseLeave} d="M560 100 L950 80 L850 350 L610 220 Z" />
                <path className={styles.mapPath} data-region="Australia" onMouseMove={(e) => handleMouseMove(e, 'Australia')} onMouseLeave={handleMouseLeave} d="M800 400 L950 380 L900 480 Z" />
            </svg>
        </div>
    );
};

const EnquiryForm = () => {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setTimeout(() => {
            setIsSubmitting(false);
            setIsSubmitted(true);
        }, 1500);
    };

    if (isSubmitted) {
        return (
            <div className={styles.enquiryFormWrapper}>
                <div className={styles.enquiryForm}>
                    <div className={styles.successMessage}>
                        Thank you for your inquiry! Our team will get back to you shortly.
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className={styles.enquiryFormWrapper}>
            <form onSubmit={handleSubmit} className={styles.enquiryForm}>
                <div className={styles.formGrid}>
                    <div className={styles.formGroup}>
                        <label htmlFor="fullName">Full Name</label>
                        <input type="text" id="fullName" className={styles.formInput} required />
                    </div>
                    <div className={styles.formGroup}>
                        <label htmlFor="companyName">Company Name</label>
                        <input type="text" id="companyName" className={styles.formInput} required />
                    </div>
                    <div className={styles.formGroup}>
                        <label htmlFor="email">Email Address</label>
                        <input type="email" id="email" className={styles.formInput} required />
                    </div>
                    <div className={styles.formGroup}>
                        <label htmlFor="phone">Phone Number</label>
                        <input type="tel" id="phone" className={styles.formInput} required />
                    </div>
                    <div className={styles.formGroup}>
                        <label htmlFor="country">Country</label>
                        <select id="country" className={styles.formSelect} required>
                            <option value="">Select a Country</option>
                            <option value="AE">United Arab Emirates</option>
                            <option value="SA">Saudi Arabia</option>
                            <option value="IN">India</option>
                            <option value="US">United States</option>
                            <option value="GB">United Kingdom</option>
                        </select>
                    </div>
                    <div className={styles.formGroup}>
                        <label htmlFor="inquiryType">Type of Inquiry</label>
                        <select id="inquiryType" className={styles.formSelect} required>
                            <option value="distribution">Distribution</option>
                            <option value="wholesale">Wholesale</option>
                            <option value="franchise">Franchise</option>
                            <option value="other">Other</option>
                        </select>
                    </div>
                </div>
                <div className={styles.formGroup} style={{ marginBottom: '1.5rem' }}>
                    <label htmlFor="message">Message</label>
                    <textarea id="message" rows="4" className={styles.formTextarea}></textarea>
                </div>
                <button type="submit" className={`${styles.btnGold} ${styles.submitBtn}`} disabled={isSubmitting}>
                    {isSubmitting && (
                        <svg className={styles.submitBtnSpinner} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle opacity="25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path opacity="75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                    )}
                    {isSubmitting ? 'Submitting...' : 'Submit Inquiry'}
                </button>
            </form>
        </div>
    );
};


const EnquirySection = () => (
    <section id="enquiry-form" className={styles.enquirySection}>
        <div className={styles.container}>
            <h2 className={styles.sectionTitle}>Join Our Global Network</h2>
            <p className={styles.sectionSubtitle}>
                We are actively seeking passionate partners to expand our horizons. Hover over the map to see our presence and fill out the form to start your journey with us.
            </p>
            <div className={styles.enquiryContainer}>
                <InteractiveMap />
                <EnquiryForm />
            </div>
        </div>
    </section>
);

export default EnquirySection;