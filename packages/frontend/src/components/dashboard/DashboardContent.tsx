import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, Users, FileText, Clock, Zap, Upload, Activity, DollarSign, ArrowUpRight } from "lucide-react";
import { AutomationHistory } from "./AutomationHistory";
import { ProcessedCardsView } from "./ProcessedCardsView";
import { useAnimatedCounter } from "@/hooks/useAnimatedCounter";
import { useAutomationData } from "@/hooks/useAutomationData";

interface User {
  firstName: string;
  lastName: string;
  email: string;
}

interface DashboardContentProps {
  user: User;
  onNavigate: (view: string) => void;
}

export const DashboardContent = ({ user, onNavigate }: DashboardContentProps) => {
  const [showProcessedCards, setShowProcessedCards] = useState(false);
  const [animateCounters, setAnimateCounters] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  
  const { weeklyMetrics, automationLogs, isLoading } = useAutomationData();

  // Animated counter values
  const animatedCardsProcessed = useAnimatedCounter({ 
    targetValue: weeklyMetrics.cards_processed, 
    startAnimation: animateCounters 
  });
  const animatedAutomationsRun = useAnimatedCounter({ 
    targetValue: weeklyMetrics.automations_run, 
    startAnimation: animateCounters 
  });
  const animatedClaimsProcessed = useAnimatedCounter({ 
    targetValue: weeklyMetrics.claims_processed, 
    startAnimation: animateCounters 
  });
  const animatedTimeSaved = useAnimatedCounter({ 
    targetValue: weeklyMetrics.time_saved_minutes, 
    startAnimation: animateCounters 
  });

  // Format time saved as hours and minutes
  const formatTimeSaved = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    if (hours === 0) return `${remainingMinutes}min`;
    if (remainingMinutes === 0) return `${hours}hr`;
    return `${hours}hr ${remainingMinutes}min`;
  };

  // Trigger animations
  useEffect(() => {
    setIsVisible(true);
    if (!isLoading) {
      setAnimateCounters(true);
      const timer = setTimeout(() => setAnimateCounters(false), 1200);
      return () => clearTimeout(timer);
    }
  }, [weeklyMetrics, isLoading]);

  const metrics = [
    { 
      label: "Cards Processed", 
      value: animatedCardsProcessed, 
      icon: Upload, 
      onClick: () => setShowProcessedCards(true)
    },
    { 
      label: "Automations Run", 
      value: animatedAutomationsRun, 
      icon: Activity, 
      onClick: () => onNavigate('automation')
    },
    { 
      label: "Claims Processed", 
      value: animatedClaimsProcessed, 
      icon: FileText
    },
    { 
      label: "Time Saved", 
      value: formatTimeSaved(animatedTimeSaved), 
      icon: Clock
    },
  ];

  const quickActions = [
    {
      title: "Upload Insurance Card",
      description: "Process new patient cards with AI",
      icon: Upload,
      action: () => onNavigate('insurance')
    },
    {
      title: "Run Automation",
      description: "Execute intelligent workflows",
      icon: Zap,
      action: () => onNavigate('automation')
    },
    {
      title: "View Analytics",
      description: "Insights and performance data",
      icon: TrendingUp,
      action: () => onNavigate('services')
    }
  ];

  if (showProcessedCards) {
    return <ProcessedCardsView onBack={() => setShowProcessedCards(false)} />;
  }

  return (
    <div className="space-y-8 font-['Inter',system-ui,sans-serif]">
      {/* Weekly Performance Metrics */}
      <div className={`transition-all duration-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-[#333333] mb-2">
            Weekly Performance
          </h2>
          <p className="text-[#333333]/70">Your automation metrics overview</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {metrics.map((metric, index) => (
            <div
              key={index}
              className={`bg-white border border-[#CCCCCC] rounded-lg p-6 hover:shadow-md transition-all duration-200 ${
                metric.onClick ? 'cursor-pointer hover:border-[#004466]' : ''
              }`}
              onClick={metric.onClick}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 bg-[#004466] rounded-lg flex items-center justify-center">
                  <metric.icon className="h-5 w-5 text-white" />
                </div>
              </div>
              
              <div className="space-y-2">
                <p className="text-[#333333]/70 text-sm font-medium">{metric.label}</p>
                <div className="text-2xl font-semibold text-[#333333]">
                  {typeof metric.value === 'string' ? metric.value : metric.value.toLocaleString()}
                </div>
              </div>

              {/* Hover arrow */}
              {metric.onClick && (
                <ArrowUpRight className="absolute top-4 right-4 h-4 w-4 text-[#333333]/40 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className={`transition-all duration-500 delay-200 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-[#333333] mb-2">
            Quick Actions
          </h2>
          <p className="text-[#333333]/70">Access your most common tasks</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {quickActions.map((action, index) => (
            <button
              key={index}
              onClick={action.action}
              className="text-left bg-white border border-[#CCCCCC] rounded-lg p-6 hover:border-[#004466] hover:shadow-md transition-all duration-200 group"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-[#EAEFF2] rounded-lg flex items-center justify-center group-hover:bg-[#004466] transition-colors duration-200">
                  <action.icon className="h-6 w-6 text-[#333333] group-hover:text-white transition-colors duration-200" />
                </div>
                <ArrowUpRight className="h-4 w-4 text-[#333333]/40 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
              </div>
              
              <div className="space-y-2">
                <h3 className="font-semibold text-[#333333] group-hover:text-[#004466] transition-colors duration-200">
                  {action.title}
                </h3>
                <p className="text-sm text-[#333333]/70">
                  {action.description}
                </p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Recent Activity */}
      <div className={`transition-all duration-500 delay-400 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-[#333333] mb-2">
            Recent Activity
          </h2>
          <p className="text-[#333333]/70">Latest automation runs and updates</p>
        </div>
        
        <div className="bg-white border border-[#CCCCCC] rounded-lg">
          <AutomationHistory logs={automationLogs.slice(0, 5)} />
        </div>
      </div>
    </div>
  );
};
