-- SQL script to update existing users to admin status
-- Run this directly in your database

-- Update specific users by email to admin status
UPDATE users 
SET is_admin = true 
WHERE email IN ('test@example.com', '221b467@juetguna.ing');

-- Verify the changes
SELECT id, email, name, is_admin, created_at 
FROM users 
WHERE email IN ('test@example.com', '221b467@juetguna.ing');

-- Alternative: Update all users to admin (use with caution)
-- UPDATE users SET is_admin = true;
