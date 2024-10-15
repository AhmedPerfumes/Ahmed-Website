"use client";

import * as React from "react";
import Accordion from "@mui/material/Accordion";
import AccordionActions from "@mui/material/AccordionActions";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Link from "next/link";
import Image from "next/image";
import {
  currencyOptions,
  footerLinks1,
  footerLinks2,
  footerLinks3,
  languageOptions2,
  socialLinks,
} from "@/data/footer";

import Button from "@mui/material/Button";

import { useMenu } from '../../context/MenuContext';

export default function MobileFooter2() {

  const { categoriesSubCategories, isLoading: isMenuLoading, error } = useMenu();

  if (isMenuLoading) {
    return <div></div>;
  }
  if (error) {
    return <div>{ error }</div>;
  }

  return (
    <div className="mb-5">
      <div className="footer-column footer-newsletter col-12 mb-4 mb-lg-0 d-flex flex-column align-items-center">
        <h6 className="sub-menu__title text-uppercase text-white text-center">
          Subscribe
        </h6>
        <p className="text-white text-center">
          Be the first to get the latest news about trends, promotions, and much
          more!
        </p>
        <form className="footer-newsletter__form position-relative bg-body w-75 d-flex ">
          <input
            className="form-control border-white"
            type="email"
            name="email"
            placeholder="Your email address"
          />
          <input
            className="btn-link fw-medium bg-white position-absolute top-0 end-0 h-100"
            type="submit"
            defaultValue="JOIN"
          />
        </form>
      </div>
      <div className="footer-column footer-store-info col-12 mb-4 mb-lg-0">
        <div className="logo d-flex justify-content-center">
          <Link href="/">
            <Image
              src="https://www.ahmedalmaghribi.com/wp-content/uploads/2022/01/Ahmed-logo.svg"
              width={200}
              height={28}
              alt="Ahmed"
              className="logo__image d-block"
            />
          </Link>
        </div>
        {/* <!-- /.logo --> */}
        <p className="footer-address text-white text-center">
          Ahmed Al Maghrebi Perfume Manuf L.L.C, <br />
          Jurf Industrial Zone 3 <br />
          AJMAN, P. O. Box – 3850 <br />
          UAE
        </p>

        <p className="m-0 text-white text-center">
          <strong className="fw-medium">estore@ahmedalmaghribi.com</strong>
        </p>
        <p className="text-center">
          <strong className="fw-medium text-white text-center">
            +971 67420602 / 67422496 / 67446076
          </strong>
        </p>

        <ul className="social-links list-unstyled d-flex flex-wrap mb-0 text-white justify-content-center">
          {socialLinks.map((link, index) => (
            <li key={index}>
              <Link href={link.href} className="footer__social-link d-block">
                <svg
                  className={link.className}
                  width={link.width}
                  height={link.height}
                  viewBox={link.viewBox}
                  xmlns="http://www.w3.org/2000/svg"
                >
                  {typeof link.icon === "string" ? (
                    <use href={link.icon} />
                  ) : (
                    link.icon
                  )}
                </svg>
              </Link>
            </li>
          ))}
        </ul>
      </div>

      <Accordion>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon sx={{ color: "white" }} />}
          sx={{
            backgroundColor: "black",
            color: "white",
          }}
          aria-controls="panel1-content"
          id="panel1-header"
        >
          Company
        </AccordionSummary>
        <AccordionDetails
          sx={{
            backgroundColor: "black",
            color: "white",
          }}
        >
          <ul className="sub-menu__list list-unstyled text-white">
            {footerLinks1.map((elm, i) => (
              <li key={i} className="sub-menu__item text-white">
                <Link
                  href={elm.href}
                  className="menu-link menu-link_us-s text-white"
                >
                  {elm.text}
                </Link>
              </li>
            ))}
          </ul>
        </AccordionDetails>
      </Accordion>
      <Accordion>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon sx={{ color: "white" }} />}
          sx={{
            backgroundColor: "black",
            color: "white",
          }}
          aria-controls="panel1-content"
          id="panel1-header"
        >
          Shop
        </AccordionSummary>
        <AccordionDetails
          sx={{
            backgroundColor: "black",
            color: "white",
          }}
        >
          <ul className="sub-menu__list list-unstyled">
            {categoriesSubCategories.map((elm, i) => (
              <li key={i} className="sub-menu__item">
                <Link
                  href={elm.name != 'Gift Sets' ? `/product-category/${elm.name.split(' ').join('-').toLowerCase()}` : '/product-category/gift-sets'}
                  className="menu-link menu-link_us-s text-white"
                >
                  {elm.name}
                </Link>
              </li>
            ))}
          </ul>
        </AccordionDetails>
      </Accordion>
      {/* <Accordion>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon sx={{ color: "white" }} />}
          sx={{
            backgroundColor: "black",
            color: "white",
          }}
          aria-controls="panel1-content"
          id="panel1-header"
        >
          Help
        </AccordionSummary>
        <AccordionDetails
          sx={{
            backgroundColor: "black",
            color: "white",
          }}
        >
          <ul className="sub-menu__list list-unstyled">
            {footerLinks3.map((elm, i) => (
              <li key={i} className="sub-menu__item">
                <Link
                  href={elm.href}
                  className="menu-link menu-link_us-s text-white"
                >
                  {elm.text}
                </Link>
              </li>
            ))}
          </ul>
        </AccordionDetails>
      </Accordion> */}
      <div className="footer-bottom container text-white text-center">
        <div className="d-block d-md-flex align-items-center flex-nowrap">
          <span className="footer-copyright me-auto d-flex flex-nowrap">
            © {new Date().getFullYear()} AHMED AL MAGHRIBI PERFUMES. All rights
            reserved
          </span>
          <div className="footer-settings d-block d-md-flex align-items-center text-white">
            <div className="d-flex align-items-center text-white">
              <Link className="text-white" href={"/order-tracking"}>Track Order</Link>
            </div>
          </div>
          {/* <!-- /.footer-settings --> */}
        </div>
        {/* <!-- /.d-flex --> */}
      </div>
    </div>
  );
}
