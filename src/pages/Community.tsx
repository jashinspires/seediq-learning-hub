
import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MessageCircle, ThumbsUp, Users, Search, Filter, Calendar, ArrowUp } from "lucide-react";

const discussionCategories = [
  "All Topics",
  "Programming",
  "Data Science",
  "Web Development",
  "Mobile Development",
  "Design",
  "Business",
];

const discussions = [
  {
    id: 1,
    title: "How to optimize React component re-renders?",
    content: "I'm working with a complex React application and noticed some performance issues. What's the best way to prevent unnecessary re-renders in functional components?",
    author: {
      name: "Alex Johnson",
      avatar: "/placeholder.svg",
      role: "Frontend Developer",
    },
    category: "Programming",
    replies: 12,
    likes: 24,
    timeAgo: "2 hours ago",
    isPinned: true,
  },
  {
    id: 2,
    title: "Recommendations for data visualization libraries",
    content: "I need to create interactive dashboards with various chart types for a data analysis project. What libraries would you recommend that work well with React?",
    author: {
      name: "Maya Peters",
      avatar: "/placeholder.svg",
      role: "Data Scientist",
    },
    category: "Data Science",
    replies: 8,
    likes: 15,
    timeAgo: "5 hours ago",
    isPinned: false,
  },
  {
    id: 3,
    title: "How to implement authentication using JWT?",
    content: "I'm building a web application and need to add secure authentication. What's the best approach to implement JWT authentication with React and Node.js?",
    author: {
      name: "Chris Miller",
      avatar: "/placeholder.svg",
      role: "Full Stack Developer",
    },
    category: "Web Development",
    replies: 17,
    likes: 32,
    timeAgo: "1 day ago",
    isPinned: false,
  },
  {
    id: 4,
    title: "Tips for responsive design with Tailwind",
    content: "I'm relatively new to Tailwind CSS. What are your best practices for creating truly responsive layouts without writing custom media queries?",
    author: {
      name: "Jordan Smith",
      avatar: "/placeholder.svg",
      role: "UI Designer",
    },
    category: "Design",
    replies: 9,
    likes: 18,
    timeAgo: "2 days ago",
    isPinned: false,
  },
  {
    id: 5,
    title: "Getting started with machine learning",
    content: "I have a good understanding of Python but no experience with ML. What resources would you recommend for a beginner to start learning machine learning?",
    author: {
      name: "Taylor Wong",
      avatar: "/placeholder.svg",
      role: "Software Engineer",
    },
    category: "Data Science",
    replies: 21,
    likes: 43,
    timeAgo: "3 days ago",
    isPinned: false,
  },
];

const events = [
  {
    id: 1,
    title: "Web Development Workshop: Building Modern UIs",
    description: "Learn the latest techniques for creating responsive, accessible, and performant user interfaces with React and Tailwind CSS.",
    date: "May 28, 2025",
    time: "2:00 PM - 4:00 PM EST",
    host: "David Chen, Senior Frontend Developer",
    attendees: 128,
    image: "/placeholder.svg",
  },
  {
    id: 2,
    title: "Data Science Meetup: Machine Learning Applications",
    description: "Join fellow data enthusiasts to discuss practical applications of machine learning in various industries.",
    date: "June 5, 2025",
    time: "6:30 PM - 8:30 PM EST",
    host: "Dr. Sarah Johnson, AI Research Lead",
    attendees: 86,
    image: "/placeholder.svg",
  },
  {
    id: 3,
    title: "Career Panel: Breaking Into Tech",
    description: "Hear from professionals who successfully transitioned into tech careers and get advice for your own journey.",
    date: "June 12, 2025",
    time: "5:00 PM - 7:00 PM EST",
    host: "SeedIQ Career Services Team",
    attendees: 215,
    image: "/placeholder.svg",
  },
];

