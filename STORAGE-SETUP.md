# Supabase Storage Setup for Image Uploads

## Step 1: Create Storage Bucket

1. Go to your Supabase dashboard: https://supabase.com/dashboard/project/nisymachekdtlcnicmzq
2. Click **Storage** in the left sidebar
3. Click **"New bucket"**
4. Fill in:
   - **Name**: `images`
   - **Public bucket**: ✅ Check this (so images can be accessed)
5. Click **"Create bucket"**

## Step 2: Set Up Storage Policies

1. Click on the `images` bucket you just created
2. Go to **"Policies"** tab
3. Click **"New Policy"**

### Policy 1: Allow Uploads
- **Policy name**: "Allow authenticated uploads"
- **Allowed operation**: INSERT
- **Policy definition**:
```sql
(uid() = auth.uid())
```

### Policy 2: Allow Reads (Public Access)
- **Policy name**: "Public read access"
- **Allowed operation**: SELECT
- **Policy definition**:
```sql
true
```

### Policy 3: Allow Updates
- **Policy name**: "Allow authenticated updates"
- **Allowed operation**: UPDATE
- **Policy definition**:
```sql
(uid() = auth.uid())
```

### Policy 4: Allow Deletes
- **Policy name**: "Allow authenticated deletes"
- **Allowed operation**: DELETE
- **Policy definition**:
```sql
(uid() = auth.uid())
```

## Step 3: Test Image Upload

After setting up:
1. Go to Students page
2. Add/Edit a student
3. Click "Take Photo" or "Choose Photo"
4. Select an image
5. It will upload automatically!

## Free Tier Limits

- **1 GB** storage (free tier)
- **2 GB** bandwidth/month
- Perfect for student photos!

## Troubleshooting

**"Storage bucket not found" error:**
- Make sure you created the bucket named exactly `images`
- Make sure it's set to public

**"Permission denied" error:**
- Check that all policies are set up correctly
- Make sure you're logged in as admin

**Images not showing:**
- Check bucket is set to "Public"
- Check the URL is correct in the database

---

**That's it!** Image uploads will now work from mobile and desktop! 📸

