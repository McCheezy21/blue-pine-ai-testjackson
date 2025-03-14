import { ArrowRight } from "lucide-react";
import { Input } from "./ui/input";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "./ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { ShimmerButton } from "./ui/shimmer-button";
import { Form, FormControl, FormField, FormItem, FormMessage } from "./ui/form";
import { useEffect } from "react";
import { updateFavicon } from "@/utils/faviconUtils";

const formSchema = z.object({
  email: z.string().email("Please enter a valid email address")
});

const Hero = () => {
  const { toast } = useToast();
  
  useEffect(() => {
    // Update the favicon to make the tree fill more of the space
    updateFavicon('/lovable-uploads/da7c17c5-429b-4214-9103-3a18d0b27744.png');
  }, []);
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: ""
    }
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    console.log('Submitting email:', values.email);
    try {
      const {
        data,
        error
      } = await supabase.from('Waitlist').insert({
        email: values.email
      }).select();
      console.log('Supabase response:', {
        data,
        error
      });
      if (error) throw error;
      toast({
        title: "Success!",
        description: "You've been added to our waitlist."
      });
      form.reset();
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Error",
        description: "There was a problem adding you to the waitlist. Please try again.",
        variant: "destructive"
      });
    }
  };

  return <div className="relative min-h-[80vh] flex items-center">
      <div className="absolute inset-0 md:bg-gradient-to-br from-primary/10 to-secondary/10 -z-10" />
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9')] bg-cover bg-center opacity-35 -z-20" />
      <div className="absolute bottom-0 w-full h-32 bg-gradient-to-b from-transparent to-accent" />
      
      <div className="mt-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-primary mb-6 animate-fade-down py-[30px] md:text-6xl">
            SNF Revenue Cycle Made Effortless: <br />AI does the work
          </h1>
          <div className="flex justify-center mb-6 animate-fade-up">
            <p className="text-primary font-medium tracking-wide text-2xl">
              Maximize Revenue <span className="text-gray-400 mx-2">|</span> Reduce Denials <span className="text-gray-400 mx-2">|</span> Automate Cashflow
            </p>
          </div>
          <p className="text-gray-600 mb-8 max-w-5xl mx-auto animate-fade-up text-2xl py-[29px]">Say goodbye to revenue loss and inefficiencies. Our AI agents optimize patient sourcing, automate claims, recover underpayments, and streamline your revenue cycle—without extra staff</p>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col sm:flex-row gap-8 justify-center items-center animate-fade-up relative z-10">
              <FormField control={form.control} name="email" render={({
              field
            }) => <FormItem>
                    <FormControl>
                      <Input type="email" placeholder="Enter your email" className="w-[300px] h-12 text-base" {...field} />
                    </FormControl>
                    <FormMessage className="absolute text-left text-sm" />
                  </FormItem>} />
              <ShimmerButton type="submit" className="h-12 px-8 py-3" background="#004466" shimmerColor="#ffffff" borderRadius="0.375rem">
                <span className="flex items-center gap-2">
                  Join Waitlist
                  <ArrowRight className="group-hover:translate-x-1 transition-transform" />
                </span>
              </ShimmerButton>
            </form>
          </Form>
        </div>
      </div>
    </div>;
};

export default Hero;
