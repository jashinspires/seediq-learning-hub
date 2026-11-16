import type {
  ChatMessage,
  ChatThread,
  Flashcard,
  GoalCategory,
  LearnerProfile,
  QuizAttemptSummary,
  StudyGoal,
  StudyNote,
  TutorMode,
} from "./studyTypes";

export const BLUEPRINT_LIMITS = {
  ID_MAX: 128,
  ID_PATTERN: /^[a-zA-Z0-9_-]+$/,
  HANDLE_MAX: 50,
  HANDLE_PATTERN: /^[a-z0-9-]+$/,
  DATE_PATTERN: /^[0-9]{4}-[0-9]{2}-[0-9]{2}$/,
  NAME_MAX: 80,
  EMAIL_MAX: 160,
  BIO_MAX: 300,
  DAILY_FOCUS_MAX: 200,
  GOAL_TITLE_MAX: 120,
  GOAL_DESC_MAX: 500,
  MILESTONES_MAX: 30,
  NOTE_TITLE_MAX: 140,
  NOTE_CONTENT_MAX: 20000,
  NOTE_TAGS_MAX: 10,
  NOTE_TAG_MAX: 40,
  THREAD_TITLE_MAX: 120,
  MESSAGE_CONTENT_MAX: 20000,
  FLASHCARD_FRONT_MAX: 500,
  FLASHCARD_BACK_MAX: 1500,
  QUIZ_TOPIC_TITLE_MAX: 140,
  DATE_LABEL_MAX: 30,
  ACTIVITY_MAX: 10000,
} as const;

const VALID_CATEGORIES: readonly GoalCategory[] = [
  "Computer Science",
  "Web Engineering",
  "AI & Math",
  "Languages",
  "System Design",
  "Custom",
];

const VALID_TUTOR_MODES: readonly TutorMode[] = [
  "explain",
  "socratic",
  "debug",
  "quiz-me",
];

const ALLOWED_KEYS = {
  UserProfile: new Set([
    "userId",
    "name",
    "handle",
    "email",
    "bio",
    "dailyFocusTask",
    "dailyFocusCompleted",
    "dailyTargetMinutes",
    "activeThreadId",
    "createdAt",
    "updatedAt",
  ]),
  StudyGoal: new Set([
    "userId",
    "id",
    "title",
    "category",
    "description",
    "weeklyHoursTarget",
    "isActive",
    "createdAt",
    "milestones",
    "serverCreatedAt",
    "serverUpdatedAt",
  ]),
  StudyNote: new Set([
    "userId",
    "id",
    "title",
    "content",
    "goalId",
    "tags",
    "updatedAt",
    "serverCreatedAt",
    "serverUpdatedAt",
  ]),
  ChatThread: new Set([
    "userId",
    "id",
    "title",
    "goalId",
    "mode",
    "updatedAt",
    "serverCreatedAt",
    "serverUpdatedAt",
  ]),
  ChatMessage: new Set([
    "userId",
    "id",
    "role",
    "content",
    "hasImage",
    "createdAt",
    "serverCreatedAt",
  ]),
  Flashcard: new Set([
    "userId",
    "id",
    "topicId",
    "front",
    "back",
    "mastered",
    "serverCreatedAt",
    "serverUpdatedAt",
  ]),
  QuizAttempt: new Set([
    "userId",
    "id",
    "topicId",
    "topicTitle",
    "correct",
    "total",
    "percentage",
    "completedAt",
    "serverCreatedAt",
  ]),
  ActivityDay: new Set([
    "userId",
    "date",
    "count",
    "serverCreatedAt",
    "serverUpdatedAt",
  ]),
};

export function isValidId(id: string): boolean {
  return (
    typeof id === "string" &&
    id.length >= 1 &&
    id.length <= BLUEPRINT_LIMITS.ID_MAX &&
    BLUEPRINT_LIMITS.ID_PATTERN.test(id)
  );
}

export function sanitizeId(raw: string, fallback = "item"): string {
  const cleaned = (raw || "")
    .trim()
    .replace(/[^a-zA-Z0-9_-]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, BLUEPRINT_LIMITS.ID_MAX);
  return cleaned || fallback;
}

export function sanitizeHandle(raw: string): string {
  const cleaned = (raw || "")
    .toLowerCase()
    .replace(/[^a-z0-9-]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, BLUEPRINT_LIMITS.HANDLE_MAX);
  return cleaned || "study-desk";
}

function clampString(value: string, max: number, fallback = ""): string {
  const trimmed = (value ?? "").trim();
  if (!trimmed) return fallback;
  return trimmed.slice(0, max);
}

