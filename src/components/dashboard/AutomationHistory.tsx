
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Clock, CheckCircle, AlertCircle, PlayCircle, Crown } from "lucide-react";

interface AutomationLog {
  id: string;
  title: string;
  status: 'completed' | 'running' | 'failed';
  timestamp: Date;
  duration?: string;
  details?: string;
}

export const AutomationHistory = () => {
  const [logs, setLogs] = useState<AutomationLog[]>([]);
  const [showProPrompt, setShowProPrompt] = useState(false);

  // Mock data generation for demonstration
  useEffect(() => {
    const generateMockLogs = () => {
      const mockLogs: AutomationLog[] = [];
      const titles = [
        "Revenue Cycle Automation",
        "Patient Sourcing Claims",
        "Medical Coder Automation", 
        "Debt & Write-offs Automation"
      ];
      const statuses: Array<'completed' | 'running' | 'failed'> = ['completed', 'running', 'failed'];

      // Generate logs for the past 2 weeks
      for (let i = 0; i < 15; i++) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        date.setHours(Math.floor(Math.random() * 24));
        date.setMinutes(Math.floor(Math.random() * 60));

        mockLogs.push({
          id: `log-${i}`,
          title: titles[Math.floor(Math.random() * titles.length)],
          status: statuses[Math.floor(Math.random() * statuses.length)],
          timestamp: date,
          duration: `${Math.floor(Math.random() * 5) + 1}m ${Math.floor(Math.random() * 60)}s`
        });
      }

      return mockLogs.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
    };

    setLogs(generateMockLogs());
  }, []);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'running':
        return <PlayCircle className="h-4 w-4 text-blue-600" />;
      case 'failed':
        return <AlertCircle className="h-4 w-4 text-red-600" />;
      default:
        return <Clock className="h-4 w-4 text-gray-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'text-green-600';
      case 'running':
        return 'text-blue-600';
      case 'failed':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  const isWithinTwoWeeks = (date: Date) => {
    const twoWeeksAgo = new Date();
    twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 14);
    return date >= twoWeeksAgo;
  };

  const recentLogs = logs.filter(log => isWithinTwoWeeks(log.timestamp));
  const olderLogsCount = logs.length - recentLogs.length;

  const handleViewOlderLogs = () => {
    setShowProPrompt(true);
  };

  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Automation History</span>
          <span className="text-sm font-normal text-gray-500">
            Last 2 weeks ({recentLogs.length} entries)
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {showProPrompt && (
          <Alert className="mb-4 border-blue-200 bg-blue-50">
            <Crown className="h-4 w-4 text-blue-600" />
            <AlertDescription className="text-blue-800">
              <div className="flex items-center justify-between">
                <span>Access to historical logs beyond two weeks requires Blue Pine AI Pro</span>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => setShowProPrompt(false)}>
                    Dismiss
                  </Button>
                  <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white">
                    Upgrade to Pro
                  </Button>
                </div>
              </div>
            </AlertDescription>
          </Alert>
        )}

        <div className="space-y-3 max-h-64 overflow-y-auto">
          {recentLogs.map((log) => (
            <div key={log.id} className="flex justify-between items-center py-2 border-b last:border-b-0">
              <div className="flex items-center gap-3">
                {getStatusIcon(log.status)}
                <div>
                  <span className="font-medium">{log.title}</span>
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <span>{log.timestamp.toLocaleDateString()}</span>
                    <span>{log.timestamp.toLocaleTimeString()}</span>
                    {log.duration && <span>• {log.duration}</span>}
                  </div>
                </div>
              </div>
              <span className={`text-sm font-medium capitalize ${getStatusColor(log.status)}`}>
                {log.status}
              </span>
            </div>
          ))}
        </div>

        {olderLogsCount > 0 && (
          <div className="mt-4 pt-4 border-t">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleViewOlderLogs}
              className="w-full border-blue-200 text-blue-600 hover:bg-blue-50"
            >
              View {olderLogsCount} older log{olderLogsCount !== 1 ? 's' : ''} (Pro Feature)
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
