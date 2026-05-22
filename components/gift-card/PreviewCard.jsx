export default function PreviewCard({ form }) {
  const amount = form.customAmount || form.amount || '--';

  return (
    <div
      style={{
        width: "100%",
        maxWidth: "420px",
        height: "250px",
        borderRadius: "16px",
        overflow: "hidden",
        position: "relative",
        margin: "0 auto",
        transform: "perspective(1000px)",
        transition: "transform 0.2s ease",
      }}
      onMouseMove={(e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        e.currentTarget.style.transform = `
          perspective(1000px)
          rotateX(${-(y - rect.height / 2) / 20}deg)
          rotateY(${(x - rect.width / 2) / 20}deg)
        `;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform =
          "perspective(1000px) rotateX(0) rotateY(0)";
      }}
    >
      <img
        src={`/assets/images/gift-card/${form.design}.png`}
        style={{ width: "100%", height: "100%", objectFit: "cover" }}
      />

      <div
        style={{
          position: "absolute",
          inset: 0,
        //   background:
        //     "linear-gradient(180deg, rgba(255,255,255,0.1), rgba(0,0,0,0.4))",
          color: "#000000",
          padding: "20px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
        }}
      >
        <div style={{ fontSize: "14px", color: "#000000" }}>
          
        </div>

        {/* <h2 style={{ margin: 0, fontWeight: 400 }}>
          AED {amount}
        </h2> */}

        <div>
          <div style={{ fontSize: "14px" }}>
            To: {form.recipientName || "Recipient"}
          </div>
          <div style={{ fontSize: "12px", opacity: 0.8 }}>
            {form.message || "A special gift for you"}
          </div>
        </div>
      </div>
    </div>
  );
}