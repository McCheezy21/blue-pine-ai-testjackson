
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Zap, TrendingUp, DollarSign, FileText, Users } from "lucide-react";

export const AutomationServices = () => {
  const automationJobs = [
    {
      id: "patient-sourcing",
      title: "Patient Sourcing Claims",
      description: "Automatically identify and source potential patient claims from various data sources. This service analyzes patterns and matches patient information to optimize claim processing.",
      icon: Users,
      color: "blue"
    },
    {
      id: "revenue-cycle",
      title: "Revenue Cycle Automation",
      description: "Streamline your revenue cycle management with automated billing, payment processing, and follow-up workflows. Reduces manual effort and improves cash flow.",
      icon: TrendingUp,
      color: "green"
    },
    {
      id: "debt-writeoffs",
      title: "Debt & Write-offs Automation",
      description: "Automatically manage debt collection processes and identify accounts eligible for write-offs based on predefined criteria and compliance requirements.",
      icon: DollarSign,
      color: "red"
    },
    {
      id: "medical-coder",
      title: "Medical Coder Automation",
      description: "AI-powered medical coding that automatically assigns appropriate codes to medical procedures and diagnoses, ensuring accuracy and compliance.",
      icon: FileText,
      color: "purple"
    }
  ];

  const handleRunJob = (jobId: string) => {
    console.log(`Running automation job: ${jobId}`);
    // TODO: Implement actual job triggering logic
  };

  const getColorClasses = (color: string) => {
    const colorMap = {
      blue: "bg-blue-50 hover:bg-blue-100 text-blue-700 border-blue-200",
      green: "bg-green-50 hover:bg-green-100 text-green-700 border-green-200",
      red: "bg-red-50 hover:bg-red-100 text-red-700 border-red-200",
      purple: "bg-purple-50 hover:bg-purple-100 text-purple-700 border-purple-200"
    };
    return colorMap[color as keyof typeof colorMap] || colorMap.blue;
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Automation Services</h1>
        <p className="text-gray-600">Run automated workflows to streamline your healthcare operations and improve efficiency.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {automationJobs.map((job) => (
          <Card key={job.id} className="hover:shadow-md transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${getColorClasses(job.color)}`}>
                  <job.icon className="h-5 w-5" />
                </div>
                {job.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">{job.description}</p>
              <Button 
                onClick={() => handleRunJob(job.id)}
                className="w-full"
                variant="outline"
              >
                <Zap className="h-4 w-4 mr-2" />
                Run {job.title}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Automation History</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex justify-between items-center py-2 border-b">
              <div>
                <span className="font-medium">Revenue Cycle Automation</span>
                <span className="text-sm text-green-600 ml-2">Completed</span>
              </div>
              <span className="text-sm text-gray-500">2 hours ago</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b">
              <div>
                <span className="font-medium">Patient Sourcing Claims</span>
                <span className="text-sm text-blue-600 ml-2">Running</span>
              </div>
              <span className="text-sm text-gray-500">30 minutes ago</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b">
              <div>
                <span className="font-medium">Medical Coder Automation</span>
                <span className="text-sm text-green-600 ml-2">Completed</span>
              </div>
              <span className="text-sm text-gray-500">4 hours ago</span>
            </div>
            <div className="flex justify-between items-center py-2">
              <div>
                <span className="font-medium">Debt & Write-offs Automation</span>
                <span className="text-sm text-green-600 ml-2">Completed</span>
              </div>
              <span className="text-sm text-gray-500">1 day ago</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
