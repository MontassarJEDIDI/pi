CREATE TABLE IF NOT EXISTS notification (
    id bigint PRIMARY KEY AUTO_INCREMENT,
    user_id bigint NOT NULL,
    title varchar(200) NOT NULL,
    message varchar(500) NOT NULL,
    type varchar(30),
    read_status bit NOT NULL DEFAULT 0,
    created_at datetime
);

CREATE INDEX idx_notification_user_id ON notification(user_id);
CREATE INDEX idx_notification_read_status ON notification(read_status);

CREATE TABLE IF NOT EXISTS subscription_audit (
    id bigint PRIMARY KEY AUTO_INCREMENT,
    user_id bigint NOT NULL,
    subscription_id bigint,
    action varchar(50) NOT NULL,
    details varchar(500),
    created_at datetime NOT NULL
);

CREATE INDEX idx_subscription_audit_user_id ON subscription_audit(user_id);
CREATE INDEX idx_subscription_audit_subscription_id ON subscription_audit(subscription_id);
