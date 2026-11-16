import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { useStudy } from "@/store/StudyContext";

const NAV_LINKS = [
  { label: "Home", to: "/" },
  { label: "Paths", to: "/skillup" },
  { label: "AI Studio", to: "/ai-tutor" },
  { label: "Practice", to: "/practice" },
  { label: "Notes", to: "/notes" },
];

export const TopNav: React.FC = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const { state } = useStudy();

  const isActive = (to: string) => {
    if (to === "/") return location.pathname === "/";
    if (to === "/ai-tutor") {
      return (
        location.pathname.startsWith("/ai-tutor") ||
        location.pathname.startsWith("/workspace")
      );
    }
    return location.pathname.startsWith(to);
  };

  return (
    <header className="sticky top-0 z-40 border-b border-[#1E2323] bg-black/95 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-8 px-4 py-3.5 sm:px-6">
        {/* Zone 1: Single-element Brand Wordmark */}
        <Link
          to="/"
          className="font-heading text-xl font-extrabold tracking-tight text-[#D6E3E4] whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F6FF81] rounded-sm"
        >
          Seed<span className="text-[#31CB53]">IQ</span>
        </Link>

        {/* Zone 2: 5 concise single-line nav links */}
        <nav
          aria-label="Primary navigation"
          className="hidden md:flex items-center gap-7"
        >
          {NAV_LINKS.map((item) => {
            const active = isActive(item.to);
            return (
              <Link
                key={item.to}
                to={item.to}
                className={`text-sm font-medium whitespace-nowrap shrink-0 transition-colors duration-150 pb-0.5 border-b-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F6FF81] ${
                  active
                    ? "text-[#F6FF81] border-[#F6FF81]"
                    : "text-[#94A3A5] border-transparent hover:text-[#D6E3E4]"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Zone 3: 1 primary action */}
        <div className="hidden md:flex items-center shrink-0">
          {state.profile.isSignedIn ? (
            <Link
              to="/profile"
              className="inline-flex items-center justify-center rounded-lg bg-[#D6E3E4] px-4 py-2 text-xs font-semibold text-black transition-colors duration-150 hover:bg-[#F6FF81] whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F6FF81]"
            >
              {state.profile.name}
            </Link>
          ) : (
            <Link
              to="/profile"
              className="inline-flex items-center justify-center rounded-lg bg-[#31CB53] px-4 py-2 text-xs font-semibold text-black transition-colors duration-150 hover:bg-[#29b347] whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F6FF81]"
            >
              Study Desk
            </Link>
          )}
        </div>

        {/* Mobile menu toggle */}
        <button
          type="button"
          onClick={() => setMobileOpen((prev) => !prev)}
          aria-label={mobileOpen ? "Close navigation menu" : "Open navigation menu"}
          aria-expanded={mobileOpen}
          className="md:hidden inline-flex h-10 w-10 items-center justify-center rounded-lg border border-[#1E2323] text-[#D6E3E4] hover:border-[#31CB53] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F6FF81]"
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileOpen && (
        <nav
          aria-label="Mobile navigation"
          className="md:hidden border-t border-[#1E2323] bg-black px-4 py-4 space-y-2"
        >
          {NAV_LINKS.map((item) => {
            const active = isActive(item.to);
            return (
              <Link
                key={item.to}
                to={item.to}
                onClick={() => setMobileOpen(false)}
                className={`block rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                  active
                    ? "bg-[#121616] text-[#F6FF81]"
                    : "text-[#D6E3E4] hover:bg-[#0D1010]"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
          <div className="pt-2 border-t border-[#1E2323]">
            <Link
              to="/profile"
              onClick={() => setMobileOpen(false)}
              className="block w-full rounded-lg bg-[#31CB53] px-4 py-2.5 text-center text-sm font-semibold text-black"
            >
              {state.profile.isSignedIn ? state.profile.name : "Study Desk & Profile"}
            </Link>
          </div>
        </nav>
      )}
    </header>
  );
};
