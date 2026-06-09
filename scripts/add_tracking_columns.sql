-- Add tracking columns to orders table
ALTER TABLE public.orders 
ADD COLUMN tracking_number text,
ADD COLUMN shipping_provider text; -- e.g., 'Paxi', 'Uber Connect', 'Internal Driver'

-- Notify user to run this
SELECT 'Columns added successfully' as result;
