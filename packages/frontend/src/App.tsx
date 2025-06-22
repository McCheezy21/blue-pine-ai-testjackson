
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter } from "react-router-dom";
import { Analytics } from '@vercel/analytics/react';
import { injectSpeedInsights } from '@vercel/speed-insights';
import { ChatInterface } from "@/components/dashboard/ChatInterface";
import AppRoutes from "./AppRoutes";

const queryClient = new QueryClient();

// Initialize Speed Insights
injectSpeedInsights();

const App = () => (
  <BrowserRouter>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <AppRoutes />
        <Analytics />
      </TooltipProvider>
    </QueryClientProvider>
  </BrowserRouter>
);

export default App;
