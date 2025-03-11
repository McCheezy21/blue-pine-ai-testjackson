import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
const Features = () => {
  return <section className="relative py-12 bg-accent -mt-32 font-sans">
      <div className="absolute inset-x-0 -top-32 h-32 bg-gradient-to-b from-transparent to-accent pointer-events-none" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Revenue & Payments Card */}
          <Card className="border-none shadow-lg hover:shadow-xl transition-all duration-300 animate-fade-up overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-primary/10 to-primary/5 pb-2">
              <CardTitle className="text-xl md:text-2xl font-bold text-primary">
                Increase Revenue & Maximize Payments
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4 space-y-4">
              <div className="space-y-1">
                <h4 className="font-semibold text-gray-800 text-base">Challenge:</h4>
                <p className="text-gray-600 text-base">
                  Underpayments, missed billing opportunities, and claim errors reduce total revenue.
                </p>
              </div>
              <div className="space-y-1">
                <h4 className="font-semibold text-gray-800 text-base">Solution:</h4>
                <p className="text-gray-600 text-base">
                  AI-driven accuracy identifies and recovers lost revenue while preventing errors.
                </p>
              </div>
              <div className="bg-primary/5 p-3 rounded-lg">
                <h4 className="font-semibold text-primary text-base">Outcome:</h4>
                <p className="text-primary font-medium text-base">
                  5-10% increase in revenue recovery per facility.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Bad Debt Card */}
          <Card className="border-none shadow-lg hover:shadow-xl transition-all duration-300 animate-fade-up [animation-delay:200ms] overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-primary/10 to-primary/5 pb-2">
              <CardTitle className="text-xl md:text-2xl font-bold text-primary">
                Reduce Bad Debt & Write-Offs
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4 space-y-4">
              <div className="space-y-1">
                <h4 className="font-semibold text-gray-800 text-base">Challenge:</h4>
                <p className="text-gray-600 text-base">
                  High denial rates lead to increased write-offs and lost reimbursements.
                </p>
              </div>
              <div className="space-y-1">
                <h4 className="font-semibold text-gray-800 text-base">Solution:</h4>
                <p className="text-gray-600 text-base">
                  AI automates denial recovery, ensures proper coding, and reduces claim errors.
                </p>
              </div>
              <div className="bg-primary/5 p-3 rounded-lg">
                <h4 className="font-semibold text-primary text-base">Outcome:</h4>
                <p className="text-primary font-medium text-base">
                  30-50% fewer denials and a significant reduction in bad debt.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Cost Efficiency Card */}
          <Card className="border-none shadow-lg hover:shadow-xl transition-all duration-300 animate-fade-up [animation-delay:400ms] overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-primary/10 to-primary/5 pb-2">
              <CardTitle className="text-xl md:text-2xl font-bold text-primary">
                Cut Costs & Scale Efficiently
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4 space-y-4">
              <div className="space-y-1">
                <h4 className="font-semibold text-gray-800 text-base">Challenge:</h4>
                <p className="text-gray-600 text-base">
                  Rising labor costs and inefficient workflows drain operational budgets.
                </p>
              </div>
              <div className="space-y-1">
                <h4 className="font-semibold text-gray-800 text-base">Solution:</h4>
                <p className="text-gray-600 text-base">
                  AI replaces repetitive tasks, optimizes staff workflows, and prevents unauthorized treatments.
                </p>
              </div>
              <div className="bg-primary/5 p-3 rounded-lg">
                <h4 className="font-semibold text-primary text-base">Outcome:</h4>
                <p className="text-primary font-medium text-base">20+% reduction in staffing costs and overhead.</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>;
};
export default Features;