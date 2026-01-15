-- Enable required extensions for cron jobs
CREATE EXTENSION IF NOT EXISTS pg_cron;
CREATE EXTENSION IF NOT EXISTS pg_net;

-- Schedule the course promotion to run every August 15 at midnight
SELECT cron.schedule(
  'promote-courses-august-15',
  '0 0 15 8 *', -- Every August 15 at midnight
  $$
  SELECT
    net.http_post(
        url:='https://bgjomfwapxxizhwqftzi.supabase.co/functions/v1/promote-courses',
        headers:='{"Content-Type": "application/json", "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJnam9tZndhcHh4aXpod3FmdHppIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE0MTY2ODksImV4cCI6MjA3Njk5MjY4OX0.Y-VuPZDRpEbv41GpIAz6oTJX6qUWsnslYqu_01f6v1A"}'::jsonb,
        body:='{"scheduled": true}'::jsonb
    ) as request_id;
  $$
);