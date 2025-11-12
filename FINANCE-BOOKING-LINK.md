# Finance-Booking Integration Guide

## ✅ What's Been Linked

The finance and booking systems are now fully integrated! Here's what changed:

### 1. **Automatic Syncing**
- When a booking is **paid** → Updates finance `hours_paid`
- When a booking is **completed** → Updates finance `hours_used`
- When booking payment status changes → Finance records update automatically

### 2. **Finance Page Enhancements**
- **Sync Button**: Manually sync all bookings to finance records
- **Per-Student Sync**: Sync individual student bookings
- **Booking Stats**: See linked booking information on each finance card:
  - Total bookings
  - Completed bookings
  - Paid/Unpaid count
  - Total paid from bookings
  - Outstanding amounts
- **Quick Link**: Click calendar icon to view all bookings

### 3. **Booking Page Integration**
- When you mark a booking as **completed**, it automatically:
  - Calculates hours from start/end time
  - Updates finance `hours_used`
- When you mark payment as **paid**, it automatically:
  - Updates finance `hours_paid`
  - Calculates revenue

## 🔄 How Syncing Works

### Automatic Sync
Happens when:
- Booking payment status changes to "paid" or "partial"
- Booking status changes to "completed"
- Booking is saved with payment information

### Manual Sync
1. **Sync All**: Click "Sync Bookings" button on Finance page
   - Syncs all students' bookings to their finance records
   
2. **Sync Individual**: Click refresh icon on a finance card
   - Syncs only that student's bookings

## 📊 What Gets Synced

### From Bookings → Finance:
- **Hours Used**: Calculated from completed bookings (end_time - start_time)
- **Hours Paid**: Calculated from paid bookings based on payment amounts
- **Hourly Rate**: Extracted from booking payment calculations
- **Revenue**: Sum of all paid booking amounts

### Finance Records:
- **Hours Paid**: Total hours purchased/paid for
- **Hours Used**: Total hours consumed from completed sessions
- **Hourly Rate**: Rate per hour
- **Remaining Hours**: Hours paid - Hours used

## 🎯 Usage Examples

### Example 1: New Booking with Payment
1. Create booking for Student A
2. Set hourly rate: R200
3. Set time: 2 hours (10:00 - 12:00)
4. Amount due: R400 (auto-calculated)
5. Mark payment as "Paid", enter R400
6. **Result**: Finance record updates:
   - Hours Paid: +2 hours
   - Revenue: +R400

### Example 2: Complete a Booking
1. Mark booking as "Completed"
2. **Result**: Finance record updates:
   - Hours Used: +2 hours
   - Remaining Hours: -2 hours

### Example 3: Manual Sync
1. Go to Finance page
2. Click "Sync Bookings"
3. **Result**: All finance records update based on all bookings

## 💡 Best Practices

1. **Create Bookings First**: Set up bookings with payment info
2. **Use Manual Sync**: If you've been using bookings separately, sync once to update all finance records
3. **Check Booking Stats**: View linked booking info on finance cards
4. **Mark Complete**: Always mark bookings as "completed" when done
5. **Update Payments**: Change payment status when payment is received

## 🔍 Viewing Linked Data

### On Finance Page:
- See booking stats on each finance card
- Click calendar icon to view all bookings
- Click refresh icon to sync that student's bookings

### On Bookings Page:
- Payment status shows on calendar
- Payment amounts shown in booking details
- Completed bookings automatically update finance

## ⚠️ Important Notes

1. **Hours Calculation**: Based on booking start/end times
2. **Payment Tracking**: Only paid/partial bookings count toward hours_paid
3. **Completion Tracking**: Only completed bookings count toward hours_used
4. **Manual Override**: You can still manually edit finance records
5. **Sync is Additive**: Syncing adds to existing values (doesn't replace)

---

**Everything is now linked and synced!** 🎉

