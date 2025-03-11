
import { DollarSign, TrendingUp, AlertTriangle } from "lucide-react";

const RevenueChallenges = () => {
  const challenges = [
    {
      icon: TrendingUp,
      title: "Increase Revenue & Maximize Payments",
      challenge: "Underpayments, missed billing opportunities, and claim errors reduce total revenue.",
      solution: "AI-driven accuracy identifies and recovers lost revenue while preventing errors.",
      outcome: "5-10% increase in revenue recovery per facility."
    },
    {
      icon: AlertTriangle,
      title: "Reduce Bad Debt & Write-Offs",
      challenge: "High denial rates lead to increased write-offs and lost reimbursements.",
      solution: "AI automates denial recovery, ensures proper coding, and reduces claim errors.",
      outcome: "30-50% fewer denials and a significant reduction in bad debt."
    },
    {
      icon: DollarSign,
      title: "💰 Cut Costs & Scale Efficiently",
      challenge: "🔹 Rising labor costs and inefficient workflows drain operational budgets.",
      solution: "🔹 AI replaces repetitive tasks, optimizes staff workflows, and prevents unauthorized treatments.",
      outcome: "🔹 Outcome: 20-40% reduction in staffing costs and overhead."
    }
  ];

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {challenges.map((item, index) => (
            <div 
              key={index} 
              className="bg-accent p-8 rounded-lg shadow-sm hover:shadow-lg transition-all duration-300 animate-fade-up"
              style={{ animationDelay: `${index * 200}ms` }}
            >
              <div className="flex items-center gap-3 mb-4">
                <item.icon className="h-8 w-8 text-primary" />
                <h3 className="text-xl font-bold text-primary">{item.title}</h3>
              </div>
              
              <div className="space-y-4">
                <div>
                  <p className="font-semibold text-primary/80">Challenge:</p>
                  <p className="text-gray-600">{item.challenge}</p>
                </div>
                
                <div>
                  <p className="font-semibold text-primary/80">Solution:</p>
                  <p className="text-gray-600">{item.solution}</p>
                </div>
                
                <div>
                  <p className="font-semibold text-primary/80">Outcome:</p>
                  <p className="text-gray-600">{item.outcome}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default RevenueChallenges;
