import React, { useState, useEffect } from 'react';
import { Building, Users, Mail, Settings, FileText, Plus, Edit, Trash2, Check, X, Calculator, Clock, DollarSign, Eye, Send } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import BluePineLogo from "@/components/ui/BluePineLogo";

interface Tenant {
  id: string;
  name: string;
  plan: string;
  status: string;
  allowed_email_domains: string[];
  created_at: string;
}

interface User {
  tenant_id: string;
  user_sub: string;
  role: string;
  email?: string;
}

interface AccessRequest {
  user_sub: string;
  name: string;
  email: string;
  company: string;
  role: string;
  message: string;
  status: 'pending' | 'approved' | 'rejected';
  admin_notes?: string;
  created_at: string;
  updated_at: string;
}

interface Invoice {
  id: string;
  tenant_id: string;
  invoice_number: string;
  client_name: string;
  client_email: string;
  client_address: string;
  issue_date: string;
  due_date: string;
  status: 'draft' | 'sent' | 'paid' | 'overdue';
  subtotal: number;
  tax_rate: number;
  tax_amount: number;
  total: number;
  items: InvoiceItem[];
  notes?: string;
  created_at: string;
}

interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  rate: number;
  amount: number;
}

export const Admin: React.FC = () => {
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [accessRequests, setAccessRequests] = useState<AccessRequest[]>([]);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTab, setSelectedTab] = useState<'tenants' | 'users' | 'invitations' | 'access-requests' | 'invoices' | 'analytics'>('tenants');
  const [isVisible, setIsVisible] = useState(false);
  const [showInvoiceForm, setShowInvoiceForm] = useState(false);

  // Animation state
  useEffect(() => {
    setTimeout(() => setIsVisible(true), 100);
  }, []);

  // Create Tenant Form State
  const [newTenant, setNewTenant] = useState({
    id: '',
    name: '',
    plan: 'pro',
    allowed_email_domains: ''
  });

  // Add User Form State
  const [newUser, setNewUser] = useState({
    tenant_id: '',
    email: '',
    role: 'user'
  });

  // Invitation Form State
  const [newInvitation, setNewInvitation] = useState({
    tenant_id: '',
    email: '',
    role: 'user'
  });

  // Email test state
  const [emailTestResult, setEmailTestResult] = useState<string | null>(null);
  const [emailTesting, setEmailTesting] = useState(false);

  // Edit tenant state
  const [editingTenant, setEditingTenant] = useState<string | null>(null);
  const [editTenantData, setEditTenantData] = useState({
    name: '',
    allowed_email_domains: ''
  });

  // New invoice state
  const [newInvoice, setNewInvoice] = useState({
    tenant_id: '',
    client_name: '',
    client_email: '',
    client_address: '',
    due_date: '',
    tax_rate: 8.5,
    notes: '',
    items: [{ id: '1', description: '', quantity: 1, rate: 0, amount: 0 }] as InvoiceItem[]
  });

  const [analyticsData, setAnalyticsData] = useState({
    conversationStats: {
      totalConversations: 0,
      avgSatisfactionScore: 0,
      topCategories: [],
      responseTimeAvg: 0
    },
    feedbackTrends: [],
    commonQuestions: [],
    improvementAreas: []
  });

  useEffect(() => {
    fetchTenants();
    if (selectedTab === 'access-requests') {
      fetchAccessRequests();
    }
    if (selectedTab === 'invoices') {
      fetchInvoices();
    }
    if (selectedTab === 'analytics') {
      fetchAnalytics();
    }
  }, [selectedTab]);

  const fetchTenants = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/admin/tenants');
      const data = await response.json();
      setTenants(data);
    } catch (error) {
      console.error('Error fetching tenants:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchAccessRequests = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/admin/access-requests');
      const data = await response.json();
      setAccessRequests(data);
    } catch (error) {
      console.error('Error fetching access requests:', error);
    }
  };

  const fetchInvoices = async () => {
    try {
      // For now, we'll use mock data until we implement the API endpoint
      const mockInvoices: Invoice[] = [
        {
          id: '1',
          tenant_id: 'blue-pine-test',
          invoice_number: 'INV-2024-001',
          client_name: 'Mayo Clinic',
          client_email: 'billing@mayoclinic.org',
          client_address: '200 First St SW, Rochester, MN 55905',
          issue_date: '2024-01-15',
          due_date: '2024-02-15',
          status: 'sent',
          subtotal: 5000,
          tax_rate: 8.5,
          tax_amount: 425,
          total: 5425,
          items: [
            { id: '1', description: 'Healthcare RCM Platform - Monthly Subscription', quantity: 1, rate: 5000, amount: 5000 }
          ],
          notes: 'Thank you for your business!',
          created_at: '2024-01-15T10:00:00Z'
        }
      ];
      setInvoices(mockInvoices);
    } catch (error) {
      console.error('Error fetching invoices:', error);
    }
  };

  const fetchAnalytics = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/admin/analytics');
      const data = await response.json();
      setAnalyticsData(data);
    } catch (error) {
      console.error('Error fetching analytics:', error);
    }
  };

  // Invoice functions
  const addInvoiceItem = () => {
    const newItem: InvoiceItem = {
      id: Date.now().toString(),
      description: '',
      quantity: 1,
      rate: 0,
      amount: 0
    };
    setNewInvoice({
      ...newInvoice,
      items: [...newInvoice.items, newItem]
    });
  };

  const updateInvoiceItem = (id: string, field: keyof InvoiceItem, value: string | number) => {
    const updatedItems = newInvoice.items.map(item => {
      if (item.id === id) {
        const updatedItem = { ...item, [field]: value };
        if (field === 'quantity' || field === 'rate') {
          updatedItem.amount = updatedItem.quantity * updatedItem.rate;
        }
        return updatedItem;
      }
      return item;
    });
    setNewInvoice({ ...newInvoice, items: updatedItems });
  };

  const removeInvoiceItem = (id: string) => {
    if (newInvoice.items.length > 1) {
      setNewInvoice({
        ...newInvoice,
        items: newInvoice.items.filter(item => item.id !== id)
      });
    }
  };

  const calculateInvoiceTotals = () => {
    const subtotal = newInvoice.items.reduce((sum, item) => sum + item.amount, 0);
    const taxAmount = subtotal * (newInvoice.tax_rate / 100);
    const total = subtotal + taxAmount;
    return { subtotal, taxAmount, total };
  };

  const createInvoice = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const totals = calculateInvoiceTotals();
      const invoiceData = {
        ...newInvoice,
        invoice_number: `INV-${new Date().getFullYear()}-${String(invoices.length + 1).padStart(3, '0')}`,
        issue_date: new Date().toISOString().split('T')[0],
        status: 'draft',
        subtotal: totals.subtotal,
        tax_amount: totals.taxAmount,
        total: totals.total,
        created_at: new Date().toISOString()
      };

      // For now, just add to local state
      setInvoices([invoiceData as Invoice, ...invoices]);
      
      // Reset form
      setNewInvoice({
        tenant_id: '',
        client_name: '',
        client_email: '',
        client_address: '',
        due_date: '',
        tax_rate: 8.5,
        notes: '',
        items: [{ id: '1', description: '', quantity: 1, rate: 0, amount: 0 }]
      });
      setShowInvoiceForm(false);
      
      alert('Invoice created successfully!');
    } catch (error) {
      console.error('Error creating invoice:', error);
      alert('Failed to create invoice');
    }
  };

  const createTenant = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:3001/api/admin/tenants', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: newTenant.id,
          name: newTenant.name,
          plan: newTenant.plan,
          allowed_email_domains: newTenant.allowed_email_domains.split(',').map(d => d.trim()).filter(d => d)
        }),
      });

      if (response.ok) {
        fetchTenants();
        setNewTenant({
          id: '',
          name: '',
          plan: 'pro',
          allowed_email_domains: ''
        });
        alert('Tenant created successfully!');
      } else {
        throw new Error('Failed to create tenant');
      }
    } catch (error) {
      console.error('Error creating tenant:', error);
      alert('Failed to create tenant');
    }
  };

  const addUserToTenant = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:3001/api/admin/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newUser),
      });

      if (response.ok) {
        setNewUser({
          tenant_id: '',
          email: '',
          role: 'user'
        });
        alert('User added successfully!');
      } else {
        throw new Error('Failed to add user');
      }
    } catch (error) {
      console.error('Error adding user:', error);
      alert('Failed to add user');
    }
  };

  const sendInvitation = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:3001/api/admin/invitations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newInvitation),
      });

      if (response.ok) {
        setNewInvitation({
          tenant_id: '',
          email: '',
          role: 'user'
        });
        alert('Invitation sent successfully!');
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to send invitation');
      }
    } catch (error) {
      console.error('Error sending invitation:', error);
      alert(`Failed to send invitation: ${error.message}`);
    }
  };

  const testEmailConfiguration = async () => {
    setEmailTesting(true);
    try {
      const response = await fetch('http://localhost:3001/api/admin/test-email', {
        method: 'POST',
      });

      const result = await response.json();
      setEmailTestResult(result.message);
    } catch (error) {
      setEmailTestResult('Error testing email configuration: ' + error.message);
    } finally {
      setEmailTesting(false);
    }
  };

  const toggleTenantStatus = async (tenantId: string, currentStatus: string) => {
    try {
      const newStatus = currentStatus === 'active' ? 'inactive' : 'active';
      const response = await fetch(`http://localhost:3001/api/admin/tenants/${tenantId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
        fetchTenants();
        alert(`Tenant ${newStatus === 'active' ? 'enabled' : 'disabled'} successfully!`);
      } else {
        throw new Error('Failed to update tenant status');
      }
    } catch (error) {
      console.error('Error updating tenant status:', error);
      alert('Failed to update tenant status');
    }
  };

  const startEditingTenant = (tenant: Tenant) => {
    setEditingTenant(tenant.id);
    setEditTenantData({
      name: tenant.name,
      allowed_email_domains: tenant.allowed_email_domains?.join(', ') || ''
    });
  };

  const saveEditedTenant = async (tenantId: string) => {
    try {
      const response = await fetch(`http://localhost:3001/api/admin/tenants/${tenantId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: editTenantData.name,
          allowed_email_domains: editTenantData.allowed_email_domains
            .split(',')
            .map(d => d.trim())
            .filter(d => d)
        }),
      });

      if (response.ok) {
        fetchTenants();
        setEditingTenant(null);
        alert('Tenant updated successfully!');
      } else {
        throw new Error('Failed to update tenant');
      }
    } catch (error) {
      console.error('Error updating tenant:', error);
      alert('Failed to update tenant');
    }
  };

  const cancelEditing = () => {
    setEditingTenant(null);
    setEditTenantData({ name: '', allowed_email_domains: '' });
  };

  const updateAccessRequestStatus = async (userSub: string, status: 'approved' | 'rejected', adminNotes?: string) => {
    try {
      const response = await fetch(`http://localhost:3001/api/admin/access-requests/${userSub}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status, admin_notes: adminNotes }),
      });

      if (response.ok) {
        fetchAccessRequests();
        alert(`Access request ${status} successfully!`);
      } else {
        throw new Error(`Failed to ${status} access request`);
      }
    } catch (error) {
      console.error(`Error ${status}ing access request:`, error);
      alert(`Failed to ${status} access request`);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 flex items-center justify-center">
        <div className="relative">
          <div className="relative backdrop-blur-xl bg-white/70 p-12 rounded-3xl border border-white/20 shadow-2xl">
            <div className="flex items-center justify-center space-x-4">
              <BluePineLogo className="w-8 h-8 animate-spin" />
              <div className="text-2xl font-semibold bg-gradient-to-r from-slate-900 to-slate-600 bg-clip-text text-transparent">
                Loading Admin Panel...
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 relative overflow-hidden">
      {/* Apple-inspired floating background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-500/10 to-blue-300/10 rounded-full blur-3xl animate-pulse-slow"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-br from-slate-400/10 to-slate-200/10 rounded-full blur-3xl animate-pulse-slow delay-2000"></div>
        <div className="absolute top-1/3 left-1/4 w-64 h-64 bg-gradient-to-br from-blue-400/5 to-blue-200/5 rounded-full blur-3xl animate-pulse-slow delay-1000"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-12">
        {/* Header Section with Apple aesthetics */}
        <div className="mb-12">
          <div className="flex items-center space-x-6 mb-8">
            <div className="flex items-center space-x-4 mb-8">
              <BluePineLogo className="w-8 h-8" />
              <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-900 via-blue-900 to-slate-900 bg-clip-text text-transparent">
                Blue Pine AI Admin
              </h1>
            </div>
          </div>

          {/* Apple-style Navigation Tabs */}
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-white/80 to-white/60 backdrop-blur-xl rounded-2xl"></div>
            <div className="relative flex space-x-2 p-2 backdrop-blur-xl bg-white/70 rounded-2xl border border-white/20 shadow-xl">
              {[
                { id: 'tenants', icon: Building, label: 'Tenants' },
                { id: 'users', icon: Users, label: 'Users' },
                { id: 'invitations', icon: Mail, label: 'Invitations' },
                { id: 'access-requests', icon: Settings, label: 'Requests' },
                { id: 'invoices', icon: FileText, label: 'Invoices' },
                { id: 'analytics', icon: Calculator, label: 'AI Analytics' }
              ].map((tab) => (
            <button
                  key={tab.id}
                  onClick={() => setSelectedTab(tab.id as any)}
                  className={`flex-1 flex items-center justify-center space-x-3 py-4 px-6 rounded-xl font-medium transition-all duration-300 ${
                    selectedTab === tab.id
                      ? 'bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-lg scale-105'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
                  }`}
                >
                  <tab.icon className="w-5 h-5" />
                  <span>{tab.label}</span>
            </button>
              ))}
            </div>
          </div>
        </div>

        {/* Content Sections with Apple-inspired design */}
        <div className="space-y-8">
        {selectedTab === 'tenants' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Create New Tenant Card */}
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-br from-white/80 to-white/60 backdrop-blur-xl rounded-3xl border border-white/20 shadow-2xl"></div>
                <div className="relative p-8 backdrop-blur-xl bg-white/40 rounded-3xl border border-white/20 hover:shadow-3xl transition-all duration-500">
                  <div className="flex items-center space-x-4 mb-8">
                    <div className="p-3 bg-gradient-to-br from-blue-600 to-blue-500 rounded-2xl">
                      <Plus className="w-6 h-6 text-white" />
                    </div>
                    <h2 className="text-2xl font-semibold bg-gradient-to-r from-slate-900 to-slate-600 bg-clip-text text-transparent">
                      Create New Tenant
                    </h2>
                  </div>

                  <form onSubmit={createTenant} className="space-y-6">
                <div>
                      <label className="block text-sm font-medium text-slate-700 mb-3">Tenant ID</label>
                  <input
                    type="text"
                        placeholder="mayo-clinic, cleveland-clinic"
                    value={newTenant.id}
                    onChange={(e) => setNewTenant({...newTenant, id: e.target.value})}
                        className="w-full px-4 py-4 bg-white/70 backdrop-blur-sm border border-white/30 rounded-xl focus:ring-2 focus:ring-blue-500/50 focus:border-blue-400 transition-all duration-300 text-slate-900 placeholder-slate-500"
                    required
                  />
                </div>

                <div>
                      <label className="block text-sm font-medium text-slate-700 mb-3">Company Name</label>
                  <input
                    type="text"
                        placeholder="Mayo Clinic, Cleveland Clinic"
                    value={newTenant.name}
                    onChange={(e) => setNewTenant({...newTenant, name: e.target.value})}
                        className="w-full px-4 py-4 bg-white/70 backdrop-blur-sm border border-white/30 rounded-xl focus:ring-2 focus:ring-blue-500/50 focus:border-blue-400 transition-all duration-300 text-slate-900 placeholder-slate-500"
                    required
                  />
                </div>

                <div>
                      <label className="block text-sm font-medium text-slate-700 mb-3">Plan</label>
                  <select
                    value={newTenant.plan}
                    onChange={(e) => setNewTenant({...newTenant, plan: e.target.value})}
                        className="w-full px-4 py-4 bg-white/70 backdrop-blur-sm border border-white/30 rounded-xl focus:ring-2 focus:ring-blue-500/50 focus:border-blue-400 transition-all duration-300 text-slate-900"
                  >
                    <option value="pro">Pro</option>
                    <option value="enterprise">Enterprise</option>
                        <option value="basic">Basic</option>
                  </select>
                </div>

                <div>
                      <label className="block text-sm font-medium text-slate-700 mb-3">Allowed Email Domains</label>
                  <input
                    type="text"
                        placeholder="mayoclinic.org, mayo.edu (comma separated)"
                    value={newTenant.allowed_email_domains}
                    onChange={(e) => setNewTenant({...newTenant, allowed_email_domains: e.target.value})}
                        className="w-full px-4 py-4 bg-white/70 backdrop-blur-sm border border-white/30 rounded-xl focus:ring-2 focus:ring-blue-500/50 focus:border-blue-400 transition-all duration-300 text-slate-900 placeholder-slate-500"
                  />
                      <p className="text-xs text-slate-500 mt-2">Leave empty to allow any email domain</p>
                </div>

                <button
                  type="submit"
                      className="w-full bg-gradient-to-r from-blue-600 to-blue-500 text-white font-medium py-4 rounded-xl hover:from-blue-700 hover:to-blue-600 focus:ring-2 focus:ring-blue-500/50 transition-all duration-300 shadow-lg hover:shadow-xl"
                >
                  Create Tenant
                </button>
              </form>
                </div>
              </div>

              {/* Existing Tenants Card */}
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-br from-white/80 to-white/60 backdrop-blur-xl rounded-3xl border border-white/20 shadow-2xl"></div>
                <div className="relative p-8 backdrop-blur-xl bg-white/40 rounded-3xl border border-white/20 hover:shadow-3xl transition-all duration-500">
                  <div className="flex items-center space-x-4 mb-8">
                    <div className="p-3 bg-gradient-to-br from-slate-600 to-slate-500 rounded-2xl">
                      <Building className="w-6 h-6 text-white" />
                    </div>
                    <h2 className="text-2xl font-semibold bg-gradient-to-r from-slate-900 to-slate-600 bg-clip-text text-transparent">
                      Existing Tenants
                    </h2>
            </div>

                  <div className="space-y-4 max-h-96 overflow-y-auto">
                {tenants.map((tenant) => (
                      <div key={tenant.id} className="relative group/tenant">
                        <div className="absolute inset-0 bg-gradient-to-r from-white/60 to-white/40 backdrop-blur-sm rounded-2xl opacity-0 group-hover/tenant:opacity-100 transition-all duration-300"></div>
                        <div className="relative p-6 backdrop-blur-sm bg-white/30 rounded-2xl border border-white/20 hover:shadow-lg transition-all duration-300">
                          <div className="flex justify-between items-start mb-4">
                            <div>
                              <h3 className="font-semibold text-slate-900 text-lg">{tenant.name}</h3>
                              <p className="text-sm text-slate-600">ID: {tenant.id}</p>
                              <p className="text-sm text-slate-600">Plan: {tenant.plan}</p>
                              <p className="text-sm text-slate-600">
                                Domains: {tenant.allowed_email_domains?.join(', ') || 'Any domain'}
                              </p>
                            </div>
                      <div className="flex items-center space-x-2">
                              <button
                                onClick={() => startEditingTenant(tenant)}
                                className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                              >
                                <Edit className="w-4 h-4" />
                              </button>
                        <button
                          onClick={() => toggleTenantStatus(tenant.id, tenant.status)}
                                className={`px-3 py-1 rounded-full text-xs font-medium ${
                            tenant.status === 'active' 
                                    ? 'bg-red-100 text-red-700 hover:bg-red-200'
                                    : 'bg-green-100 text-green-700 hover:bg-green-200'
                          }`}
                        >
                          {tenant.status === 'active' ? 'Disable' : 'Enable'}
                        </button>
                      </div>
                    </div>
                          
                          <div className="flex items-center justify-between">
                            <div className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                              tenant.status === 'active' 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-gray-100 text-gray-800'
                            }`}>
                              <div className={`w-2 h-2 rounded-full mr-2 ${
                                tenant.status === 'active' ? 'bg-green-400' : 'bg-gray-400'
                              }`}></div>
                              Tenant {tenant.status?.toUpperCase() || 'ACTIVE'}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {selectedTab === 'invoices' && (
            <div className="space-y-8">
              {/* Invoice Creation Form */}
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-white/80 to-white/60 backdrop-blur-xl rounded-3xl border border-white/20 shadow-2xl"></div>
                <div className="relative p-8 backdrop-blur-xl bg-white/40 rounded-3xl border border-white/20">
                  <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center space-x-4">
                      <div className="p-3 bg-gradient-to-br from-blue-600 to-blue-500 rounded-2xl">
                        <FileText className="w-6 h-6 text-white" />
                      </div>
                      <h2 className="text-2xl font-semibold bg-gradient-to-r from-slate-900 to-slate-600 bg-clip-text text-transparent">
                        Invoice Management
                      </h2>
                    </div>
                    <button
                      onClick={() => setShowInvoiceForm(!showInvoiceForm)}
                      className="flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-blue-500 text-white px-6 py-3 rounded-xl hover:from-blue-700 hover:to-blue-600 transition-all duration-300 shadow-lg hover:shadow-xl"
                    >
                      <Plus className="w-5 h-5" />
                      <span>Create Invoice</span>
                    </button>
                  </div>

                  {/* Invoice Creation Modal */}
                  {showInvoiceForm && (
                    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                      <div className="relative max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="absolute inset-0 bg-gradient-to-br from-white/95 to-white/90 backdrop-blur-xl rounded-3xl"></div>
                        <div className="relative p-8 backdrop-blur-xl bg-white/80 rounded-3xl border border-white/30 shadow-3xl">
                          <div className="flex items-center justify-between mb-8">
                            <div className="flex items-center space-x-4">
                              <div className="p-3 bg-gradient-to-br from-blue-600 to-blue-500 rounded-2xl">
                                <Calculator className="w-6 h-6 text-white" />
                              </div>
                              <h3 className="text-2xl font-semibold bg-gradient-to-r from-slate-900 to-slate-600 bg-clip-text text-transparent">
                                Create New Invoice
                              </h3>
                            </div>
                            <button
                              onClick={() => setShowInvoiceForm(false)}
                              className="p-2 text-slate-500 hover:text-slate-700 hover:bg-white/50 rounded-xl transition-all duration-200"
                            >
                              <X className="w-6 h-6" />
                            </button>
                          </div>

                          <form onSubmit={createInvoice} className="space-y-8">
                            {/* Client Information */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                              <div>
                                <label className="block text-sm font-medium text-slate-700 mb-3">Client Name</label>
                                <input
                                  type="text"
                                  value={newInvoice.client_name}
                                  onChange={(e) => setNewInvoice({...newInvoice, client_name: e.target.value})}
                                  className="w-full px-4 py-4 bg-white/70 backdrop-blur-sm border border-white/30 rounded-xl focus:ring-2 focus:ring-blue-500/50 focus:border-blue-400 transition-all duration-300"
                                  required
                                />
                              </div>
                              <div>
                                <label className="block text-sm font-medium text-slate-700 mb-3">Client Email</label>
                                <input
                                  type="email"
                                  value={newInvoice.client_email}
                                  onChange={(e) => setNewInvoice({...newInvoice, client_email: e.target.value})}
                                  className="w-full px-4 py-4 bg-white/70 backdrop-blur-sm border border-white/30 rounded-xl focus:ring-2 focus:ring-blue-500/50 focus:border-blue-400 transition-all duration-300"
                                  required
                                />
                              </div>
                            </div>

                            <div>
                              <label className="block text-sm font-medium text-slate-700 mb-3">Client Address</label>
                              <textarea
                                value={newInvoice.client_address}
                                onChange={(e) => setNewInvoice({...newInvoice, client_address: e.target.value})}
                                rows={3}
                                className="w-full px-4 py-4 bg-white/70 backdrop-blur-sm border border-white/30 rounded-xl focus:ring-2 focus:ring-blue-500/50 focus:border-blue-400 transition-all duration-300"
                                required
                              />
                            </div>

                            {/* Invoice Items */}
                            <div className="space-y-6">
                              <div className="flex items-center justify-between">
                                <h4 className="text-lg font-semibold text-slate-900">Invoice Items</h4>
                                <button
                                  type="button"
                                  onClick={addInvoiceItem}
                                  className="flex items-center space-x-2 text-blue-600 hover:bg-blue-50 px-3 py-2 rounded-lg transition-colors"
                                >
                                  <Plus className="w-4 h-4" />
                                  <span>Add Item</span>
                                </button>
                              </div>

                              {newInvoice.items.map((item) => (
                                <div key={item.id} className="relative p-6 bg-white/50 backdrop-blur-sm rounded-2xl border border-white/30">
                                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                    <div className="md:col-span-2">
                                      <label className="block text-sm font-medium text-slate-700 mb-2">Description</label>
                                      <input
                                        type="text"
                                        value={item.description}
                                        onChange={(e) => updateInvoiceItem(item.id, 'description', e.target.value)}
                                        className="w-full px-3 py-3 bg-white/70 border border-white/30 rounded-lg focus:ring-2 focus:ring-blue-500/50 transition-all duration-300"
                                        required
                                      />
                                    </div>
                                    <div>
                                      <label className="block text-sm font-medium text-slate-700 mb-2">Quantity</label>
                                      <input
                                        type="number"
                                        value={item.quantity}
                                        onChange={(e) => updateInvoiceItem(item.id, 'quantity', Number(e.target.value))}
                                        className="w-full px-3 py-3 bg-white/70 border border-white/30 rounded-lg focus:ring-2 focus:ring-blue-500/50 transition-all duration-300"
                                        min="1"
                                        required
                                      />
                                    </div>
                                    <div>
                                      <label className="block text-sm font-medium text-slate-700 mb-2">Rate ($)</label>
                                      <input
                                        type="number"
                                        value={item.rate}
                                        onChange={(e) => updateInvoiceItem(item.id, 'rate', Number(e.target.value))}
                                        className="w-full px-3 py-3 bg-white/70 border border-white/30 rounded-lg focus:ring-2 focus:ring-blue-500/50 transition-all duration-300"
                                        min="0"
                                        step="0.01"
                                        required
                                      />
                                    </div>
                                  </div>
                                  <div className="flex items-center justify-between mt-4">
                                    <div className="text-lg font-semibold text-slate-900">
                                      Amount: ${item.amount.toFixed(2)}
                                    </div>
                                    {newInvoice.items.length > 1 && (
                                      <button
                                        type="button"
                                        onClick={() => removeInvoiceItem(item.id)}
                                        className="text-red-600 hover:bg-red-50 p-2 rounded-lg transition-colors"
                                      >
                                        <Trash2 className="w-4 h-4" />
                                      </button>
                                    )}
                    </div>
                  </div>
                ))}
                            </div>

                            {/* Invoice Totals */}
                            <div className="relative p-6 bg-gradient-to-br from-slate-50/80 to-slate-100/80 backdrop-blur-sm rounded-2xl border border-white/30">
                              <div className="space-y-4">
                                <div className="flex justify-between items-center">
                                  <span className="text-slate-700">Subtotal:</span>
                                  <span className="font-semibold text-slate-900">
                                    ${calculateInvoiceTotals().subtotal.toFixed(2)}
                                  </span>
                                </div>
                                <div className="flex justify-between items-center">
                                  <div className="flex items-center space-x-2">
                                    <span className="text-slate-700">Tax Rate:</span>
                                    <input
                                      type="number"
                                      value={newInvoice.tax_rate}
                                      onChange={(e) => setNewInvoice({...newInvoice, tax_rate: Number(e.target.value)})}
                                      className="w-20 px-2 py-1 bg-white/70 border border-white/30 rounded-lg text-sm"
                                      min="0"
                                      max="100"
                                      step="0.1"
                                    />
                                    <span className="text-slate-700">%</span>
                                  </div>
                                  <span className="font-semibold text-slate-900">
                                    ${calculateInvoiceTotals().taxAmount.toFixed(2)}
                                  </span>
                                </div>
                                <div className="flex justify-between items-center text-xl font-bold text-slate-900 pt-4 border-t border-slate-200">
                                  <span>Total:</span>
                                  <span>${calculateInvoiceTotals().total.toFixed(2)}</span>
                                </div>
                              </div>
                            </div>

                            <div className="flex items-center space-x-4">
                              <button
                                type="button"
                                onClick={() => setShowInvoiceForm(false)}
                                className="flex-1 px-6 py-4 bg-white/70 text-slate-700 font-medium rounded-xl hover:bg-white/90 transition-all duration-300 border border-white/30"
                              >
                                Cancel
                              </button>
                              <button
                                type="submit"
                                className="flex-1 bg-gradient-to-r from-blue-600 to-blue-500 text-white font-medium py-4 rounded-xl hover:from-blue-700 hover:to-blue-600 transition-all duration-300 shadow-lg hover:shadow-xl"
                              >
                                Create Invoice
                              </button>
                            </div>
                          </form>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Existing Invoices */}
                  <div className="space-y-6">
                    <h3 className="text-xl font-semibold text-slate-900">Recent Invoices</h3>
                    {invoices.map((invoice) => (
                      <div key={invoice.id} className="relative group/invoice">
                        <div className="absolute inset-0 bg-gradient-to-r from-white/60 to-white/40 backdrop-blur-sm rounded-2xl opacity-0 group-hover/invoice:opacity-100 transition-all duration-300"></div>
                        <div className="relative p-6 backdrop-blur-sm bg-white/30 rounded-2xl border border-white/20 hover:shadow-lg transition-all duration-300">
                          <div className="flex items-center justify-between mb-4">
                            <div>
                              <h4 className="text-lg font-semibold text-slate-900">{invoice.invoice_number}</h4>
                              <p className="text-slate-600">{invoice.client_name}</p>
                              <p className="text-sm text-slate-500">{invoice.client_email}</p>
                            </div>
                            <div className="text-right">
                              <div className="text-2xl font-bold text-slate-900">${invoice.total.toFixed(2)}</div>
                              <div className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                                invoice.status === 'paid' ? 'bg-green-100 text-green-800' :
                                invoice.status === 'sent' ? 'bg-blue-100 text-blue-800' :
                                invoice.status === 'overdue' ? 'bg-red-100 text-red-800' :
                                'bg-gray-100 text-gray-800'
                              }`}>
                                {invoice.status.toUpperCase()}
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex items-center justify-between text-sm text-slate-600">
                            <div className="flex items-center space-x-4">
                              <div className="flex items-center space-x-1">
                                <Clock className="w-4 h-4" />
                                <span>Due: {new Date(invoice.due_date).toLocaleDateString()}</span>
                              </div>
                              <div className="flex items-center space-x-1">
                                <DollarSign className="w-4 h-4" />
                                <span>Subtotal: ${invoice.subtotal.toFixed(2)}</span>
                              </div>
                            </div>
                            <div className="flex items-center space-x-2">
                              <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                                <Eye className="w-4 h-4" />
                              </button>
                              <button className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors">
                                <Send className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
            </div>
          </div>
        )}

        {selectedTab === 'analytics' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900">AI Analytics & Training Insights</h2>
              <button
                onClick={fetchAnalytics}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Refresh Data
              </button>
            </div>

            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-sm font-medium text-gray-500">Total Conversations</h3>
                <p className="text-2xl font-bold text-gray-900">{analyticsData.conversationStats.totalConversations}</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-sm font-medium text-gray-500">Avg Satisfaction</h3>
                <p className="text-2xl font-bold text-green-600">
                  {(analyticsData.conversationStats.avgSatisfactionScore * 100).toFixed(1)}%
                </p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-sm font-medium text-gray-500">Avg Response Time</h3>
                <p className="text-2xl font-bold text-blue-600">
                  {analyticsData.conversationStats.responseTimeAvg}ms
                </p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-sm font-medium text-gray-500">Top Category</h3>
                <p className="text-2xl font-bold text-purple-600">
                  {analyticsData.conversationStats.topCategories[0] || 'N/A'}
                </p>
              </div>
            </div>

            {/* Common Questions */}
            <div className="bg-white rounded-lg shadow">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">Most Common Questions</h3>
                <p className="text-sm text-gray-500">Questions that could benefit from knowledge base entries</p>
              </div>
              <div className="p-6">
                {analyticsData.commonQuestions.length > 0 ? (
                  <div className="space-y-4">
                    {analyticsData.commonQuestions.map((question, index) => (
                      <div key={index} className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                        <div>
                          <p className="font-medium text-gray-900">{question.text}</p>
                          <p className="text-sm text-gray-500">
                            Asked {question.count} times • Category: {question.category}
                          </p>
                        </div>
                        <button className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700">
                          Add to KB
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500">No common questions data available yet.</p>
                )}
              </div>
            </div>

            {/* Improvement Areas */}
            <div className="bg-white rounded-lg shadow">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">Areas for Improvement</h3>
                <p className="text-sm text-gray-500">Based on negative feedback and low confidence scores</p>
              </div>
              <div className="p-6">
                {analyticsData.improvementAreas.length > 0 ? (
                  <div className="space-y-4">
                    {analyticsData.improvementAreas.map((area, index) => (
                      <div key={index} className="p-4 bg-red-50 border border-red-200 rounded-lg">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="font-medium text-red-900">{area.category}</p>
                            <p className="text-sm text-red-700">{area.description}</p>
                            <p className="text-xs text-red-600 mt-1">
                              {area.occurrences} occurrences • Avg confidence: {(area.avgConfidence * 100).toFixed(1)}%
                            </p>
                          </div>
                          <span className="bg-red-100 text-red-800 px-2 py-1 rounded text-xs font-medium">
                            Priority: {area.priority}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500">No improvement areas identified yet.</p>
                )}
              </div>
            </div>

            {/* Training Recommendations */}
            <div className="bg-white rounded-lg shadow">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">Training Recommendations</h3>
                <p className="text-sm text-gray-500">Suggested actions to improve AI performance</p>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <h4 className="font-medium text-blue-900">📚 Expand Knowledge Base</h4>
                    <p className="text-sm text-blue-700 mt-1">
                      Add frequently asked questions to the knowledge base for more consistent responses.
                    </p>
                  </div>
                  <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                    <h4 className="font-medium text-green-900">🎯 Improve Category Detection</h4>
                    <p className="text-sm text-green-700 mt-1">
                      Review misclassified conversations to enhance intent recognition.
                    </p>
                  </div>
                  <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <h4 className="font-medium text-yellow-900">⚡ Optimize Response Time</h4>
                    <p className="text-sm text-yellow-700 mt-1">
                      Consider caching common responses or using faster model configurations.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {selectedTab === 'users' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Add User Card */}
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-br from-white/80 to-white/60 backdrop-blur-xl rounded-3xl border border-white/20 shadow-2xl"></div>
                <div className="relative p-8 backdrop-blur-xl bg-white/40 rounded-3xl border border-white/20 hover:shadow-3xl transition-all duration-500">
                  <div className="flex items-center space-x-4 mb-8">
                    <div className="p-3 bg-gradient-to-br from-green-600 to-green-500 rounded-2xl">
                      <Users className="w-6 h-6 text-white" />
                    </div>
                    <h2 className="text-2xl font-semibold bg-gradient-to-r from-slate-900 to-slate-600 bg-clip-text text-transparent">
                      Add User to Tenant
                    </h2>
                  </div>

                  <form onSubmit={addUserToTenant} className="space-y-6">
              <div>
                      <label className="block text-sm font-medium text-slate-700 mb-3">Select Tenant</label>
                <select
                  value={newUser.tenant_id}
                  onChange={(e) => setNewUser({...newUser, tenant_id: e.target.value})}
                        className="w-full px-4 py-4 bg-white/70 backdrop-blur-sm border border-white/30 rounded-xl focus:ring-2 focus:ring-green-500/50 focus:border-green-400 transition-all duration-300"
                  required
                >
                  <option value="">Choose a tenant...</option>
                  {tenants.map((tenant) => (
                          <option key={tenant.id} value={tenant.id}>{tenant.name}</option>
                  ))}
                </select>
              </div>

              <div>
                      <label className="block text-sm font-medium text-slate-700 mb-3">User Email</label>
                <input
                  type="email"
                  value={newUser.email}
                  onChange={(e) => setNewUser({...newUser, email: e.target.value})}
                        className="w-full px-4 py-4 bg-white/70 backdrop-blur-sm border border-white/30 rounded-xl focus:ring-2 focus:ring-green-500/50 focus:border-green-400 transition-all duration-300"
                  required
                />
              </div>

              <div>
                      <label className="block text-sm font-medium text-slate-700 mb-3">Role</label>
                <select
                  value={newUser.role}
                  onChange={(e) => setNewUser({...newUser, role: e.target.value})}
                        className="w-full px-4 py-4 bg-white/70 backdrop-blur-sm border border-white/30 rounded-xl focus:ring-2 focus:ring-green-500/50 focus:border-green-400 transition-all duration-300"
                >
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                </select>
              </div>

              <button
                type="submit"
                      className="w-full bg-gradient-to-r from-green-600 to-green-500 text-white font-medium py-4 rounded-xl hover:from-green-700 hover:to-green-600 focus:ring-2 focus:ring-green-500/50 transition-all duration-300 shadow-lg hover:shadow-xl"
                    >
                      Add User
                    </button>
                  </form>
                </div>
              </div>

              {/* User Management Info */}
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-br from-white/80 to-white/60 backdrop-blur-xl rounded-3xl border border-white/20 shadow-2xl"></div>
                <div className="relative p-8 backdrop-blur-xl bg-white/40 rounded-3xl border border-white/20 hover:shadow-3xl transition-all duration-500">
                  <div className="flex items-center space-x-4 mb-8">
                    <div className="p-3 bg-gradient-to-br from-slate-600 to-slate-500 rounded-2xl">
                      <Settings className="w-6 h-6 text-white" />
                    </div>
                    <h2 className="text-2xl font-semibold bg-gradient-to-r from-slate-900 to-slate-600 bg-clip-text text-transparent">
                      User Management
                    </h2>
                  </div>

                  <div className="space-y-6">
                    <div className="p-6 bg-gradient-to-br from-blue-50/80 to-blue-100/80 backdrop-blur-sm rounded-2xl border border-blue-200/30">
                      <h3 className="font-semibold text-blue-900 mb-3">How User Management Works</h3>
                      <ul className="text-sm text-blue-800 space-y-2">
                        <li>• Users are automatically added when they sign in with an allowed email domain</li>
                        <li>• You can manually add users to specific tenants</li>
                        <li>• Admin users can manage tenant settings</li>
                        <li>• Regular users have read-only access</li>
                      </ul>
                    </div>

                    <div className="p-6 bg-gradient-to-br from-amber-50/80 to-amber-100/80 backdrop-blur-sm rounded-2xl border border-amber-200/30">
                      <h3 className="font-semibold text-amber-900 mb-3">Important Notes</h3>
                      <ul className="text-sm text-amber-800 space-y-2">
                        <li>• Users must exist in your authentication system first</li>
                        <li>• Email domains must match tenant configuration</li>
                        <li>• Changes take effect immediately</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {selectedTab === 'invitations' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Send Invitation Card */}
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-br from-white/80 to-white/60 backdrop-blur-xl rounded-3xl border border-white/20 shadow-2xl"></div>
                <div className="relative p-8 backdrop-blur-xl bg-white/40 rounded-3xl border border-white/20 hover:shadow-3xl transition-all duration-500">
                  <div className="flex items-center space-x-4 mb-8">
                    <div className="p-3 bg-gradient-to-br from-purple-600 to-purple-500 rounded-2xl">
                      <Mail className="w-6 h-6 text-white" />
                    </div>
                    <h2 className="text-2xl font-semibold bg-gradient-to-r from-slate-900 to-slate-600 bg-clip-text text-transparent">
                      Send Invitation
                    </h2>
                  </div>

                  <form onSubmit={sendInvitation} className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-3">Select Tenant</label>
                      <select
                        value={newInvitation.tenant_id}
                        onChange={(e) => setNewInvitation({...newInvitation, tenant_id: e.target.value})}
                        className="w-full px-4 py-4 bg-white/70 backdrop-blur-sm border border-white/30 rounded-xl focus:ring-2 focus:ring-purple-500/50 focus:border-purple-400 transition-all duration-300"
                        required
                      >
                        <option value="">Choose a tenant...</option>
                        {tenants.map((tenant) => (
                          <option key={tenant.id} value={tenant.id}>{tenant.name}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-3">Email Address</label>
                      <input
                        type="email"
                        value={newInvitation.email}
                        onChange={(e) => setNewInvitation({...newInvitation, email: e.target.value})}
                        className="w-full px-4 py-4 bg-white/70 backdrop-blur-sm border border-white/30 rounded-xl focus:ring-2 focus:ring-purple-500/50 focus:border-purple-400 transition-all duration-300"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-3">Role</label>
                      <select
                        value={newInvitation.role}
                        onChange={(e) => setNewInvitation({...newInvitation, role: e.target.value})}
                        className="w-full px-4 py-4 bg-white/70 backdrop-blur-sm border border-white/30 rounded-xl focus:ring-2 focus:ring-purple-500/50 focus:border-purple-400 transition-all duration-300"
                      >
                        <option value="user">User</option>
                        <option value="admin">Admin</option>
                      </select>
                    </div>

                    <button
                      type="submit"
                      className="w-full bg-gradient-to-r from-purple-600 to-purple-500 text-white font-medium py-4 rounded-xl hover:from-purple-700 hover:to-purple-600 focus:ring-2 focus:ring-purple-500/50 transition-all duration-300 shadow-lg hover:shadow-xl"
                    >
                      Send Invitation
                </button>
              </form>
                </div>
              </div>

              {/* Email Configuration Test */}
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-br from-white/80 to-white/60 backdrop-blur-xl rounded-3xl border border-white/20 shadow-2xl"></div>
                <div className="relative p-8 backdrop-blur-xl bg-white/40 rounded-3xl border border-white/20 hover:shadow-3xl transition-all duration-500">
                  <div className="flex items-center space-x-4 mb-8">
                    <div className="p-3 bg-gradient-to-br from-orange-600 to-orange-500 rounded-2xl">
                      <Settings className="w-6 h-6 text-white" />
                    </div>
                    <h2 className="text-2xl font-semibold bg-gradient-to-r from-slate-900 to-slate-600 bg-clip-text text-transparent">
                      Email Configuration
                    </h2>
                  </div>

                  <div className="space-y-6">
                    <button
                      onClick={testEmailConfiguration}
                      disabled={emailTesting}
                      className="w-full bg-gradient-to-r from-orange-600 to-orange-500 text-white font-medium py-4 rounded-xl hover:from-orange-700 hover:to-orange-600 focus:ring-2 focus:ring-orange-500/50 transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50"
                    >
                      {emailTesting ? 'Testing...' : 'Test Email Configuration'}
                    </button>

                    {emailTestResult && (
                      <div className={`p-6 rounded-2xl backdrop-blur-sm border ${
                        emailTestResult.includes('success') 
                          ? 'bg-green-50/80 border-green-200/30 text-green-800'
                          : 'bg-red-50/80 border-red-200/30 text-red-800'
                      }`}>
                        <div className="font-medium mb-2">Test Result:</div>
                        <div className="text-sm">{emailTestResult}</div>
                      </div>
                    )}

                    <div className="p-6 bg-gradient-to-br from-slate-50/80 to-slate-100/80 backdrop-blur-sm rounded-2xl border border-slate-200/30">
                      <h3 className="font-semibold text-slate-900 mb-3">Email Service Status</h3>
                      <div className="text-sm text-slate-700 space-y-2">
                        <div className="flex items-center space-x-2">
                          <div className="w-2 h-2 bg-red-400 rounded-full"></div>
                          <span>Email service not configured</span>
                        </div>
                        <p className="text-xs text-slate-500 mt-3">
                          Configure email service in your environment variables to enable invitations.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {selectedTab === 'access-requests' && (
            <div className="space-y-8">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-white/80 to-white/60 backdrop-blur-xl rounded-3xl border border-white/20 shadow-2xl"></div>
                <div className="relative p-8 backdrop-blur-xl bg-white/40 rounded-3xl border border-white/20">
                  <div className="flex items-center space-x-4 mb-8">
                    <div className="p-3 bg-gradient-to-br from-red-600 to-red-500 rounded-2xl">
                      <Settings className="w-6 h-6 text-white" />
                    </div>
                    <h2 className="text-2xl font-semibold bg-gradient-to-r from-slate-900 to-slate-600 bg-clip-text text-transparent">
                      Access Requests
                    </h2>
                  </div>

                  {accessRequests.length === 0 ? (
                    <div className="text-center py-12">
                      <div className="p-6 bg-gradient-to-br from-slate-50/80 to-slate-100/80 backdrop-blur-sm rounded-2xl border border-slate-200/30 max-w-md mx-auto">
                        <Settings className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                        <h3 className="text-lg font-semibold text-slate-900 mb-2">No Access Requests</h3>
                        <p className="text-slate-600 text-sm">
                          All access requests will appear here for your review.
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      {accessRequests.map((request) => (
                        <div key={request.user_sub} className="relative group/request">
                          <div className="absolute inset-0 bg-gradient-to-r from-white/60 to-white/40 backdrop-blur-sm rounded-2xl opacity-0 group-hover/request:opacity-100 transition-all duration-300"></div>
                          <div className="relative p-6 backdrop-blur-sm bg-white/30 rounded-2xl border border-white/20 hover:shadow-lg transition-all duration-300">
                            <div className="flex items-start justify-between mb-4">
                              <div className="flex-1">
                                <h3 className="text-lg font-semibold text-slate-900">{request.name}</h3>
                                <p className="text-slate-600">{request.email}</p>
                                <p className="text-sm text-slate-500">Company: {request.company}</p>
                                <p className="text-sm text-slate-500">Role: {request.role}</p>
                              </div>
                              <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                                request.status === 'approved' ? 'bg-green-100 text-green-800' :
                                request.status === 'rejected' ? 'bg-red-100 text-red-800' :
                                'bg-yellow-100 text-yellow-800'
                              }`}>
                                {request.status.toUpperCase()}
                              </div>
                            </div>

                            {request.message && (
                              <div className="mb-4 p-4 bg-slate-50/80 backdrop-blur-sm rounded-xl border border-slate-200/30">
                                <p className="text-sm text-slate-700">{request.message}</p>
                              </div>
                            )}

                            {request.status === 'pending' && (
                              <div className="flex items-center space-x-3">
                                <button
                                  onClick={() => updateAccessRequestStatus(request.user_sub, 'approved')}
                                  className="flex items-center space-x-2 bg-gradient-to-r from-green-600 to-green-500 text-white px-4 py-2 rounded-xl hover:from-green-700 hover:to-green-600 transition-all duration-300 shadow-lg hover:shadow-xl"
                                >
                                  <Check className="w-4 h-4" />
                                  <span>Approve</span>
                                </button>
                                <button
                                  onClick={() => updateAccessRequestStatus(request.user_sub, 'rejected')}
                                  className="flex items-center space-x-2 bg-gradient-to-r from-red-600 to-red-500 text-white px-4 py-2 rounded-xl hover:from-red-700 hover:to-red-600 transition-all duration-300 shadow-lg hover:shadow-xl"
                                >
                                  <X className="w-4 h-4" />
                                  <span>Reject</span>
                                </button>
                              </div>
                            )}

                            <div className="mt-4 text-xs text-slate-500">
                              Requested: {new Date(request.created_at).toLocaleString()}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
          </div>
        )}
        </div>
      </div>

      {/* Apple-style animations */}
      <style dangerouslySetInnerHTML={{
        __html: `
          @keyframes pulse-slow {
            0%, 100% { opacity: 0.3; transform: scale(1); }
            50% { opacity: 0.6; transform: scale(1.05); }
          }
          .animate-pulse-slow {
            animation: pulse-slow 4s ease-in-out infinite;
          }
          .shadow-3xl {
            box-shadow: 0 35px 60px -12px rgba(0, 0, 0, 0.25);
          }
        `
      }} />
    </div>
  );
}; 