"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { AlertCircle, ChevronDown, Globe, Image as ImageIcon, Loader2 } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { BrokerType, createBroker, formatApiError, getCurrentUser } from "@/lib/api";

const BROKER_TYPES: Array<{ label: string; value: BrokerType }> = [
  { label: "CFD", value: "cfd" },
  { label: "Bond", value: "bond" },
  { label: "Stock", value: "stock" },
  { label: "Crypto", value: "crypto" },
];

function generateSlug(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function isValidUrl(value: string) {
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

export default function CreateBrokerPage() {
  const router = useRouter();
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [logoUrl, setLogoUrl] = useState("");
  const [website, setWebsite] = useState("");
  const [brokerType, setBrokerType] = useState<BrokerType>("cfd");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let active = true;
    getCurrentUser()
      .catch(() => router.replace("/login"))
      .finally(() => {
        if (active) setCheckingAuth(false);
      });

    return () => {
      active = false;
    };
  }, [router]);

  const handleNameChange = (value: string) => {
    setName(value);
    setSlug((currentSlug) => (currentSlug === generateSlug(name) || !currentSlug ? generateSlug(value) : currentSlug));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError("");

    if (name.trim().length < 2) {
      setError("Broker name must be at least 2 characters");
      return;
    }

    if (!/^[a-z0-9-]+$/.test(slug) || slug.length < 2) {
      setError("Slug must use lowercase letters, numbers, and hyphens only");
      return;
    }

    if (description.trim().length < 20) {
      setError("Description must be at least 20 characters");
      return;
    }

    if (!isValidUrl(logoUrl)) {
      setError("Logo URL must be a valid http or https URL");
      return;
    }

    if (!isValidUrl(website)) {
      setError("Website must be a valid http or https URL");
      return;
    }

    setLoading(true);

    try {
      await createBroker({ name, slug, description, logoUrl, website, brokerType });
      router.push("/");
      router.refresh();
    } catch (err) {
      setError(formatApiError(err, "Failed to create broker"));
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    "sterling-input h-14 w-full rounded px-5 text-sm outline-none transition focus:border-[#8eb7ff]/70";
  const labelClass = "mb-3 block text-[11px] font-bold uppercase tracking-[0.22em] text-[#b9d2ff]";

  if (checkingAuth) {
    return (
      <div className="flex min-h-screen flex-col bg-[#06182b] text-[#cfe0ff]">
        <Navbar />
        <main className="flex flex-1 items-center justify-center">
          <div className="flex items-center gap-3 text-sm text-[#8fa1bb]">
            <Loader2 className="h-5 w-5 animate-spin" />
            Checking your session...
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col sterling-shell text-[#cfe0ff]">
      <Navbar />

      <main className="mx-auto w-full max-w-5xl flex-1 px-8 py-16">
        <section className="soft-enter">
          <h1 className="font-display text-6xl font-bold leading-none text-[#d8e6ff]">Submit Broker</h1>
          <p className="mt-4 max-w-2xl text-base leading-7 text-[#9aaeca]">
            Register a new institutional partner in the Woxa broker directory.
            <br />
            Use accurate public information, valid website data, and a clear asset focus.
          </p>
        </section>

        <section className="mt-12 rounded-md border border-[#173554] bg-[#0d223a] p-10">
          {error && (
            <div className="mb-7 flex items-center gap-2 rounded border border-red-400/30 bg-red-500/10 p-3 text-sm text-red-200">
              <AlertCircle className="h-4 w-4 flex-shrink-0" />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="grid gap-8 md:grid-cols-2">
              <label className="block">
                <span className={labelClass}>Broker Name</span>
                <input
                  type="text"
                  value={name}
                  onChange={(event) => handleNameChange(event.target.value)}
                  placeholder="e.g. Woxa Capital Markets"
                  required
                  minLength={2}
                  maxLength={80}
                  className={inputClass}
                />
              </label>

              <label className="block">
                <span className={labelClass}>Slug</span>
                <input
                  type="text"
                  value={slug}
                  onChange={(event) => setSlug(generateSlug(event.target.value))}
                  placeholder="sterling-capital-markets"
                  required
                  minLength={2}
                  maxLength={80}
                  pattern="[a-z0-9-]+"
                  className={inputClass}
                />
              </label>
            </div>

            <div>
              <span className={labelClass}>Broker Type</span>
              <div className="relative">
                <select
                  value={brokerType}
                  onChange={(event) => setBrokerType(event.target.value as BrokerType)}
                  className="sterling-input h-14 w-full appearance-none rounded px-5 pr-12 text-sm outline-none transition focus:border-[#8eb7ff]/70"
                  required
                >
                  {BROKER_TYPES.map((type) => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
                <ChevronDown className="pointer-events-none absolute right-5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#8fa1bb]" />
              </div>
            </div>

            <div className="grid gap-8 md:grid-cols-2">
              <label className="block">
                <span className={labelClass}>Logo URL</span>
                <div className="relative">
                  <ImageIcon className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#61728c]" />
                  <input
                    type="url"
                    value={logoUrl}
                    onChange={(event) => setLogoUrl(event.target.value)}
                    placeholder="https://assets.woxa.com/logo.png"
                    required
                    pattern="https?://.+"
                    className={`${inputClass} pl-11`}
                  />
                </div>
              </label>

              <label className="block">
                <span className={labelClass}>Website</span>
                <div className="relative">
                  <Globe className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#61728c]" />
                  <input
                    type="url"
                    value={website}
                    onChange={(event) => setWebsite(event.target.value)}
                    placeholder="https://woxa.example"
                    required
                    pattern="https?://.+"
                    className={`${inputClass} pl-11`}
                  />
                </div>
              </label>
            </div>

            <label className="block">
              <span className={labelClass}>Broker Description</span>
              <textarea
                rows={7}
                value={description}
                onChange={(event) => setDescription(event.target.value)}
                placeholder="Provide services, asset coverage, institutional strengths, and review context..."
                required
                minLength={20}
                maxLength={800}
                className="sterling-input w-full resize-none rounded px-5 py-5 text-sm leading-6 outline-none transition focus:border-[#8eb7ff]/70"
              />
            </label>

            <div className="flex items-center justify-end gap-8 pt-4">
              <Link href="/" className="text-sm font-medium text-[#b9c8dc] transition hover:text-white">
                Discard Draft
              </Link>
              <button
                type="submit"
                disabled={loading}
                className="h-14 min-w-[220px] rounded bg-gradient-to-r from-[#a9c7ff] to-[#4d91ff] text-sm font-bold text-[#06182b] transition disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? "Submitting..." : "Submit Application"}
              </button>
            </div>
          </form>
        </section>
      </main>

      <Footer />
    </div>
  );
}
