import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { initiateCognitoLogin } from "@/utils/cognitoAuth";

const SignIn = () => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleCognitoLogin = () => {
    setIsLoading(true);
    try {
      initiateCognitoLogin();
    } catch (error) {
      console.error('Error initiating Cognito login:', error);
      setIsLoading(false);
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
              <Button 
                onClick={handleCognitoLogin}
                className="w-full bg-primary text-white hover:bg-primary/90"
                disabled={isLoading}
              >
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Redirecting...
                  </span>
                ) : (
                  "Continue with Blue Pine AI"
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
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
