
const PrivacyPolicy = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-16">
      <h1 className="text-4xl font-bold text-primary mb-8">Privacy Policy</h1>
      
      <div className="space-y-6 text-left">
        <section>
          <h2 className="text-2xl font-semibold text-primary mb-4">1. Information We Collect</h2>
          <p className="text-gray-700">
            We collect information that you provide directly to us, including when you create an account, 
            use our services, or communicate with us. This may include your name, email address, and facility information.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-primary mb-4">2. How We Use Your Information</h2>
          <p className="text-gray-700">
            We use the information we collect to provide, maintain, and improve our services, 
            to communicate with you, and to comply with legal obligations.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-primary mb-4">3. Information Sharing</h2>
          <p className="text-gray-700">
            We do not sell your personal information. We may share your information with service providers 
            who assist us in providing our services, or when required by law.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-primary mb-4">4. Data Security</h2>
          <p className="text-gray-700">
            We implement appropriate technical and organizational measures to protect your personal information 
            against unauthorized access, alteration, disclosure, or destruction.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-primary mb-4">5. Contact Us</h2>
          <p className="text-gray-700">
            If you have any questions about this Privacy Policy, please contact us at{" "}
            <a href="mailto:contact@bluepineai.com" className="text-primary hover:underline">
              contact@bluepineai.com
            </a>
          </p>
        </section>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
