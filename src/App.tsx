
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Demo from "./pages/Demo";
import Onboarding from "./pages/Onboarding";
import NotFound from "./pages/NotFound";
import DashboardLayout from "./layouts/DashboardLayout";
import Dashboard from "./pages/dashboard/Dashboard";
import AdminDashboard from "./pages/dashboard/AdminDashboard";
import Facility from "./pages/dashboard/Facility";
import Referrals from "./pages/dashboard/Referrals";
import Support from "./pages/dashboard/Support";
import AccountSettings from "./pages/dashboard/AccountSettings";
import { AuthGuard } from "./components/AuthGuard";
import WhyAI from "./pages/WhyAI";
import SNFROI from "./pages/SNFROI";
import PrivacyPolicy from "./pages/PrivacyPolicy";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/why-ai" element={<WhyAI />} />
          <Route path="/snf-roi" element={<SNFROI />} />
          <Route path="/demo" element={<Demo />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/onboarding" element={<Onboarding />} />
          <Route path="/dashboard" element={
            <AuthGuard>
              <DashboardLayout />
            </AuthGuard>
          }>
            <Route index element={<Dashboard />} />
            <Route path="admin" element={<AdminDashboard />} />
            <Route path="facility" element={<Facility />} />
            <Route path="referrals" element={<Referrals />} />
            <Route path="support" element={<Support />} />
            <Route path="settings" element={<AccountSettings />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
