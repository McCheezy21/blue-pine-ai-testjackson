
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Zap, TrendingUp, DollarSign, FileText, Users } from "lucide-react";
import { AutomationModal } from "./AutomationModal";
import { AutomationHistory } from "./AutomationHistory";

interface AutomationFormData {
  patientName: string;
  patientId: string;
  facilityName: string;
  serviceDate: Date;
  providerName: string;
  automationNotes: string;
  automationType: string;
}

interface AutomationLog {
  id: string;
  title: string;
  status: 'completed' | 'running' | 'failed';
  timestamp: Date;
  duration?: string;
  details?: string;
}

export const AutomationServices = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedAutomationType, setSelectedAutomationType] = useState("");
  const [automationLogs, setAutomationLogs] = useState<AutomationLog[]>([]);

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

  const handleRunJob = (jobTitle: string) => {
    setSelectedAutomationType(jobTitle);
    setIsModalOpen(true);
  };

  const handleModalSubmit = async (data: AutomationFormData) => {
    const newLog: AutomationLog = {
      id: `log-${Date.now()}`,
      title: data.automationType,
      status: 'running',
      timestamp: new Date(),
    };

    // Add new log to the beginning of the array
    setAutomationLogs(prev => [newLog, ...prev]);

    // Simulate automation process
    setTimeout(() => {
      setAutomationLogs(prev => 
        prev.map(log => 
          log.id === newLog.id 
            ? { 
                ...log, 
                status: 'completed' as const, 
                duration: `${Math.floor(Math.random() * 5) + 1}m ${Math.floor(Math.random() * 60)}s`,
                timestamp: new Date()
              }
            : log
        )
      );
    }, Math.random() * 30000 + 10000); // Random duration between 10-40 seconds

    console.log(`Running automation: ${data.automationType}`, data);
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
    <div className="p-8 font-sans">
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
                onClick={() => handleRunJob(job.title)}
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

      <AutomationHistory logs={automationLogs} />

      <AutomationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        automationType={selectedAutomationType}
        onSubmit={handleModalSubmit}
      />
    </div>
  );
};
