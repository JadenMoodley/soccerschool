# Quick Setup Guide

## Step 1: Database Setup ✅

Your Supabase credentials are already configured in `.env`

## Step 2: Create Database Tables

1. Go to your Supabase dashboard: https://supabase.com/dashboard/project/nisymachekdtlcnicmzq
2. Click on **SQL Editor** in the left sidebar
3. Click **New Query**
4. Copy the entire contents of `supabase-schema.sql` file
5. Paste it into the SQL editor
6. Click **Run** (or press Ctrl+Enter)

This will create:
- `students` table
- `sessions` table  
- `training_plans` table (with default plans)
- `finances` table
- All necessary indexes and security policies

## Step 3: Create Admin User

1. In Supabase dashboard, go to **Authentication** → **Users**
2. Click **Add user** → **Create new user**
3. Enter:
   - **Email**: Your admin email (e.g., admin@soccerschool.com)
   - **Password**: Create a strong password
   - **Auto Confirm User**: ✅ Check this box
4. Click **Create user**

**Save these credentials!** You'll use them to login to the app.

## Step 4: Install Dependencies

```bash
npm install
```

## Step 5: Run the App

```bash
npm run dev
```

The app will open at `http://localhost:5173`

## Step 6: Login

1. Open the app in your browser
2. Use the email and password you created in Step 3
3. You're in! 🎉

## Troubleshooting

### "Failed to load students" error
- Make sure you ran the SQL schema (Step 2)
- Check that tables were created in Supabase → Table Editor

### "Invalid login credentials"
- Make sure you created the user in Authentication → Users
- Check that "Auto Confirm User" was checked when creating the user

### Can't see data
- Make sure Row Level Security policies were created (they're in the SQL schema)
- Check Supabase → Authentication → Policies

## Next Steps

Once everything is working:
1. Add your first student
2. Create a training session
3. Set up finance records
4. Deploy to production (see README-WEB.md)

