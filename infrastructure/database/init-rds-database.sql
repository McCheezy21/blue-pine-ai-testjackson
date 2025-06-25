-- Blue Pine AI - RDS Database Initialization Script
-- This script initializes the PostgreSQL database with all required schemas
-- Run this after RDS instance is created

-- =====================================
-- EXTENSIONS
-- =====================================
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- =====================================
-- CORE AUTHENTICATION & TENANCY
-- =====================================

-- Tenants (Organizations/Companies)
CREATE TABLE IF NOT EXISTS tenants (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    subdomain VARCHAR(100) UNIQUE,
    plan VARCHAR(50) DEFAULT 'basic', -- basic, pro, enterprise
    status VARCHAR(20) DEFAULT 'active', -- active, suspended, trial
    allowed_email_domains TEXT[], -- Array of allowed email domains
    settings JSONB DEFAULT '{}',
    billing_info JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Users (Cognito + PointClickCare + SSO users)
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_sub VARCHAR(255) UNIQUE NOT NULL, -- Cognito sub or PCC user ID or SSO ID
    email VARCHAR(255) NOT NULL,
    given_name VARCHAR(100),
    family_name VARCHAR(100),
    provider VARCHAR(50) DEFAULT 'cognito', -- cognito, pointclickcare, sso
    provider_data JSONB DEFAULT '{}',
    last_login TIMESTAMP WITH TIME ZONE,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(email, provider)
);

-- Tenant-User relationships
CREATE TABLE IF NOT EXISTS tenant_users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE,
    user_sub VARCHAR(255) REFERENCES users(user_sub) ON DELETE CASCADE,
    role VARCHAR(50) DEFAULT 'user', -- admin, user, viewer
    permissions TEXT[] DEFAULT ARRAY['read'],
    status VARCHAR(20) DEFAULT 'active',
    invited_by UUID REFERENCES users(id),
    joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(tenant_id, user_sub)
);

-- =====================================
-- SSO CONFIGURATION TABLES
-- =====================================

-- SSO Provider Configurations
CREATE TABLE IF NOT EXISTS sso_configurations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE,
    provider_name VARCHAR(100) NOT NULL, -- 'azure', 'google', 'okta', etc.
    provider_type VARCHAR(50) NOT NULL, -- 'saml', 'oidc'
    is_active BOOLEAN DEFAULT true,
    
    -- OIDC/OAuth2 Configuration
    client_id VARCHAR(255),
    client_secret VARCHAR(500), -- Encrypted
    discovery_url VARCHAR(500),
    authorization_url VARCHAR(500),
    token_url VARCHAR(500),
    userinfo_url VARCHAR(500),
    jwks_url VARCHAR(500),
    
    -- SAML Configuration
    saml_entity_id VARCHAR(255),
    saml_sso_url VARCHAR(500),
    saml_certificate TEXT,
    
    -- Attribute Mapping
    attribute_mapping JSONB DEFAULT '{
        "email": "email",
        "given_name": "given_name",
        "family_name": "family_name",
        "groups": "groups"
    }',
    
    -- Additional Settings
    settings JSONB DEFAULT '{}',
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    UNIQUE(tenant_id, provider_name)
);

-- Domain-based SSO routing
CREATE TABLE IF NOT EXISTS sso_domains (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    sso_config_id UUID REFERENCES sso_configurations(id) ON DELETE CASCADE,
    domain VARCHAR(255) NOT NULL, -- e.g., 'company.com'
    is_verified BOOLEAN DEFAULT false,
    verification_token VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    UNIQUE(domain)
);

-- SSO Session Management
CREATE TABLE IF NOT EXISTS sso_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_token VARCHAR(500) NOT NULL,
    sso_config_id UUID REFERENCES sso_configurations(id) ON DELETE CASCADE,
    user_sub VARCHAR(255) REFERENCES users(user_sub),
    state_parameter VARCHAR(255), -- OAuth2 state parameter
    nonce VARCHAR(255), -- OIDC nonce
    redirect_url VARCHAR(500),
    provider_session_id VARCHAR(255),
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    UNIQUE(session_token)
);

-- =====================================
-- AI & BEDROCK DATA STORAGE
-- =====================================

-- AI Conversations/Chat Sessions
CREATE TABLE IF NOT EXISTS ai_conversations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE,
    user_sub VARCHAR(255) REFERENCES users(user_sub),
    session_id VARCHAR(255),
    title VARCHAR(500),
    model_used VARCHAR(100), -- Claude, GPT-4, etc.
    total_tokens INTEGER DEFAULT 0,
    total_cost DECIMAL(10,4) DEFAULT 0.00,
    metadata JSONB DEFAULT '{}',
    status VARCHAR(20) DEFAULT 'active', -- active, archived
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Individual chat messages
CREATE TABLE IF NOT EXISTS chat_messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    conversation_id UUID REFERENCES ai_conversations(id) ON DELETE CASCADE,
    role VARCHAR(20) NOT NULL, -- user, assistant, system
    content TEXT NOT NULL,
    tokens_used INTEGER,
    model_version VARCHAR(100),
    processing_time_ms INTEGER,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Bedrock Model Usage Tracking
