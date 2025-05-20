
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const courses = [
  {
    id: 1,
    title: "Web Development Fundamentals",
    description: "Learn HTML, CSS, and JavaScript to build responsive websites from scratch.",
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
    level: "Advanced",
    duration: "14 weeks",
    rating: 4.6,
    students: 5670,
    image: "/placeholder.svg",
  },
];

const PopularCourses = () => {
  return (
    <div className="bg-white py-16 md:py-24">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-12">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Popular Courses</h2>
            <p className="text-xl text-gray-700 mt-2">
              Top-rated courses chosen by thousands of learners
            </p>
          </div>
          <Button variant="outline" asChild>
            <Link to="/skillup">View All</Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {courses.map((course) => (
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
          ))}
        </div>
      </div>
    </div>
  );
};

export default PopularCourses;
