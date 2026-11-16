import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import {
  onAuthStateChanged,
  signInWithPopup,
  signOut,
  type User,
} from "firebase/auth";
import {
  collection,
  deleteDoc,
  deleteField,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
  writeBatch,
  type Unsubscribe,
} from "firebase/firestore";
import { createInitialStudyState } from "@/data/seedData";
import {
  auth,
  db,
  googleProvider,
  handleFirestoreError,
  OperationType,
} from "@/lib/firebase";
import {
  buildActivityDayPayload,
  buildFlashcardPayload,
  buildGoalPayload,
  buildMessagePayload,
  buildNotePayload,
  buildProfilePayload,
  buildQuizAttemptPayload,
  buildThreadPayload,
  sanitizeHandle,
  sanitizeId,
} from "@/lib/firestoreSanitizer";
import {
  createCustomGoal,
  CreateCustomGoalInput,
  formatIsoDate,
} from "@/lib/studyLogic";
import type {
  ChatMessage,
  ChatThread,
  Flashcard,
  LearnerProfile,
  QuizAttemptSummary,
  StudyGoal,
  StudyNote,
  StudyState,
  TutorMode,
} from "@/lib/studyTypes";

const STORAGE_KEY = "seediq-study-state-v1";

export type SyncStatus = "local" | "syncing" | "synced" | "error";

interface StudyContextValue {
  state: StudyState;
  todayIso: string;
  authUser: User | null;
  authReady: boolean;
  syncStatus: SyncStatus;
  updateProfile: (patch: Partial<LearnerProfile>) => void;
  toggleDailyFocus: () => void;
  toggleMilestone: (goalId: string, milestoneId: string) => void;
  toggleGoalActive: (goalId: string) => void;
  addCustomGoal: (input: CreateCustomGoalInput) => StudyGoal;
  deleteGoal: (goalId: string) => void;
  createThread: (opts?: {
    title?: string;
    goalId?: string;
    mode?: TutorMode;
  }) => ChatThread;
  selectThread: (threadId: string) => void;
  deleteThread: (threadId: string) => void;
  updateThreadMode: (threadId: string, mode: TutorMode) => void;
  updateThreadGoal: (threadId: string, goalId?: string) => void;
  appendMessageToThread: (threadId: string, message: ChatMessage) => void;
  createNote: (input: {
    title: string;
    content: string;
    goalId?: string;
    tags?: string[];
  }) => StudyNote;
  updateNote: (
    noteId: string,
    patch: Partial<Omit<StudyNote, "id">>
  ) => void;
  deleteNote: (noteId: string) => void;
  toggleFlashcardMastered: (cardId: string) => void;
  recordQuizAttempt: (
    attempt: Omit<QuizAttemptSummary, "id" | "completedAt">
  ) => void;
  signInWithGoogle: () => Promise<void>;
  signOutUser: () => Promise<void>;
  resetWorkspace: () => Promise<void>;
}

const StudyContext = createContext<StudyContextValue | undefined>(undefined);

function loadLocalState(): StudyState {
  if (typeof window === "undefined") {
    return createInitialStudyState();
  }
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return createInitialStudyState();
    const parsed = JSON.parse(raw) as StudyState;
    if (!parsed || !Array.isArray(parsed.goals) || !parsed.profile) {
      return createInitialStudyState();
    }
    return {
      ...parsed,
      profile: {
        ...parsed.profile,
        isSignedIn: false,
      },
    };
  } catch {
    return createInitialStudyState();
  }
}

