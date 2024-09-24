"use client";

import { useContextElement } from "@/context/Context";
import { useEffect, useState } from "react";
import he from 'he';
import Link from "next/link";

export default function OrderCompleted() {
  const { cartProducts, totalPrice, freeShippingFlag, orderDetails, setCartProducts, setOrderDetails } = useContextElement();
  const [showDate, setShowDate] = useState(false);
  const [orderData, setorderData] = useState(null);
  useEffect(() => {
    setShowDate(true);
    localStorage.setItem('cartList', []);
    setCartProducts([]);
    setOrderDetails(localStorage.getItem('orderData').length > 0 && JSON.parse(atob(localStorage.getItem('orderData'))));
    localStorage.setItem('orderData', '');
    // console.log('...', localStorage.getItem('orderData').length);
  }, []);

  return (
    <>
    {Object.keys(orderDetails).length ? <><div className="order-complete">
      <div className="order-complete__message">
        <svg
          width="80"
          height="80"
          viewBox="0 0 80 80"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle cx="40" cy="40" r="40" fill="#B9A16B" />
          <path
            d="M52.9743 35.7612C52.9743 35.3426 52.8069 34.9241 52.5056 34.6228L50.2288 32.346C49.9275 32.0446 49.5089 31.8772 49.0904 31.8772C48.6719 31.8772 48.2533 32.0446 47.952 32.346L36.9699 43.3449L32.048 38.4062C31.7467 38.1049 31.3281 37.9375 30.9096 37.9375C30.4911 37.9375 30.0725 38.1049 29.7712 38.4062L27.4944 40.683C27.1931 40.9844 27.0257 41.4029 27.0257 41.8214C27.0257 42.24 27.1931 42.6585 27.4944 42.9598L33.5547 49.0201L35.8315 51.2969C36.1328 51.5982 36.5513 51.7656 36.9699 51.7656C37.3884 51.7656 37.8069 51.5982 38.1083 51.2969L40.385 49.0201L52.5056 36.8996C52.8069 36.5982 52.9743 36.1797 52.9743 35.7612Z"
            fill="white"
          />
        </svg>
        <h3>Your order is completed!</h3>
        <p>Thank you. Your order has been received.</p>
      </div>
      <div className="order-info">
        <div className="order-info__item">
          <label>Order Number</label>
          <span>{ orderDetails.order_id }</span>
        </div>
        <div className="order-info__item">
          <label>Date</label>
          {showDate && <span>{new Date().toLocaleDateString()}</span>}
        </div>
        <div className="order-info__item">
          <label>Total</label>

          <span>{orderDetails.total}د.إ (includes { !freeShippingFlag ? ((20 + orderDetails.sub_total) / 100) * 5 : ((0 + orderDetails.sub_total) / 100) * 5 }د.إ VAT)</span>
        </div>
        <div className="order-info__item">
          <label>Paymetn Method</label>
          <span>{ orderDetails.payment_method }</span>
        </div>
      </div>
      <div className="checkout__totals-wrapper">
        <div className="checkout__totals">
          <h3>Order Details</h3>
          <table className="checkout-cart-items">
            <thead>
              <tr>
                <th>PRODUCT</th>
                <th>SUBTOTAL</th>
              </tr>
            </thead>
            <tbody>
              {orderDetails?.products?.map((elm, i) => (
                <tr key={i}>
                  <td>
                    {he.decode(elm.name)} x {elm.qty}
                  </td>
                  <td>{elm.price * elm.qty}د.إ</td>
                </tr>
              ))}
            </tbody>
          </table>
          <table className="checkout-totals">
            <tbody>
              <tr>
                <th>SUBTOTAL</th>
                <td>{orderDetails.sub_total}د.إ</td>
              </tr>
              <tr>
                <th>SHIPPING</th>
                <td>{orderDetails.sub_total >= 400 ? 'You Got Free Shipping' : 'Shipping Cost: 20د.إ'}</td>
              </tr>
              <tr>
                <th>SERVICE FEE</th>
                <td>3د.إ</td>
              </tr>
              <tr>
                <th>TOTAL</th>
                <td>{orderDetails.total}د.إ (includes { !freeShippingFlag ? ((20 + orderDetails.sub_total) / 100) * 5 : ((0 + orderDetails.sub_total) / 100) * 5 }د.إ VAT)</td>
              </tr>
            </tbody>
          </table>
        </div>
        <Link href='/'
          className="btn btn-primary w-100 text-uppercase"
        >
          Continue Shopping
        </Link>
      </div>      
    </div></> :  <Link href='/' className="btn btn-primary w-100 text-uppercase">Continue Shopping</Link> }
    </>
  );
}
