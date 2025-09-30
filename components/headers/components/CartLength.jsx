"use client";

import { useContextElement } from "@/context/Context";

export default function CartLength() {
  const { cartProducts } = useContextElement();

  // sum all quantities instead of just unique product count
  const totalItems = cartProducts.reduce(
    (sum, product) => sum + (product.quantity || 0),
    0
  );

  return <>{totalItems}</>;
}
