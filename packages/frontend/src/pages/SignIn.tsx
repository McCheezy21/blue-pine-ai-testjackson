import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, CheckCircle, TreePine, Building2 } from "lucide-react";
import { initiateSocialLogin, initiateCognitoLogin } from "@/utils/cognitoAuth";
import { initiatePointClickCareLogin } from "@/utils/pointClickCareAuth";
import BluePineLogo from "@/components/ui/BluePineLogo";

const SignIn = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [loadingProvider, setLoadingProvider] = useState<string | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const navigate = useNavigate();

  console.log('🔍 SignIn: Component loaded');

  // Trigger animation on mount
  useState(() => {
    setTimeout(() => setIsVisible(true), 100);
  });

  const handleSocialLogin = async (provider: 'Google' | 'Microsoft' | 'PointClickCare') => {
    console.log(`🔐 SignIn: Starting ${provider} OAuth flow`);
    
    localStorage.clear();
    
    setIsLoading(true);
    setLoadingProvider(provider);
    try {
      if (provider === 'PointClickCare') {
        console.log(`📞 Calling initiatePointClickCareLogin`);
        await initiatePointClickCareLogin();
      } else {
        console.log(`📞 Calling initiateSocialLogin for ${provider}`);
        await initiateSocialLogin(provider);
      }
      setTimeout(() => {
        setIsLoading(false);
        setLoadingProvider(null);
      }, 5000);
    } catch (error) {
      console.error(`❌ Error initiating ${provider} login:`, error);
      setIsLoading(false);
      setLoadingProvider(null);
    }
  };

  const handleCognitoLogin = () => {
    localStorage.clear();
    
    setIsLoading(true);
    setLoadingProvider('Cognito');
    try {
      initiateCognitoLogin();
    } catch (error) {
      console.error('Error initiating Cognito login:', error);
      setIsLoading(false);
      setLoadingProvider(null);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50/30 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-primary/10 to-blue-300/10 rounded-full blur-3xl floating-element"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-br from-blue-200/10 to-primary/10 rounded-full blur-3xl floating-element" style={{ animationDelay: '2s' }}></div>
      </div>

      {/* Navigation */}
      <nav className="relative z-50 bg-white/80 backdrop-blur-xl border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <button 
              onClick={() => navigate("/")} 
              className="flex items-center gap-3 text-gray-600 hover:text-primary transition-all duration-300 group"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              Back to Home
            </button>
          </div>
        </div>
      </nav>
      
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-6 py-20">
        <div className="w-full max-w-md">
          {/* Header */}
          <div className={`text-center mb-12 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            {/* Badge */}
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-primary/10 to-blue-100/50 border border-primary/20 text-primary font-medium text-sm mb-6">
              <CheckCircle className="w-4 h-4 mr-2" />
              Secure Access Portal
            </div>

            {/* Logo */}
            <div className="mb-8 text-center">
              <div className="flex items-center justify-center mb-4">
                <BluePineLogo size="xl" />
              </div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-900 via-blue-900 to-slate-900 bg-clip-text text-transparent mb-2">
                Blue Pine AI
              </h1>
              <p className="text-slate-600 text-lg">
                Revenue Cycle Automation for SNFs
              </p>
            </div>

            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              <span className="gradient-text">Welcome Back</span>
            </h1>
            <p className="text-xl text-gray-600">
              Continue your revenue cycle transformation
            </p>
          </div>
          
          {/* Sign In Card */}
          <div className={`glass-card p-8 transition-all duration-1000 delay-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <div className="space-y-4">
              {/* PointClickCare Sign In - Primary Option */}
              <button 
                onClick={() => handleSocialLogin('PointClickCare')}
                className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800 hover:shadow-xl transition-all duration-300 hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 py-4 px-6 rounded-xl font-semibold group shadow-lg"
                disabled={isLoading}
              >
                {loadingProvider === 'PointClickCare' ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                ) : (
                  <Building2 className="w-5 h-5 group-hover:scale-110 transition-transform" />
                )}
                <span className="font-semibold">
                  {loadingProvider === 'PointClickCare' ? 'Connecting...' : 'Continue with PointClickCare'}
                </span>
              </button>

              {/* Divider */}
              <div className="relative py-2">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-gray-200" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="bg-white px-4 text-gray-500 font-medium">Or continue with</span>
                </div>
              </div>

              {/* Google Sign In */}
              <button 
                onClick={() => handleSocialLogin('Google')}
                className="w-full bg-white text-gray-700 border border-gray-200 hover:border-primary/30 hover:bg-gray-50 flex items-center justify-center gap-3 py-4 px-6 rounded-xl transition-all duration-300 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed group"
                disabled={isLoading}
              >
                {loadingProvider === 'Google' ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-gray-700"></div>
                ) : (
                  <svg className="w-5 h-5 group-hover:scale-110 transition-transform" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                )}
                <span className="font-medium">
                  {loadingProvider === 'Google' ? 'Connecting...' : 'Continue with Google'}
                </span>
              </button>

              {/* Divider */}
              <div className="relative py-4">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-gray-200" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="bg-white px-4 text-gray-500 font-medium">Or continue with</span>
                </div>
              </div>

              {/* Traditional Blue Pine AI Login */}
              <button 
                onClick={handleCognitoLogin}
                className="w-full bg-gradient-to-r from-primary to-blue-600 text-white hover:shadow-xl transition-all duration-300 hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 py-4 px-6 rounded-xl font-semibold"
                disabled={isLoading}
              >
                {loadingProvider === 'Cognito' ? (
                  <span className="flex items-center gap-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Redirecting...
                  </span>
                ) : (
                  "Continue with Email"
                )}
              </button>
            </div>
            
            <div className="mt-8 text-center space-y-4">
              <p className="text-gray-600">
                Don't have an account?{" "}
                <Link to="/demo" className="text-primary hover:underline font-medium transition-colors">
                  Join our demo
                </Link>
              </p>
              
              <div className="text-sm text-gray-500">
                <p>
                  By signing in, you agree to our{" "}
                  <Link to="/privacy-policy" className="text-primary hover:underline transition-colors">
                    Privacy Policy
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
