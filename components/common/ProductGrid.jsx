"use client";
import { useEffect, useState } from "react";
import { useLocale } from "next-intl";
import he from "he";
import Pagination1 from "@/components/common/Pagination1";
import Image from "next/image";
import { useContextElement } from "@/context/Context";
import { useMenu } from "@/context/MenuContext";
import Link from "next/link";

export default function ProductGrid({ category, subcategory }) {
  const locale = useLocale();
  const { currency } = useMenu();
  const { addProductToCart, isAddedToCartProducts } = useContextElement();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage] = useState(12);

  useEffect(() => {
    const fetchExportProducts = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}api/exportProducts`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ category_id: 19 }), // optional filter by category
        });
  
        if (!response.ok) {
          throw new Error("Failed to fetch export products");
        }
  
        const data = await response.json();
        console.log("Fetched export products:", data);
  
        const rawProducts = Array.isArray(data) ? data : data.data || [];
  
        // ✅ Filter products with specific label
        const filteredProducts = rawProducts.filter(
          (product) => product.label_name === "Buy 1 Get 1 Free"
        );
  
        setProducts(filteredProducts);
      } catch (error) {
        console.error("Error fetching export products:", error);
      } finally {
        setLoading(false);
      }
    };
  
    fetchExportProducts();
  }, []);
  

  const paginatedProducts = products.slice((currentPage - 1) * perPage, currentPage * perPage);
  const totalPages = Math.ceil(products.length / perPage);

  const handlePageChange = (page) => setCurrentPage(page);

  const price = (elm) => {
    const currentUTC = new Date();
    const currentGST = new Date(currentUTC.getTime() + 4 * 60 * 60 * 1000);

    if (elm?.discount) {
      const start = new Date(elm.discount.start_date);
      const end = new Date(elm.discount.end_date);
      if (currentGST >= start && currentGST <= end) {
        const discounted = (elm.price - (elm.price * elm.discount.value) / 100).toFixed(2);
        return (
          <>
            <span className="money price price-old">{elm.price}{currency.symbol}</span>
            <span className="money price price-sale">{discounted}{currency.symbol}</span>
          </>
        );
      }
    }
    return <span className="money price">{elm.price}{currency.symbol}</span>;
  };

  const removeSpecialCharacters = (str) =>
    str?.replace(/&amp;/g, '').replace(/[^\w\s-]/g, '').replace(/\s+/g, ' ').trim();

  if (loading) return <Pagination1 />;

  return (
    <div className="container pt-3 pb-5">
      <div className="row">
        {paginatedProducts.map((elm, i) => (
          <div key={i} className="col-md-3 col-sm-6 mb-4">
            <div className="product-card text-center">
              <Link
                href={`/${locale}/shop/${category}/${subcategory}/${removeSpecialCharacters(elm.product_name).split(" ").join("-").toLowerCase()}`}
              >
                {JSON.parse(elm.images)[0] && (
                  <Image
                    src={`${process.env.NEXT_PUBLIC_API_URL}storage/${JSON.parse(elm.images)[0]}`}
                    alt={elm.product_name}
                    width={260}
                    height={315}
                    className="img-fluid"
                  />
                )}
              </Link>
              <div className="product-info mt-2">
                <h6 className="product-title">
                  <Link
                    href={`/${locale}/shop/${category}/${subcategory}/${removeSpecialCharacters(elm.product_name).split(" ").join("-").toLowerCase()}`}
                  >
                    {he.decode(elm.product_name)}
                  </Link>
                </h6>
                <div className="product-price">{price(elm)}</div>
                <button
                  className="btn btn-outline-dark mt-2"
                  onClick={() =>
                    !isAddedToCartProducts(elm.product_id) &&
                    addProductToCart({ ...elm, category_name: category, subcategory_name: subcategory })
                  }
                >
                  {isAddedToCartProducts(elm.product_id) ? "Already Added" : "Add to Cart"}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <nav className="d-flex justify-content-center mt-4">
          <ul className="pagination">
            {[...Array(totalPages)].map((_, idx) => (
              <li key={idx} className={`page-item ${currentPage === idx + 1 ? "active" : ""}`}>
                <button className="page-link" onClick={() => handlePageChange(idx + 1)}>
                  {idx + 1}
                </button>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </div>
  );
}
