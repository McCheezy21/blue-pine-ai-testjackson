import { useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "@/components/ui/use-toast";
import { getUserInfo } from "@/utils/cognitoAuth";

const formSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Please enter a valid email address"),
  company: z.string().min(1, "Company name is required"),
  role: z.string().min(1, "Role is required"),
  message: z.string().min(10, "Please tell us more about your interest (minimum 10 characters)")
});

type FormData = z.infer<typeof formSchema>;

const RequestAccess = () => {
  const { toast } = useToast();
  const [isSubmitted, setIsSubmitted] = useState(false);
  const userInfo = getUserInfo();
  
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: userInfo?.firstName ? `${userInfo.firstName} ${userInfo.lastName || ''}`.trim() : '',
      email: userInfo?.email || ''
    }
  });

  const onSubmit = async (data: FormData) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3001'}/api/access-requests`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('idToken')}`
        },
        body: JSON.stringify({
          ...data,
          user_sub: userInfo?.sub
        })
      });

      if (!response.ok) {
        throw new Error('Failed to submit request');
      }

      setIsSubmitted(true);
      toast({
        title: "Request Submitted!",
        description: "Thank you for your interest. Our team will review your request and get back to you soon."
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

  const handleReturnHome = () => {
    window.location.href = '/';
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100">
        <Navbar />
        <main className="pt-24">
          <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
            <div className="text-center animate-fade-up">
              <div className="text-6xl mb-6">🎉</div>
              <h1 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900">
                Request Submitted!
              </h1>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
                Thank you for your interest in Blue Pine AI. Our team will review your request and reach out to discuss how we can help streamline your operations.
              </p>
              <button 
                onClick={handleReturnHome}
                className="modern-button bg-gradient-to-r from-primary to-blue-600 text-white font-semibold py-3 px-8 rounded-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 active:scale-95"
              >
                Return to Home
              </button>
            </div>
          </section>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100">
      <Navbar />
      <main className="pt-24">
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center mb-16 animate-fade-up">
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6">
              <span className="gradient-text">Interested in</span>
              <br />
              <span className="text-gray-900">Blue Pine AI?</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto">
              Contact us to <span className="font-semibold text-primary">get started</span> and discover how we can transform your healthcare operations
            </p>
          </div>
          
          <div className="max-w-2xl mx-auto">
            <div className="modern-card p-8 md:p-12 animate-fade-up">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-semibold text-gray-900 mb-2">
                  Let's Connect
                </h2>
                <p className="text-gray-600">
                  Tell us about your organization and we'll set up access for your team
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
                      placeholder="john@company.com" 
                    />
                    {errors.email && <p className="mt-2 text-sm text-red-600">{errors.email.message}</p>}
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="smooth-hover">
                    <label htmlFor="company" className="block text-sm font-medium text-gray-700 mb-2">
                      Company Name
                    </label>
                    <input 
                      {...register("company")} 
                      type="text" 
                      id="company" 
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-300 hover:border-primary/50" 
                      placeholder="Your Company Name" 
                    />
                    {errors.company && <p className="mt-2 text-sm text-red-600">{errors.company.message}</p>}
                  </div>
                  
                  <div className="smooth-hover">
                    <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-2">
                      Your Role
                    </label>
                    <input 
                      {...register("role")} 
                      type="text" 
                      id="role" 
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-300 hover:border-primary/50" 
                      placeholder="e.g., CTO, Operations Manager" 
                    />
                    {errors.role && <p className="mt-2 text-sm text-red-600">{errors.role.message}</p>}
                  </div>
                </div>
                
                <div className="smooth-hover">
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                    Tell us about your interest in Blue Pine AI
                  </label>
                  <textarea 
                    {...register("message")} 
                    id="message" 
                    rows={4} 
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-300 hover:border-primary/50 resize-none" 
                    placeholder="What challenges are you facing? How can Blue Pine AI help your organization?" 
                  />
                  {errors.message && <p className="mt-2 text-sm text-red-600">{errors.message.message}</p>}
                </div>
                
                <div className="pt-4">
                  <button 
                    type="submit" 
                    disabled={isSubmitting}
                    className="w-full modern-button bg-gradient-to-r from-primary to-blue-600 text-white font-semibold py-4 px-8 rounded-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                  >
                    <span className="relative z-10">
                      {isSubmitting ? 'Submitting...' : 'Request Access'}
                    </span>
                  </button>
                </div>
              </form>
              
              <div className="text-center mt-6">
                <button 
                  onClick={handleReturnHome}
                  className="text-gray-500 hover:text-gray-700 transition-colors"
                >
                  ← Return to Home
                </button>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default RequestAccess; 