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
const Demo = () => {
  const {
    toast
  } = useToast();
  const {
    register,
    handleSubmit,
    formState: {
      errors
    },
    reset
  } = useForm<FormData>({
    resolver: zodResolver(formSchema)
  });
  const onSubmit = async (data: FormData) => {
    try {
      const {
        error
      } = await supabase.from('Waitlist').insert({
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
      reset(); // Clear the form
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Error",
        description: "There was a problem submitting your request. Please try again.",
        variant: "destructive"
      });
    }
  };
  return <div className="min-h-screen bg-gradient-to-b from-white to-accent">
      <Navbar />
      <main className="pt-24">
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-primary mb-6">Join the Waitlist for Early Access</h1>
          <p className="text-xl text-gray-600 max-w-3xl mb-8">Only 13 Spots Left in Closed Beta — Get Priority Before Launch</p>
          
          {/* Contact Form Section */}
          <div className="bg-white p-8 rounded-lg shadow-lg max-w-2xl">
            <h2 className="text-2xl font-semibold text-primary mb-6">
              Let's Connect
            </h2>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name
                </label>
                <input {...register("name")} type="text" id="name" className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary" placeholder="John Doe" />
                {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>}
              </div>
              
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Work Email
                </label>
                <input {...register("email")} type="email" id="email" className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary" placeholder="john@facility.com" />
                {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>}
              </div>
              
              <div>
                <label htmlFor="facility" className="block text-sm font-medium text-gray-700 mb-1">
                  Facility Name
                </label>
                <input {...register("facility")} type="text" id="facility" className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary" placeholder="Your Facility Name" />
                {errors.facility && <p className="mt-1 text-sm text-red-600">{errors.facility.message}</p>}
              </div>
              
              <div>
                <label htmlFor="bedCount" className="block text-sm font-medium text-gray-700 mb-1">
                  Number of Beds
                </label>
                <input {...register("bedCount", {
                valueAsNumber: true
              })} type="number" id="bedCount" className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary" placeholder="Enter bed count" min="0" />
                {errors.bedCount && <p className="mt-1 text-sm text-red-600">{errors.bedCount.message}</p>}
              </div>
              
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                  Additional Information
                </label>
                <textarea {...register("message")} id="message" rows={4} className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary" placeholder="Tell us about your facility and current challenges..." />
                {errors.message && <p className="mt-1 text-sm text-red-600">{errors.message.message}</p>}
              </div>
              
              <div className="mt-8 sm:mt-6">
                <button type="submit" className="w-full bg-primary text-white px-6 py-3 rounded-md hover:bg-primary/90 transition-colors">Join Waitlist</button>
              </div>
            </form>
          </div>
        </section>
      </main>
      <Footer />
    </div>;
};
export default Demo;