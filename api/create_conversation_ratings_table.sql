-- Create conversation_ratings table for simplified rating system
CREATE TABLE IF NOT EXISTS conversation_ratings (
    id SERIAL PRIMARY KEY,
    conversation_id VARCHAR(255) NOT NULL,
    tenant_id VARCHAR(255) NOT NULL,
    user_id VARCHAR(255) NOT NULL,
    overall_rating INTEGER NOT NULL CHECK (overall_rating >= 1 AND overall_rating <= 5),
    feedback_text TEXT,
    conversation_length INTEGER,
    conversation_duration_seconds INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_conversation_ratings_tenant ON conversation_ratings (tenant_id);
CREATE INDEX IF NOT EXISTS idx_conversation_ratings_user ON conversation_ratings (user_id);
CREATE INDEX IF NOT EXISTS idx_conversation_ratings_conversation ON conversation_ratings (conversation_id);
CREATE INDEX IF NOT EXISTS idx_conversation_ratings_created ON conversation_ratings (created_at);

-- Add some sample data for testing
INSERT INTO conversation_ratings (
    conversation_id, 
    tenant_id, 
    user_id, 
    overall_rating, 
    feedback_text, 
    conversation_length, 
    conversation_duration_seconds
) VALUES 
(
    'conv_sample_1', 
    'bluepineai-test-tenant', 
    '89d9d94e-b0b1-70de-9762-12c8c6c47434', 
    5, 
    'Great AI assistant, very helpful!', 
    3, 
    120
),
(
    'conv_sample_2', 
    'bluepineai-test-tenant', 
    '89d9d94e-b0b1-70de-9762-12c8c6c47434', 
    4, 
    'Good responses, could be faster', 
    5, 
    180
); 