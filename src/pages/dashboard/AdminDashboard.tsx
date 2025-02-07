
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Edit2, ToggleLeft, ToggleRight } from "lucide-react";
import { useState } from "react";
import { EditUserDialog } from "@/components/admin/EditUserDialog";
import { useToast } from "@/hooks/use-toast";

interface Profile {
  id: string;
  full_name: string;
  email: string | null;
  facility_name: string | null;
  bed_count: number | null;
  facility_address: string | null;
  created_at: string;
}

export default function AdminDashboard() {
  const [selectedUser, setSelectedUser] = useState<Profile | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: profiles, isLoading: isLoadingProfiles } = useQuery({
    queryKey: ["profiles"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        toast({
          title: "Error fetching users",
          description: error.message,
          variant: "destructive",
        });
        throw error;
      }

      return data as Profile[];
    },
  });

  const { data: settings, isLoading: isLoadingSettings } = useQuery({
    queryKey: ["system_settings"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("system_settings")
        .select("*")
        .eq("key", "require_referral_code")
        .single();

      if (error) {
        toast({
          title: "Error fetching settings",
          description: error.message,
          variant: "destructive",
        });
        throw error;
      }

      return data;
    },
  });

  const updateSetting = useMutation({
    mutationFn: async () => {
      const { data, error } = await supabase.rpc(
        "update_system_setting",
        {
          setting_key: "require_referral_code",
          new_value: !settings?.value
        }
      );

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["system_settings"] });
      toast({
        title: "Setting updated",
        description: `Referral code requirement ${settings?.value ? "disabled" : "enabled"}`,
      });
    },
    onError: (error) => {
      toast({
        title: "Error updating setting",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  if (isLoadingProfiles || isLoadingSettings) {
    return <div>Loading...</div>;
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">User Management</h1>
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">
            Require referral code
          </span>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => updateSetting.mutate()}
            disabled={updateSetting.isPending}
          >
            {settings?.value ? (
              <ToggleRight className="h-6 w-6 text-primary" />
            ) : (
              <ToggleLeft className="h-6 w-6" />
            )}
          </Button>
        </div>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Facility</TableHead>
              <TableHead>Bed Count</TableHead>
              <TableHead>Address</TableHead>
              <TableHead>Joined</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {profiles?.map((profile) => (
              <TableRow key={profile.id}>
                <TableCell>{profile.full_name}</TableCell>
                <TableCell>{profile.email}</TableCell>
                <TableCell>{profile.facility_name}</TableCell>
                <TableCell>{profile.bed_count}</TableCell>
                <TableCell>{profile.facility_address}</TableCell>
                <TableCell>
                  {new Date(profile.created_at).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setSelectedUser(profile)}
                  >
                    <Edit2 className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <EditUserDialog
        user={selectedUser}
        open={!!selectedUser}
        onOpenChange={(open) => !open && setSelectedUser(null)}
      />
    </div>
  );
}
