CREATE TABLE IF NOT EXISTS replies (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    inquiry_id UUID NOT NULL,
    draft_text TEXT,
    ai_model_used VARCHAR(255),
    generated_at TIMESTAMPTZ,
    last_edited_by_user_id UUID,
    approved_at TIMESTAMPTZ,
    approved_by_user_id UUID,
    sent_at TIMESTAMPTZ,
    CONSTRAINT fk_replies_inquiry FOREIGN KEY (inquiry_id) REFERENCES inquiries(id),
    CONSTRAINT fk_replies_last_edited_by_user FOREIGN KEY (last_edited_by_user_id) REFERENCES users(id),
    CONSTRAINT fk_replies_approved_by_user FOREIGN KEY (approved_by_user_id) REFERENCES users(id)
);
