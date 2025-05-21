
import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Send, Image as ImageIcon, ArrowUp, History } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { getChatCompletion, Message, fileToBase64 } from "@/utils/groqApi";
import { useToast } from "@/hooks/use-toast";

const Workspace = () => {
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const [conversations, setConversations] = useState<Message[]>(() => {
    // Load conversations from localStorage if available
    const savedConversations = localStorage.getItem('workspace-conversations');
    if (savedConversations) {
      try {
        const parsed = JSON.parse(savedConversations);
        return Array.isArray(parsed) ? parsed : [systemMessage];
      } catch (e) {
        return [systemMessage];
      }
    }
    return [systemMessage];
  });
  
  const { toast } = useToast();
  const messageEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  
  // System message for the tutor
  const systemMessage: Message = {
    role: 'system',
    content: 'You are a helpful AI assistant in the SeedIQ Workspace. You provide clear, accurate information across various subjects including math, science, programming, languages, history, and arts. Break down complex topics into understandable segments, be encouraging, and focus on educational content.'
  };
  
  // Save conversations to localStorage whenever they change
  useEffect(() => {
    // Don't save if only system message exists
    if (conversations.length > 1 || (conversations.length === 1 && conversations[0].role !== 'system')) {
      localStorage.setItem('workspace-conversations', JSON.stringify(conversations));
    }
  }, [conversations]);

  // Handle sending a message
  const handleSendMessage = async () => {
    if ((!message.trim() && !filePreview) || isLoading) return;

    let userMessage: Message = {
      role: 'user',
      content: message.trim() || "Please analyze this image."
    };

    // If there's an image to upload
    if (filePreview) {
      userMessage.image = filePreview;
    }

    // Update conversation with user's message
    setConversations(prev => [...prev, userMessage]);
    
    // Clear the input and file preview
    setMessage("");
    setSelectedFile(null);
    setFilePreview(null);
    setIsLoading(true);

    try {
      // Get conversation history for context
      const messagesForApi = [...conversations, userMessage];
      
      // Call the Groq API
      const response = await getChatCompletion(messagesForApi);
      
      if (response.error) {
        toast({
          title: "Error",
          description: response.error,
          variant: "destructive"
        });
      } else {
        // Add AI response to conversation
        const assistantMessage: Message = {
          role: 'assistant',
          content: response.text
        };
        setConversations(prev => [...prev, assistantMessage]);
      }
    } catch (error) {
      console.error("Error in AI response:", error);
      toast({
        title: "Error",
        description: "Failed to get response from AI. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Handle file upload
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // Check file type
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Invalid file type",
        description: "Please upload an image file",
        variant: "destructive"
      });
      return;
    }
    
    // Check file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Please upload an image smaller than 5MB",
        variant: "destructive"
      });
      return;
    }
    
    setSelectedFile(file);
    
    try {
      const base64 = await fileToBase64(file);
      setFilePreview(base64);
    } catch (error) {
      console.error("Error converting file to base64:", error);
      toast({
        title: "Error",
        description: "Failed to process the uploaded image",
        variant: "destructive"
      });
    }
  };
  
  // Handle removing attached image
  const removeAttachment = () => {
    setSelectedFile(null);
    setFilePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // Handle keyboard shortcuts
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Start a new conversation
  const startNewConversation = () => {
    setConversations([systemMessage]);
    toast({
      title: "New conversation started",
      description: "Your previous conversation has been saved to history"
    });
  };

  // Filter out system messages for display
  const displayConversations = conversations.filter(msg => msg.role !== 'system');

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-100 p-4">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-seediq-800">SeedIQ Workspace</h1>
          </div>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={startNewConversation}
              className="flex items-center gap-1"
            >
              <History size={16} />
              New Chat
            </Button>
          </div>
        </div>
      </header>

      {/* Main Chat Area */}
      <main className="flex-1 overflow-hidden" ref={messagesContainerRef}>
        <div className="container mx-auto h-full flex flex-col">
          <ScrollArea className="flex-1 p-4">
            {displayConversations.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center">
                <h3 className="text-xl font-medium text-gray-700">Welcome to SeedIQ Workspace</h3>
                <p className="text-gray-500 mt-2 max-w-md">
                  Ask any question or upload an image to get started.
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                {displayConversations.map((msg, index) => (
                  <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div
                      className={`max-w-3xl rounded-lg px-4 py-3 ${
                        msg.role === 'user'
                          ? 'bg-seediq-600 text-white'
                          : 'bg-white border border-gray-200'
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
                    <div className="bg-white border border-gray-200 rounded-lg px-4 py-3">
                      <div className="flex space-x-2">
                        <div className="w-2 h-2 rounded-full bg-seediq-600 animate-pulse"></div>
                        <div className="w-2 h-2 rounded-full bg-seediq-600 animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                        <div className="w-2 h-2 rounded-full bg-seediq-600 animate-pulse" style={{ animationDelay: '0.4s' }}></div>
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messageEndRef} />
              </div>
            )}
          </ScrollArea>
          
          {/* File preview area */}
          {filePreview && (
            <div className="px-4 pt-3">
              <div className="relative inline-block">
                <img 
                  src={filePreview} 
                  alt="Preview" 
                  className="h-20 rounded border border-gray-200" 
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
          
          {/* Input Area */}
          <div className="p-4 border-t border-gray-200 bg-white">
            <div className="flex items-end gap-2">
              <input
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
                ref={fileInputRef}
              />
              <Button 
                variant="outline" 
                size="icon" 
                onClick={() => fileInputRef.current?.click()}
                className="flex-shrink-0" 
                disabled={isLoading}
              >
                <ImageIcon className="h-5 w-5" />
              </Button>
              <div className="flex-1 relative">
                <Textarea
                  placeholder="Ask a question or describe your image..."
                  className="resize-none pr-10"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyDown={handleKeyPress}
                  disabled={isLoading}
                  rows={1}
                />
                {(message.trim() || filePreview) && (
                  <Button 
                    className="absolute right-2 bottom-2" 
                    size="icon" 
                    onClick={handleSendMessage}
                    disabled={isLoading}
                  >
                    <Send className="h-5 w-5" />
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Workspace;
