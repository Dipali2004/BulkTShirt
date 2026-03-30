CREATE TABLE IF NOT EXISTS products (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price_more_than9 DECIMAL(10, 2) NOT NULL,
    price_less_than9 DECIMAL(10, 2) NOT NULL,
    size VARCHAR(50),
    color VARCHAR(50),
    material VARCHAR(255),
    image_url VARCHAR(500),
    stock_quantity INT DEFAULT 0
);

INSERT IGNORE INTO products (name, description, price_more_than9, price_less_than9, size, color, material, image_url, stock_quantity) VALUES 
('Classic White Tee', 'Premium 180 GSM 100% Cotton Plain White T-Shirt', 150.00, 180.00, 'L', 'White', 'Cotton', 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800', 500),
('Classic Black Tee', 'Premium 180 GSM 100% Cotton Plain Black T-Shirt', 150.00, 180.00, 'M', 'Black', 'Cotton', 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=800', 450),
('Navy Blue Tee', 'Premium 180 GSM 100% Cotton Plain Navy Blue T-Shirt', 160.00, 190.00, 'XL', 'Navy', 'Cotton', 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=800', 300);
