import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { FileText, Database, CheckSquare, CreditCard, DollarSign, Archive, List, Play, ArrowRight } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

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

    const element = document.getElementById('why-need-us-section');
    if (element) observer.observe(element);

    return () => observer.disconnect();
  }, []);

  return (
    <section id="why-need-us-section" className="relative py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header with Apple-inspired typography */}
        <div className={`text-center mb-20 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 tracking-tight leading-none">
            <span className="bg-gradient-to-r from-slate-900 via-blue-900 to-slate-900 bg-clip-text text-transparent">Complete Revenue Cycle</span>
            <br />
            <span className="bg-gradient-to-r from-blue-600 via-blue-500 to-blue-600 bg-clip-text text-transparent">Automation</span>
          </h2>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed font-medium">
            Our AI agents handle every aspect of your revenue cycle, from patient sourcing to final payment collection
          </p>
        </div>

        {/* Desktop Grid */}
        <div className={`hidden lg:grid lg:grid-cols-4 gap-6 mb-20 transition-all duration-1000 delay-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          {benefits.slice(0, 4).map((benefit, index) => (
            <div key={index} className={`apple-card p-6 text-center transition-all duration-500 delay-${index * 100}`}>
              <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-blue-50 to-blue-100/50 backdrop-blur-sm flex items-center justify-center border border-blue-100/50">
                <benefit.icon className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">{benefit.text}</h3>
              <p className="text-sm text-slate-600">{benefit.description}</p>
            </div>
          ))}
        </div>

        <div className={`hidden lg:grid lg:grid-cols-3 gap-6 mb-20 transition-all duration-1000 delay-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          {benefits.slice(4).map((benefit, index) => (
            <div key={index + 4} className={`apple-card p-6 text-center transition-all duration-500 delay-${(index + 4) * 100}`}>
              <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-blue-50 to-blue-100/50 backdrop-blur-sm flex items-center justify-center border border-blue-100/50">
                <benefit.icon className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">{benefit.text}</h3>
              <p className="text-sm text-slate-600">{benefit.description}</p>
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
                    <div className="apple-card p-6 text-center h-full">
                      <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-blue-50 to-blue-100/50 backdrop-blur-sm flex items-center justify-center border border-blue-100/50">
                        <benefit.icon className="w-8 h-8 text-blue-600" />
                      </div>
                      <h3 className="text-lg font-bold text-slate-900 mb-2">{benefit.text}</h3>
                      <p className="text-sm text-slate-600">{benefit.description}</p>
                    </div>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="hidden md:flex" />
            <CarouselNext className="hidden md:flex" />
          </Carousel>
        </div>

        {/* Call to Action with Apple-inspired styling */}
        <div className={`text-center mt-16 transition-all duration-1000 delay-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div className="apple-glass-card p-8 max-w-2xl mx-auto">
            <h3 className="text-2xl font-bold text-slate-900 mb-4">Ready to See AI in Action?</h3>
            <p className="text-slate-600 mb-6 leading-relaxed">Join healthcare facilities already transforming their revenue cycles with our AI agents.</p>
            <button 
              onClick={() => navigate('/waitlist')}
              className="apple-button group flex items-center gap-3 px-8 py-4 text-lg font-semibold text-white bg-gradient-to-b from-blue-500 to-blue-600 rounded-2xl hover:from-blue-600 hover:to-blue-700 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] shadow-lg mx-auto"
            >
              <Play className="w-5 h-5 fill-current" />
              Watch Demo
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhyNeedUs;