export const StudyProvider = ({ children }: { children: React.ReactNode }) => {
  const [state, setState] = useState<StudyState>(loadLocalState);
  const [authUser, setAuthUser] = useState<User | null>(null);
  const [authReady, setAuthReady] = useState(false);
  const [syncStatus, setSyncStatus] = useState<SyncStatus>("local");

  const todayIso = formatIsoDate(new Date());
  const stateRef = useRef(state);
  stateRef.current = state;

  // Keep uploaded session image previews in memory so Firestore docs stay compact (<1MB)
  const sessionImagesRef = useRef<Record<string, string>>({});

  // Persist guest workspace in localStorage whenever signed out
  useEffect(() => {
    if (authUser) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      // Ignore storage quota errors
    }
  }, [state, authUser]);

  const bumpLocalActivity = (
    prevLog: Record<string, number>,
    delta = 1
  ): Record<string, number> => ({
    ...prevLog,
    [todayIso]: Math.max(0, (prevLog[todayIso] ?? 0) + delta),
  });

  const syncActivityDay = useCallback(
    async (uid: string, nextCount: number, existedBefore: boolean) => {
      const dayPath = `users/${uid}/activityDays/${todayIso}`;
      const dayRef = doc(db, "users", uid, "activityDays", todayIso);
      const boundedCount = Math.max(0, Math.min(10000, Math.round(nextCount)));
      if (existedBefore) {
        try {
          await updateDoc(dayRef, {
            count: boundedCount,
            serverUpdatedAt: serverTimestamp(),
          });
        } catch (err) {
          handleFirestoreError(err, OperationType.UPDATE, dayPath);
        }
      } else {
        try {
          await setDoc(
            dayRef,
            buildActivityDayPayload(
              uid,
              todayIso,
              boundedCount,
              serverTimestamp(),
              serverTimestamp()
            )
          );
        } catch (err) {
          handleFirestoreError(err, OperationType.CREATE, dayPath);
        }
      }
    },
    [todayIso]
  );

  const seedCloudWorkspace = useCallback(
    async (user: User, sourceState: StudyState) => {
      const uid = user.uid;
      const batch = writeBatch(db);
      const displayName =
        user.displayName?.trim() ||
        (sourceState.profile.name !== "Learner"
          ? sourceState.profile.name
          : user.email?.split("@")[0]) ||
        "Learner";
      const profile: LearnerProfile = {
        ...sourceState.profile,
        name: displayName,
        handle: sanitizeHandle(displayName),
        email: user.email || sourceState.profile.email || "",
        isSignedIn: true,
      };

      const activeThreadId =
        sourceState.threads[0]?.id || sourceState.activeThreadId || "thread-welcome";

      batch.set(
        doc(db, "users", uid),
        buildProfilePayload(
          uid,
          profile,
          activeThreadId,
          serverTimestamp(),
          serverTimestamp()
        )
      );

      for (const goal of sourceState.goals) {
        const cleanGoalId = sanitizeId(goal.id, "goal");
        batch.set(
          doc(db, "users", uid, "goals", cleanGoalId),
          buildGoalPayload(
            uid,
            { ...goal, id: cleanGoalId },
            serverTimestamp(),
            serverTimestamp()
          )
        );
      }

      for (const note of sourceState.notes) {
        const cleanNoteId = sanitizeId(note.id, "note");
        batch.set(
          doc(db, "users", uid, "notes", cleanNoteId),
          buildNotePayload(
            uid,
            { ...note, id: cleanNoteId },
            serverTimestamp(),
            serverTimestamp()
          )
        );
      }

      for (const thread of sourceState.threads) {
        const cleanThreadId = sanitizeId(thread.id, "thread");
        batch.set(
          doc(db, "users", uid, "threads", cleanThreadId),
          buildThreadPayload(
            uid,
            { ...thread, id: cleanThreadId },
            serverTimestamp(),
            serverTimestamp()
          )
        );
        for (const msg of thread.messages) {
          const cleanMsgId = sanitizeId(msg.id, "msg");
          batch.set(
            doc(db, "users", uid, "threads", cleanThreadId, "messages", cleanMsgId),
            buildMessagePayload(
              uid,
              { ...msg, id: cleanMsgId },
              serverTimestamp()
            )
          );
        }
      }

      for (const card of sourceState.flashcards) {
        const cleanCardId = sanitizeId(card.id, "fc");
        batch.set(
          doc(db, "users", uid, "flashcards", cleanCardId),
          buildFlashcardPayload(
            uid,
            { ...card, id: cleanCardId },
            serverTimestamp(),
            serverTimestamp()
          )
        );
      }

      for (const attempt of sourceState.quizHistory) {
        const cleanAttemptId = sanitizeId(attempt.id, "quiz");
        batch.set(
          doc(db, "users", uid, "quizAttempts", cleanAttemptId),
          buildQuizAttemptPayload(
            uid,
            { ...attempt, id: cleanAttemptId },
            serverTimestamp()
          )
        );
      }

      for (const [dateIso, count] of Object.entries(sourceState.activityLog)) {
        if (/^[0-9]{4}-[0-9]{2}-[0-9]{2}$/.test(dateIso)) {
          batch.set(
            doc(db, "users", uid, "activityDays", dateIso),
            buildActivityDayPayload(
              uid,
              dateIso,
              count,
              serverTimestamp(),
              serverTimestamp()
            )
          );
        }
      }

      try {
        await batch.commit();
      } catch (err) {
        handleFirestoreError(err, OperationType.WRITE, `users/${uid}`);
      }
    },
    []
  );

  // Firebase Auth & real-time Firestore subscription lifecycle
  useEffect(() => {
    let active = true;
    const unsubs: Unsubscribe[] = [];
    const messageUnsubs = new Map<string, Unsubscribe>();

    const cleanupListeners = () => {
      while (unsubs.length > 0) {
        const u = unsubs.pop();
        u?.();
      }
      for (const u of messageUnsubs.values()) {
        u();
      }
      messageUnsubs.clear();
    };

    const unsubAuth = onAuthStateChanged(auth, async (user) => {
      cleanupListeners();
      if (!active) return;

      setAuthUser(user);
      setAuthReady(true);

      if (!user) {
        setSyncStatus("local");
        setState(loadLocalState());
        return;
      }

      setSyncStatus("syncing");
      const uid = user.uid;
      const userPath = `users/${uid}`;

      try {
        const userSnap = await getDoc(doc(db, "users", uid));
        if (!active) return;
        if (!userSnap.exists()) {
          await seedCloudWorkspace(user, stateRef.current);
        }
      } catch (err) {
        setSyncStatus("error");
        handleFirestoreError(err, OperationType.GET, userPath);
      }

      if (!active) return;

      // 1. User Profile listener
      unsubs.push(
        onSnapshot(
          doc(db, "users", uid),
          (snap) => {
            if (!snap.exists()) return;
            const d = snap.data();
            setState((prev) => ({
              ...prev,
              activeThreadId:
                typeof d.activeThreadId === "string" && d.activeThreadId
                  ? d.activeThreadId
                  : prev.activeThreadId,
              profile: {
                name: d.name || user.displayName || "Learner",
                handle: d.handle || "study-desk",
                email: d.email || user.email || "",
                bio: d.bio ?? "",
                dailyFocusTask:
                  d.dailyFocusTask || "Complete one focused study milestone",
                dailyFocusCompleted: Boolean(d.dailyFocusCompleted),
                dailyTargetMinutes: Number(d.dailyTargetMinutes) || 45,
                isSignedIn: true,
              },
            }));
            setSyncStatus("synced");
          },
          (error) => {
            setSyncStatus("error");
            handleFirestoreError(error, OperationType.GET, userPath);
          }
        )
      );

      // 2. Goals listener
      const goalsPath = `users/${uid}/goals`;
      unsubs.push(
        onSnapshot(
          query(collection(db, "users", uid, "goals"), where("userId", "==", uid)),
          (snap) => {
            const goals: StudyGoal[] = snap.docs
              .map((docSnap) => {
                const d = docSnap.data();
                return {
                  id: d.id,
                  title: d.title,
                  category: d.category,
                  description: d.description,
                  weeklyHoursTarget: d.weeklyHoursTarget,
                  isActive: Boolean(d.isActive),
                  createdAt: d.createdAt,
                  milestones: Array.isArray(d.milestones) ? d.milestones : [],
                } as StudyGoal;
              })
              .sort((a, b) => b.createdAt.localeCompare(a.createdAt));

            setState((prev) => ({ ...prev, goals }));
          },
          (error) => {
            handleFirestoreError(error, OperationType.LIST, goalsPath);
          }
        )
      );

      // 3. Notes listener
      const notesPath = `users/${uid}/notes`;
      unsubs.push(
        onSnapshot(
          query(collection(db, "users", uid, "notes"), where("userId", "==", uid)),
          (snap) => {
            const notes: StudyNote[] = snap.docs
              .map((docSnap) => {
                const d = docSnap.data();
                return {
                  id: d.id,
                  title: d.title,
                  content: d.content,
                  goalId: d.goalId,
                  tags: Array.isArray(d.tags) ? d.tags : [],
                  updatedAt: d.updatedAt,
                } as StudyNote;
              })
              .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));

            setState((prev) => ({ ...prev, notes }));
          },
          (error) => {
            handleFirestoreError(error, OperationType.LIST, notesPath);
          }
        )
      );

      // 4. Threads + per-thread Messages listeners
      const threadsPath = `users/${uid}/threads`;
      unsubs.push(
        onSnapshot(
          query(collection(db, "users", uid, "threads"), where("userId", "==", uid)),
          (snap) => {
            const threadHeaders = snap.docs.map((docSnap) => {
              const d = docSnap.data();
              return {
                id: d.id as string,
                title: d.title as string,
                goalId: d.goalId as string | undefined,
                mode: d.mode as TutorMode,
                updatedAt: d.updatedAt as string,
              };
            });

            const activeIds = new Set(threadHeaders.map((t) => t.id));
            for (const [tid, unsubMsg] of messageUnsubs.entries()) {
              if (!activeIds.has(tid)) {
                unsubMsg();
                messageUnsubs.delete(tid);
              }
            }

            setState((prev) => {
              const existingMsgs = new Map(
                prev.threads.map((t) => [t.id, t.messages])
              );
              const nextThreads: ChatThread[] = threadHeaders
                .map((h) => ({
                  ...h,
                  messages: existingMsgs.get(h.id) || [],
                }))
                .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));

              const nextActiveId = nextThreads.some(
                (t) => t.id === prev.activeThreadId
              )
                ? prev.activeThreadId
                : nextThreads[0]?.id || "";

              return {
                ...prev,
                threads: nextThreads,
                activeThreadId: nextActiveId,
              };
            });

            for (const header of threadHeaders) {
              if (messageUnsubs.has(header.id)) continue;
              const msgPath = `users/${uid}/threads/${header.id}/messages`;
              const unsubMsg = onSnapshot(
                query(
                  collection(db, "users", uid, "threads", header.id, "messages"),
                  where("userId", "==", uid)
                ),
                (msgSnap) => {
                  const msgs: ChatMessage[] = msgSnap.docs
                    .map((mDoc) => {
                      const md = mDoc.data();
                      const serverSec =
                        md.serverCreatedAt &&
                        typeof md.serverCreatedAt.toMillis === "function"
                          ? md.serverCreatedAt.toMillis()
                          : 0;
                      return {
                        sortKey: serverSec,
                        msg: {
                          id: md.id as string,
                          role: md.role as "user" | "assistant",
                          content: md.content as string,
                          image: sessionImagesRef.current[md.id],
                          createdAt: md.createdAt as string,
                        } satisfies ChatMessage,
                      };
                    })
                    .sort((a, b) => a.sortKey - b.sortKey)
                    .map((item) => item.msg);

                  setState((prev) => ({
                    ...prev,
                    threads: prev.threads.map((t) =>
                      t.id === header.id ? { ...t, messages: msgs } : t
                    ),
                  }));
                },
                (error) => {
                  handleFirestoreError(error, OperationType.LIST, msgPath);
                }
              );
              messageUnsubs.set(header.id, unsubMsg);
            }
          },
          (error) => {
            handleFirestoreError(error, OperationType.LIST, threadsPath);
          }
        )
      );

      // 5. Flashcards listener
      const cardsPath = `users/${uid}/flashcards`;
      unsubs.push(
        onSnapshot(
          query(
            collection(db, "users", uid, "flashcards"),
            where("userId", "==", uid)
          ),
          (snap) => {
            const flashcards: Flashcard[] = snap.docs.map((docSnap) => {
              const d = docSnap.data();
              return {
                id: d.id,
                topicId: d.topicId,
                front: d.front,
                back: d.back,
                mastered: Boolean(d.mastered),
              };
            });
            setState((prev) => ({ ...prev, flashcards }));
          },
          (error) => {
            handleFirestoreError(error, OperationType.LIST, cardsPath);
          }
        )
      );

      // 6. Quiz Attempts listener
      const attemptsPath = `users/${uid}/quizAttempts`;
      unsubs.push(
        onSnapshot(
          query(
            collection(db, "users", uid, "quizAttempts"),
            where("userId", "==", uid)
          ),
          (snap) => {
            const quizHistory: QuizAttemptSummary[] = snap.docs
              .map((docSnap) => {
                const d = docSnap.data();
                return {
                  id: d.id,
                  topicId: d.topicId,
                  topicTitle: d.topicTitle,
                  correct: d.correct,
                  total: d.total,
                  percentage: d.percentage,
                  completedAt: d.completedAt,
                } as QuizAttemptSummary;
              })
              .sort((a, b) => b.completedAt.localeCompare(a.completedAt))
              .slice(0, 20);
            setState((prev) => ({ ...prev, quizHistory }));
          },
          (error) => {
            handleFirestoreError(error, OperationType.LIST, attemptsPath);
          }
        )
      );

      // 7. Activity Days listener
      const activityPath = `users/${uid}/activityDays`;
      unsubs.push(
        onSnapshot(
          query(
            collection(db, "users", uid, "activityDays"),
            where("userId", "==", uid)
          ),
          (snap) => {
            const activityLog: Record<string, number> = {};
            for (const docSnap of snap.docs) {
              const d = docSnap.data();
              if (typeof d.date === "string" && typeof d.count === "number") {
                activityLog[d.date] = d.count;
              }
            }
            setState((prev) => ({ ...prev, activityLog }));
          },
          (error) => {
            handleFirestoreError(error, OperationType.LIST, activityPath);
          }
        )
      );
    });

    return () => {
      active = false;
      unsubAuth();
      cleanupListeners();
    };
  }, [seedCloudWorkspace]);

  const updateProfile = (patch: Partial<LearnerProfile>) => {
    const merged: LearnerProfile = {
      ...stateRef.current.profile,
      ...patch,
    };
    setState((prev) => ({
      ...prev,
      profile: { ...prev.profile, ...patch },
    }));

    if (authUser) {
      const uid = authUser.uid;
      const userPath = `users/${uid}`;
      const updateFields: Record<string, unknown> = {
        updatedAt: serverTimestamp(),
      };
      if (patch.name !== undefined) {
        updateFields.name = merged.name.trim().slice(0, 80) || "Learner";
        updateFields.handle = sanitizeHandle(merged.name);
      }
      if (patch.bio !== undefined) {
        updateFields.bio = merged.bio.trim().slice(0, 300);
      }
      if (patch.dailyTargetMinutes !== undefined) {
        updateFields.dailyTargetMinutes = Math.max(
          10,
          Math.min(240, Math.round(patch.dailyTargetMinutes || 45))
        );
      }
      if (patch.dailyFocusTask !== undefined) {
        updateFields.dailyFocusTask =
          merged.dailyFocusTask.trim().slice(0, 200) ||
          "Complete one focused study milestone";
      }
      if (patch.dailyFocusCompleted !== undefined) {
        updateFields.dailyFocusCompleted = Boolean(patch.dailyFocusCompleted);
      }

      void updateDoc(doc(db, "users", uid), updateFields).catch((err) => {
        handleFirestoreError(err, OperationType.UPDATE, userPath);
      });
    }
  };

  const toggleDailyFocus = () => {
    const current = stateRef.current;
    const nextCompleted = !current.profile.dailyFocusCompleted;
    const existed = current.activityLog[todayIso] !== undefined;
    const nextCount = (current.activityLog[todayIso] ?? 0) + 1;

    setState((prev) => ({
      ...prev,
      profile: {
        ...prev.profile,
        dailyFocusCompleted: nextCompleted,
      },
      activityLog: nextCompleted
        ? bumpLocalActivity(prev.activityLog, 1)
        : prev.activityLog,
    }));

    if (authUser) {
      const uid = authUser.uid;
      void updateDoc(doc(db, "users", uid), {
        dailyFocusCompleted: nextCompleted,
        updatedAt: serverTimestamp(),
      }).catch((err) => {
        handleFirestoreError(err, OperationType.UPDATE, `users/${uid}`);
      });
      if (nextCompleted) {
        void syncActivityDay(uid, nextCount, existed);
      }
    }
  };

  const toggleMilestone = (goalId: string, milestoneId: string) => {
    const current = stateRef.current;
    const targetGoal = current.goals.find((g) => g.id === goalId);
    if (!targetGoal) return;

    let didComplete = false;
    const nextMilestones = targetGoal.milestones.map((m) => {
      if (m.id !== milestoneId) return m;
      didComplete = !m.completed;
      return { ...m, completed: !m.completed };
    });
    const updatedGoal: StudyGoal = {
      ...targetGoal,
      isActive: true,
      milestones: nextMilestones,
    };

    const existed = current.activityLog[todayIso] !== undefined;
    const nextCount = (current.activityLog[todayIso] ?? 0) + 1;

    setState((prev) => ({
      ...prev,
      goals: prev.goals.map((g) => (g.id === goalId ? updatedGoal : g)),
      activityLog: didComplete
        ? bumpLocalActivity(prev.activityLog, 1)
        : prev.activityLog,
    }));

    if (authUser) {
      const uid = authUser.uid;
      const sanitized = buildGoalPayload(
        uid,
        updatedGoal,
        serverTimestamp(),
        serverTimestamp()
      );
      void updateDoc(doc(db, "users", uid, "goals", goalId), {
        milestones: sanitized.milestones,
        isActive: true,
        serverUpdatedAt: serverTimestamp(),
      }).catch((err) => {
        handleFirestoreError(
          err,
          OperationType.UPDATE,
          `users/${uid}/goals/${goalId}`
        );
      });
      if (didComplete) {
        void syncActivityDay(uid, nextCount, existed);
      }
    }
  };

  const toggleGoalActive = (goalId: string) => {
    const targetGoal = stateRef.current.goals.find((g) => g.id === goalId);
    if (!targetGoal) return;
    const nextIsActive = !targetGoal.isActive;

    setState((prev) => ({
      ...prev,
      goals: prev.goals.map((g) =>
        g.id === goalId ? { ...g, isActive: nextIsActive } : g
      ),
    }));

    if (authUser) {
      const uid = authUser.uid;
      void updateDoc(doc(db, "users", uid, "goals", goalId), {
        isActive: nextIsActive,
        serverUpdatedAt: serverTimestamp(),
      }).catch((err) => {
        handleFirestoreError(
          err,
          OperationType.UPDATE,
          `users/${uid}/goals/${goalId}`
        );
      });
    }
  };

  const addCustomGoal = (input: CreateCustomGoalInput): StudyGoal => {
    const newGoal = createCustomGoal(input);
    const current = stateRef.current;
    const existed = current.activityLog[todayIso] !== undefined;
    const nextCount = (current.activityLog[todayIso] ?? 0) + 1;

    setState((prev) => ({
      ...prev,
      goals: [newGoal, ...prev.goals],
      activityLog: bumpLocalActivity(prev.activityLog, 1),
    }));

    if (authUser) {
      const uid = authUser.uid;
      void setDoc(
        doc(db, "users", uid, "goals", newGoal.id),
        buildGoalPayload(uid, newGoal, serverTimestamp(), serverTimestamp())
      ).catch((err) => {
        handleFirestoreError(
          err,
          OperationType.CREATE,
          `users/${uid}/goals/${newGoal.id}`
        );
      });
      void syncActivityDay(uid, nextCount, existed);
    }
    return newGoal;
  };

  const deleteGoal = (goalId: string) => {
    setState((prev) => ({
      ...prev,
      goals: prev.goals.filter((g) => g.id !== goalId),
    }));

    if (authUser) {
      const uid = authUser.uid;
      void deleteDoc(doc(db, "users", uid, "goals", goalId)).catch((err) => {
        handleFirestoreError(
          err,
          OperationType.DELETE,
          `users/${uid}/goals/${goalId}`
        );
      });
    }
  };

  const createThread = (opts?: {
    title?: string;
    goalId?: string;
    mode?: TutorMode;
  }): ChatThread => {
    const newThread: ChatThread = {
      id: `thread-${Date.now().toString(36)}`,
      title: opts?.title?.trim() || "New Study Session",
      goalId: opts?.goalId,
      mode: opts?.mode || "explain",
      updatedAt: todayIso,
      messages: [],
    };
    setState((prev) => ({
      ...prev,
      threads: [newThread, ...prev.threads],
      activeThreadId: newThread.id,
    }));

    if (authUser) {
      const uid = authUser.uid;
      void setDoc(
        doc(db, "users", uid, "threads", newThread.id),
        buildThreadPayload(uid, newThread, serverTimestamp(), serverTimestamp())
      ).catch((err) => {
        handleFirestoreError(
          err,
          OperationType.CREATE,
          `users/${uid}/threads/${newThread.id}`
        );
      });
      void updateDoc(doc(db, "users", uid), {
        activeThreadId: newThread.id,
        updatedAt: serverTimestamp(),
      }).catch((err) => {
        handleFirestoreError(err, OperationType.UPDATE, `users/${uid}`);
      });
    }
    return newThread;
  };

  const selectThread = (threadId: string) => {
    setState((prev) => ({
      ...prev,
      activeThreadId: threadId,
    }));

    if (authUser) {
      const uid = authUser.uid;
      void updateDoc(doc(db, "users", uid), {
        activeThreadId: sanitizeId(threadId, "thread-welcome"),
        updatedAt: serverTimestamp(),
      }).catch((err) => {
        handleFirestoreError(err, OperationType.UPDATE, `users/${uid}`);
      });
    }
  };

  const deleteThread = (threadId: string) => {
    const current = stateRef.current;
    const remaining = current.threads.filter((t) => t.id !== threadId);
    const fallback: ChatThread | null =
      remaining.length === 0
        ? {
            id: `thread-${Date.now().toString(36)}`,
            title: "New Study Session",
            mode: "explain",
            updatedAt: todayIso,
            messages: [],
          }
        : null;
    const nextActive = fallback
      ? fallback.id
      : current.activeThreadId === threadId
      ? remaining[0].id
      : current.activeThreadId;

    setState((prev) => ({
      ...prev,
      threads: fallback ? [fallback] : remaining,
      activeThreadId: nextActive,
    }));

    if (authUser) {
      const uid = authUser.uid;
      const runCloudDelete = async () => {
        try {
          const msgSnap = await getDocs(
            query(
              collection(db, "users", uid, "threads", threadId, "messages"),
              where("userId", "==", uid)
            )
          );
          const batch = writeBatch(db);
          for (const mDoc of msgSnap.docs) {
            batch.delete(mDoc.ref);
          }
          batch.delete(doc(db, "users", uid, "threads", threadId));
          if (fallback) {
            batch.set(
              doc(db, "users", uid, "threads", fallback.id),
              buildThreadPayload(
                uid,
                fallback,
                serverTimestamp(),
                serverTimestamp()
              )
            );
          }
          batch.update(doc(db, "users", uid), {
            activeThreadId: nextActive,
            updatedAt: serverTimestamp(),
          });
          await batch.commit();
        } catch (err) {
          handleFirestoreError(
            err,
            OperationType.DELETE,
            `users/${uid}/threads/${threadId}`
          );
        }
      };
      void runCloudDelete();
    }
  };

  const updateThreadMode = (threadId: string, mode: TutorMode) => {
    setState((prev) => ({
      ...prev,
      threads: prev.threads.map((t) =>
        t.id === threadId ? { ...t, mode } : t
      ),
    }));

    if (authUser) {
      const uid = authUser.uid;
      void updateDoc(doc(db, "users", uid, "threads", threadId), {
        mode,
        serverUpdatedAt: serverTimestamp(),
      }).catch((err) => {
        handleFirestoreError(
          err,
          OperationType.UPDATE,
          `users/${uid}/threads/${threadId}`
        );
      });
    }
  };

  const updateThreadGoal = (threadId: string, goalId?: string) => {
    setState((prev) => ({
      ...prev,
      threads: prev.threads.map((t) =>
        t.id === threadId ? { ...t, goalId } : t
      ),
    }));

    if (authUser) {
      const uid = authUser.uid;
      void updateDoc(doc(db, "users", uid, "threads", threadId), {
        goalId: goalId ? sanitizeId(goalId) : deleteField(),
        serverUpdatedAt: serverTimestamp(),
      }).catch((err) => {
        handleFirestoreError(
          err,
          OperationType.UPDATE,
          `users/${uid}/threads/${threadId}`
        );
      });
    }
  };

  const appendMessageToThread = (threadId: string, message: ChatMessage) => {
    if (message.image) {
      sessionImagesRef.current[message.id] = message.image;
    }

    const current = stateRef.current;
    const thread = current.threads.find((t) => t.id === threadId);
    const shouldRename =
      thread &&
      thread.messages.length === 0 &&
      message.role === "user" &&
      thread.title === "New Study Session";
    const nextTitle = shouldRename
      ? (
          message.content.slice(0, 42) +
          (message.content.length > 42 ? "..." : "")
        ).slice(0, 120)
      : thread?.title || "Study Session";

    const existed = current.activityLog[todayIso] !== undefined;
    const nextCount = (current.activityLog[todayIso] ?? 0) + 1;

    setState((prev) => ({
      ...prev,
      threads: prev.threads.map((t) => {
        if (t.id !== threadId) return t;
        return {
          ...t,
          title: nextTitle,
          updatedAt: todayIso,
          messages: [...t.messages, message],
        };
      }),
      activityLog:
        message.role === "user"
          ? bumpLocalActivity(prev.activityLog, 1)
          : prev.activityLog,
    }));

    if (authUser) {
      const uid = authUser.uid;
      const msgId = sanitizeId(message.id, `msg-${Date.now().toString(36)}`);
      void setDoc(
        doc(db, "users", uid, "threads", threadId, "messages", msgId),
        buildMessagePayload(uid, { ...message, id: msgId }, serverTimestamp())
      ).catch((err) => {
        handleFirestoreError(
          err,
          OperationType.CREATE,
          `users/${uid}/threads/${threadId}/messages/${msgId}`
        );
      });

      void updateDoc(doc(db, "users", uid, "threads", threadId), {
        title: nextTitle,
        updatedAt: todayIso,
        serverUpdatedAt: serverTimestamp(),
      }).catch((err) => {
        handleFirestoreError(
          err,
          OperationType.UPDATE,
          `users/${uid}/threads/${threadId}`
        );
      });

      if (message.role === "user") {
        void syncActivityDay(uid, nextCount, existed);
      }
    }
  };

  const createNote = (input: {
    title: string;
    content: string;
    goalId?: string;
    tags?: string[];
  }): StudyNote => {
    const note: StudyNote = {
      id: `note-${Date.now().toString(36)}`,
      title: input.title.trim() || "Untitled Study Note",
      content: input.content,
      goalId: input.goalId || undefined,
      tags: input.tags ?? [],
      updatedAt: todayIso,
    };

    const current = stateRef.current;
    const existed = current.activityLog[todayIso] !== undefined;
    const nextCount = (current.activityLog[todayIso] ?? 0) + 1;

    setState((prev) => ({
      ...prev,
      notes: [note, ...prev.notes],
      activityLog: bumpLocalActivity(prev.activityLog, 1),
    }));

    if (authUser) {
      const uid = authUser.uid;
      void setDoc(
        doc(db, "users", uid, "notes", note.id),
        buildNotePayload(uid, note, serverTimestamp(), serverTimestamp())
      ).catch((err) => {
        handleFirestoreError(
          err,
          OperationType.CREATE,
          `users/${uid}/notes/${note.id}`
        );
      });
      void syncActivityDay(uid, nextCount, existed);
    }

    return note;
  };

  const updateNote = (
    noteId: string,
    patch: Partial<Omit<StudyNote, "id">>
  ) => {
    const existing = stateRef.current.notes.find((n) => n.id === noteId);
    if (!existing) return;
    const merged: StudyNote = {
      ...existing,
      ...patch,
      updatedAt: todayIso,
    };

    setState((prev) => ({
      ...prev,
      notes: prev.notes.map((n) => (n.id === noteId ? merged : n)),
    }));

    if (authUser) {
      const uid = authUser.uid;
      const sanitized = buildNotePayload(
        uid,
        merged,
        serverTimestamp(),
        serverTimestamp()
      );
      const updateFields: Record<string, unknown> = {
        title: sanitized.title,
        content: sanitized.content,
        tags: sanitized.tags,
        updatedAt: sanitized.updatedAt,
        serverUpdatedAt: serverTimestamp(),
      };
      if (sanitized.goalId) {
        updateFields.goalId = sanitized.goalId;
      } else {
        updateFields.goalId = deleteField();
      }
      void updateDoc(doc(db, "users", uid, "notes", noteId), updateFields).catch(
        (err) => {
          handleFirestoreError(
            err,
            OperationType.UPDATE,
            `users/${uid}/notes/${noteId}`
          );
        }
      );
    }
  };

  const deleteNote = (noteId: string) => {
    setState((prev) => ({
      ...prev,
      notes: prev.notes.filter((n) => n.id !== noteId),
    }));

    if (authUser) {
      const uid = authUser.uid;
      void deleteDoc(doc(db, "users", uid, "notes", noteId)).catch((err) => {
        handleFirestoreError(
          err,
          OperationType.DELETE,
          `users/${uid}/notes/${noteId}`
        );
      });
    }
  };

  const toggleFlashcardMastered = (cardId: string) => {
    const current = stateRef.current;
    const card = current.flashcards.find((c) => c.id === cardId);
    if (!card) return;
    const nextMastered = !card.mastered;
    const existed = current.activityLog[todayIso] !== undefined;
    const nextCount = (current.activityLog[todayIso] ?? 0) + 1;

    setState((prev) => ({
      ...prev,
      flashcards: prev.flashcards.map((c) =>
        c.id === cardId ? { ...c, mastered: nextMastered } : c
      ),
      activityLog: bumpLocalActivity(prev.activityLog, 1),
    }));

    if (authUser) {
      const uid = authUser.uid;
      void updateDoc(doc(db, "users", uid, "flashcards", cardId), {
        mastered: nextMastered,
        serverUpdatedAt: serverTimestamp(),
      }).catch((err) => {
        handleFirestoreError(
          err,
          OperationType.UPDATE,
          `users/${uid}/flashcards/${cardId}`
        );
      });
      void syncActivityDay(uid, nextCount, existed);
    }
  };

  const recordQuizAttempt = (
    attempt: Omit<QuizAttemptSummary, "id" | "completedAt">
  ) => {
    const entry: QuizAttemptSummary = {
      ...attempt,
      id: `quiz-${Date.now().toString(36)}`,
      completedAt: todayIso,
    };
    const current = stateRef.current;
    const existed = current.activityLog[todayIso] !== undefined;
    const nextCount = (current.activityLog[todayIso] ?? 0) + 2;

    setState((prev) => ({
      ...prev,
      quizHistory: [entry, ...prev.quizHistory].slice(0, 20),
      activityLog: bumpLocalActivity(prev.activityLog, 2),
    }));

    if (authUser) {
      const uid = authUser.uid;
      void setDoc(
        doc(db, "users", uid, "quizAttempts", entry.id),
        buildQuizAttemptPayload(uid, entry, serverTimestamp())
      ).catch((err) => {
        handleFirestoreError(
          err,
          OperationType.CREATE,
          `users/${uid}/quizAttempts/${entry.id}`
        );
      });
      void syncActivityDay(uid, nextCount, existed);
    }
  };

  const signInWithGoogle = async () => {
    await signInWithPopup(auth, googleProvider);
  };

  const signOutUser = async () => {
    await signOut(auth);
  };

  const resetWorkspace = async () => {
    const fresh = createInitialStudyState();
    if (!authUser) {
      setState(fresh);
      return;
    }

    const uid = authUser.uid;
    setSyncStatus("syncing");
    try {
      const subcollections = [
        "goals",
        "notes",
        "flashcards",
        "quizAttempts",
        "activityDays",
      ] as const;
      const batch = writeBatch(db);

      for (const colName of subcollections) {
        const snap = await getDocs(
          query(collection(db, "users", uid, colName), where("userId", "==", uid))
        );
        for (const d of snap.docs) {
          batch.delete(d.ref);
        }
      }

      const threadSnap = await getDocs(
        query(collection(db, "users", uid, "threads"), where("userId", "==", uid))
      );
      for (const tDoc of threadSnap.docs) {
        const msgSnap = await getDocs(
          query(
            collection(db, "users", uid, "threads", tDoc.id, "messages"),
            where("userId", "==", uid)
          )
        );
        for (const mDoc of msgSnap.docs) {
          batch.delete(mDoc.ref);
        }
        batch.delete(tDoc.ref);
      }

      await batch.commit();
      await seedCloudWorkspace(authUser, fresh);
      setSyncStatus("synced");
    } catch (err) {
      setSyncStatus("error");
      handleFirestoreError(err, OperationType.WRITE, `users/${uid}`);
    }
  };

  return (
    <StudyContext.Provider
      value={{
        state,
        todayIso,
        authUser,
        authReady,
        syncStatus,
        updateProfile,
        toggleDailyFocus,
        toggleMilestone,
        toggleGoalActive,
        addCustomGoal,
        deleteGoal,
        createThread,
        selectThread,
        deleteThread,
        updateThreadMode,
        updateThreadGoal,
        appendMessageToThread,
        createNote,
        updateNote,
        deleteNote,
        toggleFlashcardMastered,
        recordQuizAttempt,
        signInWithGoogle,
        signOutUser,
        resetWorkspace,
      }}
    >
      {children}
    </StudyContext.Provider>
  );
};

export function useStudy() {
  const ctx = useContext(StudyContext);
  if (!ctx) {
    throw new Error("useStudy must be used within a StudyProvider");
  }
  return ctx;
}
