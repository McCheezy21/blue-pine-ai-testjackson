
import { Bot, Brain, CheckCircle, TrendingUp, Clock, AlertCircle } from "lucide-react";
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

  return (
    <>
      {/* What Are AI Agents Section */}
      <section className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-start">
            <div>
              <h2 className="text-3xl font-bold text-primary mb-8">What Is an AI Agent?</h2>
              <div className="space-y-6 bg-white p-8 rounded-lg shadow-sm">
                <p className="text-lg text-gray-600">
                  AI agents are like having an extra team member who never sleeps, never makes mistakes, and handles all the tedious tasks you hate. They use artificial intelligence (AI) and machine learning (ML) to:
                </p>
                <ul className="space-y-4">
                  {["Automate repetitive tasks (e.g., coding, claims, denials).", "Learn and adapt to your facility's workflows.", "Work 24/7 to keep your revenue cycle running smoothly."].map((item, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <Bot className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
                      <span className="text-gray-600">{item}</span>
                    </li>
                  ))}
                </ul>
                <p className="text-lg font-semibold text-primary">
                  For skilled nursing facilities, AI agents are a game-changer—saving time, reducing errors, and boosting cash flow.
                </p>
              </div>
            </div>
            <div className="bg-accent p-8 rounded-lg shadow-sm">
              <Brain className="h-24 w-24 text-primary mx-auto mb-6" />
              <h3 className="text-2xl font-bold text-primary mb-4 text-center">
                Why AI Agents Are the Future
              </h3>
              <p className="text-gray-600 mb-6">
                As a building office manager or administrator, you're juggling a million things: staffing, patient care, compliance, and—let's be honest—endless paperwork. AI agents take the billing burden off your plate by:
              </p>
              <ul className="space-y-4">
                {["Eliminating Errors: No more missed codes or incorrect claims.", "Speeding Up Processes: File claims in minutes, not hours.", "Stopping Denials Before They Happen: Catch mistakes before payers do."].map((item, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <CheckCircle className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
                    <span className="text-gray-600">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Role Replacement Table */}
      <section className="py-16 bg-accent">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-primary mb-8">How AI Agents Simplify Your Workload</h2>
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <table className="w-full">
              <thead className="bg-primary text-white">
                <tr>
                  <th className="px-6 py-4 text-left">Traditional Role</th>
                  <th className="px-6 py-4 text-left">What They Do</th>
                  <th className="px-6 py-4 text-left">How AI Replaces It</th>
                </tr>
              </thead>
              <tbody>
                {roles.map((role, index) => (
                  <tr key={index} className="border-b border-gray-200 hover:bg-gray-50">
                    <td className="px-6 py-4 font-medium">{role.title}</td>
                    <td className="px-6 py-4 text-gray-600">{role.traditional}</td>
                    <td className="px-6 py-4 text-primary">{role.aiReplacement}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-lg font-semibold text-primary mt-6">Result: You save over 30% on labor costs while improving billing accuracy and speed.</p>
        </div>
      </section>

      {/* ROI Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-primary mb-8">AI Agent ROI for Skilled Nursing Facilities</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {roiPoints.map((point, index) => (
              <div key={index} className="bg-accent p-6 rounded-lg">
                <point.icon className="h-12 w-12 text-primary mb-4" />
                <h3 className="text-xl font-semibold text-primary mb-2">{point.title}</h3>
                <p className="text-gray-600">{point.description}</p>
              </div>
            ))}
          </div>
          <div className="mt-8 p-6 bg-primary text-white rounded-lg">
            <p className="text-lg">
              Example: [Client X], a 100-bed facility, reduced denials by 65% and recovered $250k in lost revenue within 90 days.
            </p>
          </div>
        </div>
      </section>

      {/* Why Now Section */}
      <section className="py-16 bg-accent">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-primary mb-8">Why Adopt AI Now?</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {["Staffing shortages are making it harder to keep up with billing and coding.", 
              "Payer rules are getting more complex (e.g., Medicare, Medicaid, private insurers).", 
              "Financial pressures are mounting, with 60% of skilled nursing facilities operating at a loss."
            ].map((challenge, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow-sm">
                <AlertCircle className="h-8 w-8 text-primary mb-4" />
                <p className="text-gray-600">{challenge}</p>
              </div>
            ))}
          </div>
          <p className="text-lg font-semibold text-primary mt-6">
            AI agents aren't just a nice-to-have—they're a must-have to stay competitive and financially healthy.
          </p>
        </div>
      </section>
    </>
  );
};

export default AIExplanationSection;
