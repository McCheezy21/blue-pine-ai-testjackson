
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { getUserInfo } from "@/utils/cognitoAuth";

export interface AutomationLog {
  id: string;
  automationType: string;
  patientName: string;
  patientId: string;
  facilityName: string;
  serviceDate: Date;
  providerName: string;
  automationNotes: string;
  status: "running" | "completed" | "failed";
  timestamp: Date;
  duration?: number;
  timeSavedMinutes: number;
}

export interface WeeklyMetrics {
  automations_run: number;
  cards_processed: number;
  claims_processed: number;
  time_saved_minutes: number;
}

// Time saving values for different automation types (in minutes)
const TIME_SAVING_MAP: Record<string, number> = {
  "Patient Sourcing Claims": 45,
  "Revenue Cycle Automation": 30,
  "Debt & Write-offs Automation": 25,
  "Medical Coder Automation": 20,
};

export const useAutomationData = () => {
  const [automationLogs, setAutomationLogs] = useState<AutomationLog[]>([]);
  const [weeklyMetrics, setWeeklyMetrics] = useState<WeeklyMetrics>({
    automations_run: 0,
    cards_processed: 0,
    claims_processed: 0,
    time_saved_minutes: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  const user = getUserInfo();

  // Convert database record to AutomationLog
  const convertDbToLog = (dbRecord: any): AutomationLog => ({
    id: dbRecord.id,
    automationType: dbRecord.automation_type,
    patientName: dbRecord.patient_name,
    patientId: dbRecord.patient_id,
    facilityName: dbRecord.facility_name,
    serviceDate: new Date(dbRecord.service_date),
    providerName: dbRecord.provider_name,
    automationNotes: dbRecord.automation_notes,
    status: dbRecord.status as "running" | "completed" | "failed",
    timestamp: new Date(dbRecord.created_at),
    duration: dbRecord.duration_seconds,
    timeSavedMinutes: dbRecord.time_saved_minutes || 0,
  });

  // Fetch automation logs
  const fetchLogs = async () => {
    if (!user?.sub) return;

    try {
      const { data, error } = await supabase
        .from('automation_logs')
        .select('*')
        .eq('user_id', user.sub)
        .order('created_at', { ascending: false });

      if (error) throw error;

      const convertedLogs = (data || []).map(convertDbToLog);
      setAutomationLogs(convertedLogs);
    } catch (error) {
      console.error('Error fetching automation logs:', error);
    }
  };

  // Fetch weekly metrics
  const fetchWeeklyMetrics = async () => {
    if (!user?.sub) return;

    try {
      const { data, error } = await supabase
        .from('weekly_metrics')
        .select('*')
        .eq('user_id', user.sub)
        .order('week_start', { ascending: false })
        .limit(1);

      if (error) throw error;

      if (data && data.length > 0) {
        const metrics = data[0];
        setWeeklyMetrics({
          automations_run: metrics.automations_run || 0,
          cards_processed: metrics.cards_processed || 0,
          claims_processed: metrics.claims_processed || 0,
          time_saved_minutes: metrics.time_saved_minutes || 0,
        });
      }
    } catch (error) {
      console.error('Error fetching weekly metrics:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Create automation log
  const createAutomationLog = async (data: {
    patientName: string;
    patientId: string;
    facilityName: string;
    serviceDate: Date;
    providerName: string;
    automationNotes: string;
    automationType: string;
  }) => {
    if (!user?.sub) throw new Error('User not authenticated');

    const timeSavedMinutes = TIME_SAVING_MAP[data.automationType] || 15;

    try {
      // Insert automation log
      const { data: logData, error: logError } = await supabase
        .from('automation_logs')
        .insert({
          user_id: user.sub,
          automation_type: data.automationType,
          patient_name: data.patientName,
          patient_id: data.patientId,
          facility_name: data.facilityName,
          service_date: data.serviceDate.toISOString().split('T')[0],
          provider_name: data.providerName,
          automation_notes: data.automationNotes,
          status: 'running',
          time_saved_minutes: timeSavedMinutes,
        })
        .select()
        .single();

      if (logError) throw logError;

      // Add to local state immediately
      const newLog = convertDbToLog(logData);
      setAutomationLogs(prev => [newLog, ...prev]);

      // Update metrics (simulate some card/claim processing)
      const cardsProcessed = Math.floor(Math.random() * 3) + 1; // 1-3 cards
      const claimsProcessed = Math.floor(Math.random() * 2) + 1; // 1-2 claims

      await supabase.rpc('update_weekly_metrics', {
        p_user_id: user.sub,
        p_automations_increment: 1,
        p_cards_increment: cardsProcessed,
        p_claims_increment: claimsProcessed,
        p_time_saved_increment: timeSavedMinutes,
      });

      // Update local metrics state
      setWeeklyMetrics(prev => ({
        automations_run: prev.automations_run + 1,
        cards_processed: prev.cards_processed + cardsProcessed,
        claims_processed: prev.claims_processed + claimsProcessed,
        time_saved_minutes: prev.time_saved_minutes + timeSavedMinutes,
      }));

      // Simulate completion after 3-8 seconds
      const completionTime = Math.random() * 5000 + 3000;
      setTimeout(async () => {
        try {
          const duration = Math.floor(completionTime / 1000);
          
          const { data: updatedData, error: updateError } = await supabase
            .from('automation_logs')
            .update({
              status: 'completed',
              completed_at: new Date().toISOString(),
              duration_seconds: duration,
            })
            .eq('id', logData.id)
            .select()
            .single();

          if (updateError) throw updateError;

          // Update local state
          setAutomationLogs(prev => 
            prev.map(log => 
              log.id === logData.id 
                ? convertDbToLog(updatedData)
                : log
            )
          );
        } catch (error) {
          console.error('Error updating automation status:', error);
          // Update to failed state
          setAutomationLogs(prev => 
            prev.map(log => 
              log.id === logData.id 
                ? { ...log, status: 'failed' as const }
                : log
            )
          );
        }
      }, completionTime);

      return newLog;
    } catch (error) {
      console.error('Error creating automation log:', error);
      throw error;
    }
  };

  useEffect(() => {
    if (user?.sub) {
      fetchLogs();
      fetchWeeklyMetrics();
    }
  }, [user?.sub]);

  return {
    automationLogs,
    weeklyMetrics,
    isLoading,
    createAutomationLog,
    refetch: () => {
      fetchLogs();
      fetchWeeklyMetrics();
    },
  };
};
