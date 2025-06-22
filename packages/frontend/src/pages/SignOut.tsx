import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { logout } from "@/utils/cognitoAuth";
import { CheckCircle, ArrowRight, Sparkles, Home } from "lucide-react";

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
    <div className="min-h-screen bg-gradient-to-br from-white via-slate-50/30 to-white">
      {/* Background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-500/10 to-blue-300/10 rounded-full blur-3xl animate-pulse-slow"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-br from-blue-400/10 to-blue-600/10 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '2s' }}></div>
      </div>

      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-6">
        <div className={`w-full max-w-md transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          {/* Header */}
          <div className="text-center mb-8">
            {/* Logo placeholder */}
            <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-lg">
              <Sparkles className="w-8 h-8 text-white" />
            </div>
            
            <h1 className="text-3xl md:text-4xl font-bold mb-4 tracking-tight">
              <span className="bg-gradient-to-r from-slate-900 via-blue-900 to-slate-900 bg-clip-text text-transparent">Sign Out</span>
            </h1>
            <p className="text-slate-600 font-medium">We're sorry to see you go</p>
          </div>
          
          {/* Main Card */}
          <div className="apple-glass-card p-8 mb-6">
            <div className="text-center text-slate-700 mb-8">
              <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-blue-50 flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-blue-600" />
              </div>
              <p className="leading-relaxed">
                You will be securely logged out of your Blue Pine AI account and redirected to our homepage.
              </p>
            </div>

            <div className="space-y-4">
              <Button 
                onClick={handleLogout}
                className="w-full apple-button bg-gradient-to-b from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white py-3 rounded-xl font-semibold shadow-lg"
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
                variant="outline"
                className="w-full py-3 rounded-xl font-semibold border-slate-300 text-slate-700 hover:bg-slate-50 transition-colors duration-300"
                disabled={isLoggingOut}
              >
                Cancel
              </Button>
            </div>
          </div>

          {/* Continue Exploring CTA */}
          <div className={`apple-glass-card p-6 text-center transition-all duration-1000 delay-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <h3 className="text-lg font-semibold text-slate-900 mb-2">Continue Exploring</h3>
            <p className="text-sm text-slate-600 mb-4">
              Discover how Blue Pine AI is transforming healthcare revenue cycles
            </p>
            <button
              onClick={handleContinueExploring}
              className="inline-flex items-center gap-2 px-6 py-2 text-blue-600 bg-blue-50 rounded-xl hover:bg-blue-100 transition-colors duration-300 font-semibold"
              disabled={isLoggingOut}
            >
              <Home className="w-4 h-4" />
              Explore Platform
            </button>
          </div>

          {/* Additional Info */}
          <div className={`text-center mt-8 transition-all duration-1000 delay-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <p className="text-sm text-slate-500">
              Questions? <a href="mailto:support@bluepineai.com" className="text-blue-600 hover:text-blue-700 transition-colors duration-300">Contact our support team</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignOut;
