import { NextResponse } from "next/server";
import { verifyByToken } from "@/lib/users";

export async function POST(request: Request) {
  const { token } = await request.json();
  if (!token) return NextResponse.json({ error: "Missing token" }, { status: 400 });
  const user = await verifyByToken(token);
  if (!user) return NextResponse.json({ error: "Invalid token" }, { status: 400 });
  return NextResponse.json({ ok: true });
}


