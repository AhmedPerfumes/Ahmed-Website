"use client";

import Image from "next/image";
import { useEffect, useRef } from "react"; // No longer need useState
import { useLocale, useTranslations } from "next-intl";
import Link from "next/link";


export default function NewsLetter({popUp}) {
    const modalElement = useRef(null);
    const locale = useLocale();
    
    const t = useTranslations();

    // --- NEW: Use a ref to track if the modal has been shown in this session ---
    // This avoids the stale state issue in the event listener.
    const hasShownThisSession = useRef(false);

    // --- Configuration Constants ---
    const POPUP_STORAGE_KEY = 'newsletterPopupLastShown';
    // const POPUP_COOLDOWN_PERIOD = 3 * 60 * 60 * 1000; // 3 hours in milliseconds
    const POPUP_COOLDOWN_PERIOD = 30 * 60 * 1000;

    useEffect(() => {
        // --- 1. Check if the user is still in the cooldown period ---
        const lastShownTimestamp = localStorage.getItem(POPUP_STORAGE_KEY);
        const currentTime = new Date().getTime();

        // if (lastShownTimestamp) {
        //     const timeSinceLastShown = currentTime - parseInt(lastShownTimestamp, 10);
        //     if (timeSinceLastShown < POPUP_COOLDOWN_PERIOD) {
        //         return; // Cooldown is active, so we do nothing.
        //     }
        // }

        // --- 2. If cooldown is over, set up the modal and listener ---
        const bootstrap = require("bootstrap");
        let modalInstance = null;

        if (modalElement.current) {
            modalInstance = new bootstrap.Modal(modalElement.current, {
                keyboard: false,
            });
        } else {
            return;
        }

        const showModal = () => {
            if (modalInstance) {
                modalInstance.show();
                // Save the current time to localStorage to start the new cooldown
                localStorage.setItem(POPUP_STORAGE_KEY, new Date().getTime().toString());
            }
        };

        const handleScroll = () => {
            // Check scroll position AND if it has already been shown in this session
            if (window.scrollY > 2000 && !hasShownThisSession.current) {
                // --- CORRECTED LOGIC ---
                // 1. Immediately set the ref to true. This is critical.
                //    It ensures this block can never run again in this session.
                hasShownThisSession.current = true;
                
                // 2. Then, show the modal.
                showModal();
            }
        };

        const closeButton = modalElement.current.querySelector(".btn-close");
        const closeHandler = () => modalInstance.hide();

        const handleHide = () => {
            if (document.activeElement && modalElement.current.contains(document.activeElement)) {
                document.activeElement.blur();
            }
        };

        window.addEventListener("scroll", handleScroll);
        closeButton.addEventListener("click", closeHandler);
        
        const modalRef = modalElement.current;
        if (modalRef) {
            modalRef.addEventListener("hide.bs.modal", handleHide);
            modalRef.addEventListener("hidden.bs.modal", handleHide);
        }

        // Cleanup function
        return () => {
            window.removeEventListener("scroll", handleScroll);
            closeButton.removeEventListener("click", closeHandler);
            if (modalRef) {
                modalRef.removeEventListener("hide.bs.modal", handleHide);
                modalRef.removeEventListener("hidden.bs.modal", handleHide);
            }
        };
    }, []); // This effect correctly runs only once on mount.

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
                    {popUp.map((elm, i) => (
                        <div className="row p-0 m-0" key={i}>
                            <div className="col-md-8 p-0">
                                <div className="newsletter-popup__bg w-100 position-relative">
                                    <div className="d-none d-lg-block">
                                       
                                            <Image
                                                width={550}
                                                height={650}
                                                style={{ height: "fit-content", minHeight: "400px", objectFit: "cover" }}
                                                loading="lazy"
                                                src={`${process.env.NEXT_PUBLIC_API_URL}storage/${elm.image}`}
                                                className="w-100 d-block"
                                                alt="image"
                                            />
                                       
                                    </div>
                                    <div className="d-block d-lg-none">
                                       
                                            <Image
                                                width={550}
                                                height={400}
                                                style={{ height: "30vh", minHeight: "220px", maxHeight: "300px", objectFit: "cover" }}
                                                loading="lazy"
                                                src={`${process.env.NEXT_PUBLIC_API_URL}storage/${elm.mobile_image}`}
                                                className="w-100 d-block hover-effect"
                                                alt="image"
                                            />
                                      
                                    </div>
                                    <div className="d-block d-lg-none position-absolute bottom-0 w-100" style={{ height: "80px", background: "linear-gradient(to bottom, rgba(255,255,255,0) 0%, rgba(255,255,255,1) 100%)", pointerEvents: "none" }}></div>
                                </div>
                            </div>
                            <div className="col-lg-4 p-0 d-flex align-items-center text-center">
                                <div className="block-newsletter w-100 p-3 p-lg-4">
                                    <h3
                                        className="section-title fw-normal mb-2 mb-lg-3"
                                        style={{ color: "#1D1B19", fontFamily: "'Playfair Display', serif", fontSize: "clamp(1.4rem, 5vw, 1.8rem)" }}
                                    >
                                        {locale === 'ar' ? "سجّل ووفّر ۱۰٪" : elm.name}
                                    </h3>

                                    <p
                                        className="mb-2 mb-lg-3"
                                        style={{ fontSize: "clamp(0.85rem, 3vw, 0.95rem)", color: "#5A554A", fontFamily: "'Inter', sans-serif", lineHeight: "1.5" }}
                                    >
                                        {locale === 'ar' ? "سجّل الآن واستمتع بخصم ۱۰٪ على طلبك الأول!" : elm.description}
                                    </p>

                                    <div
                                        className="mb-3 mb-lg-4"
                                        style={{ fontSize: "clamp(0.8rem, 3vw, 0.95rem)", color: "#555" }}
                                        dangerouslySetInnerHTML={{
                                            __html: locale === 'ar' ? '<span style="color:hsl(0,75%,60%);"><strong>ملاحظة: سيتم تطبيق جميع العروض والخصومات عند الدفع</strong></span>' : elm.content?.replace(/<\/?p>/g, ""),
                                        }}
                                    />

                                    <div className="d-flex justify-content-center mt-2">
                                        <a href={`/${locale}/${elm.link}`} className="bs-cta bs-cta--dark w-100 text-center justify-content-center">
                                            {t("Enquire Now")}
                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                <path d="M5 12h14M12 5l7 7-7 7" />
                                            </svg>
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}