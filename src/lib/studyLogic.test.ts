import test from "node:test";
import assert from "node:assert/strict";
import {
  buildActivityHeatmap,
  calculateGoalProgress,
  calculateStreak,
  createCustomGoal,
  filterGoals,
  scoreQuizAttempt,
} from "./studyLogic";
import type { QuizQuestion, StudyGoal, StudyMilestone } from "./studyTypes";

test("calculateGoalProgress handles empty, partial, and completed milestones", () => {
  assert.deepEqual(calculateGoalProgress([]), {
    completed: 0,
    total: 0,
    percentage: 0,
    remainingMinutes: 0,
  });

  const milestones: StudyMilestone[] = [
    { id: "1", title: "A", summary: "", estimatedMinutes: 30, completed: true, resources: [] },
    { id: "2", title: "B", summary: "", estimatedMinutes: 45, completed: false, resources: [] },
    { id: "3", title: "C", summary: "", estimatedMinutes: 15, completed: false, resources: [] },
  ];

  assert.deepEqual(calculateGoalProgress(milestones), {
    completed: 1,
    total: 3,
    percentage: 33,
    remainingMinutes: 60,
  });
});

test("calculateStreak counts consecutive active days up to today or yesterday", () => {
  const log = {
    "2026-11-13": 1,
    "2026-11-14": 2,
    "2026-11-15": 1,
    "2026-11-16": 3,
  };
  assert.equal(calculateStreak(log, "2026-11-16"), 4);

  const yesterdayLog = {
    "2026-11-14": 2,
    "2026-11-15": 1,
  };
  assert.equal(calculateStreak(yesterdayLog, "2026-11-16"), 2);

  const brokenLog = {
    "2026-11-13": 4,
  };
  assert.equal(calculateStreak(brokenLog, "2026-11-16"), 0);
});

test("buildActivityHeatmap generates deterministic weeks and levels", () => {
  const log = {
    "2026-11-16": 6,
    "2026-11-15": 2,
    "2026-11-14": 1,
  };
  const grid = buildActivityHeatmap(log, "2026-11-16", 4);
  assert.equal(grid.length, 4);
  assert.equal(grid[0].length, 7);
  const lastCell = grid[3][6];
  assert.equal(lastCell.date, "2026-11-16");
  assert.equal(lastCell.count, 6);
  assert.equal(lastCell.level, 4);
});

test("scoreQuizAttempt computes accurate score", () => {
  const questions: QuizQuestion[] = [
    {
      id: "q1",
      topicId: "dsa",
      question: "Binary search complexity?",
      options: ["O(1)", "O(log n)", "O(n)", "O(n^2)"],
      correctIndex: 1,
      explanation: "Halves search space.",
    },
    {
      id: "q2",
      topicId: "dsa",
      question: "Stack order?",
      options: ["FIFO", "LIFO", "Random", "Sorted"],
      correctIndex: 1,
      explanation: "Last In First Out.",
    },
  ];
  assert.deepEqual(scoreQuizAttempt(questions, { q1: 1, q2: 0 }), {
    correct: 1,
    total: 2,
    percentage: 50,
  });
});

test("createCustomGoal validates title and builds structured milestones", () => {
  assert.throws(() =>
    createCustomGoal({
      title: "   ",
      category: "Custom",
      description: "",
      weeklyHoursTarget: 5,
      milestoneTitles: [],
    })
  );

  const goal = createCustomGoal({
    title: "Rust Systems",
    category: "Computer Science",
    description: "Ownership and async Rust",
    weeklyHoursTarget: 6,
    milestoneTitles: ["Ownership & Borrowing", "Lifetimes", "Tokio Async"],
  });

  assert.equal(goal.title, "Rust Systems");
  assert.equal(goal.milestones.length, 3);
  assert.equal(goal.milestones[0].completed, false);
});

test("filterGoals filters by category and search query", () => {
  const goals: StudyGoal[] = [
    createCustomGoal({
      title: "DSA Mastery",
      category: "Computer Science",
      description: "Trees and graphs",
      weeklyHoursTarget: 5,
      milestoneTitles: ["Binary Trees"],
    }),
    createCustomGoal({
      title: "Japanese N5",
      category: "Languages",
      description: "Hiragana and grammar",
      weeklyHoursTarget: 4,
      milestoneTitles: ["Hiragana"],
    }),
  ];

  assert.equal(filterGoals(goals, "", "Languages").length, 1);
  assert.equal(filterGoals(goals, "trees", "All").length, 1);
  assert.equal(filterGoals(goals, "missing", "All").length, 0);
});
