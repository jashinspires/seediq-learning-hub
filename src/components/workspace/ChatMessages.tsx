
import { RefObject } from "react";
import { Message } from "@/utils/groqApi";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MessageSquare } from "lucide-react";

interface ChatMessagesProps {
  messages: Message[];
  isLoading: boolean;
  messageEndRef: RefObject<HTMLDivElement>;
}

const ChatMessages = ({ messages, isLoading, messageEndRef }: ChatMessagesProps) => {
  return (
    <ScrollArea className="flex-1 p-4">
      {messages.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-full text-center px-4 py-12">
          <div className="bg-slate-800/50 rounded-full p-4 mb-4">
            <MessageSquare className="h-8 w-8 text-indigo-400" />
          </div>
          <h3 className="text-xl font-medium text-white mb-2">Welcome to SeedIQ Workspace</h3>
          <p className="text-slate-400 mt-2 max-w-md">
            Ask any question or upload an image to get started. I can help with research, learning, and creative tasks.
          </p>
        </div>
      ) : (
        <div className="space-y-6 max-w-3xl mx-auto">
          {messages.map((msg, index) => (
            <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div
                className={`max-w-[85%] rounded-lg px-4 py-3 ${
                  msg.role === 'user'
                    ? 'bg-indigo-600 text-white'
                    : 'bg-slate-800 border border-slate-700 text-slate-200'
                }`}
              >
                {/* Display image if present */}
                {msg.image && (
                  <div className="mb-2">
                    <img 
                      src={msg.image} 
                      alt="Uploaded content" 
                      className="max-w-full max-h-64 rounded" 
                    />
                  </div>
                )}
                {/* Display text content */}
                <div className="whitespace-pre-line">{msg.content}</div>
              </div>
            </div>
          ))}
          
          {/* Loading indicator */}
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-slate-800 border border-slate-700 rounded-lg px-4 py-3">
                <div className="flex space-x-2">
                  <div className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse"></div>
                  <div className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                  <div className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse" style={{ animationDelay: '0.4s' }}></div>
                </div>
              </div>
            </div>
          )}
          <div ref={messageEndRef} />
        </div>
      )}
    </ScrollArea>
  );
};

export default ChatMessages;
