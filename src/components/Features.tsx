const Features = () => {
  return (
    <section className="relative py-12 bg-accent -mt-32">
      <div className="absolute inset-x-0 -top-32 h-32 bg-gradient-to-b from-transparent to-accent pointer-events-none" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* First Feature Box */}
          <div className="p-6 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow animate-fade-up">
            <h3 className="text-2xl font-bold text-primary mb-4">
              Slash Claim Denials with AI-Powered Authorization & Coding Accuracy
            </h3>
            <div className="text-gray-600 space-y-4">
              <p className="mb-4">
                Stop losing revenue to preventable claim denials. Our AI agent automates insurance authorization workflows and cross-checks medical codes in real time to ensure 100% compliance with payer requirements.
              </p>
              <ul className="list-disc pl-5 space-y-2 mb-4">
                <li>AI audits documentation to flag missing or mismatched codes (e.g., ICD-10, CPT) before submission.</li>
                <li>Predict denials upfront using historical data and payer-specific rules.</li>
                <li>Guarantee compliant treatments by aligning care plans with pre-authorizations.</li>
              </ul>
              <p className="font-semibold">
                Result: Reduce denials by up to 70% and accelerate reimbursements for your skilled nursing facility.
              </p>
            </div>
          </div>

          {/* Revenue Feature */}
          <div className="p-6 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow animate-fade-up [animation-delay:200ms]">
            <h3 className="text-2xl font-bold text-primary mb-4">
              Revenue Recovery
            </h3>
            <p className="text-gray-600">
              Identify and fix claim issues before submission, dramatically reducing denial rates. Recover lost revenue and improve cash flow.
            </p>
          </div>

          {/* Compliance Feature */}
          <div className="p-6 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow animate-fade-up [animation-delay:400ms]">
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