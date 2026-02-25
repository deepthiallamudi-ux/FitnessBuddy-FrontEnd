# Progress Shares Table - Row Level Security Policies

If you're getting an error when sharing progress with buddies, run these SQL commands in your Supabase SQL Editor to create the necessary RLS policies.

## Run this SQL in Supabase Dashboard → SQL Editor:

```sql
-- Enable RLS on progress_shares table
ALTER TABLE progress_shares ENABLE ROW LEVEL SECURITY;

-- Policy for inserting progress shares (users can share their own progress)
CREATE POLICY "Users can insert their own progress shares"
ON progress_shares FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = sharer_id);

-- Policy for selecting progress shares (users can view shares sent to them or made by them)
CREATE POLICY "Users can view progress shares sent to them or made by them"
ON progress_shares FOR SELECT
TO authenticated
USING (auth.uid() = receiver_id OR auth.uid() = sharer_id);

-- Policy for updating progress shares (users can only update their own shares)
CREATE POLICY "Users can update their own progress shares"
ON progress_shares FOR UPDATE
TO authenticated
USING (auth.uid() = sharer_id)
WITH CHECK (auth.uid() = sharer_id);

-- Policy for deleting progress shares (users can only delete their own shares or shares sent to them)
CREATE POLICY "Users can delete their own progress shares"
ON progress_shares FOR DELETE
TO authenticated
USING (auth.uid() = sharer_id OR auth.uid() = receiver_id);
```

## Steps:
1. Go to Supabase Dashboard
2. Select your project
3. Go to SQL Editor (left sidebar)
4. Click "New Query"
5. Paste the SQL above
6. Click "Run"
7. You should see "Success" message

Once these policies are in place, the "Share Progress" feature will work without errors!

## What these policies do:
- **INSERT**: Users can only share their own progress
- **SELECT**: Users can see progress they shared or progress shared with them
- **UPDATE**: Users can only update their own shares
- **DELETE**: Users can remove their own shares or shares sent to them

These match the buddy connection policies and ensure secure, private sharing between buddies.
