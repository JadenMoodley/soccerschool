# Booking Calendar Setup Guide

## ✅ What's Been Added

A complete booking calendar system for scheduling future training sessions!

## 🚀 Quick Setup

### Step 1: Update Database Schema

1. Go to your Supabase dashboard: https://supabase.com/dashboard/project/nisymachekdtlcnicmzq
2. Click **SQL Editor** → **New Query**
3. Copy and paste this SQL:

```sql
-- Bookings table (for future scheduled training sessions)
CREATE TABLE IF NOT EXISTS bookings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id UUID REFERENCES students(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  training_plan TEXT,
  notes TEXT,
  status TEXT DEFAULT 'scheduled', -- scheduled, completed, cancelled
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;

-- Create policy
CREATE POLICY "Allow all for authenticated users" ON bookings
  FOR ALL USING (auth.role() = 'authenticated');

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_bookings_student_id ON bookings(student_id);
CREATE INDEX IF NOT EXISTS idx_bookings_date ON bookings(date);
CREATE INDEX IF NOT EXISTS idx_bookings_status ON bookings(status);
```

4. Click **Run**

### Step 2: Restart Your App

If your app is running:
1. Stop it (Ctrl+C)
2. Run: `npm run dev`

### Step 3: Use the Booking System!

1. Click **"Bookings"** in the navigation
2. You'll see a calendar view
3. Click any day to add a booking
4. Fill in student, date, time, etc.
5. Save!

## 📅 Features

### Calendar View
- Monthly calendar showing all bookings
- Color-coded by status
- Click any day to add booking
- Navigate months with arrows

### List View
- See all bookings chronologically
- Quick status updates
- Easy editing and deletion

### Status Management
- **Scheduled**: Upcoming sessions
- **Completed**: Finished sessions  
- **Cancelled**: Cancelled sessions

### Today's Summary
- See all today's bookings at a glance
- Helps with daily planning

## 💡 How to Use

1. **Schedule a Session**:
   - Go to Bookings tab
   - Click "New Booking" or click a day
   - Select student, date, start/end time
   - Add training plan (optional)
   - Save!

2. **View Calendar**:
   - See all bookings in monthly view
   - Navigate between months
   - Click bookings to edit

3. **Manage Bookings**:
   - Mark as "Completed" when session is done
   - Cancel if needed
   - Edit details anytime
   - Delete if necessary

## 🎯 Benefits

- ✅ **Plan ahead**: Schedule weeks/months in advance
- ✅ **No conflicts**: See all bookings at once
- ✅ **Easy tracking**: Know who's coming when
- ✅ **Mobile friendly**: Works great on phones
- ✅ **Status tracking**: Keep track of what's done

## 📱 Mobile Optimized

- Responsive calendar
- Touch-friendly
- Easy date/time selection
- Quick status updates
- Bottom navigation includes Bookings

---

**The booking system is ready to use!** 🎉

Just update your database schema and you're good to go!

