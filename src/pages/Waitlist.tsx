
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

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
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm<FormData>({
    resolver: zodResolver(formSchema)
  });

  const onSubmit = async (data: FormData) => {
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
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100">
      <Navbar />
      <main className="pt-24">
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center mb-16 animate-fade-up">
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6">
              <span className="gradient-text">Join the Waitlist</span>
              <br />
              <span className="text-gray-900">for Early Access</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto">
              Only <span className="font-semibold text-primary">13 Spots Left</span> in Closed Beta — Get Priority Before Launch
            </p>
          </div>
          
          <div className="max-w-2xl mx-auto">
            <div className="modern-card p-8 md:p-12 animate-fade-up">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-semibold text-gray-900 mb-2">
                  Let's Connect
                </h2>
                <p className="text-gray-600">
                  Join the future of healthcare automation
                </p>
              </div>
              
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="smooth-hover">
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name
                    </label>
                    <input 
                      {...register("name")} 
                      type="text" 
                      id="name" 
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-300 hover:border-primary/50" 
                      placeholder="John Doe" 
                    />
                    {errors.name && <p className="mt-2 text-sm text-red-600">{errors.name.message}</p>}
                  </div>
                  
                  <div className="smooth-hover">
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                      Work Email
                    </label>
                    <input 
                      {...register("email")} 
                      type="email" 
                      id="email" 
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-300 hover:border-primary/50" 
                      placeholder="john@facility.com" 
                    />
                    {errors.email && <p className="mt-2 text-sm text-red-600">{errors.email.message}</p>}
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="smooth-hover">
                    <label htmlFor="facility" className="block text-sm font-medium text-gray-700 mb-2">
                      Facility Name
                    </label>
                    <input 
                      {...register("facility")} 
                      type="text" 
                      id="facility" 
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-300 hover:border-primary/50" 
                      placeholder="Your Facility Name" 
                    />
                    {errors.facility && <p className="mt-2 text-sm text-red-600">{errors.facility.message}</p>}
                  </div>
                  
                  <div className="smooth-hover">
                    <label htmlFor="bedCount" className="block text-sm font-medium text-gray-700 mb-2">
                      Number of Beds
                    </label>
                    <input 
                      {...register("bedCount", { valueAsNumber: true })} 
                      type="number" 
                      id="bedCount" 
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-300 hover:border-primary/50" 
                      placeholder="Enter bed count" 
                      min="0" 
                    />
                    {errors.bedCount && <p className="mt-2 text-sm text-red-600">{errors.bedCount.message}</p>}
                  </div>
                </div>
                
                <div className="smooth-hover">
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                    Additional Information
                  </label>
                  <textarea 
                    {...register("message")} 
                    id="message" 
                    rows={4} 
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-300 hover:border-primary/50 resize-none" 
                    placeholder="Tell us about your facility and current challenges..." 
                  />
                  {errors.message && <p className="mt-2 text-sm text-red-600">{errors.message.message}</p>}
                </div>
                
                <div className="pt-4">
                  <button 
                    type="submit" 
                    className="w-full modern-button bg-gradient-to-r from-primary to-blue-600 text-white font-semibold py-4 px-8 rounded-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 active:scale-95"
                  >
                    <span className="relative z-10">Join Waitlist</span>
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

export default Waitlist;
