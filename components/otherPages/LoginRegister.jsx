"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useLocale } from "next-intl";

export default function LoginRegister() {
  const locale = useLocale();
  const searchParams = useSearchParams();
  const [activeTab, setActiveTab] = useState("login");

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [mobile, setMobile] = useState("");

  useEffect(() => {
    const tabParam = searchParams.get("tab");
    if (tabParam === "register") {
      setActiveTab("register");
    } else {
      setActiveTab("login");
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
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}api/signup`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to submit the data. Please try again.");
      }

      const data = await response.json();
      if (data.message.split(" ")[0] !== "OTP") {
        setError(data.message);
        setSuccess(null);
      } else {
        setSuccess(data.message);
        setError(null);
        setTimeout(() => (window.location.href = `/${locale}/verify-otp`), 1000);
      }
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
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}api/signin`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to submit the data. Please try again.");
      }

      const data = await response.json();
      if (data.message.split(" ")[0] !== "Login") {
        setError(data.message);
        setSuccess(null);
      } else {
        setSuccess(data.message);
        setError(null);
        localStorage.setItem("token", data.access_token);
        localStorage.setItem("user", btoa(JSON.stringify(data.data)));
        setTimeout(() => (window.location.href = "/"), 1000);
      }
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

      <ul className="nav nav-tabs mb-5" role="tablist">
        <li className="nav-items" role="presentation">
          <button
            type="button"
            className={`border-0 bg-transparent nav-links nav-link_underscore ${activeTab === "login" ? "active" : ""}`}
            onClick={() => setActiveTab("login")}
          >
            Login
          </button>
        </li>
        <li className="nav-items" role="presentation">
          <button
            type="button"
            className={`border-0 bg-transparent nav-links nav-link_underscore ${activeTab === "register" ? "active" : ""}`}
            onClick={() => setActiveTab("register")}
          >
            Register
          </button>
        </li>
      </ul>

      <div className="tab-content pt-2">
        {/* Login Tab */}
        <div className={`tab-pane fade ${activeTab === "login" ? "show active" : ""}`}>
          {error ? <div style={{ color: "red" }}>{error}</div> : <div style={{ color: "green" }}>{success}</div>}
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

            <button className="btn btn-primary w-100 text-uppercase" type="submit" disabled={isLoading}>
              {isLoading ? "Loading..." : "Login"}
            </button>
            <div className="d-flex align-items-center mb-3 pb-2">
                <div className="form-check mb-0">
                  <input
                    name="remember"
                    className="form-check-input form-check-input_fill"
                    type="checkbox"
                    defaultValue=""
                  />
                  <label className="form-check-label text-secondary">
                    Remember me
                  </label>
                </div>
                <Link href="/reset_password" className="btn-text ms-auto">
                  Lost password?
                </Link>
              </div>

              <div className="customer-option mt-4 text-center">
                <span className="text-secondary">No account yet?</span>{" "}
                {/* <a href="/login_register#register-tab" className="btn-text js-show-register">
                  Create Account
                </a> */}
                <button
                type="button"
                className={`border-0 bg-transparent btn-text js-show-register ${activeTab === "register" ? "active" : ""}`}
                onClick={() => setActiveTab("register")}
              >
                Create Account
              </button>
              </div>
          </form>
        </div>

        {/* Register Tab */}
        <div className={`tab-pane fade ${activeTab === "register" ? "show active" : ""}`}>
          {error ? <div style={{ color: "red" }}>{error}</div> : <div style={{ color: "green" }}>{success}</div>}
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

            <p className="mb-3">
              Your personal data will be used to support your experience throughout this website, to manage access to your account, and for other purposes described in our privacy policy.
            </p>

            <button className="btn btn-primary w-100 text-uppercase" type="submit" disabled={isLoading}>
              {isLoading ? "Loading..." : "Register"}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
