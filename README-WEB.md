# Soccer School Web Application

A web-based admin portal for tracking soccer school students, training sessions, and finances. Built with React, Tailwind CSS, and Supabase.

## Features

- **Admin Login**: Secure authentication with Supabase
- **Student Management**: Add, edit, delete students with photos
- **Session Tracking**: Record training sessions with ratings, notes, and things to work on
- **Training Plans**: Manage training plans and drills
- **Finance Tracking**: Track hours paid vs used, calculate revenue and profit
- **Responsive Design**: Works on desktop, tablet, and mobile devices

## Setup Instructions

### 1. Create Supabase Project

1. Go to [supabase.com](https://supabase.com) and sign up (free)
2. Create a new project
3. Go to Settings → API
4. Copy your **Project URL** and **anon/public key**

### 2. Set Up Database

1. In Supabase, go to SQL Editor
2. Copy and paste the contents of `supabase-schema.sql`
3. Run the SQL script to create all tables

### 3. Create Admin User

1. In Supabase, go to Authentication → Users
2. Click "Add user" → "Create new user"
3. Enter your admin email and password
4. Save the credentials (you'll use these to login)

### 4. Configure Environment Variables

1. Create a `.env` file in the root directory:
```env
VITE_SUPABASE_URL=your_project_url_here
VITE_SUPABASE_ANON_KEY=your_anon_key_here
```

2. Replace with your actual Supabase credentials

### 5. Install Dependencies

```bash
npm install
```

### 6. Run Development Server

```bash
npm run dev
```

The app will be available at `http://localhost:5173`

### 7. Build for Production

```bash
npm run build
```

The built files will be in the `dist` folder, ready to deploy to any static hosting service.

## Deployment

### Option 1: Vercel (Recommended - Free)

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Import your GitHub repository
4. Add environment variables:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
5. Deploy!

### Option 2: Netlify (Free)

1. Push your code to GitHub
2. Go to [netlify.com](https://netlify.com)
3. Import your repository
4. Build command: `npm run build`
5. Publish directory: `dist`
6. Add environment variables in Site settings
7. Deploy!

### Option 3: Any Static Hosting

1. Run `npm run build`
2. Upload the `dist` folder to your hosting service
3. Make sure to set up environment variables if your host supports them

## Cost

- **Supabase**: Free tier includes:
  - 500 MB database
  - 2 GB bandwidth
  - 50,000 monthly active users
  - Perfect for a single admin application

- **Hosting**: Free options available:
  - Vercel (free)
  - Netlify (free)
  - GitHub Pages (free)
  - Or any static hosting service

**Total Cost: $0/month** (unless you exceed free tier limits)

## Security

- Row Level Security (RLS) is enabled on all tables
- Only authenticated users can access data
- All API calls go through Supabase's secure API
- Environment variables keep your keys safe

## Support

If you need help:
1. Check Supabase documentation: [supabase.com/docs](https://supabase.com/docs)
2. Check Vite documentation: [vitejs.dev](https://vitejs.dev)

