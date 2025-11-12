# Booking System - Calendar Feature 📅

## Overview

A complete booking calendar system that allows you to schedule and track future training sessions for students.

## Features

### 📅 Calendar View
- **Monthly calendar** with all bookings visible
- **Color-coded** by status:
  - 🔵 Blue = Scheduled
  - 🟢 Green = Completed
  - 🔴 Red = Cancelled
- **Click any day** to add a new booking
- **Click a booking** to edit it
- **Navigate months** with arrow buttons
- **Today indicator** - highlights current date

### 📋 List View
- Switch between calendar and list view
- See all bookings in chronological order
- Filter by status
- Quick actions for each booking

### ✨ Key Features

1. **Schedule Future Sessions**
   - Select student
   - Choose date and time (start & end)
   - Add training plan (optional)
   - Add notes

2. **Status Management**
   - **Scheduled**: Upcoming sessions
   - **Completed**: Finished sessions
   - **Cancelled**: Cancelled sessions
   - Quick status change buttons

3. **Today's Bookings Summary**
   - See all bookings for today at a glance
   - Helps with daily planning

4. **Easy Planning**
   - See all bookings in calendar format
   - Plan weeks/months ahead
   - Avoid double-booking
   - Track student attendance

## How to Use

### Adding a Booking

1. Go to **Bookings** tab
2. Click **"New Booking"** or click on a day in the calendar
3. Fill in:
   - Student (required)
   - Date (required)
   - Start Time (required)
   - End Time (required)
   - Training Plan (optional)
   - Notes (optional)
4. Click **"Save Booking"**

### Managing Bookings

- **Edit**: Click the edit icon on any booking
- **Complete**: Click "Complete" button (marks as done)
- **Cancel**: Click "Cancel" button (marks as cancelled)
- **Delete**: Click delete icon (removes permanently)

### Calendar Navigation

- **Previous Month**: Click left arrow
- **Next Month**: Click right arrow
- **Go to Today**: Click "Go to Today" link
- **View Mode**: Toggle between Calendar and List view

## Database Setup

**Important:** You need to run the updated SQL schema in Supabase:

1. Go to Supabase SQL Editor
2. Copy the new `bookings` table section from `supabase-schema.sql`
3. Run it to create the bookings table

The schema includes:
- `bookings` table with all necessary fields
- Indexes for fast queries
- Row Level Security policies

## Mobile Optimized

- ✅ Responsive calendar (stacks on mobile)
- ✅ Touch-friendly buttons
- ✅ Easy date selection
- ✅ Quick status updates
- ✅ Works perfectly on phones and tablets

## Benefits

1. **Better Planning**: See all scheduled sessions at a glance
2. **No Double-Booking**: Calendar shows conflicts visually
3. **Time Management**: Plan your week/month efficiently
4. **Student Tracking**: See which students are coming when
5. **Status Tracking**: Know what's scheduled, completed, or cancelled

## Integration with Sessions

- Bookings are for **future** scheduled sessions
- Sessions are for **completed** training records
- You can mark a booking as "completed" when the session is done
- This helps separate planning from record-keeping

---

**The booking system is now live!** 🎉

Use it to schedule all your future training sessions and plan your soccer school efficiently.

