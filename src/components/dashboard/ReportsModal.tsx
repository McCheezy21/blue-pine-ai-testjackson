
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { BarChart3, MessageCircle, Calendar } from "lucide-react";

interface ReportsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ReportsModal = ({ isOpen, onClose }: ReportsModalProps) => {
  const handleContactExpert = () => {
    // This could open a contact form, redirect to a scheduling page, or trigger another action
    console.log("Contacting Blue Pine AI expert...");
    // For now, we'll just close the modal
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md bg-white">
        <DialogHeader>
          <DialogTitle className="text-center text-2xl font-bold text-gray-900 mb-4">
            Advanced Reports & Analytics
          </DialogTitle>
        </DialogHeader>
        
        <div className="text-center space-y-6">
          <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
            <BarChart3 className="h-8 w-8 text-blue-600" />
          </div>
          
          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-gray-900">
              Interested in this feature?
            </h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              Our advanced reporting and analytics dashboard provides deep insights into your 
              healthcare automation workflows, performance metrics, and ROI analysis.
            </p>
          </div>
          
          <div className="bg-blue-50 p-4 rounded-lg">
            <p className="text-blue-800 text-sm font-medium mb-3">
              Talk to a Blue Pine AI expert to learn more about:
            </p>
            <ul className="text-blue-700 text-sm space-y-1 text-left">
              <li>• Custom dashboard configurations</li>
              <li>• Advanced analytics and insights</li>
              <li>• Integration capabilities</li>
              <li>• Pricing and implementation timeline</li>
            </ul>
          </div>
          
          <div className="flex gap-3 pt-4">
            <Button variant="outline" onClick={onClose} className="flex-1">
              Maybe Later
            </Button>
            <Button onClick={handleContactExpert} className="flex-1 bg-blue-600 hover:bg-blue-700">
              <MessageCircle className="h-4 w-4 mr-2" />
              Contact Expert
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
