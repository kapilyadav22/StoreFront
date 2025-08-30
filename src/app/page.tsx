
import Link from "next/link";
import Image from "next/image";
import RecentlyViewedSection from "@/components/RecentlyViewedSection";

export default function Home() {
  return (
    <div>
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(1200px_600px_at_50%_-50%,rgba(0,0,0,0.08),transparent)] dark:bg-[radial-gradient(1200px_600px_at_50%_-50%,rgba(255,255,255,0.1),transparent)]" />
        <div className="max-w-7xl mx-auto px-6 py-20 md:py-28 grid md:grid-cols-2 items-center gap-10">
          <div>
            <h1 className="text-4xl md:text-6xl font-semibold tracking-tight">Timeless essentials for every day.</h1>
            <p className="mt-6 text-lg text-foreground/70 max-w-xl">Discover quality apparel and gear designed for comfort and built to last. Free shipping over $50.</p>
            <div className="mt-8 flex items-center gap-4">
              <Link href="/products" className="px-5 py-3 rounded-md bg-black text-white dark:bg-white dark:text-black font-medium">Shop collection</Link>
              <a href="#featured" className="px-5 py-3 rounded-md border border-black/10 dark:border-white/20 font-medium">Explore featured</a>
            </div>
          </div>
          <div className="relative h-[360px] md:h-[520px]">
            <Image src="https://images.unsplash.com/photo-1756227584303-f1400daaa69d?q=80&w=2624&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" alt="Hero" fill className="object-cover rounded-2xl" />
          </div>
        </div>
      </section>

      <section id="featured" className="max-w-7xl mx-auto px-6 py-16">
        <div className="flex items-end justify-between">
          <h2 className="text-2xl md:text-3xl font-semibold tracking-tight">Featured picks</h2>
          <Link href="/products" className="text-sm font-medium underline hover:no-underline">View all</Link>
        </div>
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            {
              title: "Everyday Comfort",
              img: "https://images.unsplash.com/photo-1518544801976-3e188ed7f42a?q=80&w=1600&auto=format&fit=crop",
            },
            {
              title: "Made to Move",
              img: "https://images.unsplash.com/photo-1456327102063-fb5054efe647?q=80&w=1600&auto=format&fit=crop",
            },
            {
              title: "Carry Better",
              img: "https://images.unsplash.com/photo-1475180098004-ca77a66827be?q=80&w=1600&auto=format&fit=crop",
            },
          ].map((c) => (
            <div key={c.title} className="group relative overflow-hidden rounded-xl">
              <div className="relative aspect-[4/3]">
                <Image src={c.img} alt={c.title} fill className="object-cover transition duration-300 group-hover:scale-105" />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <div className="absolute bottom-4 left-4 right-4 text-white">
                <div className="text-lg font-medium">{c.title}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <RecentlyViewedSection />
    </div>
  );
}
