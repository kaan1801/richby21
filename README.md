# Trade Tracker Web Application

A professional trading journal application built with React (Vite), Tailwind CSS, and PHP backend. Track your trades, analyze performance, and monitor key statistics including win rate, P&L, and more.

## Features

- ✅ Log trades with entry/exit prices, quantity, and trade type (long/short)
- ✅ Automatic P&L calculation
- ✅ Real-time statistics dashboard
- ✅ Win rate tracking
- ✅ Average win/loss metrics
- ✅ Trade history with deletion capability
- ✅ Responsive design with modern UI
- ✅ Dark theme interface

## Technology Stack

**Frontend:**
- React 18
- Vite (build tool)
- Tailwind CSS (styling)
- JavaScript (ES6+)

**Backend:**
- PHP 7.4+
- MySQL/MariaDB
- PDO (database abstraction)

## Project Structure

```
trade-tracker/
├── api/                      # PHP Backend
│   ├── database.php          # Database connection class
│   ├── trades.php            # Main API endpoint (GET, POST, DELETE)
│   └── setup.sql             # Database schema and sample data
├── src/                      # React Frontend
│   ├── components/           
│   │   ├── TradeForm.jsx     # Form to add new trades
│   │   ├── TradeList.jsx     # Display trade history
│   │   └── Statistics.jsx    # Statistics dashboard
│   ├── App.jsx               # Main application component
│   ├── main.jsx              # React entry point
│   └── index.css             # Global styles with Tailwind
├── index.html                # HTML entry point
├── vite.config.js            # Vite configuration
├── tailwind.config.js        # Tailwind CSS configuration
├── postcss.config.js         # PostCSS configuration
├── package.json              # Node dependencies
└── README.md                 # This file
```

## Installation Guide

### Prerequisites

Before you begin, ensure you have the following installed:

1. **Node.js** (v18 or higher) - [Download here](https://nodejs.org/)
2. **PHP** (v7.4 or higher) - [Download here](https://www.php.net/downloads)
3. **MySQL or MariaDB** - [Download MySQL](https://dev.mysql.com/downloads/) or [MariaDB](https://mariadb.org/download/)
4. **Composer** (optional, for PHP dependencies) - [Download here](https://getcomposer.org/)

### Step 1: Install Frontend Dependencies

Open a terminal in the project root directory and run:

```bash
npm install
```

This will install all required Node.js packages including React, Vite, and Tailwind CSS.

### Step 2: Set Up the Database

1. **Start your MySQL/MariaDB server**

2. **Create the database and tables:**

   Open MySQL command line or phpMyAdmin and run:

   ```bash
   mysql -u root -p < api/setup.sql
   ```

   Or manually execute the SQL in `api/setup.sql`:
   - Creates `trade_tracker` database
   - Creates `trades` table
   - Inserts sample data (optional)

3. **Configure database connection:**

   Edit `api/database.php` and update the credentials if needed:

   ```php
   private $host = 'localhost';
   private $db_name = 'trade_tracker';
   private $username = 'root';      // Your MySQL username
   private $password = '';           // Your MySQL password
   ```

### Step 3: Start the PHP Backend Server

In a terminal, navigate to the `api` folder and start the PHP built-in server:

```bash
cd api
php -S localhost:8000
```

The PHP API will be running at `http://localhost:8000`

**Keep this terminal window open while using the app.**

### Step 4: Start the Frontend Development Server

In a **new terminal window**, navigate back to the project root and run:

```bash
npm run dev
```

The React app will start at `http://localhost:5173` (or another port if 5173 is busy).

**Keep this terminal window open while using the app.**

## Usage

1. **Open your browser** and navigate to `http://localhost:5173`

2. **Add a trade:**
   - Fill in the trade form with symbol, entry/exit prices, quantity, type (long/short), and date
   - Click "Add Trade"
   - The trade will be saved to the database and P&L calculated automatically

3. **View statistics:**
   - The right sidebar shows real-time statistics
   - Total trades, win rate, total P&L, average win/loss

4. **Manage trades:**
   - View all trades in the history table
   - Delete trades by clicking the "Delete" button

## API Endpoints

**Base URL:** `http://localhost:8000`

### GET /trades.php
Fetch all trades

**Response:**
```json
{
  "success": true,
  "trades": [...]
}
```

### POST /trades.php
Add a new trade

**Request Body:**
```json
{
  "symbol": "AAPL",
  "entryPrice": "150.00",
  "exitPrice": "155.00",
  "quantity": "10",
  "tradeType": "long",
  "pnl": "50.00",
  "date": "2026-02-05",
  "notes": "Good trade"
}
```

### DELETE /trades.php
Delete a trade

**Request Body:**
```json
{
  "id": 1
}
```

## Building for Production

To create a production build:

```bash
npm run build
```

The optimized files will be in the `dist/` folder. Deploy these files along with the `api/` folder to your web server.

## Troubleshooting

**Problem:** Frontend can't connect to backend
- **Solution:** Ensure PHP server is running on port 8000
- Check `vite.config.js` proxy settings

**Problem:** Database connection errors
- **Solution:** Verify MySQL is running and credentials in `api/database.php` are correct
- Ensure database `trade_tracker` exists

**Problem:** Port already in use
- **Solution:** Change the port in package.json or use `npm run dev -- --port 3000`

**Problem:** Trades not saving
- **Solution:** Check browser console for errors
- Verify PHP error logs
- Ensure database table exists

## Development Tips

- Frontend runs on `http://localhost:5173`
- Backend API runs on `http://localhost:8000`
- Both servers must be running simultaneously
- Auto-reload enabled for both frontend and backend changes
- Check browser console (F12) for frontend errors
- Check terminal for PHP errors

## Future Enhancements

- Trade editing functionality
- Export trades to CSV/Excel
- Advanced filtering and search
- Chart visualizations
- Multiple portfolios/accounts
- Risk/reward ratio tracking
- Trade tags and categories
- Performance analytics over time

## License

MIT License - Free to use and modify

## Support

For issues or questions, check the terminal output for error messages or review the browser console (F12).

---

**Happy Trading! 📈**
