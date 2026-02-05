-- Create Database
CREATE DATABASE IF NOT EXISTS trade_tracker;
USE trade_tracker;

-- Create Trades Table
CREATE TABLE IF NOT EXISTS trades (
    id INT AUTO_INCREMENT PRIMARY KEY,
    symbol VARCHAR(20) NOT NULL,
    entry_price DECIMAL(10, 2) NOT NULL,
    exit_price DECIMAL(10, 2) NOT NULL,
    quantity DECIMAL(10, 2) NOT NULL,
    trade_type ENUM('long', 'short') NOT NULL,
    pnl DECIMAL(10, 2) NOT NULL,
    date DATE NOT NULL,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_date (date),
    INDEX idx_symbol (symbol)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Sample Data (Optional)
INSERT INTO trades (symbol, entry_price, exit_price, quantity, trade_type, pnl, date, notes) VALUES
('AAPL', 150.00, 155.00, 10, 'long', 50.00, '2026-02-01', 'Good momentum trade'),
('TSLA', 200.00, 195.00, 5, 'long', -25.00, '2026-02-02', 'Stopped out'),
('EURUSD', 1.1000, 1.1050, 1000, 'long', 50.00, '2026-02-03', 'Forex scalp');
