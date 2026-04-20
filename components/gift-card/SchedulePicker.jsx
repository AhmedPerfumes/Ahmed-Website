export default function SchedulePicker({ form, updateField }) {
  return (
    <div className="mb-4">
      <h5>Delivery</h5>

      <select
        className="form-control mb-2"
        value={form.deliveryType}
        onChange={(e) => updateField("deliveryType", e.target.value)}
      >
        <option value="instant">Send Now</option>
        <option value="scheduled">Schedule</option>
      </select>

      {form.deliveryType === "scheduled" && (
        <input
          type="date"
          className="form-control"
          onChange={(e) => updateField("scheduledDate", e.target.value)}
        />
      )}
    </div>
  );
}