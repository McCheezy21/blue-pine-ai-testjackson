import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import { OnboardingFormData } from "../types";

interface BasicInfoFieldsProps {
  form: UseFormReturn<OnboardingFormData>;
}

export const BasicInfoFields = ({ form }: BasicInfoFieldsProps) => {
  return (
    <>
      <FormField
        control={form.control}
        name="fullName"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Full Name</FormLabel>
            <FormControl>
              <Input {...field} disabled placeholder="Your full name" />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="email"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Email</FormLabel>
            <FormControl>
              <Input {...field} disabled type="email" placeholder="Your email" />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="facilityName"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Facility Name</FormLabel>
            <FormControl>
              <Input {...field} disabled placeholder="Your facility name" />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
};