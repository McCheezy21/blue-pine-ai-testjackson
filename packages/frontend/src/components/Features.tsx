import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { TrendingUp, Shield, Zap, Users, DollarSign, BarChart, CheckCircle, ArrowRight, UserPlus, FileCheck, CreditCard, FileText, Clock, AlertTriangle, BarChart3 } from "lucide-react";
import { useEffect, useState } from "react";

const Features = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    const element = document.getElementById('features-section');
    if (element) observer.observe(element);

    return () => observer.disconnect();
  }, []);

  const scrollToTestimonials = () => {
    // Scroll down by a reasonable amount to reach the testimonials section
    const currentPosition = window.pageYOffset;
    const targetPosition = currentPosition + 800; // Adjust this value as needed
    
    window.scrollTo({
      top: targetPosition,
      behavior: 'smooth'
    });
  };

  const features = [
    {
      icon: TrendingUp,
      title: "Increase Net Operating Income (NOI)",
      challenge: "Missed charges and underpayments quietly erode your bottom line",
      solution: "Our AI finds and recovers lost revenue while preventing future leakage",
      outcome: "3–8% boost in revenue recovery, directly improving facility NOI",
      color: "text-[#004466]",
      bgColor: "bg-[#EAEFF2]",
      accentColor: "text-[#004466]"
    },
    {
      icon: Shield,
      title: "Reduce Staffing Burden Without Sacrificing Quality",
      challenge: "Back-office burnout and rising labor costs limit your ability to scale",
      solution: "Our agents handle repetitive, time-intensive billing and follow-up tasks—no new hires needed",
      outcome: "Over 20% reduction in staffing costs and administrative overhead",
      color: "text-[#004466]",
      bgColor: "bg-[#EAEFF2]",
      accentColor: "text-[#004466]"
    },
    {
      icon: Zap,
      title: "Fewer Denials, Faster Cash",
      challenge: "Our AI proactively corrects errors, manages appeals, and gets claims paid the first time",
      solution: "AI replaces repetitive tasks, optimizes staff workflows, and prevents unauthorized treatments",
      outcome: "30–50% fewer denials and significant reductions in accounts receivable aging",
      color: "text-[#004466]",
      bgColor: "bg-[#EAEFF2]",
      accentColor: "text-[#004466]"
    }
  ];

  const benefits = [
    { icon: DollarSign, label: "Immediate ROI", description: "See results in under 60 days" },
    { icon: BarChart, label: "Full Compliance", description: "HIPAA & SOC 2 certified" }
  ];

  const automationSteps = [
    { title: "Patient Sourcing", description: "AI-driven patient acquisition", icon: UserPlus },
    { title: "Prior Authorization", description: "Automated prior auth requests and tracking", icon: FileCheck },
    { title: "Eligibility & Verification", description: "Instant insurance eligibility checks", icon: Shield },
    { title: "Claim Generation", description: "Error-free claim creation and submission", icon: FileText },
    { title: "Claim Status", description: "Real-time claim monitoring and updates", icon: Clock },
    { title: "Denial & ADR Management", description: "Automated denial and appeals management", icon: AlertTriangle },
    { title: "Facility Optimization", description: "AI insights for revenue optimization", icon: BarChart3 }
  ];

  return (
    <section id="features-section" className="relative py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header - Blue Pine AI typography */}
        <div className={`text-center mb-20 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 tracking-tight leading-none">
            <span className="text-[#004466]">Run a Tighter,</span>
            <br />
            <span className="text-[#004466]">More Profitable Operation</span>
          </h2>
          <p className="text-xl text-[#333333] max-w-3xl mx-auto leading-relaxed font-normal">
            Our AI agents deliver measurable results across every aspect of your revenue cycle management
          </p>
        </div>

        {/* Main Features Grid - Blue Pine AI cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-20 items-stretch">
          {features.map((feature, index) => (
            <Card 
              key={index} 
              className={`blue-pine-card group transition-all duration-500 delay-${index * 100} ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'} h-full flex flex-col`}
            >
              <CardHeader className="pb-4">
                <div className={`w-16 h-16 rounded-lg ${feature.bgColor} flex items-center justify-center mb-6 group-hover:scale-105 transition-transform duration-300 border border-[#CCCCCC]`}>
                  <feature.icon className={`w-8 h-8 ${feature.accentColor}`} />
                </div>
                <CardTitle className="text-2xl font-bold text-[#004466] group-hover:text-[#005580] transition-colors duration-300 min-h-[4rem] flex items-start">
                  {feature.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col flex-1 space-y-6">
                <div className="min-h-[5rem]">
                  <h4 className="font-semibold text-[#D9534F] text-sm uppercase tracking-wide mb-2">Challenge</h4>
                  <p className="text-[#333333] leading-relaxed">{feature.challenge}</p>
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-[#004466] text-sm uppercase tracking-wide mb-2">Solution</h4>
                  <p className="text-[#333333] leading-relaxed">{feature.solution}</p>
                </div>
                <div className={`p-4 rounded-lg ${feature.bgColor} border border-[#CCCCCC] mt-auto`}>
                  <h4 className="font-semibold text-[#333333] text-sm uppercase tracking-wide mb-2">Outcome</h4>
                  <p className={`font-bold text-lg ${feature.color}`}>
                    {feature.outcome}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Complete Revenue Cycle Automation - All Steps Grid */}
        <div className={`mb-20 transition-all duration-700 delay-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          <div className="text-center mb-12">
            <h3 className="text-3xl md:text-4xl font-bold text-[#004466] mb-4">
              Complete Revenue Cycle Automation
            </h3>
            <p className="text-lg text-[#333333] max-w-2xl mx-auto">
              Our AI agents handle every step of your revenue cycle, from patient sourcing to final payment
            </p>
          </div>
          
          {/* All Steps Grid */}
          <div className="max-w-7xl mx-auto">
            {/* First row - 4 cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
              {automationSteps.slice(0, 4).map((step, index) => (
                <div key={step.title} className="bg-white p-6 rounded-lg border border-[#E5E7EB] shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1">
                  <div className="flex flex-col items-center space-y-4 text-center h-full">
                    <div className="w-16 h-16 bg-[#004466] rounded-full flex items-center justify-center shadow-lg">
                      <step.icon className="w-8 h-8 text-white" />
                    </div>
                    <div className="space-y-2">
                      <h4 className="text-lg font-bold text-[#004466]">
                        {step.title}
                      </h4>
                      <p className="text-[#333333] text-sm leading-relaxed">
                        {step.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Second row - 3 cards centered */}
            <div className="flex justify-center">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl">
                {automationSteps.slice(4).map((step, index) => (
                  <div key={step.title} className="bg-white p-6 rounded-lg border border-[#E5E7EB] shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1">
                    <div className="flex flex-col items-center space-y-4 text-center h-full">
                      <div className="w-16 h-16 bg-[#004466] rounded-full flex items-center justify-center shadow-lg">
                        <step.icon className="w-8 h-8 text-white" />
                      </div>
                      <div className="space-y-2">
                        <h4 className="text-lg font-bold text-[#004466]">
                          {step.title}
                        </h4>
                        <p className="text-[#333333] text-sm leading-relaxed">
                          {step.description}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Benefits Bar - Blue Pine AI styling */}
        <div className={`blue-pine-card p-8 transition-all duration-700 delay-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          <div className="flex justify-center">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-2xl">
              {benefits.map((benefit, index) => (
                <div key={index} className="flex items-center space-x-4 group">
                  <div className="w-12 h-12 rounded-lg bg-[#004466] flex items-center justify-center group-hover:scale-105 transition-transform duration-300 shadow-sm">
                    <benefit.icon className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h4 className="font-bold text-[#004466] group-hover:text-[#005580] transition-colors duration-300">{benefit.label}</h4>
                    <p className="text-[#333333] text-sm">{benefit.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Gentle next step indicator */}
          <div className="text-center mt-8 pt-6 border-t border-[#CCCCCC]">
            <p className="text-[#666666] text-sm">
              Ready to see how this works for your facility?{' '}
              <button 
                onClick={scrollToTestimonials}
                className="text-[#004466] font-semibold hover:text-[#005580] hover:underline transition-all duration-300 cursor-pointer"
              >
                Check out what our clients say below ↓
              </button>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Features;
