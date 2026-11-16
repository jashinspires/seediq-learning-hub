import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Check, Cloud, Flame, LogIn, LogOut, RotateCcw } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import {
  buildActivityHeatmap,
  calculateGoalProgress,
  calculateStreak,
} from "@/lib/studyLogic";
import { useStudy } from "@/store/StudyContext";
import { useToast } from "@/hooks/use-toast";

const Profile: React.FC = () => {
  const {
    state,
    todayIso,
    authUser,
    syncStatus,
    updateProfile,
    signOutUser,
    resetWorkspace,
  } = useStudy();
  const { toast } = useToast();

  const [name, setName] = useState(state.profile.name);
  const [bio, setBio] = useState(state.profile.bio);
  const [dailyTargetMinutes, setDailyTargetMinutes] = useState(
    state.profile.dailyTargetMinutes
  );
  const [isResetting, setIsResetting] = useState(false);

  useEffect(() => {
    setName(state.profile.name);
    setBio(state.profile.bio);
    setDailyTargetMinutes(state.profile.dailyTargetMinutes);
  }, [
    state.profile.name,
    state.profile.bio,
    state.profile.dailyTargetMinutes,
  ]);

  const streak = calculateStreak(state.activityLog, todayIso);
  const heatmapWeeks = buildActivityHeatmap(state.activityLog, todayIso, 16);

  const completedMilestones = state.goals.reduce(
    (sum, g) => sum + g.milestones.filter((m) => m.completed).length,
    0
  );
  const totalSessions = Object.values(state.activityLog).reduce(
    (sum, v) => sum + v,
    0
  );

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    updateProfile({
      name: name.trim(),
      bio: bio.trim(),
      dailyTargetMinutes: Math.max(
        10,
        Math.min(240, dailyTargetMinutes || 45)
      ),
    });
    toast({
      title: "Profile updated",
      description: authUser
        ? "Saved and synced to your cloud study desk."
        : "Your local study desk preferences have been saved.",
    });
  };

  const handleSignOut = async () => {
    await signOutUser();
    toast({
      title: "Signed out",
      description: "Returned to local study desk mode.",
    });
  };

  const handleReset = async () => {
    setIsResetting(true);
    try {
      await resetWorkspace();
      toast({ title: "Workspace reset to starter study paths" });
    } finally {
      setIsResetting(false);
    }
  };

  return (
    <AppShell>
      <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 space-y-8">
        {/* Header Card (#D6E3E4 Cool Mist) */}
        <div className="rounded-xl bg-[#D6E3E4] p-6 text-black sm:p-8 flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-5">
            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-xl bg-black font-heading text-2xl font-extrabold text-[#F6FF81]">
              {state.profile.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <h1 className="font-heading text-2xl font-extrabold text-black sm:text-3xl">
                {state.profile.name}
              </h1>
              <p className="mt-0.5 flex flex-wrap items-center gap-1.5 text-xs font-medium text-[#2A3435]">
                <span>@{state.profile.handle}</span>
                <span aria-hidden="true">·</span>
                {authUser ? (
                  <span className="inline-flex items-center gap-1 text-[#175F27] font-semibold">
                    <Cloud className="h-3.5 w-3.5" />
                    {state.profile.email || authUser.email}
                    {syncStatus === "syncing" ? " (Syncing...)" : " (Cloud Synced)"}
                  </span>
                ) : (
                  <span>Local Study Desk</span>
                )}
              </p>
              <p className="mt-2 max-w-xl text-sm text-[#1E2526]">
                {state.profile.bio}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-3 shrink-0">
            {authUser ? (
              <button
                type="button"
                onClick={handleSignOut}
                className="inline-flex items-center gap-2 rounded-lg bg-black px-4 py-2.5 text-xs font-semibold text-[#D6E3E4] hover:bg-[#1E2525]"
              >
                <LogOut className="h-4 w-4" />
                Sign Out
              </button>
            ) : (
              <Link
                to="/auth"
                className="inline-flex items-center gap-2 rounded-lg bg-black px-4 py-2.5 text-xs font-semibold text-[#F6FF81] hover:bg-[#1E2525]"
              >
                <LogIn className="h-4 w-4" />
                Sign In with Google
              </Link>
            )}
          </div>
        </div>

        {/* Real Tracked Stats */}
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          <div className="rounded-xl border border-[#232929] bg-[#0B0D0D] p-5">
            <p className="text-xs text-[#94A3A5]">Current Streak</p>
            <p className="mt-2 flex items-center gap-2 font-heading text-3xl font-bold tabular-nums text-[#F6FF81]">
              {streak}
              <Flame className="h-5 w-5" />
            </p>
          </div>
          <div className="rounded-xl border border-[#232929] bg-[#0B0D0D] p-5">
            <p className="text-xs text-[#94A3A5]">Study Actions</p>
            <p className="mt-2 font-heading text-3xl font-bold tabular-nums text-[#D6E3E4]">
              {totalSessions}
            </p>
          </div>
          <div className="rounded-xl border border-[#232929] bg-[#0B0D0D] p-5">
            <p className="text-xs text-[#94A3A5]">Milestones Done</p>
            <p className="mt-2 font-heading text-3xl font-bold tabular-nums text-[#31CB53]">
              {completedMilestones}
            </p>
          </div>
          <div className="rounded-xl border border-[#232929] bg-[#0B0D0D] p-5">
            <p className="text-xs text-[#94A3A5]">Saved Notes</p>
            <p className="mt-2 font-heading text-3xl font-bold tabular-nums text-[#D6E3E4]">
              {state.notes.length}
            </p>
          </div>
        </div>

        {/* Deterministic Activity Heatmap */}
        <section className="rounded-xl border border-[#232929] bg-[#0B0D0D] p-6">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <h2 className="font-heading text-lg font-bold text-[#D6E3E4]">
                Study Activity (Last 16 Weeks)
              </h2>
              <p className="text-xs text-[#94A3A5]">
                Updates automatically whenever you complete milestones, take quizzes, or write notes.
              </p>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-[#94A3A5]">
              <span>Less</span>
              <span className="h-3 w-3 rounded-sm bg-[#161B1B]" />
              <span className="h-3 w-3 rounded-sm bg-[#144721]" />
              <span className="h-3 w-3 rounded-sm bg-[#218738]" />
              <span className="h-3 w-3 rounded-sm bg-[#31CB53]" />
              <span className="h-3 w-3 rounded-sm bg-[#F6FF81]" />
              <span>More</span>
            </div>
          </div>

          <div className="mt-5 overflow-x-auto">
            <div className="inline-flex gap-1.5">
              {heatmapWeeks.map((week, wIdx) => (
                <div key={wIdx} className="flex flex-col gap-1.5">
                  {week.map((cell) => {
                    const colorClass =
                      cell.level === 0
                        ? "bg-[#161B1B]"
                        : cell.level === 1
                        ? "bg-[#144721]"
                        : cell.level === 2
                        ? "bg-[#218738]"
                        : cell.level === 3
                        ? "bg-[#31CB53]"
                        : "bg-[#F6FF81]";
                    return (
                      <div
                        key={cell.date}
                        title={`${cell.date}: ${cell.count} study actions`}
                        className={`h-4 w-4 rounded-sm ${colorClass}`}
                      />
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Goal Progress Overview + Editable Preferences */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          <section className="lg:col-span-6 rounded-xl border border-[#232929] bg-[#0B0D0D] p-6">
            <h2 className="font-heading text-lg font-bold text-[#D6E3E4]">
              Goal Progress Summary
            </h2>
            <div className="mt-4 space-y-4">
              {state.goals.map((g) => {
                const p = calculateGoalProgress(g.milestones);
                return (
                  <div key={g.id}>
                    <div className="flex items-center justify-between text-xs">
                      <Link
                        to={`/skillup/${g.id}`}
                        className="font-medium text-[#D6E3E4] hover:text-[#31CB53]"
                      >
                        {g.title}
                      </Link>
                      <span className="font-mono tabular-nums text-[#94A3A5]">
                        {p.completed}/{p.total} ({p.percentage}%)
                      </span>
                    </div>
                    <div className="mt-1.5 h-2 w-full overflow-hidden rounded-full bg-[#1A2020]">
                      <div
                        className="h-full rounded-full bg-[#31CB53]"
                        style={{ width: `${p.percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          <section className="lg:col-span-6 rounded-xl border border-[#232929] bg-[#0B0D0D] p-6">
            <h2 className="font-heading text-lg font-bold text-[#D6E3E4]">
              Desk Preferences
            </h2>
            <form onSubmit={handleSaveProfile} className="mt-4 space-y-4">
              <div>
                <label
                  htmlFor="profile-name"
                  className="block text-xs font-medium text-[#94A3A5]"
                >
                  Display Name
                </label>
                <input
                  id="profile-name"
                  type="text"
                  maxLength={80}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="mt-1.5 w-full rounded-lg border border-[#232929] bg-black px-3.5 py-2 text-sm text-[#D6E3E4] focus:border-[#31CB53] focus:outline-none"
                />
              </div>

              <div>
                <label
                  htmlFor="profile-bio"
                  className="block text-xs font-medium text-[#94A3A5]"
                >
                  Learning Mission
                </label>
                <textarea
                  id="profile-bio"
                  rows={2}
                  maxLength={300}
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  className="mt-1.5 w-full rounded-lg border border-[#232929] bg-black px-3.5 py-2 text-sm text-[#D6E3E4] focus:border-[#31CB53] focus:outline-none"
                />
              </div>

              <div>
                <label
                  htmlFor="profile-target"
                  className="block text-xs font-medium text-[#94A3A5]"
                >
                  Daily Target (minutes)
                </label>
                <input
                  id="profile-target"
                  type="number"
                  min={10}
                  max={240}
                  value={dailyTargetMinutes}
                  onChange={(e) =>
                    setDailyTargetMinutes(Number(e.target.value) || 45)
                  }
                  className="mt-1.5 w-32 rounded-lg border border-[#232929] bg-black px-3.5 py-2 text-sm font-mono tabular-nums text-[#D6E3E4] focus:border-[#31CB53] focus:outline-none"
                />
              </div>

              <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                <button
                  type="submit"
                  className="inline-flex items-center gap-1.5 rounded-lg bg-[#31CB53] px-5 py-2.5 text-xs font-semibold text-black hover:bg-[#29b347]"
                >
                  <Check className="h-3.5 w-3.5" />
                  Save Preferences
                </button>

                <button
                  type="button"
                  disabled={isResetting}
                  onClick={handleReset}
                  className="inline-flex items-center gap-1.5 text-xs text-[#94A3A5] hover:text-[#F6FF81] disabled:opacity-50"
                >
                  <RotateCcw className="h-3.5 w-3.5" />
                  {isResetting ? "Resetting..." : "Reset Starter Paths"}
                </button>
              </div>
            </form>
          </section>
        </div>
      </div>
    </AppShell>
  );
};

export default Profile;
