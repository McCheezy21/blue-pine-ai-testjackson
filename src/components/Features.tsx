const Features = () => {
  return (
    <section className="py-24 bg-accent">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Automation Feature */}
          <div className="p-6 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow">
            <h3 className="text-2xl font-bold text-primary mb-4">
              Smart Automation
            </h3>
            <p className="text-gray-600">
              Our AI-powered system automatically processes claims, reducing manual work and human error. Save hours of staff time while improving accuracy.
            </p>
          </div>

          {/* Revenue Feature */}
          <div className="p-6 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow">
            <h3 className="text-2xl font-bold text-primary mb-4">
              Revenue Recovery
            </h3>
            <p className="text-gray-600">
              Identify and fix claim issues before submission, dramatically reducing denial rates. Recover lost revenue and improve cash flow.
            </p>
          </div>

          {/* Compliance Feature */}
          <div className="p-6 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow">
            <h3 className="text-2xl font-bold text-primary mb-4">
              Compliance Assured
            </h3>
            <p className="text-gray-600">
              Stay compliant with ever-changing healthcare regulations. Our system automatically updates to reflect the latest requirements and best practices.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Features;