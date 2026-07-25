CREATE TABLE IF NOT EXISTS activity_log (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_type VARCHAR(50) NOT NULL CHECK (event_type IN (
        'DRAFT_GENERATED',
        'DRAFT_EDITED',
        'REPLY_APPROVED',
        'REPLY_SENT',
        'GENERATION_FAILED'
    )),
    related_entity_type VARCHAR(255),
    related_entity_id UUID,
    actor_user_id UUID,
    timestamp TIMESTAMPTZ DEFAULT now(),
    detail_text TEXT,
    CONSTRAINT fk_activity_log_actor_user FOREIGN KEY (actor_user_id) REFERENCES users(id)
);
