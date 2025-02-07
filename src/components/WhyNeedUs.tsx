
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { 
  TrendingDown, Clock, FileCheck2, Banknote, Calendar, 
  AlertCircle, ShieldAlert, FileText, PiggyBank, XCircle,
  Zap, CheckCircle2, TrendingUp, DollarSign, Brain
} from "lucide-react";

const benefits = [
  { icon: TrendingDown, text: "Slash Claim Denials by 65%+" },
  { icon: Clock, text: "Automate Pre-Authorizations in Minutes" },
  { icon: FileCheck2, text: "Fix Coding Errors Before Claims Are Filed" },
  { icon: Banknote, text: "Get Paid Faster with 1-Click Submissions" },
  { icon: Calendar, text: "Predict Payment Dates with 95% Accuracy" },
  { icon: AlertCircle, text: "Resolve Denials in Hours, Not Weeks" },
  { icon: ShieldAlert, text: "Block Unauthorized Treatments in Real Time" },
  { icon: FileText, text: "Generate Audit-Proof Documentation Automatically" },
  { icon: PiggyBank, text: "Recover Lost Revenue from Past Denials" },
  { icon: XCircle, text: "Eliminate Billing Errors for Good" },
  { icon: Zap, text: "Speed Up Claims by 50%" },
  { icon: CheckCircle2, text: "Ensure 100% Payer Compliance" },
  { icon: TrendingUp, text: "Unlock 5–15% More Revenue" },
  { icon: DollarSign, text: "Stop Leaving Money on the Table" },
  { icon: Brain, text: "Simplify Skilled Nursing Billing with AI" }
];

const WhyNeedUs = () => {
  return (
    <section className="relative -mt-32 pt-0 pb-16 bg-gradient-to-b from-transparent via-accent to-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-32">
        <h2 className="text-3xl font-bold text-primary text-center mb-12">
          Why You Need Us
        </h2>
        <div className="relative">
          <Carousel
            opts={{
              align: "start",
              loop: true,
            }}
            className="w-full"
          >
            <CarouselContent>
              {benefits.map((benefit, index) => (
                <CarouselItem key={index} className="md:basis-1/3 lg:basis-1/4">
                  <div className="p-6">
                    <div className="flex flex-col items-center space-y-4 bg-white rounded-lg p-6 h-full hover:shadow-lg transition-shadow duration-300">
                      <benefit.icon className="w-12 h-12 text-primary relative z-10" />
                      <h3 className="text-lg font-semibold text-primary text-center">{benefit.text}</h3>
                    </div>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="hidden md:flex" />
            <CarouselNext className="hidden md:flex" />
          </Carousel>
        </div>
      </div>
    </section>
  );
};

export default WhyNeedUs;
