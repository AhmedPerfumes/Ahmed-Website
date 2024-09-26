"use client";
import Link from "next/link";
import React, { useState } from "react";
import he from 'he';

export default function OrderTrack() {

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const [orderDetails, setOrderDetails] = useState({});

  async function onTrack(event) {
    event.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccess(null);
 
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}api/trackOrder`, {
        method: 'POST',
        body: new FormData(event.currentTarget),
      })
 
      if (!response.ok) {
        throw new Error('Failed to submit the data. Please try again.');
      }
 
      // Handle response if necessary Order
      const data = await response.json();
      if(data.message && data.message.split(' ')[0] == 'Tracking') {
        setSuccess(data.message);
        setError(null);
        setOrderDetails(data);
        setShowDetails(true);
      } else if(data.message && data.message.split(' ')[0] == 'Order') {
        setError(data.message);
        setSuccess(null);
        setShowDetails(false);
      } else {
        if(data['billing_email']) {
          setError(data['billing_email']);
        }
        if(data['order_number']) {
          setError(data['order_number']);
        }
        setSuccess(null);
        setShowDetails(false);
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
    <section className="shop-checkout container">
      <div className="order-tracking">
        <form onSubmit={onTrack} className="needs-validation">
          <h2 className="page-title">Order Tracking</h2>
          <p>
            To track your order please enter your Order ID and Billing Email Address in the box below and
            press the "Track" button.
          </p>
          {error ? <div style={{ color: 'red' }}>{error}</div> : <div style={{ color: 'green' }}>{success}</div>}
          <div className="form-floating my-4">
            <input
              type="text"
              className="form-control"
              id="order_tracking_id"
              placeholder="Order ID *"
              name="order_number"
              required
            />
            <label htmlFor="order_tracking_id">Order ID *</label>
          </div>
          <div className="form-floating my-4">
            <input
              type="email"
              className="form-control"
              id="order_tracking_email"
              placeholder="Billing email *"
              name="billing_email"
              required
            />
            <label htmlFor="order_tracking_email">Billing email *</label>
          </div>
          <button type="submit" className="btn btn-primary btn-track w-100 mb-3">
            TRACK
          </button>
        </form>
      </div>

      
      {showDetails && <div className="order-complete">
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
          <h3>Order Details</h3>
          {/* <p>Thank you. Your order has been received.</p> */}
        </div>
        <div className="order-info">
          <div className="order-info__item">
            <label>Order Number</label>
            <span>{ orderDetails.order_id }</span>
          </div>
          <div className="order-info__item">
            <label>Date</label>
            {<span>{new Date(orderDetails.created_at).toLocaleDateString()}</span>}
          </div>
          <div className="order-info__item">
            <label>Total</label>

            <span>{orderDetails.total}د.إ (includes { orderDetails.shipping_amount > 0 || orderDetails.shipping_amount > 0.00 ? ((20 + orderDetails.sub_total) / 100) * 5 : ((0 + orderDetails.sub_total) / 100) * 5 }د.إ VAT)</span>
          </div>
          <div className="order-info__item">
            <label>Paymetn Method</label>
            <span>{ orderDetails.payment_method }</span>
          </div>
        </div>
        <div className="checkout__totals-wrapper">
          <div className="checkout__totals">
            <h3>Order Details</h3>
            <h4>Status: <span>{orderDetails.status.label}</span></h4>
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
                      {he.decode(elm.product_name)} x {elm.qty}
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
                  <td>{orderDetails.total}د.إ (includes { orderDetails.shipping_amount > 0 || orderDetails.shipping_amount > 0.00 ? ((20 + orderDetails.sub_total) / 100) * 5 : ((0 + orderDetails.sub_total) / 100) * 5 }د.إ VAT)</td>
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
      </div>}
    </section>
  );
}
