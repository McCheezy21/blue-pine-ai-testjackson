import { Button } from "@/components/ui/button";
import { Chrome } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { AuthFormProps } from "./types";
import { useAuthForm } from "./hooks/useAuthForm";
import { CredentialFields } from "./components/CredentialFields";
import { FacilityFields } from "./components/FacilityFields";

const AuthForm = ({ isLogin, setIsLogin }: AuthFormProps) => {
  const {
    formData,
    isLoading,
    handleInputChange,
    handleAuth,
    handleGoogleSignIn,
  } = useAuthForm(isLogin);

  return (
    <form onSubmit={handleAuth} className="space-y-4">
      <CredentialFields
        isLogin={isLogin}
        formData={formData}
        handleInputChange={handleInputChange}
      />
      
      {!isLogin && (
        <FacilityFields
          formData={formData}
          handleInputChange={handleInputChange}
        />
      )}

      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? "Loading..." : isLogin ? "Login" : "Sign Up"}
      </Button>
      
      <div className="relative my-4">
        <div className="absolute inset-0 flex items-center">
          <Separator />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">
            Or continue with
          </span>
        </div>
      </div>

      <Button
        type="button"
        variant="outline"
        className="w-full"
        onClick={handleGoogleSignIn}
      >
        <Chrome className="mr-2 h-4 w-4" />
        Continue with Google
      </Button>

      <Button
        type="button"
        variant="link"
        className="w-full"
        onClick={() => setIsLogin(!isLogin)}
      >
        {isLogin
          ? "Don't have an account? Sign Up"
          : "Already have an account? Login"}
      </Button>
    </form>
  );
};

export default AuthForm;