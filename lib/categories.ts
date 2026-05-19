export const CATEGORIES = [
  "Furniture",
  "Tools",
  "Baby & Kids",
  "Clothing",
  "Toys",
  "Books",
  "Electronics",
  "Collectibles",
  "Antiques",
  "Kitchen",
  "Home Decor",
  "Sports",
  "Garden",
  "Free Items",
  "Multi-Family Sale",
  "Estate Sale",
] as const;

export type Category = (typeof CATEGORIES)[number];
