
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const WhyAI = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-accent">
      <Navbar />
      <main className="pt-24">
        {/* Hero Section */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-primary mb-6">
            Why AI? The Future of Skilled Nursing Billing
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Transform your facility's revenue cycle with AI-powered automation
          </p>
          <Button size="lg" onClick={() => navigate("/auth")} className="text-lg px-8 py-6 h-auto">
            Schedule a Free Demo
          </Button>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold text-primary mb-8">Transform Your Revenue Cycle with AI</h2>
            <p className="text-xl text-gray-600 mb-8">
              Imagine a world where:
            </p>
            <ul className="text-left max-w-2xl mx-auto space-y-4 mb-12">
              {["Claims are filed accurately and on time, without you lifting a finger.", 
                "Denials are resolved before they happen, so you get paid faster.", 
                "Your team can focus on patient care, not paperwork."
              ].map((point, index) => (
                <li key={index} className="flex items-start gap-3">
                  <div className="h-6 w-6 text-primary flex-shrink-0 mt-1">•</div>
                  <span className="text-gray-600">{point}</span>
                </li>
              ))}
            </ul>
            <p className="text-lg text-gray-600 mb-8">
              Our AI agent makes this possible—and it's easier to implement than you think.
            </p>
            <Button size="lg" onClick={() => navigate("/auth")} className="text-lg px-8 py-6 h-auto">
              Schedule a Free Demo → See How AI Can Work for You
            </Button>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default WhyAI;
