import type { Metadata } from "next";
import { Activity, Clock3, LineChart, Network } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { marketAccessMatrix, marketSessions, marketSnapshots } from "@/lib/mock-content";

export const metadata: Metadata = {
  title: "Markets",
  description: "Mock institutional market access coverage for the Woxa broker directory.",
  alternates: {
    canonical: "/markets",
  },
};

export default function MarketsPage() {
  return (
    <div className="flex min-h-screen flex-col sterling-shell text-[#cfe0ff]">
      <Navbar />
      <main className="mx-auto w-full max-w-7xl flex-1 px-8 py-16">
        <section className="soft-enter flex items-end justify-between gap-6">
          <div>
            <p className="text-[11px] uppercase tracking-[0.22em] text-[#697b94]">Markets</p>
            <h1 className="mt-3 font-display text-5xl font-bold leading-none text-[#d8e6ff] md:text-6xl">
              Available Market Access
            </h1>
            <p className="mt-5 max-w-2xl text-sm leading-6 text-[#8fa1bb]">
              Mock coverage data for evaluating broker reach across FX, indices, equities, crypto products, debt, and commodities.
            </p>
          </div>
          <LineChart className="hidden h-12 w-12 text-[#8eb7ff] md:block" />
        </section>

        <section className="mt-12 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {marketSnapshots.map((item) => (
            <div key={item.label} className="rounded-md bg-[#0d223a] p-8">
              <p className="text-[10px] uppercase tracking-[0.18em] text-[#7890ad]">{item.label}</p>
              <p className="mt-4 text-4xl font-bold text-[#d8e6ff]">{item.value}</p>
              <p className="mt-4 text-sm leading-6 text-[#8fa1bb]">{item.detail}</p>
            </div>
          ))}
        </section>

        <section className="mt-14 grid gap-6 lg:grid-cols-[1.45fr_0.9fr]">
          <div className="rounded-md border border-[#173554] bg-[#071d33]">
            <div className="flex items-center justify-between gap-4 border-b border-[#173554] px-6 py-5">
              <div>
                <p className="text-[10px] uppercase tracking-[0.2em] text-[#7890ad]">Execution Map</p>
                <h2 className="mt-2 font-display text-2xl font-bold text-[#d8e6ff]">Institutional Venue Matrix</h2>
              </div>
              <Network className="h-6 w-6 text-[#8eb7ff]" />
            </div>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[720px] text-left text-sm">
                <thead className="text-[10px] uppercase tracking-[0.18em] text-[#7890ad]">
                  <tr>
                    <th className="px-6 py-4 font-medium">Desk</th>
                    <th className="px-6 py-4 font-medium">Region</th>
                    <th className="px-6 py-4 font-medium">Latency</th>
                    <th className="px-6 py-4 font-medium">Depth</th>
                    <th className="px-6 py-4 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#173554] text-[#b8c8df]">
                  {marketAccessMatrix.map((desk) => (
                    <tr key={desk.desk} className="transition-colors hover:bg-[#0b243e]">
                      <td className="px-6 py-5">
                        <p className="font-semibold text-[#d8e6ff]">{desk.desk}</p>
                        <p className="mt-2 text-xs text-[#7890ad]">{desk.routes.join(" / ")}</p>
                      </td>
                      <td className="px-6 py-5">{desk.region}</td>
                      <td className="px-6 py-5 text-[#9fc3ff]">{desk.latency}</td>
                      <td className="px-6 py-5">{desk.depth}</td>
                      <td className="px-6 py-5">
                        <span className="rounded-full border border-[#315377] px-3 py-1 text-xs text-[#cfe0ff]">{desk.status}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="rounded-md border border-[#173554] bg-[#0b2036] p-6">
            <div className="flex items-center gap-3">
              <Clock3 className="h-6 w-6 text-[#8eb7ff]" />
              <div>
                <p className="text-[10px] uppercase tracking-[0.2em] text-[#7890ad]">Trading Windows</p>
                <h2 className="mt-1 font-display text-2xl font-bold text-[#d8e6ff]">Session Heat</h2>
              </div>
            </div>
            <div className="mt-6 space-y-4">
              {marketSessions.map((session) => (
                <div key={session.label} className="border-t border-[#173554] pt-4">
                  <div className="flex items-center justify-between gap-4">
                    <p className="font-semibold text-[#d8e6ff]">{session.label}</p>
                    <span className="text-xs text-[#9fc3ff]">{session.volume}</span>
                  </div>
                  <p className="mt-2 text-xs uppercase tracking-[0.14em] text-[#7890ad]">{session.window}</p>
                  <p className="mt-2 text-sm leading-6 text-[#8fa1bb]">{session.focus}</p>
                </div>
              ))}
            </div>
            <div className="mt-6 flex items-center gap-3 rounded-md bg-[#07182b] p-4">
              <Activity className="h-5 w-5 text-[#8eb7ff]" />
              <p className="text-sm leading-6 text-[#b8c8df]">Mock liquidity model refreshes can later be wired to the API without changing this page layout.</p>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
