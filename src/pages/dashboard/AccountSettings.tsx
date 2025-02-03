import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { supabase } from "@/integrations/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/components/ui/use-toast"

export default function AccountSettings() {
  const [loading, setLoading] = useState(true)
  const [fullName, setFullName] = useState("")
  const [facilityName, setFacilityName] = useState("")
  const [facilityAddress, setFacilityAddress] = useState("")
  const [bedCount, setBedCount] = useState("")
  const { toast } = useToast()
  const navigate = useNavigate()

  useEffect(() => {
    getProfile()
  }, [])

  async function getProfile() {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        navigate("/auth")
        return
      }

      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()

      if (error) throw error

      setFullName(data.full_name || "")
      setFacilityName(data.facility_name || "")
      setFacilityAddress(data.facility_address || "")
      setBedCount(data.bed_count?.toString() || "")
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }

  async function updateProfile() {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('No user')

      const updates = {
        id: user.id,
        full_name: fullName,
        facility_name: facilityName,
        facility_address: facilityAddress,
        bed_count: bedCount ? parseInt(bedCount) : null,
        updated_at: new Date().toISOString(),
      }

      const { error } = await supabase
        .from('profiles')
        .upsert(updates)

      if (error) throw error

      toast({
        title: "Success",
        description: "Your profile has been updated.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "There was an error updating your profile.",
        variant: "destructive",
      })
      console.error('Error:', error)
    }
  }

  if (loading) {
    return <div>Loading...</div>
  }

  return (
    <div className="container max-w-2xl mx-auto py-6">
      <Card>
        <CardHeader>
          <CardTitle>Account Settings</CardTitle>
          <CardDescription>
            Update your personal and facility information
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="fullName">Full Name</Label>
            <Input
              id="fullName"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="facilityName">Facility Name</Label>
            <Input
              id="facilityName"
              value={facilityName}
              onChange={(e) => setFacilityName(e.target.value)}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="facilityAddress">Facility Address</Label>
            <Input
              id="facilityAddress"
              value={facilityAddress}
              onChange={(e) => setFacilityAddress(e.target.value)}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="bedCount">Bed Count</Label>
            <Input
              id="bedCount"
              type="number"
              value={bedCount}
              onChange={(e) => setBedCount(e.target.value)}
            />
          </div>

          <Button onClick={updateProfile} className="w-full">
            Save Changes
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}