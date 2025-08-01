"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useLocale } from "next-intl";
import { useMenu } from "@/context/MenuContext";

export default function PopUp() {
  const modalRef = useRef(null);
  const locale = useLocale();
  const pathname = usePathname();
  const { popUp } = useMenu();

  useEffect(() => {
    let modalInstance;

    const loadBootstrap = async () => {
      // Simplify homepage check
      const isHomePage = pathname === '/' || pathname === `/${locale}`;

      // Show only on full page load to homepage
      const isInitialLoad =
        document.referrer === "" || !document.referrer.includes(window.location.host);

      if (isHomePage && isInitialLoad) {
        if (typeof window !== "undefined" && modalRef.current) {
          const bootstrap = await import("bootstrap/dist/js/bootstrap.bundle.min.js");
          const Modal = bootstrap.Modal;

          modalInstance = new Modal(modalRef.current);
          setTimeout(() => {
            modalInstance.show();
          }, 4000);
        }
      }
    };

    loadBootstrap();

    return () => {
      if (modalInstance) {
        modalInstance.hide();
      }
    };
  }, [pathname, locale]);

  // Remove console.log
  
  // Simplify the conditional check to match exactly with homepage paths
  if (!(pathname === '/' || pathname === `/${locale}`)) {
    return null;
  }

  return (
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

          {popUp.map((elm, i) => (
            <div key={i} className="row p-0 m-0">
              <div className="col-md-8 p-0">
                <div className="newsletter-popup__bg w-100">
                  <a href={`/${locale}/shop`}>
                    <Image
                      width={550}
                      height={650}
                      style={{ height: "fit-content" }}
                      loading="lazy"
                      src={`${process.env.NEXT_PUBLIC_API_URL}storage/${elm.image}`}
                      className="h-100 w-100 object-fit-cover d-block"
                      alt="Sign up promo"
                    />
                  </a>
                </div>
              </div>

              <div className="col-md-4 p-0 d-flex align-items-center text-center">
                <div className="block-newsletter w-100">
                  <h3 className="section-title fw-normal mb-3 pb-2" style={{ color: "#5c6137" }}>
                    {elm.name}
                  </h3>
                  <p>Register now and enjoy exclusive savings on your first order.</p>
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
  );
}
