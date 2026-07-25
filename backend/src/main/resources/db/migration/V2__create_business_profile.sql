CREATE TABLE IF NOT EXISTS business_profile (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    business_name VARCHAR(255) NOT NULL,
    description TEXT,
    tone VARCHAR(50) NOT NULL CHECK (tone IN ('WARM_FRIENDLY', 'FORMAL_PROFESSIONAL', 'DIRECT_EFFICIENT')),
    faq_context TEXT,
    updated_at TIMESTAMPTZ DEFAULT now()
);
