
import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Brain } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getChatCompletion, Message } from "@/utils/groqApi";
import { useToast } from "@/hooks/use-toast";

// Import our new components
import ChatMessages from "@/components/ai-tutor/ChatMessages";
import ChatInput from "@/components/ai-tutor/ChatInput";
import Features from "@/components/ai-tutor/Features";

const AITutor = () => {
  const [activeTab, setActiveTab] = useState("chat");
  const [isLoading, setIsLoading] = useState(false);
  const [conversations, setConversations] = useState<Message[]>([
    {
      role: 'system',
      content: 'You are an AI educational tutor named SeedIQ Tutor. You are helpful, knowledgeable, and focused on education. Provide clear, concise, and accurate information. Break down complex topics into understandable segments. Always be encouraging and positive. If a student asks about topics outside of education, politely redirect them to educational topics.'
    }
  ]);
  const { toast } = useToast();

  // Filter out system messages for display
  const displayConversations = conversations.filter(msg => msg.role !== 'system');

  const handleSendMessage = async (message: string) => {
    // Add user message to conversation
    const userMessage: Message = {
      role: 'user',
      content: message
    };

    setConversations(prev => [...prev, userMessage]);
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

  const startNewConversation = (subject: string) => {
    setConversations([
      {
        role: 'system',
        content: `You are an AI educational tutor named SeedIQ Tutor specializing in ${subject}. You are helpful, knowledgeable, and focused on education. Provide clear, concise, and accurate information. Break down complex topics into understandable segments. Always be encouraging and positive.`
      }
    ]);
    setActiveTab("chat");
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow bg-gray-50">
        {/* Header */}
        <div className="bg-seediq-700 py-12">
          <div className="container mx-auto px-4 text-center">
            <div className="inline-flex items-center justify-center p-3 bg-seediq-600 rounded-full mb-6">
              <Brain className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">AI Tutor</h1>
            <p className="text-xl text-seediq-100 max-w-3xl mx-auto">
              Get instant help with concepts, problems, and questions across various subjects.
            </p>
          </div>
        </div>

        {/* Main Content */}
        <div className="container mx-auto px-4 py-8">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full max-w-4xl mx-auto">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="chat">Chat with AI Tutor</TabsTrigger>
              <TabsTrigger value="features">Features & Subjects</TabsTrigger>
            </TabsList>
            
            <TabsContent value="chat" className="mt-6">
              <Card className="border-0 shadow-lg">
                <CardContent className="p-0">
                  <div className="p-4 bg-seediq-50 border-b border-seediq-100 flex items-center gap-2">
                    <Brain className="h-5 w-5 text-seediq-600" />
                    <span className="font-medium text-seediq-800">AI Tutor</span>
                    <span className="text-xs bg-seediq-100 text-seediq-700 px-2 py-0.5 rounded-full ml-auto">
                      Online
                    </span>
                  </div>
                  
                  <div className="h-[500px] overflow-y-auto p-4">
                    <ChatMessages 
                      messages={displayConversations}
                      isLoading={isLoading}
                    />
                  </div>

                  <ChatInput 
                    onSendMessage={handleSendMessage}
                    isLoading={isLoading}
                  />
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="features" className="mt-6">
              <Features onSelectSubject={startNewConversation} />
            </TabsContent>
          </Tabs>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default AITutor;