export function buildProfilePayload<TStamp>(
  userId: string,
  profile: LearnerProfile,
  activeThreadId: string,
  createdAt: TStamp,
  updatedAt: TStamp
) {
  return {
    userId,
    name: clampString(profile.name, BLUEPRINT_LIMITS.NAME_MAX, "Learner"),
    handle: sanitizeHandle(profile.handle || profile.name),
    email: clampString(profile.email, BLUEPRINT_LIMITS.EMAIL_MAX, ""),
    bio: clampString(profile.bio, BLUEPRINT_LIMITS.BIO_MAX, ""),
    dailyFocusTask: clampString(
      profile.dailyFocusTask,
      BLUEPRINT_LIMITS.DAILY_FOCUS_MAX,
      "Complete one focused study milestone"
    ),
    dailyFocusCompleted: Boolean(profile.dailyFocusCompleted),
    dailyTargetMinutes: Math.max(
      10,
      Math.min(240, Math.round(profile.dailyTargetMinutes || 45))
    ),
    activeThreadId: sanitizeId(activeThreadId, "thread-welcome"),
    createdAt,
    updatedAt,
  };
}

export function buildGoalPayload<TStamp>(
  userId: string,
  goal: StudyGoal,
  serverCreatedAt: TStamp,
  serverUpdatedAt: TStamp
) {
  const id = sanitizeId(goal.id, `goal-${Date.now().toString(36)}`);
  const category: GoalCategory = VALID_CATEGORIES.includes(goal.category)
    ? goal.category
    : "Custom";

  return {
    userId,
    id,
    title: clampString(goal.title, BLUEPRINT_LIMITS.GOAL_TITLE_MAX, "Study Goal"),
    category,
    description: clampString(goal.description, BLUEPRINT_LIMITS.GOAL_DESC_MAX, ""),
    weeklyHoursTarget: Math.max(
      1,
      Math.min(40, Math.round(goal.weeklyHoursTarget || 4))
    ),
    isActive: Boolean(goal.isActive),
    createdAt: clampString(goal.createdAt, BLUEPRINT_LIMITS.DATE_LABEL_MAX, "2026-01-01"),
    milestones: (goal.milestones || []).slice(0, BLUEPRINT_LIMITS.MILESTONES_MAX).map((m) => ({
      id: sanitizeId(m.id, `${id}-m`),
      title: clampString(m.title, BLUEPRINT_LIMITS.GOAL_TITLE_MAX, "Milestone"),
      summary: clampString(m.summary, BLUEPRINT_LIMITS.GOAL_DESC_MAX, ""),
      estimatedMinutes: Math.max(5, Math.min(600, Math.round(m.estimatedMinutes || 30))),
      completed: Boolean(m.completed),
      resources: (m.resources || []).slice(0, 10).map((r) => ({
        id: sanitizeId(r.id, `${id}-r`),
        title: clampString(r.title, BLUEPRINT_LIMITS.GOAL_TITLE_MAX, "Resource"),
        provider: clampString(r.provider, 80, "Reference"),
        kind: r.kind,
        duration: clampString(r.duration, 40, "30 min"),
        url: clampString(r.url, 500, ""),
      })),
    })),
    serverCreatedAt,
    serverUpdatedAt,
  };
}

export function buildNotePayload<TStamp>(
  userId: string,
  note: StudyNote,
  serverCreatedAt: TStamp,
  serverUpdatedAt: TStamp
) {
  const id = sanitizeId(note.id, `note-${Date.now().toString(36)}`);
  const tags = (note.tags || [])
    .map((t) => clampString(t, BLUEPRINT_LIMITS.NOTE_TAG_MAX, ""))
    .filter(Boolean)
    .slice(0, BLUEPRINT_LIMITS.NOTE_TAGS_MAX);

  const payload: Record<string, unknown> = {
    userId,
    id,
    title: clampString(note.title, BLUEPRINT_LIMITS.NOTE_TITLE_MAX, "Untitled Study Note"),
    content: (note.content ?? "").slice(0, BLUEPRINT_LIMITS.NOTE_CONTENT_MAX),
    tags,
    updatedAt: clampString(note.updatedAt, BLUEPRINT_LIMITS.DATE_LABEL_MAX, "2026-01-01"),
    serverCreatedAt,
    serverUpdatedAt,
  };

  if (note.goalId && isValidId(note.goalId)) {
    payload.goalId = note.goalId;
  }

  return payload;
}

export function buildThreadPayload<TStamp>(
  userId: string,
  thread: Pick<ChatThread, "id" | "title" | "goalId" | "mode" | "updatedAt">,
  serverCreatedAt: TStamp,
  serverUpdatedAt: TStamp
) {
  const id = sanitizeId(thread.id, `thread-${Date.now().toString(36)}`);
  const mode: TutorMode = VALID_TUTOR_MODES.includes(thread.mode)
    ? thread.mode
    : "explain";

  const payload: Record<string, unknown> = {
    userId,
    id,
    title: clampString(thread.title, BLUEPRINT_LIMITS.THREAD_TITLE_MAX, "New Study Session"),
    mode,
    updatedAt: clampString(thread.updatedAt, BLUEPRINT_LIMITS.DATE_LABEL_MAX, "2026-01-01"),
    serverCreatedAt,
    serverUpdatedAt,
  };

  if (thread.goalId && isValidId(thread.goalId)) {
    payload.goalId = thread.goalId;
  }

  return payload;
}

