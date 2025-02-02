import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function Affiliates() {
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Affiliates</h1>
      <Card>
        <CardHeader>
          <CardTitle>Coming Soon</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">The affiliates feature is currently under development.</p>
        </CardContent>
      </Card>
    </div>
  )
}