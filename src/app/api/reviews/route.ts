import { NextResponse } from "next/server";
import { getProductReviews, addReview } from "@/lib/reviews";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const productId = searchParams.get("productId");
  if (!productId) {
    return NextResponse.json({ error: "Product ID required" }, { status: 400 });
  }
  const reviews = await getProductReviews(productId);
  return NextResponse.json(reviews);
}

export async function POST(request: Request) {
  try {
    const { productId, userId, userName, rating, title, comment } = await request.json();
    if (!productId || !userId || !userName || !rating || !title || !comment) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }
    if (rating < 1 || rating > 5) {
      return NextResponse.json({ error: "Rating must be 1-5" }, { status: 400 });
    }
    const review = await addReview({ productId, userId, userName, rating, title, comment });
    return NextResponse.json(review);
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || "Failed to add review" }, { status: 500 });
  }
}
