import React, { useState, useEffect } from 'react';
import { getUserInfo } from '../utils/cognitoAuth';
import { TreePine, Building2, Sparkles, CheckCircle2, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useNavigate, useParams } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';
import BluePineLogo from "@/components/ui/BluePineLogo";

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
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    fetchAccessibleTenants();
    setTimeout(() => setIsVisible(true), 100);
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
      <div className="min-h-screen bg-gradient-to-br from-white via-slate-50/30 to-blue-50/20 flex items-center justify-center">
        {/* Background texture */}
        <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-100/20 via-transparent to-slate-100/20 pointer-events-none"></div>
        
        <div className="relative text-center">
          <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-6"></div>
          <div className="space-y-2">
            <h2 className="text-xl font-semibold bg-gradient-to-r from-slate-900 via-blue-900 to-slate-800 bg-clip-text text-transparent">
              Loading Organizations
            </h2>
            <p className="text-slate-600">Please wait while we fetch your workspaces...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-white via-slate-50/30 to-blue-50/20 flex items-center justify-center">
        {/* Background texture */}
        <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-100/20 via-transparent to-slate-100/20 pointer-events-none"></div>
        
        <div className="relative text-center max-w-md mx-auto px-6">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-red-500/10 to-red-300/10 flex items-center justify-center mx-auto mb-6">
            <div className="text-red-500 text-4xl">⚠️</div>
          </div>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-slate-900 via-red-900 to-slate-800 bg-clip-text text-transparent mb-4">
            Something went wrong
          </h1>
          <p className="text-slate-600 mb-8">{error}</p>
          <button
            onClick={() => window.location.href = '/signin'}
            className="w-full py-3 px-6 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02]"
          >
            Sign In Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-slate-50/30 to-blue-50/20 font-sans">
      {/* Background texture */}
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-100/20 via-transparent to-slate-100/20 pointer-events-none"></div>
      
      <div className="relative py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Apple-inspired Header */}
          <div className={`text-center mb-16 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <div className="text-center mb-12">
              <div className="flex items-center justify-center space-x-4 mb-6">
                <BluePineLogo className="w-10 h-10" />
                <div>
                  <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-900 via-blue-900 to-slate-900 bg-clip-text text-transparent">
                    Blue Pine AI
                  </h1>
                  <p className="text-slate-600">Multi-Tenant Access</p>
                </div>
              </div>
            </div>
          </div>

          {/* Apple-inspired Organization Cards */}
          <div className={`grid gap-8 md:grid-cols-2 lg:grid-cols-2 transition-all duration-1000 delay-200 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            {tenants.map((tenant, index) => (
              <div
                key={tenant.id}
                className="group relative overflow-hidden bg-gradient-to-br from-white via-blue-50/30 to-slate-50/50 backdrop-blur-sm border border-slate-200/50 rounded-2xl transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl cursor-pointer"
                onClick={() => selectTenant(tenant.id)}
                style={{ animationDelay: `${index * 150}ms` }}
              >
                {/* Floating background elements */}
                <div className="absolute -top-4 -right-4 w-24 h-24 bg-gradient-to-br from-blue-500/10 to-blue-300/10 rounded-full blur-2xl"></div>
                <div className="absolute -bottom-4 -left-4 w-20 h-20 bg-gradient-to-br from-slate-400/10 to-slate-200/10 rounded-full blur-2xl"></div>
                
                <div className="relative p-8">
                  {/* Header with organization icon and status */}
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center space-x-4">
                      <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                        <Building2 className="w-7 h-7 text-white" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-slate-900 group-hover:text-slate-800 transition-colors duration-200">
                          {tenant.name}
                        </h3>
                      </div>
                    </div>
                    <div className={`flex items-center space-x-2 px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-300 ${
                      tenant.status === 'active' 
                        ? 'bg-green-50 text-green-700 border border-green-200/50' 
                        : 'bg-slate-50 text-slate-700 border border-slate-200/50'
                    }`}>
                      {tenant.status === 'active' && <CheckCircle2 className="w-3 h-3" />}
                      <span className="capitalize">{tenant.status}</span>
                    </div>
                  </div>
                  
                  {/* Plan Badge */}
                  <div className="mb-6">
                    <span className={`inline-flex items-center space-x-2 px-4 py-2 rounded-xl text-sm font-semibold capitalize transition-all duration-300 ${
                      tenant.plan === 'enterprise' 
                        ? 'bg-gradient-to-r from-purple-100 to-purple-50 text-purple-700 border border-purple-200/50' :
                      tenant.plan === 'pro' 
                        ? 'bg-gradient-to-r from-blue-100 to-blue-50 text-blue-700 border border-blue-200/50' : 
                        'bg-gradient-to-r from-slate-100 to-slate-50 text-slate-700 border border-slate-200/50'
                    }`}>
                      <Sparkles className="w-3 h-3" />
                      <span>{tenant.plan} Plan</span>
                    </span>
                  </div>

                  {/* Allowed Domains */}
                  <div className="mb-8">
                    <h4 className="text-sm font-semibold text-slate-700 mb-3">Allowed domains:</h4>
                    <div className="flex flex-wrap gap-2">
                      {tenant.allowed_email_domains.length > 0 ? (
                        tenant.allowed_email_domains.map((domain, index) => (
                          <span 
                            key={index} 
                            className="inline-block bg-gradient-to-r from-slate-100 to-slate-50 text-slate-700 px-3 py-1.5 rounded-lg text-xs font-medium border border-slate-200/50"
                          >
                            {domain}
                          </span>
                        ))
                      ) : (
                        <span className="text-slate-500 text-sm italic">Any domain allowed</span>
                      )}
                    </div>
                  </div>

                  {/* Apple-style Access Button */}
                  <button className="w-full flex items-center justify-center space-x-2 py-4 px-6 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 group-hover:scale-[1.02] group/button">
                    <span>Access {tenant.name}</span>
                    <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover/button:translate-x-1" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* No Organizations State */}
          {tenants.length === 0 && (
            <div className={`text-center py-20 transition-all duration-1000 delay-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
              <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-slate-100 to-slate-50 flex items-center justify-center mx-auto mb-8 border border-slate-200/50">
                <Building2 className="w-12 h-12 text-slate-400" />
              </div>
              <h2 className="text-2xl font-bold bg-gradient-to-r from-slate-900 via-slate-700 to-slate-900 bg-clip-text text-transparent mb-4">
                No Organizations Found
              </h2>
              <p className="text-slate-600 mb-8 max-w-md mx-auto">
                You don't have access to any organizations yet. Contact your administrator to get started.
              </p>
              <button
                onClick={() => window.location.href = '/dashboard'}
                className="inline-flex items-center space-x-2 py-3 px-8 bg-gradient-to-r from-slate-600 to-slate-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02]"
              >
                <span>Go to Dashboard</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}; 