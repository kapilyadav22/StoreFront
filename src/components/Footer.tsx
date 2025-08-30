export default function Footer() {
  return (
    <footer className="border-t border-black/5 dark:border-white/10 mt-16">
      <div className="max-w-7xl mx-auto px-6 py-10 text-sm text-foreground/70 flex flex-col sm:flex-row items-center justify-between gap-4">
        <p>© {new Date().getFullYear()} Storefront. All rights reserved.</p>
        <div className="flex items-center gap-4">
          <a href="https://nextjs.org" target="_blank" className="hover:underline">Built with Next.js</a>
          <a href="https://tailwindcss.com" target="_blank" className="hover:underline">Tailwind CSS</a>
        </div>
      </div>
    </footer>
  );
}


