CREATE TABLE IF NOT EXISTS t_p66010521_tour_booking_landing.orders (
    id SERIAL PRIMARY KEY,
    order_id VARCHAR(50) UNIQUE NOT NULL,
    customer_name VARCHAR(255) NOT NULL,
    customer_email VARCHAR(255) NOT NULL,
    customer_phone VARCHAR(50) NOT NULL,
    notes TEXT,
    items JSONB NOT NULL,
    total_price DECIMAL(10, 2) NOT NULL,
    status VARCHAR(50) DEFAULT 'pending',
    payment_confirmed BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_orders_order_id ON t_p66010521_tour_booking_landing.orders(order_id);
CREATE INDEX idx_orders_status ON t_p66010521_tour_booking_landing.orders(status);
CREATE INDEX idx_orders_created_at ON t_p66010521_tour_booking_landing.orders(created_at);