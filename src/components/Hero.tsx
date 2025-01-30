import { ArrowRight } from "lucide-react";

const Hero = () => {
  return (
    <div className="relative min-h-screen flex items-center">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-secondary/10 -z-10" />
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9')] bg-cover bg-center opacity-10 -z-20" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32">
        <div className="text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-primary mb-6 animate-fade-down">
            Pioneering AI Solutions <br />for Tomorrow's Challenges
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto animate-fade-up">
            Blue Pine AI combines cutting-edge artificial intelligence with sustainable innovation to create solutions that matter.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-fade-up">
            <button className="bg-primary text-white px-8 py-3 rounded-md hover:bg-primary/90 flex items-center gap-2 group">
              Get Started
              <ArrowRight className="group-hover:translate-x-1 transition-transform" />
            </button>
            <button className="text-primary border-2 border-primary px-8 py-3 rounded-md hover:bg-primary/10">
              Learn More
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;