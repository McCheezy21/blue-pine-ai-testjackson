
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const WhyAI = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-primary mb-4">Why Choose AI for Healthcare?</h1>
          <p className="text-xl text-gray-600">Transform your facility's operations with cutting-edge AI technology</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mt-16">
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
              <h3 className="text-2xl font-bold text-primary mb-4">Enhanced Accuracy</h3>
              <p className="text-gray-600">
                Our AI systems reduce human error in medical coding and billing, ensuring maximum reimbursement and compliance with healthcare regulations.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
              <h3 className="text-2xl font-bold text-primary mb-4">Time Savings</h3>
              <p className="text-gray-600">
                Automate repetitive tasks and paperwork, allowing your staff to focus on what matters most - patient care.
              </p>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
              <h3 className="text-2xl font-bold text-primary mb-4">Cost Reduction</h3>
              <p className="text-gray-600">
                Minimize claim denials and optimize revenue cycles with AI-powered predictive analytics and real-time verification.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
              <h3 className="text-2xl font-bold text-primary mb-4">Future-Ready</h3>
              <p className="text-gray-600">
                Stay ahead of the curve with continuously learning AI systems that adapt to changing healthcare regulations and requirements.
              </p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default WhyAI;
