"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Modal, Button, Form } from "react-bootstrap";

const API_BASE = process.env.NEXT_PUBLIC_API_URL;

export default function EditAddress() {
  const [addresses, setAddresses] = useState([
    {
      id: 1,
      name: "",
      email: "",
      mobile: "",
      area: "",
      building: "",
      emirates: "",
      isDefault: false,
    },
    {
      id: -1,
      name: "",
      email: "",
      mobile: "",
      area: "",
      building: "",
      emirates: "",
      isDefault: false,
    },
  ]);
  const [show, setShow] = useState(false);
  const [editingIndex, setEditingIndex] = useState(0);
  const [form, setForm] = useState(addresses[0]);
  const [customerId, setCustomerId] = useState(null);

  // Fetch customer_id from localStorage
  useEffect(() => {
    if (typeof window === "undefined") return;
    const raw = localStorage.getItem("user");
    let customer_id = null;
    if (raw) {
      try {
        const user = JSON.parse(atob(raw));
        customer_id = user.id;
      } catch {}
    }
    setCustomerId(customer_id);
    if (customer_id) {
      fetch(`${API_BASE}api/customerAddressDetails`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ customer_id }),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.addresses && data.addresses.length) {
            const home = data.addresses[0] || {};
            const other = data.addresses[1] || {};
            setAddresses([
              {
                id: home.id,
                name: home.name || "",
                email: home.email || "",
                mobile: home.phone || "",
                area: home.city || "",
                building: home.address || "",
                emirates: home.state || "",
                isDefault: (home.is_default === 1),
              },
              {
                id: other.id ?? -1,
                name: other.name || "",
                email: other.email || "",
                mobile: other.phone || "",
                area: other.city || "",
                building: other.address || "",
                emirates: other.state || "",
                isDefault: (other.is_default === 1),
              },
            ]);
          }
        });
    }
  }, []);

  const openModal = (idx) => {
    setEditingIndex(idx);
    setForm(addresses[idx]);
    setShow(true);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (name === "isDefault") {
      // Only one default: when checked, unset the other
      setForm((f) => ({ ...f, isDefault: checked }));
    } else {
      setForm((f) => ({ ...f, [name]: value }));
    }
  };

  // Save address with is_default support
  const save = async () => {
    if (!customerId) return;

    // Mark only one address as default
    let updatedAddresses = [...addresses];
    if (form.isDefault) {
      // Unset default for the other address
      updatedAddresses = updatedAddresses.map((a, idx) =>
        idx === editingIndex ? { ...form } : { ...a, isDefault: false }
      );
    } else {
      updatedAddresses[editingIndex] = { ...form, isDefault: false };
    }

    // API expects is_default: 1 or 0
    const payload = {
      address_id: form.id,
      customer_id: customerId,
      name: addresses[editingIndex].name,
      email: addresses[editingIndex].email,
      mobile: addresses[editingIndex].mobile,
      address: form.building,
      city: form.area,
      state: form.emirates,
      is_default: form.isDefault ? 1 : 0,
    };

    try {
      const res = await fetch(`${API_BASE}api/customerAddressUpdate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (data && data.addresses) {
        // Only update the address that was edited
        updatedAddresses[editingIndex] = {
          ...updatedAddresses[editingIndex],
          area: data.addresses.city || "",
          building: data.addresses.address || "",
          emirates: data.addresses.state || "",
          isDefault: data.addresses.is_default === 1,
        };
      }
      setAddresses(updatedAddresses);
      setShow(false);
    } catch (e) {
      alert("Failed to update address.");
    }
  };

  return (
    <>
      <div className="col-lg-9">
        <p className="fs-sm text-secondary mb-4">
          Default addresses used at checkout
        </p>
        <div className="d-flex gap-3 flex-column">
          {["Home Address", "Other Address"].map((label, idx) => (
            <div
              key={label}
              className={`p-3 d-flex justify-content-between align-items-start rounded border ${addresses[idx].isDefault ? "border-primary" : "border-light"}`}
            >
              <div>
                <h6 className="mb-1 fw-medium">{label}</h6>
                <p className="mb-0 text-dark fw-bold">{addresses[idx].name}</p>
                <p className="mb-0 text-muted small">
                  {addresses[idx].email} | {addresses[idx].phone}
                </p>
                <p className="mb-0 text-muted small">
                  {addresses[idx].area}, {addresses[idx].building}, {addresses[idx].emirates}
                </p>
              </div>
              <div className="text-end">
                {addresses[idx].isDefault && <span className="badge bg-primary mb-2">Default</span>}
                <br />
                <Link href="#" onClick={(e) => { e.preventDefault(); openModal(idx); }} className="fs-sm">
                  Edit
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Edit Modal (with Set as default checkbox) */}
      <Modal show={show} onHide={() => setShow(false)} centered>
        <Modal.Header closeButton className="border-0 pb-0">
          <Modal.Title className="h6 fw-semibold">
            Edit {editingIndex === 0 ? "Home" : "Other"} Address
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="pt-1">
          <Form>
            <Form.Group className="mb-3">
              <Form.Label className="text-uppercase text-xs fw-medium text-secondary">
                Area / Mantaqa
              </Form.Label>
              <Form.Control name="area" value={form.area} onChange={handleChange} className="rounded-2 px-2 py-1" />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label className="text-uppercase text-xs fw-medium text-secondary">
                Building / Villa / Apartment
              </Form.Label>
              <Form.Control name="building" value={form.building} onChange={handleChange} className="rounded-2 px-2 py-1" />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label className="text-uppercase text-xs fw-medium text-secondary">
                Emirates
              </Form.Label>
              <Form.Control name="emirates" value={form.emirates} onChange={handleChange} className="rounded-2 px-2 py-1" />
            </Form.Group>
            <Form.Group className="mb-4">
              <Form.Check
                type="checkbox"
                name="isDefault"
                label="Set as default"
                checked={form.isDefault}
                onChange={handleChange}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer className="border-0 pt-0">
          <Button variant="outline-secondary" size="sm" onClick={() => setShow(false)}>
            Cancel
          </Button>
          <Button variant="primary" size="sm" onClick={save}>
            Save
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
