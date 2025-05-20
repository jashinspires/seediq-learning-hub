
import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, Filter } from "lucide-react";

const categories = [
  "All Courses",
  "Programming",
  "Data Science",
  "Design",
  "Business",
  "Marketing",
];

const levels = ["All Levels", "Beginner", "Intermediate", "Advanced"];

const courses = [
  {
    id: 1,
    title: "Web Development Fundamentals",
    description: "Learn HTML, CSS, and JavaScript to build responsive websites from scratch.",
    category: "Programming",
    level: "Beginner",
    duration: "8 weeks",
    rating: 4.8,
    students: 12540,
    image: "/placeholder.svg",
  },
  {
    id: 2,
    title: "Data Science Essentials",
    description: "Master the basics of data analysis, visualization, and machine learning.",
    category: "Data Science",
    level: "Intermediate",
    duration: "10 weeks",
    rating: 4.7,
    students: 8920,
    image: "/placeholder.svg",
  },
  {
    id: 3,
    title: "Mobile App Development",
    description: "Create cross-platform mobile applications using React Native.",
    category: "Programming",
    level: "Intermediate",
    duration: "12 weeks",
    rating: 4.9,
    students: 7430,
    image: "/placeholder.svg",
  },
  {
    id: 4,
    title: "Artificial Intelligence Foundations",
    description: "Understand the core principles of AI and its real-world applications.",
    category: "Data Science",
    level: "Advanced",
    duration: "14 weeks",
    rating: 4.6,
    students: 5670,
    image: "/placeholder.svg",
  },
  {
    id: 5,
    title: "UI/UX Design Principles",
    description: "Learn the fundamentals of user interface and user experience design.",
    category: "Design",
    level: "Beginner",
    duration: "6 weeks",
    rating: 4.8,
    students: 9120,
    image: "/placeholder.svg",
  },
  {
    id: 6,
    title: "Digital Marketing Strategy",
    description: "Develop effective digital marketing campaigns and strategies.",
    category: "Marketing",
    level: "Intermediate",
    duration: "8 weeks",
    rating: 4.5,
    students: 6850,
    image: "/placeholder.svg",
  },
  {
    id: 7,
    title: "Entrepreneurship Basics",
    description: "Learn how to start and grow a successful business from scratch.",
    category: "Business",
    level: "Beginner",
    duration: "10 weeks",
    rating: 4.7,
    students: 7540,
    image: "/placeholder.svg",
  },
  {
    id: 8,
    title: "Advanced React Development",
    description: "Master advanced React patterns, hooks, and state management.",
    category: "Programming",
    level: "Advanced",
    duration: "12 weeks",
    rating: 4.9,
    students: 4560,
    image: "/placeholder.svg",
  },
];

const SkillUp = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Courses");
  const [selectedLevel, setSelectedLevel] = useState("All Levels");

  const filteredCourses = courses.filter((course) => {
    const matchesSearch = course.title
      .toLowerCase()
      .includes(searchTerm.toLowerCase()) || course.description.toLowerCase().includes(searchTerm.toLowerCase());
      
    const matchesCategory = selectedCategory === "All Courses" || course.category === selectedCategory;
    const matchesLevel = selectedLevel === "All Levels" || course.level === selectedLevel;
    
    return matchesSearch && matchesCategory && matchesLevel;
  });

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        {/* Header */}
        <div className="bg-seediq-700 py-12 md:py-20">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">SkillUp: Expand Your Knowledge</h1>
            <p className="text-xl text-seediq-100 max-w-3xl mx-auto">
              Browse our extensive collection of courses designed to help you master new skills and advance your career.
            </p>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white border-b">
          <div className="container mx-auto px-4 py-6">
            <div className="flex flex-col md:flex-row gap-4 items-center">
              <div className="relative w-full md:max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  type="text"
                  placeholder="Search courses..."
                  className="pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="flex items-center gap-2 w-full md:w-auto">
                <Filter className="text-gray-500 h-4 w-4" />
                <span className="text-sm font-medium text-gray-700">Filters:</span>
              </div>
              <div className="flex gap-2 overflow-x-auto w-full pb-2 md:pb-0">
                <Tabs defaultValue="All Courses" className="w-full">
                  <TabsList className="w-full justify-start overflow-x-auto">
                    {categories.map((category) => (
                      <TabsTrigger
                        key={category}
                        value={category}
                        onClick={() => setSelectedCategory(category)}
                      >
                        {category}
                      </TabsTrigger>
                    ))}
                  </TabsList>
                </Tabs>
              </div>
            </div>
          </div>
        </div>

        {/* Level Filter */}
        <div className="bg-gray-50 border-b">
          <div className="container mx-auto px-4 py-2">
            <div className="flex items-center gap-2 overflow-x-auto">
              <span className="text-sm font-medium text-gray-700 whitespace-nowrap">Level:</span>
              {levels.map((level) => (
                <Button
                  key={level}
                  variant={selectedLevel === level ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedLevel(level)}
                  className="whitespace-nowrap"
                >
                  {level}
                </Button>
              ))}
            </div>
          </div>
        </div>

        {/* Courses Grid */}
        <div className="bg-gray-50 py-12">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl font-bold mb-8">
              {filteredCourses.length} {filteredCourses.length === 1 ? "Course" : "Courses"} {selectedCategory !== "All Courses" ? `in ${selectedCategory}` : ""}
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredCourses.length > 0 ? (
                filteredCourses.map((course) => (
                  <Card key={course.id} className="overflow-hidden card-hover">
                    <img
                      src={course.image}
                      alt={course.title}
                      className="w-full h-48 object-cover"
                    />
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <span className="px-2 py-1 bg-seediq-100 text-seediq-800 text-xs rounded-full">
                          {course.level}
                        </span>
                        <span className="text-sm text-gray-600">{course.duration}</span>
                      </div>
                      <CardTitle className="text-xl mt-2">{course.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-600 mb-4">{course.description}</p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <svg className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                          <span className="ml-1 text-sm font-medium">{course.rating}</span>
                        </div>
                        <span className="text-sm text-gray-600">{course.students.toLocaleString()} students</span>
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button className="w-full">Enroll Now</Button>
                    </CardFooter>
                  </Card>
                ))
              ) : (
                <div className="col-span-full py-12 text-center">
                  <h3 className="text-xl font-medium mb-2">No courses found</h3>
                  <p className="text-gray-600 mb-4">Try adjusting your search or filters</p>
                  <Button
                    onClick={() => {
                      setSearchTerm("");
                      setSelectedCategory("All Courses");
                      setSelectedLevel("All Levels");
                    }}
                  >
                    Reset Filters
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default SkillUp;
