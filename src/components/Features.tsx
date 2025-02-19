
const Features = () => {
  return (
    <section className="relative py-12 bg-accent -mt-32">
      <div className="absolute inset-x-0 -top-32 h-32 bg-gradient-to-b from-transparent to-accent pointer-events-none" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* First Feature Box */}
          <div className="p-8 bg-white rounded-lg shadow-sm hover:shadow-lg transition-all duration-300 animate-fade-up">
            <h3 className="text-2xl md:text-3xl font-bold text-primary mb-6 leading-tight">
              Slash Claim Denials by 70% with AI
            </h3>
            <div className="text-gray-600 space-y-6">
              <p className="text-lg font-medium text-primary/90">
                Stop losing revenue to preventable errors.
              </p>
              <ul className="space-y-6">
                <li className="flex flex-col gap-2">
                  <span className="font-bold text-primary/80">Auto-Audit Documentation</span>
                  <p className="text-gray-600 leading-relaxed">Flag missing/mismatched codes (ICD-10, CPT) in real time.</p>
                </li>
                <li className="flex flex-col gap-2">
                  <span className="font-bold text-primary/80">Predict Denials Upfront</span>
                  <p className="text-gray-600 leading-relaxed">Leverage payer-specific rules + historical data.</p>
                </li>
                <li className="flex flex-col gap-2">
                  <span className="font-bold text-primary/80">Guarantee Compliance</span>
                  <p className="text-gray-600 leading-relaxed">Align treatments with pre-authorizations.</p>
                </li>
              </ul>
              <p className="font-bold text-primary border-t pt-6 mt-6">
                → Outcome: Reduce denials by 70% + accelerate reimbursements.
              </p>
            </div>
          </div>

          {/* Second Feature Box */}
          <div className="p-8 bg-white rounded-lg shadow-sm hover:shadow-lg transition-all duration-300 animate-fade-up [animation-delay:200ms]">
            <h3 className="text-2xl md:text-3xl font-bold text-primary mb-6 leading-tight">
              Eliminate Coding Errors Automatically
            </h3>
            <div className="text-gray-600 space-y-6">
              <p className="text-lg font-medium text-primary/90">
                AI ensures 100% accurate billing every time.
              </p>
              <ul className="space-y-6">
                <li className="flex flex-col gap-2">
                  <span className="font-bold text-primary/80">Instant CPT/ICD-10 Mapping</span>
                  <p className="text-gray-600 leading-relaxed">Auto-code treatments in seconds.</p>
                </li>
                <li className="flex flex-col gap-2">
                  <span className="font-bold text-primary/80">Audit-Ready Reports</span>
                  <p className="text-gray-600 leading-relaxed">Generate CMS-compliant records instantly.</p>
                </li>
                <li className="flex flex-col gap-2">
                  <span className="font-bold text-primary/80">Real-Time Alerts</span>
                  <p className="text-gray-600 leading-relaxed">Block unauthorized treatments pre-service.</p>
                </li>
              </ul>
              <p className="font-bold text-primary border-t pt-6 mt-6">
                → Outcome: Zero coding mistakes + 100% compliant claims.
              </p>
            </div>
          </div>

          {/* Third Feature Box */}
          <div className="p-8 bg-white rounded-lg shadow-sm hover:shadow-lg transition-all duration-300 animate-fade-up [animation-delay:400ms]">
            <h3 className="text-2xl md:text-3xl font-bold text-primary mb-6 leading-tight">
              Get Paid 2x Faster with AI Automation
            </h3>
            <div className="text-gray-600 space-y-6">
              <p className="text-lg font-medium text-primary/90">
                Cut billing delays by 50% and predict payments.
              </p>
              <ul className="space-y-6">
                <li className="flex flex-col gap-2">
                  <span className="font-bold text-primary/80">1-Click Claims</span>
                  <p className="text-gray-600 leading-relaxed">Submit error-free claims in &lt;5 minutes.</p>
                </li>
                <li className="flex flex-col gap-2">
                  <span className="font-bold text-primary/80">Real-Time Tracking</span>
                  <p className="text-gray-600 leading-relaxed">Resolve rejections 80% faster.</p>
                </li>
                <li className="flex flex-col gap-2">
                  <span className="font-bold text-primary/80">Payment Forecasting</span>
                  <p className="text-gray-600 leading-relaxed">Predict cash flow with 95% accuracy.</p>
                </li>
              </ul>
              <p className="font-bold text-primary border-t pt-6 mt-6">
                → Outcome: Reduce AR days by 20+ + boost cash flow.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Features;
