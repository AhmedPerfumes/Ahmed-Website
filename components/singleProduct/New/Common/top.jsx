import { Star } from 'lucide-react'
import React, { useMemo } from 'react'
import he from 'he';
import { useTranslations } from 'next-intl';

const Top = ({ product }) => {
  const t = useTranslations();
  // Decode only if product_name exists
  const cleanName = useMemo(() => {
    if (product?.product_name) {
      return he.decode(product.product_name);
    }
    return "";
  }, [product?.product_name]);
  console.log(product)

  return (
    <div className="mt-lg-4">
      {/* Product Name */}
      {/* <h1
        className="text-dark mb-1"
        style={{
          fontFamily: "Lobster, cursive",
          fontSize: "calc(1.375rem + 1.5vw)",
        }}
      >
      {product?.product_name && t(he.decode(product?.product_name))}
      </h1> */}
        <h1 className="product-single__name hii">{product?.product_name && t(he.decode(product?.product_name))}</h1>

      {/* Categories */}
      <p
        className="text-muted mb-0"
        style={{
          fontSize: "0.8rem",
          fontFamily: "monospace",
          color: "#6a7282",
        }}
      >
        CATEGORIES: {(product?.category || "").toString().toUpperCase()},
        {(product?.subcategory || "").toString().toUpperCase()}
      </p>
    </div>
  );
};

export default Top;
