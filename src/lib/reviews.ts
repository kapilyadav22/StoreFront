import { promises as fs } from "fs";
import path from "path";

export type Review = {
  id: string;
  productId: string;
  userId: string;
  userName: string;
  rating: number;
  title: string;
  comment: string;
  createdAt: string;
};

const REVIEWS_FILE = path.join(process.cwd(), "src", "data", "reviews.json");

async function ensureFile(): Promise<void> {
  try {
    await fs.access(REVIEWS_FILE);
  } catch {
    const dir = path.dirname(REVIEWS_FILE);
    await fs.mkdir(dir, { recursive: true });
    await fs.writeFile(REVIEWS_FILE, JSON.stringify([]), "utf8");
  }
}

export async function readReviews(): Promise<Review[]> {
  await ensureFile();
  const raw = await fs.readFile(REVIEWS_FILE, "utf8");
  try {
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

export async function getProductReviews(productId: string): Promise<Review[]> {
  const reviews = await readReviews();
  return reviews.filter((r) => r.productId === productId).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

export async function addReview(review: Omit<Review, "id" | "createdAt">): Promise<Review> {
  const reviews = await readReviews();
  const full: Review = {
    ...review,
    id: `rev_${Math.random().toString(36).slice(2, 10)}`,
    createdAt: new Date().toISOString(),
  };
  reviews.push(full);
  await fs.writeFile(REVIEWS_FILE, JSON.stringify(reviews, null, 2), "utf8");
  return full;
}

export function calculateAverageRating(reviews: Review[]): number {
  if (reviews.length === 0) return 0;
  const total = reviews.reduce((sum, r) => sum + r.rating, 0);
  return Math.round((total / reviews.length) * 10) / 10;
}
