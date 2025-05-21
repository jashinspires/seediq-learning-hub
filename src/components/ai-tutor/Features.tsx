
import { Check, Sparkles } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import SubjectSelector from "./SubjectSelector";

interface FeaturesProps {
  onSelectSubject: (subject: string) => void;
}

const Features = ({ onSelectSubject }: FeaturesProps) => {
  const subjects = [
    { id: 'math', name: 'Mathematics', icon: '📊' },
    { id: 'science', name: 'Science', icon: '🧪' },
    { id: 'programming', name: 'Programming', icon: '💻' },
    { id: 'language', name: 'Languages', icon: '🗣️' },
    { id: 'history', name: 'History', icon: '📜' },
    { id: 'art', name: 'Arts & Music', icon: '🎨' },
  ];

  return (
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
          <SubjectSelector subjects={subjects} onSelectSubject={onSelectSubject} />
          <p className="mt-4 text-sm text-gray-600">
            Click on any subject to start a new conversation focused on that topic.
          </p>
        </CardContent>
      </Card>
      
      <Card className="md:col-span-2">
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
    </div>
  );
};

export default Features;
