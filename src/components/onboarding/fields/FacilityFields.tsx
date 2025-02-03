import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import { OnboardingFormData } from "../types";

interface FacilityFieldsProps {
  form: UseFormReturn<OnboardingFormData>;
}

export const FacilityFields = ({ form }: FacilityFieldsProps) => {
  return (
    <>
      <FormField
        control={form.control}
        name="bedCount"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Bed Count</FormLabel>
            <FormControl>
              <Input
                {...field}
                type="number"
                min="0"
                placeholder="Number of beds"
                onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="facilityAddress"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Facility Address</FormLabel>
            <FormControl>
              <Input {...field} placeholder="Full facility address" />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="referralCode"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Referral Code</FormLabel>
            <FormControl>
              <Input {...field} placeholder="Enter referral code if you have one" />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
};