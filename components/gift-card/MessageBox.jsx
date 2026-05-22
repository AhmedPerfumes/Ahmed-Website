export default function MessageBox({ form, updateField }) {
  return (
    <div className="mb-4">
      <h5 style={{ fontFamily: "Kanit-Regular" }}>Message</h5>

      <div className="floating-input">
        <textarea
          rows="3"
          placeholder=" "
          value={form.message}
          onChange={(e) =>
            updateField("message", e.target.value)
          }
        />
        <label style={{fontFamily: "Kanit-Regular"}}>Message – Upto 200 Characters</label>
      </div>
    </div>
  );
}