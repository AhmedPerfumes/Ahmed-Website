import React from "react";
import "./accordian.css";
import { useMenu } from "@/context/MenuContext";
import Image from "next/image";
// The InfoCard component is no longer used in this design, so you could remove the import.

const howToApplyContent = {
    "Care Essentials": {
        "Hair mist": {
            text: [
                "For a refreshing and long-lasting scent, spray the hair mist lightly onto your hair, holding the bottle 20–25 cm away. Focus on the mid-lengths and ends to avoid scalp contact.",
                "Apply on clean, dry hair or after styling. Avoid rubbing or brushing immediately after spraying to maintain the fragrance’s delicate notes.",
            ],
            imgSrc: "/assets/images/musk-roses-test/perfume-1.png",
        },
        "Body gel": {
            text: [
                "Apply a small amount of body gel evenly onto clean skin. Massage gently until fully absorbed to nourish the skin and enhance the fragrance experience.",
                "For optimal results, use after showering or moisturizing. Avoid applying on irritated or broken skin to preserve both skin health and fragrance quality.",
            ],
            imgSrc: "/assets/images/musk-roses-test/perfume-1.png",
        },
    },
    "hair-mist": {
        "hair-mist": {
            text: [
                "For a refreshing and long-lasting scent, spray the hair mist lightly onto your hair, holding the bottle 20–25 cm away. Focus on the mid-lengths and ends to avoid scalp contact.",
                "Apply on clean, dry hair or after styling. Avoid rubbing or brushing immediately after spraying to maintain the fragrance’s delicate notes.",
            ],
            imgSrc: "/assets/images/musk-roses-test/perfume-1.png",
        },
    },
    gel: {
        "body-gel": {
            text: [
                "Apply a small amount of body gel evenly onto clean skin. Massage gently until fully absorbed to nourish the skin and enhance the fragrance experience.",
                "For optimal results, use after showering or moisturizing. Avoid applying on irritated or broken skin to preserve both skin health and fragrance quality.",
            ],
            imgSrc: "/assets/images/musk-roses-test/perfume-1.png",
        },
    },

    "concentrated-parfum": {
        "concentrated-oil": {
            text: [
                "Apply a small drop of concentrated oil directly to pulse points — such as wrists, neck, and behind the ears. These naturally warm areas help diffuse and enhance the fragrance.",
                "Avoid rubbing after application, as it can break down the delicate top notes. A single drop is enough for a long-lasting and captivating scent.",
            ],
            imgSrc: "/assets/images/musk-roses-test/perfume-1.png",
        },
        "dehn-al-oud": {
            text: [
                "Dab a small amount of Dehn Al Oud oil on your pulse points — wrists, neck, and behind the ears. Let it absorb naturally to enjoy a rich and luxurious aroma.",
                "Avoid rubbing, as it can alter the fragrance. Use sparingly for a long-lasting effect that develops throughout the day.",
            ],
            imgSrc: "/assets/images/musk-roses-test/perfume-1.png",
        },
    },
    dakhoon: {
        bakhoor: {
            text: [
                "Place a piece of bakhoor on a hot charcoal or electric incense burner. Let the smoke fill your space for a rich and inviting fragrance experience.",
                "Avoid leaving the charcoal unattended. For best results, use in a well-ventilated area and keep out of reach of children.",
            ],
            imgSrc: "/assets/images/musk-roses-test/perfume-2.png",
        },
        "oud-maattar": {
            text: [
                "Apply a small amount of Oud Ma’Attar on clothing or use in a diffuser. Pulse points can also be gently dabbed for a personal long-lasting aroma.",
                "Use sparingly to avoid overpowering. Let the fragrance evolve naturally for a rich and sophisticated scent.",
            ],
            imgSrc: "/assets/images/musk-roses-test/perfume-2.png",
        },
        "air-freshener": {
            text: [
                "Spray the air freshener evenly around the room from a distance of 30 cm. Focus on corners, curtains, and soft furnishings to distribute the fragrance effectively.",
                "For a longer-lasting effect, repeat the application periodically and avoid spraying directly onto delicate surfaces that may be sensitive to moisture.",
            ],
            imgSrc: "/assets/images/musk-roses-test/perfume-1.png",
        },
    },
    "online-exclusive": {
        "online-exclusive": {
            text: [
                "For the most captivating and long-lasting experience, apply the perfume directly to your pulse points — wrists, neck, and behind the ears.",
                "Spray after moisturizing to help lock in the scent. Avoid rubbing the fragrance after application to preserve the delicate top notes.",
            ],
            imgSrc: "/assets/images/musk-roses-test/perfume-1.png",
        },
    },
    perfumes: {
        "oriental-fragrance": {
            text: [
                "Apply lightly on pulse points — wrists, neck, and behind ears. This helps the warm, rich notes evolve naturally throughout the day.",
                "For best results, apply after moisturizing and avoid rubbing. A few spritzes are enough for a long-lasting, captivating scent.",
            ],
            imgSrc: "/assets/images/musk-roses-test/perfume-1.png",
        },
        "occidental-fragrance": {
            text: [
                "Spray the perfume on pulse points — wrists, neck, and behind the ears — to allow the fragrance to develop naturally.",
                "Avoid rubbing after application to preserve the delicate top notes. Apply after moisturizing for a longer-lasting scent.",
            ],
            imgSrc: "/assets/images/musk-roses-test/perfume-1.png",
        },
    },
};
// A helper function to find the correct usage info
const getUsageInfo = (product) => {
    if (!product || !product.category || !howToApplyContent[product.category]) {
        return null; // No valid category found
    }

    const categoryData = howToApplyContent[product.category];
    // Find content by subcategory, or find the first/only entry if no subcategory matches
    const content =
        categoryData[product.subcategory] || Object.values(categoryData)[0];

    return content || null;
};

