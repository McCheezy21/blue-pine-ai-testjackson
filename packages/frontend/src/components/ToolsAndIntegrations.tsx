
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Building, Shield, Users, Link } from "lucide-react";

const certifications = [
  { icon: Building, label: "Your EHR Provider Integration" },
  { icon: Link, label: "Post-Acute Coordination Integration" },
  { icon: Shield, label: "HIPAA Compliant" },
  { icon: Building, label: "Centers for Medicare & Medicaid Services" },
  { icon: Users, label: "Your Local Insurance Providers" },
];

const ToolsAndIntegrations = () => {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-primary text-center mb-12">
          Integrations and Certifications
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
              {certifications.map((cert, index) => (
                <CarouselItem key={index} className="md:basis-1/3 lg:basis-1/4">
                  <div className="p-6">
                    <div className="flex flex-col items-center space-y-4 bg-accent rounded-lg p-6 h-full hover:shadow-lg transition-shadow duration-300">
                      <cert.icon className="w-12 h-12 text-primary" />
                      <h3 className="text-lg font-semibold text-primary text-center">{cert.label}</h3>
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

export default ToolsAndIntegrations;
