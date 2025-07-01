import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { logout } from "@/utils/cognitoAuth";
import { CheckCircle, ArrowRight, Home } from "lucide-react";
import BluePineLogo from "@/components/ui/BluePineLogo";

const SignOut = () => {
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setTimeout(() => setIsVisible(true), 100);
  }, []);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await logout();
      // Clear any remaining data
      localStorage.clear();
      // Smooth redirect to home page with transition
      setTimeout(() => {
        navigate('/', { replace: true });
      }, 1000);
    } catch (error) {
      console.error('Logout error:', error);
      // Still redirect even if there's an error
      setTimeout(() => {
        navigate('/', { replace: true });
      }, 1000);
    }
  };

  const handleCancel = () => {
    navigate('/dashboard');
  };

  const handleContinueExploring = () => {
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-6">
        <div className={`w-full max-w-md transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          {/* Header */}
          <div className="text-center mb-10">
            {/* Logo */}
            <div className="mb-6 text-center">
              <div className="flex items-center justify-center mb-4">
                <BluePineLogo size="lg" />
              </div>
              <h1 className="text-2xl text-[#004466] font-heading font-bold">
                Blue Pine AI
              </h1>
            </div>
            
            <h2 className="text-4xl font-bold mb-4 text-gray-900">
              Sign Out
            </h2>
            <p className="text-lg text-gray-700">We're sorry to see you go</p>
          </div>
          
          {/* Main Card */}
          <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-200 mb-6">
            <div className="text-center text-gray-700 mb-8">
              <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-[#EAEFF2] flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-[#004466]" />
              </div>
              <p className="text-base leading-relaxed">
                You will be securely logged out of your Blue Pine AI account and redirected to our homepage.
              </p>
            </div>

            <div className="space-y-4">
              <Button 
                onClick={handleLogout}
                className="w-full bg-[#004466] hover:bg-[#005580] text-white py-4 px-6 rounded-lg text-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-sm"
                disabled={isLoggingOut}
              >
                {isLoggingOut ? (
                  <span className="flex items-center justify-center gap-3">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Signing you out...
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    Yes, Sign Out
                    <ArrowRight className="w-4 h-4" />
                  </span>
                )}
              </Button>

              <Button 
                onClick={handleCancel}
                className="w-full bg-white text-gray-900 border-2 border-gray-300 hover:border-gray-400 hover:bg-gray-50 py-4 px-6 rounded-lg text-base font-semibold transition-all duration-300"
                disabled={isLoggingOut}
              >
                Cancel
              </Button>
            </div>
          </div>

          {/* Continue Exploring CTA */}
          <div className={`bg-white p-6 rounded-xl shadow-lg border border-gray-200 text-center transition-all duration-1000 delay-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <h3 className="text-xl font-bold text-[#004466] mb-2">Continue Exploring</h3>
            <p className="text-base text-gray-700 mb-4">
              Discover how Blue Pine AI is transforming healthcare revenue cycles
            </p>
            <button
              onClick={handleContinueExploring}
              className="inline-flex items-center gap-2 px-6 py-3 text-[#004466] bg-[#EAEFF2] rounded-lg hover:bg-[#d5dde3] transition-colors duration-300 font-semibold"
              disabled={isLoggingOut}
            >
              <Home className="w-4 h-4" />
              Explore Platform
            </button>
          </div>

          {/* Additional Info */}
          <div className={`text-center mt-8 transition-all duration-1000 delay-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <p className="text-sm text-gray-700">
              Questions? <a href="mailto:support@bluepineai.com" className="text-[#004466] hover:text-[#005580] hover:underline transition-colors duration-300 font-semibold">Contact our support team</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignOut;
