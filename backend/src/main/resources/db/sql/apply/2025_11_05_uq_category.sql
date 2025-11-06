-- Create a unique index on normalized name per user
ALTER TABLE category ADD CONSTRAINT uk_category_name UNIQUE (name);