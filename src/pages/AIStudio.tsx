import React, { useEffect, useRef, useState } from "react";
import {
  BookmarkPlus,
  Brain,
  Image as ImageIcon,
  MessageSquare,
  Plus,
  Send,
  Trash2,
  X,
} from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import type { ChatMessage, TutorMode } from "@/lib/studyTypes";
import { useStudy } from "@/store/StudyContext";
import { fileToDataUrl, sendAiStudyMessage } from "@/utils/aiClient";
import { useToast } from "@/hooks/use-toast";

const TUTOR_MODES: Array<{ id: TutorMode; label: string; hint: string }> = [
  {
    id: "explain",
    label: "Guided Breakdown",
    hint: "Step-by-step intuition + 1 check question",
  },
  {
    id: "socratic",
    label: "Socratic Coach",
    hint: "Helps you reason to the answer yourself",
  },
  {
    id: "debug",
    label: "Debug & Review",
    hint: "Spot mistakes in code or problem attempts",
  },
  {
    id: "quiz-me",
    label: "Concept Check",
    hint: "Interactive scenario & feedback",
  },
];

const STARTER_PROMPTS = [
  "Explain recursion vs dynamic programming with a concrete example",
  "Why does React re-render a component, and when should I care?",
  "Give me a 2-minute intuition check on gradient descent",
];

