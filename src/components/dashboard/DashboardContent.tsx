import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, Users, FileText, Clock, Zap } from "lucide-react";

interface User {
  firstName: string;
  lastName: string;
  email: string;
}

interface DashboardContentProps {
  user: User;
}

export const DashboardContent = ({ user }: DashboardContentProps) => {
  // Mock activity metrics - replace with real data later
  const weeklyMetrics = [
    { label: "Insurance Cards Processed", value: 23, icon: FileText, change: "+12%" },
    { label: "Automation Jobs Run", value: 8, icon: Zap, change: "+25%" },
    { label: "Claims Processed", value: 156, icon: TrendingUp, change: "+8%" },
    { label: "Active Patients", value: 42, icon: Users, change: "+5%" },
  ];

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Hello, {user.firstName}
        </h1>
        <p className="text-gray-600">
          Welcome back to your Blue Pine AI dashboard. Here's what's happening this week.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {weeklyMetrics.map((metric, index) => (
          <Card key={index} className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                {metric.label}
              </CardTitle>
              <metric.icon className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">{metric.value}</div>
              <p className="text-xs text-green-600 flex items-center mt-1">
                <TrendingUp className="h-3 w-3 mr-1" />
                {metric.change} from last week
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between items-center py-2 border-b">
                <span className="text-sm">Insurance card uploaded for Patient #1234</span>
                <span className="text-xs text-gray-500">2 hours ago</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b">
                <span className="text-sm">Revenue cycle automation completed</span>
                <span className="text-xs text-gray-500">4 hours ago</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b">
                <span className="text-sm">Claims automation job started</span>
                <span className="text-xs text-gray-500">6 hours ago</span>
              </div>
              <div className="flex justify-between items-center py-2">
                <span className="text-sm">Patient sourcing completed</span>
                <span className="text-xs text-gray-500">1 day ago</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <button className="w-full p-3 text-left bg-primary/5 hover:bg-primary/10 rounded-lg transition-colors">
                <div className="font-medium text-primary">Upload Insurance Card</div>
                <div className="text-sm text-gray-600">Process a new patient insurance card</div>
              </button>
              <button className="w-full p-3 text-left bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors">
                <div className="font-medium text-blue-700">Run Claims Automation</div>
                <div className="text-sm text-gray-600">Start automated claims processing</div>
              </button>
              <button className="w-full p-3 text-left bg-green-50 hover:bg-green-100 rounded-lg transition-colors">
                <div className="font-medium text-green-700">Patient Sourcing</div>
                <div className="text-sm text-gray-600">Find and verify patient information</div>
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
