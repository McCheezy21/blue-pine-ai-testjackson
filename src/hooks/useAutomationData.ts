
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface AutomationLog {
  id: string;
  automation_type: string;
  patient_name: string;
  patient_id: string;
  facility_name: string;
  service_date: string;
  provider_name: string;
  automation_notes: string;
  status: 'running' | 'completed' | 'failed';
  created_at: string;
  completed_at: string | null;
  duration_seconds: number | null;
  time_saved_minutes: number;
}

interface WeeklyMetrics {
  automations_run: number;
  cards_processed: number;
  claims_processed: number;
  time_saved_minutes: number;
}

export const useAutomationData = () => {
  const [automationLogs, setAutomationLogs] = useState<AutomationLog[]>([]);
  const [weeklyMetrics, setWeeklyMetrics] = useState<WeeklyMetrics>({
    automations_run: 0,
    cards_processed: 0,
    claims_processed: 0,
    time_saved_minutes: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  // Calculate time saved for different automation types
  const getTimeSavedForAutomation = (automationType: string): number => {
    const timeSavings = {
      'Patient Sourcing Claims': 45,
      'Revenue Cycle Automation': 120,
      'Debt & Write-offs Automation': 90,
      'Medical Coder Automation': 60,
    };
    return timeSavings[automationType as keyof typeof timeSavings] || 30;
  };

  // Fetch automation logs
  const fetchAutomationLogs = async () => {
    try {
      const { data, error } = await supabase
        .from('automation_logs')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setAutomationLogs(data || []);
    } catch (error) {
      console.error('Error fetching automation logs:', error);
      toast({
        title: "Error",
        description: "Failed to load automation history",
        variant: "destructive",
      });
    }
  };

  // Fetch weekly metrics
  const fetchWeeklyMetrics = async () => {
    try {
      const { data, error } = await supabase
        .rpc('get_week_start')
        .then(({ data: weekStart }) => 
          supabase
            .from('weekly_metrics')
            .select('*')
            .eq('week_start', weekStart)
            .single()
        );

      if (error && error.code !== 'PGRST116') throw error;
      
      if (data) {
        setWeeklyMetrics({
          automations_run: data.automations_run || 0,
          cards_processed: data.cards_processed || 0,
          claims_processed: data.claims_processed || 0,
          time_saved_minutes: data.time_saved_minutes || 0,
        });
      }
    } catch (error) {
      console.error('Error fetching weekly metrics:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Create new automation log
  const createAutomationLog = async (automationData: any) => {
    try {
      const timeSaved = getTimeSavedForAutomation(automationData.automationType);
      
      const { data, error } = await supabase
        .from('automation_logs')
        .insert({
          automation_type: automationData.automationType,
          patient_name: automationData.patientName,
          patient_id: automationData.patientId,
          facility_name: automationData.facilityName,
          service_date: automationData.serviceDate.toISOString().split('T')[0],
          provider_name: automationData.providerName,
          automation_notes: automationData.automationNotes,
          time_saved_minutes: timeSaved,
          status: 'running'
        })
        .select()
        .single();

      if (error) throw error;

      // Update local state immediately
      setAutomationLogs(prev => [data, ...prev]);

      // Update weekly metrics
      await updateWeeklyMetrics(1, 
        Math.floor(Math.random() * 3) + 1, // 1-3 cards processed
        Math.floor(Math.random() * 2) + 1, // 1-2 claims processed
        timeSaved
      );

      // Simulate automation completion after random delay
      setTimeout(async () => {
        await completeAutomation(data.id);
      }, Math.random() * 30000 + 10000); // 10-40 seconds

      return data;
    } catch (error) {
      console.error('Error creating automation log:', error);
      toast({
        title: "Error",
        description: "Failed to start automation",
        variant: "destructive",
      });
      throw error;
    }
  };

  // Complete automation
  const completeAutomation = async (logId: string) => {
    try {
      const { data, error } = await supabase
        .from('automation_logs')
        .update({
          status: 'completed',
          completed_at: new Date().toISOString(),
          duration_seconds: Math.floor(Math.random() * 300) + 60 // 1-5 minutes
        })
        .eq('id', logId)
        .select()
        .single();

      if (error) throw error;

      // Update local state
      setAutomationLogs(prev => 
        prev.map(log => log.id === logId ? { ...log, ...data } : log)
      );
    } catch (error) {
      console.error('Error completing automation:', error);
    }
  };

  // Update weekly metrics
  const updateWeeklyMetrics = async (
    automationsIncrement: number = 0,
    cardsIncrement: number = 0,
    claimsIncrement: number = 0,
    timeSavedIncrement: number = 0
  ) => {
    try {
      const { error } = await supabase.rpc('update_weekly_metrics', {
        p_user_id: (await supabase.auth.getUser()).data.user?.id,
        p_automations_increment: automationsIncrement,
        p_cards_increment: cardsIncrement,
        p_claims_increment: claimsIncrement,
        p_time_saved_increment: timeSavedIncrement
      });

      if (error) throw error;

      // Update local state
      setWeeklyMetrics(prev => ({
        automations_run: prev.automations_run + automationsIncrement,
        cards_processed: prev.cards_processed + cardsIncrement,
        claims_processed: prev.claims_processed + claimsIncrement,
        time_saved_minutes: prev.time_saved_minutes + timeSavedIncrement,
      }));
    } catch (error) {
      console.error('Error updating weekly metrics:', error);
    }
  };

  useEffect(() => {
    fetchAutomationLogs();
    fetchWeeklyMetrics();
  }, []);

  return {
    automationLogs,
    weeklyMetrics,
    isLoading,
    createAutomationLog,
    refreshData: () => {
      fetchAutomationLogs();
      fetchWeeklyMetrics();
    }
  };
};
