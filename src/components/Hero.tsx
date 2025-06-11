import { ArrowRight, Play, CheckCircle } from "lucide-react";
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
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-white via-slate-50/30 to-white">
      {/* Refined background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-500/10 to-blue-300/10 rounded-full blur-3xl animate-pulse-slow"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-br from-blue-400/10 to-blue-600/10 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-radial from-blue-500/3 to-transparent rounded-full"></div>
      </div>

      {/* Subtle background pattern */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 25px 25px, rgba(59, 130, 246, 0.04) 2px, transparent 0)`,
          backgroundSize: '50px 50px'
        }}></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center">
          {/* Trust badge */}
          <div className={`inline-flex items-center px-4 py-2 rounded-full bg-blue-50/80 backdrop-blur-sm border border-blue-200/50 text-blue-700 font-medium text-sm mb-8 transition-all duration-700 hover:bg-blue-100/80 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
            <CheckCircle className="w-4 h-4 mr-2" />
            Trusted by Leading Healthcare Facilities
          </div>

          {/* Main headline with Apple-like typography */}
          <h1 className={`text-5xl md:text-7xl lg:text-8xl font-bold mb-6 tracking-tight leading-none transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <span className="bg-gradient-to-r from-slate-900 via-blue-900 to-slate-900 bg-clip-text text-transparent">SNF Revenue Cycle</span>
            <br />
            <span className="bg-gradient-to-r from-blue-600 via-blue-500 to-blue-600 bg-clip-text text-transparent">Made Effortless</span>
          </h1>

          {/* Subheadline with Apple-style clarity */}
          <div className={`flex justify-center mb-8 transition-all duration-1000 delay-200 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <p className="text-blue-600 font-semibold tracking-wide text-xl md:text-2xl">
              AI does the work <span className="text-slate-400 mx-3">•</span> You get the results
            </p>
          </div>

          {/* Clean description */}
          <p className={`text-slate-600 mb-12 max-w-4xl mx-auto text-xl md:text-2xl leading-relaxed font-medium transition-all duration-1000 delay-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            Transform your revenue cycle with AI agents that optimize patient sourcing, automate claims, recover underpayments, and eliminate inefficiencies—
            <span className="font-semibold text-slate-900"> without adding staff.</span>
          </p>

          {/* Dual CTA Buttons - Apple style */}
          <div className={`flex flex-col sm:flex-row justify-center items-center gap-4 mb-16 transition-all duration-1000 delay-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <button className="apple-button group flex items-center gap-3 px-8 py-4 text-lg font-semibold text-white bg-gradient-to-b from-blue-500 to-blue-600 rounded-2xl hover:from-blue-600 hover:to-blue-700 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] border border-blue-400/20">
              Join Waitlist
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
            </button>
            
            <button className="apple-button group flex items-center gap-3 px-8 py-4 text-lg font-semibold text-blue-600 bg-white border-2 border-blue-200 rounded-2xl hover:bg-blue-50 hover:border-blue-300 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]">
              <Play className="w-5 h-5 fill-current" />
              Watch Demo
            </button>
          </div>

          {/* Stats with refined styling */}
          <div className={`grid grid-cols-1 md:grid-cols-3 gap-8 max-w-2xl mx-auto transition-all duration-1000 delay-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 to-blue-500 bg-clip-text text-transparent mb-2">{stat.value}</div>
                <div className="text-slate-600 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Elegant scroll indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce opacity-60">
        <div className="w-6 h-10 border-2 border-blue-300/50 rounded-full flex justify-center">
          <div className="w-1 h-3 bg-blue-400/60 rounded-full mt-2 animate-pulse"></div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
