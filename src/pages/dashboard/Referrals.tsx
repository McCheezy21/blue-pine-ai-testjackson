import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { Users, UserPlus, Check, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

export default function Referrals() {
  // Fetch current user's profile to get referral code
  const { data: profile, isLoading: profileLoading } = useQuery({
    queryKey: ['profile'],
    queryFn: async () => {
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .maybeSingle();
      
      if (error) throw error;
      return profile;
    },
  });

  // Fetch referrals made by the current user
  const { data: referrals, isLoading: referralsLoading } = useQuery({
    queryKey: ['referrals'],
    queryFn: async () => {
      const { data: referrals, error } = await supabase
        .from('referral_tracking')
        .select(`
          id,
          created_at,
          status,
          profiles!referral_tracking_referred_id_fkey (
            full_name,
            facility_name
          )
        `);
      
      if (error) throw error;
      return referrals;
    },
  });

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Referrals</h1>
      
      {/* Referral Code Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UserPlus className="h-5 w-5" />
            Your Referral Code
          </CardTitle>
        </CardHeader>
        <CardContent>
          {profileLoading ? (
            <Skeleton className="h-8 w-48" />
          ) : (
            <div className="text-2xl font-mono font-bold text-primary">
              {profile?.referral_code || 'No referral code found'}
            </div>
          )}
          <p className="mt-2 text-sm text-muted-foreground">
            Share this code with other facilities to track your referrals
          </p>
        </CardContent>
      </Card>

      {/* Referrals List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Your Referrals
          </CardTitle>
        </CardHeader>
        <CardContent>
          {referralsLoading ? (
            <div className="space-y-2">
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
            </div>
          ) : referrals?.length === 0 ? (
            <p className="text-center py-8 text-muted-foreground">
              You haven't made any referrals yet
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Facility Name</TableHead>
                  <TableHead>Contact Person</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {referrals?.map((referral) => (
                  <TableRow key={referral.id}>
                    <TableCell>{referral.profiles.facility_name || 'N/A'}</TableCell>
                    <TableCell>{referral.profiles.full_name}</TableCell>
                    <TableCell>
                      <span className="flex items-center gap-1">
                        {referral.status === 'completed' ? (
                          <>
                            <Check className="h-4 w-4 text-green-500" />
                            Completed
                          </>
                        ) : (
                          <>
                            <X className="h-4 w-4 text-orange-500" />
                            Pending
                          </>
                        )}
                      </span>
                    </TableCell>
                    <TableCell>
                      {new Date(referral.created_at).toLocaleDateString()}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}