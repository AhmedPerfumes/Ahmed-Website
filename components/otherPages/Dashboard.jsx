"use client";
import React, { useState, useEffect } from "react";
import { Modal, Button, Form, Alert } from "react-bootstrap";

const API_BASE = process.env.NEXT_PUBLIC_API_URL;

export default function MyDetails() {
  const [details, setDetails] = useState({
    customer_name: "",
    customer_email: "",
    customer_mobile: "",
  });
  const [initialDetails, setInitialDetails] = useState({});
  const [customerId, setCustomerId] = useState(null);
  const [loading, setLoading] = useState(false);

  // Edit state for all fields
  const [edit, setEdit] = useState({
    customer_name: false,
    customer_email: false,
    customer_mobile: false,
    password: false,
  });
  const [values, setValues] = useState({
    customer_name: "",
    customer_email: "",
    customer_mobile: "",
    password: "", // for display only, not edited here
    new_password: "",
    confirm_password: "",
  });

  // Save dialog/modal
  const [saveDialog, setSaveDialog] = useState(false);
  const [verifyPassword, setVerifyPassword] = useState("");
  const [saveLoading, setSaveLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Get customer_id from localStorage
  useEffect(() => {
    if (typeof window === "undefined") return;
    const raw = localStorage.getItem("user");
    if (raw) {
      try {
        const user = JSON.parse(atob(raw));
        setCustomerId(user.id);
      } catch {}
    }
  }, []);

  // Fetch user details
  useEffect(() => {
    if (!customerId) return;
    setLoading(true);
    fetch(`${API_BASE}api/customerDetails`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ customer_id: customerId }),
    })
      .then((res) => res.json())
      .then((json) => {
        setDetails({
          customer_name: json.customer_name || "",
          customer_email: json.customer_email || "",
          customer_mobile: json.customer_mobile || "",
        });
        setValues({
          customer_name: json.customer_name || "",
          customer_email: json.customer_email || "",
          customer_mobile: json.customer_mobile || "",
          password: "",
          new_password: "",
          confirm_password: "",
        });
        setInitialDetails({
          customer_name: json.customer_name || "",
          customer_email: json.customer_email || "",
          customer_mobile: json.customer_mobile || "",
        });
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [customerId]);

  // Whether any field is edited
  const isEdited =
    values.customer_name !== initialDetails.customer_name ||
    values.customer_email !== initialDetails.customer_email ||
    values.customer_mobile !== initialDetails.customer_mobile ||
    (values.new_password && values.confirm_password);

  // Open inline edit
  const startEdit = (field) => {
    setEdit((e) => ({ ...e, [field]: true }));
  };
  // Cancel inline edit
  const cancelEdit = (field) => {
    setValues((v) => ({
      ...v,
      [field]: initialDetails[field] || "",
      new_password: "",
      confirm_password: "",
    }));
    setEdit((e) => ({ ...e, [field]: false }));
  };
  // Save inline edit to values (not backend yet)
  const handleChange = (field, value) => {
    setValues((v) => ({ ...v, [field]: value }));
  };

  // Show Save Changes modal
  const handleShowSave = () => {
    setVerifyPassword("");
    setError("");
    setSuccess("");
    setSaveDialog(true);
  };

  // Save to backend (with password verification)
  const handleSave = async () => {
    setSaveLoading(true);
    setError("");
    setSuccess("");

    // Password check for password change
    if (values.new_password || values.confirm_password) {
      if (values.new_password.length < 6) {
        setError("New password must be at least 6 characters.");
        setSaveLoading(false);
        return;
      }
      if (values.new_password !== values.confirm_password) {
        setError("New password and confirm password do not match.");
        setSaveLoading(false);
        return;
      }
    }

    // 1. Verify current password with /customerPasswordCheck
    try {
      const passCheckResp = await fetch(`${API_BASE}api/customerPasswordCheck`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customer_id: customerId,
          customer_password: verifyPassword,
        }),
      });
      const passCheck = await passCheckResp.json();

      if (
        passCheck.message &&
        passCheck.message.toLowerCase().includes("incorrect password")
      ) {
        setError("Incorrect password. Please try again.");
        setSaveLoading(false);
        return;
      }
    } catch {
      setError("Could not verify password. Please try again.");
      setSaveLoading(false);
      return;
    }

    // 2. Call update API
    try {
      const resp = await fetch(`${API_BASE}api/customerUpdate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customer_id: customerId,
          customer_name: values.customer_name,
          customer_email: values.customer_email,
          customer_mobile: values.customer_mobile,
          customer_password: values.new_password ? values.new_password : undefined,
        }),
      });
      const res = await resp.json();
      if (res.status === false || res.error) {
        setError(res.error || res.message || "Could not save. Please check password.");
        setSaveLoading(false);
        return;
      }
      // Success!
      setDetails({
        customer_name: values.customer_name,
        customer_email: values.customer_email,
        customer_mobile: values.customer_mobile,
      });
      setInitialDetails({
        customer_name: values.customer_name,
        customer_email: values.customer_email,
        customer_mobile: values.customer_mobile,
      });
      setEdit({
        customer_name: false,
        customer_email: false,
        customer_mobile: false,
        password: false,
      });
      setValues((v) => ({
        ...v,
        password: "",
        new_password: "",
        confirm_password: "",
      }));
      setSuccess("Details updated successfully!");
      setTimeout(() => setSaveDialog(false), 1300);
      setSaveLoading(false);
    } catch {
      setError("Network error. Please try again.");
      setSaveLoading(false);
    }
  };

  // Fields to display
  const FIELDS = [
    { key: "customer_name", label: "NAME" },
    { key: "customer_email", label: "E‑MAIL" },
    { key: "customer_mobile", label: "MOBILE" },
    { key: "password", label: "PASSWORD" },
  ];

  return (
    <div
      style={{
        maxWidth: 520,
        margin: "60px auto",
        fontFamily: "Lato, SofiaProRegular",
      }}
    >
      <h2
        className="section-head section-title text-uppercase fs-25 fw-medium text-center mb-4"
        style={{letterSpacing: ".02em" }}
      >
        MY DETAILS
      </h2>
      <div>
        {FIELDS.map((f) => (
          <div
            key={f.key}
            className="d-flex align-items-center py-3"
            style={{ borderBottom: "1px solid #ececec" }}
          >
            <div style={{ flex: 2 }}>
              <div
                style={{
                  textTransform: "uppercase",
                  fontSize: 17,
                }}
              >
                {f.label}
              </div>
              <div style={{ fontSize: 16, fontWeight: 400, marginTop: 1 }}>
                {/* Inline edit for all except password */}
                {edit[f.key] ? (
                  f.key === "password" ? (
                    <>
                      <Form.Control
                        type="password"
                        placeholder="New password"
                        className="mb-2"
                        value={values.new_password}
                        onChange={(e) =>
                          handleChange("new_password", e.target.value)
                        }
                        autoFocus
                      />
                      <Form.Control
                        type="password"
                        placeholder="Confirm new password"
                        value={values.confirm_password}
                        onChange={(e) =>
                          handleChange("confirm_password", e.target.value)
                        }
                      />
                      <div className="mt-1">
                        <Button
                          size="sm"
                          variant="link"
                          onClick={() => cancelEdit("password")}
                          style={{ textDecoration: "underline" }}
                        >
                          Cancel
                        </Button>
                      </div>
                    </>
                  ) : (
                    <>
                      <Form.Control
                        value={values[f.key]}
                        onChange={(e) => handleChange(f.key, e.target.value)}
                        autoFocus
                      />
                      <div className="mt-1">
                        <Button
                          size="sm"
                          variant="link"
                          onClick={() => cancelEdit(f.key)}
                          style={{ textDecoration: "underline" }}
                        >
                          Cancel
                        </Button>
                      </div>
                    </>
                  )
                ) : f.key === "password" ? (
                  <span>••••••••</span>
                ) : loading ? (
                  <span className="text-muted">Loading…</span>
                ) : (
                  values[f.key]
                )}
              </div>
            </div>
            <div style={{ flex: 1, textAlign: "right" }}>
              {!edit[f.key] && (
                <Button
                  variant="link"
                  className="fw-semibold text-dark p-0"
                  style={{ fontSize: 17, textDecoration: "underline" }}
                  onClick={() => startEdit(f.key)}
                >
                  Edit
                </Button>
              )}
            </div>
          </div>
        ))}
      </div>
      {/* Save Changes button */}
      <div className="text-center mt-4">
        <Button
          variant="dark"
          size="lg"
          style={{
            paddingLeft: 40,
            paddingRight: 40,
            borderRadius: 24,
            fontWeight: 500,
            fontSize: 17,
          }}
          onClick={handleShowSave}
          disabled={!isEdited}
        >
          Save Changes
        </Button>
      </div>
      {/* Password Confirmation Modal */}
      <Modal show={saveDialog} onHide={() => setSaveDialog(false)} centered>
        <Modal.Header closeButton className="border-0">
          <Modal.Title>Confirm Your Password</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {error && <Alert variant="danger">{error}</Alert>}
          {success && <Alert variant="success">{success}</Alert>}
          <Form.Group>
            <Form.Label>
              Please enter your current password to save changes
            </Form.Label>
            <Form.Control
              type="password"
              value={verifyPassword}
              onChange={(e) => setVerifyPassword(e.target.value)}
              autoFocus
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer className="border-0">
          <Button variant="secondary" onClick={() => setSaveDialog(false)}>
            Cancel
          </Button>
          <Button
            variant="dark"
            onClick={handleSave}
            disabled={
              !verifyPassword ||
              saveLoading ||
              (values.new_password &&
                values.new_password !== values.confirm_password)
            }
          >
            {saveLoading ? "Saving..." : "Save"}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
