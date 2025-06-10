import { Brain, CheckCircle, Clock, TrendingUp, Shield, Users, ArrowRight, Play } from "lucide-react";
import { useState, useEffect } from "react";

const AIExplanationSection = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [activeCard, setActiveCard] = useState(0);

  useEffect(() => {
    setIsVisible(true);
    const interval = setInterval(() => {
      setActiveCard((prev) => (prev + 1) % 4);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const agentTypes = [
    {
      role: "Medical Coder",
      task: "Spend hours assigning codes",
      solution: "AI auto-codes treatments with 99% accuracy in seconds.",
      icon: CheckCircle,
      color: "from-blue-500 to-blue-600"
    },
    {
      role: "Billing Specialist", 
      task: "File claims, track submissions",
      solution: "AI auto-files claims in <5 mins and tracks them in real time.",
      icon: TrendingUp,
      color: "from-green-500 to-green-600"
    },
    {
      role: "Denial Manager",
      task: "Investigate + appeal denied claims", 
      solution: "AI predicts denials upfront and auto-generates appeals.",
      icon: Shield,
      color: "from-purple-500 to-purple-600"
    },
    {
      role: "AR Specialist",
      task: "Follow up on unpaid claims",
      solution: "AI predicts payment dates and auto-follows up with payers.",
      icon: Clock,
      color: "from-orange-500 to-orange-600"
    }
  ];

  const benefits = [
    {
      icon: CheckCircle,
      title: "Reduce Claim Denials",
      description: "Cut denials by 30-50% with AI-powered audits and pre-submission checks.",
      stat: "30-50%"
    },
    {
      icon: TrendingUp,
      title: "Accelerate Cash Flow", 
      description: "Get paid 20+ days faster with automated claim submissions and denial resolutions.",
      stat: "20+ Days"
    },
    {
      icon: Users,
      title: "Lower Labor Costs",
      description: "Replace multiple FTEs with one AI agent, saving $100k+ annually.",
      stat: "$100k+"
    },
    {
      icon: Brain,
      title: "Boost Revenue",
      description: "Recover 3-8% more revenue from underpaid or denied claims.",
      stat: "3-8%"
    }
  ];

  const whyNowReasons = [
    {
      icon: Users,
      title: "Staffing Shortages",
      description: "Staffing shortages are making it harder to keep up with billing and coding."
    },
    {
      icon: Shield,
      title: "Complex Regulations", 
      description: "Payer rules are getting more complex (e.g., Medicare, Medicaid, private insurers)."
    },
    {
      icon: TrendingUp,
      title: "Financial Pressure",
      description: "Financial pressures are mounting, with 60% of skilled nursing facilities operating at a loss."
    }
  ];

  return (
    <div className="relative py-20 bg-gradient-to-b from-white via-gray-50/30 to-white overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-primary/5 to-blue-300/5 rounded-full blur-3xl floating-element"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-br from-blue-200/5 to-primary/5 rounded-full blur-3xl floating-element" style={{ animationDelay: '2s' }}></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* What Is an AI Agent Section */}
        <section className={`mb-24 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div className="text-center mb-16">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-primary/10 to-blue-100/50 border border-primary/20 text-primary font-medium text-sm mb-8">
              <Brain className="w-4 h-4 mr-2" />
              AI Agent Explanation
            </div>
            <h2 className="text-5xl md:text-6xl font-bold mb-8">
              <span className="gradient-text">What Is an AI Agent?</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
              AI agents are like having an extra team member who never sleeps, never makes mistakes, and handles all the tedious tasks you hate. They use artificial intelligence (AI) and machine learning (ML) to:
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-2 h-2 bg-primary rounded-full mt-3 flex-shrink-0"></div>
                  <p className="text-lg text-gray-700">Automate repetitive tasks (e.g., coding, claims, denials).</p>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-2 h-2 bg-primary rounded-full mt-3 flex-shrink-0"></div>
                  <p className="text-lg text-gray-700">Learn and adapt to your facility's workflows.</p>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-2 h-2 bg-primary rounded-full mt-3 flex-shrink-0"></div>
                  <p className="text-lg text-gray-700">Work 24/7 to keep your revenue cycle running smoothly.</p>
                </div>
              </div>
              <div className="p-8 bg-gradient-to-br from-primary/5 to-blue-50 rounded-2xl border border-primary/10">
                <p className="text-lg font-semibold text-primary mb-2">For skilled nursing facilities, AI agents are a game-changer</p>
                <p className="text-gray-700">—saving time, reducing errors, and boosting cash flow.</p>
              </div>
            </div>

            <div className="relative">
              <div className="w-32 h-32 mx-auto bg-gradient-to-br from-primary/10 to-blue-50 rounded-3xl flex items-center justify-center mb-8">
                <Brain className="w-16 h-16 text-primary" />
              </div>
              <div className="text-center">
                <h3 className="text-2xl font-bold text-primary mb-4">Why AI Agents Are the Future</h3>
                <p className="text-gray-600 leading-relaxed">
                  As a building office manager or administrator, you're juggling a million things: staffing, patient care, compliance, and—let's be honest—endless paperwork. AI agents take the billing burden off your plate by:
                </p>
                <div className="mt-6 space-y-3">
                  {[
                    "Eliminate Errors: No more missed codes or incorrect claims.",
                    "Speed Up Processes: File claims in minutes, not hours.", 
                    "Stop Denials Before They Happen: Catch mistakes before payers do."
                  ].map((benefit, index) => (
                    <div key={index} className="flex items-center gap-3 text-left">
                      <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                      <span className="text-gray-700">{benefit}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* How AI Agents Simplify Your Workload */}
        <section className={`mb-24 transition-all duration-1000 delay-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-8">
              <span className="gradient-text">How AI Agents Simplify Your Workload</span>
            </h2>
          </div>

          <div className="bg-white rounded-3xl border border-gray-200/50 shadow-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gradient-to-r from-primary to-blue-600 text-white">
                    <th className="text-left py-6 px-8 font-semibold text-lg">Traditional Role</th>
                    <th className="text-left py-6 px-8 font-semibold text-lg">What They Do</th>
                    <th className="text-left py-6 px-8 font-semibold text-lg">How AI Replaces It</th>
                  </tr>
                </thead>
                <tbody>
                  {agentTypes.map((agent, index) => (
                    <tr key={index} className={`border-b border-gray-100 transition-all duration-300 hover:bg-gray-50/50 ${activeCard === index ? 'bg-blue-50/30' : ''}`}>
                      <td className="py-6 px-8 font-semibold text-gray-900">{agent.role}</td>
                      <td className="py-6 px-8 text-gray-600">{agent.task}</td>
                      <td className="py-6 px-8 text-primary font-medium">{agent.solution}</td>
                    </tr>
                  ))}
                  <tr className="bg-gradient-to-r from-blue-50 to-primary/5">
                    <td className="py-6 px-8 font-semibold text-gray-900">Administrator</td>
                    <td className="py-6 px-8 text-gray-600">Stress</td>
                    <td className="py-6 px-8 text-green-600 font-medium">Peace of mind</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="bg-gradient-to-r from-primary/10 to-blue-50 p-8 text-center">
              <p className="text-xl font-semibold text-primary">
                Result: You save over 20% on labor costs while improving billing accuracy and speed.
              </p>
            </div>
          </div>
        </section>

        {/* AI Agent ROI Section */}
        <section className={`mb-24 transition-all duration-1000 delay-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-8">
              <span className="gradient-text">AI Agent ROI for Skilled Nursing Facilities</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
            {benefits.map((benefit, index) => (
              <div key={index} className="premium-card p-8 text-center group">
                <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-primary/10 to-blue-50 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <benefit.icon className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{benefit.title}</h3>
                <p className="text-gray-600 mb-4 leading-relaxed">{benefit.description}</p>
                <div className="text-3xl font-bold gradient-text">{benefit.stat}</div>
              </div>
            ))}
          </div>

          <div className="bg-gradient-to-r from-primary to-blue-600 rounded-3xl p-8 text-center">
            <p className="text-xl font-semibold text-white">
              Our clients have seen ROI in 90 days or less
            </p>
          </div>
        </section>

        {/* Why Adopt AI Now Section */}
        <section className={`mb-16 transition-all duration-1000 delay-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-8">
              <span className="gradient-text">Why Adopt AI Now?</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            {whyNowReasons.map((reason, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-gradient-to-br from-orange-100 to-red-50 flex items-center justify-center">
                  <reason.icon className="w-8 h-8 text-orange-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">{reason.title}</h3>
                <p className="text-gray-600 leading-relaxed">{reason.description}</p>
              </div>
            ))}
          </div>

          <div className="text-center">
            <p className="text-xl font-semibold text-primary mb-12">
              AI agents aren't just a nice-to-have—they're a must-have to stay competitive and financially healthy.
            </p>
          </div>
        </section>

        {/* Ready to See AI in Action */}
        <section className={`mb-16 transition-all duration-1000 delay-900 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div className="glass-card p-12 text-center">
            <h3 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              Ready to See AI in Action?
            </h3>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Join healthcare facilities already transforming their revenue cycles with our AI agents.
            </p>
            <a 
              href="/waitlist"
              className="bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold px-8 py-4 rounded-xl hover:shadow-xl transition-all duration-300 hover:scale-105 active:scale-95 flex items-center gap-3 mx-auto shadow-lg hover:shadow-blue-500/25"
            >
              <Play className="w-5 h-5" />
              Watch Demo
            </a>
          </div>
        </section>
      </div>
    </div>
  );
};

export default AIExplanationSection;
