
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { FileText, Database, CheckSquare, CreditCard, DollarSign, Archive, List, Bot } from "lucide-react";
import { useEffect, useState } from "react";

const benefits = [
  { icon: FileText, text: "Denial Management", description: "Automated appeal processing" },
  { icon: Database, text: "EOB Posting", description: "Real-time payment reconciliation" },
  { icon: CheckSquare, text: "Insurance Eligibility", description: "Instant verification & validation" },
  { icon: Archive, text: "Pre Authorizations", description: "Streamlined approval workflows" },
  { icon: List, text: "Claims Submissions", description: "Error-free claim processing" },
  { icon: CreditCard, text: "Billing and EDI", description: "Seamless data exchange" },
  { icon: DollarSign, text: "Claims Status", description: "Real-time tracking & updates" }
];

const WhyNeedUs = () => {
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

    const element = document.getElementById('ai-agents-section');
    if (element) observer.observe(element);

    return () => observer.disconnect();
  }, []);

  return (
    <section id="ai-agents-section" className="relative py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className={`text-center mb-16 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div className="flex items-center justify-center mb-6">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/20 to-blue-100 flex items-center justify-center mr-4">
              <Bot className="w-8 h-8 text-primary" />
            </div>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold">
              <span className="gradient-text">AI Agent</span>
              <br />
              <span className="gradient-text-secondary">Capabilities</span>
            </h2>
          </div>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Our intelligent agents work 24/7 to handle every aspect of your revenue cycle with precision and speed
          </p>
        </div>

        {/* Desktop Grid Layout */}
        <div className="hidden lg:grid lg:grid-cols-4 gap-6 mb-12">
          {benefits.map((benefit, index) => (
            <div 
              key={index} 
              className={`premium-card p-6 text-center group transition-all duration-700 delay-${index * 100} ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}
            >
              <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-primary/10 to-blue-50 flex items-center justify-center group-hover:from-primary/20 group-hover:to-blue-100 transition-all duration-300">
                <benefit.icon className="w-8 h-8 text-primary group-hover:scale-110 transition-transform duration-300" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-primary transition-colors duration-300">
                {benefit.text}
              </h3>
              <p className="text-sm text-gray-600 group-hover:text-gray-700 transition-colors duration-300">
                {benefit.description}
              </p>
            </div>
          ))}
        </div>

        {/* Mobile Carousel */}
        <div className="lg:hidden">
          <Carousel 
            opts={{
              align: "start",
              loop: true
            }} 
            className="w-full"
          >
            <CarouselContent>
              {benefits.map((benefit, index) => (
                <CarouselItem key={index} className="md:basis-1/2">
                  <div className="p-2">
                    <div className="premium-card p-6 text-center h-full">
                      <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-primary/10 to-blue-50 flex items-center justify-center">
                        <benefit.icon className="w-8 h-8 text-primary" />
                      </div>
                      <h3 className="text-lg font-bold text-gray-900 mb-2">{benefit.text}</h3>
                      <p className="text-sm text-gray-600">{benefit.description}</p>
                    </div>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="hidden md:flex" />
            <CarouselNext className="hidden md:flex" />
          </Carousel>
        </div>

        {/* Call to Action */}
        <div className={`text-center mt-16 transition-all duration-1000 delay-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div className="glass-card p-8 max-w-2xl mx-auto">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Ready to See AI in Action?</h3>
            <p className="text-gray-600 mb-6">Join healthcare facilities already transforming their revenue cycles with our AI agents.</p>
            <button className="modern-button bg-gradient-to-r from-primary to-blue-500 text-white px-8 py-3 rounded-xl font-semibold hover:scale-105 transition-transform duration-300">
              Request Demo
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhyNeedUs;
