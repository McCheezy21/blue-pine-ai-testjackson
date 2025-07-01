import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, CheckCircle, TreePine, Building2, Shield } from "lucide-react";
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
    <div className="min-h-screen bg-white relative">
      {/* Navigation */}
      <nav className="relative z-50 bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <button 
              onClick={() => navigate("/")} 
              className="flex items-center gap-3 text-gray-700 hover:text-[#004466] transition-all duration-300 group"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              <span className="font-medium">Back to Home</span>
            </button>
          </div>
        </div>
      </nav>
      
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-6 py-20">
        <div className="w-full max-w-md">
          {/* Header */}
          <div className={`text-center mb-10 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            {/* Logo */}
            <div className="mb-8 text-center">
              <div className="flex items-center justify-center mb-4">
                <BluePineLogo size="lg" />
              </div>
              <h1 className="text-2xl text-[#004466] font-heading font-bold">
                Blue Pine AI
              </h1>
            </div>

            <h2 className="text-4xl font-bold mb-4 text-gray-900">
              Welcome Back
            </h2>
            <p className="text-lg text-gray-700">
              Sign in to continue to your dashboard
            </p>
          </div>
          
          {/* Sign In Card */}
          <div className={`bg-white p-8 rounded-xl shadow-lg border border-gray-200 transition-all duration-1000 delay-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <div className="space-y-6">
              {/* Primary Option */}
              <div className="text-center">
                <p className="text-base text-gray-700 mb-4 font-medium">Recommended for healthcare facilities</p>
                <button 
                  onClick={() => handleSocialLogin('PointClickCare')}
                  className="w-full bg-[#004466] hover:bg-[#005580] text-white py-4 px-6 rounded-lg text-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 group transition-all duration-300 shadow-sm"
                  disabled={isLoading}
                >
                  {loadingProvider === 'PointClickCare' ? (
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  ) : (
                    <Building2 className="w-5 h-5 group-hover:scale-110 transition-transform" />
                  )}
                  <span>
                    {loadingProvider === 'PointClickCare' ? 'Connecting...' : 'Continue with PointClickCare'}
                  </span>
                </button>
              </div>

              {/* Divider */}
              <div className="relative py-4">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-gray-300" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="bg-white px-4 text-gray-600 font-medium">or continue with</span>
                </div>
              </div>

              {/* Secondary Options */}
              <div className="space-y-4">
                <button 
                  onClick={() => handleSocialLogin('Google')}
                  className="w-full bg-white text-gray-900 border-2 border-gray-300 hover:border-gray-400 hover:bg-gray-50 flex items-center justify-center gap-3 py-4 px-6 rounded-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed group text-base font-semibold"
                  disabled={isLoading}
                >
                  {loadingProvider === 'Google' ? (
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-gray-900"></div>
                  ) : (
                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                    </svg>
                  )}
                  <span>
                    {loadingProvider === 'Google' ? 'Connecting...' : 'Continue with Google'}
                  </span>
                </button>

                <button 
                  onClick={handleCognitoLogin}
                  className="w-full bg-white text-gray-900 border-2 border-gray-300 hover:border-gray-400 hover:bg-gray-50 flex items-center justify-center gap-3 py-4 px-6 rounded-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed text-base font-semibold"
                  disabled={isLoading}
                >
                  {loadingProvider === 'Cognito' ? (
                    <span className="flex items-center gap-2">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-current"></div>
                      Redirecting...
                    </span>
                  ) : (
                    "Continue with Email"
                  )}
                </button>
              </div>
            </div>
            
            {/* Footer */}
            <div className="mt-8 text-center">
              <p className="text-base text-gray-700">
                Need access?{' '}
                <Link to="/demo" className="text-[#004466] hover:text-[#005580] hover:underline font-semibold transition-colors">
                  Request Demo
                </Link>
              </p>
            </div>
          </div>

          {/* Trust Indicators */}
          <div className={`mt-8 text-center transition-all duration-1000 delay-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <div className="flex items-center justify-center space-x-6 text-sm text-gray-700">
              <div className="flex items-center space-x-2">
                <Shield className="w-4 h-4 text-[#004466]" />
                <span className="font-medium">HIPAA Compliant</span>
              </div>
              <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-[#004466]" />
                <span className="font-medium">SOC 2 Certified</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
