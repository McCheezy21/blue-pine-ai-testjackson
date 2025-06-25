-- SSO Configuration Tables for Blue Pine AI
-- Run this after your main schema

-- SSO Configurations per organization
CREATE TABLE IF NOT EXISTS sso_configurations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL, -- References organizations table
    provider VARCHAR(50) NOT NULL, -- 'azure-ad', 'google-workspace', 'okta', 'saml'
    
    -- OIDC/OAuth2 fields
    client_id VARCHAR(255),
    client_secret TEXT, -- encrypted
    authority_url VARCHAR(500), -- e.g., https://login.microsoftonline.com/tenant-id
    
    -- SAML fields  
    saml_entity_id VARCHAR(255),
    saml_sso_url VARCHAR(500),
    saml_certificate TEXT,
    
    -- Configuration options
    auto_provision BOOLEAN DEFAULT true,
    default_role VARCHAR(50) DEFAULT 'member',
    domain_hint VARCHAR(100), -- e.g., 'acme-corp.com' for Azure AD
    
    -- Status
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    UNIQUE(organization_id, provider)
);

-- Email domains that trigger SSO
CREATE TABLE IF NOT EXISTS sso_domains (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    sso_config_id UUID REFERENCES sso_configurations(id) ON DELETE CASCADE,
    domain VARCHAR(100) NOT NULL, -- e.g., 'acme-corp.com'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(domain)
);

-- SSO user sessions and mapping
CREATE TABLE IF NOT EXISTS sso_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    sso_config_id UUID REFERENCES sso_configurations(id),
    user_id UUID, -- Links to your users table
    external_user_id VARCHAR(255), -- SSO provider's user ID
    session_token TEXT, -- Our JWT token
    provider_tokens JSONB, -- Store access/refresh tokens from provider
    expires_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_sso_domains_domain ON sso_domains(domain);
CREATE INDEX IF NOT EXISTS idx_sso_configs_org ON sso_configurations(organization_id);
CREATE INDEX IF NOT EXISTS idx_sso_sessions_user ON sso_sessions(user_id);

-- Insert sample SSO configuration for testing
INSERT INTO sso_configurations (
    organization_id, 
    provider, 
    client_id, 
    authority_url, 
    domain_hint,
    auto_provision,
    default_role
) VALUES (
    gen_random_uuid(), -- You'll replace this with actual org ID
    'azure-ad',
    'your-azure-client-id',
    'https://login.microsoftonline.com/your-tenant-id',
    'bluepineai.com',
    true,
    'member'
) ON CONFLICT DO NOTHING;

-- Sample domain mapping
INSERT INTO sso_domains (sso_config_id, domain)
SELECT id, 'bluepineai.com' 
FROM sso_configurations 
WHERE provider = 'azure-ad' 
ON CONFLICT DO NOTHING; 