function renderInlineFormatting(text: string): React.ReactNode[] {
  const tokens = text.split(/(\*\*[^*]+\*\*|`[^`]+`|\*[^*]+\*)/g);
  return tokens.map((token, idx) => {
    if (token.startsWith("**") && token.endsWith("**") && token.length > 4) {
      return (
        <strong key={idx} className="font-semibold text-[#F6FF81]">
          {token.slice(2, -2)}
        </strong>
      );
    }
    if (token.startsWith("`") && token.endsWith("`") && token.length > 2) {
      return (
        <code
          key={idx}
          className="rounded bg-[#161B1B] px-1.5 py-0.5 font-mono text-xs text-[#31CB53]"
        >
          {token.slice(1, -1)}
        </code>
      );
    }
    if (token.startsWith("*") && token.endsWith("*") && token.length > 2) {
      return (
        <em key={idx} className="italic text-[#D6E3E4]">
          {token.slice(1, -1)}
        </em>
      );
    }
    return <React.Fragment key={idx}>{token}</React.Fragment>;
  });
}

const AIStudio: React.FC = () => {
  const {
    state,
    todayIso,
    createThread,
    selectThread,
    deleteThread,
    updateThreadMode,
    updateThreadGoal,
    appendMessageToThread,
    createNote,
  } = useStudy();

  const { toast } = useToast();
  const [input, setInput] = useState("");
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorBanner, setErrorBanner] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const activeThread =
    state.threads.find((t) => t.id === state.activeThreadId) ||
    state.threads[0];

  const linkedGoal = activeThread?.goalId
    ? state.goals.find((g) => g.id === activeThread.goalId)
    : undefined;

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [activeThread?.messages.length, isLoading]);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast({
        title: "Unsupported file",
        description: "Please upload a PNG, JPG, or WebP screenshot.",
        variant: "destructive",
      });
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "Image too large",
        description: "Please choose an image smaller than 5MB.",
        variant: "destructive",
      });
      return;
    }
    const dataUrl = await fileToDataUrl(file);
    setImagePreview(dataUrl);
  };

  const handleSend = async (overrideText?: string) => {
    if (!activeThread || isLoading) return;
    const text = (overrideText ?? input).trim();
    if (!text && !imagePreview) return;

    const userMsg: ChatMessage = {
      id: `msg-${Date.now().toString(36)}`,
      role: "user",
      content: text || "Please walk me through the problem in this image.",
      image: imagePreview || undefined,
      createdAt: todayIso,
    };

    const nextMessages = [...activeThread.messages, userMsg];
    appendMessageToThread(activeThread.id, userMsg);
    setInput("");
    setImagePreview(null);
    setErrorBanner(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
    setIsLoading(true);

    const result = await sendAiStudyMessage({
      messages: nextMessages,
      mode: activeThread.mode,
      goalTitle: linkedGoal?.title,
    });

    setIsLoading(false);

    if (result.error) {
      setErrorBanner(result.error);
      return;
    }

    const assistantMsg: ChatMessage = {
      id: `msg-${Date.now().toString(36)}-ai`,
      role: "assistant",
      content: result.text,
      createdAt: todayIso,
    };
    appendMessageToThread(activeThread.id, assistantMsg);
  };

  const handleSaveReplyToNotes = (content: string) => {
    createNote({
      title: activeThread ? `${activeThread.title} — Summary` : "AI Study Takeaway",
      content,
      goalId: activeThread?.goalId,
      tags: ["ai-studio"],
    });
    toast({
      title: "Saved to Notebook",
      description: "You can edit and organize it anytime in Notes.",
    });
  };

  return (
    <AppShell hideFooter>
      <div className="mx-auto flex h-[calc(100vh-61px)] max-w-6xl flex-col md:flex-row">
        {/* Left Sidebar: Study Sessions */}
        <aside className="w-full shrink-0 border-b border-[#1E2323] bg-[#070808] p-4 md:w-72 md:border-b-0 md:border-r flex flex-col">
          <button
            type="button"
            onClick={() => createThread({ mode: "explain" })}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#31CB53] px-4 py-2.5 text-sm font-semibold text-black transition-colors hover:bg-[#29b347]"
          >
            <Plus className="h-4 w-4" />
            New Study Session
          </button>

          <div className="mt-5 flex-1 overflow-y-auto space-y-1.5 max-h-40 md:max-h-none">
            <p className="px-2 pb-1 text-xs font-semibold uppercase tracking-wider text-[#94A3A5]">
              Sessions ({state.threads.length})
            </p>
            {state.threads.map((thread) => {
              const isSelected = thread.id === activeThread?.id;
              return (
                <div
                  key={thread.id}
                  className={`group flex items-center justify-between gap-2 rounded-lg px-3 py-2 text-sm transition-colors ${
                    isSelected
                      ? "bg-[#151A1A] text-[#F6FF81]"
                      : "text-[#D6E3E4] hover:bg-[#0E1111]"
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => selectThread(thread.id)}
                    className="flex flex-1 items-center gap-2.5 min-w-0 text-left"
                  >
                    <MessageSquare className="h-4 w-4 shrink-0 text-[#94A3A5]" />
                    <span className="truncate font-medium">{thread.title}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => deleteThread(thread.id)}
                    aria-label={`Delete session ${thread.title}`}
                    className="rounded p-1 text-[#94A3A5] opacity-70 hover:text-red-400 hover:opacity-100"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              );
            })}
          </div>
        </aside>

        {/* Main AI Study Workspace */}
        <section className="flex flex-1 flex-col min-w-0 bg-black">
          {/* Studio Mode & Goal Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#1E2323] px-4 py-3 sm:px-6">
            <div className="flex flex-wrap items-center gap-1.5">
              {TUTOR_MODES.map((m) => {
                const active = activeThread?.mode === m.id;
                return (
                  <button
                    key={m.id}
                    type="button"
                    title={m.hint}
                    onClick={() =>
                      activeThread && updateThreadMode(activeThread.id, m.id)
                    }
                    className={`rounded-lg px-3 py-1.5 text-xs font-medium whitespace-nowrap transition-colors ${
                      active
                        ? "bg-[#F6FF81] text-black font-semibold"
                        : "border border-[#232929] bg-[#0B0D0D] text-[#94A3A5] hover:text-[#D6E3E4]"
                    }`}
                  >
                    {m.label}
                  </button>
                );
              })}
            </div>

            <div className="flex items-center gap-2">
              <label htmlFor="studio-goal-select" className="text-xs text-[#94A3A5]">
                Goal context:
              </label>
              <select
                id="studio-goal-select"
                value={activeThread?.goalId || ""}
                onChange={(e) =>
                  activeThread &&
                  updateThreadGoal(activeThread.id, e.target.value || undefined)
                }
                className="rounded-lg border border-[#232929] bg-[#0B0D0D] px-2.5 py-1.5 text-xs text-[#D6E3E4] focus:border-[#31CB53] focus:outline-none"
              >
                <option value="">General Study</option>
                {state.goals.map((g) => (
                  <option key={g.id} value={g.id}>
                    {g.title}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Messages Viewport */}
          <div className="flex-1 overflow-y-auto px-4 py-6 sm:px-6">
            {activeThread && activeThread.messages.length === 0 ? (
              <div className="mx-auto flex h-full max-w-2xl flex-col items-center justify-center text-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#D6E3E4] text-black">
                  <Brain className="h-6 w-6" />
                </div>
                <h1 className="mt-4 font-heading text-2xl font-bold text-[#D6E3E4]">
                  SeedIQ AI Study Partner
                </h1>
                <p className="mt-2 max-w-md text-sm text-[#94A3A5]">
                  Ask a tough question, upload a screenshot of a problem or diagram, or switch to Socratic Coach to think it through step by step.
                </p>

                <div className="mt-6 grid w-full grid-cols-1 gap-2.5 text-left">
                  {STARTER_PROMPTS.map((prompt) => (
                    <button
                      key={prompt}
                      type="button"
                      onClick={() => handleSend(prompt)}
                      className="rounded-xl border border-[#232929] bg-[#0B0D0D] px-4 py-3 text-sm text-[#D6E3E4] transition-colors hover:border-[#31CB53]"
                    >
                      {prompt}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div className="mx-auto max-w-3xl space-y-5">
                {activeThread?.messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex ${
                      msg.role === "user" ? "justify-end" : "justify-start"
                    }`}
                  >
                    <div
                      className={`max-w-[85%] rounded-xl px-4 py-3.5 text-sm leading-relaxed ${
                        msg.role === "user"
                          ? "bg-[#D6E3E4] text-black font-medium"
                          : "border border-[#232929] bg-[#0B0D0D] text-[#D6E3E4]"
                      }`}
                    >
                      {msg.image && (
                        <img
                          src={msg.image}
                          alt="Uploaded study screenshot"
                          className="mb-3 max-h-64 rounded-lg border border-black/15"
                        />
                      )}
                      <div className="whitespace-pre-line">
                        {msg.role === "assistant"
                          ? renderInlineFormatting(msg.content)
                          : msg.content}
                      </div>

                      {msg.role === "assistant" && (
                        <div className="mt-3 flex justify-end border-t border-[#1E2323] pt-2">
                          <button
                            type="button"
                            onClick={() => handleSaveReplyToNotes(msg.content)}
                            className="inline-flex items-center gap-1.5 text-xs text-[#94A3A5] hover:text-[#F6FF81] transition-colors"
                          >
                            <BookmarkPlus className="h-3.5 w-3.5" />
                            Save to Notes
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}

                {isLoading && (
                  <div className="flex justify-start">
                    <div className="rounded-xl border border-[#232929] bg-[#0B0D0D] px-4 py-3 text-xs text-[#94A3A5]">
                      Thinking through your question...
                    </div>
                  </div>
                )}

                {errorBanner && (
                  <div
                    role="alert"
                    className="rounded-xl border border-[#F6FF81]/40 bg-[#14160A] px-4 py-3 text-sm text-[#F6FF81]"
                  >
                    {errorBanner}
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>
            )}
          </div>

          {/* Input Bar */}
          <div className="border-t border-[#1E2323] bg-black px-4 py-3.5 sm:px-6">
            {imagePreview && (
              <div className="mx-auto mb-3 max-w-3xl">
                <div className="relative inline-block">
                  <img
                    src={imagePreview}
                    alt="Attachment preview"
                    className="h-20 rounded-lg border border-[#2A3131]"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setImagePreview(null);
                      if (fileInputRef.current) fileInputRef.current.value = "";
                    }}
                    aria-label="Remove uploaded image"
                    className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-[#F6FF81] text-black"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            )}

            <div className="mx-auto flex max-w-3xl items-end gap-2.5">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                className="hidden"
                aria-label="Upload problem screenshot"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={isLoading}
                aria-label="Attach screenshot or diagram"
                className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border border-[#232929] bg-[#0B0D0D] text-[#D6E3E4] hover:border-[#31CB53] disabled:opacity-40"
              >
                <ImageIcon className="h-5 w-5" />
              </button>

              <textarea
                rows={1}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSend();
                  }
                }}
                placeholder="Ask a question, paste code, or attach a screenshot..."
                aria-label="Message AI Study Partner"
                disabled={isLoading}
                className="min-h-[44px] max-h-36 flex-1 resize-none rounded-lg border border-[#232929] bg-[#0B0D0D] px-4 py-2.5 text-sm text-[#D6E3E4] placeholder:text-[#667375] focus:border-[#31CB53] focus:outline-none"
              />

              <button
                type="button"
                onClick={() => handleSend()}
                disabled={isLoading || (!input.trim() && !imagePreview)}
                aria-label="Send message"
                className="inline-flex h-11 shrink-0 items-center gap-2 rounded-lg bg-[#31CB53] px-4 text-sm font-semibold text-black hover:bg-[#29b347] disabled:opacity-40"
              >
                <Send className="h-4 w-4" />
                <span className="hidden sm:inline">Send</span>
              </button>
            </div>
          </div>
        </section>
      </div>
    </AppShell>
  );
};

export default AIStudio;
