"use client";
import { useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";

export default function AddAddressPopup({ onClose }) {
  const [form, setForm] = useState({
    id: Date.now(),
    name: "",
    email: "",
    phone: "",
    country: "UAE",
    state: "",
    city: "",
    address: "",
    isDefault: false,
  });
  const [otp, setOtp] = useState("");
  const [showOtp, setShowOtp] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSendOtp = () => {
    // here you'd trigger backend OTP send
    setShowOtp(true);
  };

  const handleSave = () => {
    if (showOtp && otp !== "1234") {
      alert("Invalid OTP (demo uses 1234)");
      return;
    }

    let addresses = JSON.parse(localStorage.getItem("address") || "[]");

    // set this one default if checked
    if (form.isDefault) {
      addresses = addresses.map((a) => ({ ...a, isDefault: false }));
    }

    addresses.push(form);
    localStorage.setItem("address", JSON.stringify(addresses));
    onClose();
  };

  return (
    <Modal show={true} onHide={onClose}>
      <Modal.Header closeButton>
        <Modal.Title>Add New Delivery Address</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group className="mb-2">
            <Form.Label>Name</Form.Label>
            <Form.Control name="name" value={form.name} onChange={handleChange} />
          </Form.Group>
          <Form.Group className="mb-2">
            <Form.Label>Email</Form.Label>
            <Form.Control name="email" value={form.email} onChange={handleChange} />
          </Form.Group>
          <Form.Group className="mb-2">
            <Form.Label>Phone</Form.Label>
            <Form.Control name="phone" value={form.phone} onChange={handleChange} />
          </Form.Group>
          <Form.Group className="mb-2">
            <Form.Label>Emirates</Form.Label>
            <Form.Control name="state" value={form.state} onChange={handleChange} />
          </Form.Group>
          <Form.Group className="mb-2">
            <Form.Label>Area / City</Form.Label>
            <Form.Control name="city" value={form.city} onChange={handleChange} />
          </Form.Group>
          <Form.Group className="mb-2">
            <Form.Label>Building / Address</Form.Label>
            <Form.Control name="address" value={form.address} onChange={handleChange} />
          </Form.Group>

          <Form.Check
            type="checkbox"
            label="Set as default address"
            checked={form.isDefault}
            onChange={(e) => setForm({ ...form, isDefault: e.target.checked })}
          />

          {!showOtp ? (
            <Button variant="outline-primary" size="sm" className="mt-3" onClick={handleSendOtp}>
              Send OTP
            </Button>
          ) : (
            <Form.Group className="mt-3">
              <Form.Label>Enter OTP</Form.Label>
              <Form.Control value={otp} onChange={(e) => setOtp(e.target.value)} />
            </Form.Group>
          )}
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onClose}>Cancel</Button>
        <Button variant="primary" onClick={handleSave}>Save Address</Button>
      </Modal.Footer>
    </Modal>
  );
}
