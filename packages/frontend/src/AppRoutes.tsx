import { Routes, Route, Navigate } from "react-router-dom";
import ScrollToTop from "./components/ScrollToTop";
import Index from "./pages/Index";
import Demo from "./pages/Demo";
import NotFound from "./pages/NotFound";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import SignIn from "./pages/SignIn";
import SignOut from "./pages/SignOut";
import Dashboard from "./pages/Dashboard";
import { Invite } from "./pages/Invite";
import { Admin } from "./pages/Admin";
import { TenantSelector } from "./pages/TenantSelector";
import RequestAccess from "./pages/RequestAccess";
import ProtectedRoute from "./components/ProtectedRoute";
import TenantProtectedRoute from "./components/TenantProtectedRoute";
import TenantDashboard from "./components/TenantDashboard";
import PointClickCareCallback from "./components/PointClickCareCallback";
import { getUserInfo } from "./utils/cognitoAuth";

const Unauthorized = () => {
  const urlParams = new URLSearchParams(window.location.search);
  const reason = urlParams.get('reason');
  
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="max-w-md w-full text-center space-y-6">
        <div className="text-red-500 text-6xl">🚫</div>
        <h1 className="text-2xl font-bold text-gray-900">Access Denied</h1>
        <p className="text-gray-600">
          {reason === 'domain' 
            ? 'Your email domain is not authorized for this organization.' 
            : 'You do not have permission to access this tenant.'}
        </p>
        <button
          onClick={() => window.location.href = '/'}
          className="bg-gray-600 text-white px-6 py-2 rounded-lg hover:bg-gray-700"
        >
          Go Home
        </button>
      </div>
    </div>
  );
};

const AccountSuspended = () => {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="max-w-md w-full text-center space-y-6">
        <div className="text-orange-500 text-6xl">⚠️</div>
        <h1 className="text-2xl font-bold text-gray-900">Account Suspended</h1>
        <p className="text-gray-600">
          This organization's account has been suspended. Please contact your administrator.
        </p>
        <button
          onClick={() => window.location.href = '/'}
          className="bg-gray-600 text-white px-6 py-2 rounded-lg hover:bg-gray-700"
        >
          Go Home
        </button>
      </div>
    </div>
  );
};

const AppRoutes = () => {
  console.log('🔍 AppRoutes: Current path:', window.location.pathname);
  console.log('🔍 AppRoutes: Current search:', window.location.search);
  
  return (
    <>
      <ScrollToTop />
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<Index />} />
        <Route path="/demo" element={<Demo />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signout" element={<SignOut />} />
        <Route path="/invite/:token" element={<Invite />} />
        <Route path="/request-access" element={<RequestAccess />} />
        
        {/* PointClickCare OAuth Callback */}
        <Route path="/auth/pointclickcare/callback" element={<PointClickCareCallback />} />
        
        {/* Admin routes */}
        <Route path="/admin" element={<Admin />} />
        
        {/* Multi-tenant routing */}
        <Route path="/tenant/:tenantId/dashboard" element={
          <TenantProtectedRoute>
            {(user) => <TenantDashboard user={user} />}
          </TenantProtectedRoute>
        } />
        <Route path="/tenant/:tenantId/settings" element={
          <TenantProtectedRoute>
            {(user) => (
              <div className="p-8">
                <h1 className="text-2xl font-bold">Tenant Settings</h1>
                <p className="text-gray-600 mt-2">Tenant-specific settings for {user.tenant.name}.</p>
                <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                  <p className="text-blue-800">Role: <span className="font-medium">{user.role}</span></p>
                  <p className="text-blue-800">Tenant ID: <span className="font-medium">{user.tenant.id}</span></p>
                </div>
              </div>
            )}
          </TenantProtectedRoute>
        } />
        
        {/* Utility routes */}
        <Route path="/select-tenant" element={<TenantSelector />} />
        <Route path="/unauthorized" element={
          <div className="min-h-screen bg-gray-50 flex items-center justify-center font-sans">
            <div className="text-center">
              <div className="text-red-500 text-6xl mb-4">🚫</div>
              <h1 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h1>
              <p className="text-gray-600 mb-4">You don't have permission to access this organization.</p>
              <button
                onClick={() => window.location.href = '/'}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
              >
                Go Home
              </button>
            </div>
          </div>
        } />
        <Route path="/account-suspended" element={<AccountSuspended />} />
        <Route path="/tenant-not-found" element={
          <div className="min-h-screen flex items-center justify-center">
            <div className="text-center">
              <h1 className="text-2xl font-bold text-gray-900 mb-4">Organization Not Found</h1>
              <p className="text-gray-600 mb-8">The requested organization could not be found.</p>
              <button
                onClick={() => window.location.href = '/'}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
              >
                Back to Home
              </button>
            </div>
          </div>
        } />
        <Route path="/subscription-required" element={
          <div className="min-h-screen flex items-center justify-center">
            <div className="text-center">
              <h1 className="text-2xl font-bold text-gray-900 mb-4">Subscription Required</h1>
              <p className="text-gray-600 mb-8">Please contact your administrator to activate your subscription.</p>
              <button
                onClick={() => window.location.href = '/'}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
              >
                Back to Home
              </button>
            </div>
          </div>
        } />
        
        {/* Legacy dashboard route */}
        <Route path="/dashboard" element={<Dashboard />} />
        
        {/* NEW: Debug route to check authentication status */}
        <Route path="/debug" element={
          <div className="min-h-screen bg-gray-50 p-8 font-mono">
            <div className="max-w-4xl mx-auto">
              <h1 className="text-3xl font-bold mb-8">🔍 Authentication Debug Info</h1>
              <div className="bg-white p-6 rounded-lg shadow space-y-4">
                <div>
                  <strong>Current User:</strong>
                  <pre className="mt-2 p-3 bg-gray-100 rounded text-sm">
                    {JSON.stringify(getUserInfo() || 'Not authenticated', null, 2)}
                  </pre>
                </div>
                <div>
                  <strong>Available Tenants:</strong>
                  <pre className="mt-2 p-3 bg-gray-100 rounded text-sm">
                    bluepineai-test-tenant (allows: bluepineai.com, gmail.com)
                    PACs-test-tentant (allows: pacs.com)
                    blue-pine-test (allows: bluepineai.com)
                  </pre>
                </div>
                <div className="space-x-4">
                  <button 
                    onClick={() => window.location.href = '/tenant/bluepineai-test-tenant/dashboard'}
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                  >
                    Try BluePine AI Tenant
                  </button>
                  <button 
                    onClick={() => window.location.href = '/admin'}
                    className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                  >
                    Admin Panel
                  </button>
                </div>
              </div>
            </div>
          </div>
        } />
        
        {/* 404 fallback */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
};

export default AppRoutes;
