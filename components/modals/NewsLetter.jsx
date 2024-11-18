"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { useLocale } from "next-intl";

export default function NewsLetter() {
  const modalElement = useRef();
  const [hasScrolled, setHasScrolled] = useState(false);
  const locale = useLocale();
  useEffect(() => {
    const bootstrap = require("bootstrap"); // dynamically import bootstrap
    var myModal = new bootstrap.Modal(
      document.getElementById("newsletterPopup"),
      {
        keyboard: false,
      }
    );

    // Function to show the modal
    const showModal = () => {
      if (!hasScrolled) {
        myModal.show();
        setHasScrolled(true); // Update state to prevent multiple triggers
      }
    };

    // Add scroll event listener
    const handleScroll = () => {
      // If scroll exceeds 300px, show the modal
      if (window.scrollY > 5900 && !hasScrolled) {
        showModal();
      }
    };

    // Listen to the scroll event
    window.addEventListener('scroll', handleScroll);

    modalElement.current.addEventListener("hidden.bs.modal", () => {
      myModal.hide();
    });

    // Cleanup: Remove scroll event listener when component unmounts
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [hasScrolled]);

  // Function to remove the backdrop
  // const removeBackdrop = () => {
  //   const backdrop = document.querySelector('.modal-backdrop');
  //   if (backdrop) {
  //     backdrop.classList.remove('show'); // Hide the backdrop
  //     backdrop.remove(); // Remove it from the DOM
  //   }
  // };

  // Function to close the modal
  // const closeModal = () => {
  //   const modalElement = document.getElementById('newsletterPopup');
  //   modalElement.classList.remove('show'); // Hide the modal
  //   document.body.classList.remove('modal-open'); // Restore body scrolling
  //   document.body.style.overflow = ''; // Reset overflow style to enable scrolling again
  //   document.body.style.paddingRight = `0px`;
  //   removeBackdrop(); // Remove the backdrop
  // };

  return (
    <div
      className="modal fade"
      id="newsletterPopup"
      ref={modalElement}
      tabIndex="-1"
      data-bs-backdrop={"true"}
      aria-hidden="true"
    >
      <div className="modal-dialog newsletter-popup modal-dialog-centered">
        <div className="modal-content">
          <button
            type="button"
            className="btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
          ></button>
          <div className="row p-0 m-0">
            <div className="col-md-8 p-0">
              <div className="newsletter-popup__bg h-100 w-100">
                <Image
                  width={550}
                  height={650}
                  style={{ height: "fit-content" }}
                  loading="lazy"
                  src="/assets/images/home/demo8/zumar.jpg"
                  className="h-100 w-100 object-fit-cover d-block"
                  alt="image"
                />
              </div>
            </div>
            <div className="col-md-4 p-0 d-flex align-items-center text-center">
              <div className="block-newsletter w-100">
                <h3 className="section-title fw-normal mb-3 pb-2">
                  Exclusive Launch
                </h3>
                <p>
                  Be the first to embrace the elegance of <b>Zumar</b>, our
                  exclusive, limited-edition fragrance. <br />
                  <b className="sub-title">Don't miss out.</b>
                </p>

                <a
                  className="btn-link btn-link_lg default-underline text-uppercase fw-medium"
                  href={`/${locale}/shop/eau-de-parfum/oriental-fragrance/bin-shaikh`}
                >
                  Explore
                </a>
                {/* <form
                  onSubmit={(e) => e.preventDefault()}
                  className="footer-newsletter__form position-relative bg-body"
                >
                  <input
                    className="form-control border-2"
                    type="email"
                    name="email"
                    placeholder="Your email address"
                  />
                  <input
                    className="btn-link fw-medium bg-transparent position-absolute top-0 end-0 h-100"
                    type="submit"
                    defaultValue="OPT IN"
                  />
                </form> */}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
