import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  buildActivityDayPayload,
  buildGoalPayload,
  buildMessagePayload,
  buildNotePayload,
  buildProfilePayload,
  buildQuizAttemptPayload,
  evaluateRuleCompliance,
} from "./src/lib/firestoreSanitizer";

const NOW = { __type: "serverTimestamp" };
const BASE_CTX = {
  authUid: "user_abc_123",
  emailVerified: true,
  parentUserExists: true,
  parentThreadExists: true,
  serverNowToken: NOW,
};

describe("SeedIQ Firestore Rules Dirty Dozen Adversarial Verification", () => {
  it("1. Rejects cross-user write on /users/{otherUid}", () => {
    const payload = buildProfilePayload(
      "other_user_999",
      {
        name: "Intruder",
        handle: "intruder",
        email: "x@y.com",
        bio: "",
        dailyFocusTask: "Read",
        dailyFocusCompleted: false,
        dailyTargetMinutes: 45,
        isSignedIn: true,
      },
      "thread-welcome",
      NOW,
      NOW
    );
    const res = evaluateRuleCompliance(
      "UserProfile",
      { userId: "other_user_999", docId: "other_user_999" },
      payload,
      BASE_CTX
    );
    assert.equal(res.allowed, false);
  });

  it("2. Rejects unverified email attempting profile creation", () => {
    const payload = buildProfilePayload(
      "user_abc_123",
      {
        name: "Alex",
        handle: "alex",
        email: "alex@example.com",
        bio: "",
        dailyFocusTask: "Study",
        dailyFocusCompleted: false,
        dailyTargetMinutes: 45,
        isSignedIn: true,
      },
      "thread-welcome",
      NOW,
      NOW
    );
    const res = evaluateRuleCompliance(
      "UserProfile",
      { userId: "user_abc_123", docId: "user_abc_123" },
      payload,
      { ...BASE_CTX, emailVerified: false }
    );
    assert.equal(res.allowed, false);
  });

  it("3. Rejects shadow/ghost field (isAdmin: true) on UserProfile", () => {
    const payload = {
      ...buildProfilePayload(
        "user_abc_123",
        {
          name: "Alex",
          handle: "alex",
          email: "alex@example.com",
          bio: "",
          dailyFocusTask: "Study",
          dailyFocusCompleted: false,
          dailyTargetMinutes: 45,
          isSignedIn: true,
        },
        "thread-welcome",
        NOW,
        NOW
      ),
      isAdmin: true,
    };
    const res = evaluateRuleCompliance(
      "UserProfile",
      { userId: "user_abc_123", docId: "user_abc_123" },
      payload,
      BASE_CTX
    );
    assert.equal(res.allowed, false);
  });

  it("4. Rejects client-spoofed createdAt timestamp", () => {
    const payload = buildProfilePayload(
      "user_abc_123",
      {
        name: "Alex",
        handle: "alex",
        email: "alex@example.com",
        bio: "",
        dailyFocusTask: "Study",
        dailyFocusCompleted: false,
        dailyTargetMinutes: 45,
        isSignedIn: true,
      },
      "thread-welcome",
      "2020-01-01T00:00:00Z",
      NOW
    );
    const res = evaluateRuleCompliance(
      "UserProfile",
      { userId: "user_abc_123", docId: "user_abc_123" },
      payload,
      BASE_CTX
    );
    assert.equal(res.allowed, false);
  });

  it("5. Rejects ID poisoning (>128 chars or illegal characters)", () => {
    const longId = "a".repeat(200);
    const res = evaluateRuleCompliance(
      "StudyGoal",
      { userId: "user_abc_123", docId: longId },
      {
        userId: "user_abc_123",
        id: longId,
        title: "Goal",
        milestones: [],
        serverCreatedAt: NOW,
        serverUpdatedAt: NOW,
      },
      BASE_CTX
    );
    assert.equal(res.allowed, false);
  });

  it("6. Rejects ownership spoofing in StudyGoal payload", () => {
    const payload = buildGoalPayload(
      "spoofed_uid",
      {
        id: "g1",
        title: "DSA",
        category: "Computer Science",
        description: "Desc",
        weeklyHoursTarget: 4,
        isActive: true,
        createdAt: "2026-11-16",
        milestones: [],
      },
      NOW,
      NOW
    );
    const res = evaluateRuleCompliance(
      "StudyGoal",
      { userId: "user_abc_123", docId: "g1" },
      payload,
      BASE_CTX
    );
    assert.equal(res.allowed, false);
  });

  it("7. Rejects unbounded milestones list (>30) on StudyGoal", () => {
    const res = evaluateRuleCompliance(
      "StudyGoal",
      { userId: "user_abc_123", docId: "g1" },
      {
        userId: "user_abc_123",
        id: "g1",
        title: "Huge Goal",
        milestones: new Array(35).fill({ id: "m", title: "M" }),
        serverCreatedAt: NOW,
        serverUpdatedAt: NOW,
      },
      BASE_CTX
    );
    assert.equal(res.allowed, false);
  });

  it("8. Rejects invalid tag array (numeric tag or >10 tags) on StudyNote", () => {
    const res = evaluateRuleCompliance(
      "StudyNote",
      { userId: "user_abc_123", docId: "n1" },
      {
        userId: "user_abc_123",
        id: "n1",
        title: "Note",
        content: "Body",
        tags: [123],
        updatedAt: "2026-11-16",
        serverCreatedAt: NOW,
        serverUpdatedAt: NOW,
      },
      BASE_CTX
    );
    assert.equal(res.allowed, false);
  });

  it("9. Rejects subcollection note creation when parent user doc does not exist", () => {
    const payload = buildNotePayload(
      "user_abc_123",
      {
        id: "n1",
        title: "Note",
        content: "Body",
        tags: ["dsa"],
        updatedAt: "2026-11-16",
      },
      NOW,
      NOW
    );
    const res = evaluateRuleCompliance(
      "StudyNote",
      { userId: "user_abc_123", docId: "n1" },
      payload,
      { ...BASE_CTX, parentUserExists: false }
    );
    assert.equal(res.allowed, false);
  });

  it("10. Rejects orphaned ChatMessage when parent ChatThread does not exist", () => {
    const payload = buildMessagePayload(
      "user_abc_123",
      {
        id: "m1",
        role: "user",
        content: "Hello",
        createdAt: "2026-11-16",
      },
      NOW
    );
    const res = evaluateRuleCompliance(
      "ChatMessage",
      { userId: "user_abc_123", docId: "m1", threadId: "t1" },
      payload,
      { ...BASE_CTX, parentThreadExists: false }
    );
    assert.equal(res.allowed, false);
  });

  it("11. Rejects update or raw base64 image shadow field on ChatMessage", () => {
    const payload = {
      ...buildMessagePayload(
        "user_abc_123",
        {
          id: "m1",
          role: "user",
          content: "Hello",
          createdAt: "2026-11-16",
        },
        NOW
      ),
      image: "data:image/png;base64,AAAA...",
    };
    const shadowRes = evaluateRuleCompliance(
      "ChatMessage",
      { userId: "user_abc_123", docId: "m1", threadId: "t1" },
      payload,
      BASE_CTX
    );
    assert.equal(shadowRes.allowed, false);

    const updateRes = evaluateRuleCompliance(
      "ChatMessage",
      { userId: "user_abc_123", docId: "m1", threadId: "t1" },
      buildMessagePayload(
        "user_abc_123",
        { id: "m1", role: "user", content: "Edited", createdAt: "2026-11-16" },
        NOW
      ),
      BASE_CTX,
      "update"
    );
    assert.equal(updateRes.allowed, false);
  });

  it("12. Rejects impossible QuizAttempt scores (correct > total or percentage > 100)", () => {
    const res = evaluateRuleCompliance(
      "QuizAttempt",
      { userId: "user_abc_123", docId: "q1" },
      {
        userId: "user_abc_123",
        id: "q1",
        topicId: "dsa-core",
        topicTitle: "DSA",
        correct: 10,
        total: 4,
        percentage: 250,
        completedAt: "2026-11-16",
        serverCreatedAt: NOW,
      },
      BASE_CTX
    );
    assert.equal(res.allowed, false);
  });

  it("Accepts properly sanitized payloads generated by firestoreSanitizer", () => {
    const profilePayload = buildProfilePayload(
      "user_abc_123",
      {
        name: "Jashwanth",
        handle: "jashwanth",
        email: "jashinspires@gmail.com",
        bio: "Learning systems",
        dailyFocusTask: "Finish BFS",
        dailyFocusCompleted: false,
        dailyTargetMinutes: 45,
        isSignedIn: true,
      },
      "thread-welcome",
      NOW,
      NOW
    );
    assert.equal(
      evaluateRuleCompliance(
        "UserProfile",
        { userId: "user_abc_123", docId: "user_abc_123" },
        profilePayload,
        BASE_CTX
      ).allowed,
      true
    );

    const quizPayload = buildQuizAttemptPayload(
      "user_abc_123",
      {
        id: "quiz-1",
        topicId: "dsa-core",
        topicTitle: "Data Structures & Algorithms",
        correct: 3,
        total: 4,
        percentage: 75,
        completedAt: "2026-11-16",
      },
      NOW
    );
    assert.equal(
      evaluateRuleCompliance(
        "QuizAttempt",
        { userId: "user_abc_123", docId: "quiz-1" },
        quizPayload,
        BASE_CTX
      ).allowed,
      true
    );

    const dayPayload = buildActivityDayPayload("user_abc_123", "2026-11-16", 3, NOW, NOW);
    assert.equal(dayPayload.count, 3);
  });
});
