import { ArrowRight, Play, CheckCircle, Calendar, MessageSquare } from "lucide-react";
import { ShimmerButton } from "./ui/shimmer-button";
import { useEffect, useState } from "react";

const Hero = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const stats = [
    { label: "Revenue Recovery", value: "3-8%" },
    { label: "Denial Reduction", value: "50%" },
    { label: "Cost Savings", value: "20%" }
  ];

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-white via-blue-50/30 to-white">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-primary/20 to-blue-300/20 rounded-full blur-3xl floating-element"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-br from-blue-200/20 to-primary/20 rounded-full blur-3xl floating-element" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-radial from-primary/5 to-transparent rounded-full"></div>
      </div>

      {/* Background pattern */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 25px 25px, rgba(59, 130, 246, 0.1) 2px, transparent 0)`,
          backgroundSize: '50px 50px'
        }}></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32">
        <div className="text-center">
          {/* Badge */}
          <div className={`inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-primary/10 to-blue-100/50 border border-primary/20 text-primary font-medium text-sm mb-8 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
            <CheckCircle className="w-4 h-4 mr-2" />
            Trusted by Leading Healthcare Facilities
          </div>

          {/* Main headline */}
          <h1 className={`text-5xl md:text-7xl lg:text-8xl font-bold mb-8 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <span className="gradient-text">SNF Revenue Cycle</span>
            <br />
            <span className="gradient-text-secondary">Made Effortless</span>
          </h1>

          {/* Subheadline */}
          <div className={`flex justify-center mb-8 transition-all duration-1000 delay-200 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <p className="text-primary font-semibold tracking-wide text-xl md:text-2xl">
              AI does the work <span className="text-gray-400 mx-3">•</span> You get the results
            </p>
          </div>

          {/* Description */}
          <p className={`text-gray-600 mb-12 max-w-4xl mx-auto text-xl md:text-2xl leading-relaxed transition-all duration-1000 delay-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            Transform your revenue cycle with AI agents that optimize patient sourcing, automate claims, recover underpayments, and eliminate inefficiencies—
            <span className="font-semibold text-gray-800"> without adding staff.</span>
          </p>

          {/* CTA Buttons */}
          <div className={`flex flex-col sm:flex-row gap-4 justify-center items-center mb-16 transition-all duration-1000 delay-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <ShimmerButton 
              to="/waitlist" 
              className="h-14 px-8 py-4 text-lg font-semibold" 
              background="linear-gradient(135deg, #1B4F72, #2563eb)" 
              shimmerColor="#ffffff" 
              borderRadius="0.75rem"
            >
              <span className="flex items-center gap-3">
                Join Waitlist
                <ArrowRight className="group-hover:translate-x-1 transition-transform w-5 h-5" />
              </span>
            </ShimmerButton>
            
            <a 
              href="/waitlist" 
              className="flex items-center gap-3 px-8 py-4 text-lg font-semibold text-blue-600 bg-white border-2 border-blue-600 rounded-xl hover:bg-blue-50 hover:shadow-lg transition-all duration-300 hover:scale-105 active:scale-95 group"
            >
              <Play className="w-5 h-5" />
              Watch Demo
            </a>
          </div>

          {/* Stats */}
          <div className={`grid grid-cols-1 md:grid-cols-3 gap-8 max-w-2xl mx-auto transition-all duration-1000 delay-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl md:text-4xl font-bold gradient-text mb-2">{stat.value}</div>
                <div className="text-gray-600 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-primary/30 rounded-full flex justify-center">
          <div className="w-1 h-3 bg-primary/60 rounded-full mt-2 animate-pulse"></div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
