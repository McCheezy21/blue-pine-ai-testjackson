
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ProcessedCard {
  id: string;
  patientName: string;
  processedDate: Date;
  status: 'completed' | 'pending' | 'failed';
  facilityName: string;
}

interface ProcessedCardsViewProps {
  onBack: () => void;
}

export const ProcessedCardsView = ({ onBack }: ProcessedCardsViewProps) => {
  const [processedCards, setProcessedCards] = useState<ProcessedCard[]>([]);

  useEffect(() => {
    // Generate mock data for processed cards
    const generateMockCards = () => {
      const mockCards: ProcessedCard[] = [];
      const patientNames = [
        "John Smith", "Mary Johnson", "David Brown", "Sarah Wilson",
        "Michael Davis", "Lisa Anderson", "Robert Taylor", "Jennifer White",
        "Christopher Garcia", "Amanda Martinez", "James Rodriguez", "Emily Lewis"
      ];
      const facilities = [
        "City General Hospital", "Metro Medical Center", "Riverside Clinic",
        "Valley Health System", "Downtown Medical Plaza"
      ];
      const statuses: Array<'completed' | 'pending' | 'failed'> = ['completed', 'pending', 'failed'];

      for (let i = 0; i < 25; i++) {
        const date = new Date();
        date.setDate(date.getDate() - Math.floor(Math.random() * 14));
        date.setHours(Math.floor(Math.random() * 24));
        date.setMinutes(Math.floor(Math.random() * 60));

        mockCards.push({
          id: `card-${i}`,
          patientName: patientNames[Math.floor(Math.random() * patientNames.length)],
          processedDate: date,
          status: statuses[Math.floor(Math.random() * statuses.length)],
          facilityName: facilities[Math.floor(Math.random() * facilities.length)]
        });
      }

      return mockCards.sort((a, b) => b.processedDate.getTime() - a.processedDate.getTime());
    };

    setProcessedCards(generateMockCards());
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'text-green-600';
      case 'pending':
        return 'text-yellow-600';
      case 'failed':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen font-sans">
      <div className="mb-6">
        <Button
          variant="outline"
          onClick={onBack}
          className="mb-4 flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Dashboard
        </Button>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Processed Insurance Cards</h1>
        <p className="text-gray-600">View all recently processed insurance cards and their details.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Card Processing Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Patient Name</TableHead>
                <TableHead>Facility</TableHead>
                <TableHead>Processed Date</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {processedCards.map((card) => (
                <TableRow key={card.id}>
                  <TableCell className="font-medium">{card.patientName}</TableCell>
                  <TableCell>{card.facilityName}</TableCell>
                  <TableCell>
                    {card.processedDate.toLocaleDateString()} at {card.processedDate.toLocaleTimeString()}
                  </TableCell>
                  <TableCell>
                    <span className={`font-medium capitalize ${getStatusColor(card.status)}`}>
                      {card.status}
                    </span>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};
