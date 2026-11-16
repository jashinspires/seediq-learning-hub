import type { ChatMessage, QuizQuestion, TutorMode } from "@/lib/studyTypes";

export interface AiChatResult {
  text: string;
  error?: string;
}

export async function sendAiStudyMessage(params: {
  messages: ChatMessage[];
  mode: TutorMode;
  goalTitle?: string;
}): Promise<AiChatResult> {
  try {
    const response = await fetch("/api/ai/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        messages: params.messages.map((m) => ({
          role: m.role,
          content: m.content,
          image: m.image,
        })),
        mode: params.mode,
        goalTitle: params.goalTitle,
      }),
    });

    const data = await response.json();
    if (!response.ok) {
      return {
        text: "",
        error: data?.error || `Request failed (${response.status})`,
      };
    }

    return { text: data.text };
  } catch (err) {
    return {
      text: "",
      error:
        err instanceof Error
          ? err.message
          : "Network error reaching AI Study Partner.",
    };
  }
}

export async function generateAiQuiz(topic: string, count = 4): Promise<{
  questions: QuizQuestion[];
  error?: string;
}> {
  try {
    const response = await fetch("/api/ai/quiz", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ topic, count }),
    });
    const data = await response.json();
    if (!response.ok) {
      return {
        questions: [],
        error: data?.error || `Failed to generate quiz (${response.status})`,
      };
    }
    const questions: QuizQuestion[] = (data.questions || []).map(
      (
        item: {
          question: string;
          options: string[];
          correctIndex: number;
          explanation: string;
        },
        idx: number
      ) => ({
        id: `ai-q-${Date.now().toString(36)}-${idx}`,
        topicId: "custom",
        question: item.question,
        options: item.options,
        correctIndex: item.correctIndex,
        explanation: item.explanation,
      })
    );
    return { questions };
  } catch (err) {
    return {
      questions: [],
      error: err instanceof Error ? err.message : "Failed to generate quiz.",
    };
  }
}

export function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (err) => reject(err);
  });
}
