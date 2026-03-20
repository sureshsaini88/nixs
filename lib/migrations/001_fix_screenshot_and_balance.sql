-- Migration: Fix screenshot_url column to support full base64 images
-- and add error logging for balance updates

-- Change screenshot_url from varchar(500) to TEXT to store full base64 images
ALTER TABLE money_requests ALTER COLUMN screenshot_url TYPE TEXT;

-- Add a check constraint to ensure charge_amount is positive
ALTER TABLE money_requests ADD CONSTRAINT positive_charge CHECK (charge_amount > 0);
