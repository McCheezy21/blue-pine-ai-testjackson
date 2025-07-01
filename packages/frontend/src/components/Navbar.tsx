import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X, Shield, Phone } from "lucide-react";
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
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
      isScrolled 
        ? 'bg-white/95 backdrop-blur-xl border-b border-[#CCCCCC] shadow-lg' 
        : 'bg-white/90 backdrop-blur-sm border-b border-[#EAEFF2]'
    } px-6 sm:px-8 lg:px-12`}>
      <div className="flex justify-between items-center h-20 w-full">
        {/* Left Side: Logo + Brand Statement */}
        <div className="flex items-center space-x-8 flex-shrink-0">
          {/* Logo with enhanced branding */}
          <div 
            className="flex items-center cursor-pointer group space-x-3"
            onClick={() => navigate('/')}
          >
            <BluePineLogo className="group-hover:scale-110 transition-transform duration-300" size="lg" />
            <span className="text-2xl text-[#004466] font-serif font-bold leading-tight font-heading">
              Blue Pine AI
            </span>
          </div>

          {/* Desktop Navigation Items - Professional & Clear */}
          <div className="hidden lg:flex items-center space-x-1">
            <Button 
              variant="ghost" 
              onClick={() => navigate('/')} 
              className="text-[#333333] hover:text-[#004466] hover:bg-[#EAEFF2]/60 transition-all duration-300 font-semibold px-4 py-2 rounded-lg text-sm tracking-wide"
            >
              Home
            </Button>
            <Button 
              variant="ghost" 
              onClick={() => {
                if (window.location.pathname === '/') {
                  scrollToSection('features');
                } else {
                  navigate('/');
                  setTimeout(() => {
                    document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' });
                  }, 100);
                }
              }} 
              className="text-[#333333] hover:text-[#004466] hover:bg-[#EAEFF2]/60 transition-all duration-300 font-semibold px-4 py-2 rounded-lg text-sm tracking-wide"
            >
              Solutions
            </Button>
            <Button 
              variant="ghost" 
              onClick={() => {
                if (window.location.pathname === '/') {
                  scrollToSection('faq');
                } else {
                  navigate('/');
                  setTimeout(() => {
                    document.getElementById('faq')?.scrollIntoView({ behavior: 'smooth' });
                  }, 100);
                }
              }} 
              className="text-[#333333] hover:text-[#004466] hover:bg-[#EAEFF2]/60 transition-all duration-300 font-semibold px-4 py-2 rounded-lg text-sm tracking-wide"
            >
              FAQ
            </Button>
            <div className="flex items-center px-3 py-2 bg-[#EAEFF2]/40 rounded-lg">
              <Shield className="w-4 h-4 text-[#004466] mr-2" />
              <span className="text-xs text-[#004466] font-semibold">HIPAA Compliant</span>
            </div>
          </div>
        </div>

        {/* Right Side: Auth & CTA */}
        <div className="hidden lg:flex items-center space-x-4 ml-auto">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/signin')} 
            className="text-[#333333] hover:text-[#004466] hover:bg-[#EAEFF2]/60 transition-all duration-300 font-semibold px-6 py-2 rounded-lg text-sm border border-[#CCCCCC] hover:border-[#004466]"
          >
            Client Login
          </Button>
          <Button 
            onClick={() => navigate('/demo')} 
            className="blue-pine-button px-6 py-3 rounded-lg text-sm font-semibold shadow-sm"
          >
            See It In Action
          </Button>
        </div>

        {/* Mobile Menu Button */}
        <div className="lg:hidden flex items-center">
          <button 
            onClick={() => setIsOpen(!isOpen)} 
            className="text-[#333333] p-3 rounded-xl hover:bg-[#EAEFF2]/60 transition-all duration-300 border border-[#CCCCCC]"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation - Enhanced */}
      {isOpen && (
        <div className="lg:hidden absolute top-full left-0 right-0 bg-white/95 backdrop-blur-xl border-b border-[#CCCCCC] shadow-lg">
          <div className="px-6 py-8 space-y-4">
            {/* Trust badge for mobile */}
            <div className="flex items-center justify-center px-4 py-3 bg-[#EAEFF2]/60 rounded-lg border border-[#CCCCCC] mb-6">
              <Shield className="w-5 h-5 text-[#004466] mr-3" />
              <span className="text-sm text-[#004466] font-semibold">HIPAA Compliant • SOC 2 Certified</span>
            </div>

            <Button 
              variant="ghost" 
              className="w-full text-left justify-start text-[#333333] hover:text-[#004466] hover:bg-[#EAEFF2]/60 transition-all duration-300 font-semibold text-lg py-4" 
              onClick={() => {
                navigate('/');
                setIsOpen(false);
              }}
            >
              Home
            </Button>
            <Button 
              variant="ghost" 
              className="w-full text-left justify-start text-[#333333] hover:text-[#004466] hover:bg-[#EAEFF2]/60 transition-all duration-300 font-semibold text-lg py-4" 
              onClick={() => {
                if (window.location.pathname === '/') {
                  scrollToSection('features');
                } else {
                  navigate('/');
                  setTimeout(() => {
                    document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' });
                  }, 100);
                }
                setIsOpen(false);
              }}
            >
              Solutions
            </Button>
            <Button 
              variant="ghost" 
              className="w-full text-left justify-start text-[#333333] hover:text-[#004466] hover:bg-[#EAEFF2]/60 transition-all duration-300 font-semibold text-lg py-4" 
              onClick={() => {
                if (window.location.pathname === '/') {
                  scrollToSection('faq');
                } else {
                  navigate('/');
                  setTimeout(() => {
                    document.getElementById('faq')?.scrollIntoView({ behavior: 'smooth' });
                  }, 100);
                }
                setIsOpen(false);
              }}
            >
              FAQ
            </Button>
            
            {/* Mobile Auth Section */}
            <div className="pt-6 border-t border-[#CCCCCC] space-y-4">
              <Button 
                variant="ghost" 
                className="w-full text-center justify-center text-[#333333] hover:text-[#004466] hover:bg-[#EAEFF2]/60 transition-all duration-300 font-semibold text-lg py-4 border border-[#CCCCCC]" 
                onClick={() => {
                  navigate('/signin');
                  setIsOpen(false);
                }}
              >
                Client Login
              </Button>
              <Button 
                onClick={() => {
                  navigate('/demo');
                  setIsOpen(false);
                }} 
                className="w-full blue-pine-button py-4 rounded-lg text-lg font-semibold shadow-sm"
              >
                See It In Action
              </Button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
