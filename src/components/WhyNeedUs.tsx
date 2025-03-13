import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { FileText, Database, CheckSquare, CreditCard, DollarSign, Archive, List } from "lucide-react";
import { useEffect } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
const benefits = [{
  icon: FileText,
  text: "Denial Management"
}, {
  icon: Database,
  text: "EOB Posting"
}, {
  icon: CheckSquare,
  text: "Insurance Eligibility Verification"
}, {
  icon: Archive,
  text: "Pre Authorizations"
}, {
  icon: List,
  text: "Claims Submissions"
}, {
  icon: CreditCard,
  text: "Billing and EDI"
}, {
  icon: DollarSign,
  text: "Claims Status"
}];
const WhyNeedUs = () => {
  return <section className="py-16 bg-primary">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-white text-center mb-12">AI Agent Features</h2>
        <div className="relative">
          <Carousel opts={{
          align: "start",
          loop: true
        }} plugins={[Autoplay({
          delay: 3000
        })]} className="w-full">
            <CarouselContent>
              {benefits.map((benefit, index) => <CarouselItem key={index} className="md:basis-1/3 lg:basis-1/4">
                  <div className="p-6">
                    <div className="flex flex-col items-center space-y-4 bg-white rounded-lg p-6 h-full hover:shadow-lg transition-shadow duration-300">
                      <benefit.icon className="w-12 h-12 text-primary" />
                      <h3 className="text-lg font-semibold text-primary text-center">{benefit.text}</h3>
                    </div>
                  </div>
                </CarouselItem>)}
            </CarouselContent>
            <CarouselPrevious className="hidden md:flex text-primary border-primary hover:bg-primary hover:text-white" />
            <CarouselNext className="hidden md:flex text-primary border-primary hover:bg-primary hover:text-white" />
          </Carousel>
        </div>
      </div>
    </section>;
};
export default WhyNeedUs;