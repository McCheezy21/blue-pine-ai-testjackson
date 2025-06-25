import { Card, CardContent } from "./ui/card";
import { Star } from "lucide-react";

const testimonials = [
  {
    name: "Sarah Johnson",
    role: "Director of Operations",
    company: "150-bed SNF, Texas",
    quote: "Blue Pine's AI has transformed our revenue cycle. We've seen a 65% reduction in claim denials and our staff can finally focus on patient care instead of paperwork.",
    image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158",
    results: "65% fewer denials"
  },
  {
    name: "Michael Chen",
    role: "Administrator",
    company: "200-bed SNF, California", 
    quote: "The ROI has been incredible. Not only are we saving time, but our cash flow improved by 30% in the first 90 days. It's like having a revenue cycle expert working 24/7.",
    image: "https://images.unsplash.com/photo-1519389950473-47ba0277781c",
    results: "30% faster cash flow"
  },
  {
    name: "Emily Rodriguez",
    role: "CFO",
    company: "Multi-facility operator",
    quote: "The compliance accuracy and automated appeals have eliminated our biggest headaches. We're recovering revenue we didn't even know we were losing.",
    image: "https://images.unsplash.com/photo-1605810230434-7631ac76ec81",
    results: "8% revenue recovery"
  }
];

const Testimonials = () => {
  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-4xl md:text-5xl font-serif tracking-tight leading-none text-[#004466] text-center mb-12">
          Trusted by Healthcare Leaders
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="border border-[#CCCCCC] shadow-md hover:shadow-lg transition-shadow duration-300 bg-white h-full">
              <CardContent className="p-8 h-full flex flex-col">
                {/* Star Rating - Fixed height section */}
                <div className="flex justify-center space-x-1 mb-6">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-[#FFD700] text-[#FFD700]" />
                  ))}
                </div>
                
                {/* Quote - Flexible height section */}
                <div className="flex-1 flex items-center mb-6">
                  <p className="text-[#333333] italic text-center leading-relaxed">
                    "{testimonial.quote}"
                  </p>
                </div>
                
                {/* Results Highlight - Fixed height section */}
                <div className="bg-[#EAEFF2] p-3 rounded-lg text-center border border-[#CCCCCC] mb-6">
                  <div className="font-bold text-[#004466]">{testimonial.results}</div>
                </div>
                
                {/* Profile - Fixed height section */}
                <div className="flex flex-col items-center space-y-2 mt-auto">
                  <div className="w-16 h-16 rounded-full overflow-hidden">
                    <img
                      src={testimonial.image}
                      alt={testimonial.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="text-center">
                    <h4 className="font-semibold text-[#004466]">{testimonial.name}</h4>
                    <p className="text-sm text-[#666666]">{testimonial.role}</p>
                    <p className="text-xs text-[#999999]">{testimonial.company}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;