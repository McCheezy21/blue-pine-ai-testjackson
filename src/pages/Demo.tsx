import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
const Demo = () => {
  return <div className="min-h-screen bg-gradient-to-b from-white to-accent">
      <Navbar />
      <main className="pt-24">
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-primary mb-6">Join Waitlist</h1>
          <p className="text-xl text-gray-600 max-w-3xl mb-8">
            See how Blue Pine AI can transform your skilled nursing facility's revenue cycle management.
          </p>
          
          {/* Contact Form Section */}
          <div className="bg-white p-8 rounded-lg shadow-lg max-w-2xl">
            <h2 className="text-2xl font-semibold text-primary mb-6">
              Let's Connect
            </h2>
            <form className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name
                </label>
                <input type="text" id="name" className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary" placeholder="John Doe" />
              </div>
              
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Work Email
                </label>
                <input type="email" id="email" className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary" placeholder="john@facility.com" />
              </div>
              
              <div>
                <label htmlFor="facility" className="block text-sm font-medium text-gray-700 mb-1">
                  Facility Name
                </label>
                <input type="text" id="facility" className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary" placeholder="Your Facility Name" />
              </div>
              
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                  Additional Information
                </label>
                <textarea id="message" rows={4} className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary" placeholder="Tell us about your facility and current challenges..." />
              </div>
              
              <button type="submit" className="w-full bg-primary text-white px-6 py-3 rounded-md hover:bg-primary/90 transition-colors">
                Schedule Demo
              </button>
            </form>
          </div>
        </section>
      </main>
      <Footer />
    </div>;
};
export default Demo;