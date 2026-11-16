import React, { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  Brain,
  CheckCircle2,
  Circle,
  ExternalLink,
  FileText,
  Pin,
  Plus,
  Search,
  Trash2,
  X,
} from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { calculateGoalProgress, filterGoals } from "@/lib/studyLogic";
import type { GoalCategory } from "@/lib/studyTypes";
import { useStudy } from "@/store/StudyContext";
import { useToast } from "@/hooks/use-toast";

const CATEGORIES: Array<"All" | GoalCategory> = [
  "All",
  "Computer Science",
  "Web Engineering",
  "AI & Math",
  "Languages",
  "System Design",
  "Custom",
];

const SkillUp: React.FC = () => {
  const { goalId } = useParams<{ goalId?: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const {
    state,
    toggleMilestone,
    toggleGoalActive,
    addCustomGoal,
    deleteGoal,
    createNote,
    createThread,
  } = useStudy();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [showCreateModal, setShowCreateModal] = useState(false);

  // Create Goal form state
  const [newTitle, setNewTitle] = useState("");
  const [newCategory, setNewCategory] = useState<GoalCategory>("Custom");
  const [newDescription, setNewDescription] = useState("");
  const [newHours, setNewHours] = useState(5);
  const [newMilestonesText, setNewMilestonesText] = useState(
    "Core concepts & mental model\nGuided exercises & examples\nMini project & self-test"
  );
  const [newResourceUrl, setNewResourceUrl] = useState("");
  const [formError, setFormError] = useState("");

  // Quick note pad inside focused goal view
  const [quickNoteTitle, setQuickNoteTitle] = useState("");
  const [quickNoteBody, setQuickNoteBody] = useState("");

  const activeGoal = goalId
    ? state.goals.find((g) => g.id === goalId)
    : undefined;

  const filteredGoals = filterGoals(state.goals, searchQuery, selectedCategory);

  const handleCreateGoal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) {
      setFormError("Please enter a goal title.");
      return;
    }
    const milestones = newMilestonesText
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean);

    const created = addCustomGoal({
      title: newTitle,
      category: newCategory,
      description: newDescription,
      weeklyHoursTarget: newHours,
      milestoneTitles: milestones,
      resourceUrl: newResourceUrl,
    });

    setShowCreateModal(false);
    setNewTitle("");
    setNewDescription("");
    setNewResourceUrl("");
    setFormError("");
    toast({
      title: "Study goal created",
      description: `"${created.title}" is now on your desk.`,
    });
    navigate(`/skillup/${created.id}`);
  };

  const handleAskAiAboutGoal = (title: string, id: string) => {
    createThread({
      title: `${title} Study Help`,
      goalId: id,
      mode: "explain",
    });
    navigate("/ai-tutor");
  };

  const handleSaveQuickNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeGoal) return;
    if (!quickNoteBody.trim()) return;
    createNote({
      title: quickNoteTitle.trim() || `${activeGoal.title} Note`,
      content: quickNoteBody,
      goalId: activeGoal.id,
      tags: [activeGoal.category.toLowerCase()],
    });
    setQuickNoteTitle("");
    setQuickNoteBody("");
    toast({
      title: "Saved to Notebook",
      description: `Added note under ${activeGoal.title}.`,
    });
  };

  // Focused Goal Study Workspace View
  if (goalId) {
    if (!activeGoal) {
      return (
        <AppShell>
          <div className="mx-auto max-w-4xl px-4 py-16 text-center sm:px-6">
            <h1 className="font-heading text-2xl font-bold text-[#D6E3E4]">
              Study path not found
            </h1>
            <p className="mt-2 text-sm text-[#94A3A5]">
              This goal may have been deleted or moved.
            </p>
            <Link
              to="/skillup"
              className="mt-6 inline-flex items-center gap-2 rounded-lg bg-[#31CB53] px-5 py-2.5 text-sm font-semibold text-black"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Study Paths
            </Link>
          </div>
        </AppShell>
      );
    }

    const progress = calculateGoalProgress(activeGoal.milestones);
    const goalNotes = state.notes.filter((n) => n.goalId === activeGoal.id);

    return (
      <AppShell>
        <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
          <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
            <Link
              to="/skillup"
              className="inline-flex items-center gap-2 text-sm text-[#94A3A5] hover:text-[#D6E3E4] transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              All Study Paths
            </Link>

            <div className="flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={() => toggleGoalActive(activeGoal.id)}
                className={`inline-flex items-center gap-1.5 rounded-lg border px-3.5 py-2 text-xs font-medium transition-colors ${
                  activeGoal.isActive
                    ? "border-[#F6FF81] text-[#F6FF81] bg-[#14160A]"
                    : "border-[#232929] text-[#94A3A5] hover:text-[#D6E3E4]"
                }`}
              >
                <Pin className="h-3.5 w-3.5" />
                {activeGoal.isActive ? "Pinned to Home" : "Pin to Home"}
              </button>

              <button
                type="button"
                onClick={() => handleAskAiAboutGoal(activeGoal.title, activeGoal.id)}
                className="inline-flex items-center gap-1.5 rounded-lg bg-[#31CB53] px-4 py-2 text-xs font-semibold text-black hover:bg-[#29b347]"
              >
                <Brain className="h-3.5 w-3.5" />
                Ask AI Partner
              </button>

              <Link
                to={`/practice?topic=${activeGoal.id}`}
                className="inline-flex items-center gap-1.5 rounded-lg bg-[#D6E3E4] px-4 py-2 text-xs font-semibold text-black hover:bg-[#F6FF81]"
              >
                Test Yourself
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>

          {/* Goal Header Summary */}
          <div className="rounded-xl bg-[#D6E3E4] p-6 text-black sm:p-8">
            <div className="flex flex-wrap items-center justify-between gap-3 text-xs font-medium text-[#2A3435]">
              <span>
                {activeGoal.category}
                <span aria-hidden="true"> · </span>
                Target {activeGoal.weeklyHoursTarget} hrs/week
              </span>
              <span className="font-mono tabular-nums">
                {progress.completed} of {progress.total} milestones ·{" "}
                {progress.remainingMinutes} min remaining
              </span>
            </div>

            <h1 className="mt-2 font-heading text-3xl font-extrabold text-black sm:text-4xl">
              {activeGoal.title}
            </h1>
            <p className="mt-2 max-w-2xl text-sm text-[#1E2526] sm:text-base">
              {activeGoal.description}
            </p>

            <div className="mt-6">
              <div className="mb-1.5 flex items-center justify-between text-xs font-semibold text-black">
                <span>Path Completion</span>
                <span className="font-mono tabular-nums">{progress.percentage}%</span>
              </div>
              <div className="h-2.5 w-full overflow-hidden rounded-full bg-black/15">
                <div
                  className="h-full rounded-full bg-[#31CB53] transition-all duration-200"
                  style={{ width: `${progress.percentage}%` }}
                />
              </div>
            </div>
          </div>

          {/* Two-Column Study Desk: Milestones + Side Notebook */}
          <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-12">
            {/* Milestones & Free Resources */}
            <div className="lg:col-span-7 space-y-4">
              <h2 className="font-heading text-xl font-bold text-[#D6E3E4]">
                Milestones &amp; Curated Free Resources
              </h2>

              {activeGoal.milestones.map((milestone, idx) => (
                <div
                  key={milestone.id}
                  className={`rounded-xl border p-5 transition-colors ${
                    milestone.completed
                      ? "border-[#31CB53]/40 bg-[#0A110C]"
                      : "border-[#232929] bg-[#0B0D0D]"
                  }`}
                >
                  <div className="flex items-start gap-3.5">
                    <button
                      type="button"
                      onClick={() => toggleMilestone(activeGoal.id, milestone.id)}
                      aria-label={`Toggle milestone ${milestone.title}`}
                      className="mt-0.5 shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F6FF81] rounded"
                    >
                      {milestone.completed ? (
                        <CheckCircle2 className="h-5 w-5 text-[#31CB53]" />
                      ) : (
                        <Circle className="h-5 w-5 text-[#94A3A5] hover:text-[#F6FF81]" />
                      )}
                    </button>

                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <h3 className="font-heading text-base font-bold text-[#D6E3E4]">
                          {String(idx + 1).padStart(2, "0")}. {milestone.title}
                        </h3>
                        <span className="font-mono text-xs tabular-nums text-[#94A3A5]">
                          {milestone.completed ? "Done · " : ""}
                          {milestone.estimatedMinutes} min
                        </span>
                      </div>

                      <p className="mt-1 text-sm text-[#94A3A5]">
                        {milestone.summary}
                      </p>

                      {milestone.resources.length > 0 && (
                        <div className="mt-4 divide-y divide-[#1D2222] border-t border-[#1D2222] pt-2">
                          {milestone.resources.map((res) => (
                            <a
                              key={res.id}
                              href={res.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center justify-between gap-3 rounded-lg px-2 py-2.5 text-sm transition-colors hover:bg-[#121616]"
                            >
                              <div className="min-w-0">
                                <p className="truncate font-medium text-[#D6E3E4]">
                                  {res.title}
                                </p>
                                <p className="text-xs text-[#94A3A5]">
                                  {res.provider}
                                  <span aria-hidden="true"> · </span>
                                  {res.kind}
                                  <span aria-hidden="true"> · </span>
                                  Free
                                  <span aria-hidden="true"> · </span>
                                  <span className="font-mono tabular-nums">
                                    {res.duration}
                                  </span>
                                </p>
                              </div>
                              <ExternalLink className="h-4 w-4 shrink-0 text-[#31CB53]" />
                            </a>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Right Column: Instant Study Notes for this Goal */}
            <div className="lg:col-span-5 space-y-6">
              <div className="rounded-xl border border-[#232929] bg-[#0B0D0D] p-5">
                <div className="flex items-center justify-between">
                  <h2 className="font-heading text-lg font-bold text-[#D6E3E4] flex items-center gap-2">
                    <FileText className="h-4 w-4 text-[#F6FF81]" />
                    Quick Study Note
                  </h2>
                  <Link
                    to="/notes"
                    className="text-xs text-[#31CB53] hover:underline"
                  >
                    Full Notebook →
                  </Link>
                </div>

                <form onSubmit={handleSaveQuickNote} className="mt-4 space-y-3">
                  <input
                    type="text"
                    value={quickNoteTitle}
                    onChange={(e) => setQuickNoteTitle(e.target.value)}
                    placeholder="Key takeaway title..."
                    aria-label="Note title"
                    className="w-full rounded-lg border border-[#232929] bg-black px-3.5 py-2 text-sm text-[#D6E3E4] placeholder:text-[#667375] focus:border-[#31CB53] focus:outline-none"
                  />
                  <textarea
                    rows={5}
                    value={quickNoteBody}
                    onChange={(e) => setQuickNoteBody(e.target.value)}
                    placeholder="Jot down formulas, intuition, or questions while studying..."
                    aria-label="Note content"
                    className="w-full resize-y rounded-lg border border-[#232929] bg-black px-3.5 py-2.5 text-sm text-[#D6E3E4] placeholder:text-[#667375] focus:border-[#31CB53] focus:outline-none"
                  />
                  <button
                    type="submit"
                    disabled={!quickNoteBody.trim()}
                    className="w-full rounded-lg bg-[#31CB53] px-4 py-2.5 text-xs font-semibold text-black transition-colors hover:bg-[#29b347] disabled:opacity-40"
                  >
                    Save Takeaway
                  </button>
                </form>

                {goalNotes.length > 0 && (
                  <div className="mt-6 border-t border-[#1D2222] pt-4 divide-y divide-[#1D2222]">
                    <h3 className="pb-2 text-xs font-semibold uppercase tracking-wider text-[#94A3A5]">
                      Notes on this path ({goalNotes.length})
                    </h3>
                    {goalNotes.slice(0, 3).map((note) => (
                      <Link
                        key={note.id}
                        to="/notes"
                        className="block py-2.5 px-1.5 rounded hover:bg-[#121616] transition-colors"
                      >
                        <p className="text-sm font-medium text-[#D6E3E4]">
                          {note.title}
                        </p>
                        <p className="mt-1 text-xs text-[#94A3A5] line-clamp-2">
                          {note.content}
                        </p>
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              {activeGoal.category === "Custom" && (
                <button
                  type="button"
                  onClick={() => {
                    deleteGoal(activeGoal.id);
                    navigate("/skillup");
                    toast({ title: "Custom goal removed" });
                  }}
                  className="inline-flex items-center gap-2 text-xs text-[#94A3A5] hover:text-red-400 transition-colors"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  Delete this custom goal
                </button>
              )}
            </div>
          </div>
        </div>
      </AppShell>
    );
  }

  // Catalog + Custom Goal Builder View
  return (
    <AppShell>
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <h1 className="font-heading text-3xl font-extrabold text-[#D6E3E4] sm:text-4xl">
              Learning Goals &amp; <span className="text-[#31CB53]">Free</span> Paths
            </h1>
            <p className="mt-2 max-w-2xl text-sm text-[#94A3A5] sm:text-base">
              Pick a curated path built from top free videos, docs, and interactive tools—or create your own custom study goal.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setShowCreateModal(true)}
            className="inline-flex items-center gap-2 rounded-lg bg-[#31CB53] px-5 py-2.5 text-sm font-semibold text-black hover:bg-[#29b347] whitespace-nowrap shrink-0 self-start md:self-auto"
          >
            <Plus className="h-4 w-4" />
            New Study Goal
          </button>
        </div>

        {/* Search & Controlled Category Filter */}
        <div className="mt-8 flex flex-col gap-4 border-b border-[#1E2323] pb-6">
          <div className="relative max-w-md">
            <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#94A3A5]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search paths or topics..."
              aria-label="Search study paths"
              className="w-full rounded-lg border border-[#232929] bg-[#0B0D0D] py-2.5 pl-10 pr-4 text-sm text-[#D6E3E4] placeholder:text-[#667375] focus:border-[#31CB53] focus:outline-none"
            />
          </div>

          <div
            role="tablist"
            aria-label="Filter paths by category"
            className="flex flex-wrap items-center gap-2"
          >
            {CATEGORIES.map((cat) => {
              const active = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  onClick={() => setSelectedCategory(cat)}
                  className={`rounded-lg px-3.5 py-1.5 text-xs font-medium whitespace-nowrap transition-colors ${
                    active
                      ? "bg-[#F6FF81] text-black font-semibold"
                      : "border border-[#232929] bg-[#0B0D0D] text-[#94A3A5] hover:text-[#D6E3E4]"
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>
        </div>

        {/* Goals Grid */}
        {filteredGoals.length > 0 ? (
          <div className="mt-8 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
            {filteredGoals.map((goal) => {
              const progress = calculateGoalProgress(goal.milestones);
              return (
                <div
                  key={goal.id}
                  className="flex flex-col justify-between rounded-xl bg-[#D6E3E4] p-6 text-black"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 text-xs font-medium text-[#2A3435]">
                      <span>{goal.category}</span>
                      <span className="font-mono tabular-nums">
                        {goal.milestones.length} milestones
                      </span>
                    </div>

                    <h2 className="mt-2 font-heading text-xl font-bold text-black">
                      {goal.title}
                    </h2>
                    <p className="mt-2 text-sm text-[#242C2D]">
                      {goal.description}
                    </p>

                    <div className="mt-5">
                      <div className="mb-1.5 flex items-center justify-between text-xs font-semibold text-black">
                        <span>Progress</span>
                        <span className="font-mono tabular-nums">
                          {progress.percentage}%
                        </span>
                      </div>
                      <div className="h-2 w-full overflow-hidden rounded-full bg-black/15">
                        <div
                          className="h-full rounded-full bg-[#31CB53]"
                          style={{ width: `${progress.percentage}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 flex items-center justify-between gap-3 border-t border-black/10 pt-4">
                    <Link
                      to={`/skillup/${goal.id}`}
                      className="inline-flex items-center gap-1.5 rounded-lg bg-black px-4 py-2 text-xs font-semibold text-[#D6E3E4] hover:bg-[#1D2424] whitespace-nowrap"
                    >
                      {progress.completed > 0 ? "Continue" : "Start Path"}
                      <ArrowRight className="h-3.5 w-3.5" />
                    </Link>

                    <button
                      type="button"
                      onClick={() => toggleGoalActive(goal.id)}
                      className="text-xs font-semibold text-[#1D2424] hover:text-black whitespace-nowrap"
                    >
                      {goal.isActive ? "Pinned ✓" : "Pin to Desk"}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="mt-12 rounded-xl border border-[#232929] bg-[#0B0D0D] p-10 text-center">
            <h2 className="font-heading text-xl font-bold text-[#D6E3E4]">
              No matching study paths
            </h2>
            <p className="mt-2 text-sm text-[#94A3A5]">
              Reset your filters or create a custom goal for this topic.
            </p>
            <div className="mt-5 flex justify-center gap-3">
              <button
                type="button"
                onClick={() => {
                  setSearchQuery("");
                  setSelectedCategory("All");
                }}
                className="rounded-lg border border-[#2A3131] px-4 py-2 text-xs font-medium text-[#D6E3E4] hover:border-[#D6E3E4]"
              >
                Reset Filters
              </button>
              <button
                type="button"
                onClick={() => setShowCreateModal(true)}
                className="rounded-lg bg-[#31CB53] px-4 py-2 text-xs font-semibold text-black"
              >
                Create Custom Goal
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Create Custom Study Goal Modal */}
      {showCreateModal && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="create-goal-title"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm"
        >
          <div className="w-full max-w-lg rounded-xl border border-[#2A3131] bg-[#0B0D0D] p-6 text-[#D6E3E4]">
            <div className="flex items-center justify-between">
              <h2
                id="create-goal-title"
                className="font-heading text-xl font-bold"
              >
                Create Custom Study Goal
              </h2>
              <button
                type="button"
                onClick={() => setShowCreateModal(false)}
                aria-label="Close modal"
                className="rounded-lg p-1.5 text-[#94A3A5] hover:text-[#D6E3E4]"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleCreateGoal} className="mt-5 space-y-4">
              <div>
                <label
                  htmlFor="goal-title"
                  className="block text-xs font-medium text-[#94A3A5]"
                >
                  Goal Title
                </label>
                <input
                  id="goal-title"
                  type="text"
                  value={newTitle}
                  onChange={(e) => {
                    setNewTitle(e.target.value);
                    setFormError("");
                  }}
                  placeholder="e.g. Rust Systems Programming"
                  className="mt-1.5 w-full rounded-lg border border-[#232929] bg-black px-3.5 py-2.5 text-sm text-[#D6E3E4] focus:border-[#31CB53] focus:outline-none"
                />
                {formError && (
                  <p className="mt-1 text-xs text-red-400">{formError}</p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label
                    htmlFor="goal-category"
                    className="block text-xs font-medium text-[#94A3A5]"
                  >
                    Category
                  </label>
                  <select
                    id="goal-category"
                    value={newCategory}
                    onChange={(e) =>
                      setNewCategory(e.target.value as GoalCategory)
                    }
                    className="mt-1.5 w-full rounded-lg border border-[#232929] bg-black px-3 py-2.5 text-sm text-[#D6E3E4] focus:border-[#31CB53] focus:outline-none"
                  >
                    {CATEGORIES.filter((c) => c !== "All").map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="goal-hours"
                    className="block text-xs font-medium text-[#94A3A5]"
                  >
                    Weekly Hours
                  </label>
                  <input
                    id="goal-hours"
                    type="number"
                    min={1}
                    max={40}
                    value={newHours}
                    onChange={(e) => setNewHours(Number(e.target.value) || 4)}
                    className="mt-1.5 w-full rounded-lg border border-[#232929] bg-black px-3.5 py-2.5 text-sm font-mono tabular-nums text-[#D6E3E4] focus:border-[#31CB53] focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="goal-description"
                  className="block text-xs font-medium text-[#94A3A5]"
                >
                  Why this matters to you
                </label>
                <input
                  id="goal-description"
                  type="text"
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  placeholder="Short focus statement..."
                  className="mt-1.5 w-full rounded-lg border border-[#232929] bg-black px-3.5 py-2.5 text-sm text-[#D6E3E4] focus:border-[#31CB53] focus:outline-none"
                />
              </div>

              <div>
                <label
                  htmlFor="goal-milestones"
                  className="block text-xs font-medium text-[#94A3A5]"
                >
                  Milestones (one per line)
                </label>
                <textarea
                  id="goal-milestones"
                  rows={3}
                  value={newMilestonesText}
                  onChange={(e) => setNewMilestonesText(e.target.value)}
                  className="mt-1.5 w-full rounded-lg border border-[#232929] bg-black px-3.5 py-2 text-sm text-[#D6E3E4] focus:border-[#31CB53] focus:outline-none"
                />
              </div>

              <div>
                <label
                  htmlFor="goal-resource"
                  className="block text-xs font-medium text-[#94A3A5]"
                >
                  Primary Free Resource URL (optional)
                </label>
                <input
                  id="goal-resource"
                  type="url"
                  value={newResourceUrl}
                  onChange={(e) => setNewResourceUrl(e.target.value)}
                  placeholder="https://doc.rust-lang.org/book/"
                  className="mt-1.5 w-full rounded-lg border border-[#232929] bg-black px-3.5 py-2.5 text-sm text-[#D6E3E4] focus:border-[#31CB53] focus:outline-none"
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="rounded-lg border border-[#232929] px-4 py-2 text-xs font-medium text-[#94A3A5] hover:text-[#D6E3E4]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-lg bg-[#31CB53] px-5 py-2 text-xs font-semibold text-black hover:bg-[#29b347]"
                >
                  Create Goal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AppShell>
  );
};

export default SkillUp;
