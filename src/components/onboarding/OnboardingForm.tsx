import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

type FormData = {
  fullName: string;
  email: string;
  facilityName: string;
  bedCount: number;
  facilityAddress: string;
  referralCode: string;
};

const OnboardingForm = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [initialData, setInitialData] = useState<Partial<FormData>>({});

  const form = useForm<FormData>({
    defaultValues: {
      fullName: "",
      email: "",
      facilityName: "",
      bedCount: 0,
      facilityAddress: "",
      referralCode: "",
    },
  });

  useEffect(() => {
    const getInitialData = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate("/auth");
        return;
      }

      const { data: profile } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      if (profile) {
        setInitialData({
          fullName: profile.full_name || "",
          email: user.email || "",
          facilityName: profile.facility_name || "",
        });
        
        form.reset({
          fullName: profile.full_name || "",
          email: user.email || "",
          facilityName: profile.facility_name || "",
          bedCount: profile.bed_count || 0,
          facilityAddress: profile.facility_address || "",
          referralCode: profile.referral_code || "",
        });
      }
    };

    getInitialData();
  }, []);

  const onSubmit = async (data: FormData) => {
    setIsLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("No user found");

      const { error } = await supabase
        .from("profiles")
        .update({
          full_name: data.fullName,
          facility_name: data.facilityName,
          bed_count: data.bedCount,
          facility_address: data.facilityAddress,
          referral_code: data.referralCode,
        })
        .eq("id", user.id);

      if (error) throw error;

      toast({
        title: "Success!",
        description: "Your profile has been updated.",
      });
      
      navigate("/dashboard");
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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

        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? "Saving..." : "Complete Profile"}
        </Button>
      </form>
    </Form>
  );
};

export default OnboardingForm;