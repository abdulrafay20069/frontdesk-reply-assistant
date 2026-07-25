CREATE TABLE IF NOT EXISTS inquiries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_name VARCHAR(255) NOT NULL,
    customer_email VARCHAR(255) NOT NULL,
    channel VARCHAR(50) NOT NULL CHECK (channel IN ('EMAIL', 'WEB_FORM', 'MANUAL')),
    message_text TEXT NOT NULL,
    received_at TIMESTAMPTZ DEFAULT now(),
    status VARCHAR(50) NOT NULL DEFAULT 'NEW' CHECK (status IN ('NEW', 'DRAFTED', 'APPROVED', 'SENT', 'FAILED'))
);
