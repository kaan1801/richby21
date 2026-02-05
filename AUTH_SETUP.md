# Authentication Setup Guide

## Upgrading to Multi-User Authentication

Your Trade Tracker now supports multiple users with authentication! Follow these steps to upgrade your existing database.

### Option 1: Fresh Install (Recommended for New Users)

If you're setting up for the first time or don't have existing data you need to keep:

1. **Drop the old database and create a new one:**

```sql
DROP DATABASE IF EXISTS trade_tracker;
```

2. **Import the new schema:**

In phpMyAdmin, go to **SQL** tab and run the entire `setup_with_auth.sql` file, or copy-paste this:

```sql
CREATE DATABASE IF NOT EXISTS trade_tracker;
USE trade_tracker;

-- Create Users Table
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_username (username),
    INDEX idx_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Update Trades Table to include user_id
CREATE TABLE IF NOT EXISTS trades (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    symbol VARCHAR(20) NOT NULL,
    entry_price DECIMAL(10, 2) NOT NULL,
    exit_price DECIMAL(10, 2) NOT NULL,
    quantity DECIMAL(10, 2) NOT NULL,
    trade_type ENUM('long', 'short') NOT NULL,
    pnl DECIMAL(10, 2) NOT NULL,
    date DATE NOT NULL,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user_id (user_id),
    INDEX idx_date (date),
    INDEX idx_symbol (symbol)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

### Option 2: Keep Existing Data (Migration)

If you have existing trades you want to keep:

1. **First, create a default user account:**

```sql
USE trade_tracker;

-- Create users table
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_username (username),
    INDEX idx_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Add a default user (password: "password123")
-- CHANGE THIS PASSWORD AFTER FIRST LOGIN!
INSERT INTO users (username, email, password) 
VALUES ('admin', 'admin@example.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi');
```

2. **Add user_id column to trades table:**

```sql
-- Backup your trades first!
ALTER TABLE trades ADD COLUMN user_id INT NOT NULL DEFAULT 1;

-- Add foreign key
ALTER TABLE trades ADD FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;

-- Add index
ALTER TABLE trades ADD INDEX idx_user_id (user_id);
```

3. **Login with:**
   - Username: `admin`
   - Password: `password123`

4. **IMPORTANT:** Change your password immediately after first login!

## New Features

✅ **User Registration** - Create individual accounts  
✅ **Secure Login** - Password hashing with bcrypt  
✅ **User-Specific Trades** - Each user only sees their own trades  
✅ **Session Management** - Stay logged in across page refreshes  
✅ **Logout Functionality** - Secure session termination  

## Using the App

1. **First Time:**
   - Click "Register here" 
   - Create your account
   - You'll be automatically logged in

2. **Returning Users:**
   - Enter your username and password
   - Click "Login"

3. **Adding Trades:**
   - Same as before! All trades are automatically linked to your account

4. **Logging Out:**
   - Click the "Logout" button in the top right corner

## Security Notes

🔒 **Passwords are hashed** using PHP's `password_hash()` with bcrypt  
🔒 **Session-based authentication** with HTTP-only cookies  
🔒 **SQL injection protection** via prepared statements  
🔒 **User isolation** - Users can only access their own trades  

## For Production Deployment

When deploying to a live server:

1. **Use HTTPS** - Always use SSL/TLS for production
2. **Change database credentials** in `api/database.php`
3. **Set secure session settings** in PHP configuration
4. **Use environment variables** for sensitive data
5. **Enable CORS properly** for your domain
6. **Regular backups** of your database

## Troubleshooting

**Problem:** "Unauthorized. Please login" error  
**Solution:** Clear your browser cookies and login again

**Problem:** Can't register - "Username already exists"  
**Solution:** Choose a different username

**Problem:** Existing trades disappeared  
**Solution:** Make sure you migrated properly with Option 2 above

**Problem:** Session expires too quickly  
**Solution:** Increase session timeout in PHP settings

## File Changes

New files added:
- `api/auth.php` - Authentication endpoint
- `api/setup_with_auth.sql` - Updated database schema
- `src/components/Login.jsx` - Login page
- `src/components/Register.jsx` - Registration page

Modified files:
- `api/trades.php` - Now checks authentication and filters by user
- `src/App.jsx` - Added auth state management

---

**Need help?** Check the browser console (F12) for detailed error messages.
