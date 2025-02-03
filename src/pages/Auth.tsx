import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import AuthForm from "@/components/auth/AuthForm";

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-accent relative">
      <Button
        variant="ghost"
        className="absolute top-4 left-4 gap-2"
        onClick={() => navigate('/')}
      >
        <ArrowLeft className="h-4 w-4" />
        Back
      </Button>
      <Card className="w-[400px]">
        <CardHeader>
          <CardTitle>{isLogin ? "Login" : "Sign Up"}</CardTitle>
          <CardDescription>
            {isLogin
              ? "Welcome back! Please login to your account."
              : "Create a new account to get started."}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <AuthForm isLogin={isLogin} setIsLogin={setIsLogin} />
        </CardContent>
      </Card>
    </div>
  );
};

export default Auth;