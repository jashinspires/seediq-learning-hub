
import React, { createContext, useState, useEffect, useContext } from "react";
import IntroAnimation from "@/components/auth/IntroAnimation";
import AuthScreen from "@/components/auth/AuthScreen";

type AuthContextType = {
  isAuthenticated: boolean;
  user: any;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [introComplete, setIntroComplete] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check localStorage for existing user data
    const storedUser = localStorage.getItem("seediq-user");
    
    if (storedUser) {
      setUser(JSON.parse(storedUser));
      setIsAuthenticated(true);
      setIntroComplete(true); // Skip intro animation for returning users
      setLoading(false);
    } else {
      // For new users, show the loading state until the intro animation completes
      setTimeout(() => {
        setLoading(false);
      }, 500); // Slight delay to prevent flicker
    }
  }, []);

  const handleAuthComplete = () => {
    setIsAuthenticated(true);
  };

  const logout = () => {
    localStorage.removeItem("seediq-user");
    setIsAuthenticated(false);
    setUser(null);
  };

  if (loading) {
    return <div className="fixed inset-0 bg-white"></div>;
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, logout }}>
      {!introComplete && <IntroAnimation onComplete={() => setIntroComplete(true)} />}
      {introComplete && !isAuthenticated && <AuthScreen onComplete={handleAuthComplete} />}
      {(isAuthenticated || (!introComplete && loading)) && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
