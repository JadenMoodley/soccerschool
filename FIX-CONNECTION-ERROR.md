# 🔧 Fix: "Failed to fetch (api.supabase.com)"

## ⚠️ The Problem

You're getting this error because:
1. You're running `npm start` (Expo) instead of `npm run dev` (Vite)
2. The dev server needs to be restarted to load `.env` variables

## ✅ Quick Fix

### Step 1: Stop Current Server
Press `Ctrl+C` in your terminal to stop the current server

### Step 2: Run the Correct Command
```bash
npm run dev
```

**NOT** `npm start` (that's for Expo mobile apps)

### Step 3: Check the Output
You should see:
```
✅ Supabase URL configured: https://nisymachekdtlcnicmzq.supabase.co
  VITE v5.x.x  ready in xxx ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
```

### Step 4: Open Browser
Go to: http://localhost:5173

## 🔍 If Still Not Working

### Check 1: Supabase Project Status
1. Go to: https://supabase.com/dashboard/project/nisymachekdtlcnicmzq
2. If you see "Project paused" → Click **"Restore project"**
3. Free tier projects pause after 7 days of inactivity

### Check 2: Verify .env File
Make sure `.env` is in the root directory (same folder as `package.json`)

Content should be:
```env
VITE_SUPABASE_URL=https://nisymachekdtlcnicmzq.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5pc3ltYWNoZWtkdGxjbmljbXpxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI5NDg3NjcsImV4cCI6MjA3ODUyNDc2N30.tfHyPCFdy1VeQFgVsVrxdNJz1XdWesTqeMx2eaRSvHk
```

### Check 3: Network Connection
- Make sure you have internet
- Try accessing: https://nisymachekdtlcnicmzq.supabase.co
- Check browser console (F12) for detailed errors

## 📝 Commands Summary

**For Web App (Vite):**
```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run preview  # Preview production build
```

**For Mobile App (Expo) - NOT NEEDED:**
```bash
npm start        # Expo (don't use this for web app)
```

## 🎯 Most Likely Solution

**Just run: `npm run dev` instead of `npm start`**

The error happens because:
- `npm start` → Runs Expo (mobile app framework)
- `npm run dev` → Runs Vite (web app framework) ✅

---

**After running `npm run dev`, the connection should work!** 🚀

