import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowRight, CheckCircle2, LogOut } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { BauhausComposition } from "@/components/visuals/BauhausComposition";
import { useStudy } from "@/store/StudyContext";
import { useToast } from "@/hooks/use-toast";

const GoogleMark: React.FC = () => (
  <svg viewBox="0 0 24 24" className="h-4 w-4 shrink-0" aria-hidden="true">
    <path
      fill="currentColor"
      d="M21.8 12.23c0-.71-.06-1.4-.18-2.06H12v3.9h5.49a4.7 4.7 0 0 1-2.04 3.08v2.56h3.3c1.93-1.78 3.05-4.4 3.05-7.48z"
    />
    <path
      fill="currentColor"
      d="M12 22c2.76 0 5.07-.91 6.76-2.47l-3.3-2.56c-.91.61-2.08.98-3.46.98-2.66 0-4.91-1.8-5.72-4.21H2.87v2.64A10 10 0 0 0 12 22z"
    />
    <path
      fill="currentColor"
      d="M6.28 13.74A6 6 0 0 1 5.97 12c0-.6.11-1.19.31-1.74V7.62H2.87A10 10 0 0 0 2 12c0 1.61.39 3.14 1.07 4.38l3.21-2.64z"
    />
    <path
      fill="currentColor"
      d="M12 6.05c1.5 0 2.85.52 3.91 1.53l2.93-2.93C17.06 2.99 14.75 2 12 2a10 10 0 0 0-9.13 5.62l3.41 2.64c.81-2.41 3.06-4.21 5.72-4.21z"
    />
  </svg>
);

const Auth: React.FC = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const { authUser, state, signInWithGoogle, signOutUser } = useStudy();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleGoogleSignIn = async () => {
    setIsSubmitting(true);
    setError("");
    try {
      await signInWithGoogle();
      toast({
        title: "Signed in with Google",
        description: "Your study desk is now synced to Cloud Firestore.",
      });
      navigate("/");
    } catch (err: unknown) {
      const code =
        typeof err === "object" && err !== null && "code" in err
          ? String((err as { code?: unknown }).code)
          : "";
      if (code === "auth/popup-closed-by-user") {
        setError("Sign-in popup was closed before completing.");
      } else if (code === "auth/popup-blocked") {
        setError(
          "Your browser blocked the Google sign-in popup. Please allow popups for this site and try again."
        );
      } else {
        setError(
          err instanceof Error
            ? err.message
            : "Could not complete Google sign-in. Please try again."
        );
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSignOut = async () => {
    setIsSubmitting(true);
    setError("");
    try {
      await signOutUser();
      toast({
        title: "Signed out",
        description: "Switched back to your local study desk.",
      });
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Could not sign out.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AppShell>
      <div className="mx-auto grid max-w-5xl grid-cols-1 items-center gap-12 px-4 py-12 sm:px-6 lg:grid-cols-12">
        <div className="lg:col-span-6 rounded-xl bg-[#D6E3E4] p-7 text-black sm:p-9">
          {authUser ? (
            <div className="space-y-5">
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#175F27]">
                <CheckCircle2 className="h-4 w-4" />
                <span>Cloud Desk Active</span>
              </div>
              <h1 className="font-heading text-2xl font-extrabold text-black">
                Signed in as {state.profile.name}
              </h1>
              <p className="text-sm text-[#2A3435]">
                {authUser.email} — Your learning goals, milestones, notes, flashcards, and AI study threads sync automatically.
              </p>

              {error && (
                <p role="alert" className="text-xs font-semibold text-red-700">
                  {error}
                </p>
              )}

              <div className="flex flex-wrap gap-3 pt-2">
                <Link
                  to="/"
                  className="inline-flex items-center gap-2 rounded-lg bg-[#31CB53] px-5 py-2.5 text-sm font-bold text-black hover:bg-[#29b347]"
                >
                  Open Study Desk
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <button
                  type="button"
                  disabled={isSubmitting}
                  onClick={handleSignOut}
                  className="inline-flex items-center gap-2 rounded-lg bg-black px-4 py-2.5 text-xs font-semibold text-[#D6E3E4] hover:bg-[#1E2525] disabled:opacity-50"
                >
                  <LogOut className="h-4 w-4" />
                  Sign Out
                </button>
              </div>
            </div>
          ) : (
            <div>
              <h1 className="font-heading text-2xl font-extrabold text-black">
                Sync your SeedIQ desk
              </h1>
              <p className="mt-2 text-sm leading-relaxed text-[#2A3435]">
                Sign in with Google to save your learning goals, milestone progress, personal notes, quiz history, and study streaks in Cloud Firestore across devices.
              </p>

              <div className="mt-6 space-y-3 border-t border-black/10 pt-5 text-xs text-[#242C2D]">
                <p>
                  <span className="font-semibold text-black">Instant desk continuity:</span>{" "}
                  Any goals or notes you already started locally come along when you first connect.
                </p>
                <p>
                  <span className="font-semibold text-black">Private by default:</span>{" "}
                  Your notes, study sessions, and profile are accessible only to your signed-in account.
                </p>
              </div>

              {error && (
                <p
                  role="alert"
                  className="mt-4 rounded-lg border border-red-700/30 bg-red-500/10 px-3 py-2 text-xs font-semibold text-red-800"
                >
                  {error}
                </p>
              )}

              <button
                type="button"
                disabled={isSubmitting}
                onClick={handleGoogleSignIn}
                className="mt-6 flex w-full items-center justify-center gap-2.5 rounded-lg bg-black py-3.5 text-sm font-bold text-[#F6FF81] transition-colors hover:bg-[#181D1D] disabled:opacity-50"
              >
                <GoogleMark />
                {isSubmitting ? "Connecting Google..." : "Continue with Google"}
              </button>

              <div className="mt-4 text-center">
                <Link
                  to="/"
                  className="inline-flex items-center gap-1 text-xs font-semibold text-[#2A3435] underline underline-offset-4 hover:text-black"
                >
                  Keep studying locally without an account
                  <ArrowRight className="h-3 w-3" />
                </Link>
              </div>
            </div>
          )}
        </div>

        <div className="lg:col-span-6 flex flex-col items-center text-center lg:items-start lg:text-left">
          <BauhausComposition compact />
          <h2 className="mt-6 font-heading text-2xl font-bold text-[#D6E3E4]">
            Zero lock-in. Your pace, your notes.
          </h2>
          <p className="mt-2 max-w-md text-sm text-[#94A3A5]">
            Open SeedIQ anytime as a private desk in your browser, or link your Google account to keep every milestone and flashcard backed up in the cloud.
          </p>
        </div>
      </div>
    </AppShell>
  );
};

export default Auth;