const ProductAccordion = ({ product }) => {
    const { shippingServiceCharges } = useMenu();
    console.log(shippingServiceCharges, "service");
    // --- Data Preparation ---

    const fragranceTypeMap = {
        // Personal Fragrance (By Concentration)
        parfum: "Extrait de Parfum / Parfum",
        edp: "Eau de Parfum (EDP)",
        edt: "Eau de Toilette (EDT)",
        edc: "Eau de Cologne (EDC)",
        // Personal Fragrance (By Form)
        concentrated_oil: "Concentrated Oil",
        dehn_al_oud: "Dehn al Oud",
        hair_mist: "Hair Mist",
        body_gel: "Body Gel",
        // Home & Traditional Fragrance
        bakhoor: "Bakhoor",
        oud_maattar: "Oud Maattar",
        air_freshener: "Air Freshener",
        // General Categories
        occidental_fragrance: "Occidental Fragrance",
        oriental_fragrance: "Oriental Fragrance",
        // Other
        other: "Other",
    };
    const dispenserTypeMap = {
        spray: "Spray / Atomizer (for Perfumes, Mists)",
        pump: "Pump (for Gels, Lotions)",
        roll_on: "Roll-on / Rollerball (for Oils)",
        dabber_stick: "Dabber / Stick Applicator (for Oils)",
        solid_incense: "Solid / Incense (for Bakhoor, Maattar)",
        jar: "Jar / Pot (for Gels, Bakhoor)",
        tube: "Tube (for Gels)",
        reed_diffuser: "Reed Diffuser (for Air Fresheners)",
        dropper: "Dropper",
        other: "Other",
    };
    const productOverviewData = [
        {
            head: "Size / Volume:",
            text: product?.tags?.join(", "),
            icon: "https://www.svgrepo.com/show/217430/measuring-glass.svg",
        },
        {
            head: "Fragrance Type:",
            text:
                fragranceTypeMap[product?.fragrance_type] ||
                product?.fragrance_type,
            icon: "https://www.svgrepo.com/show/288787/perfume.svg",
        },
        {
            head: "Fragrance Category:",
            text: product?.fragrance_category,
            icon: "https://www.svgrepo.com/show/489939/label.svg",
        },
        {
            head: "Dispenser Type:",
            text:
                dispenserTypeMap[product?.dispenser_type] ||
                product?.dispenser_type,
            icon: "https://www.svgrepo.com/show/145486/spray.svg",
        },
    ].filter((item) => item.text);

    const onlyTopNoteExists = !product.note_2 && !product.note_3;
    const notesData = [
        {
            id: "top",
            type: onlyTopNoteExists ? "Notes/Accords" : "Top Notes",
            description: product.note_1,
            image: `${process.env.NEXT_PUBLIC_API_URL}storage/${product.note_1_image}`,
        },
        {
            id: "heart",
            type: "Heart Notes",
            description: product.note_2,
            image: `${process.env.NEXT_PUBLIC_API_URL}storage/${product.note_2_image}`,
        },
        {
            id: "base",
            type: "Base Notes",
            description: product.note_3,
            image: `${process.env.NEXT_PUBLIC_API_URL}storage/${product.note_3_image}`,
        },
    ].filter((note) => note.description);
    const fragranceSummaryData = [
        {
            head: "Olfactory Family",
            text: product?.olfactory_family,
            icon: "https://www.svgrepo.com/show/317501/perfume-channel-national-culture-paris.svg",
        },
        {
            head: "Sillage",
            text: product?.sillage,
            icon: "https://www.svgrepo.com/show/252491/snowy-wind.svg",
        },
    ].filter((item) => item.text);

    const keyHighlightsData = [
        {
            head: "Longevity:",
            text: product?.longevity,
            icon: "https://www.svgrepo.com/show/28716/time-passing.svg",
        },
        {
            head: "Occasion:",
            text: product?.occasion,
            icon: "https://www.svgrepo.com/show/190190/moon-full-moon.svg",
        },
        {
            head: "Other:",
            text: product?.additional_details,
            icon: "https://www.svgrepo.com/show/288765/diamond.svg",
        },
    ].filter((item) => item.text);

    const deliveryInfoData = [
        {
            head: "Swift & Complimentary Shipping",
            text: `Free delivery on orders over AED ${shippingServiceCharges[3]?.price} in the UAE.`,
            icon: "https://www.svgrepo.com/show/402289/package.svg",
        },
        {
            head: "Secure Payment Solutions",
            text: "Your payments are safe with our secure online system.",
            icon: "https://www.svgrepo.com/show/396564/globe-showing-europe-africa.svg",
        },
        {
            head: "Track Your Order",
            text: "Easily track your order status online anytime.",
            icon: "https://www.svgrepo.com/show/231101/placeholder-pin.svg",
        },
    ].filter((item) => item.text);

    const usageInfo = getUsageInfo(product);

    return (
        <div className="accordion" id="productAccordion">
            {/* --- Fragrance Profile --- */}
            {(notesData?.length > 0 || fragranceSummaryData?.length > 0) && (
                <AccordionItem
                    title="Fragrance Profile"
                    id="Two"
                    defaultOpen={true}
                >
                    {/* Conditionally render the Scent Journey only if notesData exists */}
                    {notesData?.length > 0 && (
                        <div className="notes-journey-container">
                            {notesData.map((note) => (
                                <div className="note-item" key={note.id}>
                                    <Image
                                        height={500}
                                        width={500}
                                        src={note.image}
                                        alt={note.type}
                                        className="note-item-image"
                                        onError={(e) => {
                                            e.target.style.display = "none";
                                        }}
                                    />
                                    <div className="note-item-text">
                                        <h6 className="note-item-title">
                                            {note.type}
                                        </h6>
                                        <p className="note-item-desc">
                                            {note.description}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Conditionally render the divider only if both sections have content */}
                    {notesData?.length > 0 &&
                        fragranceSummaryData?.length > 0 && (
                            <hr className="section-divider" />
                        )}

                    {/* Conditionally render the highlights only if fragranceSummaryData exists */}
                    {fragranceSummaryData?.length > 0 && (
                        <div className="highlights-list">
                            {fragranceSummaryData.map((item, idx) => (
                                <div className="highlight-item" key={idx}>
                                    <Image
                                        src={item.icon}
                                        alt=""
                                        className="highlight-icon"
                                        height={500}
                                        width={500}
                                    />
                                    <div className="highlight-text">
                                        <h6 className="highlight-title">
                                            {item.head}
                                        </h6>
                                        <p className="highlight-desc">
                                            {item.text}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </AccordionItem>
            )}

            {/* --- Product Overview --- */}
            {productOverviewData && productOverviewData.length > 0 && (
                <AccordionItem title="Product Overview" id="One">
                    <div className="row g-4">
                        {productOverviewData.map((item, idx) => (
                            <div
                                className="col-12 col-md-6"
                                style={{ maxWidth: "50%" }}
                                key={idx}
                            >
                                <div className="highlight-grid-item">
                                    <Image
                                        src={item.icon}
                                        alt=""
                                        className="highlight-icon"
                                        height={500}
                                        width={500}
                                    />
                                    <div className="highlight-text">
                                        <h6 className="highlight-title">
                                            {item.head}
                                        </h6>
                                        <p className="highlight-desc">
                                            {item.text}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </AccordionItem>
            )}

            {/* --- Key Highlights --- */}
            {keyHighlightsData && keyHighlightsData.length > 0 && (
                <AccordionItem title="Key Highlights" id="Three">
                    <div className="highlights-list">
                        {keyHighlightsData.map((item, idx) => (
                            <div className="highlight-item" key={idx}>
                                <Image
                                    src={item.icon}
                                    alt=""
                                    className="highlight-icon"
                                    height={500}
                                    width={500}
                                />
                                <div className="highlight-text">
                                    <h6 className="highlight-title">
                                        {item.head}
                                    </h6>
                                    <p className="highlight-desc">
                                        {item.text}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </AccordionItem>
            )}

            {/* --- Usage & Application --- */}
            {usageInfo && (
                <AccordionItem title="Usage & Application" id="Four">
                    <div className="usage-guide">
                        {/* The instructional image is now the hero element, placed at the top */}
                        <Image
                            src={usageInfo.imgSrc}
                            alt={`How to apply ${usageInfo.title || "product"}`}
                            className="usage-image"
                            height={500}
                            width={500}
                        />

                        <div className="usage-text">
                            {/* The title now introduces the steps below the image */}
                            <h4>How to Apply</h4>
                            <ol className="usage-steps">
                                {usageInfo.text.map((step, i) => (
                                    <li key={i}>{step}</li>
                                ))}
                            </ol>
                            {product?.how_to_use && (
                                <div className="usage-summary">
                                    <h4>Summary</h4>
                                    <p>{product.how_to_use}</p>
                                </div>
                            )}
                        </div>
                    </div>
                </AccordionItem>
            )}

            {/* --- Crafted with Intention (Now conditional) --- */}
            {product?.story && (
                <AccordionItem title="Crafted with Intention" id="Five">
                    <div className="story-content">
                        <blockquote>{product?.story}</blockquote>
                    </div>
                </AccordionItem>
            )}

            {/* --- Delivery Information --- */}
            <AccordionItem title="Delivery Information" id="Six">
                {/* MODIFIED: Also changed to a Bootstrap row for consistency */}
                <div className="row g-3">
                    {deliveryInfoData.map((item, idx) => (
                        <div
                            className="col-12 col-md-6"
                            style={{ maxWidth: "50%" }}
                            key={idx}
                        >
                            <div className="highlight-grid-item">
                                <Image
                                    src={item.icon}
                                    alt=""
                                    className="highlight-icon"
                                    height={500}
                                    width={500}
                                />
                                <div className="highlight-text">
                                    <h6 className="highlight-title">
                                        {item.head}
                                    </h6>
                                    <p className="highlight-desc">
                                        {item.text}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </AccordionItem>
        </div>
    );
};

// A helper component to keep the accordion item structure DRY
const AccordionItem = ({ title, id, defaultOpen = false, children }) => {
    return (
        <div className="accordion-item">
            <h2 className="accordion-header" id={`heading${id}`}>
                <button
                    className={`accordion-button fw-semibold accordion-btn-custom ${
                        !defaultOpen && "collapsed"
                    }`}
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target={`#collapse${id}`}
                    aria-expanded={defaultOpen}
                    aria-controls={`collapse${id}`}
                >
                    {title}
                </button>
            </h2>
            <div
                id={`collapse${id}`}
                className={`accordion-collapse collapse ${
                    defaultOpen && "show"
                }`}
                aria-labelledby={`heading${id}`}
                data-bs-parent="#productAccordion"
            >
                <div className="accordion-body">{children}</div>
            </div>
        </div>
    );
};

export default ProductAccordion;
