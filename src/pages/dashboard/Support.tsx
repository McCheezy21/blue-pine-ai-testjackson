import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function Support() {
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Support</h1>
      <Card>
        <CardHeader>
          <CardTitle>Support Center</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Get help and support here.</p>
        </CardContent>
      </Card>
    </div>
  )
}