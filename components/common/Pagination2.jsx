"use client";
import React, { useState } from "react";
import Link from "next/link";

/**
 * Pagination2
 *
 * Can be used in two modes:
 * 1. Controlled  — pass `currentPage` + `onPageChange` from the parent.
 *    The parent owns the page state (e.g. DiscountGrid).
 * 2. Uncontrolled — omit those props; the component manages its own state.
 *    (e.g. Shop2, Shop3, Blog3)
 */
export default function Pagination2({
  totalPages = 4,
  currentPage: controlledPage,
  onPageChange,
}) {
  // Internal fallback state (only used when no controlled props are supplied)
  const [internalPage, setInternalPage] = useState(1);

  // Decide whether we're controlled or uncontrolled
  const isControlled = controlledPage !== undefined && onPageChange !== undefined;
  const currentPage = isControlled ? controlledPage : internalPage;

  const goTo = (pageNumber) => {
    if (isControlled) {
      onPageChange(pageNumber);
    } else {
      setInternalPage(pageNumber);
    }
  };

  const handlePrev = () => {
    if (currentPage > 1) goTo(currentPage - 1);
  };

  const handleNext = () => {
    if (currentPage < totalPages) goTo(currentPage + 1);
  };

  return (
    <nav
      className="shop-pages d-flex justify-content-between mt-3"
      aria-label="Page navigation"
    >
      <Link
        href="#"
        className={`btn-link d-inline-flex align-items-center ${
          currentPage === 1 ? "disabled" : ""
        }`}
        onClick={(e) => {
          e.preventDefault();
          handlePrev();
        }}
      >
        <svg
          className="me-1"
          width="7"
          height="11"
          viewBox="0 0 7 11"
          xmlns="http://www.w3.org/2000/svg"
        >
          <use href="#icon_prev_sm" />
        </svg>
        <span className="fw-medium">PREV</span>
      </Link>

      <ul className="pagination mb-0">
        {Array.from({ length: totalPages }, (_, index) => (
          <li key={index} className="page-item">
            <Link
              className={`btn-link px-1 mx-2 ${
                currentPage === index + 1 ? "btn-link_active" : ""
              }`}
              href="#"
              onClick={(e) => {
                e.preventDefault();
                goTo(index + 1);
              }}
            >
              {index + 1}
            </Link>
          </li>
        ))}
      </ul>

      <Link
        href="#"
        className={`btn-link d-inline-flex align-items-center ${
          currentPage === totalPages ? "disabled" : ""
        }`}
        onClick={(e) => {
          e.preventDefault();
          handleNext();
        }}
      >
        <span className="fw-medium me-1">NEXT</span>
        <svg
          width="7"
          height="11"
          viewBox="0 0 7 11"
          xmlns="http://www.w3.org/2000/svg"
        >
          <use href="#icon_next_sm" />
        </svg>
      </Link>
    </nav>
  );
}
