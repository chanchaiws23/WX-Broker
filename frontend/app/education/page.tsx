import type { Metadata } from "next";
import { BookOpen, CheckCircle2, GraduationCap } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { educationItems, educationModules } from "@/lib/mock-content";

export const metadata: Metadata = {
  title: "Education",
  description: "Mock broker asset focus guide for CFD, bond, stock, and crypto broker categories.",
  alternates: {
    canonical: "/education",
  },
};

export default function EducationPage() {
  return (
    <div className="flex min-h-screen flex-col sterling-shell text-[#cfe0ff]">
      <Navbar />
      <main className="mx-auto w-full max-w-7xl flex-1 px-8 py-16">
        <section className="soft-enter grid gap-8 lg:grid-cols-[0.8fr_1fr]">
          <div>
            <p className="text-[11px] uppercase tracking-[0.22em] text-[#697b94]">Education</p>
            <h1 className="mt-3 font-display text-5xl font-bold leading-none text-[#d8e6ff] md:text-6xl">
              Asset Focus Guide
            </h1>
            <p className="mt-5 max-w-xl text-sm leading-6 text-[#8fa1bb]">
              Mock education content for users reviewing broker categories before creating or opening a broker profile.
            </p>
          </div>
          <div className="rounded-md border border-[#173554] bg-[#0b2036] p-8">
            <BookOpen className="h-7 w-7 text-[#9fc3ff]" />
            <h2 className="mt-6 font-display text-2xl font-bold text-[#d8e6ff]">How to use this guide</h2>
            <p className="mt-4 text-sm leading-6 text-[#8fa1bb]">
              Use the notes below to choose a broker type, then return to the broker list and filter by the matching asset focus.
            </p>
          </div>
        </section>

        <section className="mt-12 space-y-4">
          {educationItems.map((item, index) => (
            <div key={item.title} className="flex gap-5 rounded-md bg-[#0d223a] p-6">
              <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-[#8eb7ff] text-sm font-bold text-[#06182b]">
                {index + 1}
              </span>
              <div>
                <h2 className="font-display text-2xl font-bold text-[#d8e6ff]">{item.title}</h2>
                <p className="mt-2 text-sm leading-6 text-[#b8c8df]">{item.body}</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {item.checklist.map((check) => (
                    <span key={check} className="rounded-full border border-[#315377] px-3 py-1 text-xs text-[#9fc3ff]">
                      {check}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </section>

        <section className="mt-14 grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="rounded-md border border-[#173554] bg-[#071d33] p-6">
            <div className="flex items-center gap-3">
              <GraduationCap className="h-6 w-6 text-[#8eb7ff]" />
              <div>
                <p className="text-[10px] uppercase tracking-[0.2em] text-[#7890ad]">Learning Path</p>
                <h2 className="mt-1 font-display text-2xl font-bold text-[#d8e6ff]">Institutional Modules</h2>
              </div>
            </div>
            <div className="mt-7 grid gap-4">
              {educationModules.map((module) => (
                <div key={module.title} className="rounded-md bg-[#0b2036] p-5">
                  <div className="flex items-center justify-between gap-4">
                    <h3 className="font-display text-xl font-bold text-[#d8e6ff]">{module.title}</h3>
                    <span className="text-xs uppercase tracking-[0.14em] text-[#9fc3ff]">{module.minutes}</span>
                  </div>
                  <p className="mt-3 text-sm leading-6 text-[#8fa1bb]">{module.outcome}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-md border border-[#173554] bg-[#0b2036] p-6">
            <p className="text-[10px] uppercase tracking-[0.2em] text-[#7890ad]">Submission Readiness</p>
            <h2 className="mt-2 font-display text-2xl font-bold text-[#d8e6ff]">Broker Profile Checklist</h2>
            <div className="mt-7 space-y-4">
              {[
                "Public website, logo URL, and broker description are complete.",
                "Broker type matches the intended asset focus and market access.",
                "Regulatory language is reviewed before publishing to the directory.",
                "Operational contact can respond to institutional onboarding requests.",
              ].map((item) => (
                <div key={item} className="flex gap-3 border-t border-[#173554] pt-4">
                  <CheckCircle2 className="mt-1 h-5 w-5 flex-shrink-0 text-[#8eb7ff]" />
                  <p className="text-sm leading-6 text-[#b8c8df]">{item}</p>
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
