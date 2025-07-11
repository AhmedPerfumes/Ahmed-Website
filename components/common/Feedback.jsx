"use client";

import { useState } from "react";

export default function FeedbackForm({ orderId, customerName }) {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false); // New state to track form submission

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}api/submitReview`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          order_id: orderId,
          customer_name: customerName,
          star: rating,
          comment: message,
        }),
      });

      if (response.ok) {
        setSubmitted(true); // Hide form on successful submission
      } else {
        const error = await response.json();
        alert("Error submitting feedback: " + (error.message || "Server error."));
      }
    } catch (err) {
      console.error(err);
      alert("Network error. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="container mt-5 text-center">
        <div className="alert alert-success" role="alert">
          Thank you for your feedback!
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-5">
      <div className="card shadow-sm mx-auto" style={{ maxWidth: "600px" }}>
        <div className="card-body">
          <h4 className="card-title text-center mb-4">We Value Your Feedback</h4>
          <form onSubmit={handleSubmit}>
            <div className="mb-4 text-center">
              <label className="form-label d-block fw-semibold">Rate Your Experience:</label>
              <div className="d-flex justify-content-center">
                {[1, 2, 3, 4, 5].map((star) => (
                  <span
                    key={star}
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    style={{
                      fontSize: "2.2rem",
                      color: star <= (hoverRating || rating) ? "#ffc107" : "#e4e5e9",
                      cursor: "pointer",
                      transition: "color 0.2s ease",
                      marginRight: "5px",
                    }}
                  >
                    ★
                  </span>
                ))}
              </div>
            </div>

            <div className="mb-4">
              <label htmlFor="feedbackMessage" className="form-label fw-semibold">
                How was the process? Did you face any difficulty while ordering?
              </label>
              <textarea
                className="form-control"
                id="feedbackMessage"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={4}
                placeholder="Write your feedback here..."
                required
              />
            </div>

            <div className="text-center">
              <button
                type="submit"
                className="btn btn-primary px-4 py-2"
                disabled={submitting || rating === 0 || !message.trim()}
              >
                {submitting ? "Submitting..." : "Submit Feedback"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
