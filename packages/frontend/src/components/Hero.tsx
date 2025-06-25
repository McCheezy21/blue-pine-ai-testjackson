import { ArrowRight, Play, CheckCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Hero = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [showValueProp, setShowValueProp] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setIsVisible(true);
    // Show additional value prop after 2 seconds - more professional timing
    const timer = setTimeout(() => {
      setShowValueProp(true);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  const stats = [
    { label: "Revenue Recovery", value: "3-8%" },
    { label: "Denial Reduction", value: "50%" },
    { label: "Cost Savings", value: "20%" }
  ];

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-white">
      {/* Subtle, professional background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-[#EAEFF2] rounded-full opacity-20"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-[#EAEFF2] rounded-full opacity-20"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#EAEFF2] rounded-full opacity-10"></div>
      </div>

      {/* Subtle background pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 25px 25px, #004466 2px, transparent 0)`,
          backgroundSize: '50px 50px'
        }}></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center">
          {/* Trust badge - professional and calm */}
          <div className={`inline-flex items-center px-4 py-2 rounded-full bg-[#EAEFF2] text-[#004466] font-medium text-sm mb-8 transition-all duration-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'}`}>
            <CheckCircle className="w-4 h-4 mr-2" />
            Join Leading SNFs Already Improving Their Revenue Cycle
          </div>

          {/* Main headline - professional typography with subtle animation */}
          <h1 className={`text-4xl md:text-5xl lg:text-6xl font-bold mb-6 tracking-tight leading-none transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
            <span className="text-[#004466]">SNF Revenue Cycle Made</span>
            <br />
            <span className="text-[#004466]">
              Effortless
            </span>
          </h1>

          {/* Subheadline - calm and benefit-focused */}
          <div className={`flex justify-center mb-8 transition-all duration-700 delay-100 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
            <p className="text-[#004466] font-semibold tracking-wide text-xl md:text-2xl">
              AI does the work • You get the results
            </p>
          </div>

          {/* Clean description - operational and clear */}
          <p className={`text-[#333333] mb-12 max-w-4xl mx-auto text-xl md:text-2xl leading-relaxed font-normal transition-all duration-700 delay-200 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
            Our AI agents work behind the scenes to streamline your revenue cycle—automating claims, recovering underpayments, and reducing denials.
            <span className="font-semibold text-[#004466]"> Your team stays in control. We handle the busywork.</span>
          </p>

          {/* Subtle Value Proposition - professional timing */}
          <div className={`transition-all duration-500 ${showValueProp ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'} mb-8`}>
            <div className="inline-flex items-center px-6 py-3 bg-white/90 backdrop-blur-sm rounded-full border border-[#CCCCCC] shadow-sm">
              <span className="text-[#004466] font-medium">✓ No setup fees</span>
              <span className="mx-3 text-[#CCCCCC]">•</span>
              <span className="text-[#004466] font-medium">✓ 60-day ROI guarantee</span>
            </div>
          </div>

          {/* CTA Buttons - professional timing */}
          <div className={`flex justify-center items-center gap-4 mb-16 transition-all duration-700 delay-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
            <button 
              onClick={() => navigate('/demo')}
              className="blue-pine-button group flex items-center gap-3 px-8 py-4 text-lg"
            >
              See It In Action
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
            </button>
          </div>

          {/* Stats with professional styling */}
          <div className={`grid grid-cols-1 md:grid-cols-3 gap-8 max-w-2xl mx-auto transition-all duration-700 delay-400 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-[#004466] mb-2">{stat.value}</div>
                <div className="text-[#333333] font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Professional scroll indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 opacity-40">
        <div className="w-6 h-10 border-2 border-[#CCCCCC] rounded-full flex justify-center">
          <div className="w-1 h-3 bg-[#004466] rounded-full mt-2 animate-pulse"></div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
