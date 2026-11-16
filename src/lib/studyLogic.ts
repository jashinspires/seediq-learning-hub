import type {
  GoalCategory,
  QuizQuestion,
  StudyGoal,
  StudyMilestone,
  StudyNote,
} from "./studyTypes";

export function formatIsoDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function addDaysIso(isoDate: string, deltaDays: number): string {
  const [y, m, d] = isoDate.split("-").map(Number);
  const dt = new Date(Date.UTC(y, m - 1, d + deltaDays));
  const yy = dt.getUTCFullYear();
  const mm = String(dt.getUTCMonth() + 1).padStart(2, "0");
  const dd = String(dt.getUTCDate()).padStart(2, "0");
  return `${yy}-${mm}-${dd}`;
}

export function calculateGoalProgress(milestones: StudyMilestone[]): {
  completed: number;
  total: number;
  percentage: number;
  remainingMinutes: number;
} {
  const total = milestones.length;
  if (total === 0) {
    return { completed: 0, total: 0, percentage: 0, remainingMinutes: 0 };
  }
  const completed = milestones.filter((m) => m.completed).length;
  const remainingMinutes = milestones
    .filter((m) => !m.completed)
    .reduce((sum, m) => sum + Math.max(0, m.estimatedMinutes || 0), 0);

  return {
    completed,
    total,
    percentage: Math.round((completed / total) * 100),
    remainingMinutes,
  };
}

export function calculateStreak(
  activityLog: Record<string, number>,
  todayIso: string
): number {
  const hasToday = (activityLog[todayIso] ?? 0) > 0;
  let cursor = hasToday ? todayIso : addDaysIso(todayIso, -1);
  let streak = 0;

  while ((activityLog[cursor] ?? 0) > 0) {
    streak += 1;
    cursor = addDaysIso(cursor, -1);
  }

  return streak;
}

export interface HeatmapCell {
  date: string;
  count: number;
  level: 0 | 1 | 2 | 3 | 4;
}

export function buildActivityHeatmap(
  activityLog: Record<string, number>,
  todayIso: string,
  weeks = 16
): HeatmapCell[][] {
  const totalDays = weeks * 7;
  const startIso = addDaysIso(todayIso, -(totalDays - 1));
  const columns: HeatmapCell[][] = [];

  for (let w = 0; w < weeks; w++) {
    const weekCol: HeatmapCell[] = [];
    for (let d = 0; d < 7; d++) {
      const offset = w * 7 + d;
      const date = addDaysIso(startIso, offset);
      const count = activityLog[date] ?? 0;
      const level: 0 | 1 | 2 | 3 | 4 =
        count <= 0 ? 0 : count === 1 ? 1 : count <= 3 ? 2 : count <= 5 ? 3 : 4;
      weekCol.push({ date, count, level });
    }
    columns.push(weekCol);
  }

  return columns;
}

export function filterGoals(
  goals: StudyGoal[],
  query: string,
  category: string
): StudyGoal[] {
  const normalizedQuery = query.trim().toLowerCase();
  return goals.filter((goal) => {
    const matchesCategory = category === "All" || goal.category === category;
    if (!matchesCategory) return false;
    if (!normalizedQuery) return true;
    const inTitle = goal.title.toLowerCase().includes(normalizedQuery);
    const inDesc = goal.description.toLowerCase().includes(normalizedQuery);
    const inMilestone = goal.milestones.some((m) =>
      m.title.toLowerCase().includes(normalizedQuery)
    );
    return inTitle || inDesc || inMilestone;
  });
}

export function filterNotes(
  notes: StudyNote[],
  query: string,
  goalId: string
): StudyNote[] {
  const q = query.trim().toLowerCase();
  return notes.filter((note) => {
    const matchesGoal = goalId === "all" || note.goalId === goalId;
    if (!matchesGoal) return false;
    if (!q) return true;
    return (
      note.title.toLowerCase().includes(q) ||
      note.content.toLowerCase().includes(q) ||
      note.tags.some((t) => t.toLowerCase().includes(q))
    );
  });
}

export function scoreQuizAttempt(
  questions: QuizQuestion[],
  answers: Record<string, number>
): {
  correct: number;
  total: number;
  percentage: number;
} {
  const total = questions.length;
  if (total === 0) {
    return { correct: 0, total: 0, percentage: 0 };
  }
  const correct = questions.reduce((acc, q) => {
    return answers[q.id] === q.correctIndex ? acc + 1 : acc;
  }, 0);

  return {
    correct,
    total,
    percentage: Math.round((correct / total) * 100),
  };
}

export interface CreateCustomGoalInput {
  title: string;
  category: GoalCategory;
  description: string;
  weeklyHoursTarget: number;
  milestoneTitles: string[];
  resourceUrl?: string;
}

export function createCustomGoal(input: CreateCustomGoalInput): StudyGoal {
  const trimmedTitle = input.title.trim();
  if (!trimmedTitle) {
    throw new Error("Goal title cannot be empty.");
  }

  const cleanMilestones = input.milestoneTitles
    .map((t) => t.trim())
    .filter(Boolean);

  const milestoneList =
    cleanMilestones.length > 0
      ? cleanMilestones
      : [`Core foundations of ${trimmedTitle}`, `Hands-on practice & review`];

  const idSlug = trimmedTitle
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
  const uniqueId = `${idSlug || "goal"}-${Date.now().toString(36)}`;

  const optionalUrl = input.resourceUrl?.trim();

  return {
    id: uniqueId,
    title: trimmedTitle,
    category: input.category,
    description:
      input.description.trim() ||
      `Custom personal study track for ${trimmedTitle}.`,
    weeklyHoursTarget: Math.max(1, Math.min(40, input.weeklyHoursTarget || 4)),
    isActive: true,
    createdAt: formatIsoDate(new Date()),
    milestones: milestoneList.map((mTitle, idx) => ({
      id: `${uniqueId}-m${idx + 1}`,
      title: mTitle,
      summary: `Personal milestone ${idx + 1} for ${trimmedTitle}.`,
      estimatedMinutes: 45,
      completed: false,
      resources: optionalUrl
        ? [
            {
              id: `${uniqueId}-r${idx + 1}`,
              title: `${mTitle} — Reference Link`,
              provider: "Custom Resource",
              kind: "Article",
              duration: "30 min",
              url: optionalUrl,
            },
          ]
        : [],
    })),
  };
}
