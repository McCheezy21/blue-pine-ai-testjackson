
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, Users, FileText, Clock, Zap, Upload, Activity, DollarSign } from "lucide-react";
import { AutomationHistory } from "./AutomationHistory";
import { ProcessedCardsView } from "./ProcessedCardsView";
import { ChatInterface } from "./ChatInterface";
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

  // Trigger animation when metrics change
  useEffect(() => {
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
      change: "+12%",
      color: "bg-blue-500",
      onClick: () => setShowProcessedCards(true)
    },
    { 
      label: "Automations Run", 
      value: animatedAutomationsRun, 
      icon: Activity, 
      change: "+8%",
      color: "bg-green-500",
      onClick: () => onNavigate('automation')
    },
    { 
      label: "Claims Processed", 
      value: animatedClaimsProcessed, 
      icon: FileText, 
      change: "+15%",
      color: "bg-purple-500"
    },
    { 
      label: "Time Saved", 
      value: formatTimeSaved(animatedTimeSaved), 
      icon: Clock, 
      change: "+22%",
      color: "bg-orange-500"
    },
  ];

  const quickActions = [
    {
      title: "Upload Insurance Card",
      description: "Process new patient cards",
      icon: Upload,
      color: "bg-blue-500",
      action: () => onNavigate('insurance')
    },
    {
      title: "Run Automation",
      description: "Execute AI workflows",
      icon: Zap,
      color: "bg-green-500",
      action: () => onNavigate('automation')
    },
    {
      title: "View Reports",
      description: "Analytics and insights",
      icon: FileText,
      color: "bg-purple-500",
      action: () => onNavigate('services')
    }
  ];

  if (showProcessedCards) {
    return <ProcessedCardsView onBack={() => setShowProcessedCards(false)} />;
  }

  return (
    <div className="p-8 bg-gray-50 min-h-screen font-sans">
      {/* Welcome Header with Gradient */}
      <div className="mb-8 bg-gradient-to-r from-blue-600 to-blue-400 rounded-2xl p-8 text-white relative overflow-hidden">
        <div className="relative z-10">
          <h1 className="text-4xl font-bold mb-2 flex items-center gap-2">
            Hello, {user.firstName}
          </h1>
          <p className="text-blue-100 text-lg">
            Welcome back to your Blue Pine AI Automation Portal
          </p>
        </div>
        {/* Decorative circle */}
        <div className="absolute right-8 top-1/2 transform -translate-y-1/2 w-20 h-20 bg-white/20 rounded-full flex items-center justify-center">
          <Activity className="h-10 w-10 text-white" />
        </div>
      </div>

      {/* Chat Interface with input bar */}
      <ChatInterface showInputBar={true} />

      {/* Weekly Activity Overview */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Weekly Activity Overview</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {metrics.map((metric, index) => (
            <Card 
              key={index} 
              className={`hover:shadow-lg transition-all duration-300 bg-white border-0 shadow-sm ${
                metric.onClick ? 'cursor-pointer hover:scale-[1.02]' : ''
              } ${animateCounters ? 'animate-pulse' : ''}`}
              onClick={metric.onClick}
            >
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-3 rounded-lg ${metric.color}`}>
                    <metric.icon className="h-6 w-6 text-white" />
                  </div>
                  <span className={`text-green-600 text-sm font-medium flex items-center gap-1 transition-all duration-300 ${
                    animateCounters ? 'animate-bounce' : ''
                  }`}>
                    <TrendingUp className="h-3 w-3" />
                    {metric.change}
                  </span>
                </div>
                <div className="text-sm text-gray-600 mb-1">{metric.label}</div>
                <div className="text-2xl font-bold text-gray-900 transition-all duration-300">
                  {typeof metric.value === 'string' ? metric.value : metric.value.toLocaleString()}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {quickActions.map((action, index) => (
            <Card 
              key={index} 
              className="hover:shadow-lg transition-all duration-200 cursor-pointer hover:scale-[1.02] bg-white border-0 shadow-sm"
              onClick={action.action}
            >
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className={`p-4 rounded-xl ${action.color}`}>
                    <action.icon className="h-8 w-8 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 mb-1">{action.title}</h3>
                    <p className="text-gray-600 text-sm">{action.description}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Enhanced Automation History */}
      <AutomationHistory logs={automationLogs} />
    </div>
  );
};
