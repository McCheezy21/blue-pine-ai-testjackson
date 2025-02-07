
import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import Features from "../components/Features";
import WhoNeedsThis from "../components/WhoNeedsThis";
import FAQ from "../components/FAQ";
import Testimonials from "../components/Testimonials";
import Footer from "../components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      <Hero />
      <Features />
      <WhoNeedsThis />
      <Testimonials />
      <FAQ />
      <Footer />
    </div>
  );
};

export default Index;
