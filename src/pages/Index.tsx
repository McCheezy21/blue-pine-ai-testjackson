
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50">
      <Navbar />
      <Hero />
      <section id="features" className="py-20">
        <Features />
      </section>
      <section className="py-20 bg-gradient-to-r from-blue-50 to-white">
        <WhyNeedUs />
      </section>
      <section id="ai-explanation" className="py-20">
        <AIExplanationSection />
      </section>
      {/* Testimonials section temporarily hidden until we have testimonials */}
      {/* <section id="testimonials" className="py-20 bg-gradient-to-l from-blue-50 to-white">
        <Testimonials />
      </section> */}
      <section className="py-20 bg-gradient-to-r from-white to-blue-50">
        <ToolsAndIntegrations />
      </section>
      <section id="faq" className="py-20">
        <FAQ />
      </section>
      <Footer />
    </div>
  );
};

export default Index;
