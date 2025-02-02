import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function Facility() {
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">My Facility</h1>
      <Card>
        <CardHeader>
          <CardTitle>Facility Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Welcome to your facility dashboard!</p>
        </CardContent>
      </Card>
    </div>
  )
}