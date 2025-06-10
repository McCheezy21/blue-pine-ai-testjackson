import React, { useState, useEffect } from 'react';
import { getUserInfo } from '../utils/cognitoAuth';

interface Tenant {
  id: string;
  name: string;
  plan: string;
  status: string;
  allowed_email_domains: string[];
}

export const TenantSelector: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState<string>('');

  useEffect(() => {
    fetchAccessibleTenants();
  }, []);

  const fetchAccessibleTenants = async () => {
    try {
      console.log('🔍 TenantSelector: Fetching accessible tenants...');
      
      const userInfo = getUserInfo();
      if (!userInfo) {
        setError('Please sign in to view your organizations');
        setLoading(false);
        return;
      }

      setUserEmail(userInfo.email);

      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3001'}/api/user/accessible-tenants`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('idToken')}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        console.log('📊 TenantSelector: Accessible tenants:', data);
        setTenants(data.accessible_tenants || []);
      } else {
        setError('Failed to load your organizations');
      }
    } catch (error) {
      console.error('❌ Error fetching accessible tenants:', error);
      setError('Failed to load your organizations');
    } finally {
      setLoading(false);
    }
  };

  const selectTenant = (tenantId: string) => {
    console.log(`🎯 User selected tenant: ${tenantId}`);
    window.location.href = `/tenant/${tenantId}/dashboard`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your organizations...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Error</h1>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.href = '/signin'}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
          >
            Sign In Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Select Your Organization</h1>
          <p className="text-gray-600">
            Welcome {userEmail}! You have access to multiple organizations. Please select one to continue.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {tenants.map((tenant) => (
            <div
              key={tenant.id}
              className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer p-6 border border-gray-200"
              onClick={() => selectTenant(tenant.id)}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold text-gray-900">{tenant.name}</h3>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  tenant.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                }`}>
                  {tenant.status}
                </span>
              </div>
              
              <div className="mb-4">
                <span className={`px-3 py-1 rounded-full text-sm font-medium capitalize ${
                  tenant.plan === 'enterprise' ? 'bg-purple-100 text-purple-800' :
                  tenant.plan === 'pro' ? 'bg-blue-100 text-blue-800' : 
                  'bg-gray-100 text-gray-800'
                }`}>
                  {tenant.plan} plan
                </span>
              </div>

              <div className="text-sm text-gray-600 mb-4">
                <strong>Allowed domains:</strong>
                <div className="mt-1">
                  {tenant.allowed_email_domains.length > 0 ? (
                    tenant.allowed_email_domains.map((domain, index) => (
                      <span key={index} className="inline-block bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs mr-1 mb-1">
                        {domain}
                      </span>
                    ))
                  ) : (
                    <span className="text-gray-500">Any domain</span>
                  )}
                </div>
              </div>

              <button className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors">
                Access {tenant.name}
              </button>
            </div>
          ))}
        </div>

        {tenants.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-500 text-6xl mb-4">🏢</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">No Organizations Found</h2>
            <p className="text-gray-600 mb-6">
              You don't have access to any organizations yet. Contact your administrator for access.
            </p>
            <button
              onClick={() => window.location.href = '/dashboard'}
              className="bg-gray-600 text-white px-6 py-2 rounded-lg hover:bg-gray-700"
            >
              Go to Dashboard
            </button>
          </div>
        )}
      </div>
    </div>
  );
}; 