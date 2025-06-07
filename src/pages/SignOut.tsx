
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { logout } from "@/utils/cognitoAuth";

const SignOut = () => {
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const navigate = useNavigate();

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await logout();
      // Clear any remaining data
      localStorage.clear();
      // Redirect to home page
      navigate('/');
    } catch (error) {
      console.error('Logout error:', error);
      // Still redirect even if there's an error
      navigate('/');
    }
  };

  const handleCancel = () => {
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen flex flex-col bg-accent/10 font-sans">
      <div className="flex-1 flex flex-col items-center justify-center px-6">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <img 
              src="/lovable-uploads/408a9d6d-f5ef-4982-8932-336aecfb2915.png" 
              alt="Blue Pine AI Logo" 
              className="mx-auto h-16 w-16"
            />
            <h1 className="mt-4 text-3xl font-bold text-primary">Sign Out</h1>
            <p className="mt-2 text-gray-600">Are you sure you want to sign out?</p>
          </div>
          
          <div className="bg-white p-8 rounded-lg shadow-md">
            <div className="space-y-4">
              <div className="text-center text-gray-700 mb-6">
                <p>You will be logged out of your Blue Pine AI account and redirected to the home page.</p>
              </div>

              <div className="flex flex-col gap-3">
                <Button 
                  onClick={handleLogout}
                  className="w-full bg-red-600 text-white hover:bg-red-700"
                  disabled={isLoggingOut}
                >
                  {isLoggingOut ? (
                    <span className="flex items-center gap-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      Signing out...
                    </span>
                  ) : (
                    "Yes, Sign Out"
                  )}
                </Button>

                <Button 
                  onClick={handleCancel}
                  variant="outline"
                  className="w-full"
                  disabled={isLoggingOut}
                >
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignOut;
