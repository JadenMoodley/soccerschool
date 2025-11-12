# Soccer School App - Features

## Core Features

### 1. PIN Authentication
- Default PIN: **2005**
- Changeable PIN in Settings
- Secure access to the app
- No login page needed (single admin user)

### 2. Student Management
- Add, edit, and delete students
- Add student photos (camera or gallery)
- Track student information:
  - Name (required)
  - Age
  - Phone number
  - Email
  - Payment status (Paid/Unpaid)
- View detailed student profile with:
  - Session history
  - Statistics (total sessions, average rating, weeks active)
  - Finance information
  - Progress tracking

### 3. Session/Training Tracking
- Record training sessions for each student
- Track session details:
  - Date (with automatic week number calculation)
  - Student selection
  - Training plan used
  - Rating (1-5 stars)
  - Notes
  - Things to work on (multiple items)
- **12-week minimum tracking**: Automatic week number calculation from session date
- View all sessions in chronological order
- Edit and delete sessions

### 4. Training Plans
- Pre-loaded default plans:
  - **Ball Work**: Dribbling Drills, Ball Control, First Touch, Passing Accuracy
  - **Shooting**: Finishing, Power Shots, Placement, Volleys
  - **Defending**: Tackling, Positioning, Interceptions, Clearances
  - **Fitness**: Sprints, Endurance, Agility, Strength
- Create custom training plans
- Add multiple drills to each plan
- Edit and delete plans
- All plans are editable and customizable

### 5. Payment Status
- Track payment status per student (Paid/Unpaid)
- Visual indicators for payment status
- Filter and view by payment status

### 6. Finance Tracking
- Track hours paid vs hours used per student
- Set hourly rate and hourly cost
- Automatic calculations:
  - Revenue = Hours Paid × Hourly Rate
  - Cost = Hours Used × Hourly Cost
  - Profit = Revenue - Cost
  - Remaining Hours = Hours Paid - Hours Used
- Summary dashboard showing:
  - Total hours paid across all students
  - Total hours used
  - Total revenue
  - Total profit
  - Remaining hours

**Example Usage:**
- Student 1: 250 hours paid, 6 hours used → Track remaining 244 hours
- Student 2: 200 hours paid, 5 hours used → Track remaining 195 hours
- Profit calculation based on hourly rates and costs

### 7. Notes & Ratings
- Add detailed notes to each session
- Rate sessions from 1-5 stars
- Track things to work on (multiple items per session)
- All notes and ratings are editable

### 8. Additional Features

#### Student Detail View
- Comprehensive student profile
- Session history with all details
- Statistics dashboard
- Finance overview
- Progress tracking

#### Statistics Dashboard
- Total students count
- Total sessions count
- Average ratings
- Weeks active tracking

#### Settings
- Change PIN
- View app statistics
- Logout functionality

## Data Storage

- All data stored locally on device using AsyncStorage
- No cloud sync required
- Data persists between app sessions
- One admin user (no multi-user support needed)

## User Interface

- Modern, clean design with green theme (soccer field colors)
- Tailwind CSS styling via NativeWind
- Intuitive navigation with bottom tabs
- Easy-to-use modals for data entry
- Responsive and touch-friendly

## Navigation

- **Students Tab**: View and manage all students
- **Sessions Tab**: View and manage all training sessions
- **Training Tab**: Manage training plans and drills
- **Finance Tab**: Track finances and payments
- **Settings Tab**: App settings and PIN management

## Week Tracking

Sessions automatically calculate week numbers based on the session date. The app tracks:
- Current week number from the first session
- Minimum 12-week tracking capability
- Visual week indicators on session cards

