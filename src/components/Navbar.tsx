
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { useIsMobile } from "../hooks/use-mobile";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const isMobile = useIsMobile();
  const navigate = useNavigate();

  return (
    <nav className="fixed w-full bg-white/90 backdrop-blur-sm z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center gap-2">
            <img 
              src="/lovable-uploads/408a9d6d-f5ef-4982-8932-336aecfb2915.png" 
              alt="Blue Pine AI Logo" 
              className="h-14 w-14"
            />
            <span className="text-2xl font-bold text-primary">Blue Pine AI</span>
          </div>
          
          <div className="hidden md:flex items-center space-x-4">
            <Button 
              variant="ghost" 
              onClick={() => navigate('/')}
            >
              Home
            </Button>
            <Button 
              variant="ghost" 
              onClick={() => navigate('/why-ai')}
            >
              Why AI?
            </Button>
            <Button 
              variant="ghost" 
              onClick={() => navigate('/snf-roi')}
            >
              SNF ROI
            </Button>
            <Button 
              variant="ghost" 
              onClick={() => navigate('/auth')}
            >
              Account
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
