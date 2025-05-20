
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useEffect } from "react";
import Index from "./pages/Index";
import SkillUp from "./pages/SkillUp";
import AITutor from "./pages/AITutor";
import Community from "./pages/Community";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => {
  // Load theme color on app start
  useEffect(() => {
    const savedColor = localStorage.getItem('seediq-theme-color');
    if (savedColor) {
      // Convert hex to HSL and apply to CSS variables
      const r = parseInt(savedColor.slice(1, 3), 16) / 255;
      const g = parseInt(savedColor.slice(3, 5), 16) / 255;
      const b = parseInt(savedColor.slice(5, 7), 16) / 255;
      
      const max = Math.max(r, g, b);
      const min = Math.min(r, g, b);
      let h = 0;
      let s = 0;
      const l = (max + min) / 2;
      
      if (max !== min) {
        const d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        
        switch (max) {
          case r: h = (g - b) / d + (g < b ? 6 : 0); break;
          case g: h = (b - r) / d + 2; break;
          case b: h = (r - g) / d + 4; break;
        }
        
        h = Math.round(h * 60);
      }
      
      s = Math.round(s * 100);
      
      // Update CSS variables
      document.documentElement.style.setProperty('--primary', `${h} ${s}% 32%`);
      document.documentElement.style.setProperty('--accent', `${h} ${s}% 32%`);
      document.documentElement.style.setProperty('--ring', `${h} ${s}% 32%`);
    }
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/skillup" element={<SkillUp />} />
            <Route path="/ai-tutor" element={<AITutor />} />
            <Route path="/community" element={<Community />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
