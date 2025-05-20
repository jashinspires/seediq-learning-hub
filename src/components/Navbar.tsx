
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Menu, X, UserRound, LogOut } from "lucide-react";
import { useAuth } from "@/providers/AuthProvider";
import { useToast } from "@/hooks/use-toast";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { isAuthenticated, logout } = useAuth();
  const { toast } = useToast();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleLogout = () => {
    logout();
    toast({
      title: "Logged out",
      description: "You have been successfully logged out",
    });
  };

  return (
    <nav className="bg-white border-b border-gray-100 py-4 sticky top-0 z-50">
      <div className="container mx-auto px-4 flex justify-between items-center">
        <Link to="/" className="flex items-center space-x-2">
          <span className="text-2xl font-bold text-seediq-600">
            Seed<span className="text-seediq-800">IQ</span>
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden lg:flex items-center space-x-8">
          <Link to="/" className="text-gray-700 hover:text-seediq-600 font-medium">
            Home
          </Link>
          <Link to="/skillup" className="text-gray-700 hover:text-seediq-600 font-medium">
            SkillUp
          </Link>
          <Link to="/ai-tutor" className="text-gray-700 hover:text-seediq-600 font-medium">
            AI Tutor
          </Link>
          <Link to="/community" className="text-gray-700 hover:text-seediq-600 font-medium">
            Community
          </Link>
          <Link to="/profile" className="text-gray-700 hover:text-seediq-600 font-medium flex items-center gap-1">
            <UserRound size={16} />
            Profile
          </Link>
        </div>

        <div className="hidden lg:flex items-center space-x-4">
          {isAuthenticated ? (
            <Button variant="outline" onClick={handleLogout} className="flex items-center gap-2">
              <LogOut size={16} />
              Sign Out
            </Button>
          ) : (
            <>
              <Button variant="outline">Sign In</Button>
              <Button>Sign Up</Button>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button className="lg:hidden text-gray-700" onClick={toggleMenu}>
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="lg:hidden bg-white border-t border-gray-100 py-4 px-4 animate-fade-in">
          <div className="flex flex-col space-y-3">
            <Link 
              to="/" 
              className="text-gray-700 hover:text-seediq-600 font-medium py-2"
              onClick={toggleMenu}
            >
              Home
            </Link>
            <Link 
              to="/skillup" 
              className="text-gray-700 hover:text-seediq-600 font-medium py-2"
              onClick={toggleMenu}
            >
              SkillUp
            </Link>
            <Link 
              to="/ai-tutor" 
              className="text-gray-700 hover:text-seediq-600 font-medium py-2"
              onClick={toggleMenu}
            >
              AI Tutor
            </Link>
            <Link 
              to="/community" 
              className="text-gray-700 hover:text-seediq-600 font-medium py-2"
              onClick={toggleMenu}
            >
              Community
            </Link>
            <Link 
              to="/profile" 
              className="text-gray-700 hover:text-seediq-600 font-medium py-2 flex items-center gap-1"
              onClick={toggleMenu}
            >
              <UserRound size={16} />
              Profile
            </Link>
            <div className="pt-4 flex flex-col space-y-3">
              {isAuthenticated ? (
                <Button 
                  variant="outline" 
                  className="w-full flex items-center justify-center gap-2"
                  onClick={() => {
                    handleLogout();
                    toggleMenu();
                  }}
                >
                  <LogOut size={16} />
                  Sign Out
                </Button>
              ) : (
                <>
                  <Button variant="outline" className="w-full">Sign In</Button>
                  <Button className="w-full">Sign Up</Button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
