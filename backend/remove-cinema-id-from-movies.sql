-- Remove cinema_id column from movies table since movies are now independent entities
ALTER TABLE movies DROP COLUMN cinema_id;
