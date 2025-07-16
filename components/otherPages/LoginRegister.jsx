"use client";

import React, { useState, useEffect } from "react";
import { useLocale } from "next-intl";
import { useSearchParams } from "next/navigation";

export default function LoginRegister() {
  const locale = useLocale();
  const searchParams = useSearchParams();

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [mobile, setMobile] = useState("");
  const [activeTab, setActiveTab] = useState("login");

  useEffect(() => {
    const tabParam = searchParams.get("tab");
    if (tabParam === "register") {
      setActiveTab("register");
    }
  }, [searchParams]);

  const validateMobile = (event) => {
    const { value } = event.currentTarget;
    setMobile(value);
  };

  async function onRegister(event) {
    event.preventDefault();
    setIsLoading(true);

    if (mobile === "") {
      setError("Mobile Number is Required");
      setSuccess(null);
      setIsLoading(false);
      return;
    }

    const regex = /^\d{10}$/;
    if (!regex.test(mobile)) {
      setError("Invalid Mobile Number");
      setSuccess(null);
      setIsLoading(false);
      return;
    }

    setError(null);
    setSuccess(null);

    try {
      const formData = new FormData(event.currentTarget);
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}api/signup`,
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await response.json();

      if (!response.ok || data.message?.split(" ")[0] !== "OTP") {
        throw new Error(data.message || "Failed to register.");
      }

      setSuccess(data.message);
      setError(null);
      setTimeout(() => {
        window.location.href = `/${locale}/verify-otp`;
      }, 1000);
    } catch (error) {
      setError(error.message);
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }

  async function onLogin(event) {
    event.preventDefault();
    setIsLoading(true);

    if (mobile === "") {
      setError("Mobile Number is Required");
      setSuccess(null);
      setIsLoading(false);
      return;
    }

    const regex = /^\d{10}$/;
    if (!regex.test(mobile)) {
      setError("Invalid Mobile Number");
      setSuccess(null);
      setIsLoading(false);
      return;
    }

    setError(null);
    setSuccess(null);

    try {
      const formData = new FormData(event.currentTarget);
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}api/signin`,
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await response.json();

      if (!response.ok || data.message?.split(" ")[0] !== "Login") {
        throw new Error(data.message || "Failed to login.");
      }

      setSuccess(data.message);
      setError(null);
      localStorage.setItem("token", data.access_token);
      localStorage.setItem("user", btoa(JSON.stringify(data.data)));

      setTimeout(() => {
        window.location.href = "/";
      }, 1000);
    } catch (error) {
      setError(error.message);
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <section className="login-register container">
      <h2 className="d-none">Login & Register</h2>

      {/* Tab buttons */}
      <ul className="nav nav-tabs mb-5" id="login_register" role="tablist">
        <li className="nav-items" role="presentation">
          <button
            type="button"
            className={`nav-links nav-link_underscore ${
              activeTab === "login" ? "active" : ""
            }`}
            onClick={() => setActiveTab("login")}
          >
            Login
          </button>
        </li>
        <li className="nav-items" role="presentation">
          <button
            type="button"
            className={`nav-links nav-link_underscore ${
              activeTab === "register" ? "active" : ""
            }`}
            onClick={() => setActiveTab("register")}
          >
            Register
          </button>
        </li>
      </ul>

      <div className="tab-content pt-2" id="login_register_tab_content">
        {/* LOGIN FORM */}
        {activeTab === "login" && (
          <div className="tab-pane fade show active" id="tab-item-login">
            {error ? (
              <div style={{ color: "red" }}>{error}</div>
            ) : (
              <div style={{ color: "green" }}>{success}</div>
            )}
            <div className="pb-3"></div>
            <form onSubmit={onLogin} className="needs-validation">
              <div className="form-floating mb-3">
                <input
                  name="mobile"
                  type="number"
                  className="form-control form-control_gray"
                  placeholder="Mobile Number *"
                  onChange={validateMobile}
                  required
                />
                <label>Mobile Number (Eg. 0500000000)*</label>
              </div>

              <div className="pb-3"></div>

              <div className="form-floating mb-3">
                <input
                  name="password"
                  type="password"
                  className="form-control form-control_gray"
                  placeholder="********"
                  required
                />
                <label>Password *</label>
              </div>

              <button
                className="btn btn-primary w-100 text-uppercase"
                type="submit"
                disabled={isLoading}
              >
                {isLoading ? "Loading..." : "Login"}
              </button>
            </form>
          </div>
        )}

        {/* REGISTER FORM */}
        {activeTab === "register" && (
          <div className="tab-pane fade show active" id="tab-item-register">
            {error ? (
              <div style={{ color: "red" }}>{error}</div>
            ) : (
              <div style={{ color: "green" }}>{success}</div>
            )}
            <div className="pb-3"></div>
            <form onSubmit={onRegister} className="needs-validation">
              <div className="form-floating mb-3">
                <input
                  name="name"
                  type="text"
                  className="form-control form-control_gray"
                  placeholder="User Name"
                  required
                />
                <label>User Name</label>
              </div>

              <div className="pb-3"></div>

              <div className="form-floating mb-3">
                <input
                  name="email"
                  type="email"
                  className="form-control form-control_gray"
                  placeholder="Email Address *"
                  required
                />
                <label>Email address *</label>
              </div>

              <div className="pb-3"></div>

              <div className="form-floating mb-3">
                <input
                  name="mobile"
                  type="number"
                  className="form-control form-control_gray"
                  placeholder="Mobile Number *"
                  onChange={validateMobile}
                  required
                />
                <label>Mobile Number (Eg. 0500000000)*</label>
              </div>

              <div className="form-floating mb-3">
                <input
                  name="password"
                  type="password"
                  className="form-control form-control_gray"
                  placeholder="********"
                  required
                />
                <label>Password *</label>
              </div>

              <div className="d-flex align-items-center mb-3 pb-2">
                <p className="m-0">
                  Your personal data will be used to support your experience
                  throughout this website, to manage access to your account, and
                  for other purposes described in our privacy policy.
                </p>
              </div>

              <button
                className="btn btn-primary w-100 text-uppercase"
                type="submit"
                disabled={isLoading}
              >
                {isLoading ? "Loading..." : "Register"}
              </button>
            </form>
          </div>
        )}
      </div>
    </section>
  );
}
