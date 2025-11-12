# Quick Start - Your Supabase is Ready! 🚀

## ✅ Step 1: Create .env file

Create a file named `.env` in the root directory with:

```env
VITE_SUPABASE_URL=https://nisymachekdtlcnicmzq.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5pc3ltYWNoZWtkdGxjbmljbXpxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI5NDg3NjcsImV4cCI6MjA3ODUyNDc2N30.tfHyPCFdy1VeQFgVsVrxdNJz1XdWesTqeMx2eaRSvHk
```

## ✅ Step 2: Set Up Database

1. Go to: https://supabase.com/dashboard/project/nisymachekdtlcnicmzq
2. Click **SQL Editor** (left sidebar)
3. Click **New Query**
4. Open the file `supabase-schema.sql` in this project
5. Copy ALL the SQL code
6. Paste into Supabase SQL Editor
7. Click **Run** (or press Ctrl+Enter)

This creates all your tables and default training plans!

## ✅ Step 3: Create Admin User

1. In Supabase dashboard → **Authentication** → **Users**
2. Click **Add user** → **Create new user**
3. Fill in:
   - **Email**: (your admin email)
   - **Password**: (create a password)
   - ✅ **Auto Confirm User** (IMPORTANT - check this!)
4. Click **Create user**

**Save these login credentials!**

## ✅ Step 4: Install & Run

```bash
npm install
npm run dev
```

Open http://localhost:5173 and login with your admin credentials!

## 🎉 You're Done!

The app is now ready to use. You can:
- Add students
- Track sessions
- Manage training plans
- Track finances
- Access from any device via web browser

## Need Help?

- Check `SETUP-GUIDE.md` for detailed instructions
- Check `README-WEB.md` for deployment info