CREATE TABLE IF NOT EXISTS bedrock_usage (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE,
    user_sub VARCHAR(255) REFERENCES users(user_sub),
    model_id VARCHAR(100) NOT NULL,
    request_type VARCHAR(50), -- text-generation, embedding, image-analysis
    input_tokens INTEGER,
    output_tokens INTEGER,
    total_tokens INTEGER,
    cost DECIMAL(10,4),
    latency_ms INTEGER,
    request_metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================
-- DOCUMENT & FILE PROCESSING
-- =====================================

-- Document Storage
CREATE TABLE IF NOT EXISTS documents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE,
    uploaded_by VARCHAR(255) REFERENCES users(user_sub),
    filename VARCHAR(500) NOT NULL,
    original_filename VARCHAR(500),
    file_size BIGINT,
    mime_type VARCHAR(100),
    file_path TEXT, -- S3 path
    document_type VARCHAR(100), -- insurance-card, medical-record, etc.
    processing_status VARCHAR(50) DEFAULT 'pending', -- pending, processing, completed, failed
    processing_result JSONB DEFAULT '{}',
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================
-- AUTOMATION & ACTIONS TRACKING
-- =====================================

-- Automation Workflows
CREATE TABLE IF NOT EXISTS automation_workflows (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    workflow_type VARCHAR(100), -- insurance-processing, document-analysis
    trigger_conditions JSONB DEFAULT '{}',
    action_steps JSONB DEFAULT '[]',
    is_active BOOLEAN DEFAULT true,
    created_by VARCHAR(255) REFERENCES users(user_sub),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User Actions Log
CREATE TABLE IF NOT EXISTS user_actions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE,
    user_sub VARCHAR(255) REFERENCES users(user_sub),
    action_type VARCHAR(100) NOT NULL, -- login, document-upload, ai-chat, sso-login, etc.
    resource_type VARCHAR(100), -- document, conversation, workflow
    resource_id UUID,
    action_details JSONB DEFAULT '{}',
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================
-- INDEXES FOR PERFORMANCE
-- =====================================

-- Core indexes
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_provider ON users(provider);
CREATE INDEX IF NOT EXISTS idx_tenant_users_tenant ON tenant_users(tenant_id);
CREATE INDEX IF NOT EXISTS idx_tenant_users_user ON tenant_users(user_sub);

-- SSO indexes
CREATE INDEX IF NOT EXISTS idx_sso_configurations_tenant ON sso_configurations(tenant_id);
CREATE INDEX IF NOT EXISTS idx_sso_domains_domain ON sso_domains(domain);
CREATE INDEX IF NOT EXISTS idx_sso_sessions_token ON sso_sessions(session_token);
CREATE INDEX IF NOT EXISTS idx_sso_sessions_expires ON sso_sessions(expires_at);

-- AI/Bedrock indexes
CREATE INDEX IF NOT EXISTS idx_conversations_tenant ON ai_conversations(tenant_id);
CREATE INDEX IF NOT EXISTS idx_conversations_user ON ai_conversations(user_sub);
CREATE INDEX IF NOT EXISTS idx_chat_messages_conversation ON chat_messages(conversation_id);
CREATE INDEX IF NOT EXISTS idx_bedrock_usage_tenant ON bedrock_usage(tenant_id);
CREATE INDEX IF NOT EXISTS idx_bedrock_usage_date ON bedrock_usage(created_at);

-- Document indexes
CREATE INDEX IF NOT EXISTS idx_documents_tenant ON documents(tenant_id);
CREATE INDEX IF NOT EXISTS idx_documents_type ON documents(document_type);
CREATE INDEX IF NOT EXISTS idx_documents_status ON documents(processing_status);

-- Action logs indexes
CREATE INDEX IF NOT EXISTS idx_user_actions_tenant ON user_actions(tenant_id);
CREATE INDEX IF NOT EXISTS idx_user_actions_date ON user_actions(created_at);

-- =====================================
-- TRIGGERS FOR UPDATED_AT
-- =====================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply triggers to tables with updated_at columns
CREATE TRIGGER update_tenants_updated_at BEFORE UPDATE ON tenants FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_sso_configurations_updated_at BEFORE UPDATE ON sso_configurations FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_conversations_updated_at BEFORE UPDATE ON ai_conversations FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_documents_updated_at BEFORE UPDATE ON documents FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_workflows_updated_at BEFORE UPDATE ON automation_workflows FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =====================================
-- INITIAL DATA
-- =====================================

-- Insert a default tenant for testing
INSERT INTO tenants (id, name, plan, status) 
VALUES ('00000000-0000-0000-0000-000000000001', 'Blue Pine AI Demo', 'enterprise', 'active')
ON CONFLICT (id) DO NOTHING;

-- Success message
DO $$
BEGIN
    RAISE NOTICE 'Blue Pine AI database initialization completed successfully!';
    RAISE NOTICE 'Database includes: Core tables, SSO configuration, AI/Bedrock tracking, Document management';
    RAISE NOTICE 'Demo tenant created with ID: 00000000-0000-0000-0000-000000000001';
END $$; 