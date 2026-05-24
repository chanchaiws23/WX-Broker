"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { AlertCircle, Eye, EyeOff, Fingerprint, Lock, Mail, Shield } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { formatApiError, loginUser } from "@/lib/api";

const BUILDING_IMAGE = "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1800&q=80";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      await loginUser(email, password);
      router.push("/create");
      router.refresh();
    } catch (err) {
      setError(formatApiError(err, "Login failed"));
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    "sterling-input h-12 w-full rounded px-10 text-sm outline-none transition focus:border-[#8eb7ff]/70";

  return (
    <div className="flex min-h-screen flex-col bg-[#06182b] text-[#cfe0ff]">
      <Navbar />

      <main
        className="relative flex min-h-[calc(100vh-136px)] flex-1 items-center justify-center bg-cover bg-center px-6 py-14"
        style={{ backgroundImage: `url(${BUILDING_IMAGE})` }}
      >
        <div className="absolute inset-0 bg-[#06182b]/78" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#06182b]/10 via-[#06182b]/55 to-[#06182b]" />

        <section className="soft-enter relative z-10 w-full max-w-md">
          <div className="mb-9 text-center">
            <h1 className="font-display text-4xl font-bold text-[#d8e6ff]">Woxa</h1>
            <p className="mt-1 text-xs uppercase tracking-[0.36em] text-[#9db8e6]">Institutional Broker Directory</p>
          </div>

          <div className="border-t-4 border-[#8eb7ff] bg-[#0d223a]/95 p-8 shadow-2xl shadow-black/30">
            <h2 className="font-display text-2xl text-[#d8e6ff]">Secure Verification</h2>
            <p className="mt-2 max-w-xs text-sm leading-5 text-[#8fa1bb]">Access the Woxa directory with verified credentials.</p>

            {error && (
              <div className="mt-5 flex items-center gap-2 rounded border border-red-400/30 bg-red-500/10 p-3 text-sm text-red-200">
                <AlertCircle className="h-4 w-4 flex-shrink-0" />
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="mt-7 space-y-5">
              <label className="block">
                <span className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.22em] text-[#8fa1bb]">Institutional Email</span>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#61728c]" />
                  <input
                    type="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    placeholder="user@institution.domain"
                    autoComplete="email"
                    required
                    className={inputClass}
                  />
                </div>
              </label>

              <label className="block">
                <span className="mb-2 flex items-center justify-between text-[11px] font-semibold uppercase tracking-[0.22em] text-[#8fa1bb]">
                  Security Password
                  <span className="text-[10px] text-[#657690]">Forgot credentials?</span>
                </span>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#61728c]" />
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    placeholder="Enter password"
                    autoComplete="current-password"
                    required
                    className={`${inputClass} pr-10`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((value) => !value)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-[#61728c] transition hover:text-[#cfe0ff]"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </label>

              <button
                type="submit"
                disabled={loading}
                className="h-12 w-full rounded bg-gradient-to-r from-[#a9c7ff] to-[#4d91ff] text-sm font-bold uppercase tracking-[0.14em] text-[#06182b] transition disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? "Authenticating..." : "Login"}
              </button>
            </form>

            <div className="mt-6 border-t border-[#1b3859] pt-5 text-center text-sm text-[#8fa1bb]">
              Don't have an account?{" "}
              <Link href="/register" className="text-[#b9d2ff] hover:text-white">
                Register
              </Link>
            </div>
          </div>

          <div className="mt-6 flex items-center justify-center gap-7 text-[10px] uppercase tracking-[0.18em] text-[#697b94]">
            <span className="inline-flex items-center gap-2"><Shield className="h-3 w-3" /> TLS 1.3 Encryption</span>
            <span className="inline-flex items-center gap-2"><Fingerprint className="h-3 w-3" /> Biometric Ready</span>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
