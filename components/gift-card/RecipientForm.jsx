export default function RecipientForm({ form, updateField, errors, setErrors }) {

  const handleChange = (field, value) => {
    updateField(field, value);

    // clear error when typing
    setErrors((prev) => ({
      ...prev,
      [field]: "",
    }));
  };

  return (
    <div className="mb-4">
      <h5 style={{ marginBottom: "15px",fontFamily: "Kanit-Regular, sans-serif, Serif" }}>Add details of who will receive this card</h5>

      {/* YOUR NAME */}
      <div className="floating-input mb-2">
        <input
          type="text"
          placeholder=" "
          value={form.senderName}
          onChange={(e) =>
            handleChange("senderName", e.target.value)
          }
          className={errors.senderName ? "input-error" : ""}
        />
        <label style={{fontFamily: "Kanit-Regular"}}>Name*</label>
      </div>
      {errors.senderName && (
        <div className="error-text">{errors.senderName}</div>
      )}

      {/* RECIPIENT NAME */}
      <div className="floating-input mt-3 mb-2">
        <input
          type="text"
          placeholder=" "
          value={form.recipientName}
          onChange={(e) =>
            handleChange("recipientName", e.target.value)
          }
          className={errors.recipientName ? "input-error" : ""}
        />
        <label style={{fontFamily: "Kanit-Regular"}}>Recipient Name*</label>
      </div>
      {errors.recipientName && (
        <div className="error-text">{errors.recipientName}</div>
      )}

      {/* EMAIL */}
      <div className="floating-input mt-3 mb-2">
        <input
          type="email"
          placeholder=" "
          value={form.recipientEmail}
          onChange={(e) =>
            handleChange("recipientEmail", e.target.value)
          }
          className={errors.recipientEmail ? "input-error" : ""}
        />
        <label style={{fontFamily: "Kanit-Regular"}}>Email*</label>
      </div>
      {errors.recipientEmail && (
        <div className="error-text">{errors.recipientEmail}</div>
      )}
    </div>
  );
}