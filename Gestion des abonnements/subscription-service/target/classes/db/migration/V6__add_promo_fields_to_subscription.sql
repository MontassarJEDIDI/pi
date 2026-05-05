ALTER TABLE subscription
    ADD COLUMN promo_code_used varchar(50),
    ADD COLUMN discounted_monthly_price double;

CREATE INDEX idx_subscription_promo_code_used ON subscription(promo_code_used);
