import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import {
  CheckCircle2,
  Layers,
  RotateCcw,
  Sparkles,
  XCircle,
} from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { SEED_QUIZ_QUESTIONS } from "@/data/seedData";
import { scoreQuizAttempt } from "@/lib/studyLogic";
import type { QuizQuestion } from "@/lib/studyTypes";
import { useStudy } from "@/store/StudyContext";
import { generateAiQuiz } from "@/utils/aiClient";
import { useToast } from "@/hooks/use-toast";

type PracticeMode = "quiz" | "flashcards";

const Practice: React.FC = () => {
  const [searchParams] = useSearchParams();
  const initialTopic = searchParams.get("topic") || "dsa-core";

  const { state, toggleFlashcardMastered, recordQuizAttempt } = useStudy();
  const { toast } = useToast();

  const [mode, setMode] = useState<PracticeMode>("quiz");
  const [selectedTopicId, setSelectedTopicId] = useState<string>(initialTopic);
  const [customTopicInput, setCustomTopicInput] = useState("");
  const [activeQuestions, setActiveQuestions] = useState<QuizQuestion[]>([]);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, number>>({});
  const [submittedQuiz, setSubmittedQuiz] = useState(false);
  const [isGeneratingQuiz, setIsGeneratingQuiz] = useState(false);

  // Flashcard state
  const [cardIndex, setCardIndex] = useState(0);
  const [cardFlipped, setCardFlipped] = useState(false);

  const selectedGoal = state.goals.find((g) => g.id === selectedTopicId);

  useEffect(() => {
    const topicQuestions = SEED_QUIZ_QUESTIONS.filter(
      (q) => q.topicId === selectedTopicId
    );
    setActiveQuestions(
      topicQuestions.length > 0 ? topicQuestions : SEED_QUIZ_QUESTIONS.slice(0, 4)
    );
    setSelectedAnswers({});
    setSubmittedQuiz(false);
    setCardIndex(0);
    setCardFlipped(false);
  }, [selectedTopicId]);

  const topicFlashcards = state.flashcards.filter(
    (c) => c.topicId === selectedTopicId
  );
  const deck =
    topicFlashcards.length > 0 ? topicFlashcards : state.flashcards;
  const currentCard = deck[cardIndex % Math.max(1, deck.length)];

  const handleSelectOption = (questionId: string, optionIdx: number) => {
    if (submittedQuiz) return;
    setSelectedAnswers((prev) => ({ ...prev, [questionId]: optionIdx }));
  };

  const handleSubmitQuiz = () => {
    if (activeQuestions.length === 0) return;
    const result = scoreQuizAttempt(activeQuestions, selectedAnswers);
    setSubmittedQuiz(true);
    recordQuizAttempt({
      topicId: selectedTopicId,
      topicTitle: selectedGoal?.title || customTopicInput || "Custom Topic",
      correct: result.correct,
      total: result.total,
      percentage: result.percentage,
    });
    toast({
      title: `Quiz complete: ${result.correct}/${result.total}`,
      description: `Scored ${result.percentage}% — logged to your study activity.`,
    });
  };

  const handleGenerateCustomQuiz = async (e: React.FormEvent) => {
    e.preventDefault();
    const topic = customTopicInput.trim() || selectedGoal?.title;
    if (!topic) return;
    setIsGeneratingQuiz(true);
    const res = await generateAiQuiz(topic, 4);
    setIsGeneratingQuiz(false);

    if (res.error || res.questions.length === 0) {
      toast({
        title: "Could not generate AI quiz",
        description:
          res.error || "Using built-in topic questions for immediate practice.",
        variant: "destructive",
      });
      return;
    }

    setActiveQuestions(res.questions);
    setSelectedAnswers({});
    setSubmittedQuiz(false);
    toast({
      title: "Fresh quiz ready",
      description: `Generated 4 concept checks on "${topic}".`,
    });
  };

  const quizScore = scoreQuizAttempt(activeQuestions, selectedAnswers);
  const allAnswered =
    activeQuestions.length > 0 &&
    activeQuestions.every((q) => selectedAnswers[q.id] !== undefined);

  return (
    <AppShell>
      <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
        <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <div>
            <h1 className="font-heading text-3xl font-extrabold text-[#D6E3E4] sm:text-4xl">
              Active <span className="text-[#F6FF81]">Self-Testing</span>
            </h1>
            <p className="mt-2 text-sm text-[#94A3A5] sm:text-base">
              Verify what you actually retained with instant concept quizzes and active-recall flashcards.
            </p>
          </div>

          {/* Mode Segmented Toggle */}
          <div
            role="tablist"
            aria-label="Practice mode"
            className="inline-flex rounded-lg border border-[#232929] bg-[#0B0D0D] p-1 self-start"
          >
            <button
              type="button"
              role="tab"
              aria-selected={mode === "quiz"}
              onClick={() => setMode("quiz")}
              className={`rounded-md px-4 py-2 text-xs font-semibold transition-colors whitespace-nowrap ${
                mode === "quiz"
                  ? "bg-[#31CB53] text-black"
                  : "text-[#94A3A5] hover:text-[#D6E3E4]"
              }`}
            >
              Quick Quiz
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={mode === "flashcards"}
              onClick={() => setMode("flashcards")}
              className={`rounded-md px-4 py-2 text-xs font-semibold transition-colors whitespace-nowrap ${
                mode === "flashcards"
                  ? "bg-[#F6FF81] text-black"
                  : "text-[#94A3A5] hover:text-[#D6E3E4]"
              }`}
            >
              Flashcards ({deck.length})
            </button>
          </div>
        </div>

        {/* Topic Selection + Custom AI Generator */}
        <div className="mt-8 grid grid-cols-1 gap-4 rounded-xl border border-[#232929] bg-[#0B0D0D] p-5 md:grid-cols-12 md:items-end">
          <div className="md:col-span-5">
            <label
              htmlFor="practice-topic"
              className="block text-xs font-medium text-[#94A3A5]"
            >
              Select Study Path
            </label>
            <select
              id="practice-topic"
              value={selectedTopicId}
              onChange={(e) => setSelectedTopicId(e.target.value)}
              className="mt-1.5 w-full rounded-lg border border-[#232929] bg-black px-3 py-2.5 text-sm text-[#D6E3E4] focus:border-[#31CB53] focus:outline-none"
            >
              {state.goals.map((g) => (
                <option key={g.id} value={g.id}>
                  {g.title}
                </option>
              ))}
            </select>
          </div>

          {mode === "quiz" && (
            <form
              onSubmit={handleGenerateCustomQuiz}
              className="md:col-span-7 flex flex-col gap-2 sm:flex-row sm:items-end"
            >
              <div className="flex-1">
                <label
                  htmlFor="custom-quiz-topic"
                  className="block text-xs font-medium text-[#94A3A5]"
                >
                  Or generate fresh AI questions on any topic
                </label>
                <input
                  id="custom-quiz-topic"
                  type="text"
                  value={customTopicInput}
                  onChange={(e) => setCustomTopicInput(e.target.value)}
                  placeholder="e.g. Binary Trees, CSS Grid, Attention..."
                  className="mt-1.5 w-full rounded-lg border border-[#232929] bg-black px-3.5 py-2.5 text-sm text-[#D6E3E4] placeholder:text-[#667375] focus:border-[#31CB53] focus:outline-none"
                />
              </div>
              <button
                type="submit"
                disabled={isGeneratingQuiz}
                className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-[#D6E3E4] px-4 py-2.5 text-xs font-semibold text-black hover:bg-[#F6FF81] disabled:opacity-50 whitespace-nowrap"
              >
                <Sparkles className="h-3.5 w-3.5" />
                {isGeneratingQuiz ? "Generating..." : "Generate Quiz"}
              </button>
            </form>
          )}
        </div>

        {/* QUIZ MODE */}
        {mode === "quiz" && (
          <div className="mt-8 space-y-5">
            {submittedQuiz && (
              <div className="rounded-xl bg-[#D6E3E4] p-6 text-black flex flex-wrap items-center justify-between gap-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-[#2A3435]">
                    Quiz Result
                  </p>
                  <h2 className="mt-1 font-heading text-2xl font-extrabold tabular-nums">
                    {quizScore.correct} / {quizScore.total} Correct ({quizScore.percentage}%)
                  </h2>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedAnswers({});
                    setSubmittedQuiz(false);
                  }}
                  className="inline-flex items-center gap-2 rounded-lg bg-black px-4 py-2.5 text-xs font-semibold text-[#D6E3E4] hover:bg-[#1E2525]"
                >
                  <RotateCcw className="h-3.5 w-3.5" />
                  Retake Quiz
                </button>
              </div>
            )}

            {activeQuestions.map((q, idx) => {
              const chosen = selectedAnswers[q.id];
              return (
                <div
                  key={q.id}
                  className="rounded-xl border border-[#232929] bg-[#0B0D0D] p-6"
                >
                  <p className="text-xs font-mono text-[#94A3A5]">
                    Question {String(idx + 1).padStart(2, "0")} of{" "}
                    {String(activeQuestions.length).padStart(2, "0")}
                  </p>
                  <h3 className="mt-2 font-heading text-lg font-bold text-[#D6E3E4]">
                    {q.question}
                  </h3>

                  <div className="mt-4 space-y-2.5">
                    {q.options.map((opt, oIdx) => {
                      const isChosen = chosen === oIdx;
                      const isRight = q.correctIndex === oIdx;

                      let buttonStyle =
                        "border-[#232929] bg-black text-[#D6E3E4] hover:border-[#D6E3E4]/50";
                      if (!submittedQuiz && isChosen) {
                        buttonStyle =
                          "border-[#F6FF81] bg-[#16190B] text-[#F6FF81]";
                      } else if (submittedQuiz && isRight) {
                        buttonStyle =
                          "border-[#31CB53] bg-[#0A170E] text-[#31CB53]";
                      } else if (submittedQuiz && isChosen && !isRight) {
                        buttonStyle =
                          "border-red-500/70 bg-red-950/30 text-red-300";
                      }

                      return (
                        <button
                          key={oIdx}
                          type="button"
                          onClick={() => handleSelectOption(q.id, oIdx)}
                          className={`flex w-full items-center justify-between gap-3 rounded-lg border px-4 py-3 text-left text-sm transition-colors ${buttonStyle}`}
                        >
                          <span>{opt}</span>
                          {submittedQuiz && isRight && (
                            <CheckCircle2 className="h-4 w-4 shrink-0 text-[#31CB53]" />
                          )}
                          {submittedQuiz && isChosen && !isRight && (
                            <XCircle className="h-4 w-4 shrink-0 text-red-400" />
                          )}
                        </button>
                      );
                    })}
                  </div>

                  {submittedQuiz && (
                    <div className="mt-4 rounded-lg border border-[#1E2424] bg-black px-4 py-3 text-xs leading-relaxed text-[#D6E3E4]">
                      <span className="font-semibold text-[#F6FF81]">
                        Why:{" "}
                      </span>
                      {q.explanation}
                    </div>
                  )}
                </div>
              );
            })}

            {!submittedQuiz && (
              <div className="flex justify-end pt-2">
                <button
                  type="button"
                  disabled={!allAnswered}
                  onClick={handleSubmitQuiz}
                  className="rounded-lg bg-[#31CB53] px-6 py-3 text-sm font-semibold text-black hover:bg-[#29b347] disabled:opacity-40"
                >
                  Check Answers
                </button>
              </div>
            )}
          </div>
        )}

        {/* FLASHCARDS MODE */}
        {mode === "flashcards" && currentCard && (
          <div className="mt-8 mx-auto max-w-2xl">
            <div className="mb-4 flex items-center justify-between text-xs text-[#94A3A5]">
              <span className="font-mono tabular-nums">
                Card {(cardIndex % deck.length) + 1} of {deck.length}
              </span>
              <span className="font-mono tabular-nums">
                Mastered: {deck.filter((c) => c.mastered).length}/{deck.length}
              </span>
            </div>

            <button
              type="button"
              onClick={() => setCardFlipped((f) => !f)}
              aria-label={cardFlipped ? "Show flashcard question" : "Reveal flashcard answer"}
              className="w-full min-h-[260px] rounded-2xl bg-[#D6E3E4] p-8 text-left text-black transition-transform duration-150 hover:-translate-y-0.5 flex flex-col justify-between"
            >
              <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-[#2A3435]">
                <span>{cardFlipped ? "Answer" : "Prompt"}</span>
                <span className="inline-flex items-center gap-1">
                  <Layers className="h-3.5 w-3.5" />
                  Click to flip
                </span>
              </div>

              <p className="my-6 font-heading text-xl font-bold leading-snug text-black sm:text-2xl">
                {cardFlipped ? currentCard.back : currentCard.front}
              </p>

              <div className="text-xs font-medium text-[#2A3435]">
                Status: {currentCard.mastered ? "Mastered" : "Needs review"}
              </div>
            </button>

            <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setCardIndex((i) => (i - 1 + deck.length) % deck.length);
                    setCardFlipped(false);
                  }}
                  className="rounded-lg border border-[#232929] bg-[#0B0D0D] px-4 py-2.5 text-xs font-medium text-[#D6E3E4] hover:border-[#D6E3E4]"
                >
                  Previous
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setCardIndex((i) => (i + 1) % deck.length);
                    setCardFlipped(false);
                  }}
                  className="rounded-lg border border-[#232929] bg-[#0B0D0D] px-4 py-2.5 text-xs font-medium text-[#D6E3E4] hover:border-[#D6E3E4]"
                >
                  Next Card
                </button>
              </div>

              <button
                type="button"
                onClick={() => {
                  toggleFlashcardMastered(currentCard.id);
                  setCardIndex((i) => (i + 1) % deck.length);
                  setCardFlipped(false);
                }}
                className="rounded-lg bg-[#31CB53] px-5 py-2.5 text-xs font-semibold text-black hover:bg-[#29b347]"
              >
                {currentCard.mastered ? "Unmark Mastered" : "Got It — Mark Mastered"}
              </button>
            </div>
          </div>
        )}
      </div>
    </AppShell>
  );
};

export default Practice;
