
import { useState, useRef } from "react";
import { Send, Image as ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useWorkspaceStore } from "./useWorkspaceStore";

interface ChatInputProps {
  onSendMessage: (message: string, imageBase64?: string | null) => Promise<void>;
  isLoading: boolean;
}

const ChatInput = ({ onSendMessage, isLoading }: ChatInputProps) => {
  const [message, setMessage] = useState("");
  const {
    filePreview,
    handleFileUpload,
    removeAttachment,
  } = useWorkspaceStore();
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSend = () => {
    if (message.trim() || filePreview) {
      onSendMessage(message, filePreview);
      setMessage("");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      await handleFileUpload(file);
    }
  };

  return (
    <div className="p-4 bg-[#0f1117] border-t border-slate-800 sticky bottom-0">
      {/* File preview area */}
      {filePreview && (
        <div className="px-4 pt-3">
          <div className="relative inline-block">
            <img 
              src={filePreview} 
              alt="Preview" 
              className="h-20 rounded border border-slate-700" 
            />
            <button 
              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 w-6 h-6 flex items-center justify-center text-xs"
              onClick={removeAttachment}
            >
              ×
            </button>
          </div>
        </div>
      )}
      
      <div className="max-w-3xl mx-auto flex items-end gap-2">
        <input
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          className="hidden"
          ref={fileInputRef}
        />
        <Button 
          variant="outline" 
          size="icon" 
          onClick={() => fileInputRef.current?.click()}
          className="flex-shrink-0 bg-transparent border-slate-700 hover:bg-slate-800 text-slate-300" 
          disabled={isLoading}
        >
          <ImageIcon className="h-5 w-5" />
        </Button>
        <div className="flex-1 relative">
          <Textarea
            placeholder="Ask a question or describe your image..."
            className="resize-none pr-10 bg-slate-800 border-slate-700 text-white placeholder-slate-400 focus-visible:ring-indigo-500"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyPress}
            disabled={isLoading}
            rows={1}
          />
          {(message.trim() || filePreview) && (
            <Button 
              className="absolute right-2 bottom-2 bg-indigo-600 hover:bg-indigo-700" 
              size="icon" 
              onClick={handleSend}
              disabled={isLoading}
            >
              <Send className="h-5 w-5" />
            </Button>
          )}
        </div>
      </div>
      <div className="mt-2 text-xs text-slate-500 text-center max-w-3xl mx-auto">
        SeedIQ Workspace provides AI assistance across various subjects and tasks
      </div>
    </div>
  );
};

export default ChatInput;
