import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { BasicInfoFields } from "./fields/BasicInfoFields";
import { FacilityFields } from "./fields/FacilityFields";
import { useOnboardingForm } from "./hooks/useOnboardingForm";

const OnboardingForm = () => {
  const { form, isLoading, onSubmit } = useOnboardingForm();

  return (
    <Form {...form}>
      <form onSubmit={onSubmit} className="space-y-4">
        <BasicInfoFields form={form} />
        <FacilityFields form={form} />
        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? "Saving..." : "Complete Profile"}
        </Button>
      </form>
    </Form>
  );
};

export default OnboardingForm;