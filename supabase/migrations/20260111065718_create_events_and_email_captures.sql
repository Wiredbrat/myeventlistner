/*
  # Sydney Events Platform Schema

  ## Overview
  Creates tables for storing scraped event data and email captures for ticket redirects.

  ## New Tables
  
  ### `events`
  Stores all scraped event information from Sydney event websites
  - `id` (uuid, primary key) - Unique identifier
  - `title` (text) - Event name
  - `description` (text) - Event description
  - `event_date` (timestamptz) - When the event occurs
  - `event_end_date` (timestamptz, nullable) - End date for multi-day events
  - `venue` (text) - Event location/venue name
  - `address` (text, nullable) - Full address
  - `image_url` (text, nullable) - Event image
  - `original_url` (text) - Link to original event page
  - `ticket_url` (text, nullable) - Direct ticket purchase link
  - `price` (text, nullable) - Price information
  - `category` (text, nullable) - Event category (music, sports, arts, etc)
  - `source` (text) - Which website it was scraped from
  - `is_active` (boolean) - Whether event is still active
  - `created_at` (timestamptz) - When record was created
  - `updated_at` (timestamptz) - Last update time
  
  ### `email_captures`
  Stores emails collected when users click "GET TICKETS"
  - `id` (uuid, primary key) - Unique identifier
  - `email` (text) - User email address
  - `event_id` (uuid, foreign key) - Which event they're interested in
  - `created_at` (timestamptz) - When email was captured
  
  ## Security
  - Enable RLS on both tables
  - Events table: Public read access for displaying events
  - Email captures table: Public insert only (for opt-in), admin read access
*/

-- Create events table
CREATE TABLE IF NOT EXISTS events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text NOT NULL DEFAULT '',
  event_date timestamptz NOT NULL,
  event_end_date timestamptz,
  venue text NOT NULL DEFAULT '',
  address text,
  image_url text,
  original_url text NOT NULL,
  ticket_url text,
  price text,
  category text,
  source text NOT NULL DEFAULT 'manual',
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create email captures table
CREATE TABLE IF NOT EXISTS email_captures (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text NOT NULL,
  event_id uuid NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now()
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_events_event_date ON events(event_date);
CREATE INDEX IF NOT EXISTS idx_events_category ON events(category);
CREATE INDEX IF NOT EXISTS idx_events_is_active ON events(is_active);
CREATE INDEX IF NOT EXISTS idx_events_source ON events(source);
CREATE INDEX IF NOT EXISTS idx_email_captures_event_id ON email_captures(event_id);

-- Enable Row Level Security
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE email_captures ENABLE ROW LEVEL SECURITY;

-- RLS Policies for events table
-- Anyone can view active events
CREATE POLICY "Public can view active events"
  ON events
  FOR SELECT
  USING (is_active = true);

-- RLS Policies for email_captures table
-- Anyone can insert their email (for opt-in)
CREATE POLICY "Public can insert email captures"
  ON email_captures
  FOR INSERT
  WITH CHECK (true);

-- Function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for events table
DROP TRIGGER IF EXISTS update_events_updated_at ON events;
CREATE TRIGGER update_events_updated_at
  BEFORE UPDATE ON events
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();