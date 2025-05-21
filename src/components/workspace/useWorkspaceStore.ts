
import { useState, useRef, useEffect } from "react";
import { getChatCompletion, Message, fileToBase64 } from "@/utils/groqApi";
import { useToast } from "@/hooks/use-toast";

export const useWorkspaceStore = () => {
  // Define the system message first before using it in useState
  const systemMessage: Message = {
    role: 'system',
    content: 'You are a helpful AI assistant in the SeedIQ Workspace. You provide clear, accurate information across various subjects including math, science, programming, languages, history, and arts. Break down complex topics into understandable segments, be encouraging, and focus on educational content.'
  };
  
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
  
  // Save conversations to localStorage whenever they change
  useEffect(() => {
    // Don't save if only system message exists
    if (conversations.length > 1 || (conversations.length === 1 && conversations[0].role !== 'system')) {
      localStorage.setItem('workspace-conversations', JSON.stringify(conversations));
    }
  }, [conversations]);

  // Handle sending a message
  const sendMessage = async (text: string, image?: string | null) => {
    if ((!text.trim() && !image) || isLoading) return;

    let userMessage: Message = {
      role: 'user',
      content: text.trim() || "Please analyze this image."
    };

    // If there's an image to upload
    if (image) {
      userMessage.image = image;
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
  const handleFileUpload = async (file: File) => {
    if (!file) return null;
    
    // Check file type
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Invalid file type",
        description: "Please upload an image file",
        variant: "destructive"
      });
      return null;
    }
    
    // Check file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Please upload an image smaller than 5MB",
        variant: "destructive"
      });
      return null;
    }
    
    setSelectedFile(file);
    
    try {
      const base64 = await fileToBase64(file);
      setFilePreview(base64);
      return base64;
    } catch (error) {
      console.error("Error converting file to base64:", error);
      toast({
        title: "Error",
        description: "Failed to process the uploaded image",
        variant: "destructive"
      });
      return null;
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

  return {
    message,
    setMessage,
    isLoading,
    selectedFile,
    filePreview,
    conversations,
    messageEndRef,
    fileInputRef,
    messagesContainerRef,
    sendMessage,
    handleFileUpload,
    startNewConversation,
    setFilePreview,
    removeAttachment: () => {
      setSelectedFile(null);
      setFilePreview(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };
};
