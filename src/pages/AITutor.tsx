
import { useState, useRef, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Send, Brain, Sparkles, Check } from "lucide-react";
import { getChatCompletion, Message } from "@/utils/groqApi";
import { useToast } from "@/hooks/use-toast";

const subjects = [
  { id: 'math', name: 'Mathematics', icon: '📊' },
  { id: 'science', name: 'Science', icon: '🧪' },
  { id: 'programming', name: 'Programming', icon: '💻' },
  { id: 'language', name: 'Languages', icon: '🗣️' },
  { id: 'history', name: 'History', icon: '📜' },
  { id: 'art', name: 'Arts & Music', icon: '🎨' },
];

const AITutor = () => {
  const [message, setMessage] = useState("");
  const [activeTab, setActiveTab] = useState("chat");
  const [isLoading, setIsLoading] = useState(false);
  const [conversations, setConversations] = useState<Message[]>([
    {
      role: 'system',
      content: 'You are an AI educational tutor named SeedIQ Tutor. You are helpful, knowledgeable, and focused on education. Provide clear, concise, and accurate information. Break down complex topics into understandable segments. Always be encouraging and positive. If a student asks about topics outside of education, politely redirect them to educational topics.'
    }
  ]);
  const { toast } = useToast();
  const messageEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to the latest message
  useEffect(() => {
    if (messageEndRef.current) {
      messageEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [conversations]);

  const handleSendMessage = async () => {
    if (!message.trim()) return;

    // Add user message to conversation
    const userMessage: Message = {
      role: 'user',
      content: message
    };

    setConversations(prev => [...prev, userMessage]);
    setMessage("");
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

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
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

  // Filter out system messages for display
  const displayConversations = conversations.filter(msg => msg.role !== 'system');

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
                    <div className="space-y-4">
                      {displayConversations.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-96 text-center">
                          <Brain className="h-12 w-12 text-seediq-300 mb-4" />
                          <h3 className="text-xl font-medium text-gray-700">Welcome to SeedIQ AI Tutor</h3>
                          <p className="text-gray-500 mt-2 max-w-md">
                            Ask any academic question to get started. I'm here to help with your learning!
                          </p>
                        </div>
                      ) : (
                        <>
                          <div className="flex justify-center">
                            <div className="bg-gray-100 rounded-lg px-4 py-2 text-sm text-gray-500">
                              Today
                            </div>
                          </div>

                          {displayConversations.map((msg, index) => (
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
                        </>
                      )}
                      <div ref={messageEndRef} />
                    </div>
                  </div>

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
                        onClick={handleSendMessage}
                        disabled={isLoading || !message.trim()}
                      >
                        <Send className="h-5 w-5" />
                      </Button>
                    </div>
                    <div className="mt-2 text-xs text-gray-500">
                      SeedIQ's AI Tutor can explain concepts, solve problems, and answer questions across various subjects.
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="features" className="mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <Card>
                  <CardContent className="pt-6">
                    <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                      <Sparkles className="h-5 w-5 text-seediq-600" />
                      AI Tutor Features
                    </h3>
                    <ul className="space-y-3">
                      {[
                        "Personalized explanations across subjects",
                        "Step-by-step problem solving",
                        "Visual learning with diagrams and explanations",
                        "Practice questions and quizzes",
                        "24/7 availability for learning support",
                        "Adaptive learning based on your progress"
                      ].map((feature, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <Check className="h-5 w-5 mt-0.5 text-seediq-600 flex-shrink-0" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="pt-6">
                    <h3 className="text-xl font-semibold mb-4">Available Subjects</h3>
                    <div className="grid grid-cols-2 gap-4">
                      {subjects.map((subject) => (
                        <Button
                          key={subject.id}
                          variant="outline"
                          className="h-auto py-4 justify-start gap-2"
                          onClick={() => startNewConversation(subject.name)}
                        >
                          <span className="text-2xl">{subject.icon}</span>
                          <span>{subject.name}</span>
                        </Button>
                      ))}
                    </div>
                    <p className="mt-4 text-sm text-gray-600">
                      Click on any subject to start a new conversation focused on that topic.
                    </p>
                  </CardContent>
                </Card>
              </div>
              
              <Card className="mt-8">
                <CardContent className="pt-6">
                  <h3 className="text-xl font-semibold mb-4">Tips for Effective AI Tutoring</h3>
                  <ul className="space-y-3">
                    <li className="flex items-start gap-2">
                      <span className="font-medium">Be specific:</span>
                      <span>Ask clear questions for more accurate responses</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="font-medium">Follow up:</span>
                      <span>Ask additional questions to deepen your understanding</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="font-medium">Request examples:</span>
                      <span>Ask for practical examples to clarify concepts</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="font-medium">Try different approaches:</span>
                      <span>If you don't understand an explanation, ask for an alternative explanation</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default AITutor;
