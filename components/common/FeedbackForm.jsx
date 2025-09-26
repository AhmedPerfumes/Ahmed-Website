"use client"
import React, { useState, useRef } from "react";
import { useRouter } from "next/router";

function FeedbackForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const formRef = useRef(null);

  async function onSubmit(event) {
    event.preventDefault();
    setIsLoading(true);

    try {
      const formData = new FormData(formRef.current);
      const formValues = {
        name: formData.get("name"),
        email: formData.get("email"),
        feedback: formData.get("feedback"),
      };

      // console.log("Form submitted:", formValues);

      // Reset the form fields
      formRef.current.reset();

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}api/feedback`,
        {
          method: "POST",
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error("Failed to submit feedback. Please try again.");
      }

      const data = await response.json();
      if (data.message.toLowerCase().includes("success")) {
        setSuccess(data.message);
        setError(null);
      } else {
        setError(data.message);
        setSuccess(null);
      }
    } catch (error) {
      setError(error.message);
      // console.error(error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="container mt-5 pb-3 pt-3">
      <div className="row justify-content-center">
        <div className="col-md-6 mt-5">
          <div className="text-center">
            <img
              src="/assets/images/ahmed-favicon.png"
              alt="Feedback"
              className="img-fluid mb-3"
            />
            <img
              src="/assets/images/banner/web-banner.jpg"
              alt="Feedback"
              className="img-fluid mb-3"
            />
          </div>
          <div className="card p-4 shadow">
            <h2 className="text-center mb-4">Feedback Form</h2>

            {/* Display error or success messages */}
            {error && <div className="alert alert-danger">{error}</div>}
            {success && <div className="alert alert-success">{success}</div>}

            <form ref={formRef} onSubmit={onSubmit}>
              <div className="mb-3">
                <label className="form-label">Name</label>
                <input
                  type="text"
                  name="name"
                  className="form-control"
                  placeholder="Enter your name"
                  required
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Email</label>
                <input
                  type="email"
                  name="email"
                  className="form-control"
                  placeholder="Enter your email"
                  required
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Feedback</label>
                <textarea
                  name="feedback"
                  className="form-control"
                  rows="4"
                  placeholder="Write your feedback"
                  required
                ></textarea>
              </div>
              <button
                type="submit"
                className="btn btn-primary w-100"
                disabled={isLoading}
              >
                {isLoading ? "Submitting..." : "Submit"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default FeedbackForm;
