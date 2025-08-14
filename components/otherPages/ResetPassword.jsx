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
  const [resendTimer, setResendTimer] = useState(0);

  const baseUrl = process.env.NEXT_PUBLIC_API_URL;

  // 🚫 Block access if logged in
  useEffect(() => {
    try {
      const token = localStorage.getItem("token");
      const user = localStorage.getItem("user");
      if (token || user) {
        router.replace("/account_dashboard");
      }
    } catch {}
  }, [router]);

  // Start resend countdown
  const startResendTimer = () => {
    setResendTimer(60);
    const timerInterval = setInterval(() => {
      setResendTimer((prev) => {
        if (prev <= 1) {
          clearInterval(timerInterval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  // Step 1 & resend: Send OTP
  const handleSendOTP = async (e) => {
    if (e?.preventDefault) e.preventDefault();
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
        startResendTimer();
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

      if (res.ok && data.message?.toLowerCase().includes("verified")) {
        setCustomerId(data?.data?.id ?? null);
        if (data?.access_token) setAccessToken(data.access_token);
        setMessage(data.message || "OTP verified successfully.");

        // Hide success message after 2 seconds
        setTimeout(() => {
          setMessage(null);
        }, 2000);

        setStep(3);
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
          customer_id: customerId,
          customer_password: newPassword,
          flag: "fpassword",
        }),
      });
      const data = await res.json();

      if (res.ok) {
        setMessage(data.message || "Password updated successfully.");
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

  // Resend OTP click
  const handleResendOTP = async () => {
    await handleSendOTP();
    setStep(2);
  };

  return (
    <section className="login-register container">
      <h2 className="section-title text-center fs-3 mb-xl-5">
        {step === 1 && "Reset Your Password"}
        {step === 2 && "Verify OTP"}
        {step === 3 && "Set Your New Password"}
      </h2>

      <div className="reset-form">
        {message && <p className="sub-menu__title border-bottom">{message}</p>}
        {error && <p className="text-danger">{error}</p>}

        {/* Step 1: Mobile Number */}
        {step === 1 && (
          <form onSubmit={handleSendOTP} className="needs-validation">
            <div className="form-floating mb-1">
              <input
                type="text"
                value={mobile}
                onChange={(e) => {
                  const val = e.target.value.replace(/\D/g, "").slice(0, 10);
                  setMobile(val);
                }}
                className="form-control"
                placeholder="Eg. 0500000000 *"
                required
              />
              <label>Mobile Number (Eg. 0500000000)*</label>
            </div>

            {mobile.length > 0 && !/^05\d{8}$/.test(mobile) && (
              <small className="text-danger">
                Please enter a valid UAE mobile number starting with 05 (10 digits total).
              </small>
            )}

            <button
              className="btn btn-primary w-100 mt-2"
              type="submit"
              disabled={loading || !/^05\d{8}$/.test(mobile)}
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
                className="btn btn-secondary flex-1 w-50 text-white"
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

            <div className="text-center mt-3">
              {resendTimer > 0 ? (
                <small className="text-muted">Resend OTP in {resendTimer}s</small>
              ) : (
                <button
                  type="button"
                  className="btn btn-link p-0 text-uppercase"
                  onClick={handleResendOTP}
                  disabled={loading}
                >
                  Resend OTP
                </button>
              )}
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
