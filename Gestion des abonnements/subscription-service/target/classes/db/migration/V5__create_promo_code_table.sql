CREATE TABLE IF NOT EXISTS promo_code (
    id bigint PRIMARY KEY AUTO_INCREMENT,
    code varchar(50) UNIQUE NOT NULL,
    discount_percent double NOT NULL,
    max_uses int NOT NULL DEFAULT 1,
    current_uses int NOT NULL DEFAULT 0,
    expiry_date date NOT NULL,
    active bit NOT NULL DEFAULT 1,
    created_at datetime
);

CREATE INDEX idx_promo_code_code ON promo_code(code);
CREATE INDEX idx_promo_code_active ON promo_code(active);
