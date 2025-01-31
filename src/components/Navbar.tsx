import { useState } from "react";
import { Menu, X } from "lucide-react";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const scrollToEmail = () => {
    const emailInput = document.querySelector('input[type="email"]');
    if (emailInput) {
      emailInput.scrollIntoView({ behavior: 'smooth' });
      setIsOpen(false); // Close mobile menu if open
    }
  };

  return (
    <nav className="fixed w-full bg-white/90 backdrop-blur-sm z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-8">
          <div className="flex items-center gap-2">
            <img 
              src="/lovable-uploads/408a9d6d-f5ef-4982-8932-336aecfb2915.png" 
              alt="Blue Pine AI Logo" 
              className="h-6 w-6"
            />
            <span className="text-lg font-bold text-primary">Blue Pine AI</span>
          </div>
          
          {/* Desktop menu */}
          <div className="hidden md:flex items-center">
            <button 
              onClick={scrollToEmail}
              className="bg-primary text-white px-3 py-1 rounded-md hover:bg-primary/90 text-sm"
            >
              Join Waitlist
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-600 hover:text-primary"
            >
              {isOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {isOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              <button 
                onClick={scrollToEmail}
                className="w-full text-left px-3 py-2 text-white bg-primary rounded-md hover:bg-primary/90 text-sm"
              >
                Join Waitlist
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;