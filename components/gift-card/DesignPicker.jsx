export default function DesignPicker({ form, updateField }) {
  const designs = [
    {
      id: "design1",
      image: "/assets/images/gift-card/Your-Special.png",
    },
    {
      id: "design2",
      image: "/assets/images/gift-card/happy-anniversary.png",
    },
    {
      id: "design3",
      image: "/assets/images/gift-card/Best-Wishes.png",
    },
    {
      id: "design4",
      image: "/assets/images/gift-card/Women-Days.png",
    },
  ];

  return (
    <div className="mb-4">
      <h5 className="mb-3">Choose a Design</h5>

      <div className="row">
        {designs.map((d) => (
          <div key={d.id} className="col-6 mb-3">
            <div
              onClick={() => updateField("design", d.id)}
              style={{
                border:
                    form.design === d.id
                    ? "2px solid gold"
                    : "1px solid #333",
                borderRadius: "12px",
                overflow: "hidden",
                cursor: "pointer",
                transition: "all 0.3s ease",
                transform: form.design === d.id ? "scale(1.05)" : "scale(1)",
                }}
            >
              <img
                src={d.image}
                alt={d.id}
                style={{
                  width: "100%",
                  height: "80px",
                  objectFit: "cover",
                }}
              />

              {form.design === d.id && (
                <div
                  style={{
                    position: "absolute",
                    top: "10px",
                    right: "10px",
                    background: "black",
                    color: "white",
                    padding: "2px 6px",
                    fontSize: "10px",
                    borderRadius: "4px",
                  }}
                >
                  Selected
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}