import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Zap, TrendingUp, DollarSign, FileText, Users, ArrowUpRight, Play, Cpu } from "lucide-react";
import { AutomationModal } from "./AutomationModal";
import { AutomationHistory } from "./AutomationHistory";
import { useAutomationData } from "@/hooks/useAutomationData";
import { useToast } from "@/hooks/use-toast";

interface AutomationFormData {
  patientName: string;
  patientId: string;
  facilityName: string;
  serviceDate: Date;
  providerName: string;
  automationNotes: string;
  automationType: string;
}

export const AutomationServices = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedAutomationType, setSelectedAutomationType] = useState("");
  const [isVisible, setIsVisible] = useState(false);
  const { automationLogs, createAutomationLog } = useAutomationData();
  const { toast } = useToast();

  useEffect(() => {
    setTimeout(() => setIsVisible(true), 100);
  }, []);

  const automationJobs = [
    {
      id: "patient-sourcing",
      title: "Patient Sourcing Claims",
      description: "Automatically identify and source potential patient claims from various data sources with AI-powered pattern analysis.",
      icon: Users,
      iconBg: "#004466"
    },
    {
      id: "revenue-cycle",
      title: "Revenue Cycle Automation",
      description: "Streamline billing, payment processing, and follow-up workflows. Reduces manual effort and improves cash flow significantly.",
      icon: TrendingUp,
      iconBg: "#004466"
    },
    {
      id: "debt-writeoffs",
      title: "Debt & Write-offs Automation",
      description: "Automatically manage debt collection and identify write-off eligible accounts based on compliance requirements.",
      icon: DollarSign,
      iconBg: "#004466"
    },
    {
      id: "medical-coder",
      title: "Medical Coder Automation",
      description: "AI-powered medical coding that automatically assigns appropriate codes to procedures and diagnoses with high accuracy.",
      icon: FileText,
      iconBg: "#004466"
    }
  ];

  const handleRunJob = (jobTitle: string) => {
    setSelectedAutomationType(jobTitle);
    setIsModalOpen(true);
  };

  const handleModalSubmit = async (data: AutomationFormData) => {
    try {
      await createAutomationLog(data);
      
      toast({
        title: "Automation Started",
        description: `${data.automationType} has been started successfully.`,
      });

      setIsModalOpen(false);
    } catch (error) {
      console.error('Error starting automation:', error);
    }
  };

  return (
    <div className="space-y-8">
      {/* Healthcare Header */}
      <div className={`transition-all duration-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-[#333333] mb-2">
              Automation Services
            </h1>
            <p className="text-[#333333]/70">Run automated workflows to streamline your healthcare operations and improve efficiency.</p>
          </div>
          <div className="flex items-center space-x-2 px-3 py-2 bg-[#3CB371]/10 rounded-lg border border-[#3CB371]/20">
            <Cpu className="w-4 h-4 text-[#3CB371]" />
            <span className="text-[#333333] font-medium text-sm">AI Powered</span>
          </div>
        </div>
      </div>

      {/* Clean Automation Cards */}
      <div className={`transition-all duration-500 delay-200 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {automationJobs.map((job, index) => (
            <div
              key={job.id}
              className="bg-white border border-[#CCCCCC] rounded-lg p-6 hover:shadow-lg transition-shadow duration-200"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {/* Header with icon */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-4">
                  <div 
                    className="w-12 h-12 rounded-lg flex items-center justify-center"
                    style={{ backgroundColor: job.iconBg }}
                  >
                    <job.icon className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-[#333333]">
                      {job.title}
                    </h3>
                  </div>
                </div>
              </div>

              {/* Description */}
              <p className="text-[#333333]/70 mb-6 leading-relaxed text-sm">
                {job.description}
              </p>

              {/* Clean Run Button */}
              <button
                onClick={() => handleRunJob(job.title)}
                className="w-full flex items-center justify-center space-x-2 py-3 px-4 bg-[#004466] text-white font-medium rounded-lg hover:bg-[#005580] transition-colors duration-200"
              >
                <Play className="h-4 w-4" />
                <span>Run {job.title.split(' ')[0]} Automation</span>
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Clean Automation History */}
      <div className={`transition-all duration-500 delay-400 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
        <AutomationHistory logs={automationLogs} />
      </div>

      <AutomationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        automationType={selectedAutomationType}
        onSubmit={handleModalSubmit}
      />
    </div>
  );
};
