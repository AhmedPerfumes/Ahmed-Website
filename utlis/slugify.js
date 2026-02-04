export const slugify = (str) => {
  if (!str) return "";
  
  return str
    .toString()
    .toLowerCase()
    .replace(/&amp;/g, "") // Remove encoded ampersands
    .replace(/[^\w\s-]/g, "") // Remove special characters
    .trim()
    .replace(/\s+/g, "-") // Replace spaces with hyphens
    .replace(/-+/g, "-"); // Remove duplicate hyphens
};


export const getProductPath = (locale, product) => {
  const category = slugify(product.category_name) || "all";
  
  // Handle subcategory logic
  const subCategoryName = product.subcategory?.subcategory_name 
    ? slugify(product.subcategory.subcategory_name)
    : slugify(product.category_name);

  const productName = slugify(product.product_name);

  return `/${locale}/shop/${category}/${subCategoryName}/${productName}`;
};