export type Product = {
  id: string;
  name: string;
  description: string;
  priceCents: number;
  imageUrl: string;
  images?: string[];
  tag?: string;
  category: string;
  tags?: string[];
  variants?: ProductVariant[];
  inStock: boolean;
};

export type ProductVariant = {
  id: string;
  name: string;
  type: "color" | "size";
  value: string;
  priceCents?: number;
  inStock: boolean;
};

export const products: Product[] = [
  {
    id: "classic-tee",
    name: "Classic Tee",
    description: "Premium cotton tee with a timeless fit.",
    priceCents: 2500,
    imageUrl: "https://images.unsplash.com/photo-1756227584303-f1400daaa69d?q=80&w=2624&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    images: [
      "https://images.unsplash.com/photo-1756227584303-f1400daaa69d?q=80&w=2624&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=1600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1503341504253-dff4815485f1?q=80&w=1600&auto=format&fit=crop",
    ],
    tag: "Bestseller",
    category: "Apparel",
    tags: ["tops", "cotton", "casual"],
    variants: [
      { id: "s", name: "Size", type: "size", value: "S", inStock: true },
      { id: "m", name: "Size", type: "size", value: "M", inStock: true },
      { id: "l", name: "Size", type: "size", value: "L", inStock: true },
      { id: "xl", name: "Size", type: "size", value: "XL", inStock: false },
    ],
    inStock: true,
  },
  {
    id: "sleek-sneakers",
    name: "Sleek Sneakers",
    description: "Minimal everyday sneakers crafted for comfort.",
    priceCents: 8900,
    imageUrl: "https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?q=80&w=1600&auto=format&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?q=80&w=1600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1549298916-b41d501d3772?q=80&w=1600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?q=80&w=1600&auto=format&fit=crop",
    ],
    tag: "New",
    category: "Footwear",
    tags: ["shoes", "sneakers", "everyday"],
    variants: [
      { id: "7", name: "Size", type: "size", value: "7", inStock: true },
      { id: "8", name: "Size", type: "size", value: "8", inStock: true },
      { id: "9", name: "Size", type: "size", value: "9", inStock: true },
      { id: "10", name: "Size", type: "size", value: "10", inStock: false },
    ],
    inStock: true,
  },
  {
    id: "city-backpack",
    name: "City Backpack",
    description: "Water‑resistant daypack with laptop sleeve.",
    priceCents: 6400,
    imageUrl: "https://images.unsplash.com/photo-1514477917009-389c76a86b68?q=80&w=1600&auto=format&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1514477917009-389c76a86b68?q=80&w=1600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?q=80&w=1600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1622560480654-d96214fdc887?q=80&w=1600&auto=format&fit=crop",
    ],
    category: "Bags",
    tags: ["backpack", "laptop", "commute"],
    variants: [
      { id: "black", name: "Color", type: "color", value: "Black", inStock: true },
      { id: "navy", name: "Color", type: "color", value: "Navy", inStock: true },
      { id: "gray", name: "Color", type: "color", value: "Gray", inStock: false },
    ],
    inStock: true,
  },
  {
    id: "everyday-bottle",
    name: "Everyday Bottle",
    description: "Insulated stainless steel bottle, 750ml.",
    priceCents: 3200,
    imageUrl: "https://images.unsplash.com/photo-1542736667-069246bdbc74?q=80&w=1600&auto=format&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1542736667-069246bdbc74?q=80&w=1600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1602143407151-7111542de6e8?q=80&w=1600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?q=80&w=1600&auto=format&fit=crop",
    ],
    category: "Accessories",
    tags: ["bottle", "insulated", "outdoors"],
    variants: [
      { id: "stainless", name: "Color", type: "color", value: "Stainless", inStock: true },
      { id: "black", name: "Color", type: "color", value: "Black", inStock: true },
      { id: "white", name: "Color", type: "color", value: "White", inStock: false },
    ],
    inStock: true,
  },
  {
    id: "linen-shirt",
    name: "Linen Shirt",
    description: "Breathable linen shirt for warm days.",
    priceCents: 5400,
    imageUrl: "https://images.unsplash.com/photo-1520975682031-7f7c4bb3b5f0?q=80&w=1600&auto=format&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1520975682031-7f7c4bb3b5f0?q=80&w=1600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1503341504253-dff4815485f1?q=80&w=1600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=1600&auto=format&fit=crop",
    ],
    category: "Apparel",
    tags: ["tops", "linen", "summer"],
    variants: [
      { id: "s", name: "Size", type: "size", value: "S", inStock: true },
      { id: "m", name: "Size", type: "size", value: "M", inStock: true },
      { id: "l", name: "Size", type: "size", value: "L", inStock: false },
    ],
    inStock: true,
  },
  {
    id: "wool-scarf",
    name: "Wool Scarf",
    description: "Soft merino scarf for cozy layering.",
    priceCents: 3800,
    imageUrl: "https://images.unsplash.com/photo-1544441892-36e29f2b5a89?q=80&w=1600&auto=format&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1544441892-36e29f2b5a89?q=80&w=1600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1516762689617-e1cffcef479d?q=80&w=1600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1520903920245-00d872a2d1c9?q=80&w=1600&auto=format&fit=crop",
    ],
    category: "Accessories",
    tags: ["scarf", "merino", "winter"],
    variants: [
      { id: "navy", name: "Color", type: "color", value: "Navy", inStock: true },
      { id: "gray", name: "Color", type: "color", value: "Gray", inStock: true },
      { id: "burgundy", name: "Color", type: "color", value: "Burgundy", inStock: false },
    ],
    inStock: true,
  },
  {
    id: "leather-wallet",
    name: "Leather Wallet",
    description: "Slim wallet crafted from full-grain leather.",
    priceCents: 5900,
    imageUrl: "https://images.unsplash.com/photo-1518544801976-3e188ed7f42a?q=80&w=1600&auto=format&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1518544801976-3e188ed7f42a?q=80&w=1600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1627123424574-724758594e93?q=80&w=1600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1554224155-6726b3ff858f?q=80&w=1600&auto=format&fit=crop",
    ],
    category: "Accessories",
    tags: ["wallet", "leather", "everyday"],
    variants: [
      { id: "brown", name: "Color", type: "color", value: "Brown", inStock: true },
      { id: "black", name: "Color", type: "color", value: "Black", inStock: true },
      { id: "tan", name: "Color", type: "color", value: "Tan", inStock: false },
    ],
    inStock: true,
  },
  {
    id: "travel-duffel",
    name: "Travel Duffel",
    description: "Weekender duffel with padded straps.",
    priceCents: 12900,
    imageUrl: "https://images.unsplash.com/photo-1520975682031-7f7c4bb3b5f0?q=80&w=1600&auto=format&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1520975682031-7f7c4bb3b5f0?q=80&w=1600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?q=80&w=1600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1622560480654-d96214fdc887?q=80&w=1600&auto=format&fit=crop",
    ],
    tag: "Featured",
    category: "Bags",
    tags: ["duffel", "travel", "weekender"],
    variants: [
      { id: "olive", name: "Color", type: "color", value: "Olive", inStock: true },
      { id: "black", name: "Color", type: "color", value: "Black", inStock: true },
      { id: "navy", name: "Color", type: "color", value: "Navy", inStock: false },
    ],
    inStock: true,
  },
];

export function formatPrice(priceCents: number): string {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(priceCents / 100);
}

export function findProductById(id: string): Product | undefined {
  return products.find((p) => p.id === id);
}


