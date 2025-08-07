"use client";
import { shopCategories } from "@/data/categories";
import React, { useRef, useState, useEffect } from "react";
import Image from "next/image";
import { usePathname } from "next/navigation";
import Categoriess from "@/components/homes/home-3/Categories";
import { useTranslations } from "next-intl";

export default function Categories({ description, subCategories }) {
    const pathname = usePathname();
    const category = pathname.split("/")[3];
    const subcategory = pathname.split("/")[4];
    const t = useTranslations();

    // State for collapsible description
    const [expanded, setExpanded] = useState(false);
    const [height, setHeight] = useState("0px");
    const contentRef = useRef(null);

    // Update height based on expanded state
    useEffect(() => {
        if (contentRef.current) {
            setHeight(
                expanded ? `${contentRef.current.scrollHeight}px` : "45px"
            );
        }
    }, [expanded]);

    return (
        <>
            <section
                className="full-width_padding pb-3"
                // style={{ backgroundColor: "#faf9f8" }}
            >
                <div className="shop-categories position-relative">
                    <h2 className="h3 mb-4 fw-normal text-uppercase text-center">
                        {subcategory == null
                            ? t(category.split("-").join(" "))
                            : t(subcategory.split("-").join(" "))}
                    </h2>

                    {/* Collapsible Description */}
                    {description && (
                        <div style={{ overflow: "hidden", transition: "all 0.5s ease-in-out", fontFamily: "Merriweather, serif", maxWidth: "930px", margin: "0 auto" }}>
                            <div dangerouslySetInnerHTML={{ __html: description }} ref={contentRef} style={{ maxHeight: height, transition: "all 0.2s ease-in-out", overflow: "hidden", fontSize: "0.875rem", color: "#6E6E73", letterSpacing: "0.02em", fontWeight: "500", textAlign: "center",}}>
                            </div>
                            {description.length > 100 && (
                                <div style={{
                                        display: "flex",
                                        justifyContent: "center",
                                    }}>
                                    <a onClick={() => setExpanded(!expanded)} 
                                    // style={{
                                    //         marginTop: "0.25rem",
                                    //         fontSize: "0.875rem",
                                    //         fontWeight: "bold",
                                    //         color: "#6E6E73",
                                    //         transition: "color 0.3s",
                                    //         outline: "none",
                                    //         cursor: "pointer",
                                    //         border: "none",
                                    //         background: "none",
                                    //     }}
                                        // onMouseOver={(e) => (e.target.style.color = "#1C1C1E")}
                                        // onMouseOut={(e) => (e.target.style.color = "#6E6E73")}
                                        className="btn-rounded btn-link_lg text-uppercase fw-medium hover-effect mt-3"
                                    >
                                        {expanded ? t("Show less") : t("Find Out More")}
                                    </a>
                                </div>
                            )}
                        </div>
                    )}

                    {/* {description && (
                        <div
                            dangerouslySetInnerHTML={{ __html: description }}
                            className="fs-6 fw-medium mb-4 text-center mw-930"
                        ></div>
                    )} */}
                </div>
            </section>
            {subcategory == null ? (
                <Categoriess subCategories={subCategories} />
            ) : null}
        </>
    );
}
