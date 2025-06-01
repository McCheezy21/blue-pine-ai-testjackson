
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Clock, CheckCircle, AlertCircle, PlayCircle, Crown, Loader2 } from "lucide-react";
import { AutomationLog } from "@/hooks/useAutomationData";

interface AutomationHistoryProps {
  logs: AutomationLog[];
}

export const AutomationHistory = ({ logs }: AutomationHistoryProps) => {
  const [showProPrompt, setShowProPrompt] = useState(false);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'running':
        return <Loader2 className="h-4 w-4 text-blue-600 animate-spin" />;
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

  const formatTimestamp = (timestamp: Date) => {
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - timestamp.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) {
      return 'Just now';
    } else if (diffInMinutes < 60) {
      return `${diffInMinutes} minute${diffInMinutes !== 1 ? 's' : ''} ago`;
    } else if (diffInMinutes < 1440) {
      const hours = Math.floor(diffInMinutes / 60);
      return `${hours} hour${hours !== 1 ? 's' : ''} ago`;
    } else {
      const days = Math.floor(diffInMinutes / 1440);
      return `${days} day${days !== 1 ? 's' : ''} ago`;
    }
  };

  const formatDuration = (seconds: number | undefined) => {
    if (!seconds) return '';
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}m ${remainingSeconds}s`;
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
          {recentLogs.length === 0 ? (
            <div className="text-center text-gray-500 py-8">
              No automation history yet. Run your first automation to see it here.
            </div>
          ) : (
            recentLogs.map((log) => (
              <div key={log.id} className="flex justify-between items-center py-2 border-b last:border-b-0">
                <div className="flex items-center gap-3">
                  {getStatusIcon(log.status)}
                  <div>
                    <span className="font-medium">{log.automationType}</span>
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <span>{formatTimestamp(log.timestamp)}</span>
                      {log.duration && log.status === 'completed' && (
                        <span>• {formatDuration(log.duration)}</span>
                      )}
                    </div>
                  </div>
                </div>
                <span className={`text-sm font-medium capitalize ${getStatusColor(log.status)}`}>
                  {log.status}
                </span>
              </div>
            ))
          )}
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
