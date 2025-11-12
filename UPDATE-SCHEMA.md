# Database Schema Update Required

## ⚠️ Important: Update Your Database

You need to update your `bookings` table to add payment tracking fields.

## Step 1: Run This SQL in Supabase

Go to your Supabase SQL Editor and run:

```sql
-- Add payment fields to bookings table
ALTER TABLE bookings 
ADD COLUMN IF NOT EXISTS payment_status TEXT DEFAULT 'unpaid',
ADD COLUMN IF NOT EXISTS amount_paid NUMERIC DEFAULT 0,
ADD COLUMN IF NOT EXISTS amount_due NUMERIC DEFAULT 0;

-- Update existing bookings to have default values
UPDATE bookings 
SET 
  payment_status = COALESCE(payment_status, 'unpaid'),
  amount_paid = COALESCE(amount_paid, 0),
  amount_due = COALESCE(amount_due, 0)
WHERE payment_status IS NULL OR amount_paid IS NULL OR amount_due IS NULL;
```

## Step 2: Verify the Update

Run this to check:

```sql
SELECT column_name, data_type, column_default
FROM information_schema.columns
WHERE table_name = 'bookings'
ORDER BY ordinal_position;
```

You should see:
- `payment_status` (text, default 'unpaid')
- `amount_paid` (numeric, default 0)
- `amount_due` (numeric, default 0)

## That's It!

After running this SQL, the new payment features will work! 🎉

