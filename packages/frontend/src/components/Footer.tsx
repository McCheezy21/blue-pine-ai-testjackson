import { useNavigate } from "react-router-dom"
import BluePineLogo from "@/components/ui/BluePineLogo";
import { Shield, Phone, Mail, CheckCircle } from "lucide-react";

const Footer = () => {
  const navigate = useNavigate();

  const quickLinks = [
    { label: "Solutions", onClick: () => {
      navigate('/');
      setTimeout(() => {
        document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }},
    { label: "FAQ", onClick: () => {
      navigate('/');
      setTimeout(() => {
        document.getElementById('faq')?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }},
    { label: "See Demo", onClick: () => navigate('/demo') },
    { label: "Client Login", onClick: () => navigate('/signin') }
  ];

  return (
    <footer className="bg-[#004466] text-white">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-6 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Brand Section - Takes up 2 columns on large screens */}
          <div className="lg:col-span-2">
            <div className="flex items-center space-x-3 mb-6">
              <BluePineLogo size="lg" variant="footer" />
              <span className="text-2xl text-white font-serif font-bold">Blue Pine AI</span>
            </div>
            
            {/* Contact Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex items-start space-x-3">
                <Phone className="w-5 h-5 text-[#EAEFF2] mt-1 flex-shrink-0" />
                <div>
                  <div className="text-white font-semibold mb-1">Ready to get started?</div>
                  <button 
                    onClick={() => navigate('/demo')}
                    className="text-[#EAEFF2] hover:text-white hover:underline transition-all duration-300 cursor-pointer"
                  >
                    Schedule a consultation call
                  </button>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <Mail className="w-5 h-5 text-[#EAEFF2] mt-1 flex-shrink-0" />
                <div>
                  <div className="text-white font-semibold mb-1">Get in touch</div>
                  <div className="text-[#EAEFF2]">contact@bluepineai.com</div>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Links - Right column */}
          <div>
            <h3 className="text-white font-bold text-lg mb-6">Quick Links</h3>
            <ul className="space-y-4">
              {quickLinks.map((link, index) => (
                <li key={index}>
                  <button 
                    onClick={link.onClick}
                    className="text-[#EAEFF2] hover:text-white hover:underline transition-all duration-300 text-left cursor-pointer block"
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-[#003355] bg-[#003355]/20">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex flex-col lg:flex-row justify-between items-center space-y-4 lg:space-y-0">
            {/* Left side - Copyright and Legal */}
            <div className="flex flex-col sm:flex-row items-center text-center sm:text-left space-y-2 sm:space-y-0 sm:space-x-6 text-sm text-[#EAEFF2]">
              <div>© {new Date().getFullYear()} Blue Pine AI. All rights reserved.</div>
              <div className="flex items-center space-x-4">
                <button 
                  onClick={() => navigate('/privacy-policy')}
                  className="hover:text-white hover:underline transition-all duration-300 cursor-pointer"
                >
                  Privacy Policy
                </button>
                <span className="text-[#EAEFF2]/50">•</span>
                <button 
                  onClick={() => navigate('/terms')}
                  className="hover:text-white hover:underline transition-all duration-300 cursor-pointer"
                >
                  Terms of Service
                </button>
              </div>
            </div>
            
            {/* Right side - Compliance */}
            <div className="flex items-center space-x-6 text-sm text-[#EAEFF2]">
              <div className="flex items-center space-x-2">
                <Shield className="w-4 h-4" />
                <span>HIPAA Compliant</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4" />
                <span>SOC 2 Certified</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
