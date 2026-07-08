"use client";

import { useContextElement } from "@/context/Context";
import he from 'he';
import { useState, useEffect, useRef } from 'react';
import { useMenu } from '@/context/MenuContext';
import Pagination1 from "../common/Pagination1";
import FeedbackForm from "../common/Feedback";

export default function OrderPaymentCompleted({ orderDetails: initialOrderDetails, initialOrderCode }) {
  const { isLoading: isMenuLoading, error: isMenuError, currency } = useMenu();
  const { setCartProducts } = useContextElement();

  const [orderData, setOrderData] = useState(initialOrderDetails);
  const [isVerifying, setIsVerifying] = useState(false);

  const isPollingRef = useRef(false);
  const hasFiredPurchase = useRef(false); // prevents purchase event from firing more than once


  // 2. POLLING EFFECT: Check status if it's not final
  useEffect(() => {
    // Define final statuses (Adjust based on your exact API strings)
    const finalStatuses = ['completed', 'failed', 'canceled'];
    
    // If status is NOT final (e.g., 'pending'), start polling
    if (orderData && !finalStatuses.includes(orderData.payment_status)) {
        setIsVerifying(true);
        
        const pollInterval = setInterval(async () => {
            if (isPollingRef.current) return;
            isPollingRef.current = true;

            try {
                // Fetch updated details
                const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}api/orderDetails`, { 
                    method: 'POST',
                    headers: {
                      'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                      order_number: initialOrderCode || orderData.order_id // Ensure we send the Order Code/ID
                    })
                });

                if (response.ok) {
                    const updatedData = await response.json();
                    
                    // If status changed to a final state, update and stop polling
                    if (finalStatuses.includes(updatedData.payment_status)) {
                        setOrderData(updatedData);
                        setIsVerifying(false);
                        clearInterval(pollInterval);
                    }
                }
            } catch (error) {
                console.error("Polling error:", error);
            } finally {
                isPollingRef.current = false;
            }
        }, 10000); // Poll every 10 seconds

        // Cleanup: Stop polling after 50 seconds (timeout) or on unmount
        const timeoutId = setTimeout(() => {
            clearInterval(pollInterval);
            setIsVerifying(false); // Give up and show what we have
        }, 50000);

        return () => {
            clearInterval(pollInterval);
            clearTimeout(timeoutId);
        };
    } else {
        // If loaded initially as completed
        setIsVerifying(false);
    }
  }, [orderData?.payment_status]); // Re-run only if status changes (though setOrderData will trigger re-render)

  // useEffect(() => {
  //   setShowDate(true);
  //   localStorage.setItem('cartList', []);
  //   setCartProducts([]);
  // }, []);
  useEffect(() => {
    if (orderData?.payment_status === "completed" && !hasFiredPurchase.current) {
      hasFiredPurchase.current = true; // lock — never fires again even if orderData updates again

      // Clear cart only after payment confirmed
      localStorage.removeItem("cartList");
      setCartProducts([]);

      // ✅ GA4 purchase (TikTok listener maps to ttq.track("Purchase"))
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({
        event: "purchase",
        ecommerce: {
          transaction_id: orderData.order_id,
          affiliation: "Ahmed Al Maghribi Perfumes Online",
          value: parseFloat(orderData.total),
          currency: currency?.code || "AED",
          items: orderData.products.map((item) => ({
            item_id: item.product_id?.toString(),
            item_name: he.decode(item.product_name),
            price: parseFloat(item.price),
            quantity: item.qty,
          })),
        },
      });
      // NOTE: TikTok Purchase is handled automatically by the dataLayer listener in layout.jsx
      // which maps the 'purchase' GA4 event above to ttq.track("Purchase").

      // ---- Meta (Facebook) Pixel Purchase ----
      if (typeof window.fbq === "function") {
        window.fbq("track", "Purchase", {
          content_ids: orderData.products.map((item) => item.product_id?.toString()),
          content_type: "product",
          contents: orderData.products.map((item) => ({
            id: item.product_id?.toString(),
            quantity: item.qty,
          })),
          value: parseFloat(orderData.total),
          currency: currency?.code || "AED",
          order_id: orderData.order_id,
        });
      }
    }
  }, [orderData]);



  const subTotalPrice = (elm) => {
    if (elm.is_gift) {
      return <td>0.00{currency.symbol} (Free Gift)</td>;
    }
    const currentUTC = new Date(); // Current UTC time
    const currentGST = new Date(currentUTC.getTime() + (4 * 60 * 60 * 1000)); // Add 4 hours for GST
    const current_date_time = currentGST.toISOString().slice(0, 19).replace("T", " ");
    if(elm?.discount_percent) {
      // console.log('...', elm.discount_percent);
      // console.log('...', new Date(current_date_time), new Date(elm.discount.start_date));
      // if(new Date(current_date_time) >= new Date(elm.discount.start_date) && new Date(current_date_time) <= new Date(elm.discount.end_date)) {
        // console.log('if...');
        return <td>{(((elm.price * (1 + elm.vat / 100)) - ((elm.price * (1 + elm.vat / 100)) / 100 * elm.discount_percent)) * elm.qty).toFixed(2)}{ currency.symbol }</td>;
      // } else {
      //   console.log('else...');
      //   return <td>{(elm.price * elm.qty).toFixed(2)}{ currency.symbol }</td>;
      // }
    } else if(elm?.coupon) {
        // console.log('else if');
        return <td>{((elm.price - (elm.price / 100 * elm.coupon.value)) * elm.qty).toFixed(2)}{ currency.symbol }</td>;
    }
    // else if(elm?.sale_price) {
    //   console.log('else if 2');
    //     return <td>{(((elm.price * (1 + elm.vat / 100)) - (elm.sale_price)) * elm.qty).toFixed(2)}{ currency.symbol }</td>;
    // }
    else {
        // console.log('else');
        if(elm.discount_amount && elm.discount_amount != '0') {
          return <td>{ elm.gross_amount }{ currency.symbol }</td>;
        }
        return <td>{((elm.price * (1 + elm.vat / 100)) * elm.qty).toFixed(2)}{ currency.symbol }</td>;
    }
  };

  if (isMenuLoading) {
    return <div><Pagination1 /></div>;
  }
  if (isMenuError) {
    return <div>{ isMenuError }</div>;
  }

  if (isVerifying) {
    return (
        <div className="text-center pt-5 pb-5">
            <h2 className="page-title">VERIFYING PAYMENT...</h2>
            <div className="spinner-border text-primary" role="status" style={{width: '3rem', height: '3rem'}}>
                <span className="visually-hidden">Loading...</span>
            </div>
            <p className="mt-3">Please wait while we confirm your payment with the bank.</p>
        </div>
    );
  }

  return (
    <>
    <h2 className="page-title">{orderData.payment_status != 'failed' ? 'ORDER RECEIVED' : 'ORDER FAILED'}</h2>

    {orderData.order_id ? <><div className="order-complete">
      <div className="order-complete__message">
        {orderData.payment_status != 'failed' && <svg
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
        </svg>}
        {orderData.payment_status != 'failed' ? <h3>Your order is completed!</h3> : <h3>Your order is failed!</h3>}
        {orderData.payment_status != 'failed' && <p>Thank you. Your order has been received.</p>}
        <FeedbackForm orderId={orderData.id} customerName={orderData.customer_name}/>
      </div>
      {orderData.payment_status != 'failed' ? <>
      <div className="order-info">
        <div className="order-info__item">
          <label>Order Number</label>
          <span>{ orderData.order_id }</span>
        </div>
        <div className="order-info__item">
          <label>Date</label>
          <span>{new Date().toLocaleDateString()}</span>
        </div>
        <div className="order-info__item">
          <label>Total</label>

          <span>{orderData.total}{ currency.symbol } (includes { orderData.tax_amount }{ currency.symbol } VAT)
          </span>
        </div>
        <div className="order-info__item">
          <label>Paymetn Method</label>
          <span>{ orderData.payment_method }</span>
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
              {orderData?.products?.map((elm, i) => (
                <tr key={i}>
                  <td>
                    {he.decode(elm.product_name)} x {elm.qty}
                  </td>
                  { subTotalPrice(elm) }
                </tr>
              ))}
            </tbody>
          </table>
          <table className="checkout-totals">
            <tbody>
              <tr>
                <th>SUBTOTAL</th>
                <td>{orderData.sub_total}{ currency.symbol }</td>
              </tr>
              <tr>
                <th>SHIPPING</th>
                <td>{orderData.shipping_amount <= 0 ? 'You Got Free Shipping' : `Shipping Cost: ${ (orderData.shipping_amount * (1 + orderData.vat_amount / 100)).toFixed(2) }${ currency.symbol }`}</td>
              </tr>
              <tr>
                
                <th>SERVICE FEE</th>
                <td>{ (orderData.service_amount * (1 + orderData.vat_amount / 100)).toFixed(2) }{ currency.symbol }</td>
              </tr>

              { orderData.payment_method === "cod" && (
                <tr>
                    <th>COD CHARGES</th>
                    <td>{ (orderData.cod_charge * (1 + orderData.vat_amount / 100)).toFixed(2) }{ currency.symbol }</td> 
                </tr>
              )}
              
              <tr>
                <th>TOTAL</th>
                <td>{orderData.total}{ currency.symbol } (includes { orderData.tax_amount }{ currency.symbol } VAT)
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <a href='/'
          className="btn btn-primary w-100 text-uppercase mb-3"
        >
          Continue Shopping
        </a>
      </div></> : <a href='/' className="btn btn-primary w-100 text-uppercase mb-3">Continue Shopping</a>
      } 
    </div></> :  <a href='/' className="btn btn-primary w-100 text-uppercase mb-3">Continue Shopping</a> }
    </>
  );
}