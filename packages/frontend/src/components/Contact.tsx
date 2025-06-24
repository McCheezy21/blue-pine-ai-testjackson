import { Mail, MapPin, Phone } from "lucide-react";

const Contact = () => {
  return (
    <section id="contact" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-serif text-[#004466] mb-6 leading-tight">
            Get in Touch
          </h2>
          <p className="text-[#333333] max-w-2xl mx-auto text-lg leading-relaxed">
            Ready to transform your business with AI? Contact us today to discuss how we can help you achieve your goals.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12">
          <div className="bg-[#EAEFF2] p-8 rounded-lg shadow-sm border border-[#CCCCCC]">
            <form className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-[#333333] mb-2 font-medium">
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  className="w-full px-4 py-3 border border-[#CCCCCC] rounded-md focus:outline-none focus:ring-2 focus:ring-[#004466]/50 focus:border-[#004466] bg-white"
                  placeholder="Your name"
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-[#333333] mb-2 font-medium">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  className="w-full px-4 py-3 border border-[#CCCCCC] rounded-md focus:outline-none focus:ring-2 focus:ring-[#004466]/50 focus:border-[#004466] bg-white"
                  placeholder="your@email.com"
                />
              </div>
              <div>
                <label htmlFor="message" className="block text-[#333333] mb-2 font-medium">
                  Message
                </label>
                <textarea
                  id="message"
                  rows={4}
                  className="w-full px-4 py-3 border border-[#CCCCCC] rounded-md focus:outline-none focus:ring-2 focus:ring-[#004466]/50 focus:border-[#004466] bg-white"
                  placeholder="How can we help?"
                />
              </div>
              <button
                type="submit"
                className="w-full bg-[#004466] text-white px-6 py-3 rounded-md hover:bg-[#005580] transition-colors duration-300 font-medium"
              >
                Send Message
              </button>
            </form>
          </div>

          <div className="space-y-8">
            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 rounded-lg bg-[#004466] flex items-center justify-center shadow-sm">
                <MapPin className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-[#004466] mb-2">
                  Our Location
                </h3>
                <p className="text-[#333333] leading-relaxed">
                  123 AI Valley, Silicon Forest<br />
                  San Francisco, CA 94105
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 rounded-lg bg-[#004466] flex items-center justify-center shadow-sm">
                <Mail className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-[#004466] mb-2">
                  Email Us
                </h3>
                <p className="text-[#333333] leading-relaxed">contact@bluepineai.com</p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 rounded-lg bg-[#004466] flex items-center justify-center shadow-sm">
                <Phone className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-[#004466] mb-2">
                  Call Us
                </h3>
                <p className="text-[#333333] leading-relaxed">+1 (555) 123-4567</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;