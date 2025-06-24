import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { TrendingUp, Shield, Zap, Users, DollarSign, BarChart } from "lucide-react";
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
      solution: "AI replaces repetitive tasks, optimizes staff workflows, and prevents unauthorized treatments.",
      outcome: "30–50% fewer denials and significant reductions in accounts receivable aging",
      color: "text-[#004466]",
      bgColor: "bg-[#EAEFF2]",
      accentColor: "text-[#004466]"
    }
  ];

  const benefits = [
    { icon: Users, label: "Zero Staff Addition", description: "AI handles all processes" },
    { icon: DollarSign, label: "Immediate ROI", description: "See results in under 60 days" },
    { icon: BarChart, label: "Full Compliance", description: "HIPAA & SOC 2 certified" }
  ];

  return (
    <section id="features-section" className="relative py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header - Blue Pine AI typography */}
        <div className={`text-center mb-20 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
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
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-20">
          {features.map((feature, index) => (
            <Card 
              key={index} 
              className={`blue-pine-card group transition-all duration-700 delay-${index * 200} ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}
            >
              <CardHeader className="pb-4">
                <div className={`w-16 h-16 rounded-lg ${feature.bgColor} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 border border-[#CCCCCC]`}>
                  <feature.icon className={`w-8 h-8 ${feature.accentColor}`} />
                </div>
                <CardTitle className="text-2xl font-bold text-[#004466] group-hover:text-[#005580] transition-colors duration-300">
                  {feature.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <h4 className="font-semibold text-[#D9534F] text-sm uppercase tracking-wide">Challenge</h4>
                  <p className="text-[#333333] leading-relaxed">{feature.challenge}</p>
                </div>
                <div className="space-y-2">
                  <h4 className="font-semibold text-[#004466] text-sm uppercase tracking-wide">Solution</h4>
                  <p className="text-[#333333] leading-relaxed">{feature.solution}</p>
                </div>
                <div className={`p-4 rounded-lg ${feature.bgColor} border border-[#CCCCCC]`}>
                  <h4 className="font-semibold text-[#333333] text-sm uppercase tracking-wide mb-2">Outcome</h4>
                  <p className={`font-bold text-lg ${feature.color}`}>
                    {feature.outcome}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Benefits Bar - Blue Pine AI styling */}
        <div className={`blue-pine-card p-8 transition-all duration-1000 delay-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {benefits.map((benefit, index) => (
              <div key={index} className="flex items-center space-x-4 group">
                <div className="w-12 h-12 rounded-lg bg-[#004466] flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-sm">
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
      </div>
    </section>
  );
};

export default Features;
