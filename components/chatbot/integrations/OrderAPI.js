// This file simulates fetching order data from a real backend or database.

const mockOrders = [
  {
    orderId: "AAM-123-XYZ",
    status: "shipped", // can be 'processing', 'shipped', or 'delivered'
    estimatedDelivery: "August 28, 2025",
    items: ["Oud Al Fakhir", "Dehn Al Oud Special"],
  },
  {
    orderId: "AAM-456-ABC",
    status: "processing",
    estimatedDelivery: "August 30, 2025",
    items: ["Bin Shaikh Perfume"],
  },
  {
    id: "p003",
    orderId: "AAM-789-DEF",
    status: "delivered",
    estimatedDelivery: "August 22, 2025",
    items: ["Complete Perfume Set", "Bakhoor Al Maghribi"],
  },
];

export const fetchOrderStatus = async (orderId) => {
  console.log(`Searching for order with ID: ${orderId}`);
  
  // Simulate a network delay
  await new Promise(resolve => setTimeout(resolve, 800));

  const order = mockOrders.find(o => o.orderId.toLowerCase() === orderId.toLowerCase());

  if (order) {
    return { found: true, data: order };
  } else {
    return { found: false, data: null };
  }
};