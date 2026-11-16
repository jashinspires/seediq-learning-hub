import React from "react";
import { Link } from "react-router-dom";
import { AppShell } from "@/components/layout/AppShell";

const NotFound: React.FC = () => {
  return (
    <AppShell>
      <div className="mx-auto flex max-w-3xl flex-col items-center justify-center px-4 py-24 text-center sm:px-6">
        <span className="font-mono text-6xl font-extrabold text-[#F6FF81] tabular-nums">
          404
        </span>
        <h1 className="mt-4 font-heading text-3xl font-bold text-[#D6E3E4]">
          This study page doesn&apos;t exist
        </h1>
        <p className="mt-2 max-w-md text-sm text-[#94A3A5]">
          Head back to your personal study desk or open one of your learning paths.
        </p>
        <div className="mt-6 flex gap-3">
          <Link
            to="/"
            className="rounded-lg bg-[#31CB53] px-5 py-2.5 text-sm font-semibold text-black hover:bg-[#29b347]"
          >
            Back to Desk
          </Link>
          <Link
            to="/skillup"
            className="rounded-lg border border-[#232929] px-5 py-2.5 text-sm font-medium text-[#D6E3E4] hover:border-[#D6E3E4]"
          >
            Browse Paths
          </Link>
        </div>
      </div>
    </AppShell>
  );
};

export default NotFound;
