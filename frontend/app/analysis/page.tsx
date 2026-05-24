import type { Metadata } from "next";
import { BarChart3, Radar, ShieldCheck } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { analysisItems, analysisPlaybook, brokerSignalScores } from "@/lib/mock-content";

export const metadata: Metadata = {
  title: "Analysis",
  description: "Mock broker analysis signals for liquidity routing, counterparty review, and search intelligence.",
  alternates: {
    canonical: "/analysis",
  },
};

export default function AnalysisPage() {
  return (
    <div className="flex min-h-screen flex-col sterling-shell text-[#cfe0ff]">
      <Navbar />
      <main className="mx-auto w-full max-w-7xl flex-1 px-8 py-16">
        <section className="soft-enter">
          <p className="text-[11px] uppercase tracking-[0.22em] text-[#697b94]">Analysis</p>
          <h1 className="mt-3 font-display text-5xl font-bold leading-none text-[#d8e6ff] md:text-6xl">
            Broker Selection Signals
          </h1>
          <p className="mt-5 max-w-2xl text-sm leading-6 text-[#8fa1bb]">
            Mock decision support for broker review. These cards make the analysis navigation usable without changing the backend contract.
          </p>
        </section>

        <section className="mt-12 grid gap-5 md:grid-cols-2">
          {analysisItems.map((item) => (
            <div key={item.title} className="rounded-md border border-[#173554] bg-[#0b2036] p-8">
              <ShieldCheck className="h-6 w-6 text-[#9fc3ff]" />
              <h2 className="mt-6 font-display text-2xl font-bold text-[#d8e6ff]">{item.title}</h2>
              <p className="mt-4 text-sm leading-6 text-[#8fa1bb]">{item.body}</p>
            </div>
          ))}
        </section>

        <section className="mt-14 grid gap-6 lg:grid-cols-[1fr_1.15fr]">
          <div className="rounded-md border border-[#173554] bg-[#071d33] p-6">
            <div className="flex items-center gap-3">
              <Radar className="h-6 w-6 text-[#8eb7ff]" />
              <div>
                <p className="text-[10px] uppercase tracking-[0.2em] text-[#7890ad]">Review Flow</p>
                <h2 className="mt-1 font-display text-2xl font-bold text-[#d8e6ff]">Institutional Playbook</h2>
              </div>
            </div>
            <div className="mt-8 space-y-5">
              {analysisPlaybook.map((item, index) => (
                <div key={item.phase} className="grid gap-4 border-t border-[#173554] pt-5 md:grid-cols-[4rem_1fr]">
                  <span className="font-display text-4xl font-bold text-[#355b87]">0{index + 1}</span>
                  <div>
                    <h3 className="text-lg font-semibold text-[#d8e6ff]">{item.phase}</h3>
                    <p className="mt-2 text-sm leading-6 text-[#8fa1bb]">{item.metric}</p>
                    <p className="mt-2 text-xs uppercase tracking-[0.14em] text-[#9fc3ff]">{item.result}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-md border border-[#173554] bg-[#0b2036]">
            <div className="flex items-center justify-between gap-4 border-b border-[#173554] px-6 py-5">
              <div>
                <p className="text-[10px] uppercase tracking-[0.2em] text-[#7890ad]">Mock Scoring</p>
                <h2 className="mt-2 font-display text-2xl font-bold text-[#d8e6ff]">Broker Signal Board</h2>
              </div>
              <BarChart3 className="h-6 w-6 text-[#8eb7ff]" />
            </div>
            <div className="divide-y divide-[#173554]">
              {brokerSignalScores.map((broker) => (
                <div key={broker.broker} className="grid gap-5 px-6 py-5 xl:grid-cols-[1fr_1.2fr]">
                  <div>
                    <div className="flex items-center gap-3">
                      <span className="rounded-full bg-[#102f50] px-3 py-1 text-xs text-[#9fc3ff]">{broker.type}</span>
                      <p className="text-xs uppercase tracking-[0.14em] text-[#7890ad]">{broker.fit}</p>
                    </div>
                    <h3 className="mt-3 font-display text-2xl font-bold text-[#d8e6ff]">{broker.broker}</h3>
                  </div>
                  <div className="space-y-3">
                    {[
                      ["Liquidity", broker.liquidity],
                      ["Compliance", broker.compliance],
                      ["Execution", broker.execution],
                    ].map(([label, value]) => (
                      <div key={label}>
                        <div className="flex justify-between text-xs uppercase tracking-[0.14em] text-[#7890ad]">
                          <span>{label}</span>
                          <span>{value}</span>
                        </div>
                        <div className="mt-2 h-2 rounded-full bg-[#07182b]">
                          <div className="h-2 rounded-full bg-[#8eb7ff]" style={{ width: `${value}%` }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
