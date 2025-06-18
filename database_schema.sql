
-- California Cannabis POS System Database Schema
-- This schema includes all tables for products, customers, employees, orders, and dispensaries

-- Enable UUID extension for PostgreSQL (remove if using SQLite/MySQL)
-- CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Products table
CREATE TABLE products (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL,
    stock_quantity INTEGER NOT NULL DEFAULT 0,
    category VARCHAR(100),
    strain_type VARCHAR(50),
    thc_content DECIMAL(5, 2),
    cbd_content DECIMAL(5, 2),
    image_url TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Customers table
CREATE TABLE customers (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(255),
    phone VARCHAR(20),
    date_of_birth DATE,
    license_number VARCHAR(50),
    address TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Employees table
CREATE TABLE employees (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    role VARCHAR(50) NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Dispensaries table
CREATE TABLE dispensaries (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name VARCHAR(255) NOT NULL,
    address TEXT NOT NULL,
    city VARCHAR(100) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    hours VARCHAR(255) NOT NULL,
    license VARCHAR(100) NOT NULL,
    status VARCHAR(20) NOT NULL CHECK (status IN ('Active', 'Pending', 'Closed')),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Orders table
CREATE TABLE orders (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    customer_id INTEGER,
    employee_id INTEGER,
    total_amount DECIMAL(10, 2) NOT NULL,
    payment_method VARCHAR(50) NOT NULL,
    payment_status VARCHAR(50) NOT NULL,
    stripe_payment_id VARCHAR(255),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (customer_id) REFERENCES customers(id),
    FOREIGN KEY (employee_id) REFERENCES employees(id)
);

-- Order Items table
CREATE TABLE order_items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    order_id INTEGER NOT NULL,
    product_id INTEGER NOT NULL,
    quantity INTEGER NOT NULL,
    unit_price DECIMAL(10, 2) NOT NULL,
    total_price DECIMAL(10, 2) NOT NULL,
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id)
);

-- Weedmaps Products table (for integration)
CREATE TABLE weedmaps_products (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    weedmaps_id VARCHAR(255),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    published BOOLEAN DEFAULT FALSE,
    external_id VARCHAR(255),
    picture TEXT,
    featured BOOLEAN DEFAULT FALSE,
    category VARCHAR(100),
    tags TEXT,
    strain VARCHAR(100),
    genetics VARCHAR(100),
    gallery_images TEXT,
    cbd_percentage DECIMAL(5, 2),
    thc_percentage DECIMAL(5, 2),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Inventory Transactions table (for tracking stock changes)
CREATE TABLE inventory_transactions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    product_id INTEGER NOT NULL,
    transaction_type VARCHAR(20) NOT NULL CHECK (transaction_type IN ('sale', 'restock', 'adjustment')),
    quantity_change INTEGER NOT NULL,
    reason VARCHAR(255),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (product_id) REFERENCES products(id)
);

-- Indexes for better performance
CREATE INDEX idx_products_category ON products(category);
CREATE INDEX idx_products_stock ON products(stock_quantity);
CREATE INDEX idx_customers_email ON customers(email);
CREATE INDEX idx_employees_email ON employees(email);
CREATE INDEX idx_orders_customer ON orders(customer_id);
CREATE INDEX idx_orders_date ON orders(created_at);
CREATE INDEX idx_order_items_order ON order_items(order_id);
CREATE INDEX idx_order_items_product ON order_items(product_id);
CREATE INDEX idx_dispensaries_status ON dispensaries(status);
CREATE INDEX idx_dispensaries_city ON dispensaries(city);

-- Sample data for dispensaries
INSERT INTO dispensaries (name, address, city, phone, hours, license, status) VALUES
('Green Valley Dispensary', '123 Main St', 'Los Angeles', '(555) 123-4567', 'Mon-Sun 9AM-9PM', 'CA-DCC-001', 'Active'),
('California Cannabis Co.', '456 Oak Ave', 'San Francisco', '(555) 234-5678', 'Mon-Sat 10AM-8PM', 'CA-DCC-002', 'Active'),
('Golden State Green', '789 Pine Rd', 'San Diego', '(555) 345-6789', 'Daily 8AM-10PM', 'CA-DCC-003', 'Pending'),
('Bay Area Botanicals', '321 Elm St', 'Oakland', '(555) 456-7890', 'Mon-Sun 9AM-9PM', 'CA-DCC-004', 'Active'),
('SoCal Cannabis', '654 Maple Dr', 'Long Beach', '(555) 567-8901', 'Mon-Fri 10AM-7PM, Sat-Sun 11AM-6PM', 'CA-DCC-005', 'Closed');

-- Sample data for products
INSERT INTO products (name, description, price, stock_quantity, category, strain_type, thc_content, cbd_content) VALUES
('Blue Dream', 'Hybrid strain with balanced effects', 45.00, 25, 'Flower', 'Hybrid', 18.5, 0.8),
('OG Kush', 'Classic indica-dominant strain', 50.00, 15, 'Flower', 'Indica', 22.0, 0.5),
('Sour Diesel', 'Energizing sativa strain', 48.00, 20, 'Flower', 'Sativa', 20.0, 0.3),
('CBD Gummies', 'Low-dose CBD edibles', 25.00, 50, 'Edibles', NULL, 2.0, 10.0),
('THC Chocolate Bar', 'Premium cannabis chocolate', 35.00, 30, 'Edibles', NULL, 10.0, 1.0);

-- Triggers for updating timestamps (SQLite syntax)
-- For PostgreSQL, you would use different syntax

-- Update trigger for products
CREATE TRIGGER update_products_timestamp 
    AFTER UPDATE ON products
    FOR EACH ROW
BEGIN
    UPDATE products SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
END;

-- Update trigger for customers
CREATE TRIGGER update_customers_timestamp 
    AFTER UPDATE ON customers
    FOR EACH ROW
BEGIN
    UPDATE customers SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
END;

-- Update trigger for employees
CREATE TRIGGER update_employees_timestamp 
    AFTER UPDATE ON employees
    FOR EACH ROW
BEGIN
    UPDATE employees SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
END;

-- Update trigger for dispensaries
CREATE TRIGGER update_dispensaries_timestamp 
    AFTER UPDATE ON dispensaries
    FOR EACH ROW
BEGIN
    UPDATE dispensaries SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
END;

