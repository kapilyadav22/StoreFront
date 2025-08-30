import { NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "");

export async function POST(request: Request) {
  if (!process.env.STRIPE_SECRET_KEY) {
    // We only require Stripe key if using Stripe provider
  }

  try {
    const body = await request.json();
    const { items, provider } = body as { items: Array<{ name: string; priceCents: number; quantity: number }>; provider?: "stripe" | "justpay" };

    if (!Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: "No items" }, { status: 400 });
    }

    const origin = request.headers.get("origin") || "http://localhost:3000";

    // Default provider
    const selected = provider || "stripe";

    if (selected === "justpay") {
      // Mock JustPay: return a local redirect URL
      const sid = `jp_${Math.random().toString(36).slice(2, 10)}`;
      const amount = items.reduce((sum, i) => sum + i.priceCents * i.quantity, 0);
      const url = `${origin}/checkout/justpay?sid=${encodeURIComponent(sid)}&amount=${amount}`;
      return NextResponse.json({ id: sid, url });
    }

    if (!process.env.STRIPE_SECRET_KEY) {
      return NextResponse.json({ error: "Stripe not configured" }, { status: 500 });
    }

    const line_items = items.map((item) => ({
      price_data: {
        currency: "usd",
        product_data: { name: item.name },
        unit_amount: item.priceCents,
      },
      quantity: item.quantity,
    }));

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      line_items,
      success_url: `${origin}/cart/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/cart/cancel`,
    });

    return NextResponse.json({ id: session.id, url: session.url });
  } catch (err) {
    return NextResponse.json({ error: "Unable to create session" }, { status: 500 });
  }
}