const Community = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Topics");

  const filteredDiscussions = discussions.filter((discussion) => {
    const matchesSearch = 
      discussion.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
      discussion.content.toLowerCase().includes(searchTerm.toLowerCase());
      
    const matchesCategory = selectedCategory === "All Topics" || discussion.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow bg-gray-50">
        {/* Header */}
        <div className="bg-seediq-700 py-12">
          <div className="container mx-auto px-4 text-center">
            <div className="inline-flex items-center justify-center p-3 bg-seediq-600 rounded-full mb-6">
              <Users className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Community Forum</h1>
            <p className="text-xl text-seediq-100 max-w-3xl mx-auto">
              Connect with fellow learners, ask questions, share knowledge, and attend community events.
            </p>
          </div>
        </div>

        {/* Main Content */}
        <div className="container mx-auto px-4 py-8">
          <Tabs defaultValue="forum" className="w-full">
            <TabsList className="grid w-full max-w-md mx-auto grid-cols-2">
              <TabsTrigger value="forum">Discussion Forum</TabsTrigger>
              <TabsTrigger value="events">Community Events</TabsTrigger>
            </TabsList>
            
            <TabsContent value="forum" className="mt-6">
              <div className="flex flex-col md:flex-row gap-6">
                {/* Main Content - Discussions */}
                <div className="flex-grow">
                  <div className="mb-6 flex flex-col sm:flex-row gap-4">
                    <div className="relative flex-grow">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
                      <Input
                        type="text"
                        placeholder="Search discussions..."
                        className="pl-10"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                    </div>
                    <Button>Start New Discussion</Button>
                  </div>
                  
                  {/* Categories Filter */}
                  <div className="mb-6 overflow-x-auto">
                    <div className="flex items-center gap-2 whitespace-nowrap pb-2">
                      <Filter className="text-gray-500 h-4 w-4" />
                      <span className="text-sm font-medium text-gray-700">Categories:</span>
                      {discussionCategories.map((category) => (
                        <Button
                          key={category}
                          variant={selectedCategory === category ? "default" : "outline"}
                          size="sm"
                          onClick={() => setSelectedCategory(category)}
                          className="whitespace-nowrap"
                        >
                          {category}
                        </Button>
                      ))}
                    </div>
                  </div>
                  
                  {/* Discussions List */}
                  <div className="space-y-4">
                    {filteredDiscussions.length > 0 ? (
                      filteredDiscussions.map((discussion) => (
                        <Card key={discussion.id} className={`hover:border-seediq-300 transition-colors ${discussion.isPinned ? 'border-l-4 border-l-seediq-500' : ''}`}>
                          <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
                            <div>
                              <CardTitle className="text-xl hover:text-seediq-600 cursor-pointer">
                                {discussion.title}
                              </CardTitle>
                              <div className="flex items-center mt-1 space-x-4">
                                <span className="text-sm text-gray-500">{discussion.timeAgo}</span>
                                <span className="text-xs bg-gray-100 text-gray-700 px-2 py-0.5 rounded-full">
                                  {discussion.category}
                                </span>
                                {discussion.isPinned && (
                                  <span className="text-xs bg-seediq-100 text-seediq-700 px-2 py-0.5 rounded-full flex items-center">
                                    <ArrowUp className="h-3 w-3 mr-1" /> Pinned
                                  </span>
                                )}
                              </div>
                            </div>
                          </CardHeader>
                          <CardContent className="pb-2">
                            <p className="text-gray-700 line-clamp-2">{discussion.content}</p>
                          </CardContent>
                          <CardFooter className="border-t pt-4 flex justify-between">
                            <div className="flex items-center space-x-2">
                              <Avatar className="h-8 w-8">
                                <AvatarImage src={discussion.author.avatar} alt={discussion.author.name} />
                                <AvatarFallback>{discussion.author.name.substring(0, 2)}</AvatarFallback>
                              </Avatar>
                              <div>
                                <p className="text-sm font-medium">{discussion.author.name}</p>
                                <p className="text-xs text-gray-500">{discussion.author.role}</p>
                              </div>
                            </div>
                            <div className="flex items-center space-x-4">
                              <div className="flex items-center text-gray-500">
                                <ThumbsUp className="h-4 w-4 mr-1" />
                                <span className="text-sm">{discussion.likes}</span>
                              </div>
                              <div className="flex items-center text-gray-500">
                                <MessageCircle className="h-4 w-4 mr-1" />
                                <span className="text-sm">{discussion.replies}</span>
                              </div>
                            </div>
                          </CardFooter>
                        </Card>
                      ))
                    ) : (
                      <div className="text-center py-12">
                        <h3 className="text-xl font-medium mb-2">No discussions found</h3>
                        <p className="text-gray-600 mb-4">Try adjusting your search or filters</p>
                        <Button
                          onClick={() => {
                            setSearchTerm("");
                            setSelectedCategory("All Topics");
                          }}
                        >
                          Reset Filters
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
                
                {/* Sidebar */}
                <div className="md:w-80 lg:w-96 space-y-6">
                  {/* Top Contributors */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Top Contributors</CardTitle>
                    </CardHeader>
                    <CardContent className="pb-2">
                      <div className="space-y-4">
                        {[
                          { name: "Emma Wilson", avatar: "/placeholder.svg", points: 1250, badges: 8 },
                          { name: "Daniel Lee", avatar: "/placeholder.svg", points: 980, badges: 6 },
                          { name: "Sofia Rodriguez", avatar: "/placeholder.svg", points: 740, badges: 5 },
                        ].map((user, i) => (
                          <div key={i} className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                              <Avatar className="h-8 w-8">
                                <AvatarImage src={user.avatar} alt={user.name} />
                                <AvatarFallback>{user.name.substring(0, 2)}</AvatarFallback>
                              </Avatar>
                              <span className="font-medium">{user.name}</span>
                            </div>
                            <div className="text-sm text-gray-600">
                              {user.points} pts
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                    <CardFooter className="pt-0">
                      <Button variant="ghost" className="w-full">View All</Button>
                    </CardFooter>
                  </Card>
                  
                  {/* Popular Tags */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Popular Tags</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap gap-2">
                        {[
                          "react", "javascript", "python", "machine-learning", "ui-design",
                          "databases", "career", "beginners", "algorithms", "api"
                        ].map((tag) => (
                          <span 
                            key={tag} 
                            className="px-3 py-1 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-full text-sm cursor-pointer"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                  
                  {/* Community Guidelines */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Community Guidelines</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2 text-sm text-gray-700">
                        <li>Be respectful and inclusive</li>
                        <li>Stay on topic and provide value</li>
                        <li>No self-promotion or spam</li>
                        <li>Give credit when sharing resources</li>
                        <li>Help others when you can</li>
                      </ul>
                      <Button variant="link" className="px-0 mt-2">Read full guidelines</Button>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="events" className="mt-6">
              <div className="mb-8 flex justify-between items-center">
                <h2 className="text-2xl font-bold">Upcoming Events</h2>
                <Button>
                  <Calendar className="mr-2 h-4 w-4" />
                  View Calendar
                </Button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {events.map((event) => (
                  <Card key={event.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                    <div className="relative h-48">
                      <img src={event.image} alt={event.title} className="w-full h-full object-cover" />
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                        <div className="inline-block bg-seediq-600 text-white text-sm px-3 py-1 rounded-full font-medium">
                          {event.date}
                        </div>
                      </div>
                    </div>
                    <CardHeader>
                      <CardTitle className="text-xl">{event.title}</CardTitle>
                      <div className="flex items-center text-sm text-gray-600">
                        <Calendar className="mr-2 h-4 w-4" />
                        {event.time}
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-700 mb-4">{event.description}</p>
                      <div className="text-sm text-gray-600">
                        <p><strong>Host:</strong> {event.host}</p>
                        <p className="mt-1"><strong>Attendees:</strong> {event.attendees}</p>
                      </div>
                    </CardContent>
                    <CardFooter className="border-t pt-4">
                      <Button className="w-full">Register Now</Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
              
              {/* Past Events */}
              <div className="mt-12">
                <h2 className="text-2xl font-bold mb-6">Past Events</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {[1, 2, 3].map((i) => (
                    <Card key={i} className="bg-gray-50 border-gray-200">
                      <CardHeader>
                        <div className="text-sm text-gray-500 mb-1">April {10 + i}, 2025</div>
                        <CardTitle className="text-lg">Workshop: {i === 1 ? 'Advanced CSS Techniques' : i === 2 ? 'Python for Data Analysis' : 'Responsive Design Patterns'}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="flex justify-between text-sm">
                          <span>{i === 1 ? '86' : i === 2 ? '124' : '93'} attendees</span>
                          <Button variant="link" className="p-0 h-auto">View Recording</Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Community;
