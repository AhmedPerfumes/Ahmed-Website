"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useLocale } from "next-intl";
import { useMenu } from "@/context/MenuContext";

export default function PopUp() {
  const modalRef = useRef(null);
  const locale = useLocale();
  const { push } = useRouter();
  const {pop_up}=useMenu();

  useEffect(() => {
    let modalInstance;

    const loadBootstrap = async () => {
      if (typeof window !== "undefined" && modalRef.current) {
        // ✅ Dynamically import bootstrap JS
        const bootstrap = await import("bootstrap/dist/js/bootstrap.bundle.min.js");
        const Modal = bootstrap.Modal;

        modalInstance = new Modal(modalRef.current);
        setTimeout(() => {
          modalInstance.show();
        }, 8000);
      }
    };

    loadBootstrap();

    return () => {
      if (modalInstance) {
        modalInstance.hide();
      }
    };
  }, []);

  return (
    <>
    
    <div
      className="modal fade"
      id="newsletterModal"
      tabIndex="-1"
      aria-hidden="true"
      ref={modalRef}
    >
      <div className="modal-dialog newsletter-popup modal-dialog-centered modal-xl">
        <div className="modal-content">
          <button
            type="button"
            className="btn-close position-absolute end-0 mt-2 me-2 z-3"
            data-bs-dismiss="modal"
            aria-label="Close"
            ></button>
            {pop_up.map((elm, i) => (
          <div className="row p-0 m-0">
            {/* Left Image Section */}
            <div className="col-md-8 p-0">
              <div className="newsletter-popup__bg w-100">
                <a href={`/${locale}/shop`}>
                  <Image
                    width={550}
                    height={650}
                    style={{ height: "fit-content" }}
                    loading="lazy"
                    // src="/assets/images/new-user-signup.jpg"
                    src={`${process.env.NEXT_PUBLIC_API_URL}storage/${elm.image}`}
                    className="h-100 w-100 object-fit-cover d-block"
                    alt="Sign up promo"
                  />
                </a>
              </div>
            </div>

            {/* Right Section */}
            <div className="col-md-4 p-0 d-flex align-items-center text-center">
                            <div className="block-newsletter w-100">
                                <h3
                                    className="section-title fw-normal mb-3 pb-2"
                                    style={{ color: "#5c6137" }}
                                >
                                    {/* Sign Up & Save 10% */}{elm.name}
                                </h3>
                                <p>
                                    Register now and enjoy exclusive savings on your first order.
                                </p>
                                <div className="d-flex justify-content-center">
                                <a
                                    className="btn-rounded btn-link_lg text-uppercase fw-medium"
                                    href={`/${locale}/login_register?tab=register`}
                                >
                                    Register
                                </a>
                                </div>
                            </div>
                        </div>
          </div>
            ))}
        </div>
      </div>
    </div>
                                    </>
  );
}
