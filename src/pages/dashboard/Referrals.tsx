import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function Referrals() {
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Referrals</h1>
      <Card>
        <CardHeader>
          <CardTitle>Referrals Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Manage your referrals here.</p>
        </CardContent>
      </Card>
    </div>
  )
}