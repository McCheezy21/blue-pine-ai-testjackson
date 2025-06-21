import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { ArrowRight, CheckCircle, Users, Clock, Star, TreePine } from "lucide-react";
import { useEffect, useState } from "react";
import BluePineLogo from "@/components/ui/BluePineLogo";

const formSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Please enter a valid email address"),
  facility: z.string().min(1, "Facility name is required"),
  bedCount: z.number().min(0, "Bed count must be 0 or greater"),
  message: z.string().optional()
});

type FormData = z.infer<typeof formSchema>;

const Waitlist = () => {
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
        description: "You've been added to our waitlist. We'll be in touch soon."
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
    { icon: Users, text: "Join 500+ Healthcare Leaders", description: "Be part of an exclusive community" },
    { icon: Clock, text: "Priority Access", description: "Get first access to our platform" },
    { icon: Star, text: "Beta Testing Benefits", description: "Shape the future of healthcare AI" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50/30">
      {/* Navigation */}
      <nav className="bg-white/90 backdrop-blur-xl border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center">
              <a href="/" className="flex items-center space-x-3 group">
                <BluePineLogo className="group-hover:scale-110 transition-transform duration-300" size="lg" />
                <span className="text-2xl font-bold bg-gradient-to-r from-slate-900 via-blue-900 to-slate-900 bg-clip-text text-transparent group-hover:scale-105 transition-transform">
                  Blue Pine AI
                </span>
              </a>
            </div>
            <div className="flex items-center space-x-4">
              <a href="/" className="text-gray-600 hover:text-primary transition-colors font-medium text-lg">
                Back to Home
              </a>
            </div>
          </div>
        </div>
      </nav>

      <main className="pt-16 pb-24">
        {/* Hero Section */}
        <section className="relative py-20 overflow-hidden">
          {/* Background Elements */}
          <div className="absolute inset-0">
            <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-primary/10 to-blue-300/10 rounded-full blur-3xl floating-element"></div>
            <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-br from-blue-200/10 to-primary/10 rounded-full blur-3xl floating-element" style={{ animationDelay: '2s' }}></div>
          </div>

          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className={`text-center mb-16 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
              {/* Badge */}
              <div className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-primary/10 to-blue-100/50 border border-primary/20 text-primary font-medium text-sm mb-8">
                <CheckCircle className="w-4 h-4 mr-2" />
                Limited Beta Access Available
              </div>

              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6">
                <span className="gradient-text">Join the Future</span>
                <br />
                <span className="text-gray-900">of Healthcare AI</span>
              </h1>

              <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto mb-8 leading-relaxed">
                Only <span className="font-semibold text-primary">13 Spots Left</span> in Closed Beta — 
                Get Priority Access Before Public Launch
              </p>

              {/* Benefits Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto mb-16">
                {benefits.map((benefit, index) => (
                  <div 
                    key={index} 
                    className={`text-center transition-all duration-700 delay-${index * 200} ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}
                  >
                    <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-primary/10 to-blue-50 flex items-center justify-center">
                      <benefit.icon className="w-8 h-8 text-primary" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 mb-2">{benefit.text}</h3>
                    <p className="text-sm text-gray-600">{benefit.description}</p>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Form Section */}
            <div className="max-w-2xl mx-auto">
              <div className={`glass-card p-8 md:p-12 transition-all duration-1000 delay-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
                <div className="text-center mb-8">
                  <h2 className="text-3xl font-semibold text-gray-900 mb-2">
                    Secure Your Spot
                  </h2>
                  <p className="text-gray-600">
                    Join healthcare facilities already transforming their revenue cycles
                  </p>
                </div>
                
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                        Full Name *
                      </label>
                      <input 
                        {...register("name")} 
                        type="text" 
                        id="name" 
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-300 hover:border-primary/50 bg-white" 
                        placeholder="John Doe" 
                      />
                      {errors.name && <p className="text-sm text-red-600">{errors.name.message}</p>}
                    </div>
                    
                    <div className="space-y-2">
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                        Work Email *
                      </label>
                      <input 
                        {...register("email")} 
                        type="email" 
                        id="email" 
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-300 hover:border-primary/50 bg-white" 
                        placeholder="john@facility.com" 
                      />
                      {errors.email && <p className="text-sm text-red-600">{errors.email.message}</p>}
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label htmlFor="facility" className="block text-sm font-medium text-gray-700">
                        Facility Name *
                      </label>
                      <input 
                        {...register("facility")} 
                        type="text" 
                        id="facility" 
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-300 hover:border-primary/50 bg-white" 
                        placeholder="Your Facility Name" 
                      />
                      {errors.facility && <p className="text-sm text-red-600">{errors.facility.message}</p>}
                    </div>
                    
                    <div className="space-y-2">
                      <label htmlFor="bedCount" className="block text-sm font-medium text-gray-700">
                        Number of Beds *
                      </label>
                      <input 
                        {...register("bedCount", { valueAsNumber: true })} 
                        type="number" 
                        id="bedCount" 
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-300 hover:border-primary/50 bg-white" 
                        placeholder="Enter bed count" 
                        min="0" 
                      />
                      {errors.bedCount && <p className="text-sm text-red-600">{errors.bedCount.message}</p>}
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <label htmlFor="message" className="block text-sm font-medium text-gray-700">
                      Tell us about your challenges
                    </label>
                    <textarea 
                      {...register("message")} 
                      id="message" 
                      rows={4} 
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-300 hover:border-primary/50 resize-none bg-white" 
                      placeholder="What are your biggest revenue cycle challenges? This helps us prioritize your onboarding..." 
                    />
                    {errors.message && <p className="text-sm text-red-600">{errors.message.message}</p>}
                  </div>
                  
                  <div className="pt-4">
                    <button 
                      type="submit" 
                      disabled={isSubmitting}
                      className="w-full bg-gradient-to-r from-primary to-blue-600 text-white font-semibold py-4 px-8 rounded-xl hover:shadow-xl transition-all duration-300 hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
                    >
                      {isSubmitting ? (
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      ) : (
                        <>
                          Join Waitlist
                          <ArrowRight className="w-5 h-5" />
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-gradient-to-r from-primary to-blue-600 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex items-center justify-center mb-6">
              <BluePineLogo size="lg" className="mr-3" />
              <span className="text-2xl font-bold">Blue Pine AI</span>
            </div>
            <p className="text-white/80 text-lg">
              © 2024 Blue Pine AI. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Waitlist;
