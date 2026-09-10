"use client";
import React, { useState, useEffect } from "react";
import {
  Spinner,
  Button,
  Modal,
  Badge,
} from "react-bootstrap";
import he from "he";
import { useMenu } from "@/context/MenuContext";
import { apiClient } from "@/lib/apiClient";

const IMG_BASE = process.env.NEXT_PUBLIC_API_URL;

export default function AccountOrders() {
  const { currency } = useMenu();
  const [data, setData] = useState([]);
  const [orderSummaries, setOrderSummaries] = useState({});
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 4 });
  const [pageCount, setPageCount] = useState(0);
  const [activeStatus, setActiveStatus] = useState("all");

  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  // Modal state
  const [showModal, setShowModal] = useState(false);
  const [modalLoading, setModalLoading] = useState(false);
  const [modalDetails, setModalDetails] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);

  // Product review states
  const [reviewedProductIds, setReviewedProductIds] = useState([]);
  const [activeReviewProductId, setActiveReviewProductId] = useState(null);
  const [currentRating, setCurrentRating] = useState(5);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [reviewComment, setReviewComment] = useState("");
  const [submittingReview, setSubmittingReview] = useState(false);
  const [reviewError, setReviewError] = useState("");
  const [reviewSuccessMessage, setReviewSuccessMessage] = useState("");

  const fetchOrders = async () => {
    setLoading(true);
    const params = new URLSearchParams({
      page: String(pagination.pageIndex + 1),
      pageSize: String(pagination.pageSize),
      orderBy: "created_at",
      orderDir: "desc",
      with_products: "1",
      ...(activeStatus !== "all" && { status: activeStatus }),
    });

    try {
      const res = await apiClient(`api/customerOrders?${params}`);
      if (!res.ok) throw new Error("Failed to fetch orders");
      const json = await res.json();
      setData(json.data || []);
      setPageCount(Math.ceil((json.total || 0) / pagination.pageSize));

      // Map products eagerly loaded from backend
      const summaryResults = {};
      (json.data || []).forEach(order => {
        summaryResults[order.id] = order.products || [];
      });
      setOrderSummaries(summaryResults);
    } catch (e) {
      // console.error("Fetch error", e);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchOrders();
  }, [pagination.pageIndex, pagination.pageSize, activeStatus]);

  const openDetails = async (order) => {
    setSelectedOrder(order);
    setShowModal(true);
    setModalLoading(true);
    setActiveReviewProductId(null);
    setReviewComment("");
    setReviewError("");
    setReviewSuccessMessage("");
    setCurrentRating(5);
    setHoveredRating(0);
    try {
      const resp = await apiClient(`api/customerOrderDetails`, {
        method: "POST",
        body: JSON.stringify({ order_id: order.id }),
      });
      const json = await resp.json();
      setModalDetails(json);
      if (json.order) {
        setSelectedOrder(json.order);
      }
      if (Array.isArray(json.reviewed_product_ids)) {
        setReviewedProductIds(json.reviewed_product_ids.map(Number));
      }
    } catch (e) {
      setModalDetails(null);
    }
    setModalLoading(false);
  };

  const closeModal = () => {
    setShowModal(false);
    setActiveReviewProductId(null);
    setReviewComment("");
    setReviewError("");
    setReviewSuccessMessage("");
  };

  const toggleReviewDrawer = (productId) => {
    if (activeReviewProductId === productId) {
      setActiveReviewProductId(null);
      setReviewComment("");
      setReviewError("");
    } else {
      setActiveReviewProductId(productId);
      setReviewComment("");
      setReviewError("");
      setCurrentRating(5);
      setHoveredRating(0);
    }
  };

  const handleReviewSubmit = async (productId) => {
    if (!currentRating || currentRating < 1 || currentRating > 5) {
      setReviewError("Please select a rating.");
      return;
    }
    if (!reviewComment.trim()) {
      setReviewError("Please write a review comment.");
      return;
    }

    setSubmittingReview(true);
    setReviewError("");

    try {
      const customerName = modalDetails?.order_address?.[0]?.name || "Customer";
      const customerEmail = modalDetails?.order_address?.[0]?.email || "";
      const customerPhone = modalDetails?.order_address?.[0]?.phone || "";

      const resp = await apiClient("api/reviews", {
        method: "POST",
        body: JSON.stringify({
          product_id: productId,
          order_id: selectedOrder?.id,
          star: currentRating,
          comment: reviewComment.trim(),
          customer_name: customerName,
          customer_email: customerEmail,
          customer_phone: customerPhone,
        }),
      });

      const json = await resp.json();

      if (resp.ok) {
        setReviewedProductIds((prev) => [...new Set([...prev, Number(productId)])]);
        setActiveReviewProductId(null);
        setReviewComment("");
        setReviewSuccessMessage("Review submitted for approval. Thank you for your feedback.");
        setTimeout(() => setReviewSuccessMessage(""), 5000);
      } else {
        setReviewError(json.message || "Failed to submit review. Please try again.");
      }
    } catch (err) {
      setReviewError("An error occurred while submitting your review.");
    } finally {
      setSubmittingReview(false);
    }
  };

  const getRatingLabel = (star) => {
    switch (star) {
      case 5: return "Excellent (5/5)";
      case 4: return "Very Good (4/5)";
      case 3: return "Average (3/5)";
      case 2: return "Below Average (2/5)";
      case 1: return "Poor (1/5)";
      default: return "";
    }
  };


  const filteredData = data;

  const StatusBadge = ({ status }) => {
    const val = status?.value;
    const label = status?.label || "";
    let color = "#6B7280";
    let bg = "#F3F4F6";

    if (val === "processing") { color = "#0284C7"; bg = "#F0F9FF"; }
    else if (val === "shipped") { color = "#4F46E5"; bg = "#EEF2FF"; }
    else if (val === "completed") { color = "#059669"; bg = "#ECFDF5"; }
    else if (val === "returned") { color = "#D97706"; bg = "#FFFBEB"; }
    else if (val === "cancelled") { color = "#DC2626"; bg = "#FEF2F2"; }

    return (
      <span style={{
        display: "inline-flex",
        alignItems: "center",
        padding: "2px 10px",
        borderRadius: "9999px",
        fontSize: "12px",
        fontWeight: "500",
        color: color,
        backgroundColor: bg,
        textTransform: "capitalize"
      }}>
        {label}
      </span>
    );
  };

  return (
    <div className={`account-orders-minimalist stagger-item ${mounted ? 'is-visible' : ''}`}>

      <div className="section-header">
        <div className="filter-tabs">
          {[
            { key: "all", label: "All Orders" },
            { key: "processing", label: "Processing" },
            { key: "shipped", label: "Shipped" },
            { key: "completed", label: "Completed" },
            { key: "cancelled", label: "Cancelled" },
          ].map(tab => (
            <button
              key={tab.key}
              className={`filter-tab ${activeStatus === tab.key ? 'active' : ''}`}
              onClick={() => {
                setActiveStatus(tab.key);
                setPagination(prev => ({ ...prev, pageIndex: 0 }));
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="order-list">
          {[1, 2, 3].map(i => (
            <div key={i} className="skeleton-card">
              <div className="skeleton-header">
                <div className="skeleton skeleton-id"></div>
                <div className="skeleton skeleton-date"></div>
              </div>
              <div className="skeleton-content">
                <div className="skeleton skeleton-thumb"></div>
                <div className="skeleton skeleton-thumb"></div>
              </div>
              <div className="skeleton-footer">
                <div className="skeleton skeleton-amount"></div>
                <div className="skeleton skeleton-btn"></div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="order-list">
          {filteredData.length > 0 ? filteredData.map((order) => (
            <div key={order.id} className="order-card">
              <div className="order-card-header">
                <div className="order-meta">
                  <span className="order-id">Order {order.code}</span>
                  <span className="order-date">{new Date(order.created_at).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                </div>
                <StatusBadge status={order.status} />
              </div>

              <div className="order-card-content">
                <div className="product-previews">
                  {(orderSummaries[order.id] || []).slice(0, 4).map((prod, i) => (
                    <img
                      key={i}
                      className="product-thumb"
                      src={prod.product_image ? `${IMG_BASE}storage/${prod.product_image}` : "/no-img.png"}
                      alt=""
                    />
                  ))}
                </div>
                {orderSummaries[order.id]?.length > 4 && (
                  <span className="product-count">+{orderSummaries[order.id].length - 4} more</span>
                )}
              </div>

              <div className="order-card-footer">
                <div className="order-total">
                  <span className="total-label">Total Amount: </span>
                  <span className="total-amount">{Number(order.amount).toFixed(currency.decimals)} {currency.symbol}</span>
                </div>
                <div className="order-actions">
                  <button className="btn-minimal" onClick={() => openDetails(order)}>Order Details</button>
                </div>
              </div>
            </div>
          )) : (
            <div className="py-5 text-center text-muted">
              No orders found for this selection.
            </div>
          )}
        </div>
      )}

      {pageCount > 1 && (
        <div className="pagination">
          <div className="pagination-info">
            Page {pagination.pageIndex + 1} of {pageCount}
          </div>
          <div className="pagination-actions">
            <button
              className="pagination-btn"
              disabled={pagination.pageIndex === 0}
              onClick={() => setPagination(prev => ({ ...prev, pageIndex: prev.pageIndex - 1 }))}
            >
              <span>←</span> Previous
            </button>
            <button
              className="pagination-btn"
              disabled={pagination.pageIndex === pageCount - 1}
              onClick={() => setPagination(prev => ({ ...prev, pageIndex: prev.pageIndex + 1 }))}
            >
              Next <span>→</span>
            </button>
          </div>
        </div>
      )}

      {/* Modal Details */}
      <Modal
        show={showModal}
        onHide={closeModal}
        centered
        className="order-modal"
        size="lg"
      >
        <Modal.Header closeButton className="border-0 pb-0">
          <Modal.Title style={{ fontSize: '20px', fontWeight: '600' }}>Order Details</Modal.Title>
        </Modal.Header>
        <Modal.Body className="pt-0">
          {modalLoading ? (
            <div className="modal-body-content">
              <div className="row mt-4">
                <div className="col-md-7">
                  <div className="skeleton mb-2" style={{ width: '150px', height: '24px' }}></div>
                  <div className="skeleton mb-4" style={{ width: '100px', height: '14px' }}></div>
                  <div className="item-list">
                    {[1, 2, 3].map(i => (
                      <div key={i} className="d-flex align-items-center gap-3 mb-3">
                        <div className="skeleton" style={{ width: '50px', height: '50px', borderRadius: '6px' }}></div>
                        <div className="flex-grow-1">
                          <div className="skeleton mb-2" style={{ width: '60%', height: '14px' }}></div>
                          <div className="skeleton" style={{ width: '30%', height: '12px' }}></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="col-md-5">
                  <div className="skeleton" style={{ width: '100%', height: '200px', borderRadius: '12px' }}></div>
                </div>
              </div>
            </div>
          ) : modalDetails ? (
            <div className="modal-body-content">
              <div className="row mt-4">
                <div className="col-md-7">
                  <div className="order-meta mb-4">
                    <div className="d-flex align-items-center gap-3 justify-content-between mb-2">
                      <span className="order-date" style={{ marginTop: 0 }}>Placed on {new Date(selectedOrder?.created_at).toLocaleDateString()}</span>
                      <StatusBadge status={selectedOrder?.status} />
                    </div>
                    <div style={{ fontSize: '20px', fontWeight: 800, color: '#111', letterSpacing: '-0.02em', marginBottom: '4px' }}>
                      Order {selectedOrder?.code}
                    </div>
                  </div>

                  {reviewSuccessMessage && (
                    <div className="review-success-alert">
                      {reviewSuccessMessage}
                    </div>
                  )}

                  <div className="item-list">
                    {modalDetails.order_products.map((item, idx) => {
                      const orderStatusVal = (selectedOrder?.status?.value || selectedOrder?.status || "").toLowerCase();
                      const isCompletedOrder = orderStatusVal === "completed";
                      const isReviewed = item.product_id && reviewedProductIds.includes(Number(item.product_id));
                      const isDrawerOpen = activeReviewProductId === item.product_id;

                      return (
                        <div key={idx} className="order-item-card">
                          <div className="order-item-main">
                            <img
                              className="item-img"
                              src={item.product_image ? `${IMG_BASE}storage/${item.product_image}` : "/no-img.png"}
                              alt=""
                            />
                            <div className="item-info">
                              <div className="item-name">{he.decode(item.product_name || "")}</div>
                              <div className="item-price">
                                {item.qty} × {Number(item.gross_amount / item.qty).toFixed(currency.decimals)} {currency.symbol}
                              </div>
                            </div>
                            {isCompletedOrder && item.product_id && (
                              <div className="item-action">
                                {isReviewed ? (
                                  <span className="badge-reviewed">Reviewed</span>
                                ) : (
                                  <button
                                    type="button"
                                    className="btn-review-trigger"
                                    onClick={() => toggleReviewDrawer(item.product_id)}
                                  >
                                    {isDrawerOpen ? "Cancel" : "Review Product"}
                                  </button>
                                )}
                              </div>
                            )}
                          </div>

                          {isDrawerOpen && (
                            <div className="review-drawer">
                              <div className="review-drawer-header">
                                <span className="review-drawer-title">Rate this product</span>
                                <span className="star-rating-label">
                                  {getRatingLabel(hoveredRating || currentRating)}
                                </span>
                                <div className="star-rating-group">
                                  {[1, 2, 3, 4, 5].map((star) => {
                                    const isActive = star <= (hoveredRating || currentRating);
                                    return (
                                      <button
                                        key={star}
                                        type="button"
                                        className="star-btn"
                                        onMouseEnter={() => setHoveredRating(star)}
                                        onMouseLeave={() => setHoveredRating(0)}
                                        onClick={() => setCurrentRating(star)}
                                        aria-label={`Rate ${star} of 5`}
                                      >
                                        <svg
                                          width="16"
                                          height="16"
                                          viewBox="0 0 24 24"
                                          fill={isActive ? "#111" : "none"}
                                          stroke={isActive ? "#111" : "#D1D5DB"}
                                          strokeWidth="1.5"
                                        >
                                          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                                        </svg>
                                      </button>
                                    );
                                  })}

                                </div>
                              </div>

                              <textarea
                                className="review-textarea"
                                placeholder="Share your experience regarding fragrance, longevity, and quality..."
                                value={reviewComment}
                                onChange={(e) => setReviewComment(e.target.value)}
                                rows={3}
                              />

                              {reviewError && (
                                <div className="review-error-msg">{reviewError}</div>
                              )}

                              <div className="review-drawer-actions">
                                <button
                                  type="button"
                                  className="btn-review-cancel"
                                  onClick={() => setActiveReviewProductId(null)}
                                  disabled={submittingReview}
                                >
                                  Cancel
                                </button>
                                <button
                                  type="button"
                                  className="btn-review-submit"
                                  onClick={() => handleReviewSubmit(item.product_id)}
                                  disabled={submittingReview}
                                >
                                  {submittingReview ? "Submitting..." : "Submit Review"}
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
                <div className="col-md-5">
                  <div className="summary-card">
                    <h6 className="mb-3" style={{ fontWeight: 800, fontSize: '16px', letterSpacing: '-0.02em' }}>Order Summary</h6>

                    {(() => {
                      const currentOrder = modalDetails?.order || selectedOrder;
                      const subTotal = Number(currentOrder?.sub_total || 0);
                      const shippingCost = Number(currentOrder?.shipping_amount || 0) + Number(currentOrder?.shipping_amount_vat || 0);
                      const serviceFee = Number(currentOrder?.service_amount || 0) + Number(currentOrder?.service_amount_vat || 0);
                      const codCharge = Number(currentOrder?.cod_charge || 0) + Number(currentOrder?.cod_charge_vat || 0);
                      const discountAmount = Number(currentOrder?.discount_amount || 0);
                      const totalAmount = Number(currentOrder?.amount || 0);
                      const totalVat = Number(currentOrder?.tax_amount || 0);
                      const isCod = currentOrder?.payment_channel === "cod" || codCharge > 0;

                      return (
                        <table className="checkout-totals w-100">
                          <tbody>
                            <tr>
                              <th>SUBTOTAL</th>
                              <td>{subTotal.toFixed(currency.decimals || 2)} {currency.symbol}</td>
                            </tr>
                            <tr>
                              <th>SHIPPING</th>
                              <td>{shippingCost <= 0 ? "You Got Free Shipping" : `Shipping Cost: ${shippingCost.toFixed(currency.decimals || 2)} ${currency.symbol}`}</td>
                            </tr>
                            <tr>
                              <th>SERVICE FEE</th>
                              <td>{serviceFee.toFixed(currency.decimals || 2)} {currency.symbol}</td>
                            </tr>
                            {isCod && (
                              <tr>
                                <th>COD CHARGES</th>
                                <td>{codCharge.toFixed(currency.decimals || 2)} {currency.symbol}</td>
                              </tr>
                            )}
                            {discountAmount > 0 && (
                              <tr>
                                <th>DISCOUNT</th>
                                <td>-{discountAmount.toFixed(currency.decimals || 2)} {currency.symbol}</td>
                              </tr>
                            )}
                            <tr>
                              <th>TOTAL</th>
                              <td>
                                {totalAmount.toFixed(currency.decimals || 2)} {currency.symbol} (includes {totalVat.toFixed(currency.decimals || 2)} {currency.symbol} VAT)
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      );
                    })()}

                    <div className="address-section">
                      <div className="address-title">Payment Method</div>
                      <p className="address-text mb-0">
                        {(() => {
                          const currentOrder = modalDetails?.order || selectedOrder;
                          return currentOrder?.payment_channel
                            ? ({ cod: "Cash on Delivery", paytabs: "PayTabs", tamara: "Tamara" }[currentOrder.payment_channel] || currentOrder.payment_channel)
                            : "—";
                        })()}
                      </p>
                    </div>

                    <div className="address-section">
                      <div className="address-title">Contact Information</div>
                      <p className="address-text mb-0">
                        {modalDetails.order_address[0]?.name}<br />
                        {modalDetails.order_address[0]?.phone}<br />
                        {modalDetails.order_address[0]?.email}
                      </p>
                    </div>

                    <div className="address-section">
                      <div className="address-title">Shipping Address</div>
                      <p className="address-text mb-0">
                        {modalDetails.order_address[0]?.address}<br />
                        {modalDetails.order_address[0]?.city}, {modalDetails.order_address[0]?.state}
                      </p>
                    </div>

                    <div className="address-section">
                      <div className="address-title">Billing Address</div>
                      <p className="address-text mb-0">
                        {modalDetails.order_address[0]?.address}<br />
                        {modalDetails.order_address[0]?.city}, {modalDetails.order_address[0]?.state}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="py-4 text-center">Failed to load details.</div>
          )}
        </Modal.Body>
        <Modal.Footer className="border-0">
          <button className="btn-minimal w-100" onClick={closeModal}>Close</button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}