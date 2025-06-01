import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { initiateSocialLogin, initiateCognitoLogin } from "@/utils/cognitoAuth";

const SignIn = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [loadingProvider, setLoadingProvider] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleSocialLogin = async (provider: 'Google' | 'Microsoft') => {
    // Clear any existing authentication data to force fresh login
    localStorage.clear();
    
    setIsLoading(true);
    setLoadingProvider(provider);
    try {
      console.log(`📞 Calling initiateSocialLogin for ${provider}`);
      await initiateSocialLogin(provider);
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
    // Clear any existing authentication data to force fresh login
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
    <div className="min-h-screen flex flex-col bg-accent/10 font-sans">
      <div className="py-4 px-6">
        <Button 
          variant="ghost" 
          onClick={() => navigate("/")} 
          className="flex items-center text-primary"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Home
        </Button>
      </div>
      
      <div className="flex-1 flex flex-col items-center justify-center px-6">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <img 
              src="/lovable-uploads/408a9d6d-f5ef-4982-8932-336aecfb2915.png" 
              alt="Blue Pine AI Logo" 
              className="mx-auto h-16 w-16"
            />
            <h1 className="mt-4 text-3xl font-bold text-primary">Sign In</h1>
            <p className="mt-2 text-gray-600">Welcome back to Blue Pine AI</p>
          </div>
          
          <div className="bg-white p-8 rounded-lg shadow-md">
            <div className="space-y-4">
              {/* Google Sign In */}
              <Button 
                onClick={() => handleSocialLogin('Google')}
                className="w-full bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 flex items-center justify-center gap-3"
                disabled={isLoading}
              >
                {loadingProvider === 'Google' ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-gray-700"></div>
                ) : (
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                )}
                {loadingProvider === 'Google' ? 'Connecting...' : 'Continue with Google'}
              </Button>

              {/* Microsoft Sign In */}
              <Button 
                onClick={() => handleSocialLogin('Microsoft')}
                className="w-full bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 flex items-center justify-center gap-3"
                disabled={isLoading}
              >
                {loadingProvider === 'Microsoft' ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-gray-700"></div>
                ) : (
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path fill="#f25022" d="M1 1h10v10H1z"/>
                    <path fill="#00a4ef" d="M12 1h10v10H12z"/>
                    <path fill="#7fba00" d="M1 12h10v10H1z"/>
                    <path fill="#ffb900" d="M12 12h10v10H12z"/>
                  </svg>
                )}
                {loadingProvider === 'Microsoft' ? 'Connecting...' : 'Continue with Microsoft'}
              </Button>

              {/* Divider */}
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-gray-300" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-white px-2 text-gray-500">Or</span>
                </div>
              </div>

              {/* Traditional Blue Pine AI Login */}
              <Button 
                onClick={handleCognitoLogin}
                className="w-full bg-primary text-white hover:bg-primary/90"
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
              </Button>
            </div>
            
            <div className="mt-6 text-center text-sm">
              <p>
                Don't have an account?{" "}
                <Link to="/waitlist" className="text-primary hover:underline">
                  Join our waitlist
                </Link>
              </p>
            </div>
            
            <div className="mt-4 text-center text-xs text-gray-500">
              <p>
                By signing in, you agree to our{" "}
                <Link to="/privacy-policy" className="text-primary hover:underline">
                  Privacy Policy
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
