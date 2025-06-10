
import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import Features from "../components/Features";
import WhyNeedUs from "../components/WhyNeedUs";
import FAQ from "../components/FAQ";
import Testimonials from "../components/Testimonials";
import ToolsAndIntegrations from "../components/ToolsAndIntegrations";
import Footer from "../components/Footer";
import AIExplanationSection from "../components/AIExplanationSection";

const Index = () => {
  return (
    <div className="min-h-screen bg-white overflow-hidden">
      <Navbar />
      <Hero />
      
      {/* Premium spacing and sectioning */}
      <section id="features" className="relative py-32 bg-gradient-to-b from-white to-gray-50/50">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/5 via-transparent to-transparent"></div>
        <Features />
      </section>
      
      <section className="relative py-32 bg-white">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-50/30 via-white to-blue-50/30"></div>
        <WhyNeedUs />
      </section>
      
      <section id="ai-explanation" className="relative py-32 bg-gradient-to-b from-gray-50/50 to-white">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary/3 via-transparent to-transparent"></div>
        <AIExplanationSection />
      </section>
      
      <section className="relative py-32 bg-white">
        <div className="absolute inset-0 bg-gradient-to-r from-white via-blue-50/20 to-white"></div>
        <ToolsAndIntegrations />
      </section>
      
      <section id="faq" className="relative py-32 bg-gradient-to-b from-white to-gray-50/50">
        <FAQ />
      </section>
      
      <Footer />
    </div>
  );
};

export default Index;
