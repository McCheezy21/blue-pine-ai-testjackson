
import { ArrowRight } from "lucide-react";
import { ShimmerButton } from "./ui/shimmer-button";

const Hero = () => {
  return <div className="relative min-h-[80vh] flex items-center">
      <div className="absolute inset-0 md:bg-gradient-to-br from-primary/10 to-secondary/10 -z-10" />
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9')] bg-cover bg-center opacity-35 -z-20" />
      <div className="absolute bottom-0 w-full h-32 bg-gradient-to-b from-transparent to-accent" />
      
      <div className="mt-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32">
        <div className="text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-primary mb-6 animate-fade-down">
            SNF Revenue Cycle Made Effortless: <br />AI does the work
          </h1>
          <div className="flex justify-center mb-6 animate-fade-up">
            <p className="text-primary font-medium tracking-wide text-2xl">
              Maximize Revenue <span className="text-gray-400 mx-2">|</span> Reduce Denials <span className="text-gray-400 mx-2">|</span> Automate Cashflow
            </p>
          </div>
          <p className="text-gray-600 mb-8 max-w-5xl mx-auto animate-fade-up text-2xl py-[29px]">Say goodbye to revenue loss and inefficiencies. Our AI agents optimize patient sourcing, automate claims, recover underpayments, and streamline your revenue cycle—without extra staff</p>
          <div className="flex justify-center animate-fade-up">
            <ShimmerButton 
              to="/waitlist" 
              className="h-12 px-8 py-3" 
              background="#004466" 
              shimmerColor="#ffffff" 
              borderRadius="0.375rem"
            >
              <span className="flex items-center gap-2">
                Join Waitlist
                <ArrowRight className="group-hover:translate-x-1 transition-transform" />
              </span>
            </ShimmerButton>
          </div>
        </div>
      </div>
    </div>;
};

export default Hero;
