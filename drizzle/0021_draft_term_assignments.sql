-- Draft terms may be prepared before teachers and weekly schedules are assigned.
-- Existing deferred triggers still enforce these relationships for all other statuses.
CREATE OR REPLACE FUNCTION "ensure_term_has_teacher_and_schedule"() RETURNS trigger AS $$
DECLARE
  checked_term_id uuid;
BEGIN
  IF TG_TABLE_NAME = 'terms' THEN
    IF TG_OP = 'DELETE' THEN
      checked_term_id := OLD.id;
    ELSE
      checked_term_id := NEW.id;
    END IF;
  ELSE
    IF TG_OP = 'DELETE' THEN
      checked_term_id := OLD.term_id;
    ELSE
      checked_term_id := NEW.term_id;
    END IF;
  END IF;
  IF EXISTS (SELECT 1 FROM terms WHERE id = checked_term_id AND status <> 'draft') THEN
    IF NOT EXISTS (SELECT 1 FROM term_teachers WHERE term_id = checked_term_id) THEN
      RAISE EXCEPTION 'A term must have at least one teacher' USING ERRCODE = '23514';
    END IF;
    IF NOT EXISTS (SELECT 1 FROM term_schedules WHERE term_id = checked_term_id) THEN
      RAISE EXCEPTION 'A term must have at least one weekly schedule' USING ERRCODE = '23514';
    END IF;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;
