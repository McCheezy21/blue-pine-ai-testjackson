
import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import Features from "../components/Features";
import WhyNeedUs from "../components/WhyNeedUs";
import FAQ from "../components/FAQ";
import Testimonials from "../components/Testimonials";
import ToolsAndIntegrations from "../components/ToolsAndIntegrations";
import Footer from "../components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      <Hero />
      <WhyNeedUs />
      <Features />
      <Testimonials />
      <ToolsAndIntegrations />
      <FAQ />
      <Footer />
    </div>
  );
};

export default Index;

