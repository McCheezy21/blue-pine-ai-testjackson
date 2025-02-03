import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { OnboardingFormData } from "../types";

export const useOnboardingForm = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [initialData, setInitialData] = useState<Partial<OnboardingFormData>>({});

  const form = useForm<OnboardingFormData>({
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

  const onSubmit = async (data: OnboardingFormData) => {
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

  return {
    form,
    isLoading,
    onSubmit: form.handleSubmit(onSubmit),
  };
};