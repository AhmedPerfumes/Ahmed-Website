"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Modal, Button, Form } from "react-bootstrap";

const API_BASE = process.env.NEXT_PUBLIC_API_URL;

const emptyAddr = (userData = {}) => ({
  id: -1,
  name: userData?.name || "",
  email: userData?.email || "",
  mobile: userData?.phone || "",
  area: "",
  building: "",
  emirates: "",
  isDefault: false,
});

export default function EditAddress() {
  // Dynamic list — not locked to 2 slots
  const [addresses, setAddresses] = useState([]);
  const [userData, setUserData] = useState(null);
  const [customerId, setCustomerId] = useState(null);

  // Modal state
  const [show, setShow] = useState(false);
  const [editingIndex, setEditingIndex] = useState(null); // null = add new
  const [form, setForm] = useState(emptyAddr());
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // ─── Fetch addresses on mount ─────────────────────────────────────────────
  useEffect(() => {
    if (typeof window === "undefined") return;

    const raw = localStorage.getItem("user");
    let customer_id = null;
    let user = null;

    if (raw) {
      try {
        user = JSON.parse(atob(raw));
        customer_id = user.id;
      } catch {}
    }

    setUserData(user);
    setCustomerId(customer_id);

    if (!customer_id) {
      setLoading(false);
      return;
    }

    setLoading(true);
    fetch(`${API_BASE}api/customerAddressDetails`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ customer_id }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.addresses && data.addresses.length) {
          const parsed = data.addresses.map((addr) => ({
            id: addr.id,
            name: addr.name || user?.name || "",
            email: addr.email || user?.email || "",
            mobile: addr.phone || user?.phone || "",
            area: addr.city || "",
            building: addr.address || "",
            emirates: addr.state || "",
            // Trust the DB is_default — backend now ensures only one is 1
            isDefault: addr.is_default === 1,
          }));

          // Safety guard: ensure only one isDefault=true (first wins)
          let foundDefault = false;
          const parsedSingle = parsed.map((a) => {
            if (a.isDefault && !foundDefault) { foundDefault = true; return a; }
            return { ...a, isDefault: false };
          });

          setAddresses(parsedSingle);
        } else {
          // No addresses yet — show an empty placeholder
          setAddresses([]);
        }
      })
      .catch(() => {})
      .finally(() => {
        setLoading(false);
      });
  }, []);

  // ─── Open modal ───────────────────────────────────────────────────────────
  const openEdit = (idx) => {
    setEditingIndex(idx);
    setForm({ ...addresses[idx] });
    setErrors({});
    setShow(true);
  };

  const openAddNew = () => {
    if (addresses.length >= 2) return; // Enforce Home + Other limit
    setEditingIndex(null);
    setForm(emptyAddr(userData));
    setErrors({});
    setShow(true);
  };

  // ─── Field change ─────────────────────────────────────────────────────────
  const handleChange = (e) => {
    const { name, value, checked } = e.target;
    if (name === "isDefault") {
      setForm((f) => ({ ...f, isDefault: checked }));
    } else {
      setForm((f) => ({ ...f, [name]: value }));
    }
  };

  // ─── Delete address ───────────────────────────────────────────────────────
  const deleteAddress = async (addr, idx) => {
    if (!window.confirm(`Delete this address? This cannot be undone.`)) return;

    const token = localStorage.getItem("token");
    try {
      const resp = await fetch(`${API_BASE}api/customerAddressDelete`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        body: JSON.stringify({
          address_id: addr.id,
          customer_id: customerId,
        }),
      });

      const res = await resp.json();
      if (!resp.ok) { alert(res.message || "Failed to delete address."); return; }

      // Remove from local state
      setAddresses((prev) => prev.filter((_, i) => i !== idx));

      // If the deleted address was stored as the default in localStorage, clear it
      try {
        const stored = localStorage.getItem("address");
        if (stored) {
          const parsed = JSON.parse(atob(stored));
          if (parsed?.id === addr.id) {
            localStorage.removeItem("address");
          }
        }
      } catch {}
    } catch {
      alert("Failed to delete address. Please try again.");
    }
  };

  const save = async () => {
    if (!customerId) return;

    const newErrors = {};
    if (!form.area?.trim())     newErrors.area     = "Area / Mantaqa is required";
    if (!form.building?.trim()) newErrors.building = "Building / Villa / Apartment is required";
    if (!form.emirates?.trim()) newErrors.emirates = "Emirate is required";
    if (Object.keys(newErrors).length) { setErrors(newErrors); return; }
    setErrors({});

    setSaving(true);
    const token = localStorage.getItem("token");

    try {
      const resp = await fetch(`${API_BASE}api/customerAddressUpdate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        body: JSON.stringify({
          address_id: form.id,   // -1 = create new, >0 = update existing
          customer_id: customerId,
          name: form.name,
          email: form.email,
          mobile: form.mobile,
          country: "AE",
          address: `${form.area} ${form.building}`,
          area: form.area,
          city: form.area,
          state: form.emirates,
          is_default: form.isDefault ? 1 : 0,
        }),
      });

      const res = await resp.json();

      if (res?.message === "Unauthorized" || res?.error === "Unauthorized") {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        window.location.href = "/login_register";
        return;
      }

      // Get the real DB id for newly created addresses
      const savedId = res?.id ?? res?.addresses?.id ?? form.id;

      // ── Option 2: Immediately sync localStorage when default changes ──────
      // Write the new default address to localStorage RIGHT NOW (before
      // setAddresses runs), using the confirmed savedId from the API response.
      // This guarantees that the checkout page's Phase 1 (instant localStorage
      // pre-fill) reads the correct address on the very next visit.
      if (form.isDefault) {
        try {
          localStorage.setItem(
            "address",
            btoa(JSON.stringify({
              id: savedId,
              name: form.name,
              email: form.email,
              phone: form.mobile,
              state: form.emirates,
              city: form.area,
              address: form.building,
              customer_id: customerId,
              is_default: 1,
            }))
          );
        } catch {}
      }

      setAddresses((prev) => {
        let updated;
        if (editingIndex === null) {
          // Adding new address
          updated = [...prev, { ...form, id: savedId }];
        } else {
          // Editing existing address
          updated = prev.map((a, i) => (i === editingIndex ? { ...form, id: savedId } : a));
        }

        // Unset isDefault on others if this one is default
        if (form.isDefault) {
          updated = updated.map((a, i) => {
            const isThis = editingIndex === null ? i === updated.length - 1 : i === editingIndex;
            return isThis ? a : { ...a, isDefault: false };
          });
        }

        return updated;
      });

      setShow(false);
    } catch {
      // silently fail
    } finally {
      setSaving(false);
    }
  };

  // ─── Render ───────────────────────────────────────────────────────────────
  return (
    <>
      <div className="col-lg-9">
        <p className="sub-menu__title border-bottom mb-4">
          Your default address will be used at checkout
        </p>

        {loading ? (
          <div className="d-flex gap-4 flex-column mb-4" style={{ fontFamily: "'Kanit-Regular', sans-serif" }}>
            {[...Array(2)].map((_, i) => (
              <div key={i} className="dashboard-skeleton" style={{ height: 140, borderRadius: 12, width: '100%' }}></div>
            ))}
          </div>
        ) : addresses.length === 0 ? (
          <p className="text-muted small mb-3">No saved addresses yet. Add one below.</p>
        ) : (
          <div className="d-flex gap-4 flex-column mb-4" style={{ fontFamily: "'Kanit-Regular', sans-serif" }}>
            {addresses.map((addr, idx) => (
              <div
                key={addr.id ?? idx}
                className={`p-4 d-flex justify-content-between align-items-start rounded border stagger-item ${mounted ? 'is-visible' : ''} ${
                  addr.isDefault ? "border-primary shadow-sm" : "border-light"
                }`}
                style={{ '--index': idx, transition: 'all 0.3s var(--ease-out-premium)' }}
              >
                <div>
                  <h6 className="mb-2 fw-medium text-secondary small text-uppercase letter-spacing-1">{idx === 0 ? "Home Address" : "Other Address"}</h6>
                  <p className="mb-1 text-dark fw-bold fs-17">{addr.name || <span className="text-muted fw-normal">Name not set</span>}</p>
                  <p className="mb-1 text-dark small">
                    {addr.email} {addr.email && addr.mobile && '|'} {addr.mobile}
                  </p>
                  <p className="mb-0 text-dark small">
                    {addr.area} {addr.area && addr.building && ','} {addr.building}
                    {addr.emirates && <>, {addr.emirates}</>}
                  </p>
                </div>
                <div className="text-end">
                  {addr.isDefault && (
                    <span className="badge-pop mb-2 d-inline-block">
                      <span className="badge bg-dark fw-normal px-2 py-1" style={{ borderRadius: '4px', fontSize: '11px' }}>DEFAULT</span>
                    </span>
                  )}
                  <br />
                  <div className="d-flex justify-content-end gap-3 mt-1">
                    <Link
                      href="#"
                      onClick={(e) => { e.preventDefault(); openEdit(idx); }}
                      className="fs-sm border-bottom border-dark text-dark fw-medium"
                      style={{ textDecoration: 'none' }}
                    >
                      Edit
                    </Link>
                    <Link
                      href="#"
                      onClick={(e) => { e.preventDefault(); deleteAddress(addr, idx); }}
                      className="fs-sm border-bottom border-danger text-danger fw-medium"
                      style={{ textDecoration: 'none' }}
                    >
                      Delete
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Add New Address button — only shown when fewer than 2 addresses exist */}
        {!loading && addresses.length < 2 && (
          <button
            type="button"
            className="btn btn-outline-dark btn-sm"
            onClick={openAddNew}
          >
            + Add New Address
          </button>
        )}
      </div>

      {/* Edit / Add Modal */}
      <Modal
        style={{ fontFamily: "'Kanit-Regular', sans-serif" }}
        show={show}
        onHide={() => setShow(false)}
        centered
      >
        <Modal.Header closeButton className="border-0 pb-0">
          <Modal.Title className="h6 fw-semibold">
            {editingIndex === null ? "Add New Address" : `Edit Address ${editingIndex + 1}`}
          </Modal.Title>
        </Modal.Header>

        <Modal.Body className="pt-1">
          <Form>
            <Form.Group className="mb-3">
              <Form.Label className="text-uppercase text-xs fw-medium text-secondary">
                Area / Mantaqa
              </Form.Label>
              <Form.Control
                name="area"
                value={form.area}
                onChange={handleChange}
                className="rounded-2 px-2 py-1"
                isInvalid={!!errors.area}
              />
              <Form.Control.Feedback type="invalid">{errors.area}</Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label className="text-uppercase text-xs fw-medium text-secondary">
                Building / Villa / Apartment
              </Form.Label>
              <Form.Control
                name="building"
                value={form.building}
                onChange={handleChange}
                className="rounded-2 px-2 py-1"
                isInvalid={!!errors.building}
              />
              <Form.Control.Feedback type="invalid">{errors.building}</Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label className="text-uppercase text-xs fw-medium text-secondary">
                Emirates
              </Form.Label>
              <Form.Select
                name="emirates"
                value={form.emirates}
                onChange={handleChange}
                className="rounded-2 px-2 py-1"
                isInvalid={!!errors.emirates}
              >
                <option value="">Select Emirate...</option>
                <option value="Abu Dhabi">Abu Dhabi</option>
                <option value="Ajman">Ajman</option>
                <option value="Al Ain">Al Ain</option>
                <option value="Dubai">Dubai</option>
                <option value="Fujairah">Fujairah</option>
                <option value="Ras Al Khaymah">Ras Al Khaymah</option>
                <option value="Sharjah">Sharjah</option>
                <option value="Umm Al Quwain">Umm Al Quwain</option>
              </Form.Select>
              <Form.Control.Feedback type="invalid">{errors.emirates}</Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-4">
              <Form.Check
                type="checkbox"
                name="isDefault"
                label="Set as default delivery address"
                checked={form.isDefault}
                onChange={handleChange}
              />
            </Form.Group>
          </Form>
        </Modal.Body>

        <Modal.Footer className="border-0 pt-0">
          <Button variant="outline-secondary" size="sm" onClick={() => setShow(false)} disabled={saving}>
            Cancel
          </Button>
          <Button variant="primary" size="sm" onClick={save} disabled={saving}>
            {saving ? "Saving…" : "Save"}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
