import React, { useEffect, useState } from 'react';
import { ChevronRight, ArrowRight, Play, MessageCircle, CheckCircle, Zap, Shield } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const AIExplanationSection = () => {
  const [isVisible, setIsVisible] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    const element = document.getElementById('ai-explanation-section');
    if (element) observer.observe(element);

    return () => observer.disconnect();
  }, []);

  const aiCapabilities = [
    {
      title: "Intelligent Claim Processing",
      description: "AI reviews every claim for accuracy, catches errors before submission, and optimizes coding for maximum reimbursement.",
      features: ["Auto-corrects common billing errors", "Validates insurance eligibility", "Optimizes CPT and ICD-10 codes"],
      icon: CheckCircle,
      color: "from-blue-500 to-blue-600"
    },
    {
      title: "Automated Denial Management", 
      description: "When claims are denied, our AI automatically generates appeals with supporting documentation and tracks resolution.",
      features: ["Identifies denial patterns", "Generates appeal letters", "Tracks resolution timelines"],
      icon: Zap,
      color: "from-slate-500 to-slate-600"
    },
    {
      title: "Proactive Revenue Recovery",
      description: "AI continuously monitors payments, identifies underpayments, and initiates recovery processes without human intervention.",
      features: ["Detects payment discrepancies", "Automates follow-up sequences", "Recovers missing revenue"],
      icon: Shield,
      color: "from-blue-600 to-blue-700"
    }
  ];

  return (
    <div id="ai-explanation-section" className="relative py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header with Apple-inspired typography */}
        <div className={`text-center mb-20 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 tracking-tight leading-none">
            <span className="bg-gradient-to-r from-slate-900 via-blue-900 to-slate-900 bg-clip-text text-transparent">How Our AI</span>
            <br />
            <span className="bg-gradient-to-r from-blue-600 via-blue-500 to-blue-600 bg-clip-text text-transparent">Transforms Revenue Cycles</span>
          </h2>
          <p className="text-xl text-slate-600 max-w-4xl mx-auto leading-relaxed font-medium">
            Advanced artificial intelligence that works 24/7 to optimize every aspect of your revenue cycle, from initial claim creation to final payment collection.
          </p>
        </div>

        {/* AI Capabilities Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-20">
          {aiCapabilities.map((capability, index) => (
            <div
              key={index}
              className={`apple-card p-8 transition-all duration-700 delay-${index * 200} hover:shadow-2xl hover:shadow-blue-500/10 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}
            >
              {/* Icon */}
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-50 to-blue-100/50 backdrop-blur-sm flex items-center justify-center mb-6 border border-blue-100/50">
                <capability.icon className="w-8 h-8 text-blue-600" />
              </div>

              {/* Content */}
              <h3 className="text-2xl font-bold text-slate-900 mb-4">{capability.title}</h3>
              <p className="text-slate-600 mb-6 leading-relaxed">{capability.description}</p>

              {/* Features List */}
              <ul className="space-y-3">
                {capability.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                    <span className="text-slate-600 text-sm">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Process Flow Section */}
        <section className={`mb-20 transition-all duration-1000 delay-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div className="apple-glass-card p-8 text-center">
            <h3 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6">
              Your Revenue Cycle, Fully Automated
            </h3>
            <p className="text-xl text-slate-600 mb-8 max-w-3xl mx-auto leading-relaxed">
              From patient admission to final payment, our AI handles every step with precision and intelligence.
            </p>
            
            {/* Process Steps */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              {[
                { step: "01", title: "Patient Data Capture", desc: "AI extracts and validates patient information" },
                { step: "02", title: "Intelligent Coding", desc: "Automated CPT and ICD-10 code optimization" },
                { step: "03", title: "Claim Submission", desc: "Error-free submissions to all payers" },
                { step: "04", title: "Payment Tracking", desc: "Continuous monitoring and recovery" }
              ].map((item, index) => (
                <div key={index} className="text-center">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-bold text-lg shadow-lg">
                    {item.step}
                  </div>
                  <h4 className="font-bold text-slate-900 mb-2">{item.title}</h4>
                  <p className="text-sm text-slate-600">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Ready to See AI in Action */}
        <section className={`mb-20 transition-all duration-1000 delay-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div className="apple-glass-card p-12 text-center">
            <h3 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6">
              Ready to See AI in Action?
            </h3>
            <p className="text-xl text-slate-600 mb-8 max-w-3xl mx-auto leading-relaxed">
              Join healthcare facilities already transforming their revenue cycles with our AI agents.
            </p>
            <button 
              onClick={() => navigate('/waitlist')}
              className="apple-button group flex items-center gap-3 px-8 py-4 text-lg font-semibold text-white bg-gradient-to-b from-blue-500 to-blue-600 rounded-2xl hover:from-blue-600 hover:to-blue-700 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] shadow-lg mx-auto"
            >
              <Play className="w-5 h-5 fill-current" />
              Watch Demo
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
            </button>
          </div>
        </section>

        {/* Still Have Questions */}
        <section className={`transition-all duration-1000 delay-900 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div className="text-center">
            <h3 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6">
              Still Have Questions?
            </h3>
            <p className="text-xl text-slate-600 mb-8 max-w-4xl mx-auto leading-relaxed">
              Our team of healthcare revenue cycle experts is here to help you understand how AI can transform your facility.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button 
                onClick={() => navigate('/waitlist')}
                className="apple-button group flex items-center justify-center gap-3 px-8 py-4 text-white bg-gradient-to-b from-blue-500 to-blue-600 rounded-xl hover:from-blue-600 hover:to-blue-700 font-semibold shadow-lg"
              >
                <Play className="w-5 h-5 fill-current" />
                Watch Demo
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
              </button>
              <button 
                onClick={() => navigate('/waitlist')}
                className="flex items-center justify-center gap-2 px-8 py-4 rounded-xl font-semibold text-blue-600 border-2 border-blue-200 hover:border-blue-300 hover:bg-blue-50 transition-all duration-300"
              >
                <MessageCircle className="w-5 h-5" />
                Contact Support
              </button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default AIExplanationSection;
