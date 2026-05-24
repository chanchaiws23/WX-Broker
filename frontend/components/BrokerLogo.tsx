"use client";

import { useEffect, useState } from "react";
import { Building2 } from "lucide-react";

type BrokerLogoProps = {
  name: string;
  logoUrl?: string;
  className?: string;
  imageClassName?: string;
};

export default function BrokerLogo({
  name,
  logoUrl,
  className = "",
  imageClassName = "",
}: BrokerLogoProps) {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setLoaded(false);
  }, [logoUrl]);

  const initials = name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className={`relative flex items-center justify-center overflow-hidden bg-slate-950 ${className}`}>
      {logoUrl ? (
        <img
          src={logoUrl}
          alt={`${name} logo`}
          className={`relative z-10 max-h-full max-w-full object-contain ${loaded ? "block" : "hidden"} ${imageClassName}`}
          onLoad={() => setLoaded(true)}
          onError={() => setLoaded(false)}
        />
      ) : null}
      <div className={`${loaded ? "hidden" : "flex"} absolute inset-0 items-center justify-center bg-slate-900 text-slate-500`}>
        {initials ? <span className="text-xl font-semibold">{initials}</span> : <Building2 className="h-5 w-5" />}
      </div>
    </div>
  );
}