export function buildMessagePayload<TStamp>(
  userId: string,
  message: ChatMessage,
  serverCreatedAt: TStamp
) {
  return {
    userId,
    id: sanitizeId(message.id, `msg-${Date.now().toString(36)}`),
    role: message.role === "assistant" ? "assistant" : "user",
    content: clampString(
      message.content,
      BLUEPRINT_LIMITS.MESSAGE_CONTENT_MAX,
      "Study question"
    ),
    hasImage: Boolean(message.image),
    createdAt: clampString(message.createdAt, BLUEPRINT_LIMITS.DATE_LABEL_MAX, "2026-01-01"),
    serverCreatedAt,
  };
}

export function buildFlashcardPayload<TStamp>(
  userId: string,
  card: Flashcard,
  serverCreatedAt: TStamp,
  serverUpdatedAt: TStamp
) {
  return {
    userId,
    id: sanitizeId(card.id, `fc-${Date.now().toString(36)}`),
    topicId: sanitizeId(card.topicId, "dsa-core"),
    front: clampString(card.front, BLUEPRINT_LIMITS.FLASHCARD_FRONT_MAX, "Prompt"),
    back: clampString(card.back, BLUEPRINT_LIMITS.FLASHCARD_BACK_MAX, "Answer"),
    mastered: Boolean(card.mastered),
    serverCreatedAt,
    serverUpdatedAt,
  };
}

export function buildQuizAttemptPayload<TStamp>(
  userId: string,
  attempt: QuizAttemptSummary,
  serverCreatedAt: TStamp
) {
  const total = Math.max(1, Math.min(100, Math.round(attempt.total || 1)));
  const correct = Math.max(0, Math.min(total, Math.round(attempt.correct || 0)));
  const percentage = Math.max(
    0,
    Math.min(100, Math.round((correct / total) * 100))
  );

  return {
    userId,
    id: sanitizeId(attempt.id, `quiz-${Date.now().toString(36)}`),
    topicId: sanitizeId(attempt.topicId, "dsa-core"),
    topicTitle: clampString(
      attempt.topicTitle,
      BLUEPRINT_LIMITS.QUIZ_TOPIC_TITLE_MAX,
      "Practice Quiz"
    ),
    correct,
    total,
    percentage,
    completedAt: clampString(
      attempt.completedAt,
      BLUEPRINT_LIMITS.DATE_LABEL_MAX,
      "2026-01-01"
    ),
    serverCreatedAt,
  };
}

export function buildActivityDayPayload<TStamp>(
  userId: string,
  dateIso: string,
  count: number,
  serverCreatedAt: TStamp,
  serverUpdatedAt: TStamp
) {
  if (!BLUEPRINT_LIMITS.DATE_PATTERN.test(dateIso)) {
    throw new Error(`Invalid ISO date for activity day: ${dateIso}`);
  }
  return {
    userId,
    date: dateIso,
    count: Math.max(0, Math.min(BLUEPRINT_LIMITS.ACTIVITY_MAX, Math.round(count))),
    serverCreatedAt,
    serverUpdatedAt,
  };
}

export interface RuleSimulationContext {
  authUid: string | null;
  emailVerified: boolean;
  parentUserExists: boolean;
  parentThreadExists?: boolean;
  serverNowToken: unknown;
}

/**
 * Pure TypeScript mirror of SeedIQ Firestore security invariants used by
 * firestore.rules.test.ts to verify that all "Dirty Dozen" adversarial payloads
 * are rejected before touching Firestore.
 */
