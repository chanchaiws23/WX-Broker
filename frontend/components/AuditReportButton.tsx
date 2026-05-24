"use client";

import { useState } from "react";
import { FileText, X } from "lucide-react";

type AuditReportButtonProps = {
  brokerName: string;
};

export default function AuditReportButton({ brokerName }: AuditReportButtonProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="mt-7 h-11 w-full rounded border border-[#7890ad] text-sm font-bold text-[#d8e6ff] transition hover:bg-[#40556f]"
      >
        View Full Audit Report
      </button>

      {open ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#041425]/80 px-4">
          <div className="w-full max-w-lg rounded-md border border-[#365a7c] bg-[#0d223a] p-6 shadow-2xl">
            <div className="flex items-start justify-between gap-6">
              <div>
                <div className="flex items-center gap-3 text-[#9fc3ff]">
                  <FileText className="h-5 w-5" />
                  <span className="text-[11px] font-bold uppercase tracking-[0.2em]">Mock Audit Report</span>
                </div>
                <h2 className="mt-4 font-display text-2xl font-bold text-[#d8e6ff]">{brokerName}</h2>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="text-[#8fa1bb] transition hover:text-white"
                aria-label="Close audit report"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <dl className="mt-6 grid gap-4 sm:grid-cols-2">
              {[
                ["KYC status", "Verified"],
                ["Liquidity review", "Pass"],
                ["Execution SLA", "12ms avg"],
                ["Risk score", "Low"],
              ].map(([label, value]) => (
                <div key={label} className="rounded bg-[#07182b] p-4">
                  <dt className="text-[10px] uppercase tracking-[0.18em] text-[#7890ad]">{label}</dt>
                  <dd className="mt-2 font-bold text-[#d8e6ff]">{value}</dd>
                </div>
              ))}
            </dl>

            <p className="mt-6 text-sm leading-6 text-[#9aaeca]">
              This is mock audit data for the full-stack test. It gives the UI a real interaction without changing the backend contract.
            </p>
          </div>
        </div>
      ) : null}
    </>
  );
}
