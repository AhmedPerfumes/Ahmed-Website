import "./accordian.css";
import InfoCard from "./Common/InfoCard";

const ProductAccordion = ({ product }) => {
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

    return (
        <div
            className="accordion"
            id="productAccordion"
            style={{
                backgroundColor: "#FAF9F7",
                maxWidth: "600px",
                margin: "0 auto",
                fontFamily: "serif",
                display: "flex",
                flexDirection: "column",
                minHeight: "100vh",
            }}
        >
            {/* Product Overview */}
            {/* <div className="accordion-item">
                <h2 className="accordion-header" id="headingOne">
                    <button
                        className="accordion-button collapsed fw-semibold accordion-btn-custom"
                        type="button"
                        data-bs-toggle="collapse"
                        data-bs-target="#collapseOne"
                        aria-expanded="false"
                        aria-controls="collapseOne"
                        style={{
                            backgroundColor: "#FAF9F7",
                            color: "#222",
                            fontFamily: "Cinzel, serif",
                            border: "none",
                            borderBottom: "1px solid #ddd",
                        }}
                    >
                        Product Overview
                        <svg
                            className="accordion-arrow ms-auto accordion-icon-custom"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="currentColor"
                            viewBox="0 0 16 16"
                        >
                            <path
                                fillRule="evenodd"
                                d="M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708z"
                            />
                        </svg>
                    </button>
                </h2>

                <div
                    id="collapseOne"
                    className="accordion-collapse collapse"
                    aria-labelledby="headingOne"
                    data-bs-parent="#productAccordion"
                    style={{
                        backgroundColor: "#FAF9F7",
                        border: "none",
                        borderBottom: "1px solid #ddd",
                    }}
                >
                    <div className="accordion-body">
                        <div className="row">
                            {[
                                {
                                    label: "Fragrance Type:",
                                    desc: "Eau de Parfum (EDP)",
                                    icon: "https://www.svgrepo.com/show/482598/perfume-3.svg",
                                },
                                {
                                    label: "Fragrance Category:",
                                    desc: "Occidental, Unisex",
                                    icon: "https://www.svgrepo.com/show/493619/tags-category-categories-labels.svg",
                                },
                                {
                                    label: "Size / Volume:",
                                    desc: "100ml",
                                    icon: "https://www.svgrepo.com/show/490846/measuring-cup.svg",
                                },
                                {
                                    label: "Dispenser Type:",
                                    desc: "Spray",
                                    icon: "https://www.svgrepo.com/show/143412/perfume-spray-container.svg",
                                },
                            ].map((item, i) => (
                                <div className="col-md-6 mb-3" key={i}>
                                    <InfoCard
                                        icon={item.icon}
                                        title={item.label}
                                        description={item.desc}
                                        layout="column"
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div> */}

            {/* Fragrance Profile */}
            {/* <div className="accordion-item">
                <h2 className="accordion-header" id="headingTwo">
                    <button
                        className="accordion-button fw-semibold accordion-btn-custom"
                        type="button"
                        data-bs-toggle="collapse"
                        data-bs-target="#collapseTwo"
                        aria-expanded="false"
                        aria-controls="collapseTwo"
                        style={{
                            backgroundColor: "#FAF9F7",
                            color: "#222",
                            fontFamily: "Cinzel, serif",
                            border: "none",
                            borderBottom: "1px solid #ddd",
                        }}
                    >
                        Fragrance Profile
                        <svg
                            className="accordion-arrow ms-auto accordion-icon-custom"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="currentColor"
                            viewBox="0 0 16 16"
                        >
                            <path
                                fillRule="evenodd"
                                d="M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708z"
                            />
                        </svg>
                    </button>
                </h2>
                <div
                    id="collapseTwo"
                    className="accordion-collapse collapse show"
                    aria-labelledby="headingTwo"
                    data-bs-parent="#productAccordion"
                    style={{
                        backgroundColor: "#FAF9F7",
                        border: "none",
                        borderBottom: "1px solid #ddd",
                    }}
                >
                    <div className="accordion-body  ">
                        <div className="d-flex justify-content-center gap-3 mb-4">
                            {[
                                {
                                    type: "Top Notes",
                                    ingredients: "Raspberry",
                                    description:
                                        "Raspberry, Turkish Rose, Indian Roses",
                                    image: "/assets/images/musk-roses-test/raspberry.png",
                                },
                                {
                                    type: "Heart Notes",
                                    ingredients: "White Flowers",
                                    description: "White Flowers, Oud Extract",
                                    image: "/assets/images/musk-roses-test/musk.webp",
                                },
                                {
                                    type: "Base Notes",
                                    ingredients: "Guaiac Wood",
                                    description:
                                        "Guaiac Wood, Sandalwood, Amber Absolute",
                                    image: "/assets/images/musk-roses-test/woody.jpg",
                                },
                            ].map((note, index) => (
                                <div
                                    className="note-card"
                                    key={index}
                                    data-bs-toggle="modal"
                                    data-bs-target={`#noteModal${index}`}
                                >
                                    <div className="note-top">
                                        <img
                                            src={note.image}
                                            alt={note.type}
                                            className="note-image"
                                        />
                                        <h6 className="note-type">
                                            {note.type}
                                        </h6>
                                        <p className="note-ingredients">
                                            {note.ingredients}
                                        </p>
                                    </div>

                                    <p className="note-click">click for more</p>
                                </div>
                            ))}
                        </div>
                        <div className="row">
                            {[
                                {
                                    label: "Olfactory Family:",
                                    desc: "Oriental, Musky, Woody",
                                    icon: "https://www.svgrepo.com/show/322156/delicate-perfume.svg",
                                },
                                {
                                    label: "Sillage:",
                                    desc: "Enormous",
                                    icon: "https://www.svgrepo.com/show/495856/wind-2.svg",
                                },
                            ].map((item, i) => (
                                <div className="col-md-6 mb-3" key={i}>
                                    <InfoCard
                                        icon={item.icon}
                                        title={item.label}
                                        description={item.desc}
                                        layout="column"
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
            {[
                {
                    type: "Top Notes",
                    description: "Raspberry, Turkish Rose, Indian Roses",
                    image: "/assets/images/musk-roses-test/raspberry.png",
                },
                {
                    type: "Heart Notes",
                    description: "White Flowers, Oud Extract",
                    image: "/assets/images/musk-roses-test/musk.webp",
                },
                {
                    type: "Base Notes",
                    description: "Guaiac Wood, Sandalwood, Amber Absolute",
                    image: "/assets/images/musk-roses-test/woody.jpg",
                },
            ].map((note, index) => (
                <div
                    className="modal fade"
                    id={`noteModal${index}`}
                    tabIndex="-1"
                    aria-labelledby={`noteModalLabel${index}`}
                    aria-hidden="true"
                    key={index}
                >
                    <div
                        className="modal-dialog modal-dialog-centered"
                        style={{ maxWidth: "500px" }}
                    >
                        <div
                            className="modal-content"
                            style={{
                                backgroundColor: "#fff",
                                borderRadius: "8px",
                                padding: "24px",
                                boxShadow: "0 4px 15px rgba(0,0,0,0.2)",
                            }}
                        >
                            <div className="modal-header border-0 p-0">
                                <button
                                    type="button"
                                    className="btn-close"
                                    data-bs-dismiss="modal"
                                    aria-label="Close"
                                    style={{
                                        position: "absolute",
                                        top: "10px",
                                        right: "10px",
                                        fontSize: "16px",
                                    }}
                                ></button>
                            </div>
                            <div className="modal-body p-0">
                                <img
                                    src={note.image}
                                    alt={note.type}
                                    style={{
                                        width: "100%",
                                        height: "192px",
                                        objectFit: "cover",
                                        borderRadius: "6px",
                                        marginBottom: "16px",
                                    }}
                                />
                                <h3
                                    style={{
                                        fontSize: "18px",
                                        fontWeight: "600",
                                        color: "#222",
                                        fontFamily: "Cinzel, serif",
                                        marginBottom: "8px",
                                    }}
                                >
                                    {note.type}
                                </h3>
                                <p
                                    style={{
                                        fontSize: "14px",
                                        color: "#444",
                                        fontFamily: "Merriweather, serif",
                                        lineHeight: "1.5",
                                    }}
                                >
                                    {note.description}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            ))} */}

            {/* Product Features & Key Highlights */}
            {/* <div className="accordion-item">
                <h2 className="accordion-header" id="headingThree">
                    <button
                        className="accordion-button collapsed fw-semibold accordion-btn-custom"
                        type="button"
                        data-bs-toggle="collapse"
                        data-bs-target="#collapseThree"
                        aria-expanded="false"
                        aria-controls="collapseThree"
                        style={{
                            backgroundColor: "#FAF9F7",
                            color: "#222",
                            fontFamily: "Cinzel, serif",
                            border: "none",
                            borderBottom: "1px solid #ddd",
                        }}
                    >
                        Key Highlights
                        <svg
                            className="accordion-arrow ms-auto accordion-icon-custom"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="currentColor"
                            viewBox="0 0 16 16"
                        >
                            <path
                                fillRule="evenodd"
                                d="M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708z"
                            />
                        </svg>
                    </button>
                </h2>
                <div
                    id="collapseThree"
                    className="accordion-collapse collapse"
                    aria-labelledby="headingThree"
                    data-bs-parent="#productAccordion"
                    style={{
                        backgroundColor: "#FAF9F7",
                        border: "none",
                        borderBottom: "1px solid #ddd",
                    }}
                >
                    <div className="accordion-body  ">
                        <div className="row">
                            {[
                                {
                                    text: "Long-lasting (up to 14 hours)",
                                    icon: "https://www.svgrepo.com/show/529492/clock-circle.svg",
                                },
                                {
                                    text: "Ideal for evening wear",
                                    icon: "https://www.svgrepo.com/show/532875/moon.svg",
                                },
                                {
                                    text: "Luxury glass bottle with gold detailing",
                                    icon: "https://www.svgrepo.com/show/509955/gem.svg",
                                },
                            ].map((item, idx) => (
                                <div
                                    className="col-md-4 col-lg-4 col-sm-4 mb-3"
                                    key={idx}
                                >
                                    <InfoCard
                                        icon={item.icon}
                                        // title={item.text}
                                        description={item.text}
                                        layout="column"
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div> */}

            {/* Usage & Application */}
            <div className="accordion-item">
                <h2 className="accordion-header" id="headingFour">
                    <button
                        className="accordion-button collapsed fw-semibold accordion-btn-custom"
                        type="button"
                        data-bs-toggle="collapse"
                        data-bs-target="#collapseFour"
                        aria-expanded="false"
                        aria-controls="collapseFour"
                        style={{
                            backgroundColor: "#FAF9F7",
                            color: "#222",
                            fontFamily: "Cinzel, serif",
                            border: "none",
                            borderBottom: "1px solid #ddd",
                        }}
                    >
                        Usage & Application
                        <svg
                            className="accordion-arrow ms-auto accordion-icon-custom"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="currentColor"
                            viewBox="0 0 16 16"
                        >
                            <path
                                fillRule="evenodd"
                                d="M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708z"
                            />
                        </svg>
                    </button>
                </h2>
                <div
                    id="collapseFour"
                    className="accordion-collapse collapse show"
                    aria-labelledby="headingFour"
                    data-bs-parent="#productAccordion"
                    style={{
                        backgroundColor: "#FAF9F7",
                        border: "none",
                        borderBottom: "1px solid #ddd",
                    }}
                >
                    <div className="accordion-body how-body">
                        {product?.category && product?.subcategory && (
                            <>
                                {howToApplyContent[product?.category] && (
                                    <>
                                        <h6 className="mb-3 usage-head">
                                            How to Use:
                                        </h6>
                                        {(
                                            howToApplyContent[
                                                product?.category
                                            ][product.subcategory] ||
                                            howToApplyContent[product?.category]
                                                .default
                                        )?.text.map((text, idx) => (
                                            <p
                                                key={idx}
                                                className="mb-2 text-muted usage-body"
                                            >
                                                {text}
                                            </p>
                                        ))}
                                        <img
                                            src={
                                                (
                                                    howToApplyContent[
                                                        product?.category
                                                    ][product?.subcategory] ||
                                                    howToApplyContent[
                                                        product?.category
                                                    ].default
                                                )?.imgSrc
                                            }
                                            alt="How to Use"
                                            className="w-100"
                                            style={{ borderRadius: "10px" }}
                                        />
                                    </>
                                )}
                            </>
                        )}
                    </div>
                </div>
            </div>

            {/* Crafted with Intention */}
            {/* <div className="accordion-item">
                <h2 className="accordion-header" id="headingFive">
                    <button
                        className="accordion-button collapsed fw-semibold accordion-btn-custom"
                        type="button"
                        data-bs-toggle="collapse"
                        data-bs-target="#collapseFive"
                        aria-expanded="false"
                        aria-controls="collapseFive"
                        style={{
                            backgroundColor: "#FAF9F7",
                            color: "#222",
                            fontFamily: "Cinzel, serif",
                            border: "none",
                            borderBottom: "1px solid #ddd",
                        }}
                    >
                        Crafted with Intention
                        <svg
                            className="accordion-arrow ms-auto accordion-icon-custom"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="currentColor"
                            viewBox="0 0 16 16"
                        >
                            <path
                                fillRule="evenodd"
                                d="M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708z"
                            />
                        </svg>
                    </button>
                </h2>
                <div
                    id="collapseFive"
                    className="accordion-collapse collapse"
                    aria-labelledby="headingFive"
                    data-bs-parent="#productAccordion"
                    style={{
                        backgroundColor: "#FAF9F7",
                        border: "none",
                        borderBottom: "1px solid #ddd",
                    }}
                >
                    <div className="accordion-body  ">
                        <div
                            className="p-3"
                            style={{
                                backgroundColor: "#f8f9fa",
                                borderLeft: "4px solid #000",
                                borderRadius: "4px",
                                boxShadow: "inset 0 1px 3px rgba(0,0,0,0.05)",
                            }}
                        >
                            <p
                                className="mb-2 text-muted"
                                style={{ fontSize: "12px" }}
                            >
                                A captivating infusion of opposites — this
                                fragrance moves from sweet florals to deep
                                musks, wrapped in warm woods. The journey begins
                                with the lush embrace of Turkish and Indian
                                roses, awakened by radiant white florals and
                                grounded by the depth of Oud.
                            </p>
                            <p
                                className="mb-2 text-muted"
                                style={{ fontSize: "12px" }}
                            >
                                As the scent evolves, it reveals rich base notes
                                of guaiac wood, creamy sandalwood, and golden
                                amber absolute — forming a sensorial tapestry
                                that lingers gracefully.
                            </p>
                            <p
                                className="mb-0 text-muted fst-italic"
                                style={{ fontSize: "12px" }}
                            >
                                Bold yet soft. Intimate yet powerful. This
                                fragrance is a tribute to contrasts in perfect
                                harmony.
                            </p>
                        </div>
                    </div>
                </div>
            </div> */}

            {/* Delivery Information */}
            <div className="accordion-item">
                <h2 className="accordion-header" id="headingSix">
                    <button
                        className="accordion-button collapsed fw-semibold accordion-btn-custom"
                        type="button"
                        data-bs-toggle="collapse"
                        data-bs-target="#collapseSix"
                        aria-expanded="false"
                        aria-controls="collapseSix"
                        style={{
                            backgroundColor: "#FAF9F7",
                            color: "#222",
                            fontFamily: "Cinzel, serif",
                            border: "none",
                            borderBottom: "1px solid #ddd",
                        }}
                    >
                        Delivery Information
                        <svg
                            className="accordion-arrow ms-auto accordion-icon-custom"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="currentColor"
                            viewBox="0 0 16 16"
                        >
                            <path
                                fillRule="evenodd"
                                d="M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708z"
                            />
                        </svg>
                    </button>
                </h2>
                <div
                    id="collapseSix"
                    className="accordion-collapse collapse"
                    aria-labelledby="headingSix"
                    data-bs-parent="#productAccordion"
                    style={{
                        backgroundColor: "#FAF9F7",
                        border: "none",
                        borderBottom: "1px solid #ddd",
                    }}
                >
                    <div className="accordion-body">
                        <div className="row">
                            {[
                                {
                                    label: "SWIFT & COMPLIMENTARY SHIPPING",
                                    desc: "Free delivery on orders over AED 100.",
                                    icon: "https://www.svgrepo.com/show/378704/shipping-box-v1.svg",
                                },
                                {
                                    label: "SECURE PAYMENT SOLUTIONS",
                                    desc: "Your payments are safe with our secure online system.",
                                    icon: "https://www.svgrepo.com/show/513157/globe-1.svg",
                                },
                                {
                                    label: "CONVENIENT CASH ON DELIVERY",
                                    desc: "Contact us via landline or WhatsApp for assistance.",
                                    icon: "https://www.svgrepo.com/show/447599/delivery-fast.svg",
                                },
                                {
                                    label: "TRACK YOUR ORDER",
                                    desc: "Easily track your order status online anytime.",
                                    icon: "https://www.svgrepo.com/show/532539/location-pin.svg",
                                },
                            ].map((item, i) => (
                                <div
                                    className="col-md-6 col-lg-6 mb-3 "
                                    key={i}
                                >
                                    <InfoCard
                                        icon={item.icon}
                                        title={item.label}
                                        description={item.desc}
                                        layout="column"
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductAccordion;
