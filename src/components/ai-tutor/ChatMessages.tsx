
import { useRef, useEffect } from "react";
import { Brain } from "lucide-react";
import { Message } from "@/utils/groqApi";

interface ChatMessagesProps {
  messages: Message[];
  isLoading: boolean;
}

const ChatMessages = ({ messages, isLoading }: ChatMessagesProps) => {
  const messageEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to the latest message
  useEffect(() => {
    if (messageEndRef.current) {
      messageEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  if (messages.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-96 text-center">
        <Brain className="h-12 w-12 text-seediq-300 mb-4" />
        <h3 className="text-xl font-medium text-gray-700">Welcome to SeedIQ AI Tutor</h3>
        <p className="text-gray-500 mt-2 max-w-md">
          Ask any academic question to get started. I'm here to help with your learning!
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-center">
        <div className="bg-gray-100 rounded-lg px-4 py-2 text-sm text-gray-500">
          Today
        </div>
      </div>

      {messages.map((msg, index) => (
        <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
          <div
            className={`max-w-[80%] rounded-lg px-4 py-2 ${
              msg.role === 'user'
                ? 'bg-seediq-600 text-white'
                : 'bg-white border border-gray-200'
            }`}
          >
            <div className="whitespace-pre-line">{msg.content}</div>
          </div>
        </div>
      ))}

      {isLoading && (
        <div className="flex justify-start">
          <div className="bg-white border border-gray-200 max-w-[80%] rounded-lg px-4 py-2">
            <div className="flex space-x-2 items-center">
              <div className="w-2 h-2 rounded-full bg-seediq-600 animate-pulse"></div>
              <div className="w-2 h-2 rounded-full bg-seediq-600 animate-pulse" style={{ animationDelay: '0.2s' }}></div>
              <div className="w-2 h-2 rounded-full bg-seediq-600 animate-pulse" style={{ animationDelay: '0.4s' }}></div>
            </div>
          </div>
        </div>
      )}
      
      <div ref={messageEndRef} />
    </div>
  );
};

export default ChatMessages;
