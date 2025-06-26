"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { useLocale } from "next-intl";
import VideoPanel from "../VideoPanel";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function NewsLetter() {
    const modalElement = useRef(null);
    const [hasScrolled, setHasScrolled] = useState(false);
    const locale = useLocale();
    let modalInstance = null;

    useEffect(() => {
        const bootstrap = require("bootstrap");

        // Initialize Bootstrap Modal
        modalInstance = new bootstrap.Modal(modalElement.current, {
            keyboard: false,
        });

        // Show modal only once
        const showModal = () => {
            if (!hasScrolled) {
                modalInstance.show();
                setHasScrolled(true);
            }
        };

        // Scroll event
        const handleScroll = () => {
            if (window.scrollY > 3500 && !hasScrolled) {
                showModal();
            }
        };

        // Close button handler
        const closeButton = modalElement.current.querySelector(".btn-close");
        closeButton.addEventListener("click", () => modalInstance.hide());

        window.addEventListener("scroll", handleScroll);

        // Cleanup
        return () => {
            window.removeEventListener("scroll", handleScroll);
            closeButton.removeEventListener("click", () => modalInstance.hide());
        };
    }, [hasScrolled]);

    return (
        <div
            className="modal fade"
            id="newsletterPopup"
            ref={modalElement}
            tabIndex="-1"
            data-bs-backdrop="true"
            aria-hidden="true"
        >
            <div className="modal-dialog newsletter-popup modal-dialog-centered">
                <div className="modal-content">
                    <button
                        type="button"
                        className="btn-close"
                        aria-label="Close"
                    ></button>
                    <div className="row p-0 m-0">
                        <div className="col-md-8 p-0">
                            <div className="newsletter-popup__bg w-100">
                                <div className="d-none d-lg-block">
                                    <a
                                        href={`/${locale}/shop/gift-sets/gift-sets/aazz-o-azeez`}
                                    >
                                        <VideoPanel
                                            src="/assets/videos/azz-o-azeez-popup.mp4"
                                            section="hundred"
                                        />
                                    </a>
                                </div>
                                <div className="d-sm-block d-md-none">
                                    <VideoPanel
                                        src="/assets/videos/azz-o-azeez-popup.mp4"
                                        section="hundred"
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="col-md-4 p-0 d-flex align-items-center text-center">
                            <div className="block-newsletter w-100">
                                <h3
                                    className="section-title fw-normal mb-3 pb-2"
                                    style={{ color: "#5c6137" }}
                                >
                                    Aazz O Azeez
                                </h3>
                                <p>
                                    The Aazz O Azeez Gift Set is a testament to the artistry of perfumery, blending rich notes and exquisite ingredients to create a harmonious olfactory experience. Contains: Aaz EDP 100ml and Oud Azeez
                                </p>
                                <a
                                    className="btn-link btn-link_lg default-underline text-uppercase fw-medium"
                                    href={`/${locale}/shop/gift-sets/gift-sets/aazz-o-azeez`}
                                >
                                    Shop Now
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
