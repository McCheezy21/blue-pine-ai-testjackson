
import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { ArrowLeft } from "lucide-react";

const SignIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // AWS Cognito configuration
  const cognitoConfig = {
    authority: 'https://cognito-idp.us-west-1.amazonaws.com/us-west-1_9PggkJZsQ',
    clientId: '2pq6naf36qj1sj5qugiss1pt3l',
    redirectUri: window.location.origin + '/dashboard', // This will redirect back to your dashboard
    scope: 'phone openid email'
  };

  const handleCognitoLogin = () => {
    const authUrl = `${cognitoConfig.authority}/oauth2/authorize?` +
      `client_id=${cognitoConfig.clientId}&` +
      `response_type=code&` +
      `scope=${encodeURIComponent(cognitoConfig.scope)}&` +
      `redirect_uri=${encodeURIComponent(cognitoConfig.redirectUri)}`;
    
    // Redirect to AWS Cognito hosted UI
    window.location.href = authUrl;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      // For development purposes, we'll redirect to Cognito instead of local auth
      handleCognitoLogin();
    } catch (err) {
      console.error("Sign in error:", err);
      setError("Failed to sign in. Please check your credentials and try again.");
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
            {error && (
              <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-md text-sm">
                {error}
              </div>
            )}
            
            <div className="space-y-4">
              <Button 
                onClick={handleCognitoLogin}
                className="w-full bg-primary text-white hover:bg-primary/90"
                disabled={isLoading}
              >
                {isLoading ? "Redirecting..." : "Continue with Blue Pine AI"}
              </Button>
              
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-white px-2 text-muted-foreground">Or continue with email</span>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your@email.com"
                    required
                    className="w-full"
                  />
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <Label htmlFor="password">Password</Label>
                    <Link to="/forgot-password" className="text-sm text-primary hover:underline">
                      Forgot password?
                    </Link>
                  </div>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    className="w-full"
                  />
                </div>
                
                <Button 
                  type="submit" 
                  className="w-full bg-primary text-white"
                  disabled={isLoading}
                  variant="outline"
                >
                  {isLoading ? "Signing in..." : "Sign In with Email"}
                </Button>
              </form>
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
