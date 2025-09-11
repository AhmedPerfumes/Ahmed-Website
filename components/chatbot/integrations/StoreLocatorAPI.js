// This file simulates a database of store locations.
const mockStores = [
  {
    city: "Dubai",
    name: "Ahmed Al Maghribi - Dubai Mall",
    address: "The Dubai Mall, Financial Center Street, Dubai, UAE",
    phone: "+971 4 555 1234",
  },
  {
    city: "Abu Dhabi",
    name: "Ahmed Al Maghribi - Yas Mall",
    address: "Yas Mall, Yas Island, Abu Dhabi, UAE",
    phone: "+971 2 555 5678",
  },
  {
    city: "Al Ain",
    name: "Ahmed Al Maghribi - Al Ain Mall",
    address: "Al Ain Mall, Othman Bin Affan Street, Al Ain, UAE",
    phone: "+971 3 555 9012",
  },
];

/**
 * Finds stores, optionally filtering by city.
 * @param {string | null} city - The city to filter by.
 * @returns {Promise<Array>} A list of matching stores.
 */
export const findStores = async (city = null) => {
  // Simulate a network delay
  await new Promise(resolve => setTimeout(resolve, 300));

  if (city) {
    const cityName = city.toLowerCase();
    return mockStores.filter(store => store.city.toLowerCase() === cityName);
  }
  
  // If no city is specified, return all stores
  return mockStores;
};