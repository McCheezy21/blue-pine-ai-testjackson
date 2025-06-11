import React, { useState, useEffect } from 'react';
import { TreePine, Building2, Users, Mail, FileText, Calculator, Send, Shield, CheckCircle2, Edit3, Trash2, Plus, Eye, Download, X } from 'lucide-react';

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
  const [selectedTab, setSelectedTab] = useState<'tenants' | 'users' | 'invitations' | 'access-requests' | 'invoices'>('tenants');
  const [isVisible, setIsVisible] = useState(false);

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

  // NEW: Invitation Form State
  const [newInvitation, setNewInvitation] = useState({
    tenant_id: '',
    email: '',
    role: 'user'
  });

  // NEW: Email test state
  const [emailTestResult, setEmailTestResult] = useState<string | null>(null);
  const [emailTesting, setEmailTesting] = useState(false);

  // NEW: Edit tenant state
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

  const [showInvoiceForm, setShowInvoiceForm] = useState(false);

  useEffect(() => {
    fetchTenants();
    if (selectedTab === 'access-requests') {
      fetchAccessRequests();
    }
    if (selectedTab === 'invoices') {
      fetchInvoices();
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
      const { subtotal, taxAmount, total } = calculateInvoiceTotals();
      const invoiceData = {
        ...newInvoice,
        subtotal,
        tax_amount: taxAmount,
        total,
        invoice_number: `INV-${new Date().getFullYear()}-${String(invoices.length + 1).padStart(3, '0')}`,
        issue_date: new Date().toISOString().split('T')[0],
        status: 'draft' as const
      };

      // Here you would call your API to create the invoice
      console.log('Creating invoice:', invoiceData);
      
      // For now, add to local state
      const newInvoiceWithId: Invoice = {
        ...invoiceData,
        id: Date.now().toString(),
        created_at: new Date().toISOString()
      };
      setInvoices([...invoices, newInvoiceWithId]);
      
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
      const domains = newTenant.allowed_email_domains
        .split(',')
        .map(d => d.trim())
        .filter(d => d);

      const response = await fetch('http://localhost:3001/api/admin/tenants', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: newTenant.id,
          name: newTenant.name,
          plan: newTenant.plan,
          allowed_email_domains: domains
        })
      });

      if (response.ok) {
        setNewTenant({ id: '', name: '', plan: 'pro', allowed_email_domains: '' });
        fetchTenants();
        alert('Tenant created successfully!');
      } else {
        const error = await response.json();
        alert(`Error: ${error.error}`);
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
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newUser)
      });

      if (response.ok) {
        setNewUser({ tenant_id: '', email: '', role: 'user' });
        alert('User added successfully!');
      } else {
        const error = await response.json();
        alert(`Error: ${error.error}`);
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
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newInvitation)
      });

      const result = await response.json();

      if (response.ok && result.success) {
        setNewInvitation({ tenant_id: '', email: '', role: 'user' });
        
        if (result.email_sent) {
          alert(`✅ Invitation sent successfully to ${newInvitation.email}!\n\nEmail delivered via AWS SES.`);
        } else {
          alert(`⚠️ Invitation created but email failed to send.\n\nReason: ${result.email_error}\n\nInvitation URL: ${result.invite_url}\n\nPlease send this URL manually to ${newInvitation.email}`);
        }
      } else {
        alert(`Error: ${result.error}`);
      }
    } catch (error) {
      console.error('Error sending invitation:', error);
      alert('Failed to send invitation');
    }
  };

  const testEmailConfiguration = async () => {
    setEmailTesting(true);
    try {
      const response = await fetch('http://localhost:3001/api/admin/test-email');
      const result = await response.json();
      setEmailTestResult(result.message || 'Email test completed');
    } catch (error) {
      console.error('Error testing email:', error);
      setEmailTestResult('Email test failed');
    } finally {
      setEmailTesting(false);
    }
  };

  const toggleTenantStatus = async (tenantId: string, currentStatus: string) => {
    const newStatus = currentStatus === 'active' ? 'suspended' : 'active';
    try {
      const response = await fetch(`http://localhost:3001/api/admin/tenants/${tenantId}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });

      if (response.ok) {
        fetchTenants();
        alert(`Tenant ${newStatus === 'active' ? 'enabled' : 'disabled'} successfully!`);
      } else {
        const error = await response.json();
        alert(`Error: ${error.error}`);
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
      allowed_email_domains: tenant.allowed_email_domains.join(', ')
    });
  };

  const saveEditedTenant = async (tenantId: string) => {
    try {
      const domains = editTenantData.allowed_email_domains
        .split(',')
        .map(d => d.trim())
        .filter(d => d);

      const response = await fetch(`http://localhost:3001/api/admin/tenants/${tenantId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: editTenantData.name,
          allowed_email_domains: domains
        })
      });

      if (response.ok) {
        setEditingTenant(null);
        fetchTenants();
        alert('Tenant updated successfully!');
      } else {
        const error = await response.json();
        alert(`Error: ${error.error}`);
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
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status, admin_notes: adminNotes })
      });

      if (response.ok) {
        fetchAccessRequests();
        alert(`Access request ${status} successfully!`);
      } else {
        const error = await response.json();
        alert(`Error: ${error.error}`);
      }
    } catch (error) {
      console.error('Error updating access request:', error);
      alert('Failed to update access request');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-white via-slate-50/30 to-blue-50/20 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-slate-600">Loading admin panel...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-slate-50/30 to-blue-50/20">
      {/* Apple-inspired floating background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-500/10 to-blue-300/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-slate-400/10 to-slate-200/10 rounded-full blur-3xl"></div>
      </div>

      <div className="relative p-8">
        <div className="max-w-7xl mx-auto">
          {/* Apple-inspired Header */}
          <div className={`mb-12 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
            <div className="flex items-center space-x-4 mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-blue-500 rounded-2xl flex items-center justify-center shadow-lg">
                <TreePine className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-4xl font-semibold bg-gradient-to-r from-slate-900 via-blue-900 to-slate-800 bg-clip-text text-transparent">
                  Blue Pine AI Admin
                </h1>
                <p className="text-slate-600 mt-1">Comprehensive platform management and billing</p>
              </div>
            </div>
          </div>

          {/* Apple-inspired Tab Navigation */}
          <div className={`mb-8 transition-all duration-700 delay-200 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
            <div className="bg-white/80 backdrop-blur-xl border border-slate-200/50 rounded-2xl p-2 shadow-lg">
              <nav className="flex space-x-2">
                {[
                  { id: 'tenants', label: 'Tenants', icon: Building2 },
                  { id: 'users', label: 'Users', icon: Users },
                  { id: 'invitations', label: 'Invitations', icon: Mail },
                  { id: 'access-requests', label: 'Requests', icon: Shield },
                  { id: 'invoices', label: 'Invoices', icon: FileText }
                ].map((tab, index) => (
                  <button
                    key={tab.id}
                    onClick={() => setSelectedTab(tab.id as any)}
                    className={`flex items-center space-x-2 px-6 py-3 rounded-xl font-medium text-sm transition-all duration-200 ${
                      selectedTab === tab.id
                        ? 'bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-md transform scale-[1.02]'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50/50'
                    }`}
                  >
                    <tab.icon className="w-4 h-4" />
                    <span>{tab.label}</span>
                    {tab.id === 'access-requests' && accessRequests.filter(req => req.status === 'pending').length > 0 && (
                      <span className="ml-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                        {accessRequests.filter(req => req.status === 'pending').length}
                      </span>
                    )}
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Rest of the component content */}
          {selectedTab === 'tenants' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Create Tenant Form */}
              <div className="bg-white p-6 rounded-lg shadow">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Create New Tenant</h2>
                <form onSubmit={createTenant} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Tenant ID</label>
                    <input
                      type="text"
                      value={newTenant.id}
                      onChange={(e) => setNewTenant({...newTenant, id: e.target.value})}
                      placeholder="mayo-clinic, cleveland-clinic"
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Company Name</label>
                    <input
                      type="text"
                      value={newTenant.name}
                      onChange={(e) => setNewTenant({...newTenant, name: e.target.value})}
                      placeholder="Mayo Clinic, Cleveland Clinic"
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Plan</label>
                    <select
                      value={newTenant.plan}
                      onChange={(e) => setNewTenant({...newTenant, plan: e.target.value})}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="free">Free</option>
                      <option value="pro">Pro</option>
                      <option value="enterprise">Enterprise</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Allowed Email Domains</label>
                    <input
                      type="text"
                      value={newTenant.allowed_email_domains}
                      onChange={(e) => setNewTenant({...newTenant, allowed_email_domains: e.target.value})}
                      placeholder="mayoclinic.org, mayo.edu (comma separated)"
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                    <p className="text-xs text-gray-500 mt-1">Leave empty to allow any email domain</p>
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    Create Tenant
                  </button>
                </form>
              </div>

              {/* Existing Tenants List */}
              <div className="bg-white p-6 rounded-lg shadow">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Existing Tenants</h2>
                <div className="space-y-4">
                  {tenants.map((tenant) => (
                    <div key={tenant.id} className={`border rounded-lg p-4 ${
                      tenant.status === 'suspended' ? 'border-red-200 bg-red-50' : 'border-gray-200'
                    }`}>
                      {editingTenant === tenant.id ? (
                        // Edit form
                        <div className="space-y-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700">Company Name</label>
                            <input
                              type="text"
                              value={editTenantData.name}
                              onChange={(e) => setEditTenantData({...editTenantData, name: e.target.value})}
                              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700">Allowed Email Domains</label>
                            <input
                              type="text"
                              value={editTenantData.allowed_email_domains}
                              onChange={(e) => setEditTenantData({...editTenantData, allowed_email_domains: e.target.value})}
                              placeholder="gmail.com, company.com (comma separated)"
                              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                            />
                            <p className="text-xs text-gray-500 mt-1">Leave empty to allow any email domain</p>
                          </div>
                          <div className="flex space-x-2">
                            <button
                              onClick={() => saveEditedTenant(tenant.id)}
                              className="px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700"
                            >
                              Save
                            </button>
                            <button
                              onClick={cancelEditing}
                              className="px-3 py-1 bg-gray-600 text-white rounded text-sm hover:bg-gray-700"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      ) : (
                        // Display view
                        <>
                          <div className="flex justify-between items-start mb-2">
                            <h3 className={`font-medium ${
                              tenant.status === 'suspended' ? 'text-gray-500' : 'text-gray-900'
                            }`}>{tenant.name}</h3>
                            <div className="flex items-center space-x-2">
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                tenant.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                              }`}>
                                {tenant.status === 'suspended' ? 'disabled' : tenant.status}
                              </span>
                              <button
                                onClick={() => startEditingTenant(tenant)}
                                className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700"
                              >
                                Edit
                              </button>
                              <button
                                onClick={() => toggleTenantStatus(tenant.id, tenant.status)}
                                className={`px-3 py-1 rounded text-sm font-medium ${
                                  tenant.status === 'active' 
                                    ? 'bg-red-600 text-white hover:bg-red-700' 
                                    : 'bg-green-600 text-white hover:bg-green-700'
                                }`}
                              >
                                {tenant.status === 'active' ? 'Disable' : 'Enable'}
                              </button>
                            </div>
                          </div>
                          <p className={`text-sm ${
                            tenant.status === 'suspended' ? 'text-gray-400' : 'text-gray-600'
                          }`}>ID: {tenant.id}</p>
                          <p className={`text-sm ${
                            tenant.status === 'suspended' ? 'text-gray-400' : 'text-gray-600'
                          }`}>Plan: {tenant.plan}</p>
                          {tenant.allowed_email_domains && tenant.allowed_email_domains.length > 0 && (
                            <p className={`text-sm ${
                              tenant.status === 'suspended' ? 'text-gray-400' : 'text-gray-600'
                            }`}>
                              Domains: {tenant.allowed_email_domains.join(', ')}
                            </p>
                          )}
                          {tenant.status === 'suspended' && (
                            <p className="text-sm text-red-600 mt-2 font-medium">
                              ⚠️ This tenant is disabled - users cannot access the system
                            </p>
                          )}
                          
                          {/* Status Messages */}
                          <div className="mt-3 pt-2 border-t">
                            {tenant.status === 'active' ? (
                              <p className="text-lg font-bold text-green-600">
                                🟢 Tenant ACTIVE
                              </p>
                            ) : (
                              <p className="text-lg font-bold text-red-600">
                                🔴 Tenant DISABLED
                              </p>
                            )}
                          </div>
                        </>
                      )}
                    </div>
                  ))}
                  {tenants.length === 0 && (
                    <p className="text-gray-500 text-center py-4">No tenants created yet</p>
                  )}
                </div>
              </div>
            </div>
          )}

          {selectedTab === 'users' && (
            <div className="bg-white p-6 rounded-lg shadow max-w-2xl">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Add User to Tenant</h2>
              <form onSubmit={addUserToTenant} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Select Tenant</label>
                  <select
                    value={newUser.tenant_id}
                    onChange={(e) => setNewUser({...newUser, tenant_id: e.target.value})}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    required
                  >
                    <option value="">Choose a tenant...</option>
                    {tenants.map((tenant) => (
                      <option key={tenant.id} value={tenant.id}>
                        {tenant.name} ({tenant.id})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">User Email</label>
                  <input
                    type="email"
                    value={newUser.email}
                    onChange={(e) => setNewUser({...newUser, email: e.target.value})}
                    placeholder="user@company.com"
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Role</label>
                  <select
                    value={newUser.role}
                    onChange={(e) => setNewUser({...newUser, role: e.target.value})}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="viewer">Viewer</option>
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>

                <button
                  type="submit"
                  className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  Add User to Tenant
                </button>
              </form>
            </div>
          )}

          {selectedTab === 'invitations' && (
            <div className="space-y-8">
              {/* Email Configuration Test */}
              <div className="bg-white p-6 rounded-lg shadow">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">📧 Email Configuration</h2>
                <p className="text-gray-600 mb-4">Test your email configuration before sending invitations.</p>
                
                <button
                  onClick={testEmailConfiguration}
                  disabled={emailTesting}
                  className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50"
                >
                  {emailTesting ? 'Testing...' : 'Test Email Configuration'}
                </button>
                
                {emailTestResult && (
                  <div className={`mt-4 p-3 rounded-md ${
                    emailTestResult.startsWith('✅') ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
                  }`}>
                    {emailTestResult}
                  </div>
                )}
              </div>

              {/* Send Invitation Form */}
              <div className="bg-white p-6 rounded-lg shadow max-w-2xl">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Send Email Invitation</h2>
                <form onSubmit={sendInvitation} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Select Tenant</label>
                    <select
                      value={newInvitation.tenant_id}
                      onChange={(e) => setNewInvitation({...newInvitation, tenant_id: e.target.value})}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      required
                    >
                      <option value="">Choose a tenant...</option>
                      {tenants.filter(t => t.status === 'active').map((tenant) => (
                        <option key={tenant.id} value={tenant.id}>
                          {tenant.name} ({tenant.id})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Recipient Email</label>
                    <input
                      type="email"
                      value={newInvitation.email}
                      onChange={(e) => setNewInvitation({...newInvitation, email: e.target.value})}
                      placeholder="user@company.com"
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Role</label>
                    <select
                      value={newInvitation.role}
                      onChange={(e) => setNewInvitation({...newInvitation, role: e.target.value})}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="viewer">Viewer</option>
                      <option value="user">User</option>
                      <option value="admin">Admin</option>
                    </select>
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-purple-600 text-white py-2 px-4 rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    📧 Send Invitation Email
                  </button>
                </form>
                
                <div className="mt-4 p-3 bg-blue-50 rounded-md">
                  <p className="text-sm text-blue-700">
                    <strong>📧 Email Invitations:</strong> This will create an invitation and send a professional email 
                    to the recipient with instructions to join the organization.
                  </p>
                </div>
              </div>
            </div>
          )}

          {selectedTab === 'access-requests' && (
            <div className="bg-white p-6 rounded-lg shadow">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Access Requests</h2>
                <div className="text-sm text-gray-500">
                  {accessRequests.filter(req => req.status === 'pending').length} pending • {accessRequests.length} total
                </div>
              </div>
              
              <div className="space-y-4">
                {accessRequests.map((request) => (
                  <div key={request.user_sub} className={`border rounded-lg p-6 ${
                    request.status === 'pending' ? 'border-yellow-200 bg-yellow-50' : 
                    request.status === 'approved' ? 'border-green-200 bg-green-50' :
                    'border-red-200 bg-red-50'
                  }`}>
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-lg font-medium text-gray-900">{request.name}</h3>
                        <p className="text-sm text-gray-600">{request.email}</p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                        request.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 
                        request.status === 'approved' ? 'bg-green-100 text-green-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {request.status}
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <p className="text-sm font-medium text-gray-700">Company</p>
                        <p className="text-sm text-gray-900">{request.company}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-700">Role</p>
                        <p className="text-sm text-gray-900">{request.role}</p>
                      </div>
                    </div>
                    
                    <div className="mb-4">
                      <p className="text-sm font-medium text-gray-700 mb-2">Message</p>
                      <p className="text-sm text-gray-900 bg-white p-3 rounded border">{request.message}</p>
                    </div>
                    
                    <div className="text-xs text-gray-500 mb-4">
                      Submitted: {new Date(request.created_at).toLocaleDateString()} at {new Date(request.created_at).toLocaleTimeString()}
                    </div>
                    
                    {request.status === 'pending' && (
                      <div className="flex space-x-3 pt-4 border-t">
                        <button
                          onClick={() => updateAccessRequestStatus(request.user_sub, 'approved')}
                          className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 transition-colors"
                        >
                          ✅ Approve Request
                        </button>
                        <button
                          onClick={() => updateAccessRequestStatus(request.user_sub, 'rejected')}
                          className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 transition-colors"
                        >
                          ❌ Reject Request
                        </button>
                      </div>
                    )}
                    
                    {request.status !== 'pending' && (
                      <div className="pt-4 border-t">
                        <p className={`text-sm font-medium ${
                          request.status === 'approved' ? 'text-green-700' : 'text-red-700'
                        }`}>
                          {request.status === 'approved' ? '✅ Request Approved' : '❌ Request Rejected'}
                        </p>
                        {request.admin_notes && (
                          <p className="text-sm text-gray-600 mt-1">Admin Notes: {request.admin_notes}</p>
                        )}
                      </div>
                    )}
                  </div>
                ))}
                
                {accessRequests.length === 0 && (
                  <div className="text-center py-12">
                    <div className="text-gray-500 text-6xl mb-4">📋</div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No Access Requests</h3>
                    <p className="text-gray-500">No users have requested access yet.</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {selectedTab === 'invoices' && (
            <div className={`space-y-8 transition-all duration-700 delay-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
              {/* Invoice Header */}
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-2xl font-semibold bg-gradient-to-r from-slate-900 to-blue-900 bg-clip-text text-transparent">
                    Invoice Management
                  </h2>
                  <p className="text-slate-600 mt-1">Create and manage professional invoices for your clients</p>
                </div>
                <button
                  onClick={() => setShowInvoiceForm(true)}
                  className="flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-blue-500 text-white px-6 py-3 rounded-xl font-medium hover:scale-105 transition-all duration-200 shadow-lg"
                >
                  <Plus className="w-4 h-4" />
                  <span>Create Invoice</span>
                </button>
              </div>

              {/* Invoice List */}
              <div className="bg-white/80 backdrop-blur-xl border border-slate-200/50 rounded-2xl shadow-lg overflow-hidden">
                <div className="p-6 border-b border-slate-200/50">
                  <h3 className="text-lg font-semibold text-slate-900">Recent Invoices</h3>
                </div>
                <div className="divide-y divide-slate-200/50">
                  {invoices.map((invoice) => (
                    <div key={invoice.id} className="p-6 hover:bg-slate-50/50 transition-colors">
                      <div className="flex justify-between items-start">
                        <div className="space-y-2">
                          <div className="flex items-center space-x-3">
                            <h4 className="font-semibold text-slate-900">{invoice.invoice_number}</h4>
                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                              invoice.status === 'paid' ? 'bg-green-100 text-green-800' :
                              invoice.status === 'sent' ? 'bg-blue-100 text-blue-800' :
                              invoice.status === 'overdue' ? 'bg-red-100 text-red-800' :
                              'bg-slate-100 text-slate-800'
                            }`}>
                              {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
                            </span>
                          </div>
                          <p className="text-slate-600">{invoice.client_name}</p>
                          <p className="text-sm text-slate-500">{invoice.client_email}</p>
                          <div className="flex items-center space-x-4 text-sm text-slate-500">
                            <span>Issued: {new Date(invoice.issue_date).toLocaleDateString()}</span>
                            <span>Due: {new Date(invoice.due_date).toLocaleDateString()}</span>
                          </div>
                        </div>
                        <div className="text-right space-y-2">
                          <div className="text-2xl font-bold text-slate-900">
                            ${invoice.total.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                          </div>
                          <div className="flex items-center space-x-2">
                            <button className="p-2 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                              <Eye className="w-4 h-4" />
                            </button>
                            <button className="p-2 text-slate-500 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors">
                              <Download className="w-4 h-4" />
                            </button>
                            <button className="p-2 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                              <Send className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                  {invoices.length === 0 && (
                    <div className="p-12 text-center">
                      <FileText className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-slate-900 mb-2">No invoices yet</h3>
                      <p className="text-slate-500 mb-6">Create your first professional invoice</p>
                      <button
                        onClick={() => setShowInvoiceForm(true)}
                        className="bg-gradient-to-r from-blue-600 to-blue-500 text-white px-6 py-3 rounded-xl font-medium hover:scale-105 transition-all duration-200"
                      >
                        Create First Invoice
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Invoice Creation Modal */}
              {showInvoiceForm && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
                  <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                    <div className="p-6 border-b border-slate-200">
                      <div className="flex justify-between items-center">
                        <div>
                          <h3 className="text-2xl font-semibold text-slate-900">Create Professional Invoice</h3>
                          <p className="text-slate-600 mt-1">Generate a professional invoice for your client</p>
                        </div>
                        <button
                          onClick={() => setShowInvoiceForm(false)}
                          className="p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
                        >
                          <X className="w-5 h-5" />
                        </button>
                      </div>
                    </div>

                    <form onSubmit={createInvoice} className="p-6 space-y-6">
                      {/* Client Information */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                          <h4 className="font-semibold text-slate-900 flex items-center space-x-2">
                            <Building2 className="w-4 h-4 text-blue-600" />
                            <span>Client Information</span>
                          </h4>
                          
                          <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">Client Name *</label>
                            <input
                              type="text"
                              value={newInvoice.client_name}
                              onChange={(e) => setNewInvoice({...newInvoice, client_name: e.target.value})}
                              className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                              placeholder="Mayo Clinic"
                              required
                            />
                          </div>
                          
                          <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">Client Email *</label>
                            <input
                              type="email"
                              value={newInvoice.client_email}
                              onChange={(e) => setNewInvoice({...newInvoice, client_email: e.target.value})}
                              className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                              placeholder="billing@mayoclinic.org"
                              required
                            />
                          </div>
                          
                          <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">Client Address</label>
                            <textarea
                              value={newInvoice.client_address}
                              onChange={(e) => setNewInvoice({...newInvoice, client_address: e.target.value})}
                              rows={3}
                              className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                              placeholder="200 First St SW, Rochester, MN 55905"
                            />
                          </div>
                        </div>

                        <div className="space-y-4">
                          <h4 className="font-semibold text-slate-900 flex items-center space-x-2">
                            <Calculator className="w-4 h-4 text-blue-600" />
                            <span>Invoice Details</span>
                          </h4>
                          
                          <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">Tenant</label>
                            <select
                              value={newInvoice.tenant_id}
                              onChange={(e) => setNewInvoice({...newInvoice, tenant_id: e.target.value})}
                              className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                              required
                            >
                              <option value="">Select Tenant</option>
                              {tenants.map((tenant) => (
                                <option key={tenant.id} value={tenant.id}>{tenant.name}</option>
                              ))}
                            </select>
                          </div>
                          
                          <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">Due Date *</label>
                            <input
                              type="date"
                              value={newInvoice.due_date}
                              onChange={(e) => setNewInvoice({...newInvoice, due_date: e.target.value})}
                              className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                              required
                            />
                          </div>
                          
                          <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">Tax Rate (%)</label>
                            <input
                              type="number"
                              step="0.01"
                              value={newInvoice.tax_rate}
                              onChange={(e) => setNewInvoice({...newInvoice, tax_rate: parseFloat(e.target.value) || 0})}
                              className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                              placeholder="8.5"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Invoice Items */}
                      <div className="space-y-4">
                        <div className="flex justify-between items-center">
                          <h4 className="font-semibold text-slate-900">Invoice Items</h4>
                          <button
                            type="button"
                            onClick={addInvoiceItem}
                            className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50 px-3 py-2 rounded-lg transition-colors"
                          >
                            <Plus className="w-4 h-4" />
                            <span>Add Item</span>
                          </button>
                        </div>
                        
                        <div className="space-y-3">
                          {newInvoice.items.map((item, index) => (
                            <div key={item.id} className="grid grid-cols-12 gap-3 items-end">
                              <div className="col-span-5">
                                <input
                                  type="text"
                                  value={item.description}
                                  onChange={(e) => updateInvoiceItem(item.id, 'description', e.target.value)}
                                  placeholder="Description of service/product"
                                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                  required
                                />
                              </div>
                              <div className="col-span-2">
                                <input
                                  type="number"
                                  min="1"
                                  value={item.quantity}
                                  onChange={(e) => updateInvoiceItem(item.id, 'quantity', parseInt(e.target.value) || 1)}
                                  placeholder="Qty"
                                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                  required
                                />
                              </div>
                              <div className="col-span-2">
                                <input
                                  type="number"
                                  step="0.01"
                                  min="0"
                                  value={item.rate}
                                  onChange={(e) => updateInvoiceItem(item.id, 'rate', parseFloat(e.target.value) || 0)}
                                  placeholder="Rate"
                                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                  required
                                />
                              </div>
                              <div className="col-span-2">
                                <input
                                  type="text"
                                  value={`$${item.amount.toFixed(2)}`}
                                  disabled
                                  className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-slate-50 text-slate-600"
                                />
                              </div>
                              <div className="col-span-1">
                                <button
                                  type="button"
                                  onClick={() => removeInvoiceItem(item.id)}
                                  disabled={newInvoice.items.length === 1}
                                  className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Invoice Totals */}
                      <div className="bg-slate-50 rounded-xl p-4 space-y-2">
                        <div className="flex justify-between">
                          <span className="text-slate-600">Subtotal:</span>
                          <span className="font-medium">${calculateInvoiceTotals().subtotal.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-600">Tax ({newInvoice.tax_rate}%):</span>
                          <span className="font-medium">${calculateInvoiceTotals().taxAmount.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-lg font-bold border-t border-slate-200 pt-2">
                          <span>Total:</span>
                          <span>${calculateInvoiceTotals().total.toFixed(2)}</span>
                        </div>
                      </div>

                      {/* Notes */}
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Notes</label>
                        <textarea
                          value={newInvoice.notes}
                          onChange={(e) => setNewInvoice({...newInvoice, notes: e.target.value})}
                          rows={3}
                          className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                          placeholder="Thank you for your business! Payment terms: Net 30 days."
                        />
                      </div>

                      {/* Form Actions */}
                      <div className="flex justify-end space-x-4 pt-4">
                        <button
                          type="button"
                          onClick={() => setShowInvoiceForm(false)}
                          className="px-6 py-3 text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-xl font-medium transition-colors"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="bg-gradient-to-r from-blue-600 to-blue-500 text-white px-8 py-3 rounded-xl font-medium hover:scale-105 transition-all duration-200 shadow-lg"
                        >
                          Create Invoice
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}; 