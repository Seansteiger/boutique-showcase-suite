-- Add unique constraint to anonymous_id to allow UPSERT
ALTER TABLE carts
ADD CONSTRAINT carts_anonymous_id_key UNIQUE (anonymous_id);
