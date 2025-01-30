const About = () => {
  return (
    <section id="about" className="py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="relative">
            <div className="aspect-square rounded-lg overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158"
                alt="Team working on AI solutions"
                className="object-cover w-full h-full"
              />
            </div>
            <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-transparent rounded-lg" />
          </div>
          
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-primary mb-6">
              Our Vision
            </h2>
            <p className="text-gray-600 mb-6">
              At Blue Pine AI, we believe in harnessing the power of artificial intelligence to create a more sustainable and efficient future. Our team of experts combines deep technical knowledge with a commitment to environmental responsibility.
            </p>
            <p className="text-gray-600 mb-8">
              We're not just building AI solutions; we're crafting a future where technology and nature coexist harmoniously.
            </p>
            <div className="grid grid-cols-2 gap-6 text-center">
              <div className="p-4 bg-accent rounded-lg">
                <div className="text-3xl font-bold text-primary mb-2">95%</div>
                <div className="text-gray-600">Client Satisfaction</div>
              </div>
              <div className="p-4 bg-accent rounded-lg">
                <div className="text-3xl font-bold text-primary mb-2">50+</div>
                <div className="text-gray-600">AI Solutions Deployed</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;