import React from 'react'

const ThumbLarge = ({ images, onThumbnailClick }) => {
  return (
    <div
        className="d-none d-lg-flex flex-wrap gap-2 mt-3 p-2"
        style={{ backgroundColor: "#FAF9F7" }}
      >
        {images.map((img, i) => (
          <img
            key={i}
            src={`${process.env.NEXT_PUBLIC_API_URL}storage/${img}`}
            alt={`thumb-${i}`}
            className="border"
            style={{
              width: "64px",
              height: "64px",
              cursor: "pointer",
              mixBlendMode: "multiply",
            }}
            onClick={() => onThumbnailClick(i)}
          />
        ))}
      </div>
  )
}

export default ThumbLarge