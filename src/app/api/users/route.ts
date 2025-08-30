import { NextResponse } from "next/server";
import { createUser } from "@/lib/users";

export async function POST(request: Request) {
  try {
    const { email, name, password } = await request.json();
    if (!email || !password) return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    const user = await createUser({ email, name, password });
    const origin = process.env.NEXTAUTH_URL || "http://localhost:3000";
    const verifyUrl = `${origin}/auth/verify?token=${encodeURIComponent(user.verifyToken || "")}`;
    return NextResponse.json({ id: user.id, email: user.email, name: user.name, verifyUrl });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || "Signup failed" }, { status: 400 });
  }
}


