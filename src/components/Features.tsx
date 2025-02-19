
const Features = () => {
  return (
    <section className="relative py-12 bg-accent -mt-32">
      <div className="absolute inset-x-0 -top-32 h-32 bg-gradient-to-b from-transparent to-accent pointer-events-none" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* First Feature Box */}
          <div className="p-6 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow animate-fade-up">
            <h3 className="text-2xl font-bold text-primary mb-4">
              Slash Claim Denials by 70% with AI
            </h3>
            <div className="text-gray-600 space-y-4">
              <p className="mb-4 font-medium">
                Stop losing revenue to preventable errors.
              </p>
              <ul className="space-y-4 mb-4">
                <li className="flex flex-col gap-1">
                  <span className="font-semibold">Auto-Audit Documentation:</span>
                  Flag missing/mismatched codes (ICD-10, CPT) in real time.
                </li>
                <li className="flex flex-col gap-1">
                  <span className="font-semibold">Predict Denials Upfront:</span>
                  Leverage payer-specific rules + historical data.
                </li>
                <li className="flex flex-col gap-1">
                  <span className="font-semibold">Guarantee Compliance:</span>
                  Align treatments with pre-authorizations.
                </li>
              </ul>
              <p className="font-semibold text-primary border-t pt-4">
                → Outcome: Reduce denials by 70% + accelerate reimbursements.
              </p>
            </div>
          </div>

          {/* Second Feature Box */}
          <div className="p-6 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow animate-fade-up [animation-delay:200ms]">
            <h3 className="text-2xl font-bold text-primary mb-4">
              Eliminate Coding Errors Automatically
            </h3>
            <div className="text-gray-600 space-y-4">
              <p className="mb-4 font-medium">
                AI ensures 100% accurate billing every time.
              </p>
              <ul className="space-y-4 mb-4">
                <li className="flex flex-col gap-1">
                  <span className="font-semibold">Instant CPT/ICD-10 Mapping:</span>
                  Auto-code treatments in seconds.
                </li>
                <li className="flex flex-col gap-1">
                  <span className="font-semibold">Audit-Ready Reports:</span>
                  Generate CMS-compliant records instantly.
                </li>
                <li className="flex flex-col gap-1">
                  <span className="font-semibold">Real-Time Alerts:</span>
                  Block unauthorized treatments pre-service.
                </li>
              </ul>
              <p className="font-semibold text-primary border-t pt-4">
                → Outcome: Zero coding mistakes + 100% compliant claims.
              </p>
            </div>
          </div>

          {/* Third Feature Box */}
          <div className="p-6 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow animate-fade-up [animation-delay:400ms]">
            <h3 className="text-2xl font-bold text-primary mb-4">
              Get Paid 2x Faster with AI Automation
            </h3>
            <div className="text-gray-600 space-y-4">
              <p className="mb-4 font-medium">
                Cut billing delays by 50% and predict payments.
              </p>
              <ul className="space-y-4 mb-4">
                <li className="flex flex-col gap-1">
                  <span className="font-semibold">1-Click Claims:</span>
                  Submit error-free claims in &lt;5 minutes.
                </li>
                <li className="flex flex-col gap-1">
                  <span className="font-semibold">Real-Time Tracking:</span>
                  Resolve rejections 80% faster.
                </li>
                <li className="flex flex-col gap-1">
                  <span className="font-semibold">Payment Forecasting:</span>
                  Predict cash flow with 95% accuracy.
                </li>
              </ul>
              <p className="font-semibold text-primary border-t pt-4">
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
