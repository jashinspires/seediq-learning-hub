
import { useState } from "react";
import { Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  isLoading: boolean;
}

const ChatInput = ({ onSendMessage, isLoading }: ChatInputProps) => {
  const [message, setMessage] = useState("");

  const handleSend = () => {
    if (message.trim()) {
      onSendMessage(message);
      setMessage("");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="p-4 border-t border-gray-200">
      <div className="flex items-end gap-2">
        <Textarea
          placeholder="Ask your question..."
          className="resize-none"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyPress}
          disabled={isLoading}
          rows={3}
        />
        <Button 
          className="flex-shrink-0" 
          size="icon" 
          onClick={handleSend}
          disabled={isLoading || !message.trim()}
        >
          <Send className="h-5 w-5" />
        </Button>
      </div>
      <div className="mt-2 text-xs text-gray-500">
        SeedIQ's AI Tutor can explain concepts, solve problems, and answer questions across various subjects.
      </div>
    </div>
  );
};

export default ChatInput;
