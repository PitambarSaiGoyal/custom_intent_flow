-- ============================================================
-- Database Triggers for Real-Time Event Processing
-- Listens to both ui_events and website_event tables
-- ============================================================

-- Function for ui_events table
CREATE OR REPLACE FUNCTION notify_ui_event_insert()
RETURNS trigger AS $$
BEGIN
  -- Notify channel "new_event" with table name and row data
  PERFORM pg_notify('new_event', json_build_object(
    'table', 'ui_events',
    'data', row_to_json(NEW)
  )::text);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Function for website_event table
CREATE OR REPLACE FUNCTION notify_website_event_insert()
RETURNS trigger AS $$
BEGIN
  -- Notify channel "new_event" with table name and row data
  PERFORM pg_notify('new_event', json_build_object(
    'table', 'website_event',
    'data', row_to_json(NEW)
  )::text);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for ui_events table
DROP TRIGGER IF EXISTS ui_events_insert_trigger ON public.ui_events;
CREATE TRIGGER ui_events_insert_trigger
AFTER INSERT ON public.ui_events
FOR EACH ROW
EXECUTE FUNCTION notify_ui_event_insert();

-- Trigger for website_event table
DROP TRIGGER IF EXISTS website_event_insert_trigger ON public.website_event;
CREATE TRIGGER website_event_insert_trigger
AFTER INSERT ON public.website_event
FOR EACH ROW
EXECUTE FUNCTION notify_website_event_insert();

-- Verification
DO $$
BEGIN
  RAISE NOTICE 'Triggers created successfully:';
  RAISE NOTICE '  - ui_events_insert_trigger on public.ui_events';
  RAISE NOTICE '  - website_event_insert_trigger on public.website_event';
END $$;
