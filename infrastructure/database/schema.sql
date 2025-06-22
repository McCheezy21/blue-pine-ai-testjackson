-- Blue Pine AI - Comprehensive Database Schema
-- Designed for scalability, multi-tenancy, and future data needs

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

-- Users (Cognito + PointClickCare users)
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_sub VARCHAR(255) UNIQUE NOT NULL, -- Cognito sub or PCC user ID
    email VARCHAR(255) NOT NULL,
    given_name VARCHAR(100),
    family_name VARCHAR(100),
    provider VARCHAR(50) DEFAULT 'cognito', -- cognito, pointclickcare
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
-- API DATA STORAGE
-- =====================================

-- API Integration Logs
CREATE TABLE IF NOT EXISTS api_integrations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE,
    integration_type VARCHAR(100) NOT NULL, -- pointclickcare, external-api
    endpoint VARCHAR(500),
    method VARCHAR(10),
    request_headers JSONB,
    request_body JSONB,
    response_status INTEGER,
    response_headers JSONB,
    response_body JSONB,
    response_time_ms INTEGER,
    success BOOLEAN DEFAULT false,
    error_message TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- PointClickCare Data Cache
CREATE TABLE IF NOT EXISTS pcc_data_cache (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE,
    user_sub VARCHAR(255) REFERENCES users(user_sub),
    data_type VARCHAR(100), -- user-profile, facilities, residents, etc.
    pcc_id VARCHAR(255),
    data_payload JSONB NOT NULL,
    expires_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(tenant_id, data_type, pcc_id)
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

-- Automation Executions
CREATE TABLE IF NOT EXISTS automation_executions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workflow_id UUID REFERENCES automation_workflows(id) ON DELETE CASCADE,
    tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE,
    triggered_by VARCHAR(255) REFERENCES users(user_sub),
    status VARCHAR(50) DEFAULT 'pending', -- pending, running, completed, failed
    input_data JSONB DEFAULT '{}',
    output_data JSONB DEFAULT '{}',
    error_message TEXT,
    execution_time_ms INTEGER,
    started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    completed_at TIMESTAMP WITH TIME ZONE
);

-- User Actions Log
CREATE TABLE IF NOT EXISTS user_actions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE,
    user_sub VARCHAR(255) REFERENCES users(user_sub),
    action_type VARCHAR(100) NOT NULL, -- login, document-upload, ai-chat, etc.
    resource_type VARCHAR(100), -- document, conversation, workflow
    resource_id UUID,
    action_details JSONB DEFAULT '{}',
    ip_address INET,
    user_agent TEXT,
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
    file_path TEXT, -- S3 path or local path
    document_type VARCHAR(100), -- insurance-card, medical-record, etc.
    processing_status VARCHAR(50) DEFAULT 'pending', -- pending, processing, completed, failed
    extracted_data JSONB DEFAULT '{}',
    ai_analysis JSONB DEFAULT '{}',
    confidence_score DECIMAL(3,2),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insurance Card Processing
CREATE TABLE IF NOT EXISTS insurance_cards (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    document_id UUID REFERENCES documents(id) ON DELETE CASCADE,
    tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE,
    member_name VARCHAR(255),
    member_id VARCHAR(100),
    group_number VARCHAR(100),
    insurance_company VARCHAR(255),
    plan_type VARCHAR(100),
    effective_date DATE,
    expiration_date DATE,
    extracted_data JSONB DEFAULT '{}',
    verification_status VARCHAR(50) DEFAULT 'pending',
    processed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================
-- MACHINE LEARNING & ANALYTICS
-- =====================================

-- ML Model Training Sessions
CREATE TABLE IF NOT EXISTS ml_training_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE,
    model_name VARCHAR(255) NOT NULL,
    model_version VARCHAR(50),
    training_type VARCHAR(100), -- classification, regression, nlp
    dataset_info JSONB DEFAULT '{}',
    hyperparameters JSONB DEFAULT '{}',
    metrics JSONB DEFAULT '{}', -- accuracy, loss, etc.
    model_path TEXT, -- Where model is stored
    status VARCHAR(50) DEFAULT 'training', -- training, completed, failed
    started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    completed_at TIMESTAMP WITH TIME ZONE
);