export function evaluateRuleCompliance(
  entity:
    | "UserProfile"
    | "StudyGoal"
    | "StudyNote"
    | "ChatThread"
    | "ChatMessage"
    | "Flashcard"
    | "QuizAttempt"
    | "ActivityDay",
  pathParams: { userId: string; docId: string; threadId?: string },
  payload: Record<string, unknown>,
  ctx: RuleSimulationContext,
  operation: "create" | "update" = "create"
): { allowed: boolean; reason?: string } {
  if (!ctx.authUid || !ctx.emailVerified) {
    return { allowed: false, reason: "PERMISSION_DENIED: unauthenticated or unverified email" };
  }
  if (ctx.authUid !== pathParams.userId) {
    return { allowed: false, reason: "PERMISSION_DENIED: cross-user access" };
  }
  if (!isValidId(pathParams.userId) || !isValidId(pathParams.docId)) {
    return { allowed: false, reason: "PERMISSION_DENIED: invalid document ID" };
  }
  if (entity !== "UserProfile" && !ctx.parentUserExists) {
    return { allowed: false, reason: "PERMISSION_DENIED: missing parent user document" };
  }
  if (entity === "ChatMessage" && !ctx.parentThreadExists) {
    return { allowed: false, reason: "PERMISSION_DENIED: missing parent thread document" };
  }

  const allowedSet = ALLOWED_KEYS[entity];
  for (const key of Object.keys(payload)) {
    if (!allowedSet.has(key)) {
      return { allowed: false, reason: `PERMISSION_DENIED: shadow field '${key}'` };
    }
  }

  if (payload.userId !== ctx.authUid) {
    return { allowed: false, reason: "PERMISSION_DENIED: payload userId mismatch" };
  }

  if (entity === "UserProfile") {
    if (operation === "create" && payload.createdAt !== ctx.serverNowToken) {
      return { allowed: false, reason: "PERMISSION_DENIED: createdAt must equal request.time" };
    }
    if (payload.updatedAt !== ctx.serverNowToken) {
      return { allowed: false, reason: "PERMISSION_DENIED: updatedAt must equal request.time" };
    }
    if (
      typeof payload.name !== "string" ||
      payload.name.length < 1 ||
      payload.name.length > BLUEPRINT_LIMITS.NAME_MAX ||
      typeof payload.handle !== "string" ||
      !BLUEPRINT_LIMITS.HANDLE_PATTERN.test(payload.handle) ||
      typeof payload.email !== "string" ||
      payload.email.length > BLUEPRINT_LIMITS.EMAIL_MAX ||
      typeof payload.dailyTargetMinutes !== "number" ||
      payload.dailyTargetMinutes < 10 ||
      payload.dailyTargetMinutes > 240
    ) {
      return { allowed: false, reason: "PERMISSION_DENIED: invalid UserProfile field bounds" };
    }
    return { allowed: true };
  }

  if (operation === "create" && payload.serverCreatedAt !== ctx.serverNowToken) {
    return { allowed: false, reason: "PERMISSION_DENIED: serverCreatedAt must equal request.time" };
  }

  if (entity === "StudyGoal") {
    if (
      payload.id !== pathParams.docId ||
      typeof payload.title !== "string" ||
      payload.title.length < 1 ||
      payload.title.length > BLUEPRINT_LIMITS.GOAL_TITLE_MAX ||
      !Array.isArray(payload.milestones) ||
      payload.milestones.length > BLUEPRINT_LIMITS.MILESTONES_MAX
    ) {
      return { allowed: false, reason: "PERMISSION_DENIED: invalid StudyGoal payload" };
    }
    return { allowed: true };
  }

  if (entity === "StudyNote") {
    if (
      payload.id !== pathParams.docId ||
      typeof payload.title !== "string" ||
      payload.title.length < 1 ||
      payload.title.length > BLUEPRINT_LIMITS.NOTE_TITLE_MAX ||
      typeof payload.content !== "string" ||
      payload.content.length > BLUEPRINT_LIMITS.NOTE_CONTENT_MAX ||
      !Array.isArray(payload.tags) ||
      payload.tags.length > BLUEPRINT_LIMITS.NOTE_TAGS_MAX ||
      (payload.tags.length > 0 && typeof payload.tags[0] !== "string")
    ) {
      return { allowed: false, reason: "PERMISSION_DENIED: invalid StudyNote payload" };
    }
    return { allowed: true };
  }

  if (entity === "ChatMessage") {
    if (operation === "update") {
      return { allowed: false, reason: "PERMISSION_DENIED: chat messages are immutable" };
    }
    if (
      payload.id !== pathParams.docId ||
      (payload.role !== "user" && payload.role !== "assistant") ||
      typeof payload.content !== "string" ||
      payload.content.length < 1 ||
      payload.content.length > BLUEPRINT_LIMITS.MESSAGE_CONTENT_MAX ||
      typeof payload.hasImage !== "boolean"
    ) {
      return { allowed: false, reason: "PERMISSION_DENIED: invalid ChatMessage payload" };
    }
    return { allowed: true };
  }

  if (entity === "QuizAttempt") {
    const total = payload.total;
    const correct = payload.correct;
    const percentage = payload.percentage;
    if (
      payload.id !== pathParams.docId ||
      typeof total !== "number" ||
      typeof correct !== "number" ||
      typeof percentage !== "number" ||
      total < 1 ||
      total > 100 ||
      correct < 0 ||
      correct > total ||
      percentage < 0 ||
      percentage > 100
    ) {
      return { allowed: false, reason: "PERMISSION_DENIED: invalid QuizAttempt score bounds" };
    }
    return { allowed: true };
  }

  return { allowed: true };
}
