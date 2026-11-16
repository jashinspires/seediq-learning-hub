export type GoalCategory =
  | "Computer Science"
  | "Web Engineering"
  | "AI & Math"
  | "Languages"
  | "System Design"
  | "Custom";

export type ResourceKind = "Video" | "Docs" | "Article" | "Interactive";

export interface StudyResource {
  id: string;
  title: string;
  provider: string;
  kind: ResourceKind;
  duration: string;
  url: string;
}

export interface StudyMilestone {
  id: string;
  title: string;
  summary: string;
  estimatedMinutes: number;
  completed: boolean;
  resources: StudyResource[];
}

export interface StudyGoal {
  id: string;
  title: string;
  category: GoalCategory;
  description: string;
  weeklyHoursTarget: number;
  isActive: boolean;
  createdAt: string;
  milestones: StudyMilestone[];
}

export type TutorMode = "explain" | "socratic" | "debug" | "quiz-me";

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  image?: string;
  createdAt: string;
}

export interface ChatThread {
  id: string;
  title: string;
  goalId?: string;
  mode: TutorMode;
  updatedAt: string;
  messages: ChatMessage[];
}

export interface StudyNote {
  id: string;
  title: string;
  content: string;
  goalId?: string;
  tags: string[];
  updatedAt: string;
}

export interface QuizQuestion {
  id: string;
  topicId: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface Flashcard {
  id: string;
  topicId: string;
  front: string;
  back: string;
  mastered: boolean;
}

export interface QuizAttemptSummary {
  id: string;
  topicId: string;
  topicTitle: string;
  correct: number;
  total: number;
  percentage: number;
  completedAt: string;
}

export interface LearnerProfile {
  name: string;
  handle: string;
  email: string;
  bio: string;
  dailyFocusTask: string;
  dailyFocusCompleted: boolean;
  dailyTargetMinutes: number;
  isSignedIn: boolean;
}

export interface StudyState {
  profile: LearnerProfile;
  goals: StudyGoal[];
  threads: ChatThread[];
  activeThreadId: string;
  notes: StudyNote[];
  flashcards: Flashcard[];
  quizHistory: QuizAttemptSummary[];
  activityLog: Record<string, number>;
}
