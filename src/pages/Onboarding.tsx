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
import OnboardingForm from "@/components/onboarding/OnboardingForm";

const Onboarding = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-accent p-4 relative">
      <Button
        variant="ghost"
        className="absolute top-4 left-4 gap-2"
        onClick={() => navigate('/auth')}
      >
        <ArrowLeft className="h-4 w-4" />
        Back
      </Button>
      <Card className="w-full max-w-xl">
        <CardHeader>
          <CardTitle>Complete Your Profile</CardTitle>
          <CardDescription>
            Please provide some additional information about your facility.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <OnboardingForm />
        </CardContent>
      </Card>
    </div>
  );
};

export default Onboarding;