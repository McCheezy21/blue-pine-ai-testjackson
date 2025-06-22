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
      title: "Increase Revenue & Maximize Payments",
      challenge: "Underpayments, missed billing opportunities, and claim errors reduce total revenue.",
      solution: "AI-driven accuracy identifies and recovers lost revenue while preventing errors.",
      outcome: "3-8% increase in revenue recovery per facility",
      color: "from-blue-500 to-blue-600",
      bgColor: "from-blue-50 to-blue-100/50",
      accentColor: "text-blue-600"
    },
    {
      icon: Shield,
      title: "Reduce Bad Debt & Write-Offs",
      challenge: "High denial rates lead to increased write-offs and lost reimbursements.",
      solution: "AI automates denial recovery, ensures proper coding, and reduces claim errors.",
      outcome: "30-50% fewer denials and significant reduction in bad debt",
      color: "from-slate-500 to-slate-600",
      bgColor: "from-slate-50 to-slate-100/50",
      accentColor: "text-slate-600"
    },
    {
      icon: Zap,
      title: "Cut Costs & Scale Efficiently",
      challenge: "Rising labor costs and inefficient workflows drain operational budgets.",
      solution: "AI replaces repetitive tasks, optimizes staff workflows, and prevents unauthorized treatments.",
      outcome: "Over 20% reduction in staffing costs and overhead",
      color: "from-blue-600 to-blue-700",
      bgColor: "from-blue-50 to-blue-100/50",
      accentColor: "text-blue-700"
    }
  ];

  const benefits = [
    { icon: Users, label: "Zero Staff Addition", description: "AI handles all processes" },
    { icon: DollarSign, label: "Immediate ROI", description: "See results in 60 days" },
    { icon: BarChart, label: "Full Compliance", description: "HIPAA & CMS certified" }
  ];

  return (
    <section id="features-section" className="relative py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header with Apple-inspired typography */}
        <div className={`text-center mb-20 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 tracking-tight leading-none">
            <span className="bg-gradient-to-r from-slate-900 via-blue-900 to-slate-900 bg-clip-text text-transparent">Transform Your</span>
            <br />
            <span className="bg-gradient-to-r from-blue-600 via-blue-500 to-blue-600 bg-clip-text text-transparent">Revenue Cycle</span>
          </h2>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed font-medium">
            Our AI agents deliver measurable results across every aspect of your revenue cycle management
          </p>
        </div>

        {/* Main Features Grid with Apple-inspired cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-20">
          {features.map((feature, index) => (
            <Card 
              key={index} 
              className={`apple-card group transition-all duration-700 delay-${index * 200} hover:shadow-2xl hover:shadow-blue-500/10 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}
            >
              <CardHeader className="pb-4">
                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${feature.bgColor} backdrop-blur-sm flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 border border-white/50`}>
                  <feature.icon className={`w-8 h-8 ${feature.accentColor}`} />
                </div>
                <CardTitle className="text-2xl font-bold text-slate-900 group-hover:text-blue-600 transition-colors duration-300">
                  {feature.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <h4 className="font-semibold text-red-500 text-sm uppercase tracking-wide">Challenge</h4>
                  <p className="text-slate-600 leading-relaxed">{feature.challenge}</p>
                </div>
                <div className="space-y-2">
                  <h4 className="font-semibold text-blue-600 text-sm uppercase tracking-wide">Solution</h4>
                  <p className="text-slate-600 leading-relaxed">{feature.solution}</p>
                </div>
                <div className={`p-4 rounded-xl bg-gradient-to-br ${feature.bgColor} backdrop-blur-sm border border-blue-100/50`}>
                  <h4 className="font-semibold text-slate-900 text-sm uppercase tracking-wide mb-2">Outcome</h4>
                  <p className={`font-bold text-lg bg-gradient-to-r ${feature.color} bg-clip-text text-transparent`}>
                    {feature.outcome}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Benefits Bar with Apple-inspired styling */}
        <div className={`apple-glass-card p-8 transition-all duration-1000 delay-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {benefits.map((benefit, index) => (
              <div key={index} className="flex items-center space-x-4 group">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg">
                  <benefit.icon className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 group-hover:text-blue-600 transition-colors duration-300">{benefit.label}</h4>
                  <p className="text-slate-600 text-sm">{benefit.description}</p>
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
