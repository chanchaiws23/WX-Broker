"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Bell, ChevronRight, LogIn, LogOut, UserCircle } from "lucide-react";
import { getCurrentUser, logoutUser, type User } from "@/lib/api";

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    let active = true;

    getCurrentUser()
      .then((currentUser) => {
        if (active) setUser(currentUser);
      })
      .catch(() => {
        if (active) setUser(null);
      });

    return () => {
      active = false;
    };
  }, [pathname]);

  useEffect(() => {
    const handlePointerDown = (event: PointerEvent) => {
      if (!menuRef.current?.contains(event.target as Node)) {
        setNotificationOpen(false);
        setProfileOpen(false);
      }
    };

    document.addEventListener("pointerdown", handlePointerDown);
    return () => document.removeEventListener("pointerdown", handlePointerDown);
  }, []);

  const handleLogout = async () => {
    await logoutUser().catch(() => undefined);
    setUser(null);
    setProfileOpen(false);
    router.push("/login");
    router.refresh();
  };

  const navLinks = [
    { label: "Brokers", href: "/" },
    { label: "Markets", href: "/markets" },
    { label: "Analysis", href: "/analysis" },
    { label: "Education", href: "/education" },
  ];

  return (
    <nav className="h-[68px] border-b border-[#17314f] bg-[#06182b]">
      <div className="mx-auto flex h-full max-w-7xl items-center justify-between px-8">
        <Link href="/" className="font-display text-xl font-bold text-[#b9d2ff]">
          Woxa
        </Link>

        <div className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => {
            const active = link.href === pathname;
            return (
              <Link
                key={link.label}
                href={link.href}
                className={`border-b py-2 text-sm transition-colors ${
                  active ? "border-[#91b8ff] text-[#cfe0ff]" : "border-transparent text-[#91a2bc] hover:text-[#cfe0ff]"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </div>

        <div ref={menuRef} className="relative flex items-center gap-4 text-[#b9d2ff]">
          <div className="relative">
            <button
              type="button"
              onClick={() => {
                setNotificationOpen((open) => !open);
                setProfileOpen(false);
              }}
              className="inline-flex h-8 w-8 items-center justify-center text-[#b9d2ff] transition hover:text-white"
              aria-label="Notifications"
              title="Notifications"
            >
              <Bell className="h-4 w-4" />
            </button>

            {notificationOpen ? (
              <div className="absolute right-0 top-10 z-50 w-80 rounded-md border border-[#2f5375] bg-[#06182b]/98 p-4 shadow-2xl shadow-black/40 ring-1 ring-[#8eb7ff]/10">
                <div className="flex items-center justify-between border-b border-[#173554] pb-3">
                  <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#9fc3ff]">Market Alerts</p>
                  <span className="rounded-full bg-[#173554] px-2 py-0.5 text-[10px] text-[#b8c8df]">Mock</span>
                </div>
                <div className="mt-3 space-y-3">
                  {[
                    ["Directory sync complete", "Broker records are ready for review."],
                    ["Liquidity desk update", "New institutional coverage can be wired to the API later."],
                  ].map(([title, body]) => (
                    <div key={title} className="rounded bg-[#0b2036] p-3">
                      <p className="text-sm font-semibold text-[#d8e6ff]">{title}</p>
                      <p className="mt-1 text-xs leading-5 text-[#8fa1bb]">{body}</p>
                    </div>
                  ))}
                </div>
              </div>
            ) : null}
          </div>

          <div className="relative">
            <button
              type="button"
              onClick={() => {
                setProfileOpen((open) => !open);
                setNotificationOpen(false);
              }}
              className="inline-flex h-8 w-8 items-center justify-center text-[#b9d2ff] transition hover:text-white"
              aria-label={user ? `Account menu for ${user.fullName}` : "Account menu"}
              title={user ? `Account menu for ${user.fullName}` : "Account menu"}
            >
              <UserCircle className="h-4 w-4" />
            </button>

            {profileOpen ? (
              <div className="absolute right-0 top-10 z-50 w-80 rounded-md border border-[#2f5375] bg-[#06182b]/98 p-4 shadow-2xl shadow-black/40 ring-1 ring-[#8eb7ff]/10">
                {user ? (
                  <>
                    <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#9fc3ff]">Account</p>
                    <div className="mt-4 border-b border-[#173554] pb-4">
                      <p className="font-semibold text-[#d8e6ff]">{user.fullName}</p>
                      <p className="mt-1 text-xs text-[#8fa1bb]">{user.email}</p>
                    </div>
                    <div className="mt-3 grid gap-1">
                      <Link
                        href="/create"
                        onClick={() => setProfileOpen(false)}
                        className="group flex items-center justify-between rounded px-3 py-3 text-sm text-[#cfe0ff] transition hover:bg-[#0d2741]"
                      >
                        <span>
                          <span className="block font-semibold">Submit broker profile</span>
                          <span className="mt-0.5 block text-[11px] text-[#7890ad]">Add a partner for review</span>
                        </span>
                        <ChevronRight className="h-4 w-4 text-[#7890ad] transition group-hover:translate-x-0.5 group-hover:text-[#9fc3ff]" />
                      </Link>
                      <button
                        type="button"
                        onClick={handleLogout}
                        className="flex items-center gap-3 rounded px-3 py-3 text-left text-sm font-semibold text-[#cfe0ff] transition hover:bg-[#0d2741]"
                      >
                        <LogOut className="h-4 w-4 text-[#7890ad]" />
                        Sign out
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#9fc3ff]">Account Access</p>
                    <p className="mt-3 text-sm leading-5 text-[#8fa1bb]">
                      Sign in to submit broker records and manage institutional review data.
                    </p>
                    <div className="mt-4 grid gap-2">
                      <Link
                        href="/login"
                        onClick={() => setProfileOpen(false)}
                        className="inline-flex h-10 items-center justify-center gap-2 rounded bg-[#8eb7ff] px-4 text-sm font-bold text-[#06182b]"
                      >
                        <LogIn className="h-4 w-4" />
                        Sign in
                      </Link>
                      <Link
                        href="/register"
                        onClick={() => setProfileOpen(false)}
                        className="rounded border border-[#315377] px-4 py-2 text-center text-sm font-semibold text-[#cfe0ff] transition hover:border-[#8eb7ff]/70"
                      >
                        Create account
                      </Link>
                    </div>
                  </>
                )}
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </nav>
  );
}
