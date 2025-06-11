import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Zap, TrendingUp, DollarSign, FileText, Users, ArrowUpRight, Play, Sparkles } from "lucide-react";
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
      gradient: "from-blue-500 to-blue-600",
      bgGradient: "from-blue-50/30 via-white to-blue-50/20",
      accentColor: "text-blue-600"
    },
    {
      id: "revenue-cycle",
      title: "Revenue Cycle Automation",
      description: "Streamline billing, payment processing, and follow-up workflows. Reduces manual effort and improves cash flow significantly.",
      icon: TrendingUp,
      gradient: "from-emerald-500 to-emerald-600",
      bgGradient: "from-emerald-50/30 via-white to-emerald-50/20",
      accentColor: "text-emerald-600"
    },
    {
      id: "debt-writeoffs",
      title: "Debt & Write-offs Automation",
      description: "Automatically manage debt collection and identify write-off eligible accounts based on compliance requirements.",
      icon: DollarSign,
      gradient: "from-amber-500 to-amber-600",
      bgGradient: "from-amber-50/30 via-white to-amber-50/20",
      accentColor: "text-amber-600"
    },
    {
      id: "medical-coder",
      title: "Medical Coder Automation",
      description: "AI-powered medical coding that automatically assigns appropriate codes to procedures and diagnoses with high accuracy.",
      icon: FileText,
      gradient: "from-purple-500 to-purple-600",
      bgGradient: "from-purple-50/30 via-white to-purple-50/20",
      accentColor: "text-purple-600"
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
      {/* Apple-inspired Header */}
      <div className={`transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-900 via-blue-900 to-slate-800 bg-clip-text text-transparent">
              Automation Services
            </h1>
            <p className="text-slate-600 mt-2">Run automated workflows to streamline your healthcare operations and improve efficiency.</p>
          </div>
          <div className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-emerald-50 to-blue-50 rounded-full border border-emerald-100/50">
            <Sparkles className="w-4 h-4 text-emerald-600" />
            <span className="text-emerald-700 font-medium text-sm">AI Powered</span>
          </div>
        </div>
      </div>

      {/* Apple-inspired Automation Cards */}
      <div className={`transition-all duration-700 delay-200 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {automationJobs.map((job, index) => (
            <div
              key={job.id}
              className={`relative overflow-hidden bg-gradient-to-br ${job.bgGradient} backdrop-blur-sm border border-slate-200/50 rounded-2xl transition-all duration-500 hover:scale-[1.02] hover:shadow-xl group`}
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {/* Floating background elements */}
              <div className="absolute -top-4 -right-4 w-24 h-24 bg-gradient-to-br from-white/10 to-transparent rounded-full blur-2xl"></div>
              <div className="absolute -bottom-4 -left-4 w-20 h-20 bg-gradient-to-br from-slate-100/20 to-transparent rounded-full blur-2xl"></div>
              
              <div className="relative p-6">
                {/* Header with icon */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-4">
                    <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${job.gradient} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                      <job.icon className="h-7 w-7 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-slate-900 group-hover:text-slate-800 transition-colors duration-200">
                        {job.title}
                      </h3>
                    </div>
                  </div>
                  <ArrowUpRight className="h-5 w-5 text-slate-400 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-1 -translate-y-1 group-hover:translate-x-0 group-hover:translate-y-0" />
                </div>

                {/* Description */}
                <p className="text-slate-600 mb-6 leading-relaxed">
                  {job.description}
                </p>

                {/* Apple-style Run Button */}
                <button
                  onClick={() => handleRunJob(job.title)}
                  className={`w-full flex items-center justify-center space-x-2 py-3 px-4 bg-gradient-to-r ${job.gradient} text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] group/button`}
                >
                  <Play className="h-4 w-4 transition-transform duration-300 group-hover/button:scale-110" />
                  <span>Run {job.title.split(' ')[0]} Automation</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Apple-inspired Automation History */}
      <div className={`transition-all duration-700 delay-400 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
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
