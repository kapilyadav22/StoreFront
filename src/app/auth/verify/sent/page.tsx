"use client";


import { useSearchParams } from "next/navigation";
import Link from "next/link";

export default function VerifySentPage() {
  const search = useSearchParams();
  const url = search.get("url") || "";
  return (
    <div className="max-w-md mx-auto px-6 py-16">
      <h1 className="text-2xl font-semibold tracking-tight">Verify your email</h1>
      <p className="mt-4 text-foreground/70">We’d normally email you a link. For this demo, click the link below to verify now.</p>
      <div className="mt-6">
        <Link href={url} className="underline break-all">{url}</Link>
      </div>
    </div>
  );
}


