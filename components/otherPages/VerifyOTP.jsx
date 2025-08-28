"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function VerifyOTP() {
  const router = useRouter();

  const [step, setStep] = useState(1);
  const [mobile, setMobile] = useState("");
  const [otp, setOtp] = useState("");
  const [accessToken, setAccessToken] = useState(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);
  const [resendTimer, setResendTimer] = useState(0);
  const [showOtpSuccessIcon, setShowOtpSuccessIcon] = useState(false);
  const [stepKey, setStepKey] = useState(1);

  const baseUrl = process.env.NEXT_PUBLIC_API_URL;
  const otpRef = useRef(null);
  const mobileRef = useRef(null);

  const isValidUAEMobile = /^05\d{8}$/.test(mobile);
  const bumpStepKey = () => setStepKey((k) => k + 1);

  useEffect(() => {
    const t = setTimeout(() => {
      if (step === 1 && mobileRef.current) mobileRef.current.focus();
      if (step === 2 && otpRef.current) otpRef.current.focus();
    }, 50);
    return () => clearTimeout(t);
  }, [step]);

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

  const handleSendOTP = async (e) => {
    if (e?.preventDefault) e.preventDefault();
    setError(null);
    setMessage(null);

    if (!isValidUAEMobile) {
      setError("Please enter a valid UAE mobile number starting with 05 (10 digits).");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${baseUrl}api/sendOTP`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mobile: mobile.trim(), flag: "signup" }),
      });
      const data = await res.json();

      if (res.ok && data.message?.toLowerCase().includes("otp sent")) {
        setMessage(data.message);
        setStep(2);
        bumpStepKey();
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

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);

    try {
      const formData = new FormData(e.currentTarget);
      const res = await fetch(`${baseUrl}api/verifyOTP`, {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (res.ok && data.message?.toLowerCase().includes("customer")) {
        setAccessToken(data.access_token || null);
        setMessage(data.message);
        setShowOtpSuccessIcon(true);
        localStorage.setItem("token", data.access_token);
        localStorage.setItem("user", btoa(JSON.stringify(data.data)));

        setTimeout(() => {
          setShowOtpSuccessIcon(false);
          router.push("/account_dashboard");
        }, 1500);
      } else {
        setError(data.message || "Invalid OTP or mobile number.");
      }
    } catch (error) {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = async () => {
    await handleSendOTP();
    setStep(2);
    bumpStepKey();
  };

  return (
    <section className="login-register container">
      <h2 className="text-center fs-3 mb-xl-4">
        {step === 1 && "Enter Your Mobile Number"}
        {step === 2 && "Verify OTP"}
      </h2>

      {/* Success icon */}
      {showOtpSuccessIcon && (
        <div className="d-flex justify-content-center mb-2 fade-in">
          <span className="check-wrap" title="Verified">
            <svg width="52" height="52" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="11" stroke="currentColor" strokeWidth="2" opacity="0.2" />
              <path d="M7 12l3 3 7-7" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
        </div>
      )}

      {message && <p className="text-success text-center">{message}</p>}
      {error && <p className="text-danger text-center">{error}</p>}

      <div key={stepKey} className="step-fade">
        {step === 1 && (
          <form onSubmit={handleSendOTP}>
            <div className="form-floating mb-3">
              <input
                ref={mobileRef}
                name="mobile"
                type="text"
                className="form-control form-control_gray"
                placeholder="Mobile Number *"
                value={mobile}
                onChange={(e) => setMobile(e.target.value.replace(/\D/g, "").slice(0, 10))}
                required
              />
              <label>Mobile Number (Eg. 0500000000)*</label>
            </div>
            <button type="submit" className="btn btn-primary w-100" disabled={loading}>
              {loading ? "Sending OTP..." : "Send OTP"}
            </button>
          </form>
        )}

        {step === 2 && (
          <form onSubmit={handleVerifyOTP}>
            <div className="form-floating mb-3">
              <input
                ref={otpRef}
                name="otp"
                type="text"
                className="form-control form-control_gray"
                placeholder="Enter OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                required
              />
              <label>Enter OTP *</label>
            </div>

            <div className="d-flex gap-2">
              <button
                type="button"
                className="btn btn-secondary w-50"
                onClick={() => {
                  setStep(1);
                  bumpStepKey();
                }}
                disabled={loading}
              >
                Change Mobile
              </button>
              <button type="submit" className="btn btn-primary w-50" disabled={loading}>
                {loading ? "Verifying..." : "Verify OTP"}
              </button>
            </div>

            <div className="text-center mt-3">
              {resendTimer > 0 ? (
                <small className="text-muted">Resend OTP in {resendTimer}s</small>
              ) : (
                <button
                  type="button"
                  className="btn btn-link p-0"
                  onClick={handleResendOTP}
                  disabled={loading}
                >
                  Resend OTP
                </button>
              )}
            </div>
          </form>
        )}

        <div className="customer-option mt-4 text-center">
          <span className="text-secondary">Back to</span>{" "}
          <Link href="/login_register" className="btn-text">
            Login
          </Link>
        </div>
      </div>

      {/* minimal styles for fade and success check icon */}
      <style jsx>{`
        .step-fade {
          animation: fadeIn 280ms ease both;
        }
        .fade-in {
          animation: fadeIn 220ms ease both;
        }
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(4px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .check-wrap {
          display: inline-flex;
          color: #28a745;
        }
      `}</style>
    </section>
  );
}
