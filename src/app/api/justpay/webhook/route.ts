import { NextResponse } from "next/server";

// Mock Juspay webhook endpoint: accepts any payload and returns 200
export async function POST(request: Request) {
  try {
    const body = await request.json();
    // In a real integration, verify signature and persist order status
    console.log("[Mock JustPay Webhook]", body);
    return NextResponse.json({ received: true });
  } catch (e) {
    return NextResponse.json({ error: "invalid payload" }, { status: 400 });
  }
}


