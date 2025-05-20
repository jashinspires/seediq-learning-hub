
import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CalendarDays, Settings, User, Users, Activity } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const Profile = () => {
  const [activeTab, setActiveTab] = useState("personal");

  // Mock user data
  const userData = {
    name: "Alex Johnson",
    username: "alexcode",
    email: "alex@example.com",
    joinDate: "January 2023",
    location: "San Francisco, CA",
    bio: "Full-stack developer passionate about learning new technologies and sharing knowledge with the community.",
    skills: ["JavaScript", "React", "Node.js", "Python", "Data Structures"],
    streak: 47,
    totalSolved: 325,
    followers: 128,
    following: 84,
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        <div className="container mx-auto px-4 py-8">
          {/* Profile header */}
          <div className="flex flex-col md:flex-row items-start gap-6 mb-8">
            <div className="w-24 h-24 rounded-full bg-seediq-600 text-white flex items-center justify-center text-3xl font-bold">
              {userData.name.charAt(0)}
            </div>
            <div className="flex-1">
              <h1 className="text-3xl font-bold">{userData.name}</h1>
              <p className="text-gray-600">@{userData.username}</p>
              <div className="flex gap-4 mt-2">
                <span className="text-sm">
                  <span className="font-bold">{userData.streak}</span> day streak
                </span>
                <span className="text-sm">
                  <span className="font-bold">{userData.followers}</span> followers
                </span>
                <span className="text-sm">
                  <span className="font-bold">{userData.following}</span> following
                </span>
              </div>
              <p className="mt-4">{userData.bio}</p>
            </div>
          </div>

          {/* Tabs */}
          <Tabs defaultValue="personal" value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid grid-cols-2 md:grid-cols-5 mb-8">
              <TabsTrigger value="personal" className="flex items-center gap-2">
                <User size={16} /> Personal
              </TabsTrigger>
              <TabsTrigger value="heatmap" className="flex items-center gap-2">
                <CalendarDays size={16} /> Activity
              </TabsTrigger>
              <TabsTrigger value="streak" className="flex items-center gap-2">
                <Activity size={16} /> Progress
              </TabsTrigger>
              <TabsTrigger value="connections" className="flex items-center gap-2">
                <Users size={16} /> Network
              </TabsTrigger>
              <TabsTrigger value="settings" className="flex items-center gap-2">
                <Settings size={16} /> Settings
              </TabsTrigger>
            </TabsList>

            {/* Personal Information */}
            <TabsContent value="personal">
              <Card>
                <CardHeader>
                  <CardTitle>Personal Information</CardTitle>
                  <CardDescription>Your profile details and skills</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="font-medium mb-4">Contact Information</h3>
                      <div className="space-y-2">
                        <div className="grid grid-cols-3">
                          <span className="text-gray-500">Full Name</span>
                          <span className="col-span-2">{userData.name}</span>
                        </div>
                        <div className="grid grid-cols-3">
                          <span className="text-gray-500">Email</span>
                          <span className="col-span-2">{userData.email}</span>
                        </div>
                        <div className="grid grid-cols-3">
                          <span className="text-gray-500">Location</span>
                          <span className="col-span-2">{userData.location}</span>
                        </div>
                        <div className="grid grid-cols-3">
                          <span className="text-gray-500">Joined</span>
                          <span className="col-span-2">{userData.joinDate}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="font-medium mb-4">Skills</h3>
                      <div className="flex flex-wrap gap-2">
                        {userData.skills.map((skill) => (
                          <span 
                            key={skill} 
                            className="bg-seediq-100 text-seediq-800 rounded-full px-3 py-1 text-sm"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Activity Heatmap */}
            <TabsContent value="heatmap">
              <Card>
                <CardHeader>
                  <CardTitle>Activity Heatmap</CardTitle>
                  <CardDescription>Your coding activity over the past year</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="p-6 bg-gray-50 rounded-lg">
                    <div className="grid grid-cols-52 gap-1">
                      {Array.from({ length: 52 * 7 }).map((_, i) => {
                        // Generate random activity level (0-4) for demonstration
                        const level = Math.floor(Math.random() * 5);
                        const bgColor = level === 0 ? 'bg-gray-200' : 
                                      level === 1 ? 'bg-seediq-100' : 
                                      level === 2 ? 'bg-seediq-300' : 
                                      level === 3 ? 'bg-seediq-500' : 'bg-seediq-700';
                        return (
                          <div 
                            key={i} 
                            className={`w-3 h-3 rounded-sm ${bgColor}`}
                            title={`${level} contributions`}
                          ></div>
                        );
                      })}
                    </div>
                    <div className="flex items-center justify-end mt-4 text-sm text-gray-600">
                      <span>Less</span>
                      <div className="flex gap-1 mx-2">
                        <div className="w-3 h-3 bg-gray-200 rounded-sm"></div>
                        <div className="w-3 h-3 bg-seediq-100 rounded-sm"></div>
                        <div className="w-3 h-3 bg-seediq-300 rounded-sm"></div>
                        <div className="w-3 h-3 bg-seediq-500 rounded-sm"></div>
                        <div className="w-3 h-3 bg-seediq-700 rounded-sm"></div>
                      </div>
                      <span>More</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Progress and Streak */}
            <TabsContent value="streak">
              <Card>
                <CardHeader>
                  <CardTitle>Learning Progress</CardTitle>
                  <CardDescription>Track your learning journey and achievements</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Card className="bg-seediq-50 border-none shadow-sm">
                      <CardContent className="p-6">
                        <h3 className="text-lg font-medium text-gray-800">Current Streak</h3>
                        <div className="flex items-end gap-2 mt-2">
                          <span className="text-4xl font-bold text-seediq-600">{userData.streak}</span>
                          <span className="text-sm text-gray-600 mb-1">days</span>
                        </div>
                        <div className="mt-4 h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div className="bg-seediq-600 h-2 rounded-full" style={{ width: "47%" }}></div>
                        </div>
                        <p className="text-sm text-gray-600 mt-2">On track for 100 days</p>
                      </CardContent>
                    </Card>
                    
                    <Card className="bg-seediq-50 border-none shadow-sm">
                      <CardContent className="p-6">
                        <h3 className="text-lg font-medium text-gray-800">Problems Solved</h3>
                        <div className="flex items-end gap-2 mt-2">
                          <span className="text-4xl font-bold text-seediq-600">{userData.totalSolved}</span>
                          <span className="text-sm text-gray-600 mb-1">total</span>
                        </div>
                        <div className="flex items-center gap-2 mt-4">
                          <span className="text-sm text-gray-600">Last 7 days:</span>
                          <span className="text-sm font-medium">+12 problems</span>
                        </div>
                      </CardContent>
                    </Card>
                    
                    <Card className="bg-seediq-50 border-none shadow-sm">
                      <CardContent className="p-6">
                        <h3 className="text-lg font-medium text-gray-800">Completion Rate</h3>
                        <div className="flex items-end gap-2 mt-2">
                          <span className="text-4xl font-bold text-seediq-600">92%</span>
                        </div>
                        <div className="mt-4 h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div className="bg-seediq-600 h-2 rounded-full" style={{ width: "92%" }}></div>
                        </div>
                        <p className="text-sm text-gray-600 mt-2">Average completion rate</p>
                      </CardContent>
                    </Card>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Network - Followers/Following */}
            <TabsContent value="connections">
              <Card>
                <CardHeader>
                  <CardTitle>Your Network</CardTitle>
                  <CardDescription>People you follow and those who follow you</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                      <h3 className="text-lg font-medium mb-4">Followers ({userData.followers})</h3>
                      <div className="space-y-4">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <div key={i} className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-seediq-200 flex items-center justify-center">
                              <span className="font-medium">{String.fromCharCode(65 + i)}</span>
                            </div>
                            <div>
                              <h4 className="font-medium">User {String.fromCharCode(65 + i)}</h4>
                              <p className="text-sm text-gray-600">Joined {2024 - i} days ago</p>
                            </div>
                          </div>
                        ))}
                        <button className="text-seediq-600 font-medium text-sm">View all followers</button>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-medium mb-4">Following ({userData.following})</h3>
                      <div className="space-y-4">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <div key={i} className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                              <span className="font-medium">{String.fromCharCode(75 + i)}</span>
                            </div>
                            <div>
                              <h4 className="font-medium">User {String.fromCharCode(75 + i)}</h4>
                              <p className="text-sm text-gray-600">{5 + i} courses completed</p>
                            </div>
                          </div>
                        ))}
                        <button className="text-seediq-600 font-medium text-sm">View all following</button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Account Settings */}
            <TabsContent value="settings">
              <Card>
                <CardHeader>
                  <CardTitle>Account Settings</CardTitle>
                  <CardDescription>Manage your account preferences and settings</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-medium mb-4">Profile Settings</h3>
                      <Table>
                        <TableBody>
                          <TableRow>
                            <TableCell className="font-medium">Profile Visibility</TableCell>
                            <TableCell>Public</TableCell>
                            <TableCell className="text-right">
                              <button className="text-seediq-600">Change</button>
                            </TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell className="font-medium">Email Notifications</TableCell>
                            <TableCell>Enabled</TableCell>
                            <TableCell className="text-right">
                              <button className="text-seediq-600">Manage</button>
                            </TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell className="font-medium">Two-Factor Authentication</TableCell>
                            <TableCell>Disabled</TableCell>
                            <TableCell className="text-right">
                              <button className="text-seediq-600">Enable</button>
                            </TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell className="font-medium">Connected Accounts</TableCell>
                            <TableCell>GitHub, LinkedIn</TableCell>
                            <TableCell className="text-right">
                              <button className="text-seediq-600">Manage</button>
                            </TableCell>
                          </TableRow>
                        </TableBody>
                      </Table>
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-medium mb-4">Privacy & Security</h3>
                      <Table>
                        <TableBody>
                          <TableRow>
                            <TableCell className="font-medium">Password</TableCell>
                            <TableCell>Last changed 3 months ago</TableCell>
                            <TableCell className="text-right">
                              <button className="text-seediq-600">Change</button>
                            </TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell className="font-medium">Login History</TableCell>
                            <TableCell>View recent login attempts</TableCell>
                            <TableCell className="text-right">
                              <button className="text-seediq-600">View</button>
                            </TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell className="font-medium">Data & Privacy</TableCell>
                            <TableCell>Manage your data</TableCell>
                            <TableCell className="text-right">
                              <button className="text-seediq-600">Manage</button>
                            </TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell className="font-medium">Delete Account</TableCell>
                            <TableCell>Permanently delete your account</TableCell>
                            <TableCell className="text-right">
                              <button className="text-destructive">Delete</button>
                            </TableCell>
                          </TableRow>
                        </TableBody>
                      </Table>
                    </div>
                  </div>
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

export default Profile;
