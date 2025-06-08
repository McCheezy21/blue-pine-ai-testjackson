import { Routes, Route } from "react-router-dom";
import ScrollToTop from "./components/ScrollToTop";
import Index from "./pages/Index";
import Waitlist from "./pages/Waitlist";
import NotFound from "./pages/NotFound";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import SignIn from "./pages/SignIn";
import SignOut from "./pages/SignOut";
import Dashboard from "./pages/Dashboard";
import { Invite } from "./pages/Invite";
import { Admin } from "./pages/Admin";
import ProtectedRoute from "./components/ProtectedRoute";

const AppRoutes = () => {
  return (
    <>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/waitlist" element={<Waitlist />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signout" element={<SignOut />} />
        <Route path="/invite/:token" element={<Invite />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
};

export default AppRoutes;
