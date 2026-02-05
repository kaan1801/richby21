# Quick Start Guide - Trade Tracker

## TL;DR - Get Running in 5 Minutes

### 1. Install Dependencies
```bash
npm install
```

### 2. Set Up Database
```bash
# Start MySQL/MariaDB first, then:
mysql -u root -p < api/setup.sql
# Or use phpMyAdmin to import api/setup.sql
```

### 3. Configure Database (if needed)
Edit `api/database.php` - update username/password if not using defaults

### 4. Start Backend (Terminal 1)
```bash
cd api
php -S localhost:8000
```

### 5. Start Frontend (Terminal 2 - New Window)
```bash
npm run dev
```

### 6. Open Browser
Navigate to: `http://localhost:5173`

---

## What Each File Does

**Main Application:**
- `src/App.jsx` - Main app logic, handles data flow
- `src/main.jsx` - React entry point
- `index.html` - HTML wrapper

**Components:**
- `src/components/TradeForm.jsx` - Add new trades
- `src/components/TradeList.jsx` - Display trade history  
- `src/components/Statistics.jsx` - Show win rate, P&L, etc.

**Backend:**
- `api/trades.php` - Main API (GET/POST/DELETE trades)
- `api/database.php` - Database connection
- `api/setup.sql` - Database schema

**Configuration:**
- `vite.config.js` - Frontend build tool config
- `tailwind.config.js` - Styling framework config
- `package.json` - Dependencies list

---

## Common Commands

```bash
# Install dependencies
npm install

# Start frontend dev server
npm run dev

# Build for production
npm run build

# Start PHP backend
cd api && php -S localhost:8000
```

---

## File Locations Summary

- **Frontend Code:** `/src`
- **Components:** `/src/components`
- **Backend API:** `/api`
- **Database Setup:** `/api/setup.sql`
- **Main Entry:** `/index.html` and `/src/main.jsx`
- **Styles:** `/src/index.css` (uses Tailwind)

---

## Default Ports

- **Frontend:** http://localhost:5173
- **Backend:** http://localhost:8000
- **Database:** localhost:3306 (MySQL default)

---

## Need Help?

1. Check both terminal windows for error messages
2. Open browser console (F12) for frontend errors
3. Review `README.md` for detailed instructions
4. Verify MySQL/MariaDB is running
5. Ensure both servers (frontend + backend) are running

---

**You're all set! Start tracking your trades! 🚀**
