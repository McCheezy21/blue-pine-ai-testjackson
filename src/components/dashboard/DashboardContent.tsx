import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, Users, FileText, Clock, Zap, Upload, Activity, DollarSign, ArrowUpRight, Sparkles } from "lucide-react";
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
      change: "+12%",
      gradient: "from-blue-500 to-blue-600",
      bgGradient: "from-blue-50/50 via-white to-blue-50/30",
      onClick: () => setShowProcessedCards(true)
    },
    { 
      label: "Automations Run", 
      value: animatedAutomationsRun, 
      icon: Activity, 
      change: "+8%",
      gradient: "from-emerald-500 to-emerald-600",
      bgGradient: "from-emerald-50/50 via-white to-emerald-50/30",
      onClick: () => onNavigate('automation')
    },
    { 
      label: "Claims Processed", 
      value: animatedClaimsProcessed, 
      icon: FileText, 
      change: "+15%",
      gradient: "from-purple-500 to-purple-600",
      bgGradient: "from-purple-50/50 via-white to-purple-50/30"
    },
    { 
      label: "Time Saved", 
      value: formatTimeSaved(animatedTimeSaved), 
      icon: Clock, 
      change: "+22%",
      gradient: "from-amber-500 to-amber-600",
      bgGradient: "from-amber-50/50 via-white to-amber-50/30"
    },
  ];

  const quickActions = [
    {
      title: "Upload Insurance Card",
      description: "Process new patient cards with AI",
      icon: Upload,
      gradient: "from-blue-500 to-blue-600",
      bgGradient: "from-blue-50/30 via-white to-blue-50/20",
      action: () => onNavigate('insurance')
    },
    {
      title: "Run Automation",
      description: "Execute intelligent workflows",
      icon: Zap,
      gradient: "from-emerald-500 to-emerald-600", 
      bgGradient: "from-emerald-50/30 via-white to-emerald-50/20",
      action: () => onNavigate('automation')
    },
    {
      title: "View Analytics",
      description: "Insights and performance data",
      icon: TrendingUp,
      gradient: "from-purple-500 to-purple-600",
      bgGradient: "from-purple-50/30 via-white to-purple-50/20",
      action: () => onNavigate('services')
    }
  ];

  if (showProcessedCards) {
    return <ProcessedCardsView onBack={() => setShowProcessedCards(false)} />;
  }

  return (
    <div className="space-y-8">
      {/* Apple-inspired Weekly Metrics */}
      <div className={`transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold bg-gradient-to-r from-slate-900 via-blue-900 to-slate-800 bg-clip-text text-transparent">
              Weekly Performance
            </h2>
            <p className="text-slate-600 mt-1">Your automation metrics at a glance</p>
          </div>
          <div className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-blue-50 to-slate-50 rounded-full border border-blue-100/50">
            <Sparkles className="w-4 h-4 text-blue-600" />
            <span className="text-blue-700 font-medium text-sm">Live Data</span>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {metrics.map((metric, index) => (
            <div
              key={index}
              className={`relative overflow-hidden bg-gradient-to-br ${metric.bgGradient} backdrop-blur-sm border border-slate-200/50 rounded-2xl transition-all duration-500 hover:scale-[1.02] hover:shadow-xl group ${
                metric.onClick ? 'cursor-pointer' : ''
              } ${animateCounters ? 'animate-pulse' : ''}`}
              onClick={metric.onClick}
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {/* Floating background elements */}
              <div className="absolute -top-2 -right-2 w-16 h-16 bg-gradient-to-br from-white/20 to-transparent rounded-full blur-2xl"></div>
              
              <div className="relative p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${metric.gradient} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                    <metric.icon className="h-6 w-6 text-white" />
                  </div>
                  <div className={`flex items-center space-x-1 px-3 py-1 bg-green-50 rounded-full border border-green-200/50 transition-all duration-300 ${
                    animateCounters ? 'animate-bounce' : ''
                  }`}>
                    <TrendingUp className="h-3 w-3 text-green-600" />
                    <span className="text-green-700 font-semibold text-sm">{metric.change}</span>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <p className="text-slate-600 text-sm font-medium">{metric.label}</p>
                  <div className="text-3xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent transition-all duration-300">
                    {typeof metric.value === 'string' ? metric.value : metric.value.toLocaleString()}
                  </div>
                </div>

                {/* Hover arrow */}
                {metric.onClick && (
                  <ArrowUpRight className="absolute top-4 right-4 h-4 w-4 text-slate-400 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-1 -translate-y-1 group-hover:translate-x-0 group-hover:translate-y-0" />
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Apple-inspired Quick Actions */}
      <div className={`transition-all duration-700 delay-200 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
        <div className="mb-6">
          <h2 className="text-2xl font-bold bg-gradient-to-r from-slate-900 via-blue-900 to-slate-800 bg-clip-text text-transparent">
            Quick Actions
          </h2>
          <p className="text-slate-600 mt-1">Jump into your most common tasks</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {quickActions.map((action, index) => (
            <div
              key={index}
              className={`relative overflow-hidden bg-gradient-to-br ${action.bgGradient} backdrop-blur-sm border border-slate-200/50 rounded-2xl transition-all duration-500 hover:scale-[1.02] hover:shadow-xl cursor-pointer group`}
              onClick={action.action}
              style={{ animationDelay: `${(index + 4) * 100}ms` }}
            >
              {/* Floating background elements */}
              <div className="absolute -top-3 -right-3 w-20 h-20 bg-gradient-to-br from-white/10 to-transparent rounded-full blur-2xl"></div>
              
              <div className="relative p-6">
                <div className="flex items-center space-x-4">
                  <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${action.gradient} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                    <action.icon className="h-7 w-7 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-slate-900 mb-1 group-hover:text-slate-800 transition-colors duration-200">
                      {action.title}
                    </h3>
                    <p className="text-slate-600 text-sm">{action.description}</p>
                  </div>
                  <ArrowUpRight className="h-5 w-5 text-slate-400 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-1 -translate-y-1 group-hover:translate-x-0 group-hover:translate-y-0" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Apple-inspired Automation History */}
      <div className={`transition-all duration-700 delay-400 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
        <AutomationHistory logs={automationLogs} />
      </div>
    </div>
  );
};
