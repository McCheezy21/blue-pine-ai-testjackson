import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function Affiliates() {
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Affiliates</h1>
      <Card>
        <CardHeader>
          <CardTitle>Affiliates Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Manage your affiliates here.</p>
        </CardContent>
      </Card>
    </div>
  )
}