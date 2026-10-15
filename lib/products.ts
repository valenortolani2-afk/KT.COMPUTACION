export const PRODUCT_CATEGORIES = ["pc-gamer", "placas-de-video", "combos-actualizacion"] as const;

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

export const DEFAULT_PRODUCTS: Product[] = [
  {
    id: "demo-trident",
    name: "MSI Trident 3",
    description: "La definitiva PC gamer de nueva generación",
    price: "$1490",
    imageUrl: "/pcgamer1.jpg",
    category: "pc-gamer",
    createdAt: "2026-01-01T00:00:00.000Z",
  },
];

export const PRODUCT_CATEGORY_LABELS: Record<ProductCategory, string> = {
  "pc-gamer": "PC Gamer",
  "placas-de-video": "Placas de video",
  "combos-actualizacion": "Combos de actualización",
};

export function isProductCategory(value: string): value is ProductCategory {
  return PRODUCT_CATEGORIES.includes(value as ProductCategory);
}
