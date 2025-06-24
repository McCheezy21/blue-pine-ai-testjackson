import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { ArrowRight, CheckCircle, Users, Clock, Star, TreePine } from "lucide-react";
import { useEffect, useState } from "react";
import BluePineLogo from "@/components/ui/BluePineLogo";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const formSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Please enter a valid email address"),
  facility: z.string().min(1, "Facility name is required"),
  bedCount: z.number().min(0, "Bed count must be 0 or greater"),
  message: z.string().optional()
});

type FormData = z.infer<typeof formSchema>;

const Demo = () => {
  const { toast } = useToast();
  const [isVisible, setIsVisible] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
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
  }, []);

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    try {
      const { error } = await supabase.from('Waitlist').insert({
        email: data.email,
        full_name: data.name,
        facility_name: data.facility,
        bed_count: data.bedCount,
        additional_info: data.message
      });

      if (error) throw error;

      toast({
        title: "Success!",
        description: "We will be in touch soon."
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

  const benefits = [
    { icon: Users, text: "Chosen by Administrators & Business Office Leaders Nationwide", description: "Partner with peers leading the shift to automation" },
    { icon: Clock, text: "Priority Access", description: "Skip the wait. Get a firsthand look at how our AI agents recover revenue and cut costs." },
    { icon: Star, text: "Shape the Future of AI in Healthcare", description: "Give feedback. Influence roadmap. Gain a competitive edge." }
  ];

  return (
    <div className="min-h-screen bg-white overflow-hidden">
      <Navbar />
      <main className="pt-16 pb-24">
        {/* Hero Section */}
        <section className="relative py-24 bg-gradient-to-b from-white to-slate-50/30 overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-500/3 via-transparent to-transparent"></div>
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className={`text-center mb-16 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
              {/* Badge */}
              <div className="inline-flex items-center px-4 py-2 rounded-full bg-[#EAEFF2] text-[#004466] font-medium text-sm mb-8 transition-all duration-700">
                <CheckCircle className="w-4 h-4 mr-2" />
                Limited Access Available
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold mb-6 tracking-tight leading-none text-[#004466]">
                See the Future of<br />
                <span className="text-[#004466]">Healthcare AI in Action</span>
              </h1>
              <p className="text-xl md:text-2xl text-[#333333] max-w-3xl mx-auto mb-8 leading-relaxed font-normal">
                Discover how top facilities are <span className="font-semibold text-[#004466]">boosting NOI</span> with AI — Book your personalized demo today
              </p>
              {/* Benefits Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto mb-16">
                {benefits.map((benefit, index) => (
                  <div 
                    key={index} 
                    className={`text-center transition-all duration-700 delay-${index * 200} ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}
                  >
                    <div className="w-16 h-16 mx-auto mb-4 rounded-lg bg-[#EAEFF2] flex items-center justify-center border border-[#CCCCCC]">
                      <benefit.icon className="w-8 h-8 text-[#004466]" />
                    </div>
                    <h3 className="text-lg font-bold text-[#004466] mb-2 font-serif">{benefit.text}</h3>
                    <p className="text-sm text-[#333333]">{benefit.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
        <section className="relative py-24 bg-white">
          <div className="absolute inset-0 bg-gradient-to-r from-slate-50/30 via-white to-slate-50/30"></div>
          <div className="relative max-w-2xl mx-auto">
            <div className={`glass-card p-8 md:p-12 transition-all duration-1000 delay-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}> 
              <div className="text-center mb-8">
                <h2 className="text-3xl md:text-4xl font-serif font-bold text-[#004466] mb-2 tracking-tight leading-none">
                  Secure Your Spot
                </h2>
                <p className="text-[#333333] text-lg">
                  Join healthcare facilities already transforming their revenue cycles
                </p>
              </div>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label htmlFor="name" className="block text-sm font-medium text-[#004466] font-serif">
                      Full Name *
                    </label>
                    <input 
                      {...register("name")} 
                      type="text" 
                      id="name" 
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#004466] focus:border-[#004466] transition-all duration-300 hover:border-[#004466]/50 bg-white text-[#004466] font-serif" 
                      placeholder="John Doe" 
                    />
                    {errors.name && <p className="text-sm text-red-600">{errors.name.message}</p>}
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="email" className="block text-sm font-medium text-[#004466] font-serif">
                      Work Email *
                    </label>
                    <input 
                      {...register("email")} 
                      type="email" 
                      id="email" 
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#004466] focus:border-[#004466] transition-all duration-300 hover:border-[#004466]/50 bg-white text-[#004466] font-serif" 
                      placeholder="john@facility.com" 
                    />
                    {errors.email && <p className="text-sm text-red-600">{errors.email.message}</p>}
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label htmlFor="facility" className="block text-sm font-medium text-[#004466] font-serif">
                      Facility Name *
                    </label>
                    <input 
                      {...register("facility")} 
                      type="text" 
                      id="facility" 
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#004466] focus:border-[#004466] transition-all duration-300 hover:border-[#004466]/50 bg-white text-[#004466] font-serif" 
                      placeholder="Your Facility Name" 
                    />
                    {errors.facility && <p className="text-sm text-red-600">{errors.facility.message}</p>}
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="bedCount" className="block text-sm font-medium text-[#004466] font-serif">
                      Number of Beds *
                    </label>
                    <input 
                      {...register("bedCount", { valueAsNumber: true })} 
                      type="number" 
                      id="bedCount" 
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#004466] focus:border-[#004466] transition-all duration-300 hover:border-[#004466]/50 bg-white text-[#004466] font-serif" 
                      placeholder="Enter bed count" 
                      min="0" 
                    />
                    {errors.bedCount && <p className="text-sm text-red-600">{errors.bedCount.message}</p>}
                  </div>
                </div>
                <div className="space-y-2">
                  <label htmlFor="message" className="block text-sm font-medium text-[#004466] font-serif">
                    Tell us about your challenges
                  </label>
                  <textarea 
                    {...register("message")} 
                    id="message" 
                    rows={4} 
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#004466] focus:border-[#004466] transition-all duration-300 hover:border-[#004466]/50 resize-none bg-white text-[#004466] font-serif" 
                    placeholder="What are your biggest revenue cycle challenges? This helps us prioritize your onboarding..." 
                  />
                  {errors.message && <p className="text-sm text-red-600">{errors.message.message}</p>}
                </div>
                <div className="pt-4">
                  <button 
                    type="submit" 
                    disabled={isSubmitting}
                    className="w-full bg-[#004466] text-white font-bold py-4 px-8 rounded-xl hover:bg-[#005580] transition-all duration-300 hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 font-serif"
                  >
                    {isSubmitting ? (
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    ) : (
                      <>
                        Join Demo
                        <ArrowRight className="w-5 h-5" />
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Demo;
