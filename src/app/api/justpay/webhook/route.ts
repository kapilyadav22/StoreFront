import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    console.log("[Mock JustPay Webhook]", body);
    return NextResponse.json({ received: true });
  } catch (e) {
    return NextResponse.json({ error: "invalid payload" }, { status: 400 });
  }
}


