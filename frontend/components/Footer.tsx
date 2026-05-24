import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-[#102a47] bg-[#06182b]">
      <div className="mx-auto flex max-w-7xl flex-col gap-4 px-8 py-8 text-[11px] uppercase tracking-[0.18em] text-[#5f718a] md:flex-row md:items-center md:justify-between">
        <Link href="/" className="font-display text-base font-bold normal-case tracking-normal text-[#b9d2ff]">
          Woxa
        </Link>
        <div className="flex flex-wrap gap-x-9 gap-y-3">
          <Link href="/#privacy" className="transition hover:text-[#b9d2ff]">Privacy Policy</Link>
          <Link href="/#terms" className="transition hover:text-[#b9d2ff]">Terms of Service</Link>
          <Link href="/#risk" className="transition hover:text-[#b9d2ff]">Risk Disclosure</Link>
          <Link href="/#contact" className="transition hover:text-[#b9d2ff]">Contact</Link>
        </div>
        <span>&copy; 2024 Woxa. All rights reserved.</span>
      </div>
    </footer>
  );
}
