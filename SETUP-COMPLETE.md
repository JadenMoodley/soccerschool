# Setup Complete! 🎉

## Important: About Passwords

**You don't need a password for the Supabase project itself.** The password you need is for the **admin user** you'll create in Supabase Authentication.

## Quick Fix for the Error

The error you're seeing means Vite hasn't loaded the `.env` file yet. Here's what to do:

### 1. Make sure `.env` file exists
The file should be in the root directory (same folder as `package.json`)

### 2. **RESTART the dev server**
After creating/updating `.env`, you MUST restart:

1. Stop the current server (Ctrl+C if it's running)
2. Run: `npm run dev` (NOT `npm start` - that's for Expo)

### 3. The `.env` file should contain:
```
VITE_SUPABASE_URL=https://nisymachekdtlcnicmzq.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5pc3ltYWNoZWtkdGxjbmljbXpxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI5NDg3NjcsImV4cCI6MjA3ODUyNDc2N30.tfHyPCFdy1VeQFgVsVrxdNJz1XdWesTqeMx2eaRSvHk
```

## Complete Setup Checklist

- [x] `.env` file created with Supabase credentials
- [ ] Run SQL schema in Supabase (see `supabase-schema.sql`)
- [ ] Create admin user in Supabase Authentication
- [ ] Run `npm run dev` (restart if already running)
- [ ] Login with admin credentials

## Next Steps

1. **Set up database:**
   - Go to: https://supabase.com/dashboard/project/nisymachekdtlcnicmzq
   - SQL Editor → New Query
   - Copy/paste `supabase-schema.sql` → Run

2. **Create admin user:**
   - Authentication → Users → Add user
   - Enter email & password
   - ✅ Check "Auto Confirm User"
   - Save credentials!

3. **Run the app:**
   ```bash
   npm run dev
   ```

4. **Login:**
   - Open http://localhost:5173
   - Use the email/password you created

## Troubleshooting

**"Invalid supabaseUrl" error:**
- Make sure `.env` file exists in root directory
- Restart dev server: Stop (Ctrl+C) then `npm run dev`
- Check `.env` has no extra spaces or quotes

**"Failed to login" error:**
- Make sure you created the user in Supabase Authentication
- Check "Auto Confirm User" was checked when creating user

