import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import Features from "../components/Features";
import FAQ from "../components/FAQ";
import Testimonials from "../components/Testimonials";
import Footer from "../components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <Hero />
      
      {/* Professional sectioning with subtle backgrounds */}
      <section id="features" className="relative py-24 bg-white">
        <Features />
      </section>
      
      <section className="relative py-24 bg-white">
        <Testimonials />
      </section>
      
      <section id="faq" className="relative py-24 bg-white">
        <FAQ />
      </section>
      
      <Footer />
    </div>
  );
};

export default Index;
