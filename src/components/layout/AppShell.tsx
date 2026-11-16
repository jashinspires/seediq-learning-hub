import React from "react";
import { Link } from "react-router-dom";
import { TopNav } from "./TopNav";

interface AppShellProps {
  children: React.ReactNode;
  hideFooter?: boolean;
}

export const AppShell: React.FC<AppShellProps> = ({
  children,
  hideFooter = false,
}) => {
  return (
    <div className="min-h-screen flex flex-col bg-black text-[#D6E3E4]">
      <TopNav />
      <main className="flex-1">{children}</main>
      {!hideFooter && (
        <footer className="border-t border-[#1A1F1F] bg-black">
          <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-6 text-xs text-[#94A3A5] sm:flex-row sm:items-center sm:justify-between sm:px-6">
            <span>SeedIQ Personal Study Space</span>
            <div className="flex flex-wrap items-center gap-5">
              <Link to="/skillup" className="hover:text-[#D6E3E4] transition-colors">
                Paths
              </Link>
              <Link to="/ai-tutor" className="hover:text-[#D6E3E4] transition-colors">
                AI Studio
              </Link>
              <Link to="/practice" className="hover:text-[#D6E3E4] transition-colors">
                Practice
              </Link>
              <Link to="/notes" className="hover:text-[#D6E3E4] transition-colors">
                Notes
              </Link>
              <Link to="/auth" className="hover:text-[#F6FF81] transition-colors">
                Account
              </Link>
            </div>
          </div>
        </footer>
      )}
    </div>
  );
};
