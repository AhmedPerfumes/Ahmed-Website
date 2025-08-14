"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function ResetPasswordOTP() {
  const router = useRouter();

  // Steps: 1 = mobile, 2 = otp, 3 = new password
  const [step, setStep] = useState(1);

  // Form state
  const [mobile, setMobile] = useState("");
  const [otp, setOtp] = useState("");
  const [customerId, setCustomerId] = useState(null);
  const [accessToken, setAccessToken] = useState(null);

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // UI state
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  // ENV
  const baseUrl = process.env.NEXT_PUBLIC_API_URL; // e.g. "https://example.com/"

  // 🚫 Block access if logged in
  useEffect(() => {
    try {
      const token = localStorage.getItem("token");
      const user = localStorage.getItem("user");
      if (token || user) {
        // already logged in, redirect (change path if you prefer)
        router.replace("/account_dashboard"); 
      }
    } catch {}
  }, [router]);

  // Step 1: Send OTP
  const handleSendOTP = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    setError(null);

    try {
      const res = await fetch(`${baseUrl}api/sendOTP`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mobile: mobile.trim(), flag: "fpassword" }),
      });
      const data = await res.json();

      if (res.ok) {
        setMessage(data.message || "OTP sent successfully.");
        setStep(2);
      } else {
        setError(data.message || "Failed to send OTP.");
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Verify OTP
  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    setError(null);

    try {
      const res = await fetch(`${baseUrl}api/verifyOTP`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mobile: mobile.trim(),
          otp: otp.trim(),
          flag: "fpassword",
        }),
      });
      const data = await res.json();
      // console.log("VERIFY OTP RESPONSE:", data);

      // Expecting: { message: "OTP Verified Successfully", data: { id, ... }, access_token, ... }
      if (res.ok && data.message?.toLowerCase().includes("verified")) {
        setCustomerId(data?.data?.id ?? null);
        if (data?.access_token) setAccessToken(data.access_token);
        setMessage(data.message || "OTP verified successfully.");
        setStep(3); // go to new password
      } else {
        setError(data.message || "Invalid Mobile Number or OTP");
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Step 3: Update Password
  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    setError(null);

    // Basic client-side validation (adjust to your password policy)
    if (newPassword.length < 6) {
      setError("Password must be at least 6 characters.");
      setLoading(false);
      return;
    }
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      setLoading(false);
      return;
    }

    try {
      const headers = { "Content-Type": "application/json" };
      if (accessToken) headers["Authorization"] = `Bearer ${accessToken}`;

      const res = await fetch(`${baseUrl}api/customerUpdate`, {
        method: "POST",
        headers,
        body: JSON.stringify({
          customer_id: customerId,                 // from verifyOTP -> data.id
          customer_password: newPassword,          // ✅ exact key your API expects
          flag: "fpassword",
        }),
      });
      const data = await res.json();

      if (res.ok) {
        setMessage(data.message || "Password updated successfully.");
        // Optional: redirect to login after a short delay
        setTimeout(() => router.replace("/login_register"), 1500);
      } else {
        setError(data.message || "Failed to update password.");
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="login-register container">
      <h2 className="section-title text-center fs-3 mb-xl-5">
        Reset Your Password
      </h2>

      <div className="reset-form">
        {message && <p className="sub-menu__title border-bottom">{message}</p>}
        {error && <p className="text-danger">{error}</p>}

        {/* Step 1: Mobile Number */}
        {step === 1 && (
          <form onSubmit={handleSendOTP} className="needs-validation">
            <div className="form-floating mb-3">
              <input
                type="tel"
                inputMode="tel"
                value={mobile}
                onChange={(e) => setMobile(e.target.value)}
                className="form-control"
                placeholder="Mobile Number *"
                required
              />
              <label>Mobile Number *</label>
            </div>
            <button
              className="btn btn-primary w-100"
              type="submit"
              disabled={loading || !mobile.trim()}
            >
              {loading ? "Sending OTP..." : "Send OTP"}
            </button>
          </form>
        )}

        {/* Step 2: OTP Input */}
        {step === 2 && (
          <form onSubmit={handleVerifyOTP} className="needs-validation">
            <div className="form-floating mb-3">
              <input
                type="text"
                inputMode="numeric"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className="form-control"
                placeholder="Enter OTP *"
                required
              />
              <label>Enter OTP *</label>
            </div>

            <div className="d-flex gap-2">
              <button
                className="btn btn-secondary flex-1 w-50"
                type="button"
                disabled={loading}
                onClick={() => setStep(1)}
              >
                Change Mobile
              </button>

              <button
                className="btn btn-primary flex-1 w-50"
                type="submit"
                disabled={loading || !otp.trim()}
              >
                {loading ? "Verifying..." : "Verify OTP"}
              </button>
            </div>
          </form>
        )}

        {/* Step 3: New Password */}
        {step === 3 && (
          <form onSubmit={handleUpdatePassword} className="needs-validation">
            <div className="form-floating mb-3">
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="form-control"
                placeholder="New Password *"
                required
                minLength={6}
              />
              <label>New Password *</label>
            </div>
            <div className="form-floating mb-3">
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="form-control"
                placeholder="Confirm Password *"
                required
                minLength={6}
              />
              <label>Confirm Password *</label>
            </div>
            <button
              className="btn btn-primary w-100"
              type="submit"
              disabled={loading || !newPassword || !confirmPassword}
            >
              {loading ? "Updating..." : "Save New Password"}
            </button>
          </form>
        )}

        <div className="customer-option mt-4 text-center">
          <span className="text-secondary">Back to</span>{" "}
          <Link href="/login_register" className="btn-text">
            Login
          </Link>
        </div>
      </div>
    </section>
  );
}
