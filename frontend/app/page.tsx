"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { ArrowRight, BookOpen, Check, ChevronDown, Handshake, MapPin, Search } from "lucide-react";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import { formatApiError, listBrokers, type Broker } from "@/lib/api";
import { useDebounce } from "@/hooks/use-debounce";

const FILTERS = [
  { value: "all", label: "All Partners", detail: "Full institutional network" },
  { value: "cfd", label: "CFD", detail: "Multi-asset derivatives desks" },
  { value: "bond", label: "Bond", detail: "Fixed income and sovereign debt" },
  { value: "stock", label: "Stock", detail: "Equities and DMA access" },
  { value: "crypto", label: "Crypto", detail: "Digital asset venues" },
];

const CARD_IMAGES = [
  "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1518005020951-eccb494ad742?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1519608487953-e999c86e7455?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1493246507139-91e8fad9978e?auto=format&fit=crop&w=900&q=80",
];

const TYPE_LABELS: Record<string, string> = {
  cfd: "Premium Tier",
  bond: "FCA Regulated",
  stock: "Global Reach",
  crypto: "Cold Custody",
};

export default function HomePage() {
  const [brokers, setBrokers] = useState<Broker[]>([]);
  const [typeCounts, setTypeCounts] = useState<Record<string, number>>({});
  const [search, setSearch] = useState("");
  const [type, setType] = useState("all");
  const [filterOpen, setFilterOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const filterRef = useRef<HTMLDivElement | null>(null);
  const debouncedSearch = useDebounce(search, 350);

  const selectedFilter = FILTERS.find((filter) => filter.value === type) ?? FILTERS[0];

  const fetchBrokers = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const [nextBrokers, countSource] = await Promise.all([
        listBrokers({ search: debouncedSearch, type }),
        type === "all" ? listBrokers({ search: debouncedSearch }) : listBrokers({ search: debouncedSearch, type: "all" }),
      ]);

      setBrokers(nextBrokers);
      setTypeCounts(
        countSource.reduce<Record<string, number>>((acc, broker) => {
          acc[broker.brokerType] = (acc[broker.brokerType] || 0) + 1;
          return acc;
        }, {})
      );
    } catch (err) {
      setError(formatApiError(err, "Unable to load brokers"));
      setBrokers([]);
      setTypeCounts({});
    } finally {
      setLoading(false);
    }
  }, [debouncedSearch, type]);

  useEffect(() => {
    fetchBrokers();
  }, [fetchBrokers]);

  useEffect(() => {
    const handlePointerDown = (event: PointerEvent) => {
      if (!filterRef.current?.contains(event.target as Node)) setFilterOpen(false);
    };

    document.addEventListener("pointerdown", handlePointerDown);
    return () => document.removeEventListener("pointerdown", handlePointerDown);
  }, []);

  const structuredData = useMemo(() => {
    return {
      "@context": "https://schema.org",
      "@type": "ItemList",
      name: "Woxa Institutional Brokers",
      itemListElement: brokers.map((broker, index) => ({
        "@type": "ListItem",
        position: index + 1,
        url: `/broker/${broker.slug}`,
        name: broker.name,
      })),
    };
  }, [brokers]);

  return (
    <div className="flex min-h-screen flex-col sterling-shell text-[#cfe0ff]">
      <Navbar />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />

      <main className="mx-auto w-full max-w-7xl flex-1 px-8 py-14">
        <section className="soft-enter max-w-3xl">
          <h1 className="font-display text-5xl font-bold leading-none text-[#d8e6ff] md:text-6xl">
            Institutional Brokers
          </h1>
          <p className="mt-4 max-w-xl text-sm leading-6 text-[#8fa1bb]">
            Access curated liquidity partners across prime brokerage, execution venues, and digital asset desks.
          </p>
        </section>

        <section className="mt-9 max-w-2xl">
          <label className="relative block">
            <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#61728c]" />
            <input
              type="text"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Find brokers by name, region, or asset class..."
              className="sterling-input h-12 w-full rounded-md pl-11 pr-4 text-sm outline-none transition focus:border-[#8eb7ff]/70"
            />
          </label>

          <div ref={filterRef} className="relative mt-6 max-w-sm">
            <span className="mb-2 block text-[11px] uppercase tracking-[0.22em] text-[#697b94]">Asset Focus</span>
            <button
              type="button"
              onClick={() => setFilterOpen((open) => !open)}
              className="group flex h-12 w-full items-center justify-between rounded-md border border-[#315377] bg-[#071a2d] px-4 text-left shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] transition hover:border-[#8eb7ff]/70 focus:outline-none focus:ring-2 focus:ring-[#8eb7ff]/30"
              aria-haspopup="listbox"
              aria-expanded={filterOpen}
            >
              <span>
                <span className="block text-sm font-semibold text-[#d8e6ff]">
                  {selectedFilter.label}
                  {selectedFilter.value !== "all" && typeCounts[selectedFilter.value] ? ` (${typeCounts[selectedFilter.value]})` : ""}
                </span>
                <span className="mt-0.5 block text-[11px] text-[#7890ad]">{selectedFilter.detail}</span>
              </span>
              <ChevronDown className={`h-4 w-4 text-[#9fc3ff] transition ${filterOpen ? "rotate-180" : ""}`} />
            </button>

            {filterOpen ? (
              <div
                role="listbox"
                className="absolute z-40 mt-2 w-full overflow-hidden rounded-md border border-[#315377] bg-[#06182b] shadow-2xl shadow-black/40 ring-1 ring-[#8eb7ff]/10"
              >
                {FILTERS.map((filter) => {
                  const active = filter.value === type;
                  const count = filter.value === "all" ? brokers.length : typeCounts[filter.value];
                  return (
                    <button
                      key={filter.value}
                      type="button"
                      role="option"
                      aria-selected={active}
                      onClick={() => {
                        setType(filter.value);
                        setFilterOpen(false);
                      }}
                      className={`flex w-full items-center justify-between gap-4 px-4 py-3 text-left transition ${
                        active ? "bg-[#102f4f] text-[#e5f0ff]" : "text-[#b8c8df] hover:bg-[#0d2741] hover:text-white"
                      }`}
                    >
                      <span>
                        <span className="block text-sm font-semibold">
                          {filter.label}
                          {filter.value !== "all" && count ? ` (${count})` : ""}
                        </span>
                        <span className="mt-0.5 block text-[11px] text-[#7890ad]">{filter.detail}</span>
                      </span>
                      {active ? <Check className="h-4 w-4 text-[#9fc3ff]" /> : null}
                    </button>
                  );
                })}
              </div>
            ) : null}
          </div>
        </section>

        {error ? (
          <div className="mt-8 max-w-2xl rounded-md border border-red-400/30 bg-red-500/10 p-4 text-sm text-red-200">
            {error}
          </div>
        ) : null}

        <section id="brokers" className="mt-10 grid scroll-mt-24 grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
          {loading
            ? [...Array(5)].map((_, index) => (
                <div key={index} className="h-[340px] animate-pulse rounded-md bg-[#0d223a]" />
              ))
            : brokers.map((broker, index) => (
                <Link
                  key={broker.id}
                  href={`/broker/${broker.slug}`}
                  className="group overflow-hidden rounded-md border border-[#163555] bg-[#0d223a] transition hover:-translate-y-1 hover:border-[#8eb7ff]/50"
                >
                  <div
                    className="relative h-40 bg-cover bg-center grayscale"
                    style={{ backgroundImage: `url(${CARD_IMAGES[index % CARD_IMAGES.length]})` }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0d223a] via-[#0d223a]/40 to-transparent" />
                    <span className="absolute right-3 top-3 rounded-full bg-[#b9d2ff] px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-[#06182b]">
                      {TYPE_LABELS[broker.brokerType] || broker.brokerType}
                    </span>
                  </div>

                  <div className="p-6">
                    <h2 className="font-display text-xl font-bold text-[#d8e6ff]">{broker.name}</h2>
                    <p className="mt-3 line-clamp-3 min-h-[60px] text-sm leading-5 text-[#8fa1bb]">{broker.description}</p>

                    <div className="mt-7 flex items-center justify-between text-xs">
                      <span className="inline-flex min-w-0 items-center gap-2 uppercase tracking-[0.12em] text-[#61728c]">
                        <MapPin className="h-3.5 w-3.5 flex-shrink-0" />
                        <span className="truncate">{broker.website.replace(/^https?:\/\//, "").replace(/\/$/, "")}</span>
                      </span>
                      <span className="inline-flex items-center gap-2 font-semibold text-[#9fc3ff]">
                        View Details <ArrowRight className="h-3.5 w-3.5 transition group-hover:translate-x-1" />
                      </span>
                    </div>
                  </div>
                </Link>
              ))}

          {!loading ? (
            <Link
              href="/create"
              className="flex min-h-[340px] flex-col items-center justify-center rounded-md border border-dashed border-[#30577c] bg-[#0b2036]/70 p-8 text-center transition hover:border-[#8eb7ff]/70"
            >
              <span className="flex h-16 w-16 items-center justify-center rounded-full border border-[#6e9be2] text-[#9fc3ff]">
                <Handshake className="h-7 w-7" />
              </span>
              <h2 className="mt-7 font-display text-xl font-bold text-[#d8e6ff]">Partner with Woxa</h2>
              <p className="mt-3 max-w-[220px] text-sm leading-5 text-[#8fa1bb]">
                Submit an institutional broker profile for review by the Woxa network.
              </p>
              <span className="mt-7 rounded bg-[#8eb7ff] px-5 py-2 text-xs font-bold text-[#06182b]">Inquire Now</span>
            </Link>
          ) : null}
        </section>

        <section className="grid gap-5 border-t border-[#15324f] py-16 md:grid-cols-2 xl:grid-cols-4">
          {[
            ["privacy", "Privacy Policy", "Sessions use secure HTTP-only cookies and broker shortlists remain local to the browser."],
            ["terms", "Terms of Service", "Broker submissions must use accurate public information and valid website or logo URLs."],
            ["risk", "Risk Disclosure", "Directory data supports evaluation workflows only and is not investment advice."],
            ["contact", "Contact", "For partnership requests, submit a broker profile or contact the Woxa review desk."],
          ].map(([id, title, body]) => (
            <div key={id} id={id} className="scroll-mt-24 rounded-md bg-[#0b2036] p-6">
              <BookOpen className="h-5 w-5 text-[#9fc3ff]" />
              <h3 className="mt-4 font-display text-xl font-bold text-[#d8e6ff]">{title}</h3>
              <p className="mt-3 text-sm leading-6 text-[#8fa1bb]">{body}</p>
            </div>
          ))}
        </section>
      </main>

      <Footer />
    </div>
  );
}
