import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { ArrowRight, CheckCircle, Users, Clock, Star, Shield, TrendingUp, Phone, Play } from "lucide-react";
import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const formSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Please enter a valid email address"),
  facility: z.string().min(1, "Facility name is required"),
  bedCount: z.number().min(0, "Bed count must be 0 or greater"),
  message: z.string().optional(),
  jobTitle: z.string().min(1, "Job title is required")
});

type FormData = z.infer<typeof formSchema>;

const Demo = () => {
  const { toast } = useToast();
  const [isVisible, setIsVisible] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showValueProp, setShowValueProp] = useState(false);
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm<FormData>({
    resolver: zodResolver(formSchema)
  });

  useEffect(() => {
    setIsVisible(true);
    // Show additional value prop after 2 seconds
    const timer = setTimeout(() => {
      setShowValueProp(true);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    try {
      const { error } = await supabase.from('Waitlist').insert({
        email: data.email,
        full_name: data.name,
        facility_name: data.facility,
        bed_count: data.bedCount,
        additional_info: data.message,
        job_title: data.jobTitle
      });

      if (error) throw error;

      toast({
        title: "Thank you for your interest!",
        description: "We'll contact you within 24 hours to schedule your personalized demo."
      });
      reset();
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Error",
        description: "There was a problem submitting your request. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const trustIndicators = [
    { icon: Shield, label: "HIPAA Compliant", sublabel: "SOC 2 Certified" },
    { icon: Users, label: "50+ SNFs", sublabel: "Currently Served" },
    { icon: TrendingUp, label: "$2M+", sublabel: "Revenue Recovered" }
  ];

  const benefits = [
    { 
      icon: TrendingUp, 
      title: "See Real Results", 
      description: "Watch live demos of revenue recovery in action with actual client data (anonymized)"
    },
    { 
      icon: Clock, 
      title: "30-Minute Expert Consultation", 
      description: "Get personalized insights on your facility's revenue cycle optimization potential"
    },
    { 
      icon: Users, 
      title: "Join Leading Facilities", 
      description: "Connect with a community of SNF leaders already transforming their operations"
    }
  ];

  const demoFeatures = [
    "Live walkthrough of AI agents in action",
    "ROI projections based on your bed count",
    "Q&A with revenue cycle experts"
  ];

  return (
    <div className="min-h-screen bg-white overflow-hidden">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative pt-24 pb-16 bg-gradient-to-b from-white to-slate-50/30 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-500/3 via-transparent to-transparent"></div>
        
        {/* Subtle background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-[#EAEFF2] rounded-full opacity-20"></div>
          <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-[#EAEFF2] rounded-full opacity-20"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className={`transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
              {/* Trust badge */}
              <div className="inline-flex items-center px-4 py-2 rounded-full bg-[#EAEFF2] text-[#004466] font-medium text-sm mb-6">
                <CheckCircle className="w-4 h-4 mr-2" />
                Exclusive Demo Access
              </div>

              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 tracking-tight leading-none text-[#004466]">
                See How AI Transforms<br />
                <span className="text-[#004466]">Your Revenue Cycle</span>
              </h1>

              <p className="text-xl text-[#333333] mb-8 leading-relaxed">
                Get a personalized demo showing exactly how Blue Pine AI can{' '}
                <span className="font-semibold text-[#004466]">boost your facility's NOI by 3-8%</span>{' '}
                while reducing administrative burden.
              </p>

              {/* Value proposition that appears after delay */}
                             <div className={`transition-all duration-1000 ${showValueProp ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'} mb-8`}>
                 <div className="inline-flex items-center px-6 py-3 bg-white/80 backdrop-blur-sm rounded-full border border-[#CCCCCC] shadow-sm">
                   <span className="text-[#004466] font-medium">✓ No implementation fees</span>
                   <span className="mx-3 text-[#CCCCCC]">•</span>
                   <span className="text-[#004466] font-medium">✓ 60-day ROI guarantee</span>
                 </div>
               </div>

              {/* Benefits */}
              <div className="grid grid-cols-1 gap-6 mb-8">
                {benefits.map((benefit, index) => (
                  <div 
                    key={index} 
                    className={`flex items-start space-x-4 transition-all duration-700 delay-${index * 200} ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8'}`}
                  >
                    <div className="w-12 h-12 rounded-lg bg-[#EAEFF2] flex items-center justify-center border border-[#CCCCCC] flex-shrink-0">
                      <benefit.icon className="w-6 h-6 text-[#004466]" />
                    </div>
                    <div>
                      <h3 className="font-bold text-[#004466] mb-1">{benefit.title}</h3>
                      <p className="text-[#333333] text-sm leading-relaxed">{benefit.description}</p>
                    </div>
                  </div>
                ))}
              </div>

              
            </div>

            {/* Right Content - Form */}
            <div className={`transition-all duration-1000 delay-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
              <div className="bg-white p-8 rounded-lg shadow-lg border-2 border-gray-300 ring-1 ring-gray-200">
                <div className="text-center mb-8">
                  <h2 className="text-2xl font-bold text-[#004466] mb-2">
                    Schedule Your Personalized Demo
                  </h2>
                  <p className="text-[#333333]">
                    See exactly how Blue Pine AI works for facilities like yours
                  </p>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label htmlFor="name" className="block text-sm font-semibold text-[#004466]">
                        Full Name *
                      </label>
                      <input 
                        {...register("name")} 
                        type="text" 
                        id="name" 
                        className="w-full px-4 py-3 border border-[#CCCCCC] rounded-lg focus:ring-2 focus:ring-[#004466] focus:border-[#004466] transition-all duration-300 hover:border-[#004466]/50 bg-white text-[#004466]" 
                        placeholder="John Smith" 
                      />
                      {errors.name && <p className="text-sm text-red-600">{errors.name.message}</p>}
                    </div>
                    
                    <div className="space-y-2">
                      <label htmlFor="jobTitle" className="block text-sm font-semibold text-[#004466]">
                        Job Title *
                      </label>
                      <input 
                        {...register("jobTitle")} 
                        type="text" 
                        id="jobTitle" 
                        className="w-full px-4 py-3 border border-[#CCCCCC] rounded-lg focus:ring-2 focus:ring-[#004466] focus:border-[#004466] transition-all duration-300 hover:border-[#004466]/50 bg-white text-[#004466]" 
                        placeholder="Administrator, CFO, etc." 
                      />
                      {errors.jobTitle && <p className="text-sm text-red-600">{errors.jobTitle.message}</p>}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="email" className="block text-sm font-semibold text-[#004466]">
                      Work Email *
                    </label>
                    <input 
                      {...register("email")} 
                      type="email" 
                      id="email" 
                      className="w-full px-4 py-3 border border-[#CCCCCC] rounded-lg focus:ring-2 focus:ring-[#004466] focus:border-[#004466] transition-all duration-300 hover:border-[#004466]/50 bg-white text-[#004466]" 
                      placeholder="john@yourfacility.com" 
                    />
                    {errors.email && <p className="text-sm text-red-600">{errors.email.message}</p>}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label htmlFor="facility" className="block text-sm font-semibold text-[#004466]">
                        Facility Name *
                      </label>
                      <input 
                        {...register("facility")} 
                        type="text" 
                        id="facility" 
                        className="w-full px-4 py-3 border border-[#CCCCCC] rounded-lg focus:ring-2 focus:ring-[#004466] focus:border-[#004466] transition-all duration-300 hover:border-[#004466]/50 bg-white text-[#004466]" 
                        placeholder="Your SNF Name" 
                      />
                      {errors.facility && <p className="text-sm text-red-600">{errors.facility.message}</p>}
                    </div>
                    
                    <div className="space-y-2">
                      <label htmlFor="bedCount" className="block text-sm font-semibold text-[#004466]">
                        Number of Beds *
                      </label>
                      <input 
                        {...register("bedCount", { valueAsNumber: true })} 
                        type="number" 
                        id="bedCount" 
                        className="w-full px-4 py-3 border border-[#CCCCCC] rounded-lg focus:ring-2 focus:ring-[#004466] focus:border-[#004466] transition-all duration-300 hover:border-[#004466]/50 bg-white text-[#004466]" 
                        placeholder="120" 
                        min="0" 
                      />
                      {errors.bedCount && <p className="text-sm text-red-600">{errors.bedCount.message}</p>}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="message" className="block text-sm font-semibold text-[#004466]">
                      Biggest Revenue Cycle Challenge (Optional)
                    </label>
                    <textarea 
                      {...register("message")} 
                      id="message" 
                      rows={3}
                      className="w-full px-4 py-3 border border-[#CCCCCC] rounded-lg focus:ring-2 focus:ring-[#004466] focus:border-[#004466] transition-all duration-300 hover:border-[#004466]/50 bg-white text-[#004466] resize-none" 
                      placeholder="e.g., High denial rates, slow reimbursements, staffing challenges..."
                    />
                  </div>

                  <button 
                    type="submit" 
                    disabled={isSubmitting}
                    className="w-full blue-pine-button py-4 px-8 text-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
                  >
                    {isSubmitting ? (
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    ) : (
                      <>
                        <Phone className="w-5 h-5" />
                        Schedule My Demo
                        <ArrowRight className="w-5 h-5" />
                      </>
                    )}
                  </button>

                  <p className="text-xs text-[#666666] text-center">
                    We'll contact you within 24 hours to schedule your personalized demo
                  </p>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* What You'll See Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-[#004466] mb-4">
              What You'll See in Your Demo
            </h2>
            <p className="text-lg text-[#333333] max-w-2xl mx-auto">
              A comprehensive walkthrough tailored to your facility's specific needs and challenges
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {demoFeatures.map((feature, index) => (
              <div key={index} className="flex items-start space-x-3 p-6 bg-[#F8F9FA] rounded-lg border border-[#CCCCCC]">
                <div className="w-6 h-6 bg-[#004466] rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <CheckCircle className="w-4 h-4 text-white" />
                </div>
                <div>
                  <p className="text-[#333333] font-medium">{feature}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Video placeholder with better design */}
          <div className="mt-16 max-w-4xl mx-auto">
            <div className="bg-gradient-to-br from-[#004466] to-[#003355] rounded-lg p-8 text-center text-white">
              <div className="w-20 h-20 mx-auto mb-6 bg-white/20 rounded-full flex items-center justify-center">
                <Play className="w-10 h-10 text-white ml-1" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-white">Live Demo Preview</h3>
              <p className="text-[#EAEFF2] mb-6 max-w-2xl mx-auto">
                Watch a 3-minute overview of how Blue Pine AI transforms revenue cycles for SNFs like yours
              </p>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-8 border border-white/20">
                <p className="text-[#EAEFF2]">
                  Interactive demo video will be embedded here
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Demo;
