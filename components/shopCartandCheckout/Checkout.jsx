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
import { useUser } from "@/context/UserContext";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import he from 'he';
import { products1 } from "@/data/products/fashion";
import { useRouter } from 'next/navigation';

export default function Checkout() {
  const router = useRouter();
  const { cartProducts, totalPrice, freeShippingFlag, setOrderDetails } = useContextElement();
  const { isLoggedIn } = useUser();
  // const [selectedRegion, setSelectedRegion] = useState("");
  const [idDDActive, setIdDDActive] = useState(false);
  // const [shippingAdd, setShippingAdd] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedOption, setSelectedOption] = useState('cod');
  const [formData, setFormData] = useState({
    shippingAddress: {
      first_name: '',
      last_name: '',
      mobile: '',
      email: '',
      country: 'AE',
      area: '',
      building: '',
      emirates: ''
    },
    billingAddress: {
      first_name: '',
      last_name: '',
      mobile: '',
      email: '',
      country: 'AE',
      area: '',
      building: '',
      emirates: ''
    },
    shippingAdd: false,
    note: '',
    password: '',
  });
  const [createAccount, setCreateAccount] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleRadioChange = (event) => {
    setSelectedOption(event.target.value);
  };

  const handleChange = (event) => {
    const { name, value } = event.target;

    if (name.startsWith('shipping') || name.startsWith('billing')) {
      const addressField = name.startsWith('shipping') ? 'shippingAddress' : 'billingAddress';
      const fieldName = name.split('.')[1]; // Get the specific field (e.g., street, city)
      setFormData((prevData) => ({
        ...prevData,
        [addressField]: {
          ...prevData[addressField],
          [fieldName]: value,
        },
      }));
    } else {
      setFormData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
  };

  const handleCheckboxChange = () => {
    setFormData((prevData) => {
      const newSameAsShipping = !prevData.shippingAdd;
      return {
        ...prevData,
        shippingAdd: newSameAsShipping,
        shippingAddress: { first_name: '', last_name: '', mobile: '', email: '', area: '', building: '', emirates: '' }
      }
    });
  };

  const handleEmiratesChange = (event, emirates) => {
    const { id } = event.target;
    // console.log(id, emirates);
    if (id.startsWith('shipping') || id.startsWith('billing')) {
      const addressField = id.startsWith('shipping') ? 'shippingAddress' : 'billingAddress';
      const fieldName = id.split('.')[1]; // Get the specific field (e.g., street, city)
      setFormData((prevData) => {
        return {
          ...prevData,
          [addressField]: {
            ...prevData[addressField],
            [fieldName]: emirates,
          },
        };
      });
    }
  };
 
  async function onOrder(event) {
    event.preventDefault();
    console.log('Order submitted:', formData);
    setIsLoading(true);
    setError(null);
    setSuccess(null);

    const shippingPrice = freeShippingFlag ? 0 : 20;
    const finalPrice = !freeShippingFlag ? 20 + totalPrice + 3 : 0 + totalPrice + 3

    let userJson = null;
    if(isLoggedIn) {
      const user = atob(localStorage.getItem('user'));
      userJson = JSON.parse(user);
    }

    const additionalFields = {
      ...formData,
      products : cartProducts,
      payment_method: selectedOption,
      shippingPrice,
      totalPrice,
      finalPrice,
      customer_id: userJson ? userJson.id : null,
    }
 
    try {
      // const formDataa = new FormData(additionalFields);
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}api/storeOrder`, {
        method: 'POST',
        body: JSON.stringify(additionalFields),
        headers: {
          'content-type': 'application/json'
        }
      })
 
      if (!response.ok) {
        throw new Error('Failed to submit the data. Please try again.');
      }
 
      // Handle response if necessary
      const data = await response.json();
      if(data.message && data.message.split(' ')[0] == 'Order') {
        setSuccess(data.message);
        setError(null);
        setOrderDetails(data);
        setFormData({
          shippingAddress: {
            first_name: '',
            last_name: '',
            mobile: '',
            email: '',
            // country: '',
            area: '',
            building: '',
            emirates: ''
          },
          billingAddress: {
            first_name: '',
            last_name: '',
            mobile: '',
            email: '',
            // country: '',
            area: '',
            building: '',
            emirates: ''
          },
          shippingAdd: false,
        });
        setTimeout(() => router.push('/shop-order-complete'), 1000);
      } else {
        if(data.products) {
          setError(data.products);
        }
        if(data['billingAddress.first_name']) {
          setError(data['billingAddress.first_name']);
        }
        if(data['billingAddress.last_name']) {
          setError(data['billingAddress.last_name']);
        }
        if(data['billingAddress.email']) {
          setError(data['billingAddress.email']);
        }
        if(data['billingAddress.mobile']) {
          setError(data['billingAddress.mobile']);
        }
        if(data['billingAddress.area']) {
          setError(data['billingAddress.area']);
        }
        if(data['billingAddress.building']) {
          setError(data['billingAddress.building']);
        }
        if(data['billingAddress.emirates']) {
          setError(data['billingAddress.emirates']);
        }
        setSuccess(null);
      }
      console.log(data);
    } catch (error) {
      // Capture the error message to display to the user
      setError(error.message);
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <>
      <form onSubmit={onOrder}>
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
                    name="billingAddress.first_name"
                    value={formData.billingAddress.first_name}
                    onChange={handleChange}
                    required
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
                    name="billingAddress.last_name"
                    value={formData.billingAddress.last_name}
                    onChange={handleChange}
                    required
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
                        name="billingAddress.country"
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
                    name="billingAddress.area"
                    value={formData.billingAddress.area}
                    onChange={handleChange}
                    required
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
                    name="billingAddress.building"
                    value={formData.billingAddress.building}
                    onChange={handleChange}
                    required
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
                        name="billingAddress.emirates"
                        value={formData.billingAddress.emirates}
                        readOnly
                        placeholder="Select Emirate..."
                        onClick={() => setIdDDActive((pre) => !pre)}
                        required
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
                              id="billingAddress.emirates"
                              onClick={(e) => {
                                handleEmiratesChange(e, elm);
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
                    placeholder="Eg. 971500000000 *"
                    name="billingAddress.mobile"
                    value={formData.billingAddress.mobile}
                    onChange={handleChange}
                    required
                  />
                  <label htmlFor="checkout_phone">Phone (Eg. 971500000000)*</label>
                </div>
              </div>
              <div className="col-md-12">
                <div className="form-floating my-3">
                  <input
                    type="email"
                    className="form-control"
                    id="billingAddress.email"
                    placeholder="Your Mail *"
                    name="billingAddress.email"
                    value={formData.billingAddress.email}
                    onChange={handleChange}
                    required
                  />
                  <label htmlFor="checkout_email">Email Address *</label>
                </div>
              </div>
              <div className="col-md-12">
                {!isLoggedIn && <div className="form-check mt-3">
                  <input
                    className="form-check-input form-check-input_fill"
                    type="checkbox"
                    defaultValue=""
                    id="create_account"
                    onClick={(prev) => setCreateAccount(!createAccount)}
                    name="create_account"
                  />
                  <label className="form-check-label" htmlFor="create_account">
                    CREATE AN ACCOUNT?
                  </label>
                </div>}
                <div className="form-check mb-3">
                  <input
                    className="form-check-input form-check-input_fill"
                    type="checkbox"
                    defaultValue=""
                    id="ship_different_address"
                    onClick={handleCheckboxChange}
                    name="shipping"
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
                  name="note"
                  onChange={handleChange}
                  value={ formData.note }
                ></textarea>
              </div>
            </div>
            {createAccount && <div className="col-md-12">
              <div className="form-floating my-3">
                <input
                  type="password"
                  className="form-control"
                  id="password"
                  placeholder="Password *"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
                <label htmlFor="checkout_email">Password *</label>
              </div>
            </div>}
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
                          {he.decode(elm.product_name)} x {elm.quantity}
                        </td>
                        <td>{elm.price * elm.quantity}د.إ</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <table className="checkout-totals">
                  <tbody>
                    <tr>
                      <th>SUBTOTAL</th>
                      <td>{totalPrice}د.إ</td>
                    </tr>
                    <tr>
                      <th>SHIPPING</th>
                      <td>{freeShippingFlag ? 'You Got Free Shipping' : 'Shipping Cost: 20د.إ'}</td>
                    </tr>
                    <tr>
                    <th>SERVICE FEE</th>
                    <td>3د.إ</td>
                    </tr>
                    <tr>
                      <th>TOTAL</th>
                      <td>{!freeShippingFlag ? 20 + totalPrice + 3 : 0 + totalPrice + 3}د.إ (includes { !freeShippingFlag ? ((20 + totalPrice) / 100) * 5 : ((0 + totalPrice) / 100) * 5 }د.إ VAT)</td>
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
                    value={'cod'}
                    checked={selectedOption === 'cod'}
                    onChange={handleRadioChange}
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
                    value={'paytabs'}
                    checked={selectedOption === 'paytabs'}
                    onChange={handleRadioChange}
                  />
                  <label
                    className="form-check-label"
                    htmlFor="checkout_payment_method_4"
                  >
                    PayTabs - Credit / Debit Card
                    <Image
                      src="https://www.ahmedalmaghribi.com/wp-content/plugins/paytabs-woocommerce/icons/creditcard.svg"
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
              {error ? <div style={{ color: 'red' }}>{error}</div> : <div style={{ color: 'green' }}>{success}</div>}
              <button
                className="btn btn-primary w-100 text-uppercase"
                type="submit"
                disabled={isLoading}
              >
                {isLoading ? 'Loading...' : 'Place Order'}
              </button>
            </div>
          </div>
        </div>
      {/* </form> */}

      {formData.shippingAdd == true ? (
        // <form className="col-md-8" onSubmit={(e) => e.preventDefault()}>
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
                      name="shippingAddress.first_name"
                      value={formData.shippingAddress.first_name}
                      onChange={handleChange}
                      required
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
                      name="shippingAddress.last_name"
                      value={formData.shippingAddress.last_name}
                      onChange={handleChange}
                      required
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
                          name="shippingAddress.country"
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
                      name="shippingAddress.area"
                      value={formData.shippingAddress.area}
                      onChange={handleChange}
                      required
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
                      name="shippingAddress.building"
                      value={formData.shippingAddress.building}
                      onChange={handleChange}
                      required
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
                          name="shippingAddress.emirates"
                          value={formData.shippingAddress.emirates}
                          readOnly
                          placeholder="Select Emirate..."
                          onClick={() => setIdDDActive((pre) => !pre)}
                          required
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
                              id="shippingAddress.emirates"
                                onClick={(e) => {
                                  handleEmiratesChange(e, elm);
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
                      placeholder="Eg. 971500000000 *"
                      name="shippingAddress.mobile"
                      value={formData.shippingAddress.mobile}
                      onChange={handleChange}
                      required
                    />
                    <label htmlFor="checkout_phone">Phone (Eg. 971500000000)*</label>
                  </div>
                </div>
                <div className="col-md-12">
                  <div className="form-floating my-3">
                    <input
                      type="email"
                      className="form-control"
                      id="checkout_email"
                      placeholder="Your Mail *"
                      name="shippingAddress.email"
                      value={formData.shippingAddress.email}
                      onChange={handleChange}
                      required
                    />
                    <label htmlFor="checkout_email">Email Address *</label>
                  </div>
                </div>
              </div>
            </div>
          </div>
      ) : null}
        </form>
    </>
  );
}
