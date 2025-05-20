
import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Send, Brain, Sparkles, Check } from "lucide-react";

const subjects = [
  { id: 'math', name: 'Mathematics', icon: '📊' },
  { id: 'science', name: 'Science', icon: '🧪' },
  { id: 'programming', name: 'Programming', icon: '💻' },
  { id: 'language', name: 'Languages', icon: '🗣️' },
  { id: 'history', name: 'History', icon: '📜' },
  { id: 'art', name: 'Arts & Music', icon: '🎨' },
];

const demoConversation = [
  {
    role: 'user',
    content: 'Can you explain how photosynthesis works?',
  },
  {
    role: 'assistant',
    content: `Photosynthesis is the process plants use to convert light energy into chemical energy.

Here's how it works:
1. Plants capture sunlight using chlorophyll in their leaves
2. They take in carbon dioxide (CO₂) from the air through tiny pores called stomata
3. They absorb water (H₂O) through their roots
4. Using the energy from sunlight, plants convert CO₂ and H₂O into glucose (sugar) and oxygen
5. The oxygen is released into the air, and the glucose is used for energy or stored

The chemical equation is: 
6CO₂ + 6H₂O + light energy → C₆H₁₂O₆ (glucose) + 6O₂

Photosynthesis is essential for life on Earth as it provides oxygen and forms the base of most food chains!`,
  },
  {
    role: 'user',
    content: 'What organelles are involved in photosynthesis?',
  },
  {
    role: 'assistant',
    content: `The main organelles involved in photosynthesis are:

1. **Chloroplasts** - The primary organelle where photosynthesis takes place. They contain:
   - **Thylakoids** - Disc-shaped structures arranged in stacks called grana
   - **Stroma** - The fluid-filled space surrounding the thylakoids

2. **Cell wall** - While not directly involved in photosynthesis, it provides structural support

3. **Cell membrane** - Controls what enters and exits the cell

4. **Vacuole** - Stores water and nutrients that may be used in photosynthesis

The process of photosynthesis occurs in two main stages:
- Light-dependent reactions: Take place in the thylakoid membranes
- Light-independent reactions (Calvin cycle): Occur in the stroma

Would you like me to explain how these organelles work together in more detail?`,
  },
];

const AITutor = () => {
  const [message, setMessage] = useState("");
  const [activeTab, setActiveTab] = useState("chat");

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
                      <div className="flex justify-center">
                        <div className="bg-gray-100 rounded-lg px-4 py-2 text-sm text-gray-500">
                          Today
                        </div>
                      </div>

                      {demoConversation.map((msg, index) => (
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
                    </div>
                  </div>

                  <div className="p-4 border-t border-gray-200">
                    <div className="flex items-end gap-2">
                      <Textarea
                        placeholder="Ask your question..."
                        className="resize-none"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        rows={3}
                      />
                      <Button className="flex-shrink-0" size="icon">
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
                        >
                          <span className="text-2xl">{subject.icon}</span>
                          <span>{subject.name}</span>
                        </Button>
                      ))}
                    </div>
                    <p className="mt-4 text-sm text-gray-600">
                      Our AI tutor is continuously learning and expanding its knowledge base to help you with even more subjects.
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
