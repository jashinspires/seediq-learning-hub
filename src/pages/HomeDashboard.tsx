import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  BookOpen,
  Brain,
  Check,
  CheckCircle2,
  Circle,
  Edit3,
  FileText,
  Flame,
  Target,
} from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { BauhausComposition } from "@/components/visuals/BauhausComposition";
import { calculateGoalProgress, calculateStreak } from "@/lib/studyLogic";
import { useStudy } from "@/store/StudyContext";

const HomeDashboard: React.FC = () => {
  const { state, todayIso, toggleDailyFocus, updateProfile } = useStudy();
  const [editingFocus, setEditingFocus] = useState(false);
  const [focusDraft, setFocusDraft] = useState(state.profile.dailyFocusTask);

  const streak = calculateStreak(state.activityLog, todayIso);
  const activeGoals = state.goals.filter((g) => g.isActive);
  const displayGoals = activeGoals.length > 0 ? activeGoals : state.goals.slice(0, 3);

  const totalMilestonesCompleted = state.goals.reduce(
    (sum, g) => sum + g.milestones.filter((m) => m.completed).length,
    0
  );
  const totalMilestones = state.goals.reduce(
    (sum, g) => sum + g.milestones.length,
    0
  );

  const latestThread = state.threads[0];
  const latestNote = state.notes[0];
  const primaryGoal = displayGoals[0];

  const handleSaveFocus = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = focusDraft.trim();
    if (!trimmed) return;
    updateProfile({ dailyFocusTask: trimmed });
    setEditingFocus(false);
  };

  return (
    <AppShell>
      {/* Personal Study Desk Hero */}
      <section className="border-b border-[#1A1F1F]">
        <div className="mx-auto grid max-w-6xl grid-cols-1 items-center gap-12 px-4 py-12 sm:px-6 lg:grid-cols-12 lg:py-16">
          <div className="lg:col-span-7 space-y-6">
            <p className="text-sm font-medium text-[#94A3A5]">
              Welcome back, <span className="text-[#D6E3E4]">{state.profile.name}</span>
              <span aria-hidden="true"> · </span>
              <span className="font-mono tabular-nums">{todayIso}</span>
            </p>

            <h1 className="headline-balance font-heading text-4xl font-extrabold leading-[1.08] tracking-tight text-[#D6E3E4] sm:text-5xl lg:text-[3.5rem]">
              Your personal <span className="text-[#31CB53]">study</span> space for{" "}
              <span className="text-[#F6FF81]">deep</span> focus
            </h1>

            <p className="max-w-xl text-base leading-relaxed text-[#94A3A5] sm:text-lg">
              Set learning goals, work through curated free paths, ask your AI study partner when you hit a wall, and lock concepts in with quick practice and notes.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <Link
                to={primaryGoal ? `/skillup/${primaryGoal.id}` : "/skillup"}
                className="inline-flex items-center gap-2 rounded-lg bg-[#31CB53] px-6 py-3 text-sm font-semibold text-black transition-colors duration-150 hover:bg-[#29b347] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F6FF81] whitespace-nowrap"
              >
                Resume Studying
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                to="/ai-tutor"
                className="inline-flex items-center gap-2 rounded-lg border border-[#2A3131] bg-black px-5 py-3 text-sm font-medium text-[#D6E3E4] transition-colors duration-150 hover:border-[#F6FF81] hover:text-[#F6FF81] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F6FF81] whitespace-nowrap"
              >
                Open AI Studio
              </Link>
            </div>
          </div>

          <div className="lg:col-span-5 flex justify-center lg:justify-end">
            <BauhausComposition />
          </div>
        </div>
      </section>

      {/* Full-Width Daily Focus & Metrics Strip */}
      <section className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
          {/* Today's Focus */}
          <div className="lg:col-span-6 rounded-xl border border-[#232929] bg-[#0B0D0D] p-5 flex flex-col justify-between">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#F6FF81]">
                <Target className="h-4 w-4" />
                <span>Today&apos;s Focus</span>
              </div>
              {!editingFocus && (
                <button
                  type="button"
                  onClick={() => {
                    setFocusDraft(state.profile.dailyFocusTask);
                    setEditingFocus(true);
                  }}
                  aria-label="Edit today's focus task"
                  className="inline-flex items-center gap-1.5 text-xs text-[#94A3A5] hover:text-[#D6E3E4] transition-colors"
                >
                  <Edit3 className="h-3.5 w-3.5" />
                  Edit
                </button>
              )}
            </div>

            {editingFocus ? (
              <form onSubmit={handleSaveFocus} className="mt-3 flex gap-2">
                <input
                  type="text"
                  value={focusDraft}
                  onChange={(e) => setFocusDraft(e.target.value)}
                  aria-label="Today's focus task"
                  placeholder="What is your single focus today?"
                  className="flex-1 rounded-lg border border-[#2A3131] bg-black px-3 py-2 text-sm text-[#D6E3E4] focus:border-[#F6FF81] focus:outline-none"
                />
                <button
                  type="submit"
                  className="rounded-lg bg-[#31CB53] px-4 py-2 text-xs font-semibold text-black hover:bg-[#29b347]"
                >
                  Save
                </button>
                <button
                  type="button"
                  onClick={() => setEditingFocus(false)}
                  className="rounded-lg border border-[#2A3131] px-3 py-2 text-xs text-[#94A3A5] hover:text-[#D6E3E4]"
                >
                  Cancel
                </button>
              </form>
            ) : (
              <div className="mt-3 flex items-start gap-3">
                <button
                  type="button"
                  onClick={toggleDailyFocus}
                  aria-label={
                    state.profile.dailyFocusCompleted
                      ? "Mark daily focus incomplete"
                      : "Mark daily focus complete"
                  }
                  className="mt-0.5 shrink-0 text-[#31CB53] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F6FF81] rounded"
                >
                  {state.profile.dailyFocusCompleted ? (
                    <CheckCircle2 className="h-5 w-5 text-[#31CB53]" />
                  ) : (
                    <Circle className="h-5 w-5 text-[#94A3A5] hover:text-[#F6FF81]" />
                  )}
                </button>
                <p
                  className={`text-base font-medium leading-snug ${
                    state.profile.dailyFocusCompleted
                      ? "line-through text-[#94A3A5]"
                      : "text-[#D6E3E4]"
                  }`}
                >
                  {state.profile.dailyFocusTask}
                </p>
              </div>
            )}
          </div>

          {/* 3 Compact Metric Cells */}
          <div className="lg:col-span-2 rounded-xl border border-[#232929] bg-[#0B0D0D] p-5 flex flex-col justify-between">
            <div className="flex items-center justify-between text-xs text-[#94A3A5]">
              <span>Study Streak</span>
              <Flame className="h-4 w-4 text-[#F6FF81]" />
            </div>
            <div className="mt-3">
              <span className="font-heading text-3xl font-bold tabular-nums text-[#F6FF81]">
                {streak}
              </span>
              <span className="ml-1.5 text-xs text-[#94A3A5]">
                {streak === 1 ? "day" : "days"}
              </span>
            </div>
          </div>

          <div className="lg:col-span-2 rounded-xl border border-[#232929] bg-[#0B0D0D] p-5 flex flex-col justify-between">
            <div className="flex items-center justify-between text-xs text-[#94A3A5]">
              <span>Milestones</span>
              <Check className="h-4 w-4 text-[#31CB53]" />
            </div>
            <div className="mt-3">
              <span className="font-heading text-3xl font-bold tabular-nums text-[#D6E3E4]">
                {totalMilestonesCompleted}
              </span>
              <span className="ml-1 text-xs tabular-nums text-[#94A3A5]">
                / {totalMilestones}
              </span>
            </div>
          </div>

          <div className="lg:col-span-2 rounded-xl border border-[#232929] bg-[#0B0D0D] p-5 flex flex-col justify-between">
            <div className="flex items-center justify-between text-xs text-[#94A3A5]">
              <span>Notes &amp; Quizzes</span>
              <FileText className="h-4 w-4 text-[#D6E3E4]" />
            </div>
            <div className="mt-3">
              <span className="font-heading text-3xl font-bold tabular-nums text-[#D6E3E4]">
                {state.notes.length}
              </span>
              <span className="ml-1.5 text-xs text-[#94A3A5] tabular-nums">
                notes · {state.quizHistory.length} quizzes
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Active Learning Goals — High-Contrast Cool Mist (#D6E3E4) Cards */}
      <section className="mx-auto max-w-6xl px-4 py-6 sm:px-6">
        <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 className="font-heading text-2xl font-bold text-[#D6E3E4]">
              Active Learning Goals
            </h2>
            <p className="mt-1 text-sm text-[#94A3A5]">
              Curated free paths pinned to your desk. Check off milestones as you learn.
            </p>
          </div>
          <Link
            to="/skillup"
            className="text-sm font-medium text-[#31CB53] hover:text-[#F6FF81] transition-colors whitespace-nowrap"
          >
            All paths &amp; custom goals →
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
          {displayGoals.map((goal) => {
            const progress = calculateGoalProgress(goal.milestones);
            const nextMilestone = goal.milestones.find((m) => !m.completed);

            return (
              <div
                key={goal.id}
                className="flex flex-col justify-between rounded-xl bg-[#D6E3E4] p-6 text-black transition-transform duration-150 hover:-translate-y-0.5"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 text-xs font-medium text-[#2A3435]">
                    <span>{goal.category}</span>
                    <span className="font-mono tabular-nums">
                      {progress.completed}/{progress.total} done
                    </span>
                  </div>

                  <h3 className="mt-2 font-heading text-xl font-bold text-black">
                    {goal.title}
                  </h3>
                  <p className="mt-2 text-sm text-[#242C2D] line-clamp-2">
                    {goal.description}
                  </p>

                  {/* Emerald progress bar */}
                  <div className="mt-5">
                    <div className="mb-1.5 flex items-center justify-between text-xs font-semibold text-black">
                      <span>Progress</span>
                      <span className="font-mono tabular-nums">
                        {progress.percentage}%
                      </span>
                    </div>
                    <div className="h-2 w-full overflow-hidden rounded-full bg-black/15">
                      <div
                        className="h-full rounded-full bg-[#31CB53] transition-all duration-200"
                        style={{ width: `${progress.percentage}%` }}
                      />
                    </div>
                  </div>

                  {nextMilestone && (
                    <p className="mt-4 text-xs text-[#242C2D]">
                      <span className="font-semibold text-black">Next:</span>{" "}
                      {nextMilestone.title}
                    </p>
                  )}
                </div>

                <div className="mt-6 flex items-center justify-between gap-3 pt-4 border-t border-black/10">
                  <Link
                    to={`/skillup/${goal.id}`}
                    className="inline-flex items-center gap-1.5 rounded-lg bg-black px-4 py-2 text-xs font-semibold text-[#D6E3E4] transition-colors hover:bg-[#1A2020] whitespace-nowrap"
                  >
                    Open Path
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                  <Link
                    to={`/practice?topic=${goal.id}`}
                    className="text-xs font-semibold text-black underline underline-offset-4 hover:text-[#175F27] whitespace-nowrap"
                  >
                    Quick Quiz
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Quick Resume Strip: AI Studio + Notebook + Self-Testing */}
      <section className="mx-auto max-w-6xl px-4 py-8 pb-14 sm:px-6">
        <h2 className="mb-5 font-heading text-xl font-bold text-[#D6E3E4]">
          Quick Resume
        </h2>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <Link
            to="/ai-tutor"
            className="group rounded-xl border border-[#232929] bg-[#0B0D0D] p-5 transition-colors hover:border-[#31CB53]"
          >
            <div className="flex items-center justify-between">
              <Brain className="h-5 w-5 text-[#31CB53]" />
              <ArrowRight className="h-4 w-4 text-[#94A3A5] transition-transform group-hover:translate-x-0.5 group-hover:text-[#31CB53]" />
            </div>
            <h3 className="mt-4 font-heading text-base font-bold text-[#D6E3E4]">
              AI Study Partner
            </h3>
            <p className="mt-1 text-sm text-[#94A3A5] truncate">
              {latestThread
                ? `Resume: ${latestThread.title}`
                : "Start a guided study session"}
            </p>
          </Link>

          <Link
            to="/practice"
            className="group rounded-xl border border-[#232929] bg-[#0B0D0D] p-5 transition-colors hover:border-[#F6FF81]"
          >
            <div className="flex items-center justify-between">
              <BookOpen className="h-5 w-5 text-[#F6FF81]" />
              <ArrowRight className="h-4 w-4 text-[#94A3A5] transition-transform group-hover:translate-x-0.5 group-hover:text-[#F6FF81]" />
            </div>
            <h3 className="mt-4 font-heading text-base font-bold text-[#D6E3E4]">
              Active Self-Testing
            </h3>
            <p className="mt-1 text-sm text-[#94A3A5]">
              {state.flashcards.filter((c) => !c.mastered).length} flashcards to review · Instant quizzes
            </p>
          </Link>

          <Link
            to="/notes"
            className="group rounded-xl border border-[#232929] bg-[#0B0D0D] p-5 transition-colors hover:border-[#D6E3E4]"
          >
            <div className="flex items-center justify-between">
              <FileText className="h-5 w-5 text-[#D6E3E4]" />
              <ArrowRight className="h-4 w-4 text-[#94A3A5] transition-transform group-hover:translate-x-0.5 group-hover:text-[#D6E3E4]" />
            </div>
            <h3 className="mt-4 font-heading text-base font-bold text-[#D6E3E4]">
              Personal Notebook
            </h3>
            <p className="mt-1 text-sm text-[#94A3A5] truncate">
              {latestNote
                ? `Latest: ${latestNote.title}`
                : "Jot down your first study takeaway"}
            </p>
          </Link>
        </div>
      </section>
    </AppShell>
  );
};

export default HomeDashboard;
