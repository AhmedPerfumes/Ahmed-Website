"use client";
import React, { useState, useEffect } from "react";
import { Modal, Button, Form, Alert } from "react-bootstrap";
import { apiClient } from "@/lib/apiClient";

export default function MyDetails() {
  const [details, setDetails] = useState({
    customer_name: "",
    customer_email: "",
    customer_mobile: "",
  });
  const [initialDetails, setInitialDetails] = useState({});
  const [customerId, setCustomerId] = useState(null);
  const [loading, setLoading] = useState(false);

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
    password: "",
    new_password: "",
    confirm_password: "",
  });

  const [saveDialog, setSaveDialog] = useState(false);
  const [verifyPassword, setVerifyPassword] = useState("");
  const [saveLoading, setSaveLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [fieldErrors, setFieldErrors] = useState({
    customer_name: "",
    customer_email: "",
    customer_mobile: "",
    password: "",
  });

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const raw = localStorage.getItem("user");
    if (raw) {
      try {
        const user = JSON.parse(atob(raw));
        setCustomerId(user.id);
      } catch { }
    }
  }, []);

  useEffect(() => {
    if (!customerId) return;
    setLoading(true);
    apiClient(`api/customerDetails`, {
      method: "POST",
      body: JSON.stringify({}),
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

        const user = {
          id: customerId,
          name: json.customer_name || "",
          email: json.customer_email || "",
          phone: json.customer_mobile || "",
        };
        localStorage.setItem("user", btoa(JSON.stringify(user)));
      })
      .catch(() => { })
      .finally(() => setLoading(false));
  }, [customerId]);

  const isEdited =
    values.customer_name !== initialDetails.customer_name ||
    values.customer_email !== initialDetails.customer_email ||
    values.customer_mobile !== initialDetails.customer_mobile ||
    (values.new_password && values.confirm_password);

  // Field validator helper
  const validateField = (field, val, currentValues = values) => {
    const trimmed = (val || "").toString().trim();
    if (field === "customer_name") {
      if (!trimmed) return "Full name is required.";
      if (trimmed.length < 2) return "Name must be at least 2 characters.";
      if (trimmed.length > 120) return "Name must not exceed 120 characters.";
      return "";
    }
    if (field === "customer_email") {
      if (!trimmed) return "Email address is required.";
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(trimmed)) return "Please enter a valid email address.";
      return "";
    }
    if (field === "customer_mobile") {
      if (!trimmed) return "Mobile number is required.";
      const phoneRegex = /^\d{9,15}$/;
      if (!phoneRegex.test(trimmed)) return "Please enter a valid mobile number (e.g. 0500000000).";
      return "";
    }
    if (field === "password") {
      const newPass = currentValues.new_password || "";
      const confPass = currentValues.confirm_password || "";
      if (newPass || confPass) {
        if (newPass.length < 6) return "New password must be at least 6 characters.";
        if (newPass !== confPass) return "Passwords do not match.";
      }
      return "";
    }
    return "";
  };

  const startEdit = (field) => {
    setEdit((e) => ({ ...e, [field]: true }));
    setFieldErrors((f) => ({ ...f, [field]: "" }));
  };

  const cancelEdit = (field) => {
    setValues((v) => ({
      ...v,
      [field]: initialDetails[field] || "",
      new_password: "",
      confirm_password: "",
    }));
    setEdit((e) => ({ ...e, [field]: false }));
    setFieldErrors((f) => ({ ...f, [field]: "", ...(field === "password" ? { password: "" } : {}) }));
  };

  const handleChange = (field, value) => {
    const newValues = { ...values, [field]: value };
    setValues(newValues);

    // Live validation
    if (field === "new_password" || field === "confirm_password") {
      const passErr = validateField("password", "", newValues);
      setFieldErrors((f) => ({ ...f, password: passErr }));
    } else {
      const err = validateField(field, value, newValues);
      setFieldErrors((f) => ({ ...f, [field]: err }));
    }
  };

  const validateAll = () => {
    const errors = {
      customer_name: edit.customer_name ? validateField("customer_name", values.customer_name) : "",
      customer_email: edit.customer_email ? validateField("customer_email", values.customer_email) : "",
      customer_mobile: edit.customer_mobile ? validateField("customer_mobile", values.customer_mobile) : "",
      password: edit.password ? validateField("password", "", values) : "",
    };

    setFieldErrors(errors);
    return !Object.values(errors).some((err) => err !== "");
  };

  const handleShowSave = () => {
    if (!validateAll()) {
      return;
    }
    setVerifyPassword("");
    setError("");
    setSuccess("");
    setSaveDialog(true);
  };

  const handleSave = async () => {
    if (!validateAll()) {
      return;
    }

    if (!verifyPassword) {
      setError("Please enter your current password to confirm changes.");
      return;
    }

    setSaveLoading(true);
    setError("");
    setSuccess("");

    // Verify current password first
    try {
      const passCheckResp = await apiClient(`api/customerPasswordCheck`, {
        method: "POST",
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

    // Submit profile update
    try {
      const resp = await apiClient(`api/customerUpdate`, {
        method: "POST",
        body: JSON.stringify({
          customer_name: values.customer_name,
          customer_email: values.customer_email,
          customer_mobile: values.customer_mobile,
          customer_password: values.new_password ? values.new_password : undefined,
        }),
      });
      const res = await resp.json();

      if (resp.status === 422 || (res.message && res.message !== "Customer Updated Successfully")) {
        const newFieldErrors = { customer_name: "", customer_email: "", customer_mobile: "", password: "" };

        if (res.errors) {
          if (res.errors.customer_name) newFieldErrors.customer_name = res.errors.customer_name[0];
          if (res.errors.customer_email) newFieldErrors.customer_email = res.errors.customer_email[0];
          if (res.errors.customer_mobile) newFieldErrors.customer_mobile = res.errors.customer_mobile[0];
          if (res.errors.customer_password) newFieldErrors.password = res.errors.customer_password[0];
          
          const firstErrKey = Object.keys(res.errors)[0];
          setError(res.errors[firstErrKey][0]);
        } else {
          setError(res.message || "Failed to update details. Please check inputs.");
        }

        setFieldErrors(newFieldErrors);
        setSaveLoading(false);
        return;
      }

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

      const updatedUser = {
        id: customerId,
        name: values.customer_name,
        email: values.customer_email,
        phone: values.customer_mobile,
      };
      localStorage.setItem("user", btoa(JSON.stringify(updatedUser)));

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
      setFieldErrors({ customer_name: "", customer_email: "", customer_mobile: "", password: "" });
      setError("");
      setSuccess("Details updated successfully!");

      setTimeout(() => {
        setSaveDialog(false);
      }, 1500);
      setSaveLoading(false);
    } catch {
      setError("Network error. Please try again.");
      setSaveLoading(false);
    }
  };

  const FIELDS = [
    { key: "customer_name", label: "NAME" },
    { key: "customer_email", label: "E-MAIL" },
    { key: "customer_mobile", label: "MOBILE" },
    { key: "password", label: "PASSWORD" },
  ];

  return (
    <div className="w-100" style={{ maxWidth: 600, margin: "0 auto", fontFamily: "'Kanit-Regular', sans-serif" }}>
      <div className="mt-2">
        {FIELDS.map((f, index) => (
          <div
            key={f.key}
            className={`d-flex align-items-center py-4 stagger-item ${mounted ? 'is-visible' : ''}`}
            style={{ borderBottom: "1px solid #f0f0f0", '--index': index }}
          >
            <div style={{ flex: 1 }}>
              <div style={{ textTransform: "uppercase", fontSize: 11, letterSpacing: '1.5px', color: '#888', fontWeight: 700, marginBottom: 6 }}>{f.label}</div>
              <div style={{ fontSize: 15, fontWeight: 400 }}>
                {edit[f.key] ? (
                  f.key === "password" ? (
                    <div className="d-flex flex-column gap-2 pe-3">
                      <Form.Control
                        type="password"
                        placeholder="New password (min 6 chars)"
                        size="sm"
                        className={`rounded-1 ${fieldErrors.password ? 'is-invalid' : ''}`}
                        value={values.new_password}
                        onChange={(e) => handleChange("new_password", e.target.value)}
                        autoFocus
                      />
                      <Form.Control
                        type="password"
                        placeholder="Confirm new password"
                        size="sm"
                        className={`rounded-1 ${fieldErrors.password ? 'is-invalid' : ''}`}
                        value={values.confirm_password}
                        onChange={(e) => handleChange("confirm_password", e.target.value)}
                      />
                      {fieldErrors.password && (
                        <div className="text-danger mt-1" style={{ fontSize: 13 }}>
                          {fieldErrors.password}
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="pe-3">
                      <Form.Control
                        size="sm"
                        className={`rounded-1 ${fieldErrors[f.key] ? 'is-invalid' : ''}`}
                        value={values[f.key]}
                        onChange={(e) => handleChange(f.key, e.target.value)}
                        autoFocus
                      />
                      {fieldErrors[f.key] && (
                        <div className="text-danger mt-1" style={{ fontSize: 13 }}>
                          {fieldErrors[f.key]}
                        </div>
                      )}
                    </div>
                  )
                ) : f.key === "password" ? (
                  <span className="text-secondary">••••••••</span>
                ) : loading ? (
                  <div className="dashboard-skeleton rect" style={{ width: '60%', height: '18px' }}></div>
                ) : (
                  <span className="text-dark">{values[f.key] || <span className="text-muted fst-italic small">Not set</span>}</span>
                )}
              </div>
            </div>
            <div className="ps-2" style={{ textAlign: "right", minWidth: 80 }}>
              {edit[f.key] ? (
                <Button size="sm" variant="link" className="p-0 text-dark fw-medium text-decoration-underline" onClick={() => cancelEdit(f.key)}>
                  Cancel
                </Button>
              ) : (
                <Button size="sm" variant="link" className="p-0 text-dark fw-medium text-decoration-underline" onClick={() => startEdit(f.key)}>
                  Edit
                </Button>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="text-center mt-5">
        <Button
          variant="dark"
          disabled={!isEdited}
          onClick={handleShowSave}
          className="px-5 py-2 rounded-pill fw-bold text-uppercase letter-spacing-1 fs-14"
        >
          Save Changes
        </Button>
      </div>

      <Modal show={saveDialog} onHide={() => setSaveDialog(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Save</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {error && error !== "" && <Alert variant="danger">{error}</Alert>}
          {success && success !== "" && <Alert variant="success">{success}</Alert>}
          <Form.Group>
            <Form.Label>Enter your current password to save changes</Form.Label>
            <Form.Control
              type="password"
              placeholder="Current password"
              value={verifyPassword}
              onChange={(e) => setVerifyPassword(e.target.value)}
              autoFocus
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setSaveDialog(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSave} disabled={saveLoading}>
            {saveLoading ? "Saving…" : "Save"}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
