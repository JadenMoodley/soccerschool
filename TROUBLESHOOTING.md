# Troubleshooting Guide

## Error: "Failed to fetch (api.supabase.com)"

This error usually means the app can't connect to Supabase. Here's how to fix it:

### ✅ Solution 1: Check .env File

1. **Make sure `.env` file exists** in the root directory (same folder as `package.json`)

2. **Check the file contents** - it should have:
```env
VITE_SUPABASE_URL=https://nisymachekdtlcnicmzq.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5pc3ltYWNoZWtkdGxjbmljbXpxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI5NDg3NjcsImV4cCI6MjA3ODUyNDc2N30.tfHyPCFdy1VeQFgVsVrxdNJz1XdWesTqeMx2eaRSvHk
```

3. **IMPORTANT: Restart the dev server** after creating/updating `.env`:
   - Stop the server (Ctrl+C)
   - Run: `npm run dev` (NOT `npm start`)

### ✅ Solution 2: Check Supabase Project Status

1. Go to: https://supabase.com/dashboard/project/nisymachekdtlcnicmzq
2. Check if the project is **paused** (free tier projects pause after inactivity)
3. If paused, click **"Restore project"** or **"Resume"**

### ✅ Solution 3: Check Network Connection

1. **Check internet connection**
2. **Try accessing Supabase dashboard** in browser
3. **Check firewall/antivirus** - might be blocking API calls
4. **Try different network** (mobile hotspot, etc.)

### ✅ Solution 4: Verify Supabase URL Format

The URL should be:
- ✅ Correct: `https://nisymachekdtlcnicmzq.supabase.co`
- ❌ Wrong: `https://nisymachekdtlcnicmzq.supabase.co/` (no trailing slash)
- ❌ Wrong: `http://nisymachekdtlcnicmzq.supabase.co` (must be https)

### ✅ Solution 5: Check Browser Console

1. Open browser DevTools (F12)
2. Go to **Console** tab
3. Look for specific error messages
4. Check **Network** tab for failed requests

### ✅ Solution 6: Clear Browser Cache

1. Clear browser cache and cookies
2. Try **incognito/private mode**
3. Try a different browser

### ✅ Solution 7: Check CORS Settings

If deploying, make sure:
1. Supabase project allows your domain
2. Go to: Supabase Dashboard → Settings → API
3. Check **Allowed Origins**

## Common Issues

### Issue: "Invalid supabaseUrl"
**Fix**: 
- Check `.env` file exists
- Restart dev server
- No quotes around values in `.env`

### Issue: "Network request failed"
**Fix**:
- Check internet connection
- Check Supabase project is active
- Try accessing Supabase dashboard

### Issue: "Failed to fetch"
**Fix**:
- Restart dev server after creating `.env`
- Check `.env` file is in root directory
- Verify Supabase project is not paused

### Issue: "401 Unauthorized"
**Fix**:
- Check API key is correct
- Make sure you're using the **anon key**, not service key
- Verify RLS policies are set up correctly

## Quick Checklist

- [ ] `.env` file exists in root directory
- [ ] `.env` has correct Supabase URL and key
- [ ] Dev server restarted after creating `.env`
- [ ] Supabase project is active (not paused)
- [ ] Internet connection is working
- [ ] Browser console checked for specific errors

## Still Not Working?

1. **Check Supabase Status**: https://status.supabase.com
2. **Verify credentials** in Supabase dashboard
3. **Try creating a new Supabase project** if needed
4. **Check browser console** for detailed error messages

---

**Most common fix**: Create `.env` file and restart dev server! 🔄

