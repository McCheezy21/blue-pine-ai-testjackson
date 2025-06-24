const About = () => {
  return (
    <section id="about" className="py-20 bg-[#EAEFF2]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="relative">
            <div className="aspect-square rounded-lg overflow-hidden shadow-lg">
              <img
                src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158"
                alt="Team working on AI solutions"
                className="object-cover w-full h-full"
              />
            </div>
            <div className="absolute inset-0 bg-gradient-to-tr from-[#004466]/20 to-transparent rounded-lg" />
          </div>
          
          <div>
            <h2 className="text-4xl md:text-5xl font-serif text-[#004466] mb-6 leading-tight">
              Our Vision
            </h2>
            <p className="text-[#333333] mb-6 leading-relaxed text-lg">
              At Blue Pine AI, we believe in harnessing the power of artificial intelligence to create a more sustainable and efficient future. Our team of experts combines deep technical knowledge with a commitment to environmental responsibility.
            </p>
            <p className="text-[#333333] mb-8 leading-relaxed text-lg">
              We're not just building AI solutions; we're crafting a future where technology and nature coexist harmoniously.
            </p>
            <div className="grid grid-cols-2 gap-6 text-center">
              <div className="p-6 bg-white rounded-lg shadow-sm border border-[#CCCCCC]">
                <div className="text-3xl font-bold text-[#004466] mb-2">95%</div>
                <div className="text-[#333333] font-medium">Client Satisfaction</div>
              </div>
              <div className="p-6 bg-white rounded-lg shadow-sm border border-[#CCCCCC]">
                <div className="text-3xl font-bold text-[#004466] mb-2">50+</div>
                <div className="text-[#333333] font-medium">AI Solutions Deployed</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;