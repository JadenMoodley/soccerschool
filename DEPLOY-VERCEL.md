# Quick Deploy to Vercel (5 Minutes) ⚡

## Prerequisites
- GitHub account (free)
- Your code ready to push

## Step 1: Push to GitHub (2 minutes)

If you don't have a GitHub repo yet:

```bash
# In your project folder
git init
git add .
git commit -m "Soccer School App"
git branch -M main

# Create a new repo on github.com, then:
git remote add origin https://github.com/YOUR_USERNAME/soccer-school-app.git
git push -u origin main
```

**Or use GitHub Desktop** (easier):
1. Download GitHub Desktop
2. File → Add Local Repository
3. Publish repository

## Step 2: Deploy to Vercel (3 minutes)

1. **Go to [vercel.com](https://vercel.com)**
2. **Click "Sign Up"** → Use GitHub (easiest)
3. **Click "Add New Project"**
4. **Import your repository**:
   - Select your `soccer-school-app` repo
   - Click "Import"
5. **Configure** (usually auto-detected):
   - Framework Preset: Vite
   - Build Command: `npm run build`
   - Output Directory: `dist`
6. **Add Environment Variables**:
   - Click "Environment Variables"
   - Add these two:
     ```
     Name: VITE_SUPABASE_URL
     Value: https://nisymachekdtlcnicmzq.supabase.co
     
     Name: VITE_SUPABASE_ANON_KEY
     Value: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5pc3ltYWNoZWtkdGxjbmljbXpxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI5NDg3NjcsImV4cCI6MjA3ODUyNDc2N30.tfHyPCFdy1VeQFgVsVrxdNJz1XdWesTqeMx2eaRSvHk
     ```
7. **Click "Deploy"**
8. **Wait 1-2 minutes** ⏳
9. **Done!** 🎉 Your app is live!

## Your Live URL

You'll get a URL like:
- `soccer-school-app.vercel.app`
- Or `soccer-school-app-abc123.vercel.app`

**This is your live website!** Share it with anyone.

## Automatic Updates

Every time you push to GitHub:
- Vercel automatically rebuilds and deploys
- Your site updates automatically
- No manual steps needed!

## Custom Domain (Optional - Still Free)

If you have a domain name:

1. Go to Vercel project → Settings → Domains
2. Add your domain (e.g., `soccerschool.com`)
3. Follow DNS instructions
4. Free SSL automatically included!

## Cost: $0/month ✅

- Unlimited deployments
- Free SSL
- Free custom domain
- Global CDN
- Perfect for your app!

## Troubleshooting

**Build fails?**
- Make sure `package.json` has correct scripts
- Check that all dependencies are listed
- Look at build logs in Vercel dashboard

**Environment variables not working?**
- Make sure they start with `VITE_`
- Redeploy after adding variables
- Check they're added to Production environment

**App not loading?**
- Check Supabase is set up correctly
- Verify environment variables are correct
- Check browser console for errors

## Next Steps

1. ✅ Test your live site
2. ✅ Login with admin credentials
3. ✅ Add your first student
4. ✅ Share the URL!

**You're live! 🚀**

