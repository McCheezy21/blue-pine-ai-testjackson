import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  Activity, 
  Calendar, 
  Download,
  Filter,
  RefreshCw,
  Clock,
  Building2,
  FileText,
  DollarSign,
  Database,
  Shield,
  Zap,
  ClipboardCheck
} from "lucide-react";

export const ReportsAnalytics = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [timeRange, setTimeRange] = useState("30d");

  useEffect(() => {
    setTimeout(() => setIsVisible(true), 100);
  }, []);

  // PCC Integration Metrics - Starting at 0
  const pccMetrics = [
    {
      title: "PCC Connected Facilities",
      value: "0",
      change: "Ready to connect",
      icon: Building2,
      color: "#004466"
    },
    {
      title: "PCC Data Syncs",
      value: "0",
      change: "Awaiting first sync", 
      icon: Database,
      color: "#004466"
    },
    {
      title: "PCC Reports Generated",
      value: "0",
      change: "Ready to generate",
      icon: FileText,
      color: "#004466"
    },
    {
      title: "PCC Revenue Tracked",
      value: "$0",
      change: "Ready to track",
      icon: DollarSign,
      color: "#3CB371"
    }
  ];

  // PCC Available Reports
  const pccReports = [
    { 
      name: "Resident Census Report", 
      description: "Daily census with admission/discharge tracking",
      frequency: "Daily",
      status: "Available",
      icon: Users
    },
    { 
      name: "MDS Assessment Report", 
      description: "MDS completion status and upcoming deadlines",
      frequency: "Weekly",
      status: "Available",
      icon: ClipboardCheck
    },
    { 
      name: "Care Plan Analytics", 
      description: "Care plan effectiveness and outcomes tracking",
      frequency: "Monthly",
      status: "Available",
      icon: Activity
    },
    { 
      name: "Financial Performance", 
      description: "Revenue cycle and billing performance metrics",
      frequency: "Monthly",
      status: "Available",
      icon: DollarSign
    },
    { 
      name: "Quality Measures", 
      description: "Quality indicator tracking and compliance",
      frequency: "Quarterly",
      status: "Available",
      icon: Shield
    }
  ];

  // PCC Data Analytics Features
  const pccAnalytics = [
    { 
      category: "Resident Management", 
      features: ["ADL Tracking", "Care Plan Monitoring", "Health Status Analytics"],
      dataPoints: 0
    },
    { 
      category: "Financial Analytics", 
      features: ["Revenue Cycle Analysis", "Billing Performance", "Insurance Claims Tracking"],
      dataPoints: 0
    },
    { 
      category: "Compliance Reporting", 
      features: ["MDS Compliance", "Quality Measures", "Regulatory Reports"],
      dataPoints: 0
    },
    { 
      category: "Operational Insights", 
      features: ["Staff Scheduling", "Resource Utilization", "Occupancy Trends"],
      dataPoints: 0
    }
  ];

  const usagePatterns = [
    { time: "6 AM", usage: 0 },
    { time: "9 AM", usage: 0 },
    { time: "12 PM", usage: 0 },
    { time: "3 PM", usage: 0 },
    { time: "6 PM", usage: 0 },
    { time: "9 PM", usage: 0 }
  ];

  return (
    <div className="space-y-8 font-['Inter',system-ui,sans-serif]">
      {/* Header */}
      <div className={`transition-all duration-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-[#333333] mb-2">
              PointClickCare Reports & Analytics
            </h1>
            <p className="text-[#333333]/70">Comprehensive PCC data insights and performance metrics</p>
          </div>
          
          <div className="flex items-center space-x-3">
            <select 
              value={timeRange} 
              onChange={(e) => setTimeRange(e.target.value)}
              className="px-3 py-2 border border-[#CCCCCC] rounded-lg text-[#333333] bg-white focus:border-[#004466] focus:outline-none"
            >
              <option value="7d">Last 7 days</option>
              <option value="30d">Last 30 days</option>
              <option value="90d">Last 90 days</option>
              <option value="1y">Last year</option>
            </select>
            
            <Button className="bg-[#004466] hover:bg-[#005580] text-white">
              <Download className="h-4 w-4 mr-2" />
              Export PCC Data
            </Button>
          </div>
        </div>
      </div>

      {/* PCC Integration Status */}
      <div className={`transition-all duration-500 delay-100 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {pccMetrics.map((metric, index) => (
            <div key={index} className="bg-white border border-[#CCCCCC] rounded-lg p-6 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <div 
                  className="w-10 h-10 rounded-lg flex items-center justify-center"
                  style={{ backgroundColor: metric.color }}
                >
                  <metric.icon className="h-5 w-5 text-white" />
                </div>
              </div>
              
              <div className="space-y-2">
                <p className="text-[#333333]/70 text-sm font-medium">{metric.title}</p>
                <div className="text-2xl font-semibold text-[#333333]">{metric.value}</div>
                <p className="text-xs text-[#004466] font-medium">{metric.change}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* PCC Reports and Analytics Row */}
      <div className={`transition-all duration-500 delay-200 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Available PCC Reports */}
          <div className="bg-white border border-[#CCCCCC] rounded-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-[#333333]">Available PCC Reports</h3>
              <FileText className="h-5 w-5 text-[#333333]/50" />
            </div>
            
            <div className="space-y-4">
              {pccReports.map((report, index) => (
                <div key={index} className="p-4 border border-[#CCCCCC]/50 rounded-lg hover:bg-[#EAEFF2] transition-colors duration-200">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-3 flex-1">
                      <div className="w-8 h-8 bg-[#004466] rounded-lg flex items-center justify-center mt-1">
                        <report.icon className="h-4 w-4 text-white" />
                      </div>
                      <div className="flex-1">
                        <div className="font-medium text-[#333333] text-sm">{report.name}</div>
                        <div className="text-xs text-[#333333]/60 mt-1">{report.description}</div>
                        <div className="text-xs text-[#004466] font-medium mt-2">{report.frequency}</div>
                      </div>
                    </div>
                    <span className="text-xs bg-[#3CB371] text-white px-2 py-1 rounded-full">
                      {report.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* PCC Analytics Categories */}
          <div className="bg-white border border-[#CCCCCC] rounded-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-[#333333]">PCC Analytics Categories</h3>
              <BarChart3 className="h-5 w-5 text-[#333333]/50" />
            </div>
            
            <div className="space-y-4">
              {pccAnalytics.map((category, index) => (
                <div key={index} className="p-4 border border-[#CCCCCC]/50 rounded-lg">
                  <div className="flex items-center justify-between mb-3">
                    <div className="font-medium text-[#333333] text-sm">{category.category}</div>
                    <div className="text-sm font-semibold text-[#004466]">{category.dataPoints} data points</div>
                  </div>
                  <div className="space-y-1">
                    {category.features.map((feature, idx) => (
                      <div key={idx} className="text-xs text-[#333333]/60 flex items-center">
                        <Zap className="h-3 w-3 mr-2 text-[#3CB371]" />
                        {feature}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* PCC Data Activity */}
      <div className={`transition-all duration-500 delay-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
        <div className="bg-white border border-[#CCCCCC] rounded-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-[#333333]">PCC Data Synchronization Status</h3>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm" className="border-[#CCCCCC] text-[#333333]">
                <RefreshCw className="h-4 w-4 mr-2" />
                Sync Now
              </Button>
              <Button size="sm" className="bg-[#004466] hover:bg-[#005580] text-white">
                <Database className="h-4 w-4 mr-2" />
                Connect PCC
              </Button>
            </div>
          </div>
          
          <div className="text-center py-12">
            <Database className="h-16 w-16 text-[#CCCCCC] mx-auto mb-4" />
            <h4 className="text-lg font-medium text-[#333333] mb-2">Ready to Connect PointClickCare</h4>
            <p className="text-[#333333]/60 mb-6 max-w-md mx-auto">
              Connect your PointClickCare system to start viewing comprehensive reports and analytics. 
              Once connected, you'll see real-time data synchronization and detailed insights.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-2xl mx-auto">
              <div className="p-4 bg-[#EAEFF2] rounded-lg">
                <Shield className="h-8 w-8 text-[#004466] mx-auto mb-2" />
                <div className="text-sm font-medium text-[#333333]">Secure Integration</div>
                <div className="text-xs text-[#333333]/60 mt-1">HIPAA compliant data transfer</div>
              </div>
              <div className="p-4 bg-[#EAEFF2] rounded-lg">
                <Zap className="h-8 w-8 text-[#004466] mx-auto mb-2" />
                <div className="text-sm font-medium text-[#333333]">Real-time Sync</div>
                <div className="text-xs text-[#333333]/60 mt-1">Instant data updates</div>
              </div>
              <div className="p-4 bg-[#EAEFF2] rounded-lg">
                <BarChart3 className="h-8 w-8 text-[#004466] mx-auto mb-2" />
                <div className="text-sm font-medium text-[#333333]">Advanced Analytics</div>
                <div className="text-xs text-[#333333]/60 mt-1">Comprehensive insights</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}; 