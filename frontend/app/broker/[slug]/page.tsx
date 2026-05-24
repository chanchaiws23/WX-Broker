import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { ArrowLeft, ExternalLink, Gauge, Globe, Mail, MapPin, Shield } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ShortlistBrokerButton from "@/components/ShortlistBrokerButton";
import AuditReportButton from "@/components/AuditReportButton";

interface Broker {
  id: number;
  name: string;
  slug: string;
  description: string;
  logoUrl: string;
  website: string;
  brokerType: string;
  createdAt?: string;
  updatedAt?: string;
}

const HERO_IMAGE = "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1800&q=80";

const TYPE_BADGE: Record<string, string> = {
  cfd: "CFD",
  crypto: "Crypto",
  stock: "Equities",
  bond: "Sovereign Debt",
};

async function getBroker(slug: string): Promise<Broker | null> {
  try {
    const apiUrl = process.env.API_URL || "http://localhost:3001";
    const res = await fetch(`${apiUrl}/api/brokers/${slug}`, { cache: "no-store" });
    if (!res.ok) return null;
    const data = await res.json();
    return data.broker || null;
  } catch {
    return null;
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const broker = await getBroker(slug);

  if (!broker) {
    return {
      title: "Broker Not Found | Woxa",
      description: "The requested broker could not be found.",
    };
  }

  return {
    title: broker.name,
    description: broker.description,
    alternates: {
      canonical: `/broker/${broker.slug}`,
    },
    openGraph: {
      title: `${broker.name} | Woxa`,
      description: broker.description,
      url: `/broker/${broker.slug}`,
      images: broker.logoUrl ? [broker.logoUrl] : [],
    },
  };
}

export default async function BrokerDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const broker = await getBroker(slug);
  if (!broker) notFound();

  const cleanWebsite = broker.website.replace(/^https?:\/\//, "").replace(/\/$/, "");
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "FinancialService",
    name: broker.name,
    description: broker.description,
    url: broker.website,
    image: broker.logoUrl,
    serviceType: `${broker.brokerType.toUpperCase()} broker`,
  };

  return (
    <div className="flex min-h-screen flex-col bg-[#06182b] text-[#cfe0ff]">
      <Navbar />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />

      <main className="flex-1">
        <section
          className="relative min-h-[470px] bg-cover bg-center"
          style={{ backgroundImage: `url(${HERO_IMAGE})` }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-[#06182b]/25 via-[#06182b]/55 to-[#06182b]" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#06182b]/85 via-[#06182b]/50 to-transparent" />

          <div className="relative z-10 mx-auto max-w-7xl px-8 pt-8">
            <Link href="/" className="inline-flex items-center gap-2 text-sm text-[#b9c8dc] transition hover:text-white">
              <ArrowLeft className="h-4 w-4" />
              Back to brokers
            </Link>

            <div className="soft-enter mt-20 max-w-2xl">
              <div className="flex items-center gap-3">
                <span className="rounded bg-[#8eb7ff]/20 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.18em] text-[#b9d2ff]">
                  Institutional Grade
                </span>
                <span className="text-xs tracking-[0.12em] text-[#b9d2ff]">5-star</span>
              </div>
              <h1 className="mt-5 font-display text-6xl font-bold leading-none text-[#d8e6ff]">
                {broker.name}
              </h1>
              <p className="mt-5 max-w-xl text-base leading-7 text-[#c6d6ee]">{broker.description}</p>
              <div className="mt-7 flex flex-wrap gap-4">
                <a
                  href={broker.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex h-12 items-center gap-2 rounded bg-[#8eb7ff] px-6 text-sm font-bold text-[#06182b]"
                >
                  <Globe className="h-4 w-4" />
                  Visit Website
                </a>
                <ShortlistBrokerButton broker={{ slug: broker.slug, name: broker.name, brokerType: broker.brokerType }} />
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto grid max-w-7xl gap-10 px-8 py-16 lg:grid-cols-[1fr_360px]">
          <div>
            <h2 className="font-display text-3xl font-bold text-[#d8e6ff]">The Sovereign Mandate</h2>
            <div className="mt-7 max-w-3xl space-y-5 text-sm leading-7 text-[#b8c8df]">
              <p>{broker.description}</p>
              <p>
                Our infrastructure is built on low-latency connectivity and broker-grade routing. Each record in this directory is structured to make asset focus, website access, and market positioning immediately clear.
              </p>
            </div>

            <div className="mt-12 grid gap-6 md:grid-cols-2">
              <div className="rounded-md bg-[#0d223a] p-7">
                <Shield className="h-6 w-6 text-[#9fc3ff]" />
                <h3 className="mt-5 font-bold text-[#d8e6ff]">SEC &amp; FCA Regulated</h3>
                <p className="mt-2 text-sm leading-5 text-[#8fa1bb]">
                  Operating under strict global mandates for transparency and capital reserve requirements.
                </p>
              </div>
              <div className="rounded-md bg-[#0d223a] p-7">
                <Gauge className="h-6 w-6 text-[#9fc3ff]" />
                <h3 className="mt-5 font-bold text-[#d8e6ff]">12ms Execution</h3>
                <p className="mt-2 text-sm leading-5 text-[#8fa1bb]">
                  Industry-leading throughput powered by broker-grade routing and execution logic.
                </p>
              </div>
            </div>

            <div className="mt-16">
              <h2 className="font-display text-2xl font-bold text-[#d8e6ff]">Available Markets</h2>
              <div className="mt-7 grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-6">
                {[
                  ["Forex Pairs", "80+"],
                  ["Indices", "25"],
                  ["Commodities", "18"],
                  ["Equities", "4,000+"],
                  ["Sovereign Bonds", "12"],
                  ["Crypto ETFs", "5"],
                ].map(([label, value]) => (
                  <div key={label} className="rounded bg-[#0d223a] p-5 text-center">
                    <p className="text-[10px] uppercase tracking-[0.16em] text-[#7890ad]">{label}</p>
                    <p className="mt-2 text-lg font-bold text-[#d8e6ff]">{value}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <aside className="space-y-6">
            <div className="rounded-md bg-[#2a3d57] p-7">
              <h2 className="font-display text-lg font-bold text-[#d8e6ff]">Performance Metrics</h2>
              <div className="mt-6 space-y-7">
                <div>
                  <p className="text-[10px] uppercase tracking-[0.18em] text-[#a9b8ca]">AUM Growth (YoY)</p>
                  <p className="mt-1 text-2xl font-bold text-[#d8e6ff]">+24.8%</p>
                </div>
                <div className="border-t border-[#50647c] pt-5">
                  <p className="text-[10px] uppercase tracking-[0.18em] text-[#a9b8ca]">Liquidity Access</p>
                  <p className="mt-1 text-2xl font-bold text-[#d8e6ff]">$12.4B</p>
                </div>
                <div className="border-t border-[#50647c] pt-5">
                  <p className="text-[10px] uppercase tracking-[0.18em] text-[#a9b8ca]">Client Retention</p>
                  <p className="mt-1 text-2xl font-bold text-[#d8e6ff]">98.2%</p>
                </div>
              </div>
              <AuditReportButton brokerName={broker.name} />
            </div>

            <div className="rounded-md bg-[#0d223a] p-7">
              <h2 className="text-[11px] font-bold uppercase tracking-[0.22em] text-[#8fa1bb]">Contact &amp; Details</h2>
              <div className="mt-5 space-y-4 text-sm text-[#b8c8df]">
                <div className="flex gap-3">
                  <MapPin className="mt-0.5 h-4 w-4 flex-shrink-0 text-[#9fc3ff]" />
                  <span>Desk: {TYPE_BADGE[broker.brokerType] || broker.brokerType}</span>
                </div>
                <div className="flex gap-3">
                  <Mail className="mt-0.5 h-4 w-4 flex-shrink-0 text-[#9fc3ff]" />
                  <a href={`mailto:institutional@${cleanWebsite.replace(/^www\./, "")}`} className="underline">
                    institutional@{cleanWebsite.replace(/^www\./, "")}
                  </a>
                </div>
                <div className="flex gap-3">
                  <ExternalLink className="mt-0.5 h-4 w-4 flex-shrink-0 text-[#9fc3ff]" />
                  <a href={broker.website} target="_blank" rel="noopener noreferrer" className="break-all underline">
                    {cleanWebsite}
                  </a>
                </div>
              </div>
            </div>
          </aside>
        </section>
      </main>

      <Footer />
    </div>
  );
}
