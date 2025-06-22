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
  const [showModal, setShowModal] = useState(false);
  const [selectedAutomationType, setSelectedAutomationType] = useState("Revenue Cycle Automation");
  const [isVisible, setIsVisible] = useState(false);
  const { weeklyMetrics, automationLogs, isLoading, createAutomationLog } = useAutomationData();
  const { toast } = useToast();

  useEffect(() => {
    setTimeout(() => setIsVisible(true), 100);
  }, []);

  const handleAutomationSubmit = async (data: AutomationFormData) => {
    try {
      await createAutomationLog({
        patientName: data.patientName,
        patientId: data.patientId,
        facilityName: data.facilityName,
        serviceDate: data.serviceDate,
        providerName: data.providerName,
        automationNotes: data.automationNotes,
        automationType: data.automationType
      });

      toast({
        title: "Automation Completed",
        description: `${data.automationType} automation has been successfully processed for ${data.patientName}.`,
      });

      setShowModal(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to process automation. Please try again.",
        variant: "destructive",
      });
    }
  };

  const automationTypes = [
    {
      title: "Revenue Cycle Automation",
      description: "Automate billing, claims processing, and revenue optimization",
      icon: DollarSign,
      color: "#004466",
      features: ["Claims Processing", "Billing Automation", "Revenue Analytics", "Denial Management"]
    },
    {
      title: "Patient Data Processing",
      description: "Streamline patient information management and documentation",
      icon: FileText,
      color: "#004466",
      features: ["Data Entry", "Record Management", "Compliance Checks", "Documentation"]
    },
    {
      title: "Workflow Optimization",
      description: "Optimize healthcare workflows and operational efficiency",
      icon: Cpu,
      color: "#004466",
      features: ["Process Analysis", "Efficiency Metrics", "Task Automation", "Quality Assurance"]
    }
  ];

  const quickStats = [
    {
      label: "Automations This Week",
      value: weeklyMetrics.automations_run,
      icon: Zap,
      color: "#004466"
    },
    {
      label: "Time Saved",
      value: `${Math.floor(weeklyMetrics.time_saved_minutes / 60)}hr ${weeklyMetrics.time_saved_minutes % 60}min`,
      icon: TrendingUp,
      color: "#3CB371"
    },
    {
      label: "Active Workflows",
      value: "12",
      icon: Users,
      color: "#004466"
    }
  ];

  return (
    <div className="space-y-8 font-['Inter',system-ui,sans-serif]">
      {/* Header */}
      <div className={`transition-all duration-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-[#333333] mb-2">
              Automation Services
            </h1>
            <p className="text-[#333333]/70">AI-powered healthcare workflow automation and optimization</p>
          </div>
          <Button 
            onClick={() => setShowModal(true)}
            className="bg-[#004466] hover:bg-[#005580] text-white"
          >
            <Play className="h-4 w-4 mr-2" />
            Run Automation
          </Button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className={`transition-all duration-500 delay-100 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {quickStats.map((stat, index) => (
            <div key={index} className="bg-white border border-[#CCCCCC] rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <div 
                  className="w-10 h-10 rounded-lg flex items-center justify-center"
                  style={{ backgroundColor: stat.color }}
                >
                  <stat.icon className="h-5 w-5 text-white" />
                </div>
              </div>
              <div className="space-y-2">
                <p className="text-[#333333]/70 text-sm font-medium">{stat.label}</p>
                <div className="text-2xl font-semibold text-[#333333]">{stat.value}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Automation Types */}
      <div className={`transition-all duration-500 delay-200 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-[#333333] mb-2">
            Available Automation Services
          </h2>
          <p className="text-[#333333]/70">Choose from our comprehensive suite of healthcare automation tools</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {automationTypes.map((automation, index) => (
            <div key={index} className="bg-white border border-[#CCCCCC] rounded-lg p-6 hover:border-[#004466] hover:shadow-md transition-all duration-200 group">
              <div className="flex items-center justify-between mb-4">
                <div 
                  className="w-12 h-12 rounded-lg flex items-center justify-center"
                  style={{ backgroundColor: automation.color }}
                >
                  <automation.icon className="h-6 w-6 text-white" />
                </div>
                <ArrowUpRight className="h-4 w-4 text-[#333333]/40 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
              </div>

              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-[#333333] group-hover:text-[#004466] transition-colors duration-200">
                    {automation.title}
                  </h3>
                  <p className="text-sm text-[#333333]/70 mt-1">
                    {automation.description}
                  </p>
                </div>

                <div className="space-y-2">
                  <p className="text-xs font-medium text-[#333333]/60 uppercase tracking-wide">Features</p>
                  <ul className="space-y-1">
                    {automation.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="text-sm text-[#333333]/70 flex items-center">
                        <div className="w-1 h-1 bg-[#004466] rounded-full mr-2" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>

                <Button 
                  onClick={() => setShowModal(true)}
                  className="w-full bg-[#EAEFF2] text-[#004466] hover:bg-[#004466] hover:text-white border-0 transition-all duration-200"
                >
                  Configure Automation
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Activity */}
      <div className={`transition-all duration-500 delay-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-[#333333] mb-2">
            Recent Automation History
          </h2>
          <p className="text-[#333333]/70">Track your recent automation runs and their performance</p>
        </div>

        <div className="bg-white border border-[#CCCCCC] rounded-lg">
          <AutomationHistory logs={automationLogs} />
        </div>
      </div>

      <AutomationModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        automationType={selectedAutomationType}
        onSubmit={handleAutomationSubmit}
      />
    </div>
  );
};
