import { useEffect, useState } from "react";
import { Shield, CheckCircle } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const PrivacyPolicy = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-[#EAEFF2] rounded-full opacity-20"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-[#EAEFF2] rounded-full opacity-20"></div>
      </div>

      <div className="relative max-w-4xl mx-auto px-4 py-24">
        {/* Header */}
        <div className={`text-center mb-16 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          {/* Trust Badge */}
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-[#EAEFF2] text-[#004466] font-medium text-sm mb-8">
            <Shield className="w-4 h-4 mr-2" />
            HIPAA Compliant Privacy Policy
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 tracking-tight leading-none text-[#004466]">
            Privacy Policy
          </h1>
          <p className="text-xl text-[#666666]">Last Updated: February 18, 2025</p>
        </div>
        
        <div className="space-y-8">
          {/* Introduction */}
          <div className={`bg-white p-8 rounded-lg shadow-lg border border-[#CCCCCC] transition-all duration-1000 delay-200 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <div className="prose prose-lg max-w-none">
              <p className="text-[#333333] text-lg leading-relaxed">
                This privacy notice for Blue Pine AI LLC ("Company," "we," "us," or "our"), describes how and why we might collect, store, use, and/or share ("process") your information when you use our services ("Services"), such as when you:
              </p>
              <ul className="list-disc ml-6 mt-6 text-[#333333] space-y-2">
                <li>Visit our website at https://bluepineai.com/, or any website of ours that links to this privacy notice</li>
                <li>Engage with us in other related ways, including any sales, marketing, or events</li>
              </ul>
              <div className="mt-6 p-6 bg-[#EAEFF2] rounded-lg border border-[#CCCCCC]">
                <p className="text-[#333333]">
                  <strong className="text-[#004466]">Questions or concerns?</strong> Reading this privacy notice will help you understand your privacy rights and choices. If you do not agree with our policies and practices, please do not use our Services. If you still have any questions or concerns, please contact us at{' '}
                  <a href="mailto:contact@bluepineai.com" className="text-[#004466] hover:text-[#005580] transition-colors duration-300 hover:underline">
                    contact@bluepineai.com
                  </a>
                </p>
              </div>
            </div>
          </div>

          {/* Summary */}
          <section className={`bg-white p-8 rounded-lg shadow-lg border border-[#CCCCCC] transition-all duration-1000 delay-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <h2 className="text-3xl font-bold text-[#004466] mb-6">Summary</h2>
            <p className="text-[#333333] text-lg leading-relaxed">
              This Privacy Policy explains how Blue Pine AI LLC collects, uses, discloses, and protects your information when you use our services. We process Protected Health Information (PHI) but do not store any PHI on our servers. Our goal is to ensure transparency and safeguard your privacy. By using our services, you acknowledge and agree to the terms outlined in this policy.
            </p>
          </section>

          {/* Policy Sections */}
          <div className="space-y-6">
            {[
              {
                title: "1. Introduction",
                content: 'Welcome to Blue Pine AI LLC ("Company," "we," "our," or "us"). Your privacy is important to us. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our claims automation product for skilled nursing facilities ("Service").'
              },
              {
                title: "2. Information We Collect",
                content: (
                  <>
                    <p>We collect the following types of information:</p>
                    <ul className="list-disc ml-6 mt-4 space-y-3">
                      <li><strong>Personal Information:</strong> Name, email address, job title, and contact details.</li>
                      <li><strong>Facility Information:</strong> Facility name, size, and operational data necessary for claims automation.</li>
                      <li><strong>Usage Data:</strong> Log files, device information, IP address, browser type, and interaction with our Service.</li>
                      <li><strong>Cookies and Tracking Technologies:</strong> We use cookies to improve user experience and analytics.</li>
                    </ul>
                  </>
                )
              },
              {
                title: "3. Protected Health Information (PHI)",
                content: "While we process and manage Protected Health Information (PHI) as part of our claims automation service, we do not store any PHI data on our servers. Our Service is designed to facilitate secure claims processing while ensuring all PHI data handling complies with HIPAA and other relevant healthcare privacy regulations."
              },
              {
                title: "4. How We Use Your Information",
                content: (
                  <>
                    <p>We use the collected information to:</p>
                    <ul className="list-disc ml-6 mt-4 space-y-3">
                      <li>Provide and improve our Service.</li>
                      <li>Ensure compliance with relevant regulations.</li>
                      <li>Communicate with you regarding updates and support.</li>
                      <li>Enhance security and prevent fraud.</li>
                      <li>Comply with legal obligations and regulatory requirements.</li>
                    </ul>
                  </>
                )
              },
              {
                title: "5. Data Sharing and Disclosure",
                content: (
                  <>
                    <p>We do not sell your personal information. We may share your information with:</p>
                    <ul className="list-disc ml-6 mt-4 space-y-3">
                      <li><strong>Service Providers:</strong> Third-party vendors assisting with business operations.</li>
                      <li><strong>Legal Authorities:</strong> When required by law or to protect our rights.</li>
                      <li><strong>Business Transfers:</strong> In case of a merger, sale, or acquisition.</li>
                      <li><strong>Authorized Personnel:</strong> Only authorized employees and contractors with a need-to-know basis will have access to operational data.</li>
                    </ul>
                  </>
                )
              },
              {
                title: "6. Data Security",
                content: (
                  <>
                    <p>We implement industry-standard security measures, including:</p>
                    <ul className="list-disc ml-6 mt-4 space-y-3">
                      <li>Encryption of data in transit and at rest.</li>
                      <li>Access controls and authentication protocols to restrict unauthorized access.</li>
                      <li>Regular security assessments and compliance audits.</li>
                      <li>Incident response plan in place for data breaches, including required reporting to regulatory authorities and affected individuals.</li>
                    </ul>
                  </>
                )
              },
              {
                title: "7. Your Rights and Choices",
                content: (
                  <>
                    <p>You have the right to:</p>
                    <ul className="list-disc ml-6 mt-4 space-y-3">
                      <li>Access, correct, or delete your personal data.</li>
                      <li>Restrict certain data processing activities.</li>
                      <li>Opt-out of marketing communications.</li>
                    </ul>
                  </>
                )
              },
              {
                title: "8. Third-Party Links",
                content: "Our Service may contain links to third-party websites. We are not responsible for their privacy practices. We recommend reviewing their privacy policies."
              },
              {
                title: "9. Changes to This Privacy Policy",
                content: "We may update this Privacy Policy periodically. We will notify you of significant changes through our website or email."
              },
              {
                title: "10. Contact Us",
                content: (
                  <p>
                    If you have any questions about this Privacy Policy, contact us at{' '}
                    <a href="mailto:contact@bluepineai.com" className="text-[#004466] hover:text-[#005580] transition-colors duration-300 hover:underline">
                      contact@bluepineai.com
                    </a>
                  </p>
                )
              }
            ].map((section, index) => (
              <section 
                key={section.title} 
                className={`bg-white p-8 rounded-lg shadow-lg border border-[#CCCCCC] transition-all duration-1000 delay-${400 + (index * 100)} ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
              >
                <h2 className="text-2xl font-bold text-[#004466] mb-6">{section.title}</h2>
                <div className="text-[#333333] text-lg leading-relaxed">{section.content}</div>
              </section>
            ))}
          </div>

          {/* Trust Indicators */}
          <div className={`mt-12 text-center transition-all duration-1000 delay-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <div className="flex items-center justify-center space-x-8 text-sm text-[#666666]">
              <div className="flex items-center space-x-2">
                <Shield className="w-5 h-5 text-[#004466]" />
                <span>HIPAA Compliant</span>
              </div>
              <div className="w-1 h-1 bg-[#CCCCCC] rounded-full"></div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-5 h-5 text-[#004466]" />
                <span>SOC 2 Certified</span>
              </div>
              <div className="w-1 h-1 bg-[#CCCCCC] rounded-full"></div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-5 h-5 text-[#004466]" />
                <span>Healthcare Privacy Protected</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default PrivacyPolicy;
