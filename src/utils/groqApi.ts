
// This file contains functions to interact with the Groq API

export type Message = {
  role: 'user' | 'assistant' | 'system';
  content: string;
};

export type ChatCompletionResponse = {
  text: string;
  error?: string;
};

// API key should ideally be stored securely in a server environment
// For demo purposes only, we're storing it directly in the code
const GROQ_API_KEY = "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";

export const getChatCompletion = async (messages: Message[]): Promise<ChatCompletionResponse> => {
  try {
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${GROQ_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "llama3-8b-8192",
        messages: messages,
        temperature: 0.7,
        max_tokens: 1000,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Groq API error:", errorText);
      return { text: "", error: `Error: ${response.status} - ${errorText}` };
    }

    const data = await response.json();
    return { text: data.choices[0].message.content };
  } catch (error) {
    console.error("Error calling Groq API:", error);
    return { 
      text: "", 
      error: error instanceof Error ? error.message : "Unknown error occurred" 
    };
  }
};
