
import { Brain, CheckCircle, TrendingUp, Clock, AlertCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "./ui/button";

const AIExplanationSection = () => {
  const navigate = useNavigate();
  const roles = [{
    title: "Medical Coder",
    traditional: "Spend hours assigning codes",
    aiReplacement: "AI auto-codes treatments with 99% accuracy in seconds."
  }, {
    title: "Billing Specialist",
    traditional: "File claims, track submissions",
    aiReplacement: "AI auto-files claims in <5 mins and tracks them in real time."
  }, {
    title: "Denial Manager",
    traditional: "Investigate + appeal denied claims",
    aiReplacement: "AI predicts denials upfront and auto-generates appeals."
  }, {
    title: "Compliance Officer",
    traditional: "Ensure adherence to CMS/payer rules",
    aiReplacement: "AI flags unauthorized treatments and ensures 100% compliance."
  }, {
    title: "AR Specialist",
    traditional: "Follow up on unpaid claims",
    aiReplacement: "AI predicts payment dates and auto-follows up with payers."
  }];
  const roiPoints = [{
    icon: CheckCircle,
    title: "Reduce Claim Denials",
    description: "Cut denials by 50–70% with AI-powered audits and pre-submission checks."
  }, {
    icon: TrendingUp,
    title: "Accelerate Cash Flow",
    description: "Get paid 20+ days faster with automated claim submissions and denial resolutions."
  }, {
    icon: Clock,
    title: "Lower Labor Costs",
    description: "Replace multiple FTEs with one AI agent, saving $100k+ annually."
  }, {
    icon: AlertCircle,
    title: "Boost Revenue",
    description: "Recover 5–15% more revenue from underpaid or denied claims."
  }];
  return <>
      {/* What Are AI Agents Section */}
      <section className="bg-white py-8 md:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-start">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-primary mb-6">What Is an AI Agent?</h2>
              <div className="space-y-4 md:space-y-6 bg-white p-6 md:p-8 rounded-lg shadow-sm">
                <p className="text-base md:text-lg text-gray-600">
                  AI agents are like having an extra team member who never sleeps, never makes mistakes, and handles all the tedious tasks you hate. They use artificial intelligence (AI) and machine learning (ML) to:
                </p>
                <ul className="space-y-3 list-disc pl-5">
                  {["Automate repetitive tasks (e.g., coding, claims, denials).", "Learn and adapt to your facility's workflows.", "Work 24/7 to keep your revenue cycle running smoothly."].map((item, index) => <li key={index} className="text-gray-600">
                      {item}
                    </li>)}
                </ul>
                <p className="text-base md:text-lg font-semibold text-primary">
                  For skilled nursing facilities, AI agents are a game-changer—saving time, reducing errors, and boosting cash flow.
                </p>
              </div>
            </div>
            <div className="bg-accent p-6 md:p-8 rounded-lg shadow-sm">
              <Brain className="h-16 md:h-24 w-16 md:w-24 text-primary mx-auto mb-6" />
              <h3 className="text-xl md:text-2xl font-bold text-primary mb-4 text-center">
                Why AI Agents Are the Future
              </h3>
              <p className="text-gray-600 mb-6 text-base md:text-lg">
                As a building office manager or administrator, you're juggling a million things: staffing, patient care, compliance, and—let's be honest—endless paperwork. AI agents take the billing burden off your plate by:
              </p>
              <ul className="space-y-4">
                {["Eliminate Errors: No more missed codes or incorrect claims.", "Speed Up Processes: File claims in minutes, not hours.", "Stop Denials Before They Happen: Catch mistakes before payers do."].map((item, index) => <li key={index} className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 md:h-6 md:w-6 text-primary flex-shrink-0 mt-1" />
                    <span className="text-gray-600">{item}</span>
                  </li>)}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Role Replacement Table */}
      <section className="py-8 md:py-16 bg-accent overflow-x-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl md:text-3xl font-bold text-primary mb-6">How AI Agents Simplify Your Workload</h2>
          <div className="bg-white rounded-lg shadow-lg overflow-hidden min-w-[768px]">
            <table className="w-full">
              <thead className="bg-primary text-white">
                <tr>
                  <th className="px-4 md:px-6 py-3 md:py-4 text-left">Traditional Role</th>
                  <th className="px-4 md:px-6 py-3 md:py-4 text-left">What They Do</th>
                  <th className="px-4 md:px-6 py-3 md:py-4 text-left">How AI Replaces It</th>
                </tr>
              </thead>
              <tbody>
                {roles.map((role, index) => <tr key={index} className="border-b border-gray-200 hover:bg-gray-50">
                    <td className="px-4 md:px-6 py-3 md:py-4 font-medium">{role.title}</td>
                    <td className="px-4 md:px-6 py-3 md:py-4 text-gray-600">{role.traditional}</td>
                    <td className="px-4 md:px-6 py-3 md:py-4 text-primary">{role.aiReplacement}</td>
                  </tr>)}
              </tbody>
            </table>
          </div>
          <p className="text-base md:text-lg font-semibold text-primary mt-4 md:mt-6">Result: You save over 30% on labor costs while improving billing accuracy and speed.</p>
        </div>
      </section>

      {/* ROI Section */}
      <section className="py-8 md:py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl md:text-3xl font-bold text-primary mb-6">AI Agent ROI for Skilled Nursing Facilities</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {roiPoints.map((point, index) => <div key={index} className="bg-accent p-5 md:p-6 rounded-lg">
                <point.icon className="h-10 w-10 md:h-12 md:w-12 text-primary mb-4" />
                <h3 className="text-lg md:text-xl font-semibold text-primary mb-2">{point.title}</h3>
                <p className="text-gray-600 text-sm md:text-base">{point.description}</p>
              </div>)}
          </div>
          <div className="mt-6 md:mt-8 p-4 md:p-6 bg-primary text-white rounded-lg">
            <p className="text-base md:text-lg">Our clients have seen ROI in 90 days or less</p>
          </div>
        </div>
      </section>

      {/* Why Now Section */}
      <section className="py-8 md:py-16 bg-accent">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl md:text-3xl font-bold text-primary mb-6">Why Adopt AI Now?</h2>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
            {["Staffing shortages are making it harder to keep up with billing and coding.", "Payer rules are getting more complex (e.g., Medicare, Medicaid, private insurers).", "Financial pressures are mounting, with 60% of skilled nursing facilities operating at a loss."].map((challenge, index) => <div key={index} className="bg-white p-5 md:p-6 rounded-lg shadow-sm">
                <AlertCircle className="h-6 w-6 md:h-8 md:w-8 text-primary mb-3 md:mb-4" />
                <p className="text-gray-600 text-sm md:text-base">{challenge}</p>
              </div>)}
          </div>
          <p className="text-base md:text-lg font-semibold text-primary mt-4 md:mt-6">
            AI agents aren't just a nice-to-have—they're a must-have to stay competitive and financially healthy.
          </p>
        </div>
      </section>
    </>;
};

export default AIExplanationSection;
