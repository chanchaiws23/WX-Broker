"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { AlertCircle, Landmark, Lock } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { formatApiError, registerUser } from "@/lib/api";

const BUILDING_IMAGE = "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1800&q=80";

export default function RegisterPage() {
  const router = useRouter();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [agreed, setAgreed] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (!agreed) {
      setError("Please confirm that the submitted information is accurate");
      return;
    }

    setLoading(true);
    try {
      await registerUser({ fullName, email, password, confirmPassword });
      router.push("/login");
    } catch (err) {
      setError(formatApiError(err, "Registration failed"));
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    "sterling-input h-11 w-full rounded px-4 text-sm outline-none transition focus:border-[#8eb7ff]/70";
  const labelClass = "mb-2 block text-[11px] font-semibold uppercase tracking-[0.22em] text-[#8fa1bb]";

  return (
    <div className="flex min-h-screen flex-col bg-[#06182b] text-[#cfe0ff]">
      <Navbar />

      <main className="grid flex-1 lg:grid-cols-2">
        <section
          className="relative hidden min-h-[720px] bg-cover bg-center lg:block"
          style={{ backgroundImage: `url(${BUILDING_IMAGE})` }}
        >
          <div className="absolute inset-0 sterling-image-overlay" />
          <div className="relative z-10 flex h-full flex-col justify-end px-20 pb-24">
            <div className="mb-9 flex items-center gap-3 font-display text-2xl font-bold text-[#d8e6ff]">
              <Landmark className="h-6 w-6" />
              Woxa
            </div>
            <h1 className="font-display text-6xl font-bold leading-[0.95] text-[#d8e6ff]">
              Secure Your Entry
              <br />
              into the Woxa
              <br />
              Broker Network
            </h1>
            <p className="mt-7 max-w-md text-base leading-7 text-[#c6d6ee]">
              Access a focused institutional broker directory with market context and counterparty review workflows.
            </p>
            <div className="mt-12 flex gap-14">
              <div>
                <p className="text-3xl font-bold text-[#b9d2ff]">12.4T</p>
                <p className="mt-1 text-[11px] uppercase tracking-[0.2em] text-[#9aaeca]">Tracked Capital</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-[#b9d2ff]">99.9%</p>
                <p className="mt-1 text-[11px] uppercase tracking-[0.2em] text-[#9aaeca]">Uptime SLA</p>
              </div>
            </div>
          </div>
        </section>

        <section className="flex items-center justify-center bg-[#0b2138] px-8 py-16">
          <div className="soft-enter w-full max-w-md">
            <h2 className="font-display text-3xl text-[#d8e6ff]">Institutional Onboarding</h2>
            <p className="mt-2 text-sm text-[#8fa1bb]">Complete your verification credentials to access Woxa.</p>

            {error && (
              <div className="mt-5 flex items-center gap-2 rounded border border-red-400/30 bg-red-500/10 p-3 text-sm text-red-200">
                <AlertCircle className="h-4 w-4 flex-shrink-0" />
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="mt-8 space-y-5">
              <label className="block">
                <span className={labelClass}>Full Name</span>
                <input
                  type="text"
                  value={fullName}
                  onChange={(event) => setFullName(event.target.value)}
                  placeholder="Alexander Sterling"
                  autoComplete="name"
                  required
                  className={inputClass}
                />
              </label>

              <label className="block">
                <span className={labelClass}>Institutional Email</span>
                <input
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="verification@reserve.int"
                  autoComplete="email"
                  required
                  className={inputClass}
                />
              </label>

              <div className="grid gap-4 sm:grid-cols-2">
                <label className="block">
                  <span className={labelClass}>Security Password</span>
                  <input
                    type="password"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    placeholder="********"
                    autoComplete="new-password"
                    required
                    className={inputClass}
                  />
                </label>

                <label className="block">
                  <span className={labelClass}>Confirm Password</span>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(event) => setConfirmPassword(event.target.value)}
                    placeholder="********"
                    autoComplete="new-password"
                    required
                    className={inputClass}
                  />
                </label>
              </div>

              <label className="flex cursor-pointer items-start gap-3 text-xs leading-5 text-[#9aaeca]">
                <input
                  type="checkbox"
                  checked={agreed}
                  onChange={(event) => setAgreed(event.target.checked)}
                  className="mt-1 h-4 w-4 accent-[#8eb7ff]"
                />
                I confirm that I am authorized to use this workspace and that the submitted information is accurate.
              </label>

              <button
                type="submit"
                disabled={loading}
                className="h-12 w-full rounded bg-gradient-to-r from-[#a9c7ff] to-[#4d91ff] text-sm font-bold text-[#06182b] transition disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? "Initializing..." : "Initialize Registration ->"}
              </button>
            </form>

            <p className="mt-8 text-center text-sm text-[#8fa1bb]">
              Already verified?{" "}
              <Link href="/login" className="text-[#b9d2ff] hover:text-white">
                Institutional Login
              </Link>
            </p>

            <div className="mt-14 flex items-center justify-center gap-7 text-[10px] uppercase tracking-[0.18em] text-[#556a84]">
              {["AES-256 Encrypted", "Privacy Ready", "Secure Framework"].map((item) => (
                <span key={item} className="inline-flex items-center gap-2">
                  <Lock className="h-3 w-3" />
                  {item}
                </span>
              ))}
            </div>
            <p className="mt-6 text-center text-[10px] uppercase tracking-[0.18em] text-[#556a84]">&copy; 2024 Woxa</p>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
