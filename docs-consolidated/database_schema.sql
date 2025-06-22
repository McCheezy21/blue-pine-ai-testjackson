-- Blue Pine AI Multi-Tenant Database Schema
-- Run this in your PostgreSQL database

-- Core tenant table
CREATE TABLE tenants (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    plan VARCHAR(20) NOT NULL CHECK (plan IN ('free', 'pro', 'enterprise')),
    status VARCHAR(20) NOT NULL CHECK (status IN ('active', 'suspended', 'trial')),
    trial_ends_at TIMESTAMP WITH TIME ZONE,
    subscription_id VARCHAR(255),
    allowed_email_domains TEXT[], -- Array of allowed email domains
    settings JSONB DEFAULT '{}', -- Additional tenant settings
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User-tenant relationships (many-to-many)
CREATE TABLE tenant_users (
    id SERIAL PRIMARY KEY,
    tenant_id VARCHAR(50) REFERENCES tenants(id) ON DELETE CASCADE,
    user_sub VARCHAR(255) NOT NULL, -- Cognito user sub
    role VARCHAR(20) NOT NULL CHECK (role IN ('admin', 'user', 'viewer')),
    permissions TEXT[], -- Array of permission strings
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(tenant_id, user_sub)
);

-- Invitation system for secure onboarding
CREATE TABLE tenant_invitations (
    id SERIAL PRIMARY KEY,
    tenant_id VARCHAR(50) REFERENCES tenants(id) ON DELETE CASCADE,
    email VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL DEFAULT 'user' CHECK (role IN ('admin', 'user', 'viewer')),
    invitation_token VARCHAR(100) UNIQUE NOT NULL,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    used_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Example business data table (all tables need tenant_id for isolation)
CREATE TABLE automation_configs (
    id SERIAL PRIMARY KEY,
    tenant_id VARCHAR(50) REFERENCES tenants(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    config_data JSONB NOT NULL,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_tenant_users_tenant_id ON tenant_users(tenant_id);
CREATE INDEX idx_tenant_users_user_sub ON tenant_users(user_sub);
CREATE INDEX idx_tenant_invitations_token ON tenant_invitations(invitation_token);
CREATE INDEX idx_tenant_invitations_email ON tenant_invitations(email);
CREATE INDEX idx_automation_configs_tenant_id ON automation_configs(tenant_id);

-- Enable Row-Level Security on tenant-specific tables
ALTER TABLE automation_configs ENABLE ROW LEVEL SECURITY;

-- Create RLS policy (users can only see their tenant's data)
-- Note: You'll need to set app.current_tenant_id in your API middleware
CREATE POLICY tenant_isolation_policy ON automation_configs
    FOR ALL
    TO authenticated_users
    USING (tenant_id = current_setting('app.current_tenant_id', true));

-- Sample data for testing
INSERT INTO tenants (id, name, plan, status) VALUES 
('demo-tenant', 'Demo Company', 'free', 'active'),
('acme-corp', 'Acme Corporation', 'pro', 'active');

-- Add yourself as admin to demo tenant (replace with your actual Cognito sub)
-- You can find your sub in the browser console after signing in
INSERT INTO tenant_users (tenant_id, user_sub, role, permissions) VALUES 
('demo-tenant', 'google_115880709094631836487', 'admin', ARRAY['all']);

-- Create a sample invitation (replace email with actual customer email)
INSERT INTO tenant_invitations (tenant_id, email, role, invitation_token, expires_at) VALUES 
('acme-corp', 'customer@acme.com', 'admin', 'invite_sample123', NOW() + INTERVAL '7 days');

-- Function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply the trigger to tables that need it
CREATE TRIGGER update_tenants_updated_at BEFORE UPDATE ON tenants
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_automation_configs_updated_at BEFORE UPDATE ON automation_configs
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column(); 