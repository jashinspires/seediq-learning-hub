import React from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { StudyProvider } from "@/store/StudyContext";
import HomeDashboard from "./pages/HomeDashboard";
import SkillUp from "./pages/SkillUp";
import AIStudio from "./pages/AIStudio";
import Practice from "./pages/Practice";
import Notes from "./pages/Notes";
import Profile from "./pages/Profile";
import Auth from "./pages/Auth";
import NotFound from "./pages/NotFound";

const App: React.FC = () => {
  return (
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <StudyProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<HomeDashboard />} />
            <Route path="/skillup" element={<SkillUp />} />
            <Route path="/skillup/:goalId" element={<SkillUp />} />
            <Route path="/ai-tutor" element={<AIStudio />} />
            <Route path="/workspace" element={<AIStudio />} />
            <Route path="/practice" element={<Practice />} />
            <Route path="/notes" element={<Notes />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </StudyProvider>
    </TooltipProvider>
  );
};

export default App;
