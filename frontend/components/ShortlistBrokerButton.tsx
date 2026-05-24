"use client";

import { useEffect, useState } from "react";
import { Bookmark, BookmarkCheck } from "lucide-react";

type ShortlistBrokerButtonProps = {
  broker: {
    slug: string;
    name: string;
    brokerType: string;
  };
};

const STORAGE_KEY = "woxa.shortlistedBrokers";

type ShortlistedBroker = {
  slug: string;
  name: string;
  brokerType: string;
};

function readShortlist(): ShortlistedBroker[] {
  try {
    return JSON.parse(window.localStorage.getItem(STORAGE_KEY) || "[]");
  } catch {
    return [];
  }
}

export default function ShortlistBrokerButton({ broker }: ShortlistBrokerButtonProps) {
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setSaved(readShortlist().some((item) => item.slug === broker.slug));
  }, [broker.slug]);

  const toggleSaved = () => {
    const current = readShortlist();
    const exists = current.some((item) => item.slug === broker.slug);
    const next = exists
      ? current.filter((item) => item.slug !== broker.slug)
      : [{ slug: broker.slug, name: broker.name, brokerType: broker.brokerType }, ...current].slice(0, 8);

    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    setSaved(!exists);
  };

  return (
    <button
      type="button"
      onClick={toggleSaved}
      className="inline-flex h-12 items-center gap-2 rounded bg-[#102f4f]/85 px-6 text-sm font-bold text-[#cfe0ff] transition hover:bg-[#173c64]"
      aria-pressed={saved}
    >
      {saved ? <BookmarkCheck className="h-4 w-4" /> : <Bookmark className="h-4 w-4" />}
      {saved ? "Saved" : "Shortlist"}
    </button>
  );
}
