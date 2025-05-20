
import { CalendarDays, BookOpen, Brain, Users } from "lucide-react";

const features = [
  {
    name: "Personalized Learning",
    description:
      "Tailored courses and learning paths designed to match your unique learning style and goals.",
    icon: BookOpen,
  },
  {
    name: "AI-Powered Tutoring",
    description:
      "Get instant help from our advanced AI tutors that adapt to your learning needs and answer questions 24/7.",
    icon: Brain,
  },
  {
    name: "Skill Tracking",
    description:
      "Monitor your progress with detailed analytics and achievement tracking to keep you motivated.",
    icon: CalendarDays,
  },
  {
    name: "Supportive Community",
    description:
      "Join a vibrant community of learners and educators to discuss topics and clarify doubts.",
    icon: Users,
  },
];

const Features = () => {
  return (
    <div className="bg-gray-50 py-16 md:py-24">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900">Why Choose SeedIQ?</h2>
          <p className="text-xl text-gray-700 mb-12">
            Our platform combines cutting-edge technology with proven educational methods to deliver an exceptional learning experience.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mt-12">
          {features.map((feature) => (
            <div key={feature.name} className="bg-white rounded-xl p-6 shadow-md card-hover">
              <div className="h-12 w-12 rounded-lg bg-seediq-100 flex items-center justify-center mb-4">
                <feature.icon className="h-6 w-6 text-seediq-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-gray-900">{feature.name}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Features;
