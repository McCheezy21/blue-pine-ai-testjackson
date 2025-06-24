import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import Features from "../components/Features";
import MoreFeatures from "../components/MoreFeatures";
import FAQ from "../components/FAQ";
import Testimonials from "../components/Testimonials";
import Footer from "../components/Footer";
import AIExplanationSection from "../components/AIExplanationSection";

const Index = () => {
  return (
    <div className="min-h-screen bg-white overflow-hidden">
      <Navbar />
      <Hero />
      
      {/* Apple-inspired sectioning with refined spacing */}
      <section id="features" className="relative py-24 bg-gradient-to-b from-white to-slate-50/30">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-500/3 via-transparent to-transparent"></div>
        <Features />
      </section>
      
      <section className="relative py-24 bg-white">
        <div className="absolute inset-0 bg-gradient-to-r from-slate-50/30 via-white to-slate-50/30"></div>
        <MoreFeatures />
      </section>
      
      <section id="ai-explanation" className="relative py-24 bg-gradient-to-b from-slate-50/30 to-white">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-500/2 via-transparent to-transparent"></div>
        <AIExplanationSection />
      </section>
      
      <section id="faq" className="relative py-24 bg-gradient-to-b from-white to-slate-50/30">
        <FAQ />
      </section>
      
      <Footer />
    </div>
  );
};

export default Index;
