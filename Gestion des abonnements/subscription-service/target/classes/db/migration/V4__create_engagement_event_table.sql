CREATE TABLE IF NOT EXISTS engagement_event (
    id bigint PRIMARY KEY AUTO_INCREMENT,
    user_id bigint NOT NULL,
    event_type varchar(60) NOT NULL,
    created_at datetime NOT NULL
);

CREATE INDEX idx_engagement_event_user_id ON engagement_event(user_id);
CREATE INDEX idx_engagement_event_created_at ON engagement_event(created_at);
CREATE INDEX idx_engagement_event_type ON engagement_event(event_type);
