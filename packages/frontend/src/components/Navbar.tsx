import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import BluePineLogo from "@/components/ui/BluePineLogo";

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
    <nav className="fixed top-0 left-0 right-0 z-50 transition-all duration-500 bg-[#EAEFF2] border-b border-[#EAEFF2] shadow-sm px-6 sm:px-8 lg:px-12">
      <div className="flex justify-between items-center h-20 w-full">
        {/* Left Side: Logo + Navigation Items */}
        <div className="flex items-center space-x-8 flex-shrink-0">
          {/* Logo */}
          <div 
            className="flex items-center cursor-pointer group space-x-1"
            onClick={() => navigate('/')}
          >
            <BluePineLogo className="group-hover:scale-110 transition-transform duration-300" size="lg" />
            <span className="text-2xl text-[#004466] font-serif">
              Blue Pine AI
            </span>
          </div>

          {/* Desktop Navigation Items */}
          <div className="hidden lg:flex items-center space-x-2">
            <Button 
              variant="ghost" 
              onClick={() => navigate('/')} 
              className="text-[#333333] hover:text-[#004466] hover:bg-[#EAEFF2] transition-all duration-300 font-medium px-4 py-2 rounded-lg text-base"
            >
              Home
            </Button>
            <Button 
              variant="ghost" 
              onClick={() => scrollToSection('features')} 
              className="text-[#333333] hover:text-[#004466] hover:bg-[#EAEFF2] transition-all duration-300 font-medium px-4 py-2 rounded-lg text-base"
            >
              Features
            </Button>
            <Button 
              variant="ghost" 
              onClick={() => scrollToSection('ai-explanation')} 
              className="text-[#333333] hover:text-[#004466] hover:bg-[#EAEFF2] transition-all duration-300 font-medium px-4 py-2 rounded-lg text-base"
            >
              AI Solutions
            </Button>
            <Button 
              variant="ghost" 
              onClick={() => scrollToSection('faq')} 
              className="text-[#333333] hover:text-[#004466] hover:bg-[#EAEFF2] transition-all duration-300 font-medium px-4 py-2 rounded-lg text-base"
            >
              Resources
            </Button>
          </div>
        </div>

        {/* Right Side: Auth Buttons */}
        <div className="hidden lg:flex items-center space-x-4 ml-auto">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/signin')} 
            className="text-[#333333] hover:text-[#004466] hover:bg-[#EAEFF2] transition-all duration-300 font-medium px-6 py-2 rounded-lg text-base"
          >
            LOG-IN
          </Button>
          <Button 
            onClick={() => navigate('/demo')} 
            className="blue-pine-button px-6 py-2 rounded-lg text-base"
          >
            DEMO
          </Button>
        </div>

        {/* Mobile Menu Button */}
        <div className="lg:hidden flex items-center">
          <button 
            onClick={() => setIsOpen(!isOpen)} 
            className="text-[#333333] p-3 rounded-xl hover:bg-[#EAEFF2] transition-all duration-300"
          >
            {isOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <div className="lg:hidden absolute top-full left-0 right-0 bg-white/95 backdrop-blur-xl border-b border-[#EAEFF2] shadow-sm rounded-b-lg">
          <div className="px-6 py-8 space-y-4">
            <Button 
              variant="ghost" 
              className="w-full text-left justify-start text-[#333333] hover:text-[#004466] hover:bg-[#EAEFF2] transition-all duration-300 font-medium text-lg py-4" 
              onClick={() => {
                navigate('/');
                setIsOpen(false);
              }}
            >
              Home
            </Button>
            <Button 
              variant="ghost" 
              className="w-full text-left justify-start text-[#333333] hover:text-[#004466] hover:bg-[#EAEFF2] transition-all duration-300 font-medium text-lg py-4" 
              onClick={() => scrollToSection('features')}
            >
              Features
            </Button>
            <Button 
              variant="ghost" 
              className="w-full text-left justify-start text-[#333333] hover:text-[#004466] hover:bg-[#EAEFF2] transition-all duration-300 font-medium text-lg py-4" 
              onClick={() => scrollToSection('ai-explanation')}
            >
              AI Solutions
            </Button>
            <Button 
              variant="ghost" 
              className="w-full text-left justify-start text-[#333333] hover:text-[#004466] hover:bg-[#EAEFF2] transition-all duration-300 font-medium text-lg py-4" 
              onClick={() => scrollToSection('faq')}
            >
              Resources
            </Button>
            
            {/* Mobile Auth Section */}
            <div className="pt-6 border-t border-[#EAEFF2]">
              <Button 
                variant="ghost" 
                className="w-full text-left justify-start text-[#333333] hover:text-[#004466] hover:bg-[#EAEFF2] transition-all duration-300 font-medium text-lg py-4" 
                onClick={() => {
                  navigate('/signin');
                  setIsOpen(false);
                }}
              >
                LOG-IN
              </Button>
              <Button 
                onClick={() => {
                  navigate('/demo');
                  setIsOpen(false);
                }} 
                className="w-full mt-3 blue-pine-button py-4 rounded-lg text-lg"
              >
                DEMO
              </Button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
