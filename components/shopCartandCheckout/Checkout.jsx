"use client";
const countries = [
  "Abu Dhabi",
  "Ajman",
  "Al Ain",
  "Dubai",
  "Fujairah",
  "Ras Al Khaymah",
  "Sharjah",
  "Umm Al Quwain",
];
import { useContextElement } from "@/context/Context";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
export default function Checkout() {
  const { cartProducts, totalPrice } = useContextElement();
  const [selectedRegion, setSelectedRegion] = useState("");
  const [idDDActive, setIdDDActive] = useState(false);
  const [shippingAdd, setShippingAdd] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  return (
    <>
      <form onSubmit={(e) => e.preventDefault()}>
        <div className="checkout-form">
          <div className="billing-info__wrapper">
            <h4>BILLING DETAILS</h4>
            <div className="row">
              <div className="col-md-6">
                <div className="form-floating my-3">
                  <input
                    type="text"
                    className="form-control"
                    id="checkout_first_name"
                    placeholder="First Name"
                  />
                  <label htmlFor="checkout_first_name">First Name</label>
                </div>
              </div>
              <div className="col-md-6">
                <div className="form-floating my-3">
                  <input
                    type="text"
                    className="form-control"
                    id="checkout_last_name"
                    placeholder="Last Name"
                  />
                  <label htmlFor="checkout_last_name">Last Name</label>
                </div>
              </div>
              <div className="col-md-12">
                <div className="search-field my-3">
                  <div
                    className={`form-label-fixed hover-container ${
                      idDDActive ? "js-content_visible" : ""
                    }`}
                  >
                    <label htmlFor="country" className="form-label">
                      Country / Region*
                    </label>
                    <div className="js-hover__open">
                      <input
                        type="text"
                        className="form-control form-control-lg search-field__actor"
                        id="country"
                        name="search-keyword"
                        value="United Arab Emirates"
                        readOnly
                        placeholder="United Arab Emirates"
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-md-12">
                <div className="form-floating mt-3 mb-3">
                  <input
                    type="text"
                    className="form-control"
                    id="checkout_street_address"
                    placeholder="Area / Mantaqa *"
                  />
                  <label htmlFor="checkout_company_name">
                    Area / Mantaqa *
                  </label>
                </div>
                <div className="form-floating mt-3 mb-3">
                  <input
                    type="text"
                    className="form-control"
                    id="checkout_street_address_2"
                    placeholder="Building / Villa / Apartment"
                  />
                  <label htmlFor="checkout_company_name">
                    Building / Villa / Apartment
                  </label>
                </div>
              </div>

              <div className="col-md-12">
                <div className="search-field my-3">
                  <div
                    className={`form-label-fixed hover-container ${
                      idDDActive ? "js-content_visible" : ""
                    }`}
                  >
                    <label htmlFor="search-dropdown" className="form-label">
                      Emirates*
                    </label>
                    <div className="js-hover__open">
                      <input
                        type="text"
                        className="form-control form-control-lg search-field__actor search-field__arrow-down"
                        id="search-dropdown"
                        name="search-keyword"
                        value={selectedRegion}
                        readOnly
                        placeholder="Select Emirate..."
                        onClick={() => setIdDDActive((pre) => !pre)}
                      />
                    </div>
                    <div className="filters-container js-hidden-content mt-2">
                      <div className="search-field__input-wrapper">
                        <input
                          type="text"
                          className="search-field__input form-control form-control-sm bg-lighter border-lighter"
                          placeholder="Search"
                          onChange={(e) => {
                            setSearchQuery(e.target.value);
                          }}
                        />
                      </div>
                      <ul className="search-suggestion list-unstyled">
                        {countries
                          .filter((elm) =>
                            elm
                              .toLowerCase()
                              .includes(searchQuery.toLowerCase())
                          )
                          .map((elm, i) => (
                            <li
                              onClick={() => {
                                setSelectedRegion(elm);
                                setIdDDActive(false);
                              }}
                              key={i}
                              className="search-suggestion__item js-search-select"
                            >
                              {elm}
                            </li>
                          ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-md-12">
                <div className="form-floating my-3">
                  <input
                    type="number"
                    className="form-control"
                    id="checkout_phone"
                    placeholder="Phone *"
                  />
                  <label htmlFor="checkout_phone">Phone *</label>
                </div>
              </div>
              <div className="col-md-12">
                <div className="form-floating my-3">
                  <input
                    type="email"
                    className="form-control"
                    id="checkout_email"
                    placeholder="Your Mail *"
                  />
                  <label htmlFor="checkout_email">Email Address *</label>
                </div>
              </div>
              <div className="col-md-12">
                <div className="form-check mt-3">
                  <input
                    className="form-check-input form-check-input_fill"
                    type="checkbox"
                    defaultValue=""
                    id="create_account"
                  />
                  <label className="form-check-label" htmlFor="create_account">
                    CREATE AN ACCOUNT?
                  </label>
                </div>
                <div className="form-check mb-3">
                  <input
                    className="form-check-input form-check-input_fill"
                    type="checkbox"
                    defaultValue=""
                    id="ship_different_address"
                    onClick={() => setShippingAdd((pre) => !pre)}
                  />
                  <label
                    className="form-check-label"
                    htmlFor="ship_different_address"
                  >
                    SHIP TO A DIFFERENT ADDRESS?
                  </label>
                </div>
              </div>
            </div>
            <div className="col-md-12">
              <div className="mt-3">
                <textarea
                  className="form-control form-control_gray"
                  placeholder="Order Notes (optional)"
                  cols="30"
                  rows="8"
                ></textarea>
              </div>
            </div>
          </div>
          <div className="checkout__totals-wrapper">
            <div className="sticky-content">
              <div className="checkout__totals">
                <h3>Your Order</h3>
                <table className="checkout-cart-items">
                  <thead>
                    <tr>
                      <th>PRODUCT</th>
                      <th>SUBTOTAL</th>
                    </tr>
                  </thead>
                  <tbody>
                    {cartProducts.map((elm, i) => (
                      <tr key={i}>
                        <td>
                          {elm.title} x {elm.quantity}
                        </td>
                        <td>${elm.price * elm.quantity}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <table className="checkout-totals">
                  <tbody>
                    <tr>
                      <th>SUBTOTAL</th>
                      <td>${totalPrice}</td>
                    </tr>
                    <tr>
                      <th>SHIPPING</th>
                      <td>Free shipping</td>
                    </tr>
                    <tr>
                      <th>VAT</th>
                      <td>${totalPrice && 19}</td>
                    </tr>
                    <tr>
                      <th>TOTAL</th>
                      <td>${totalPrice && totalPrice + 19}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div className="checkout__payment-methods">
                <div className="form-check">
                  <input
                    className="form-check-input form-check-input_fill"
                    type="radio"
                    name="checkout_payment_method"
                    id="checkout_payment_method_3"
                  />
                  <label
                    className="form-check-label"
                    htmlFor="checkout_payment_method_3"
                  >
                    Cash on delivery
                    {/* <span className="option-detail d-block">
                      Phasellus sed volutpat orci. Fusce eget lore mauris
                      vehicula elementum gravida nec dui. Aenean aliquam varius
                      ipsum, non ultricies tellus sodales eu. Donec dignissim
                      viverra nunc, ut aliquet magna posuere eget.
                    </span> */}
                  </label>
                </div>
                <div className="form-check">
                  <input
                    className="form-check-input form-check-input_fill"
                    type="radio"
                    name="checkout_payment_method"
                    id="checkout_payment_method_4"
                  />
                  <label
                    className="form-check-label"
                    htmlFor="checkout_payment_method_4"
                  >
                    PayTabs - Credit / Debit Card
                    <Image
                      src="https://www.ahmed-perfume.com/wp-content/plugins/paytabs-woocommerce/icons/creditcard.svg"
                      width="100"
                      height="20"
                      alt="Cropped Faux leather Jacket"
                    />
                    {/* <span className="option-detail d-block">
                      Phasellus sed volutpat orci. Fusce eget lore mauris
                      vehicula elementum gravida nec dui. Aenean aliquam varius
                      ipsum, non ultricies tellus sodales eu. Donec dignissim
                      viverra nunc, ut aliquet magna posuere eget.
                    </span> */}
                  </label>
                </div>
                <div className="policy-text">
                  Your personal data will be used to process your order, support
                  your experience throughout this website, and for other
                  purposes described in our
                  <Link href="/terms" target="_blank">
                    privacy policy
                  </Link>
                  .
                </div>
              </div>
              <button className="btn btn-primary btn-checkout">
                PLACE ORDER
              </button>
            </div>
          </div>
        </div>
      </form>

      {shippingAdd == true ? (
        <form className="col-md-8" onSubmit={(e) => e.preventDefault()}>
          <div className="checkout-form">
            <div className="billing-info__wrapper">
              <h4>SHIPPING DETAILS</h4>
              <div className="row">
                <div className="col-md-6">
                  <div className="form-floating my-3">
                    <input
                      type="text"
                      className="form-control"
                      id="checkout_first_name"
                      placeholder="First Name"
                    />
                    <label htmlFor="checkout_first_name">First Name</label>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="form-floating my-3">
                    <input
                      type="text"
                      className="form-control"
                      id="checkout_last_name"
                      placeholder="Last Name"
                    />
                    <label htmlFor="checkout_last_name">Last Name</label>
                  </div>
                </div>
                <div className="col-md-12">
                  <div className="search-field my-3">
                    <div
                      className={`form-label-fixed hover-container ${
                        idDDActive ? "js-content_visible" : ""
                      }`}
                    >
                      <label htmlFor="country" className="form-label">
                        Country / Region*
                      </label>
                      <div className="js-hover__open">
                        <input
                          type="text"
                          className="form-control form-control-lg search-field__actor"
                          id="country"
                          name="search-keyword"
                          value="United Arab Emirates"
                          readOnly
                          placeholder="United Arab Emirates"
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-md-12">
                  <div className="form-floating mt-3 mb-3">
                    <input
                      type="text"
                      className="form-control"
                      id="checkout_street_address"
                      placeholder="Address *"
                    />
                    <label htmlFor="checkout_company_name">
                      Area / Mantaqa *
                    </label>
                  </div>
                  <div className="form-floating mt-3 mb-3">
                    <input
                      type="text"
                      className="form-control"
                      id="checkout_street_address_2"
                      placeholder="Building / Villa / Apartment"
                    />
                    <label htmlFor="checkout_company_name">
                      Building / Villa / Apartment
                    </label>
                  </div>
                </div>

                <div className="col-md-12">
                  <div className="search-field my-3">
                    <div
                      className={`form-label-fixed hover-container ${
                        idDDActive ? "js-content_visible" : ""
                      }`}
                    >
                      <label htmlFor="search-dropdown" className="form-label">
                        Emirates*
                      </label>
                      <div className="js-hover__open">
                        <input
                          type="text"
                          className="form-control form-control-lg search-field__actor search-field__arrow-down"
                          id="search-dropdown"
                          name="search-keyword"
                          value={selectedRegion}
                          readOnly
                          placeholder="Select Emirate..."
                          onClick={() => setIdDDActive((pre) => !pre)}
                        />
                      </div>
                      <div className="filters-container js-hidden-content mt-2">
                        <div className="search-field__input-wrapper">
                          <input
                            type="text"
                            className="search-field__input form-control form-control-sm bg-lighter border-lighter"
                            placeholder="Search"
                            onChange={(e) => {
                              setSearchQuery(e.target.value);
                            }}
                          />
                        </div>
                        <ul className="search-suggestion list-unstyled">
                          {countries
                            .filter((elm) =>
                              elm
                                .toLowerCase()
                                .includes(searchQuery.toLowerCase())
                            )
                            .map((elm, i) => (
                              <li
                                onClick={() => {
                                  setSelectedRegion(elm);
                                  setIdDDActive(false);
                                }}
                                key={i}
                                className="search-suggestion__item js-search-select"
                              >
                                {elm}
                              </li>
                            ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-md-12">
                  <div className="form-floating my-3">
                    <input
                      type="number"
                      className="form-control"
                      id="checkout_phone"
                      placeholder="Phone *"
                    />
                    <label htmlFor="checkout_phone">Phone *</label>
                  </div>
                </div>
                <div className="col-md-12">
                  <div className="form-floating my-3">
                    <input
                      type="email"
                      className="form-control"
                      id="checkout_email"
                      placeholder="Your Mail *"
                    />
                    <label htmlFor="checkout_email">Email Address *</label>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </form>
      ) : null}
    </>
  );
}
