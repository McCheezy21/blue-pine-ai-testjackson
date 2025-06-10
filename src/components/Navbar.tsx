
import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { useIsMobile } from "../hooks/use-mobile";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (sectionId: string) => {
    if (location.pathname !== '/') {
      navigate('/');
      setTimeout(() => {
        const element = document.getElementById(sectionId);
        if (element) {
          element.scrollIntoView({
            behavior: 'smooth'
          });
        }
      }, 100);
    } else {
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({
          behavior: 'smooth'
        });
      }
    }
    setIsOpen(false);
  };

  return (
    <nav className={`fixed w-full z-50 transition-all duration-500 ${
      isScrolled 
        ? 'bg-white/95 backdrop-blur-xl shadow-xl border-b border-gray-100' 
        : 'bg-white/90 backdrop-blur-sm'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20">
          {/* Logo */}
          <div 
            className="flex items-center gap-3 cursor-pointer hover:opacity-90 transition-all duration-300 group" 
            onClick={() => navigate('/')}
          >
            <div className="relative">
              <img 
                src="/lovable-uploads/408a9d6d-f5ef-4982-8932-336aecfb2915.png" 
                alt="Blue Pine AI Logo" 
                className="h-12 w-12 group-hover:scale-110 transition-transform duration-300" 
              />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent group-hover:scale-105 transition-transform">
              Blue Pine AI
            </span>
          </div>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-2">
            <Button 
              variant="ghost" 
              onClick={() => navigate('/')}
              className="text-gray-700 hover:text-primary hover:bg-primary/5 transition-all duration-300 font-medium px-6 py-3 rounded-xl text-lg"
            >
              Home
            </Button>
            <Button 
              variant="ghost" 
              onClick={() => scrollToSection('features')}
              className="text-gray-700 hover:text-primary hover:bg-primary/5 transition-all duration-300 font-medium px-6 py-3 rounded-xl text-lg"
            >
              Features
            </Button>
            <Button 
              variant="ghost" 
              onClick={() => scrollToSection('ai-explanation')}
              className="text-gray-700 hover:text-primary hover:bg-primary/5 transition-all duration-300 font-medium px-6 py-3 rounded-xl text-lg"
            >
              AI Agents
            </Button>
            <Button 
              variant="ghost" 
              onClick={() => scrollToSection('faq')}
              className="text-gray-700 hover:text-primary hover:bg-primary/5 transition-all duration-300 font-medium px-6 py-3 rounded-xl text-lg"
            >
              FAQ
            </Button>
            <Button 
              variant="ghost" 
              onClick={() => navigate('/signin')}
              className="text-gray-700 hover:text-primary hover:bg-primary/5 transition-all duration-300 font-medium px-6 py-3 rounded-xl text-lg ml-4"
            >
              Sign In
            </Button>
            <Button 
              onClick={() => navigate('/waitlist')} 
              className="ml-4 bg-gradient-to-r from-primary to-blue-600 text-white hover:shadow-xl transition-all duration-300 hover:scale-105 active:scale-95 font-semibold px-8 py-3 rounded-xl text-lg"
            >
              Join Waitlist
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button 
              onClick={() => setIsOpen(!isOpen)} 
              className="text-primary p-3 rounded-xl hover:bg-primary/5 transition-all duration-300"
            >
              {isOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden absolute top-full left-0 right-0 bg-white/95 backdrop-blur-xl border-b border-gray-100 shadow-xl">
            <div className="px-4 py-8 space-y-4">
              <Button 
                variant="ghost" 
                className="w-full text-left justify-start text-gray-700 hover:text-primary hover:bg-primary/5 transition-all duration-300 font-medium text-lg py-4" 
                onClick={() => {
                  navigate('/');
                  setIsOpen(false);
                }}
              >
                Home
              </Button>
              <Button 
                variant="ghost" 
                className="w-full text-left justify-start text-gray-700 hover:text-primary hover:bg-primary/5 transition-all duration-300 font-medium text-lg py-4" 
                onClick={() => scrollToSection('features')}
              >
                Features
              </Button>
              <Button 
                variant="ghost" 
                className="w-full text-left justify-start text-gray-700 hover:text-primary hover:bg-primary/5 transition-all duration-300 font-medium text-lg py-4" 
                onClick={() => scrollToSection('ai-explanation')}
              >
                AI Agents
              </Button>
              <Button 
                variant="ghost" 
                className="w-full text-left justify-start text-gray-700 hover:text-primary hover:bg-primary/5 transition-all duration-300 font-medium text-lg py-4" 
                onClick={() => scrollToSection('faq')}
              >
                FAQ
              </Button>
              <Button 
                variant="ghost" 
                className="w-full text-left justify-start text-gray-700 hover:text-primary hover:bg-primary/5 transition-all duration-300 font-medium text-lg py-4" 
                onClick={() => {
                  navigate('/signin');
                  setIsOpen(false);
                }}
              >
                Sign In
              </Button>
              <Button 
                onClick={() => {
                  navigate('/waitlist');
                  setIsOpen(false);
                }} 
                className="w-full bg-gradient-to-r from-primary to-blue-600 text-white hover:shadow-xl transition-all duration-300 font-semibold mt-6 py-4 rounded-xl text-lg"
              >
                Join Waitlist
              </Button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
