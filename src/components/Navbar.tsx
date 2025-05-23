
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { useIsMobile } from "../hooks/use-mobile";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  const location = useLocation();
  const scrollToSection = (sectionId: string) => {
    if (location.pathname !== '/') {
      navigate('/');
      // Wait for navigation to complete before scrolling
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
    setIsOpen(false); // Close mobile menu after clicking
  };
  return <nav className="fixed w-full bg-white/90 backdrop-blur-sm z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center gap-2 cursor-pointer hover:opacity-90 transition-opacity" onClick={() => navigate('/')}>
            <img src="/lovable-uploads/408a9d6d-f5ef-4982-8932-336aecfb2915.png" alt="Blue Pine AI Logo" className="h-14 w-14" />
            <span className="text-2xl font-bold text-primary">Blue Pine AI</span>
          </div>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            <Button variant="ghost" onClick={() => navigate('/')}>
              Home
            </Button>
            <Button variant="ghost" onClick={() => scrollToSection('features')}>
              Features
            </Button>
            <Button variant="ghost" onClick={() => scrollToSection('ai-explanation')}>AI Agent?</Button>
            <Button variant="ghost" onClick={() => scrollToSection('faq')}>
              FAQ
            </Button>
            <Button variant="outline" onClick={() => navigate('/signin')} className="mr-2">
              Sign In
            </Button>
            <Button variant="outline" onClick={() => navigate('/waitlist')} className="text-slate-50 mx-[9px] my-0 bg-primary hover:bg-primary/90 py-[14px] px-[35px]">Join Waitlist</Button>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button onClick={() => setIsOpen(!isOpen)} className="text-primary p-2 rounded-md hover:bg-gray-100">
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 bg-white border-t">
              <Button variant="ghost" className="w-full text-left justify-start" onClick={() => {
            navigate('/');
            setIsOpen(false);
          }}>
                Home
              </Button>
              <Button variant="ghost" className="w-full text-left justify-start" onClick={() => scrollToSection('features')}>
                Features
              </Button>
              <Button variant="ghost" className="w-full text-left justify-start" onClick={() => scrollToSection('ai-explanation')}>
                Why AI?
              </Button>
              <Button variant="ghost" className="w-full text-left justify-start" onClick={() => scrollToSection('faq')}>
                FAQ
              </Button>
              <Button variant="ghost" className="w-full text-left justify-start" onClick={() => {
                navigate('/signin');
                setIsOpen(false);
              }}>
                Sign In
              </Button>
              <Button variant="outline" onClick={() => {
            navigate('/waitlist');
            setIsOpen(false);
          }} className="w-full text-slate-50 bg-primary hover:bg-primary/90">
                Join Waitlist
              </Button>
            </div>
          </div>}
      </div>
    </nav>;
};
export default Navbar;
