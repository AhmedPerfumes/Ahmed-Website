export default function AmountSelector({ form, updateField }) {
  return (
    <div className="mb-4">
      <h5 style={{ marginBottom: "10px",fontFamily: "Kanit-Regular, sans-serif, Serif" }}>Choose an Amount (AED)</h5>

      <div className="d-flex flex-wrap gap-2">
        {[100, 150, 175, 200, 250, 500, 750, 1000].map((amt) => (
          <button
            key={amt}
            type="button"
            className={`btn ${
              form.amount === amt
                ? "btn-warning text-light"
                : "btn-outline-light"
            }`}
            onClick={() => {
              if (form.amount === amt) {
                // toggle OFF
                updateField("amount", "");
                updateField("customAmount", "");
                updateField("isCustom", false);
              } else {
                // select
                updateField("amount", amt);
                updateField("customAmount", "");
                updateField("isCustom", false);
              }
            }}
          >
            {amt}
          </button>
        ))}

        {/* CUSTOM BUTTON */}
        <button
          type="button"
          className="btn btn-outline-light"
          onClick={() => {
            updateField("amount", "");
            updateField("customAmount", "");
            updateField("isCustom", true);
          }}
        >
          Custom Amount
        </button>
      </div>

      {/* CUSTOM INPUT */}
      {form.isCustom && (
  <div className="floating-input mt-3">
    <input
      type="number"
      placeholder=" "
      value={form.customAmount}
      onChange={(e) =>
        updateField("customAmount", e.target.value)
      }
      required
    />
    <label>Enter Amount</label>
  </div>
)}
    </div>
  );
}