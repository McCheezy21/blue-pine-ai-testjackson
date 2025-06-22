import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { HelpCircle, Shield, Zap, TrendingUp, Users, DollarSign, Play, ArrowRight, MessageCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const faqs = [
  {
    icon: Shield,
    question: "Is this software compliant with healthcare regulations (e.g., HIPAA, CMS)?",
    answer: "Yes. Our AI agent is fully HIPAA-compliant and adheres to CMS guidelines. We encrypt all data (in transit and at rest) and undergo annual third-party audits. Your documentation and workflows will always meet regulatory standards.",
    category: "Security"
  },
  {
    icon: Zap,
    question: "How does this integrate with our existing EHR/billing systems?",
    answer: "We integrate seamlessly with top EHRs like PointClickCare, Cerner, and Epic, as well as major billing platforms. Setup takes <72 hours with zero downtime, and our team handles everything—no IT burden on you.",
    category: "Integration"
  },
  {
    icon: TrendingUp,
    question: "What's the ROI? How soon will we see results?",
    answer: "Our clients reduce claim denials by 30-50% within 90 days and accelerate cash flow by 30%. This service pays for itself.",
    category: "Results"
  },
  {
    icon: Users,
    question: "How difficult is it for our staff to learn this system?",
    answer: "Our AI works in the background—no manual data entry or coding required. Staff only interact with simple alerts and approvals. We include free onboarding, live training, and 24/7 support to ensure a smooth transition.",
    category: "Training"
  },
  {
    icon: DollarSign,
    question: "What's the cost? Are there hidden fees?",
    answer: "Pricing varies depending on your facility size. You'll pay $0 for setup, integrations, or training. We succeed when you do—most clients cover our fees with recovered revenue in their first 60 days.",
    category: "Pricing"
  }
];

const FAQ = () => {
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

    const element = document.getElementById('faq-section');
    if (element) observer.observe(element);

    return () => observer.disconnect();
  }, []);

  return (
    <section id="faq-section" className="relative py-20">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header with Apple-inspired typography */}
        <div className={`text-center mb-16 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div className="flex items-center justify-center mb-6">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-50 to-blue-100/50 backdrop-blur-sm flex items-center justify-center mr-4 border border-blue-100/50">
              <HelpCircle className="w-8 h-8 text-blue-600" />
            </div>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight leading-none">
              <span className="bg-gradient-to-r from-slate-900 via-blue-900 to-slate-900 bg-clip-text text-transparent">Questions</span>
              <br />
              <span className="bg-gradient-to-r from-blue-600 via-blue-500 to-blue-600 bg-clip-text text-transparent">& Answers</span>
            </h2>
          </div>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed font-medium">
            Everything you need to know about transforming your revenue cycle with AI
          </p>
        </div>

        {/* FAQ Accordion with Apple-inspired styling */}
        <div className={`transition-all duration-1000 delay-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <Accordion type="single" collapsible className="w-full space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem 
                key={index} 
                value={`item-${index}`} 
                className={`apple-card overflow-hidden transition-all duration-500 delay-${index * 100} hover:shadow-2xl hover:shadow-blue-500/10`}
              >
                <AccordionTrigger className="px-8 py-6 text-left font-semibold text-slate-900 hover:no-underline hover:text-blue-600 group">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-50 to-blue-100/50 backdrop-blur-sm flex items-center justify-center group-hover:from-blue-100 group-hover:to-blue-200/50 transition-all duration-300 border border-blue-100/50">
                      <faq.icon className="w-6 h-6 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <div className="text-sm font-medium text-blue-600/70 uppercase tracking-wide mb-1">{faq.category}</div>
                      <div className="text-lg font-bold">{faq.question}</div>
                    </div>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-8 pb-6 text-slate-600 leading-relaxed text-lg ml-16">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>

        {/* CTA Section with Apple-inspired styling */}
        <div className={`text-center mt-16 transition-all duration-1000 delay-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div className="apple-glass-card p-8">
            <h3 className="text-2xl font-bold text-slate-900 mb-4">Still Have Questions?</h3>
            <p className="text-slate-600 mb-6 leading-relaxed">
              Our team of healthcare revenue cycle experts is here to help you understand how AI can transform your facility.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button 
                onClick={() => navigate('/waitlist')}
                className="apple-button group flex items-center justify-center gap-3 px-8 py-3 text-white bg-gradient-to-b from-blue-500 to-blue-600 rounded-xl hover:from-blue-600 hover:to-blue-700 font-semibold shadow-lg"
              >
                <Play className="w-5 h-5 fill-current" />
                Watch Demo
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
              </button>
              <button 
                onClick={() => navigate('/waitlist')}
                className="flex items-center justify-center gap-2 px-8 py-3 rounded-xl font-semibold text-blue-600 border-2 border-blue-200 hover:border-blue-300 hover:bg-blue-50 transition-all duration-300"
              >
                <MessageCircle className="w-5 h-5" />
                Contact Support
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FAQ;
