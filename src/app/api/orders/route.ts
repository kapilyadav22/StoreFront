import { NextResponse } from "next/server";
import { addOrder, readOrders, type OrderItem } from "@/lib/orders";

export async function GET() {
  const orders = await readOrders();
  return NextResponse.json(orders);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { items, totalCents, provider } = body as { items: OrderItem[]; totalCents: number; provider: "stripe" | "justpay" | "unknown" };
    if (!Array.isArray(items) || items.length === 0) return NextResponse.json({ error: "No items" }, { status: 400 });
    const order = await addOrder({ items, totalCents, provider });
    return NextResponse.json(order);
  } catch (e) {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }
}


