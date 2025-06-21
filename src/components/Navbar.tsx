import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X, TreePine } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setIsOpen(false);
    }
  };

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
      isScrolled 
        ? 'bg-white/80 backdrop-blur-xl border-b border-slate-200/50 shadow-lg' 
        : 'bg-transparent'
    }`}>
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        <div className="flex justify-between items-center h-20">
          {/* Left Side: Logo + Navigation Items */}
          <div className="flex items-center space-x-8">
            {/* Logo */}
            <div 
              className="flex items-center cursor-pointer group"
              onClick={() => navigate('/')}
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center mr-3 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                <TreePine className="text-white w-6 h-6" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-slate-900 via-blue-900 to-slate-900 bg-clip-text text-transparent">
                Blue Pine AI
              </span>
            </div>

            {/* Desktop Navigation Items */}
            <div className="hidden lg:flex items-center space-x-2">
              <Button 
                variant="ghost" 
                onClick={() => navigate('/')}
                className="text-slate-700 hover:text-blue-600 hover:bg-blue-50 transition-all duration-300 font-medium px-4 py-2 rounded-lg text-base"
              >
                Home
              </Button>
              <Button 
                variant="ghost" 
                onClick={() => scrollToSection('features')}
                className="text-slate-700 hover:text-blue-600 hover:bg-blue-50 transition-all duration-300 font-medium px-4 py-2 rounded-lg text-base"
              >
                Features
              </Button>
              <Button 
                variant="ghost" 
                onClick={() => scrollToSection('ai-explanation')}
                className="text-slate-700 hover:text-blue-600 hover:bg-blue-50 transition-all duration-300 font-medium px-4 py-2 rounded-lg text-base"
              >
                AI Solutions
              </Button>
              <Button 
                variant="ghost" 
                onClick={() => scrollToSection('faq')}
                className="text-slate-700 hover:text-blue-600 hover:bg-blue-50 transition-all duration-300 font-medium px-4 py-2 rounded-lg text-base"
              >
                Resources
              </Button>
            </div>
          </div>

          {/* Right Side: Auth Buttons */}
          <div className="hidden lg:flex items-center space-x-4">
            <Button 
              variant="ghost" 
              onClick={() => navigate('/signin')}
              className="text-slate-700 hover:text-blue-600 hover:bg-blue-50 transition-all duration-300 font-medium px-6 py-2 rounded-lg text-base"
            >
              LOG-IN
            </Button>
            <Button 
              onClick={() => navigate('/waitlist')} 
              className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold px-6 py-2 rounded-lg text-base shadow-lg transition-all duration-300"
            >
              JOIN WAITLIST
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <div className="lg:hidden flex items-center">
            <button 
              onClick={() => setIsOpen(!isOpen)} 
              className="text-slate-700 p-3 rounded-xl hover:bg-slate-100 transition-all duration-300"
            >
              {isOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="lg:hidden absolute top-full left-0 right-0 bg-white/95 backdrop-blur-xl border-b border-slate-200/50 shadow-xl rounded-b-2xl">
            <div className="px-6 py-8 space-y-4">
              <Button 
                variant="ghost" 
                className="w-full text-left justify-start text-slate-700 hover:text-blue-600 hover:bg-blue-50 transition-all duration-300 font-medium text-lg py-4" 
                onClick={() => {
                  navigate('/');
                  setIsOpen(false);
                }}
              >
                Home
              </Button>
              <Button 
                variant="ghost" 
                className="w-full text-left justify-start text-slate-700 hover:text-blue-600 hover:bg-blue-50 transition-all duration-300 font-medium text-lg py-4" 
                onClick={() => scrollToSection('features')}
              >
                Features
              </Button>
              <Button 
                variant="ghost" 
                className="w-full text-left justify-start text-slate-700 hover:text-blue-600 hover:bg-blue-50 transition-all duration-300 font-medium text-lg py-4" 
                onClick={() => scrollToSection('ai-explanation')}
              >
                AI Solutions
              </Button>
              <Button 
                variant="ghost" 
                className="w-full text-left justify-start text-slate-700 hover:text-blue-600 hover:bg-blue-50 transition-all duration-300 font-medium text-lg py-4" 
                onClick={() => scrollToSection('faq')}
              >
                Resources
              </Button>
              
              {/* Mobile Auth Section */}
              <div className="pt-6 border-t border-slate-200">
                <Button 
                  variant="ghost" 
                  className="w-full text-left justify-start text-slate-700 hover:text-blue-600 hover:bg-blue-50 transition-all duration-300 font-medium text-lg py-4" 
                  onClick={() => {
                    navigate('/signin');
                    setIsOpen(false);
                  }}
                >
                  LOG-IN
                </Button>
                <Button 
                  onClick={() => {
                    navigate('/waitlist');
                    setIsOpen(false);
                  }} 
                  className="w-full mt-3 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold py-4 rounded-xl text-lg shadow-lg"
                >
                  JOIN WAITLIST
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