-- ML Predictions/Inferences
CREATE TABLE IF NOT EXISTS ml_predictions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE,
    model_id UUID REFERENCES ml_training_sessions(id),
    input_data JSONB NOT NULL,
    prediction_result JSONB NOT NULL,
    confidence_score DECIMAL(5,4),
    processing_time_ms INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================
-- BILLING & USAGE ANALYTICS
-- =====================================

-- Usage Analytics
CREATE TABLE IF NOT EXISTS usage_analytics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE,
    user_sub VARCHAR(255) REFERENCES users(user_sub),
    service_type VARCHAR(100), -- bedrock, automation, document-processing
    usage_type VARCHAR(100), -- api-call, tokens-used, storage-gb
    quantity DECIMAL(10,4),
    unit VARCHAR(50), -- tokens, requests, gb
    cost DECIMAL(10,4) DEFAULT 0.00,
    metadata JSONB DEFAULT '{}',
    recorded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================
-- SYSTEM & AUDIT LOGS
-- =====================================

-- System Events
CREATE TABLE IF NOT EXISTS system_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_type VARCHAR(100) NOT NULL, -- error, warning, info
    service VARCHAR(100), -- backend, python-services, frontend
    message TEXT NOT NULL,
    details JSONB DEFAULT '{}',
    severity VARCHAR(20) DEFAULT 'info', -- critical, error, warning, info
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================
-- INDEXES FOR PERFORMANCE
-- =====================================

-- Authentication & Users
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_provider ON users(provider);
CREATE INDEX IF NOT EXISTS idx_tenant_users_tenant ON tenant_users(tenant_id);
CREATE INDEX IF NOT EXISTS idx_tenant_users_user ON tenant_users(user_sub);

-- AI & Conversations
CREATE INDEX IF NOT EXISTS idx_conversations_tenant ON ai_conversations(tenant_id);
CREATE INDEX IF NOT EXISTS idx_conversations_user ON ai_conversations(user_sub);
CREATE INDEX IF NOT EXISTS idx_chat_messages_conversation ON chat_messages(conversation_id);
CREATE INDEX IF NOT EXISTS idx_bedrock_usage_tenant ON bedrock_usage(tenant_id);
CREATE INDEX IF NOT EXISTS idx_bedrock_usage_date ON bedrock_usage(created_at);

-- Documents & Processing
CREATE INDEX IF NOT EXISTS idx_documents_tenant ON documents(tenant_id);
CREATE INDEX IF NOT EXISTS idx_documents_type ON documents(document_type);
CREATE INDEX IF NOT EXISTS idx_documents_status ON documents(processing_status);

-- Automation
CREATE INDEX IF NOT EXISTS idx_automation_executions_workflow ON automation_executions(workflow_id);
CREATE INDEX IF NOT EXISTS idx_automation_executions_status ON automation_executions(status);

-- Analytics & Logs
CREATE INDEX IF NOT EXISTS idx_user_actions_tenant ON user_actions(tenant_id);
CREATE INDEX IF NOT EXISTS idx_user_actions_date ON user_actions(created_at);
CREATE INDEX IF NOT EXISTS idx_usage_analytics_tenant ON usage_analytics(tenant_id);
CREATE INDEX IF NOT EXISTS idx_usage_analytics_date ON usage_analytics(recorded_at);

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
CREATE TRIGGER update_conversations_updated_at BEFORE UPDATE ON ai_conversations FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_documents_updated_at BEFORE UPDATE ON documents FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_workflows_updated_at BEFORE UPDATE ON automation_workflows FOR EACH ROW EXECUTE FUNCTION update_updated_at_column(); 