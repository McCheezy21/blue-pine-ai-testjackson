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
    icon: TrendingUp,
    question: "What results can we expect, and how quickly?",
    answer: "Our clients typically see 30-50% fewer claim denials within 90 days and 30% faster cash flow. Most facilities recover our fees through increased revenue in the first 60 days. We guarantee measurable ROI within 90 days or we'll work for free until you see results.",
    category: "Results"
  },
  {
    icon: DollarSign,
    question: "What's the investment? Are there hidden fees?",
    answer: "Transparent, facility-size based pricing with $0 setup fees, integrations, or training costs. We succeed when you do—most clients cover our fees with recovered revenue in their first 60 days. No long-term contracts required.",
    category: "Investment"
  },
  {
    icon: Zap,
    question: "How does this integrate with our current systems?",
    answer: "Seamless integration with PointClickCare, Cerner, Epic, and major billing platforms. Setup takes under 72 hours with zero downtime. Our team handles everything—no IT burden on your staff.",
    category: "Integration"
  },
  {
    icon: Users,
    question: "Will this disrupt our current workflows?",
    answer: "No disruption. Our AI works behind the scenes—no manual data entry or complex training required. Staff only interact with simple alerts and approvals. We include free onboarding and 24/7 support.",
    category: "Implementation"
  },
  {
    icon: Shield,
    question: "Is this compliant with healthcare regulations?",
    answer: "Fully HIPAA-compliant, CMS-adherent, and SOC 2 certified. All data is encrypted (in transit and at rest) with annual third-party audits. Your documentation and workflows will always meet regulatory standards.",
    category: "Compliance"
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
    <section id="faq-section" className="relative py-20 bg-white">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header with Blue Pine AI typography */}
        <div className={`text-center mb-16 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          <div className="flex items-center justify-center mb-6">
            <div className="w-16 h-16 rounded-lg bg-[#EAEFF2] flex items-center justify-center mr-4 border border-[#CCCCCC]">
              <HelpCircle className="w-8 h-8 text-[#004466]" />
            </div>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif tracking-tight leading-none">
              <span className="text-[#004466]">Questions</span>
              <br />
              <span className="text-[#004466]">& Answers</span>
            </h2>
          </div>
          <p className="text-xl text-[#333333] max-w-3xl mx-auto leading-relaxed font-normal">
            Everything you need to know about transforming your revenue cycle with AI
          </p>
        </div>

        {/* FAQ Accordion with Blue Pine AI styling */}
        <div className={`transition-all duration-700 delay-200 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          <Accordion type="single" collapsible className="w-full space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem 
                key={index} 
                value={`item-${index}`} 
                className={`bg-white overflow-hidden transition-all duration-300 delay-${index * 50} hover:shadow-md rounded-lg border border-[#CCCCCC]`}
              >
                <AccordionTrigger className="px-8 py-6 text-left font-semibold text-[#004466] hover:no-underline hover:text-[#005580] group">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 rounded-lg bg-[#EAEFF2] flex items-center justify-center group-hover:bg-[#D1D8DC] transition-all duration-300 border border-[#CCCCCC]">
                      <faq.icon className="w-6 h-6 text-[#004466]" />
                    </div>
                    <div className="flex-1">
                      <div className="text-sm font-medium text-[#004466]/70 uppercase tracking-wide mb-1">{faq.category}</div>
                      <div className="text-lg font-bold">{faq.question}</div>
                    </div>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-8 pb-6 text-[#333333] leading-relaxed text-lg ml-16">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>

        {/* CTA Section with Blue Pine AI styling */}
        <div className={`text-center mt-16 transition-all duration-700 delay-400 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          <div className="blue-pine-card p-12">
            <div className="w-16 h-16 rounded-lg bg-[#EAEFF2] flex items-center justify-center mx-auto mb-6 border border-[#CCCCCC]">
              <MessageCircle className="w-8 h-8 text-[#004466]" />
            </div>
            <h3 className="text-3xl md:text-4xl font-bold text-[#004466] mb-6 tracking-tight">
              Still Have Questions?
            </h3>
            <p className="text-xl text-[#333333] mb-8 leading-relaxed max-w-2xl mx-auto">
              Our team of healthcare revenue cycle experts is here to help you understand how AI can transform your facility.
            </p>
            <div className="flex justify-center">
              <button 
                onClick={() => navigate('/demo')}
                className="group flex items-center justify-center gap-3 px-8 py-4 text-lg font-semibold text-white bg-[#004466] rounded-lg hover:bg-[#005580] transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] shadow-sm"
              >
                See It In Action
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FAQ;
