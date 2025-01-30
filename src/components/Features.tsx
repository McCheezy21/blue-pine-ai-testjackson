import { Brain, Shield, Zap, TreePine } from "lucide-react";

const features = [
  {
    icon: <Brain className="w-12 h-12 text-primary" />,
    title: "Advanced AI Models",
    description: "State-of-the-art machine learning models tailored to your specific needs.",
  },
  {
    icon: <Shield className="w-12 h-12 text-primary" />,
    title: "Secure & Reliable",
    description: "Enterprise-grade security with 99.9% uptime guarantee.",
  },
  {
    icon: <Zap className="w-12 h-12 text-primary" />,
    title: "Lightning Fast",
    description: "Optimized for performance with real-time processing capabilities.",
  },
  {
    icon: <TreePine className="w-12 h-12 text-primary" />,
    title: "Eco-Friendly",
    description: "Sustainable AI solutions with minimal environmental impact.",
  },
];

const Features = () => {
  return (
    <section id="features" className="py-20 bg-accent">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">
            Why Choose Blue Pine AI?
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            We combine innovative technology with sustainable practices to deliver exceptional AI solutions.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="p-6 bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow"
            >
              <div className="mb-4">{feature.icon}</div>
              <h3 className="text-xl font-semibold text-primary mb-2">
                {feature.title}
              </h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;