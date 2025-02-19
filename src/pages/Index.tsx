
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
    <div className="min-h-screen">
      <Navbar />
      <Hero />
      <Features />
      <WhyNeedUs />
      <AIExplanationSection />
      <Testimonials />
      <ToolsAndIntegrations />
      <FAQ />
      <Footer />
    </div>
  );
};

export default Index;
