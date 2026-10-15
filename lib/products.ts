export const PRODUCT_CATEGORIES = ["tendencias", "novedades", "restaurados"] as const;

export type ProductCategory = (typeof PRODUCT_CATEGORIES)[number];

export type Product = {
  id: string;
  name: string;
  description: string;
  price: string;
  imageUrl: string;
  category: ProductCategory;
  createdAt: string;
};

export function isProductCategory(value: string): value is ProductCategory {
  return PRODUCT_CATEGORIES.includes(value as ProductCategory);
}
