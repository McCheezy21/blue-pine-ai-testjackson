import React, { useState, useEffect } from 'react';

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

export const Admin: React.FC = () => {
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [accessRequests, setAccessRequests] = useState<AccessRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTab, setSelectedTab] = useState<'tenants' | 'users' | 'invitations' | 'access-requests'>('tenants');

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

  useEffect(() => {
    fetchTenants();
    if (selectedTab === 'access-requests') {
      fetchAccessRequests();
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

  // NEW: Send invitation with email
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

  // NEW: Test email configuration endpoint
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
    
    // Show confirmation dialog when disabling
    if (newStatus === 'suspended') {
      const confirmed = window.confirm('Are you SURE you want to disable this tenant?');
      if (!confirmed) {
        return; // User cancelled
      }
    }
    
    try {
      const response = await fetch(`http://localhost:3001/api/admin/tenants/${tenantId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });

      if (response.ok) {
        fetchTenants(); // Refresh the tenant list
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

  // NEW: Edit tenant functions
  const startEditingTenant = (tenant: Tenant) => {
    setEditingTenant(tenant.id);
    setEditTenantData({
      name: tenant.name,
      allowed_email_domains: tenant.allowed_email_domains?.join(', ') || ''
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
        fetchAccessRequests(); // Refresh the list
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
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading admin panel...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Blue Pine AI - Admin Panel</h1>
          <p className="text-gray-600 mt-2">Manage tenants and users for your multi-tenant platform</p>
        </div>

        {/* Tab Navigation */}
        <div className="border-b border-gray-200 mb-8">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setSelectedTab('tenants')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                selectedTab === 'tenants'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Manage Tenants
            </button>
            <button
              onClick={() => setSelectedTab('users')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                selectedTab === 'users'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Manage Users
            </button>
            <button
              onClick={() => setSelectedTab('invitations')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                selectedTab === 'invitations'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              📧 Send Invitations
            </button>
            <button
              onClick={() => setSelectedTab('access-requests')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                selectedTab === 'access-requests'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              👥 Access Requests
              {accessRequests.filter(req => req.status === 'pending').length > 0 && (
                <span className="ml-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                  {accessRequests.filter(req => req.status === 'pending').length}
                </span>
              )}
            </button>
          </nav>
        </div>

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
      </div>
    </div>
  );
}; 